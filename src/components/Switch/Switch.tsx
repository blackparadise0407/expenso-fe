import { forwardRef, InputHTMLAttributes, useId } from 'react'

interface SwitchProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export default forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { label, ...rest }: SwitchProps,
  ref
) {
  const id = useId()
  return (
    <label
      htmlFor={id}
      className="inline-flex relative items-center cursor-pointer"
    >
      <input
        {...rest}
        ref={ref}
        type="checkbox"
        id={id}
        className="sr-only peer"
      />
      <div className="w-[40px] h-[22px] bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-[18px] after:w-[18px] after:transition-all peer-checked:bg-blue-500"></div>
      {label && (
        <span className="ml-3 text-sm font-medium text-gray-900">{label}</span>
      )}
    </label>
  )
})
