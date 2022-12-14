import { forwardRef } from 'react'
import { getTrackBackground, Range } from 'react-range'
import type { IProps } from 'react-range/lib/types'

import './style.css'

export interface RangeSliderProps
  extends Pick<IProps, 'min' | 'max' | 'step' | 'values' | 'onChange'> {
  labelFormat?: (num: number) => string
}

export default forwardRef<Range, RangeSliderProps>(function RangeSlider(
  { min, max, step, values, labelFormat = (num) => num.toString(), ...rest },
  ref
) {
  return (
    <div className="flex flex-col">
      {typeof min !== 'undefined' && typeof max !== 'undefined' && (
        <div className="flex mb-2 text-sm text-gray-400 font-medium">
          {labelFormat(min)}
          <div className="flex-grow"></div>
          {labelFormat(max)}
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
            <div className="group-hover:opacity-100 group-active:opacity-100 opacity-0 absolute bottom-4 left-1/2 -translate-x-1/2 px-2 py-1 text-sm font-medium bg-white shadow rounded-lg">
              {labelFormat(value)}
            </div>
          </div>
        )}
        {...rest}
      />
    </div>
  )
})
