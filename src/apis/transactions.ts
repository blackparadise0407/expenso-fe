import { httpClient } from './httpClient'
import { PaginatedApiResponse } from './interfaces'

const ENDPOINT = '/transactions'

type CreateTransactionDTO = Pick<
  Transaction,
  'amount' | 'category' | 'income' | 'name' | 'transactionDate'
>

interface TransactionsQuery {
  income?: boolean
  fromDate?: Date
  toDate?: Date
  order?: 'asc' | 'desc'
  orderBy?: keyof Transaction
  min?: number
  max?: number
  categoryId?: string
}

type PaginatedTransactionQuery = PaginatedQuery & TransactionsQuery

interface TransactionAnalyticResponse {
  transactions: Array<
    Pick<Transaction, 'name' | 'transactionDate' | 'amount' | 'income'>
  >
  transactionDate: Date
}

export const transactionsApi = {
  getAll: (queries: PaginatedTransactionQuery) =>
    httpClient<PaginatedApiResponse<Transaction>>('get', ENDPOINT, queries),
  create: (payload: CreateTransactionDTO) =>
    httpClient<Transaction>('post', ENDPOINT, payload),
  getAnalytics: (queries: TransactionsQuery = {}) =>
    httpClient<TransactionAnalyticResponse[]>(
      'get',
      ENDPOINT + '/analytics',
      queries
    ),
}
