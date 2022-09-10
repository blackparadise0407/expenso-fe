import { useAuth0 } from '@auth0/auth0-react'
import { FiSearch } from 'react-icons/fi'
import { MdNotifications } from 'react-icons/md'

import { TextField } from '@/components/TextField'

export default function Navigation() {
  const { user } = useAuth0()
  return (
    <nav className="flex items-center gap-3">
      <TextField
        className="w-[60%]"
        icon={<FiSearch />}
        inputProps={{
          placeholder: 'Search',
        }}
      />
      <div className="flex-grow"></div>
      <MdNotifications className="text-gray-400 text-xl" />
      <img className="w-8 h-8 rounded-full shadow" src={user?.picture} alt="" />
    </nav>
  )
}
