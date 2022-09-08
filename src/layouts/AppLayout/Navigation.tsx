import { FiSearch } from 'react-icons/fi'
import { MdNotifications } from 'react-icons/md'

import { TextField } from '@/components/TextField'

export default function Navigation() {
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
      <MdNotifications className="text-gray-400" />
      <img
        className="w-8 h-8 rounded-full shadow"
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuFnW3H7aIcQzD2WB5jZDE6wsFvuDf9twfgw&usqp=CAU"
        alt=""
      />
    </nav>
  )
}
