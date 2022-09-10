import { httpClient } from './httpClient'

const ENDPOINT = '/categories'

export const categoriesApi = {
  get: () => httpClient<Category[]>('get', ENDPOINT),
}
