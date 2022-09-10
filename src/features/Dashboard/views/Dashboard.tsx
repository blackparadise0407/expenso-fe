import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { memo, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
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
import { NumberParam, useQueryParams } from 'use-query-params'

import { transactionsApi } from '@/apis/transactions'
import { CreateTransactionCard } from '@/components/CreateTransactionCard'
import { TransactionCard } from '@/components/TransactionCard'

interface TransactionListProps {
  transactions: Transaction[]
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const transaction = payload[0].payload as Transaction
    return (
      <div className="p-2 rounded-lg shadow bg-white bg-opacity-90 ring-0">
        <p className="font-medium text-sm">
          {dayjs(label).format('MMM DD, YYYY')}
        </p>
        <p>{transaction.name}</p>
        <p
          className={clsx(
            'font-semibold',
            transaction.income ? 'text-green-500' : 'text-red-500'
          )}
        >
          {transaction.income ? '+' : '-'}
          {Intl.NumberFormat('us', {
            style: 'currency',
            currency: 'VND',
          }).format(payload[0].value!)}
        </p>
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
  const [query, setQuery] = useQueryParams(
    {
      pageSize: NumberParam,
      pageIndex: NumberParam,
    },
    {
      params: {},
    }
  )
  const topTransactionsQuery = useQuery(['top-transactions'], () =>
    transactionsApi.getAll({
      pageIndex: 1,
      pageSize: 5,
      fromDate: dayjs().startOf('D').toDate(),
      toDate: dayjs().endOf('D').toDate(),
      order: 'desc',
      orderBy: 'amount',
      income: false,
    })
  )
  const { pathname } = useLocation()

  const transactionsQuery = useQuery(
    ['transactions', JSON.stringify(query)],
    () =>
      transactionsApi.getAll({
        pageSize: query.pageSize!,
        pageIndex: query.pageIndex!,
        order: 'asc',
        orderBy: 'transactionDate',
      }),
    { keepPreviousData: true }
  )

  useEffect(() => {
    setQuery((query) => ({
      ...query,
      pageIndex: 1,
      pageSize: 20,
    }))
  }, [pathname])

  return (
    <div className="space-y-5">
      <div className="mt-5 flex gap-5 flex-wrap lg:flex-nowrap">
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
            data={transactionsQuery.data?.docs}
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
              tickFormatter={(value) => dayjs(value).format('DD/MM/YYYY')}
              style={{
                fontSize: '12px',
              }}
            />
            <YAxis
              tickFormatter={(value) =>
                Intl.NumberFormat('us', {
                  notation: 'compact',
                  style: 'currency',
                  currency: 'VND',
                }).format(value)
              }
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
              name="Amount"
              type="monotone"
              dataKey="amount"
              fillOpacity={1}
              fill="url(#colorPv)"
              strokeWidth={2}
              stroke="#3A78F2"
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="min-w-full lg:min-w-[35%] max-w-[500px] lg:max-w-full order-1 lg:order-2">
          <CreateTransactionCard />
        </div>
      </div>
      <p className="font-bold text-xl">Top transactions</p>
      <div className="flex items-center gap-3">
        <p className="font-semibold">September 2022</p>
        <div className="flex-grow"></div>
        <span className="font-medium text-gray-400">
          Number of transactions: {transactionsQuery.data?.totalDocs}
        </span>
        <span className="font-medium text-gray-400">
          Value:{' '}
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
        </span>
      </div>
      <TransactionList transactions={topTransactionsQuery.data?.docs ?? []} />
    </div>
  )
}
