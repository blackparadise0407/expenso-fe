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
  value?: Date
  onChange?: (date?: Date) => void
}

export default forwardRef<HTMLInputElement, DatePickerProps>(
  function DatePicker({ value, onChange = () => {}, fullWidth = false }, ref) {
    const [selected, setSelected] = useState<Date | undefined>(value)
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
      setSelected(date)
      onChange(date)
      if (date) {
        setOpen(false)
      }
    }

    return (
      <div
        ref={divRef}
        className={clsx('relative cursor-pointer', fullWidth && 'w-full')}
      >
        <TextField
          ref={ref}
          fullWidth={fullWidth}
          icon={<MdCalendarToday />}
          className={clsx(selected ? 'text-gray-900' : 'text-gray-400')}
          inputProps={{
            value: selected
              ? dayjs(selected).format('DD/MM/YYYY')
              : 'DD/MM/YYYY',
            readOnly: true,
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
              selected={selected}
              onSelect={handleSelect}
            />
          </div>
        )}
      </div>
    )
  }
)
