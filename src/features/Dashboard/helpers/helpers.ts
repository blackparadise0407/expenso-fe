import dayjs from 'dayjs'

import { groupBy } from '@/utils/utils'

export const getChartData = (transactions: Transaction[]) => {
  type ReturnType = Array<{
    transactionDate: string
    transactions: Transaction[]
    total: number
    // income?: number
    // outcome?: number
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
    // const incomes = transactions.filter((it) => it.income)
    // const outcomes = transactions.filter((it) => !it.income)
    result.push({
      total: transactions.reduce((res, curr) => (res += curr.amount), 0),
      transactionDate,
      transactions,
      // income: incomes.length
      //   ? incomes.reduce((res, curr) => (res += curr.amount), 0)
      //   : undefined,
      // outcome: outcomes.length
      //   ? outcomes.reduce((res, curr) => (res += curr.amount), 0)
      //   : undefined,
    })
  })
  return result
}
