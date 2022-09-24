import clsx from 'clsx'
import { memo } from 'react'
import { BsThreeDots } from 'react-icons/bs'
import { MdNavigateNext } from 'react-icons/md'

import { isNullOrUndefined } from '@/utils/utils'

import { Select } from '../Select'
import PaginationItem from './PaginationItem'
import { usePagination } from './usePagination'

export interface PageChangeFn {
  (page: number): void
}

export interface ShowSizeChangeFn {
  (pageSize: number): void
}

export interface PaginationProps {
  total: number
  siblingCount?: number
  currentPage?: number
  pageSize: number
  className?: string
  showSizeChanger?: boolean
  onShowSizeChange?: ShowSizeChangeFn
  pageSizeOptions?: string[]
  onPageChange?: PageChangeFn
}

export default memo(function Pagination({
  total,
  className,
  siblingCount = 1,
  currentPage = 1,
  pageSize,
  showSizeChanger,
  pageSizeOptions = ['5', '10', '15'],
  onShowSizeChange = () => {},
  onPageChange = () => {},
}: PaginationProps) {
  const paginationRange = usePagination({
    total,
    siblingCount,
    pageSize,
    currentPage,
  })
  if (currentPage === 0) {
    return null
  }

  const onNext = () => {
    onPageChange(currentPage + 1)
  }

  const onPrevious = () => {
    onPageChange(currentPage - 1)
  }

  const _showSizeChanger = !isNullOrUndefined(showSizeChanger)
    ? showSizeChanger
    : total > 50

  const lastPage = paginationRange[paginationRange.length - 1]

  if (_showSizeChanger && !pageSizeOptions.includes(String(pageSize))) {
    throw new Error('Page size not in valid ranges')
  }

  return (
    <div className={clsx('flex gap-5 select-none w-fit', className)}>
      <ul className="flex items-center gap-3">
        <li>
          <PaginationItem onClick={onPrevious} disabled={currentPage === 1}>
            <MdNavigateNext className="text-lg rotate-180" />
          </PaginationItem>
        </li>

        {paginationRange.map((page, idx) => (
          <li key={idx}>
            {page === -1 ? (
              <BsThreeDots />
            ) : (
              <PaginationItem
                active={page === currentPage}
                onClick={() => page !== currentPage && onPageChange(page)}
              >
                {page}
              </PaginationItem>
            )}
          </li>
        ))}
        <li>
          <PaginationItem disabled={currentPage === lastPage} onClick={onNext}>
            <MdNavigateNext className="text-lg" />
          </PaginationItem>
        </li>
      </ul>
      {_showSizeChanger && (
        <>
          <div className="flex-grow"></div>
          <Select
            enableSearch={false}
            wrapperCls="w-[100px]"
            value={String(pageSize)}
            options={pageSizeOptions.map((option) => ({
              label: `${option} / page`,
              value: option,
            }))}
            onChange={(v) => onShowSizeChange(+v!)}
          />
        </>
      )}
    </div>
  )
})
