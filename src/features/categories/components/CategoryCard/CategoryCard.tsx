import dayjs from 'dayjs'
import { MdDeleteOutline, MdOutlineEdit } from 'react-icons/md'

import { IconButton } from '@/components/IconButton'

interface CategoryCardProps {
  category: Category
  onEdit?: (id: string) => void
}

export default function CategoryCard({ category, onEdit }: CategoryCardProps) {
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
        <IconButton icon={<MdDeleteOutline className="text-red-500" />} />
      </div>
    </div>
  )
}
