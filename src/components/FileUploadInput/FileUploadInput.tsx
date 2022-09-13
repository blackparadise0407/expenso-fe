import clsx from 'clsx'
import { forwardRef, InputHTMLAttributes } from 'react'

import { useToast } from '@/contexts/ToastContext'

interface FileUploadInputProps extends InputHTMLAttributes<HTMLInputElement> {
  maxSize?: number
}

export default forwardRef<HTMLInputElement, FileUploadInputProps>(
  function FileUploadInput({ className, maxSize, onChange, ...rest }, ref) {
    const { enqueue } = useToast()
    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
      const files = e.target.files
      if (files && !!maxSize) {
        for (const file of files) {
          if (file.size > maxSize * 1000 * 1000) {
            enqueue(
              `File exceeding size limit. Maximum allowed file size is ${maxSize} MB`,
              { variant: 'error' }
            )
            e.target.files = null
            e.preventDefault()
            return
          }
        }
      }
      onChange?.(e)
    }

    return (
      <input
        ref={ref}
        {...rest}
        className={clsx(
          'h-[40px] pr-2 file:h-full file:mr-2 bg-gray-100 rounded-lg file:bg-blue-500 file:px-3 file:py-2 file:text-white file:text-sm text-sm font-medium text-gray-500 file:hover:bg-blue-400 file:cursor-pointer file:font-bold file:rounded-lg file:focus:ring-2 file:focus:ring-blue-200 file:border-none file:outline-none focus:outline-none',
          className
        )}
        onChange={handleChange}
        type="file"
      />
    )
  }
)
