import axios from 'axios'
import type {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosError
} from 'axios'
import { getToken, removeToken } from './auth'
import { handleApiError, formatErrorMessage } from './error'
import { API_TIMEOUT, HTTP_MAX_RETRY_COUNT, HTTP_RETRY_DELAY, HTTP_SLOW_REQUEST_THRESHOLD, HTTP_SLOW_REQUEST_MAX_LOGS } from '@/config'

const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})

const DEBUG = import.meta.env.VITE_ENABLE_DEBUG_LOG === 'true'

const apiMetrics = {
  requests: 0,
  errors: 0,
  totalTime: 0,
  slowRequests: [] as { url: string; duration: number }[]
}

export function getApiMetrics() {
  return {
    ...apiMetrics,
    avgTime: apiMetrics.requests > 0 ? Math.round(apiMetrics.totalTime / apiMetrics.requests) : 0,
    errorRate: apiMetrics.requests > 0 ? Math.round((apiMetrics.errors / apiMetrics.requests) * 100) : 0
  }
}

declare module 'axios' {
  interface InternalAxiosRequestConfig {
    _retry?: number
    _startTime?: number
  }
}

service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      }
    }

    config._startTime = Date.now()
    apiMetrics.requests++

    if (DEBUG) {
      console.log(
        `[API Request] ${config.method?.toUpperCase()} ${config.url}`,
        config.params || config.data
      )
    }

    return config
  },
  (error: AxiosError) => {
    apiMetrics.errors++
    console.error('[API Request Error]', error)
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data, config } = response

    if (config._startTime) {
      const duration = Date.now() - config._startTime
      apiMetrics.totalTime += duration
      if (duration > HTTP_SLOW_REQUEST_THRESHOLD) {
        apiMetrics.slowRequests.push({ url: config.url || '', duration })
        if (apiMetrics.slowRequests.length > HTTP_SLOW_REQUEST_MAX_LOGS) {
          apiMetrics.slowRequests.shift()
        }
      }
    }

    if (DEBUG) {
      console.log(`[API Response] ${config.url}`, data)
    }

    if (data.code !== undefined && data.code !== 200) {
      handleApiError(data)
      return Promise.reject(new Error(data.message || '请求失败'))
    }

    return data
  },
  async (error: AxiosError) => {
    const { response, message, config } = error

    if (config?._startTime) {
      const duration = Date.now() - config._startTime
      apiMetrics.totalTime += duration
    }

    apiMetrics.errors++

    if (DEBUG) {
      console.error(`[API Error] ${config?.url}`, error)
    }

    const retryCount = config?._retry || 0
    const shouldRetry = !response && retryCount < HTTP_MAX_RETRY_COUNT && message !== 'cancel'

    if (shouldRetry && config) {
      config._retry = retryCount + 1
      console.warn(`[API Retry] ${config.url} (attempt ${config._retry}/${HTTP_MAX_RETRY_COUNT})`)

      await new Promise(resolve => setTimeout(resolve, HTTP_RETRY_DELAY * config._retry!))
      return service(config)
    }

    if (response) {
      switch (response.status) {
        case 401:
          removeToken()
          window.location.href = '/login'
          break
        case 403:
          console.error('[API Error] 没有权限访问')
          break
        case 404:
          console.error('[API Error] 请求的资源不存在')
          break
        case 500:
          console.error('[API Error] 服务器内部错误')
          break
        default:
          console.error(`[API Error] ${formatErrorMessage(error)}`)
      }
    } else if (message.includes('timeout')) {
      console.error('[API Error] 请求超时，请稍后重试')
    } else if (message.includes('Network')) {
      console.error('[API Error] 网络连接失败，请检查网络')
    } else {
      console.error(`[API Error] ${formatErrorMessage(error)}`)
    }

    return Promise.reject(error)
  }
)

export default service
