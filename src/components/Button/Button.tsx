import clsx from 'clsx'
import { ButtonHTMLAttributes } from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'

type ButtonVariant = 'primary' | 'text' | 'danger'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode
  variant?: ButtonVariant
  loading?: boolean
}

const getBtnClsFromVariant = (v: ButtonVariant) => {
  switch (v) {
    case 'danger':
      return 'btn--danger'
    case 'primary':
      return 'btn--primary'
    case 'text':
      return 'btn--text'
    default:
      return ''
  }
}

export default function Button({
  variant = 'primary',
  children,
  icon,
  loading = false,
  disabled = false,
  ...rest
}: ButtonProps) {
  const computedDisabled = loading || disabled
  return (
    <button
      {...rest}
      disabled={computedDisabled}
      className={clsx(
        'btn',
        computedDisabled && 'btn--disabled',
        getBtnClsFromVariant(variant)
      )}
    >
      {loading ? (
        <AiOutlineLoading3Quarters className="text-base animate-spin mr-1" />
      ) : (
        icon && <span className="text-xl">{icon}</span>
      )}

      {children}
    </button>
  )
}
