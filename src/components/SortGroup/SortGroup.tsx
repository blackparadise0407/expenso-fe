import clsx from 'clsx'
import { useEffect } from 'react'
import { CgArrowUp } from 'react-icons/cg'
import { StringParam, useQueryParams } from 'use-query-params'

import { Select } from '../Select'
import { Option, SelectChangeFn } from '../Select/Select'

interface SortGroupProps {
  sorts: Option[]
  onChange?: (result: [string, string]) => void
}

export default function SortGroup({
  sorts,
  onChange = () => {},
}: SortGroupProps) {
  const [query, setQuery] = useQueryParams({
    orderBy: StringParam,
    order: StringParam,
  })

  const handleChangeSortDir = () => {
    if (!query.order) {
      setQuery(
        {
          order: 'asc',
        },
        'pushIn'
      )
      return
    }
    setQuery(
      {
        order: query.order === 'asc' ? 'desc' : 'asc',
      },
      'replaceIn'
    )
  }

  const handleSelectSortOptions: SelectChangeFn = (orderBy) => {
    setQuery(
      {
        orderBy: orderBy as string,
        order: query.order ?? 'desc',
      },
      'replaceIn'
    )
  }

  useEffect(() => {
    if (query.orderBy && query.order) {
      onChange([query.orderBy, query.order])
    }
  }, [query.order, query.orderBy])

  return (
    <div className="flex items-center gap-2">
      <p className="font-medium text-sm">Sort by: </p>
      <Select
        wrapperCls="max-w-[150px]"
        placeholder="Sort options"
        options={sorts}
        enableSearch={false}
        value={query.orderBy ?? undefined}
        onChange={handleSelectSortOptions}
      />
      <CgArrowUp
        className={clsx(
          'transition-shadow text-xl cursor-pointer select-none',
          !query.orderBy && 'pointer-events-none',
          query.order
            ? query.order === 'asc'
              ? 'text-blue-500'
              : 'text-blue-500 rotate-180'
            : 'text-gray-500'
        )}
        onClick={handleChangeSortDir}
      />
    </div>
  )
}
