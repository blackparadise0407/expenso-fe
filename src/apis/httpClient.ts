import axios, { AxiosError, AxiosRequestConfig, Method } from 'axios'
import qs from 'query-string'

import { env } from '@/constants'

interface HttpError {
  path: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: any
  message: string
  status: number
  timestamp: number
}

const client = axios.create({
  baseURL: env.api.baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer: (params) => qs.stringify(params),
})

export const attachAccessToken = (accessToken: string) =>
  client.interceptors.request.use((config) => {
    config.headers!['Authorization'] = `Bearer ${accessToken}`
    return config
  })

client.interceptors.response.use(
  (response) => response.data,
  (err: AxiosError) => {
    const error = err.response?.data as HttpError
    const errors = error.errors
    let computedMessage = ''
    if (Array.isArray(errors)) {
      computedMessage = Object.values(errors[0].errors)[0] as string
    }
    return Promise.reject(computedMessage || error.message || err.message)
  }
)

export const httpClient = <TData>(
  method: Method,
  url: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any,
  config: AxiosRequestConfig = {}
) => {
  const cfg: AxiosRequestConfig = {
    method,
    url,
    ...config,
  }
  if (method === 'GET' || method === 'get') {
    cfg.params = data
  } else {
    cfg.data = data
  }
  return client.request(cfg) as unknown as Promise<TData>
}
