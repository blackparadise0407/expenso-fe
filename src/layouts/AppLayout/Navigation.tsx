import { useAuth0 } from '@auth0/auth0-react'
import { FiBell, FiSearch } from 'react-icons/fi'

import { IconButton } from '@/components/IconButton'
import { TextField } from '@/components/TextField'

export default function Navigation() {
  const { user } = useAuth0()
  return (
    <nav className="flex items-center gap-5">
      <TextField
        className="w-[60%]"
        icon={<FiSearch />}
        inputProps={{
          placeholder: 'Search',
        }}
      />
      <div className="flex-grow"></div>
      <IconButton icon={<FiBell className="text-blue-500" />} />
      <img
        className="w-[40px] h-[40px] rounded-full shadow"
        src={user?.picture}
        alt=""
      />
    </nav>
  )
}
