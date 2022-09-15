import dayjs from 'dayjs'

import { groupBy } from '@/utils/utils'

export const getChartData = (transactions: Transaction[]) => {
  type ReturnType = Array<{
    transactionDate: string
    transactions: Transaction[]
    total: number
    income: number
    outcome: number
  }>
  const result: ReturnType = []
  groupBy(
    transactions.map((it) => ({
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
      income: transactions
        .filter((it) => it.income)
        .reduce((res, curr) => (res += curr.amount), 0),
      outcome: transactions
        .filter((it) => !it.income)
        .reduce((res, curr) => (res += curr.amount), 0),
    })
  })
  return result
}
