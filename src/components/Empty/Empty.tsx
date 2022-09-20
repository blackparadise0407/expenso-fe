import clsx from 'clsx'

import emptyBoxImg from '@/assets/images/empty-box.png?url'

interface EmptyProps {
  className?: string
  description?: React.ReactNode
}

export default function Empty({
  className,
  description = 'This is currently empty',
}: EmptyProps) {
  return (
    <div
      className={clsx(
        'w-full h-full flex flex-col items-center justify-center gap-2',
        className
      )}
    >
      <img
        className="min-w-[50px] w-full max-w-[10%] h-auto"
        src={emptyBoxImg}
        alt=""
        loading="eager"
      />
      {description && (
        <p className="font-medium text-sm text-gray-400">{description}</p>
      )}
    </div>
  )
}
