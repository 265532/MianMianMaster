export const APP_NAME = '面面俱到'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1'
export const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 15000

export const HTTP_MAX_RETRY_COUNT = 2
export const HTTP_RETRY_DELAY = 1000
export const HTTP_SLOW_REQUEST_THRESHOLD = 3000
export const HTTP_SLOW_REQUEST_MAX_LOGS = 20
