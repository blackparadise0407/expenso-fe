import { memo } from 'react'

import CategoryCard from '../CategoryCard/CategoryCard'

interface CategoryCardListProps {
  categories: Category[]
  onEdit?: (catId: string) => void
}

export default memo(function CategoryCardList({
  categories,
  onEdit,
}: CategoryCardListProps) {
  return (
    <div className="space-y-5">
      {categories.map((it) => (
        <CategoryCard key={it.id} category={it} onEdit={onEdit} />
      ))}
    </div>
  )
})
