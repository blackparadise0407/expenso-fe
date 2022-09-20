import { produce } from 'immer'
import { memo, useCallback, useRef, useState } from 'react'
import { MdOutlineFilterAlt } from 'react-icons/md'

import { useOnClickOutside } from '@/hooks/useOnClickOutside'
import { isNullOrUndefined } from '@/utils/utils'

import { Button } from '../Button'
import { Checkbox } from '../Checkbox'
import { CheckboxProps } from '../Checkbox/Checkbox'
import { RangeInput } from '../RangeInput'
import { RangeInputProps } from '../RangeInput/RangeInput'
import { Option } from '../Select/Select'
import { Switch } from '../Switch'

type FilterType = 'select' | 'boolean' | 'range'

type FilterInputProps = CheckboxProps | RangeInputProps

interface InputProps extends Record<FilterType, FilterInputProps> {
  boolean: CheckboxProps
  range: RangeInputProps
}

type FilterValue = any

export interface Filter {
  label: string
  key: string
  type: FilterType
  options?: Option[]
  inputProps?: InputProps[Filter['type']]
}

interface FilterProps {
  filters: Filter[]
  onApply?: () => void
}

interface FilterChange {
  (key: string, value: FilterValue): void
}

interface FilterItemProps {
  filter: Filter
  value: FilterValue
  onChange: FilterChange
}

const FilterItem = memo(function FilterItem({
  filter,
  value,
  onChange,
}: FilterItemProps) {
  switch (filter.type) {
    case 'boolean':
      return (
        <Switch
          checked={value ?? ''}
          onChange={(e) => {
            onChange(filter.key, e.target.checked)
          }}
          {...filter.inputProps}
        />
      )
    case 'select':
      return (
        <div className="space-y-1">
          {filter.options?.map((opt) => (
            <div className="flex items-center" key={opt.value}>
              <Checkbox
                checked={
                  ((value as Array<string | number>) ?? []).findIndex(
                    (it) => it === opt.value
                  ) > -1
                }
                label={opt.label}
                onChange={() => {
                  onChange(filter.key, opt.value!)
                }}
              />
            </div>
          ))}
        </div>
      )
    case 'range':
      return (
        <RangeInput
          value={value ?? 0}
          onChange={(e) => {
            onChange(filter.key, e.target.value)
          }}
          {...filter.inputProps}
        />
      )
    default:
      return null
  }
})

export default function Filter({ filters, onApply = () => {} }: FilterProps) {
  const [open, setOpen] = useState(false)
  const filterRef = useRef<HTMLDivElement>(null)
  const [value, setValue] = useState<Record<string, FilterValue>>({})
  useOnClickOutside(filterRef, () => {
    setOpen(false)
  })

  const handleClearFilter = () => {
    setValue({})
  }

  const handleChange: FilterChange = useCallback(
    (k, v) => {
      const filterIdx = filters.findIndex((it) => it.key === k)
      const filter = filters[filterIdx]

      if (!filter) {
        return
      }

      setValue(
        produce((draft) => {
          const filterValue = draft[k]
          const filterType = filter.type

          if (filterType === 'range') {
            draft[k] = v
            return
          }

          if (filterType === 'select') {
            if (!isNullOrUndefined(draft[k])) {
              const _filterValue = (filterValue ?? []) as Array<any>
              const foundSelectOptIdx = _filterValue.findIndex((it) => it === v)
              if (foundSelectOptIdx > -1) {
                _filterValue.splice(foundSelectOptIdx, 1)
              } else {
                _filterValue.push(v)
              }
            } else {
              draft[k] = [v]
            }
            return
          }

          if (filterType === 'boolean') {
            draft[k] = v
            return
          }
        })
      )
    },
    [filters]
  )

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
            <div
              className="text-blue-500 font-medium text-sm hover:text-blue-400 cursor-pointer"
              onClick={() => setValue({})}
            >
              Clear all
            </div>
          </div>
          <div className="mt-3 space-y-5">
            {filters.map((it) => (
              <div key={it.key} className="flex flex-col">
                <label htmlFor={it.key} className="text-sm">
                  {it.label}
                </label>
                <FilterItem
                  value={value[it.key]}
                  filter={it}
                  onChange={handleChange}
                />
              </div>
            ))}
          </div>
          <Button block className="w-full mt-5" onClick={onApply}>
            Apply
          </Button>
        </div>
      )}
    </div>
  )
}
