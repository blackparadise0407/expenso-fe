import clsx from 'clsx'

interface TextFieldProps {
  className?: string
  icon?: React.ReactNode
  fullWidth?: boolean
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
}

export default function TextField({
  icon,
  fullWidth = false,
  inputProps = {},
  className,
}: TextFieldProps) {
  return (
    <div
      className={clsx(
        'flex items-center gap-3 px-3 rounded-lg bg-gray-100',
        fullWidth ? 'w-full' : 'w-fit',
        className
      )}
    >
      {icon && <span className="text-gray-400">{icon}</span>}
      <input
        className="w-full py-2 outline-none font-medium bg-transparent placeholder:text-gray-400"
        {...inputProps}
      />
    </div>
  )
}
