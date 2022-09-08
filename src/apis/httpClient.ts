import axios, { AxiosError, AxiosRequestConfig, Method } from 'axios'
import qs from 'query-string'

import { env } from '@/constants'

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
    return Promise.reject(err.message)
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
