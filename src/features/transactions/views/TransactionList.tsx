import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import {
  BooleanParam,
  DelimitedArrayParam,
  NumberParam,
  StringParam,
  useQueryParams,
} from 'use-query-params'

import { transactionsApi } from '@/apis/transactions'
import { Empty } from '@/components/Empty'
import { Loader } from '@/components/Loader'
import { Option } from '@/components/Select/Select'
import { SortGroup } from '@/components/SortGroup'
import { Switch } from '@/components/Switch'
import { TransactionCard } from '@/components/TransactionCard'

export default function TransactionList() {
  const firstRender = useRef(true)
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
        <div className="form-group">
          <label htmlFor="income">Income</label>
          <Switch
            value={String(query.income)}
            onChange={(e) => setQuery({ income: e.target.checked })}
          />
        </div>
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
