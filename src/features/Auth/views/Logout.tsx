import { useAuth0 } from '@auth0/auth0-react'
import { useEffect } from 'react'

import { Loader } from '@/components/Loader'

export function Logout() {
  const { logout } = useAuth0()

  useEffect(() => {
    logout({ returnTo: window.location.origin })
  }, [])

  return <Loader loadingText="Logging you out..." />
}
