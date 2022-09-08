import {
  MdOutlineCategory,
  MdOutlineCreditCard,
  MdOutlineDashboard,
  MdOutlineLogout,
  MdOutlineSettings,
} from 'react-icons/md'

import { ROUTES } from '@/constants'

import NavItem, { NavItemData } from './NavItem'

const navItems: NavItemData[] = [
  { title: 'Dashboard', to: '/', icon: <MdOutlineDashboard /> },
  {
    title: 'Transactions',
    to: '/' + ROUTES.TRANSACTIONS,
    icon: <MdOutlineCreditCard />,
  },
  {
    title: 'Categories',
    to: '/' + ROUTES.CATEGORIES,
    icon: <MdOutlineCategory />,
  },
  { title: 'Settings', to: '/' + ROUTES.SETTINGS, icon: <MdOutlineSettings /> },
  { title: 'Logout', to: '/' + ROUTES.LOGOUT, icon: <MdOutlineLogout /> },
]

export default function Sidebar() {
  return (
    <aside className="min-w-[200px] w-full max-w-[20%] bg-blue-500 py-10">
      <h3 className="text-center font-medium text-white">Expenso</h3>
      <ul className="mt-10 flex flex-col gap-5">
        {navItems.map((navItem, idx) => (
          <li key={idx}>
            <NavItem data={navItem} />
          </li>
        ))}
      </ul>
    </aside>
  )
}
