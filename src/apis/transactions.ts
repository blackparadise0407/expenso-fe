import { httpClient } from './httpClient'
import { PaginatedApiResponse } from './interfaces'

const ENDPOINT = '/transactions'

interface CreateTransactionDTO {
  id: string
}

export const transactionsApi = {
  getAll: (queries: any) =>
    httpClient<PaginatedApiResponse<Transaction>>('get', ENDPOINT, queries),
  create: (payload: CreateTransactionDTO) =>
    httpClient('post', ENDPOINT, payload),
}
