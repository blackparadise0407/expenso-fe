import { Suspense } from 'react'
import { useRoutes } from 'react-router-dom'

import { appRoutes } from './routes'

export default function App() {
  return <Suspense fallback="Loading...">{useRoutes(appRoutes)}</Suspense>
}
