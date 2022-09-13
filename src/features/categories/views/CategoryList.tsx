import { useState } from 'react'
import { MdOutlineAdd } from 'react-icons/md'

import { Button } from '@/components/Button'
import { Modal } from '@/components/Modal'
import { TextArea } from '@/components/TextArea'
import { TextField } from '@/components/TextField'
import { useCategoriesQuery } from '@/hooks/useCategoriesQuery'

import CategoryCardList from '../components/CategoryCardList/CategoryCardList'

export default function CategoryList() {
  const [createCatModalOpen, setCreateCatModalOpen] = useState(false)
  const categoriesQuery = useCategoriesQuery(true)

  return (
    <div className="space-y-5">
      <div className="flex">
        <Button
          icon={<MdOutlineAdd />}
          onClick={() => setCreateCatModalOpen((prev) => !prev)}
        >
          Add category
        </Button>
      </div>
      {categoriesQuery.data && (
        <CategoryCardList categories={categoriesQuery.data} />
      )}
      <Modal
        title="Create new category"
        open={createCatModalOpen}
        onClose={() => setCreateCatModalOpen(false)}
      >
        <div className="grid grid-cols-2 gap-3">
          <div className="form-group col-span-1">
            <label htmlFor="name">Name</label>
            <TextField />
          </div>
          <div className="form-group col-span-1">
            <label htmlFor="imgUrl">Image url</label>
            <TextField />
          </div>
          <div className="form-group col-span-2">
            <label htmlFor="description">Description</label>
            <TextArea className="max-h-[100px]" />
          </div>
        </div>
      </Modal>
    </div>
  )
}
