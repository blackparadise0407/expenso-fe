import { httpClient } from './httpClient'
import { PaginatedApiResponse } from './interfaces'

const ENDPOINT = '/transactions'

type CreateTransactionDTO = Pick<
  Transaction,
  'amount' | 'category' | 'income' | 'name' | 'transactionDate'
>

export interface TransactionsQuery {
  income?: boolean
  fromDate?: number
  toDate?: number
  order?: string
  orderBy?: keyof Transaction
  min?: number
  max?: number
  categoryIds?: string
}

export type PaginatedTransactionQuery = PaginatedQuery & TransactionsQuery

export interface TransactionAnalyticResponse {
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
  delete: (transactionId: string) =>
    httpClient<{ message: string }>('delete', ENDPOINT + '/' + transactionId),
}
