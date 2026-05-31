import { describe, it, expect } from 'vitest'
import { handleApiError, formatErrorMessage, isNetworkError, isTimeoutError, ERROR_CODE_MAP } from '../error'

describe('error utils', () => {
  describe('ERROR_CODE_MAP', () => {
    it('should contain common HTTP error codes', () => {
      expect(ERROR_CODE_MAP[400]).toBe('请求参数错误')
      expect(ERROR_CODE_MAP[401]).toBe('未授权，请登录')
      expect(ERROR_CODE_MAP[403]).toBe('拒绝访问')
      expect(ERROR_CODE_MAP[404]).toBe('资源不存在')
      expect(ERROR_CODE_MAP[500]).toBe('服务器内部错误')
    })
  })

  describe('formatErrorMessage', () => {
    it('should return string as-is', () => {
      expect(formatErrorMessage('custom error')).toBe('custom error')
    })

    it('should extract message from Axios error response', () => {
      const error = { response: { data: { message: 'server error msg' } } }
      expect(formatErrorMessage(error)).toBe('server error msg')
    })

    it('should extract error.message', () => {
      const error = { message: 'network error' }
      expect(formatErrorMessage(error)).toBe('network error')
    })

    it('should prioritize response.data.message over error.message', () => {
      const error = { response: { data: { message: 'response msg' } }, message: 'error msg' }
      expect(formatErrorMessage(error)).toBe('response msg')
    })

    it('should return default message for unknown error', () => {
      expect(formatErrorMessage(null)).toBe('未知错误')
      expect(formatErrorMessage(undefined)).toBe('未知错误')
      expect(formatErrorMessage(123)).toBe('未知错误')
    })
  })

  describe('isNetworkError', () => {
    it('should detect network error', () => {
      expect(isNetworkError({ message: 'Network Error' })).toBe(true)
    })

    it('should not detect response error as network error', () => {
      expect(isNetworkError({ response: { status: 500 }, message: 'Server Error' })).toBe(false)
    })

    it('should not detect error without message', () => {
      expect(isNetworkError({})).toBe(false)
    })
  })

  describe('isTimeoutError', () => {
    it('should detect ECONNABORTED error', () => {
      expect(isTimeoutError({ code: 'ECONNABORTED' })).toBe(true)
    })

    it('should detect timeout in message', () => {
      expect(isTimeoutError({ message: 'timeout of 15000ms exceeded' })).toBe(true)
    })

    it('should not detect non-timeout error', () => {
      expect(isTimeoutError({ code: 'ERR_NETWORK', message: 'Network Error' })).toBe(false)
    })
  })

  describe('handleApiError', () => {
    it('should not throw for client errors', () => {
      expect(() => handleApiError({ code: 400, message: 'bad request' })).not.toThrow()
    })

    it('should not throw for server errors', () => {
      expect(() => handleApiError({ code: 500, message: 'internal error' })).not.toThrow()
    })
  })
})
