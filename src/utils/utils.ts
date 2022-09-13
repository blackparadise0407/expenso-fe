import { env } from '@/constants'

export function groupBy<T>(list: Array<T>, keyGetter: (item: T) => string) {
  const map = new Map<string, Array<T>>()
  list.forEach((item) => {
    const key = keyGetter(item)
    const collection = map.get(key)
    if (!collection) {
      map.set(key, [item])
    } else {
      collection.push(item)
    }
  })
  return map
}

export function currencyFormat(num: number) {
  return Intl.NumberFormat('us', {
    style: 'currency',
    currency: 'VND',
  }).format(num)
}

export function fileReaderAsync(file: File | Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      resolve(reader.result as string)
    }

    reader.onerror = reject

    reader.readAsDataURL(file)
  })
}

export const getSupabasePublicUrl = (key: string) =>
  `${env.supabase.url}/storage/v1/object/public/${key}`
