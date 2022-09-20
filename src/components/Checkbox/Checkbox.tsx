import { useId } from 'react'
import { MdCheck } from 'react-icons/md'

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export default function Checkbox({ label, ...rest }: CheckboxProps) {
  const id = useId()
  return (
    <div className="relative flex items-center">
      <input id={id} type="checkbox" className="opacity-0 peer" {...rest} />
      <div className="z-[-1] absolute top-1/2 -translate-y-1/2 left-0 grid place-content-center w-[16px] h-[16px] bg-gray-200 rounded text-transparent peer-checked:text-white peer-checked:bg-blue-500 peer-focus:ring-2 peer-focus:ring-blue-200 transition-colors">
        <MdCheck className="text-sm" />
      </div>
      {label && (
        <label
          htmlFor={id}
          className="ml-2 text-sm font-medium text-gray-800 select-none"
        >
          {label}
        </label>
      )}
    </div>
  )
}
