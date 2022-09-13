import clsx from 'clsx'
import { forwardRef } from 'react'

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  fullWidth?: boolean
}

export default forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  props,
  ref
) {
  return (
    <textarea
      ref={ref}
      {...props}
      className={clsx(
        'min-h-[40px] w-full py-2 outline-none px-3 rounded-lg bg-gray-100 font-medium placeholder:text-gray-400 placeholder:text-sm z-[1] focus:outline-none focus:ring-2 focus:ring-blue-200',
        props.className
      )}
    ></textarea>
  )
})
