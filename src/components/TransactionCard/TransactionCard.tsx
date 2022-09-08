import clsx from 'clsx'
import dayjs from 'dayjs'
import { MdClose } from 'react-icons/md'

interface TransactionCardProps {
  data: Transaction
}

export default function TransactionCard({ data }: TransactionCardProps) {
  return (
    <div className="flex items-center gap-5 p-5 rounded-lg shadow">
      <img
        className="w-8 h-8 rounded-lg"
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNGSBhG8SG1FWHrm9Shv4KX3oIrXhIsp9dUA&usqp=CAU"
        alt=""
      />
      <div>
        <p className="font-bold text-gray-800">{data.name}</p>
        <p className="text-sm font-medium text-gray-400">
          {dayjs(data.transactionDate).format('DD MMMM YYYY')}
        </p>
      </div>
      <div className="flex-grow"></div>
      <p
        className={clsx(
          'font-bold',
          data.income ? 'text-green-500' : 'text-red-500'
        )}
      >
        {data.income ? '+' : '-'}{' '}
        {new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(data.amount)}
      </p>
      <div className="flex gap-2">
        <div className="p-2 bg-blue-50 rounded-lg cursor-pointer">
          <MdClose className="text-gray-600" />
        </div>
      </div>
    </div>
  )
}
