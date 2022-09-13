import { memo } from 'react'

import CategoryCard from '../CategoryCard/CategoryCard'

interface CategoryCardListProps {
  categories: Category[]
}

export default memo(function CategoryCardList({
  categories,
}: CategoryCardListProps) {
  return (
    <div className="space-y-5">
      {categories.map((it) => (
        <CategoryCard key={it.id} category={it} />
      ))}
    </div>
  )
})
