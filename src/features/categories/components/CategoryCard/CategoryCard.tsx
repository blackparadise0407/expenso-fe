import dayjs from 'dayjs'
import { produce } from 'immer'
import { useState } from 'react'
import { MdDeleteOutline, MdOutlineEdit } from 'react-icons/md'

import { categoriesApi } from '@/apis/categories'
import { IconButton } from '@/components/IconButton'
import { useToast } from '@/contexts/ToastContext'
import { queryClient } from '@/queryClient'

interface CategoryCardProps {
  category: Category
  onEdit?: (id: string) => void
}

export default function CategoryCard({ category, onEdit }: CategoryCardProps) {
  const { enqueue } = useToast()
  const [deleting, setDeleting] = useState(false)

  const handleDeleteCategory = async (id: string) => {
    setDeleting(true)
    try {
      const { message } = await categoriesApi.delete({ id })
      queryClient.setQueryData<Category[]>(['categories'], (input) => {
        if (input) {
          return produce(input, (draft) => {
            const foundIdx = draft.findIndex((it) => it.id === id)
            if (foundIdx > -1) {
              draft.splice(foundIdx, 1)
            }
          })
        }
      })
      enqueue(message)
    } catch (e) {
      enqueue(e as string, { variant: 'error' })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex gap-5 items-center p-3 rounded-lg shadow">
      <img
        className="w-[35px] h-[35px] rounded-lg"
        src={category.imgUrl}
        alt=""
      />
      <div>
        <p className="font-medium text-gray-900">{category.name}</p>
        <p className="text-sm font-medium text-gray-400">
          Created on {dayjs(category.createdAt).format('MMM DD, YYYY')}
        </p>
      </div>

      {!!category.description && (
        <p className="text-xs font-medium text-gray-400 max-w-[50%]">
          {category.description}
        </p>
      )}
      <div className="flex-grow"></div>
      <div className="flex gap-2">
        <IconButton
          icon={<MdOutlineEdit className="text-blue-500" />}
          onClick={() => onEdit?.(category.id)}
        />
        <IconButton
          icon={<MdDeleteOutline className="text-red-500" />}
          loading={deleting}
          onClick={() => handleDeleteCategory(category.id)}
        />
      </div>
    </div>
  )
}
