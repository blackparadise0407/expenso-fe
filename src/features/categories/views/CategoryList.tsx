import { useCallback, useState } from 'react'
import { MdOutlineAdd } from 'react-icons/md'

import { Button } from '@/components/Button'
import { useCategoriesQuery } from '@/hooks/useCategoriesQuery'

import CategoryCardList from '../components/CategoryCardList/CategoryCardList'
import CategoryModal from '../components/CategoryModal/CategoryModal'

export default function CategoryList() {
  const [createCatModalOpen, setCreateCatModalOpen] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const categoriesQuery = useCategoriesQuery(true)

  const handleSelectCatIdForEdit = useCallback((id: string) => {
    setSelectedCategoryId(id)
  }, [])

  const handleCloseModal = () => {
    setCreateCatModalOpen(false)
    setSelectedCategoryId('')
  }

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
        <CategoryCardList
          categories={categoriesQuery.data}
          onEdit={handleSelectCatIdForEdit}
        />
      )}

      <CategoryModal
        open={createCatModalOpen || !!selectedCategoryId}
        category={categoriesQuery.data?.find(
          (it) => it.id === selectedCategoryId
        )}
        onClose={handleCloseModal}
      />
    </div>
  )
}
