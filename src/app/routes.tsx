import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'

import { ROUTES } from '@/constants'
import { AppLayout } from '@/layouts/AppLayout'

const Dashboard = lazy(() => import('@/features/dashboard/views/Dashboard'))
const CategoryList = lazy(
  () => import('@/features/categories/views/CategoryList')
)
const Logout = lazy(() => import('@/features/auth/views/Logout'))

export const appRoutes: RouteObject[] = [
  {
    path: '',
    element: <AppLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: ROUTES.TRANSACTIONS, element: <Dashboard /> },
      { path: ROUTES.CATEGORIES, element: <CategoryList /> },
      { path: ROUTES.SETTINGS, element: <Dashboard /> },
      { path: ROUTES.LOGOUT, element: <Logout /> },
    ],
  },
  { path: '*', element: <>Not found </> },
]
