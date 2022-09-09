import { httpClient } from './httpClient'
import { PaginatedApiResponse } from './interfaces'

const ENDPOINT = '/transactions'

interface CreateTransactionDTO {
  id: string
}

interface TransactionsQuery extends PaginatedQuery {
  income?: boolean
  fromDate?: Date
  toDate?: Date
  order?: 'asc' | 'desc'
  orderBy?: keyof Transaction
  min?: number
  max?: number
  categoryId?: string
}

export const transactionsApi = {
  getAll: (queries: TransactionsQuery) =>
    httpClient<PaginatedApiResponse<Transaction>>('get', ENDPOINT, queries),
  create: (payload: CreateTransactionDTO) =>
    httpClient('post', ENDPOINT, payload),
}
