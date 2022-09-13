import { httpClient } from './httpClient'

const ENDPOINT = '/categories'

export type CreateCategoryDTO = Pick<
  Category,
  'name' | 'imgUrl' | 'description'
>

export type UpdateCategoryDTO = Partial<Category>

export const categoriesApi = {
  get: () => httpClient<Category[]>('get', ENDPOINT),
  create: (payload: CreateCategoryDTO) =>
    httpClient<Category>('post', ENDPOINT, payload),
  update: (payload: UpdateCategoryDTO) =>
    httpClient('patch', ENDPOINT + '/' + payload.id!, payload),
}
