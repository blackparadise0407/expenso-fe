import clsx from 'clsx'
import { useId } from 'react'

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export default function Checkbox({ label, className, ...rest }: CheckboxProps) {
  const id = useId()
  return (
    <div className="flex items-center">
      <input
        {...rest}
        id={id}
        type="checkbox"
        className={clsx('w-[16px] h-[16px]', className)}
      />
      {label && (
        <label htmlFor={id} className="ml-2 text-sm font-medium text-gray-800">
          {label}
        </label>
      )}
    </div>
  )
}
