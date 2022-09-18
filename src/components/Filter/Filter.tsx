import { useRef, useState } from 'react'
import { MdOutlineFilterAlt } from 'react-icons/md'

import { useOnClickOutside } from '@/hooks/useOnClickOutside'

import { Button } from '../Button'
import { Checkbox } from '../Checkbox'
import { Option } from '../Select/Select'
import { Switch } from '../Switch'

type FilterType = 'select' | 'boolean' | 'range'

export interface Filter {
  label: string
  key: string
  type: FilterType
  options?: Option[]
}

interface FilterProps {
  filters: Filter[]
}

const renderFilter = (filter: Filter) => {
  switch (filter.type) {
    case 'boolean':
      return <Switch />
    case 'select':
      return (
        <>
          {filter.options?.map((opt) => (
            <div className="flex items-center" key={opt.value}>
              <Checkbox label={opt.label} />
            </div>
          ))}
        </>
      )
    case 'range':
      return null
  }
}

export default function Filter({ filters }: FilterProps) {
  const [open, setOpen] = useState(false)
  const filterRef = useRef<HTMLDivElement>(null)
  useOnClickOutside(filterRef, () => {
    setOpen(false)
  })

  return (
    <div className="relative" ref={filterRef}>
      <Button
        icon={<MdOutlineFilterAlt />}
        onClick={() => setOpen((prev) => !prev)}
      >
        Filter
      </Button>
      {open && (
        <div className="absolute top-[calc(100%+5px)] left-0 p-3 min-w-[240px] shadow bg-white rounded-lg z-50">
          <div className="flex items-center">
            <h5 className="font-semibold text-gray-900">Filter</h5>
            <div className="flex-grow"></div>
            <div className="text-blue-500 font-medium text-sm hover:text-blue-400 cursor-pointer">
              Clear all
            </div>
          </div>
          <div className="mt-3 space-y-5">
            {filters.map((it) => (
              <div key={it.key} className="flex flex-col">
                <label htmlFor={it.key} className="text-sm">
                  {it.label}
                </label>
                {renderFilter(it)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
