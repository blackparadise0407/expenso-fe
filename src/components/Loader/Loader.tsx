import clsx from 'clsx'

import classes from './Loader.module.css'

interface LoaderProps {
  className?: string
  loadingText?: string
}

export default function Loader({
  className,
  loadingText = "We're loading your resources...",
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
      {loadingText && (
        <p className="font-medium text-gray-700 animate-pulse">{loadingText}</p>
      )}
    </div>
  )
}
