import clsx from 'clsx'

import classes from './Loader.module.css'

export default function Loader() {
  return (
    <div className="w-full h-full grid place-content-center justify-center">
      <div className={clsx(classes.lds_facebook, 'mx-auto animate-pulse')}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <p className="font-medium text-gray-700 animate-pulse">
        We&apos;re loading your resources...
      </p>
    </div>
  )
}
