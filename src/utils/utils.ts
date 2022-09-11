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
