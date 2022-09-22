import { produce } from 'immer'
import { ChangeEventHandler, forwardRef, memo, useState } from 'react'

import { useMountedEffect } from '@/hooks/useMountedEffect'

import { TextField } from '../TextField'

type Value = string | number

type RangeInputValue = [Value, Value]

interface RangeInputChangeFn {
  (value: RangeInputValue): void
}

export interface RangeInputProps {
  value?: RangeInputValue
  onChange?: RangeInputChangeFn
}

const RangeInput = forwardRef<HTMLInputElement, RangeInputProps>(
  function RangeInput({ value = ['', ''], onChange = () => {} }, ref) {
    const [innerVal, setInnerVal] = useState<RangeInputValue>(value)
    const [min, max] = value

    const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
      const val = e.target.value ?? ''
      setInnerVal(
        produce((draft) => {
          draft[e.target.name === 'min' ? 0 : 1] = val
        })
      )
    }

    const handleBlur: ChangeEventHandler<HTMLInputElement> = (e) => {
      const val = e.target.value

      if (
        e.target.name === 'max' &&
        innerVal[0] !== '' &&
        +val < +innerVal[0]
      ) {
        setInnerVal(
          produce((draft) => {
            draft[1] = draft[0]
          })
        )
        return
      }
      if (
        e.target.name === 'min' &&
        innerVal[1] !== '' &&
        +val > +innerVal[1]
      ) {
        setInnerVal(
          produce((draft) => {
            draft[0] = draft[1]
          })
        )
        return
      }
    }

    useMountedEffect(
      (mounted) => {
        mounted() && onChange(innerVal)
      },
      [innerVal[0], innerVal[1]]
    )

    return (
      <div className="flex gap-2 items-center">
        <TextField
          ref={ref}
          small
          inputProps={{
            value: min,
            autoComplete: 'off',
            name: 'min',
            className: 'min-w-[30px] max-w-[65px]',
            placeholder: 'Min',
            onChange: handleChange,
            onKeyDown: (e) => {
              if (!/^[0-9]*$/.test(e.key) && e.key !== 'Backspace') {
                e.preventDefault()
              }
            },
            onBlur: handleBlur,
          }}
        />
        <div className="flex-grow"></div>
        <span className="text-sm font-medium text-gray-900">to</span>
        <div className="flex-grow"></div>

        <TextField
          small
          inputProps={{
            value: max,
            name: 'max',
            autoComplete: 'off',
            className: 'min-w-[30px] max-w-[65px]',
            placeholder: 'Max',
            onChange: handleChange,
            onKeyDown: (e) => {
              if (!/^[0-9]*$/.test(e.key) && e.key !== 'Backspace') {
                e.preventDefault()
              }
            },
            onBlur: handleBlur,
          }}
        />
      </div>
    )
  }
)

export default memo(RangeInput)
