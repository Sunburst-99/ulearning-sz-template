import type { AxiosProgressEvent, AxiosResponse, GenericAbortSignal } from 'axios'
import request from './axios'

export interface HttpOption {
  url: string
  params?: any
  data?: any
  method?: string
  headers?: any
  onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void
  signal?: GenericAbortSignal
}

export interface Response<T = any> {
  result: T
  code: number
  message: string | null
  list: T
}

function http<T = any>(
  { url, params, data, method, headers, onDownloadProgress, signal }: HttpOption,
) {
  const successHandler = (res: AxiosResponse<Response<T>>) => {
    if (res.data?.code === 1) {
      return res.data.result || res.data.list
    } else {
      // 不标准的接口返回
      return res.data as T
    }
  }

  method = method || 'GET'

  return request({url, method, params, data, headers, signal, onDownloadProgress }).then(successHandler)
}

export function get<T = any>(
  { url, params, data, method = 'GET', headers }: HttpOption,
) {
  return http<T>({
    url,
    method,
    params,
    headers,
  })
}

export function post<T = any>(
  { url, params, data, method = 'POST', headers }: HttpOption,
) {
  return http<T>({
    url,
    method,
    params,
    data,
    headers
  })
}

export function del<T = any>(
  { url, params, data, method = 'DELETE', headers }: HttpOption,
) {
  return http<T>({
    url,
    method,
    params,
    data,
    headers,
  })
}

export function patch<T = any>(
  { url, params, data, method = 'PATCH' }: HttpOption,
) {
  return http<T>({
    url,
    method,
    params,
    data,
  })
}

export default post