import clsx from 'clsx'

interface PaginationItemProps {
  children: React.ReactNode
  active?: boolean
  disabled?: boolean
  onClick?: () => void
}

export default function PaginationItem({
  children,
  active = false,
  disabled = false,
  onClick = () => {},
}: PaginationItemProps) {
  return (
    <div
      className={clsx(
        'w-[30px] h-[30px] grid place-content-center font-medium bg-white hover:bg-blue-400 hover:!border-blue-400 hover:text-white border border-transparent shadow rounded cursor-pointer transition-colors',
        active && '!border-blue-500 text-blue-500',
        disabled && 'text-gray-500 pointer-events-none'
      )}
      onClick={() => {
        if (disabled) {
          return
        }
        onClick()
      }}
    >
      {children}
    </div>
  )
}
