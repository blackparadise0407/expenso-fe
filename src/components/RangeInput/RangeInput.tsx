import clsx from 'clsx'
import { forwardRef, useCallback, useEffect, useId, useState } from 'react'

import { isNullOrUndefined } from '@/utils/utils'

import './style.css'

export type RangeInputProps = React.InputHTMLAttributes<HTMLInputElement>

export default forwardRef<HTMLInputElement, RangeInputProps>(
  function RangeInput({ className, value, min, max, ...rest }, ref) {
    const id = useId()
    const [progress, setProgress] = useState('')

    const pos = progress.split(' ')[0] ?? '0%'

    const handleInputChange = useCallback(() => {
      if (
        !isNullOrUndefined(value) &&
        !isNullOrUndefined(min) &&
        !isNullOrUndefined(max)
      ) {
        const _min = parseFloat(min as string)
        const _max = parseFloat(max as string)
        const val = parseFloat(value as string)
        const delta = _max - _min || 1
        setProgress(((val - _min) * 100) / delta + '% 100%')
      }
    }, [value])

    useEffect(() => {
      handleInputChange()
    }, [value, handleInputChange])

    return (
      <div className="relative flex flex-col">
        {typeof min !== 'undefined' && typeof max !== 'undefined' && (
          <div className="flex text-sm text-gray-400 font-medium">
            {min}
            <div className="flex-grow"></div>
            {max}
          </div>
        )}
        <input
          id={id}
          ref={ref}
          type="range"
          min={min}
          max={max}
          value={value}
          style={{ backgroundSize: progress }}
          {...rest}
          className={clsx('peer', className)}
        />
        {!isNullOrUndefined(value) && (
          <span
            className="peer-hover:opacity-100 opacity-0 absolute -translate-x-1/2 -translate-y-[15px] p-1 text-sm font-medium text-blue-500 grid place-content-center bg-white rounded-lg shadow transition-opacity"
            style={{
              left: pos,
            }}
          >
            {value}
          </span>
        )}
      </div>
    )
  }
)
