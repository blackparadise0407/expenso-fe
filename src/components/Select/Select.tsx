import clsx from 'clsx'
import {
  ChangeEventHandler,
  forwardRef,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { MdKeyboardArrowDown } from 'react-icons/md'

import { useOnClickOutside } from '@/hooks/useOnClickOutside'

export interface Option<T = string> {
  value: T | undefined
  label: string
}

export interface SelectChangeFn {
  (value?: string | number): void
}

interface SelectProps {
  options?: Array<Option>
  defaultOpen?: boolean
  placeholder?: string
  enableSearch?: boolean
  value?: string | number
  emptyContent?: ReactNode
  wrapperCls?: string
  onChange?: SelectChangeFn
}

export default forwardRef<HTMLDivElement, SelectProps>(function Select(
  {
    options = [],
    defaultOpen = false,
    value,
    placeholder,
    enableSearch = true,
    emptyContent,
    wrapperCls,
    onChange = () => {},
  }: SelectProps,
  ref
) {
  const [innerVal, setInnerVal] = useState(value)
  const [open, setOpen] = useState(defaultOpen)
  const divRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const selectDivRef = useRef<HTMLInputElement>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useOnClickOutside(divRef, () => {
    setOpen(false)
  })

  const handleSearch: ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearchTerm(e.target.value)
  }

  const derivedOptions = useMemo(() => {
    if (!searchTerm) return options
    return options.filter((it) => new RegExp(searchTerm).test(it.label))
  }, [searchTerm, options])

  const selectedOptionsIdx = derivedOptions.findIndex(
    (it) => it.value === innerVal
  )

  useEffect(() => {
    setInnerVal(value)
  }, [value])

  useEffect(() => {
    if (!open && inputRef.current) {
      inputRef.current.value = ''
      setSearchTerm('')
    }
  }, [open])

  return (
    <div className={clsx('w-full relative', wrapperCls)} ref={divRef}>
      <div
        className={clsx(
          'z-[5] relative h-[40px] flex items-center py-2 pl-3 pr-5 font-medium text-gray-900 rounded-lg bg-gray-100 outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer',
          open && 'outline-none ring-2 ring-blue-200'
        )}
        onClick={() => {
          setOpen(true)
          selectDivRef.current?.focus()
        }}
        ref={ref}
      >
        <input
          ref={inputRef}
          className={clsx(
            'w-full font-medium outline-none border-none bg-transparent',
            innerVal ? 'placeholder:text-gray-900' : 'placeholder:text-sm'
          )}
          placeholder={
            options[options.findIndex((it) => it.value === innerVal)]?.label ??
            placeholder
          }
          onChange={handleSearch}
          readOnly={!enableSearch}
        />
        <MdKeyboardArrowDown
          className={clsx(
            'absolute top-1/2 right-1 -translate-y-1/2 text-lg transition-transform',
            open && 'rotate-180'
          )}
        />
      </div>
      {open && (
        <ul className="absolute max-h-[500px] top-[calc(100%+5px)] left-0 w-full rounded-lg shadow bg-white z-10 overflow-y-auto">
          {derivedOptions.length ? (
            derivedOptions.map((it, idx) => (
              <li
                key={idx}
                className={clsx(
                  'px-2 py-1.5 font-semibold text-gray-600 text-sm hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer truncate',
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
            ))
          ) : emptyContent ? (
            emptyContent
          ) : (
            <div className="p-2 text-sm font-medium text-center">Empty</div>
          )}
        </ul>
      )}
    </div>
  )
})
