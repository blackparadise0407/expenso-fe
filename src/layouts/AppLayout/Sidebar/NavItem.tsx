import clsx from 'clsx'
import { NavLink } from 'react-router-dom'

export interface NavItemData {
  to: string
  title: string
  icon: React.ReactNode
}

interface NavItemProps {
  data: NavItemData
}

export default function NavItem({ data }: NavItemProps) {
  return (
    <NavLink className="relative block px-5 xl:px-10" to={data.to}>
      {({ isActive }) => (
        <div
          className={clsx(
            'px-5 py-2 rounded-xl font-medium flex items-center gap-3 transition-all',
            isActive
              ? 'font-bold text-black bg-white shadow'
              : 'text-white hover:font-bold hover:text-black hover:bg-white hover:shadow'
          )}
        >
          <span className="text-lg">{data.icon}</span> <span>{data.title}</span>
          {isActive && (
            <div className="absolute top-0 right-0 w-[6px] h-full rounded-l bg-blue-200 shadow" />
          )}
        </div>
      )}
    </NavLink>
  )
}
