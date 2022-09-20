import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useRef } from 'react'
import { NumberParam, StringParam, useQueryParams } from 'use-query-params'

import { transactionsApi, TransactionsQuery } from '@/apis/transactions'
import { Empty } from '@/components/Empty'
import { Filter } from '@/components/Filter'
import { FilterApplyFn } from '@/components/Filter/Filter'
import { Loader } from '@/components/Loader'
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
      type: StringParam,
      toDate: NumberParam,
      fromDate: NumberParam,
      order: StringParam,
      orderBy: StringParam,
      range: StringParam,
      categoryIds: StringParam,
    },
    {
      skipUpdateWhenNoChange: true,
      enableBatching: true,
    }
  )
  const transactionListQuery = ((query: any) =>
    useQuery(
      ['transaction-list', JSON.stringify(query)],
      () => {
        const q: TransactionsQuery = {}
        if (query.range) {
          const [min, max] = query.range.split(',')
          q.min = min
          q.max = max
        }
        return transactionsApi.getAll({ ...query, ...q })
      },
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
    setQuery(filters)
  }, [])

  const handleClearFilter = useCallback(() => {
    setQuery(
      {
        categoryIds: undefined,
        range: undefined,
        type: undefined,
      },
      'replaceIn'
    )
  }, [])

  useEffect(() => {
    if (firstRender.current) {
      setQuery(
        {
          pageIndex: 1,
          pageSize: 20,
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
              inputProps: {
                min: 0,
                max: 300000,
                step: 1000,
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
    </div>
  )
}
