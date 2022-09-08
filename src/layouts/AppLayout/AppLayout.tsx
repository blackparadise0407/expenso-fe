import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react'
import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'

import { attachAccessToken } from '@/apis/httpClient'

import Navigation from './Navigation'
import Sidebar from './Sidebar/Sidebar'

export default withAuthenticationRequired(
  function AppLayout() {
    const [ready, setReady] = useState(false)
    const { getAccessTokenSilently } = useAuth0()

    useEffect(() => {
      async function eff() {
        const accessToken = await getAccessTokenSilently()
        attachAccessToken(accessToken)
        setReady(true)
      }
      eff()
    }, [getAccessTokenSilently])

    if (!ready) return null

    return (
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 px-5 py-10">
          <Navigation />
          <Outlet />
        </main>
      </div>
    )
  },
  {
    onRedirecting: () => <div>Redirecting you to the login page...</div>,
  }
)
