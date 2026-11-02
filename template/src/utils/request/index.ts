import type { AxiosProgressEvent, AxiosResponse, GenericAbortSignal } from 'axios'
import request from './axios'
import { CanceledError } from 'axios'

export interface HttpOption {
  url: string
  params?: any
  data?: any
  method?: string
  headers?: any
  onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void
  signal?: GenericAbortSignal
  requestKey?: string | false // 默认按请求方法和 URL 分组；false 允许独立并发。
}

export interface Response<T = any> {
  result: T
  code: number
  message: string | null
  list: T
}

const pendingRequests = new Map<string, AbortController>()

async function http<T = any>(
  { url, params, data, method, headers, onDownloadProgress, signal, requestKey }: HttpOption,
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

  if (signal?.aborted) throw new CanceledError('请求已取消')
  const options = { url, method, params, data, headers, signal, onDownloadProgress }
  if (requestKey === false) return request(options).then(successHandler)

  const key = `${method.toUpperCase()}:${requestKey ?? url}`
  const controller = new AbortController()
  const previous = pendingRequests.get(key)
  pendingRequests.set(key, controller)
  previous?.abort()

  const abort = () => controller.abort()
  signal?.addEventListener?.('abort', abort)
  if (signal?.aborted) abort()
  try {
    const response = await request({ ...options, signal: controller.signal })
    if (controller.signal.aborted) throw new CanceledError('请求已取消')
    return successHandler(response)
  } catch (error) {
    if (controller.signal.aborted) throw new CanceledError('请求已取消')
    throw error
  } finally {
    signal?.removeEventListener?.('abort', abort)
    if (pendingRequests.get(key) === controller) pendingRequests.delete(key)
  }
}

export function get<T = any>({ method = 'GET', ...options }: HttpOption) {
  return http<T>({ ...options, method })
}

export function post<T = any>({ method = 'POST', ...options }: HttpOption) {
  return http<T>({ ...options, method })
}

export function del<T = any>({ method = 'DELETE', ...options }: HttpOption) {
  return http<T>({ ...options, method })
}

export function patch<T = any>({ method = 'PATCH', ...options }: HttpOption) {
  return http<T>({ ...options, method })
}

export default post
