import clsx from 'clsx'
import { forwardRef, useEffect, useRef, useState } from 'react'
import { MdKeyboardArrowDown } from 'react-icons/md'

import { useOnClickOutside } from '@/hooks/useOnClickOutside'

export interface Option {
  value: string | number | readonly string[] | undefined
  label: string
}

interface SelectProps {
  options?: Array<Option>
  defaultOpen?: boolean
  placeholder?: string
  value?: string | number | readonly string[]
  onChange?: (value?: string | number | readonly string[]) => void
}

export default forwardRef<HTMLDivElement, SelectProps>(function Select(
  {
    options = [],
    defaultOpen = false,
    value,
    placeholder,
    onChange = () => {},
  }: SelectProps,
  ref
) {
  const [innerVal, setInnerVal] = useState(value)
  const [open, setOpen] = useState(defaultOpen)
  const divRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useOnClickOutside(divRef, () => {
    setOpen(false)
  })

  const selectedOptionsIdx = options.findIndex((it) => it.value === innerVal)

  useEffect(() => {
    setInnerVal(value)
  }, [value])

  return (
    <div className="w-full relative" ref={divRef}>
      <div
        className={clsx(
          'z-[1] relative h-[40px] flex items-center py-2 pl-3 pr-5 font-medium text-gray-900 rounded-lg bg-gray-100 outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer',
          open && 'outline-none ring-2 ring-blue-200'
        )}
        onClick={() => {
          setOpen(true)
          inputRef.current?.focus()
        }}
        ref={ref}
      >
        {!innerVal ? (
          placeholder && (
            <p className="text-gray-400 truncate text-sm">{placeholder}</p>
          )
        ) : (
          <div className="truncate">
            {options[options.findIndex((it) => it.value === innerVal)].label}
          </div>
        )}
        <MdKeyboardArrowDown
          className={clsx(
            'absolute top-1/2 right-1 -translate-y-1/2 text-lg transition-transform',
            open && 'rotate-180'
          )}
        />
      </div>
      {open && (
        <ul className="absolute max-h-[500px] top-[calc(100%+5px)] left-0 w-full rounded-lg shadow bg-white z-10 overflow-y-auto">
          {options.map((it, idx) => (
            <li
              key={idx}
              className={clsx(
                'px-2 py-1.5 font-semibold text-gray-600 text-sm hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer',
                selectedOptionsIdx === idx &&
                  'bg-blue-500 text-white hover:bg-blue-400 hover:text-white'
              )}
              onClick={() => {
                setInnerVal(it.value)
                setOpen(false)
                onChange(it.value)
              }}
            >
              {it.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
})
