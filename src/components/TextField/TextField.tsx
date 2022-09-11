import clsx from 'clsx'
import { forwardRef } from 'react'

interface TextFieldProps {
  className?: string
  icon?: React.ReactNode
  fullWidth?: boolean
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
}

export default forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { icon, fullWidth = false, inputProps = {}, className },
  ref
) {
  return (
    <div
      className={clsx(
        'relative flex items-center gap-3 px-3 rounded-lg bg-gray-100',
        fullWidth ? 'w-full' : 'w-fit',
        className
      )}
    >
      {icon && <span className="text-gray-400">{icon}</span>}
      <input
        ref={ref}
        className="w-full py-2 outline-none font-medium bg-transparent placeholder:text-gray-400 placeholder:text-sm peer z-[1]"
        {...inputProps}
      />
      <div className="absolute top-0 left-0 w-full h-full rounded-lg peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-200"></div>
    </div>
  )
})
