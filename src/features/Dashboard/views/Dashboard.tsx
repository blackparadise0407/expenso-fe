import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { Fragment, memo, useMemo } from 'react'
import { MdMoreHoriz } from 'react-icons/md'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from 'recharts'
import { StringParam, useQueryParams } from 'use-query-params'

import { transactionsApi, TransactionsQuery } from '@/apis/transactions'
import { CreateTransactionCard } from '@/components/CreateTransactionCard'
import { Option } from '@/components/Select/Select'
import { SortGroup } from '@/components/SortGroup'
import { TransactionCard } from '@/components/TransactionCard'
import { currencyFormat, groupBy } from '@/utils/utils'

interface TransactionListProps {
  transactions: Transaction[]
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const transactions = (payload[0].payload?.transactions ??
      []) as Transaction[]
    const MAX_RENDER_SIZE = 3
    return (
      <div className="p-2 min-w-[160px] space-y-2 rounded-lg shadow bg-white bg-opacity-95 ring-0">
        <p className="font-medium text-sm text-gray-500">{label}</p>
        <p className="font-semibold text-gray-900">
          Total {currencyFormat(payload[0].payload.total)}
        </p>
        <ul className="space-y-1">
          {transactions.slice(undefined, MAX_RENDER_SIZE).map((it) => (
            <Fragment key={it.id}>
              <p className="text-gray-900 font-semibold text-sm">{it.name}</p>
              <p
                className={clsx(
                  'font-semibold',
                  it.income ? 'text-green-500' : 'text-red-500'
                )}
              >
                {it.income ? '+' : '-'}
                {currencyFormat(it.amount)}
              </p>
            </Fragment>
          ))}
          {transactions.length > MAX_RENDER_SIZE && (
            <MdMoreHoriz className="text-gray-600" />
          )}
        </ul>
      </div>
    )
  }

  return null
}

const TransactionList = memo(function TransactionList({
  transactions,
}: TransactionListProps) {
  return (
    <div className="space-y-5">
      {transactions.map((transaction) => (
        <TransactionCard key={transaction.id} data={transaction} />
      ))}
    </div>
  )
})

export default function Dashboard() {
  const [query] = useQueryParams({ orderBy: StringParam, order: StringParam })
  const topTransactionsQuery = ((query: TransactionsQuery) =>
    useQuery(
      ['top-transactions', JSON.stringify(query)],
      () =>
        transactionsApi.getAll({
          pageIndex: 1,
          pageSize: 5,
          fromDate: dayjs().subtract(18, 'days').startOf('D').unix(),
          toDate: dayjs().endOf('D').unix(),
          ...query,
        }),
      { staleTime: 30000 }
    ))(query as TransactionsQuery)

  const transactionsQuery = useQuery(
    ['transactions'],
    () =>
      transactionsApi.getAll({
        pageIndex: 1,
        pageSize: Number.MAX_SAFE_INTEGER,
        // fromDate: dayjs().subtract(7, 'D').toDate(),
        // toDate: dayjs().endOf('D').toDate(),
        order: 'asc',
        orderBy: 'transactionDate',
      }),
    { keepPreviousData: true }
  )

  const chartData = useMemo(() => {
    type ReturnType = Array<{
      transactionDate: string
      transactions: Transaction[]
      total: number
    }>
    const result: ReturnType = []
    groupBy(
      (transactionsQuery.data?.docs ?? []).map((it) => ({
        ...it,
        parsedTransactionDate: dayjs(it.transactionDate * 1000).format(
          'DD/MM/YYYY'
        ),
      })),
      (it) => it.parsedTransactionDate
    ).forEach((transactions, transactionDate) => {
      result.push({
        total: transactions.reduce((res, curr) => (res += curr.amount), 0),
        transactionDate,
        transactions,
      })
    })
    return result
  }, [transactionsQuery.data])

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

  return (
    <div className="space-y-5">
      <div className="flex gap-5 flex-wrap lg:flex-nowrap">
        {chartData.length && (
          <ResponsiveContainer
            className="bg-white rounded-lg shadow lg:order-1 order-2"
            width="100%"
            height={400}
          >
            <AreaChart
              margin={{
                top: 50,
                right: 50,
                left: 20,
                bottom: 20,
              }}
              data={chartData}
            >
              <defs>
                <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3A78F2" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3A78F2" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid horizontal={false} strokeDasharray="3" />
              <Tooltip
                wrapperStyle={{ outline: 'none' }}
                content={<CustomTooltip />}
              />
              <XAxis
                dataKey="transactionDate"
                style={{
                  fontSize: '12px',
                }}
              />
              <YAxis
                tickFormatter={(value) => currencyFormat(value)}
                style={{
                  fontSize: '12px',
                }}
              />
              <Legend align="center" />
              <Area
                dot={{
                  stroke: '#3A78F2',
                  strokeWidth: 2,
                  fill: '#ffffff',
                  r: 5,
                }}
                name="Total"
                type="monotone"
                dataKey="total"
                fillOpacity={1}
                fill="url(#colorPv)"
                strokeWidth={2}
                stroke="#3A78F2"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
        <div className="min-w-full lg:min-w-[35%] max-w-[500px] lg:max-w-full order-1 lg:order-2">
          <CreateTransactionCard />
        </div>
      </div>
      <div className="flex items-center">
        <p className="font-bold text-xl">Top transactions</p>
        <div className="flex-grow"></div>
        <SortGroup sorts={sortOpts} />
      </div>
      <div className="flex items-center gap-3">
        <p className="font-semibold">September 2022</p>
        <div className="flex-grow"></div>
        <span className="font-medium text-gray-400">
          Number of transactions: {transactionsQuery.data?.totalDocs}
        </span>
        {/* <span className="font-medium text-gray-400">
          Total:{' '}
          {Intl.NumberFormat('us', {
            style: 'currency',
            currency: 'VND',
          }).format(
            transactionsQuery.data?.docs.reduce(
              (res, curr) =>
                (res = res + (curr.income ? +curr.amount : -curr.amount)),
              0
            ) ?? 0
          )}
        </span> */}
      </div>
      {topTransactionsQuery.isLoading && 'Loading...'}
      {topTransactionsQuery.data && (
        <TransactionList transactions={topTransactionsQuery.data.docs} />
      )}
    </div>
  )
}
