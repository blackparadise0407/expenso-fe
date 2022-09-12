import clsx from 'clsx'
import dayjs from 'dayjs'
import {
  CSSProperties,
  forwardRef,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { DayPicker } from 'react-day-picker'
import { MdCalendarToday } from 'react-icons/md'

import { useOnClickOutside } from '@/hooks/useOnClickOutside'

import { TextField } from '../TextField'

import 'react-day-picker/dist/style.css'

interface DatePickerProps {
  fullWidth?: boolean
  value?: Date | number
  onChange?: (date?: Date) => void
}

export default forwardRef<HTMLInputElement, DatePickerProps>(
  function DatePicker({ value, onChange = () => {}, fullWidth = false }, ref) {
    const [open, setOpen] = useState(false)
    const divRef = useRef<HTMLDivElement>(null)
    const datePickerRef = useRef<HTMLDivElement>(null)
    const [style, setStyle] = useState<CSSProperties>({ left: 0 })

    useOnClickOutside(divRef, () => {
      setOpen(false)
    })

    useLayoutEffect(() => {
      if (datePickerRef.current) {
        const { left, width } = datePickerRef.current.getBoundingClientRect()
        if (left + width > window.innerWidth) {
          setStyle({
            right: 0,
          })
        }
      }
    }, [open, window.innerWidth])

    const handleSelect = (date?: Date) => {
      onChange(date)
      if (date) {
        setOpen(false)
      }
    }

    const parsedValue = dayjs(
      typeof value === 'number' ? value * 1000 : value
    ).format('DD/MM/YYYY')

    return (
      <div
        ref={divRef}
        className={clsx('relative cursor-pointer', fullWidth && 'w-full')}
      >
        <TextField
          ref={ref}
          fullWidth={fullWidth}
          icon={<MdCalendarToday />}
          className={clsx(value ? 'text-gray-900' : 'text-gray-400')}
          inputProps={{
            defaultValue: value ? parsedValue : undefined,
            readOnly: true,
            placeholder: 'dd/mm/yyyy',
            onClick: () => setOpen(true),
          }}
        />
        {open && (
          <div
            className="absolute z-[1] top-[calc(100%+10px)] rounded-lg bg-white shadow p-3"
            ref={datePickerRef}
            style={style}
          >
            <DayPicker
              className="m-2"
              mode="single"
              selected={typeof value === 'number' ? new Date(value) : value}
              onSelect={handleSelect}
            />
          </div>
        )}
      </div>
    )
  }
)
