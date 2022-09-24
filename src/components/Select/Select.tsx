import clsx from 'clsx'
import RCTooltip from 'rc-tooltip'
import {
  ChangeEventHandler,
  forwardRef,
  memo,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { MdKeyboardArrowDown } from 'react-icons/md'

import { useOnClickOutside } from '@/hooks/useOnClickOutside'

import { Empty } from '../Empty'

export interface Option<T = string> {
  value: T
  label: string
}

export interface SelectChangeFn {
  (value: string | number): void
}

export interface SelectProps {
  options?: Array<Option>
  defaultOpen?: boolean
  placeholder?: string
  enableSearch?: boolean
  value?: string | number
  emptyContent?: ReactNode
  wrapperCls?: string
  onChange?: SelectChangeFn
}

const Select = forwardRef<HTMLDivElement, SelectProps>(function Select(
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
  const ulRef = useRef<HTMLUListElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useOnClickOutside(divRef, (e) => {
    const el = ulRef.current
    if (!el || el.contains(e.target as Node)) {
      return
    }
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

  useEffect(() => {
    const main = document.getElementById('main')!
    if (open) {
      main.style.overflowY = 'hidden'
    } else {
      main.style.overflowY = 'auto'
    }
  }, [open])

  return (
    <RCTooltip
      placement="bottomLeft"
      visible={open}
      destroyTooltipOnHide
      zIndex={100}
      overlayStyle={{
        width: divRef.current?.clientWidth,
        padding: '5px 0',
      }}
      overlay={
        <ul
          ref={ulRef}
          className="max-h-[500px] rounded-lg shadow bg-white overflow-y-auto"
        >
          {derivedOptions.length ? (
            derivedOptions.map((it, idx) => (
              <li
                key={idx}
                className={clsx(
                  'px-2 py-1.5 font-semibold text-gray-600 text-sm hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer truncate',
                  selectedOptionsIdx === idx &&
                    'bg-blue-500 text-white pointer-events-none'
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
          ) : (
            <div className="p-2 text-sm font-medium text-center">
              {emptyContent ? emptyContent : <Empty description="Empty" />}
            </div>
          )}
        </ul>
      }
    >
      <div className={clsx('w-full relative', wrapperCls)} ref={divRef}>
        <div
          className={clsx(
            'z-[5] relative h-[40px] flex items-center py-2 pl-3 pr-5 font-medium text-gray-900 rounded-lg bg-gray-100 outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer',
            open && 'outline-none ring-2 ring-blue-200'
          )}
          onClick={() => {
            setOpen((p) => !p)
          }}
          ref={ref}
        >
          <input
            ref={inputRef}
            className={clsx(
              'w-full font-medium outline-none border-none bg-transparent cursor-pointer',
              innerVal ? 'placeholder:text-gray-900' : 'placeholder:text-sm'
            )}
            placeholder={
              options[options.findIndex((it) => it.value === innerVal)]
                ?.label ?? placeholder
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
      </div>
    </RCTooltip>
  )
})

export default memo(Select)
