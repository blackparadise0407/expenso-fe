import { useQuery } from '@tanstack/react-query'

import { Empty } from '@/components/Empty'

export default function TransactionList() {
  useQuery(['trasactions'])
  return (
    <div>
      Transaction list view
      <Empty />
    </div>
  )
}
