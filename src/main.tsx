import { Auth0Provider } from '@auth0/auth0-react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { parse, stringify } from 'query-string'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6'

import App from './app/App'
import { env } from './constants'
import './index.css'
import { queryClient } from './queryClient'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Auth0Provider
        domain={env.auth0.domain}
        clientId={env.auth0.clientId}
        audience={env.auth0.audience}
        redirectUri={window.location.origin}
      >
        <QueryClientProvider client={queryClient}>
          <QueryParamProvider
            adapter={ReactRouter6Adapter}
            options={{
              searchStringToObject: parse,
              objectToSearchString: stringify,
            }}
          >
            <App />
          </QueryParamProvider>
          {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
      </Auth0Provider>
    </BrowserRouter>
  </React.StrictMode>
)
