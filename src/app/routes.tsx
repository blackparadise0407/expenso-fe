/* eslint-disable @typescript-eslint/ban-ts-comment */
import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'

import { ROUTES } from '@/constants'
import { AppLayout } from '@/layouts/AppLayout'

const Dashboard = lazy(
  // @ts-ignore
  () => import('@/features/dashboard/views/DashboardView')
)
const CategoryList = lazy(() =>
  import('@/features/categories/views/CategoryList').then((m) => ({
    default: m.CategoryList,
  }))
)
const TransactionList = lazy(() =>
  import('@/features/transactions/views/TransactionList').then((m) => ({
    default: m.TransactionList,
  }))
)
// @ts-ignore
const Logout = lazy(() => import('@/features/auth/views/Logout'))

export const appRoutes: RouteObject[] = [
  {
    path: '',
    element: <AppLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: ROUTES.TRANSACTIONS, element: <TransactionList /> },
      { path: ROUTES.CATEGORIES, element: <CategoryList /> },
      { path: ROUTES.SETTINGS, element: <Dashboard /> },
      { path: ROUTES.LOGOUT, element: <Logout /> },
    ],
  },
  { path: '*', element: <>Not found </> },
]
