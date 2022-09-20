import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import {
  BooleanParam,
  DelimitedArrayParam,
  NumberParam,
  StringParam,
  useQueryParams,
} from 'use-query-params'

import { transactionsApi, TransactionsQuery } from '@/apis/transactions'
import { Empty } from '@/components/Empty'
import { Filter } from '@/components/Filter'
import { Loader } from '@/components/Loader'
import { Option } from '@/components/Select/Select'
import { SortGroup } from '@/components/SortGroup'
import { TransactionCard } from '@/components/TransactionCard'
import { useCategoriesQuery } from '@/hooks/useCategoriesQuery'

export default function TransactionList() {
  const firstRender = useRef(true)
  const categoriesQuery = useCategoriesQuery(true)
  const [query, setQuery] = useQueryParams({
    pageSize: NumberParam,
    pageIndex: NumberParam,
    income: BooleanParam,
    toDate: NumberParam,
    fromDate: NumberParam,
    order: StringParam,
    orderBy: StringParam,
    min: NumberParam,
    max: NumberParam,
    categoryIds: DelimitedArrayParam,
  })
  const transactionListQuery = ((query: any) =>
    useQuery(
      ['transaction-list', JSON.stringify(query)],
      () => {
        const q: TransactionsQuery = {}
        if (query.range) {
          const [min, max] = query.range
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
        {/* <div className="form-group">
          <label htmlFor="income">Income</label>
          <Switch
            value={String(query.income)}
            onChange={(e) => setQuery({ income: e.target.checked })}
          />
        </div> */}
        <Filter
          filters={[
            { key: 'income', label: 'Income', type: 'boolean' },
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
