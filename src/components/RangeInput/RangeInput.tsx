import { forwardRef } from 'react'
import { getTrackBackground, Range } from 'react-range'
import type { IProps } from 'react-range/lib/types'

import './style.css'

export type RangeInputProps = Pick<
  IProps,
  'min' | 'max' | 'step' | 'values' | 'onChange'
>

export default forwardRef<Range, RangeInputProps>(function RangeInput(
  { min, max, step, values, ...rest },
  ref
) {
  return (
    <div className="flex flex-col">
      {typeof min !== 'undefined' && typeof max !== 'undefined' && (
        <div className="flex mb-2 text-sm text-gray-400 font-medium">
          {min}
          <div className="flex-grow"></div>
          {max}
        </div>
      )}
      <Range
        ref={ref}
        step={step}
        draggableTrack
        min={min}
        max={max}
        values={values}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            className="w-full h-[6px] rounded-lg"
            style={{
              ...props.style,
              background: getTrackBackground({
                min,
                max,
                values,
                colors: ['#e5e7eb', '#3b82f6', '#e5e7eb'],
              }),
            }}
          >
            {children}
          </div>
        )}
        renderThumb={({ props, value }) => (
          <div
            {...props}
            className="relative w-[15px] h-[15px] rounded-full bg-white border-2 border-blue-500 group"
          >
            <div className="group-hover:opacity-100 opacity-0 absolute bottom-4 left-1/2 -translate-x-1/2 px-2 py-1 text-sm font-medium bg-white shadow rounded-lg">
              {value}
            </div>
          </div>
        )}
        {...rest}
      />
    </div>
  )
})
