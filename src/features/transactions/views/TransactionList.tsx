import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useRef } from 'react'
import { NumberParam, StringParam, useQueryParams } from 'use-query-params'

import { transactionsApi } from '@/apis/transactions'
import { Empty } from '@/components/Empty'
import { Filter } from '@/components/Filter'
import { FilterApplyFn } from '@/components/Filter/Filter'
import { Loader } from '@/components/Loader'
import { Pagination } from '@/components/Pagination'
import { PageChangeFn } from '@/components/Pagination/Pagination'
import { Option } from '@/components/Select/Select'
import { SortGroup } from '@/components/SortGroup'
import { TransactionCard } from '@/components/TransactionCard'
import { useCategoriesQuery } from '@/hooks/useCategoriesQuery'

export default function TransactionList() {
  const firstRender = useRef(true)
  const categoriesQuery = useCategoriesQuery(true)
  const [query, setQuery] = useQueryParams(
    {
      pageSize: NumberParam,
      pageIndex: NumberParam,
      min: NumberParam,
      max: NumberParam,
      type: StringParam,
      toDate: NumberParam,
      fromDate: NumberParam,
      order: StringParam,
      orderBy: StringParam,
      categoryIds: StringParam,
    },
    {
      skipUpdateWhenNoChange: true,
      enableBatching: true,
    }
  )
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const transactionListQuery = ((query: any) =>
    useQuery(
      ['transaction-list', JSON.stringify(query)],
      () => transactionsApi.getAll(query),
      { staleTime: 60000 }
    ))(query)

  const sortOpts: Option<keyof Transaction>[] = [
    {
      label: 'Name',
      value: 'name',
    },
    {
      label: 'Amount',
      value: 'amount',
    },
    {
      label: 'Transaction date',
      value: 'transactionDate',
    },
  ]

  const categoryOpts: Option[] = (categoriesQuery.data ?? []).map((it) => ({
    label: it.name,
    value: it.id,
  }))

  const handleApplyFilter: FilterApplyFn = useCallback((filters) => {
    setQuery({ ...filters, pageIndex: 1 })
  }, [])

  const handleClearFilter = useCallback(() => {
    setQuery(
      {
        categoryIds: undefined,
        min: undefined,
        max: undefined,
        type: undefined,
        pageIndex: 1,
      },
      'replaceIn'
    )
  }, [])

  const handlePageChange: PageChangeFn = useCallback((page) => {
    setQuery({ pageIndex: page }, 'replaceIn')
  }, [])

  useEffect(() => {
    if (firstRender.current && (!query.pageIndex || !query.pageIndex)) {
      setQuery(
        {
          pageIndex: 1,
          pageSize: 5,
        },
        'replaceIn'
      )
    }
    firstRender.current = false

    return () => {
      firstRender.current = true
    }
  }, [])

  return (
    <div className="space-y-5">
      <div className="flex items-center">
        <Filter
          filters={[
            {
              key: 'type',
              label: 'Type',
              type: 'select',
              options: [
                { value: 'true', label: 'Income' },
                { value: 'false', label: 'Outcome' },
              ],
            },
            {
              key: 'range',
              label: 'Range',
              type: 'range',
              config: {
                minKey: 'min',
                maxKey: 'max',
              },
            },
            {
              key: 'categoryIds',
              label: 'Category',
              type: 'select',
              options: categoryOpts,
            },
          ]}
          onApply={handleApplyFilter}
          onClear={handleClearFilter}
        />
        <div className="flex-grow" />
        <SortGroup sorts={sortOpts} />
      </div>
      {transactionListQuery.isLoading && <Loader />}
      {transactionListQuery.isFetched &&
        !transactionListQuery.data?.docs.length && <Empty />}
      <div className="space-y-5">
        {transactionListQuery.data?.docs.map((it) => (
          <TransactionCard key={it.id} data={it} />
        ))}
      </div>
      <Pagination
        className="mx-auto"
        showSizeChanger
        onShowSizeChange={(pageSize) =>
          setQuery({ pageSize, pageIndex: 1 }, 'replaceIn')
        }
        currentPage={query.pageIndex ?? 1}
        pageSize={query.pageSize ?? 10}
        total={transactionListQuery.data?.totalDocs ?? 0}
        onPageChange={handlePageChange}
      />
    </div>
  )
}
