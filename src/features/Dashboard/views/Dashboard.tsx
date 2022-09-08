import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { transactionsApi } from '@/apis/transactions'
import { TransactionCard } from '@/components/TransactionCard'

export default function Dashboard() {
  const [page, setPage] = useState(1)
  const { data } = useQuery(
    ['transactions', page],
    () => transactionsApi.getAll({ pageSize: 20, pageIndex: page }),
    { keepPreviousData: true }
  )

  return (
    <div>
      {data?.docs.map((transaction) => (
        <TransactionCard key={transaction.id} data={transaction} />
      ))}
    </div>
  )
}
