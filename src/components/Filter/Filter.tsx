import { produce } from 'immer'
import { parse } from 'query-string'
import { Fragment, memo, useCallback, useEffect, useRef, useState } from 'react'
import { MdOutlineFilterAlt } from 'react-icons/md'
import { useLocation } from 'react-router-dom'

import { useOnClickOutside } from '@/hooks/useOnClickOutside'
import { isNullOrUndefined } from '@/utils/utils'

import { Button } from '../Button'
import { Checkbox } from '../Checkbox'
import { CheckboxProps } from '../Checkbox/Checkbox'
import RangeInput, { RangeInputProps } from '../RangeInput/RangeInput'
import RangeSlider, { RangeSliderProps } from '../RangeSlider/RangeSlider'
import { Option, SelectProps } from '../Select/Select'
import { Switch } from '../Switch'
import { SwitchProps } from '../Switch/Switch'

type FilterType = 'select' | 'boolean' | 'range' | 'rangeSlider'

type FilterConfig = {
  range: {
    minKey: string
    maxKey: string
  }
  boolean: never
  select: never
  rangeSlider: never
}

type InputProps = {
  boolean: CheckboxProps
  range: RangeInputProps
  select: SelectProps
  rangeSlider: RangeSliderProps
}

type FilterValue = any

export interface Filter {
  label: string
  key: string
  type: FilterType
  options?: Option[]
  inputProps?: InputProps[Filter['type']]
  config?: FilterConfig[Filter['type']]
}

type Value = Record<string, FilterValue>

export interface FilterApplyFn {
  (filters: Value): void
}

interface FilterProps {
  filters: Filter[]
  onApply?: FilterApplyFn
  onClear?: () => void
}

interface FilterChange {
  (key: string, value: FilterValue): void
}

interface FilterItemProps {
  filter: Filter
  allValues: Value
  value: FilterValue
  onChange: FilterChange
}

const FilterItem = memo(function FilterItem({
  filter,
  value,
  allValues,
  onChange,
}: FilterItemProps) {
  switch (filter.type) {
    case 'boolean':
      return (
        <Switch
          checked={isNullOrUndefined(value) ? '' : value}
          onChange={(e) => {
            onChange(filter.key, e.target.checked)
          }}
          {...(filter.inputProps as SwitchProps)}
        />
      )
    case 'select':
      return (
        <div className="space-y-1">
          {filter.options?.map((opt) => (
            <div className="flex items-center" key={opt.value}>
              <Checkbox
                checked={
                  (value
                    ? Array.isArray(value)
                      ? value
                      : [value]
                    : []
                  ).findIndex((it) => String(it) === opt.value) > -1
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
    case 'rangeSlider':
      return (
        <RangeSlider
          {...(filter.inputProps as RangeSliderProps)}
          onChange={(values) => {
            onChange(filter.key, values)
          }}
          values={value ?? [0, 0]}
        />
      )
    case 'range':
      // eslint-disable-next-line no-case-declarations
      const { minKey, maxKey } = filter.config!

      return (
        <RangeInput
          {...(filter.inputProps as RangeInputProps)}
          onChange={(value) => {
            onChange(filter.key, value)
          }}
          value={[allValues[minKey], allValues[maxKey]]}
        />
      )
    default:
      return null
  }
})

export default memo(function Filter({
  filters,
  onApply = () => {},
  onClear = () => {},
}: FilterProps) {
  const [open, setOpen] = useState(false)
  const filterRef = useRef<HTMLDivElement>(null)
  const [value, setValue] = useState<Value>({})
  const { search } = useLocation()

  useOnClickOutside(filterRef, () => {
    setOpen(false)
  })

  const handleClearFilter = () => {
    setValue({})
    onClear()
    setOpen(false)
  }

  const handleApplyFilter = () => {
    onApply(value)
    setOpen(false)
  }

  const handleChange: FilterChange = useCallback(
    (k, v) => {
      const filterIdx = filters.findIndex((it) => it.key === k)
      const filter = filters[filterIdx]

      if (filterIdx === -1) {
        return
      }

      setValue(
        produce((draft) => {
          const filterType = filter.type

          if (filterType === 'rangeSlider' || filterType === 'boolean') {
            draft[k] = v
            return
          }

          if (filterType === 'range') {
            const { minKey, maxKey } = filter.config!
            const [min, max] = v
            draft[minKey] = min
            draft[maxKey] = max
            return
          }

          if (filterType === 'select') {
            if (!isNullOrUndefined(draft[k])) {
              const foundSelectOptIdx = (
                (draft[k] ?? []) as string[]
              ).findIndex((it) => String(it) === v)
              if (foundSelectOptIdx > -1) {
                draft[k].splice(foundSelectOptIdx, 1)
              } else {
                draft[k].push(v)
              }
            } else {
              draft[k] = [v]
            }
            return
          }
        })
      )
    },
    [filters]
  )

  useEffect(() => {
    if (!search) {
      return
    }
    const queries = parse(search, {
      parseBooleans: true,
      arrayFormat: 'comma',
      parseNumbers: true,
    }) as Record<string, any>
    setValue(
      produce((draft) => {
        Object.keys(queries).forEach((key) => {
          const foundIdx = filters.findIndex((it) => it.key === key)
          if (foundIdx > -1) {
            const filterType = filters[foundIdx].type
            if (filterType === 'select') {
              draft[key] = Array(queries[key]).flat()
              return
            }

            if (filterType === 'rangeSlider') {
              draft[key] = Array(queries[key])
                .flat()
                .map((it) => Number(it))
                .sort((a, b) => a - b)
              return
            }
          }
          draft[key] = queries[key]
        })
      })
    )
  }, [search])

  return (
    <div className="relative" ref={filterRef}>
      <Button
        icon={<MdOutlineFilterAlt />}
        onClick={() => setOpen((prev) => !prev)}
      >
        Filter
      </Button>
      {open && (
        <div className="absolute top-[calc(100%+5px)] left-0  min-w-[240px] shadow bg-white rounded-lg z-50">
          <div className="flex items-center pt-3 px-3">
            <h5 className="font-semibold text-gray-900">Filter</h5>
            <div className="flex-grow"></div>
            <div
              className="text-blue-500 font-medium text-sm hover:text-blue-400 cursor-pointer"
              onClick={handleClearFilter}
            >
              Clear all
            </div>
          </div>
          <div className="mt-3">
            {filters.map((it) => (
              <Fragment key={it.key}>
                <hr />
                <div className="flex flex-col py-2 px-3">
                  <label htmlFor={it.key} className="text-sm mb-1">
                    {it.label}
                  </label>
                  <FilterItem
                    value={value[it.key]}
                    allValues={value}
                    filter={it}
                    onChange={handleChange}
                  />
                </div>
              </Fragment>
            ))}
          </div>
          <div className="pb-3 px-3">
            <Button block className="w-full mt-5" onClick={handleApplyFilter}>
              Apply
            </Button>
          </div>
        </div>
      )}
    </div>
  )
})
