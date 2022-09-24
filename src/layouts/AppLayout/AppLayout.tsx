import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react'
import { Suspense, useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'

import { attachAccessToken } from '@/apis/httpClient'
import { Loader } from '@/components/Loader'
import { useCategoriesQuery } from '@/hooks/useCategoriesQuery'

import Navigation from './Navigation'
import Sidebar from './Sidebar/Sidebar'

export default withAuthenticationRequired(
  function AppLayout() {
    const [ready, setReady] = useState(false)
    const { getAccessTokenSilently } = useAuth0()
    useCategoriesQuery(ready)

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
        <main
          id="main"
          className="flex-1 px-10 py-10 space-y-5 overflow-y-auto overflow-x-hidden"
        >
          <Navigation />
          <Suspense fallback={<Loader />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    )
  },
  {
    onRedirecting: () => (
      <Loader className="!h-screen" loadingText="Checking your credentials" />
    ),
  }
)
