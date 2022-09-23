import { useMutation } from '@tanstack/react-query'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { MdClose, MdOutlineEditCalendar } from 'react-icons/md'

import { transactionsApi } from '@/apis/transactions'
import { useToast } from '@/contexts/ToastContext'
import { queryClient } from '@/queryClient'
import { currencyFormat } from '@/utils/utils'

import { IconButton } from '../IconButton'
import { Tooltip } from '../Tooltip'

interface TransactionCardProps {
  data: Transaction
}

export default function TransactionCard({ data }: TransactionCardProps) {
  const { enqueue } = useToast()
  const deleteTransactionMutation = useMutation<
    { message: string },
    string,
    string
  >((transactionId) => transactionsApi.delete(transactionId))

  const handleDeleteTransaction = async () => {
    try {
      const { message } = await deleteTransactionMutation.mutateAsync(data.id)
      queryClient.invalidateQueries({
        predicate(query) {
          return ['transactions', 'top-transactions'].includes(
            query.queryKey[0] as string
          )
        },
        exact: false,
      })
      enqueue(message)
    } catch (e) {
      enqueue(e as string, { variant: 'error' })
    }
  }

  return (
    <div className="flex items-center gap-5 p-5 rounded-lg shadow">
      <img
        className="w-8 h-8 rounded-lg"
        src={
          typeof data.category === 'object' ? data.category?.imgUrl : undefined
        }
        alt=""
      />
      <div>
        <p className="font-bold text-gray-800">{data.name}</p>
        <div className="flex items-center gap-1">
          <MdOutlineEditCalendar className="text-sm text-gray-400" />
          <p className="text-sm font-medium text-gray-400">
            {dayjs(data.transactionDate * 1000).format('MMM DD, YYYY')}
          </p>
        </div>
      </div>
      {!!data.description && (
        <Tooltip content={data.description}>
          <p className="max-w-[800px] text-sm font-medium truncate text-gray-600">
            {data.description}
          </p>
        </Tooltip>
      )}
      <div className="flex-grow"></div>
      <p
        className={clsx(
          'font-bold',
          data.income ? 'text-green-500' : 'text-red-500'
        )}
      >
        {data.income ? '+' : '-'} {currencyFormat(data.amount)}
      </p>
      <div className="flex gap-2">
        <IconButton
          icon={<MdClose className="text-gray-600" />}
          loading={deleteTransactionMutation.isLoading}
          onClick={handleDeleteTransaction}
        />
      </div>
    </div>
  )
}
