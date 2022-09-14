import clsx from 'clsx'
import dayjs from 'dayjs'
import { MdClose } from 'react-icons/md'

import { currencyFormat } from '@/utils/utils'

import { IconButton } from '../IconButton'

interface TransactionCardProps {
  data: Transaction
}

export default function TransactionCard({ data }: TransactionCardProps) {
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
        <p className="text-sm font-medium text-gray-400">
          {dayjs(data.transactionDate * 1000).format('DD MMMM YYYY')}
        </p>
      </div>
      {!!data.description && (
        <p className="max-w-[800px] truncate text-gray-400">
          {data.description}
        </p>
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
        <IconButton icon={<MdClose className="text-gray-600" />} />
      </div>
    </div>
  )
}
