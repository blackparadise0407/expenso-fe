export const env = {
  auth0: {
    clientId: import.meta.env.VITE_APP_AUTH0_CLIENT_ID,
    domain: import.meta.env.VITE_APP_AUTH0_DOMAIN,
    audience: import.meta.env.VITE_APP_AUTH0_AUDIENCE,
  },
  api: {
    baseUrl: import.meta.env.VITE_APP_API_BASE_URL,
  },
}

export const ROUTES = {
  DASHBOARD: '/',
  TRANSACTIONS: 'transactions',
  CATEGORIES: 'categories',
  SETTINGS: 'settings',
  LOGOUT: 'logout',
}
