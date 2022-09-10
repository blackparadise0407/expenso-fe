import { useQuery } from '@tanstack/react-query'

import { categoriesApi } from '@/apis/categories'

export function useCategoriesQuery(ready: boolean) {
  return useQuery(['categories'], categoriesApi.get, {
    enabled: ready,
    staleTime: 60000,
  })
}
