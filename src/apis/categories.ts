import { httpClient } from './httpClient'

const ENDPOINT = '/categories'

export type CreateCategoryDTO = Pick<
  Category,
  'name' | 'imgUrl' | 'description'
>

export type UpdateCategoryDTO = Partial<Category>
export interface DeleteCategoryDTO extends Pick<Category, 'id'> {
  forcedDelete?: boolean
}

export const categoriesApi = {
  get: () => httpClient<Category[]>('get', ENDPOINT),
  create: (payload: CreateCategoryDTO) =>
    httpClient<Category>('post', ENDPOINT, payload),
  update: (payload: UpdateCategoryDTO) =>
    httpClient<Category>('patch', ENDPOINT + '/' + payload.id!, payload),
  delete: (payload: DeleteCategoryDTO) =>
    httpClient<{ message: string }>('delete', ENDPOINT + '/' + payload.id, {
      forcedDelete: payload.forcedDelete,
    }),
}
