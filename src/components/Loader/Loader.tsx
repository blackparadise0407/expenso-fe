import clsx from 'clsx'

import classes from './Loader.module.css'

interface LoaderProps {
  className?: string
  subText?: string
}

export default function Loader({
  className,
  subText = 'We&apos;re loading your resources...',
}: LoaderProps) {
  return (
    <div
      className={clsx(
        'w-full h-full grid place-content-center justify-center',
        className
      )}
    >
      <div className={clsx(classes.lds_facebook, 'mx-auto animate-pulse')}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      {!!subText && (
        <p className="font-medium text-gray-700 animate-pulse">{subText}</p>
      )}
    </div>
  )
}
