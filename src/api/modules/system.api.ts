import { get } from '@/utils/request'
import type { SystemConfig, SystemHealth, SystemAnnouncement } from '../types/system.types'
import type { ResponseModel } from '../types/response.types'

const BASE_URL = '/system'

export const systemApi = {
  getConfig(): Promise<ResponseModel<SystemConfig[]>> {
    return get<ResponseModel<SystemConfig[]>>(`${BASE_URL}/config`)
  },

  getHealth(): Promise<ResponseModel<SystemHealth>> {
    return get<ResponseModel<SystemHealth>>(`${BASE_URL}/health`)
  },

  getAnnouncements(): Promise<ResponseModel<SystemAnnouncement[]>> {
    return get<ResponseModel<SystemAnnouncement[]>>(`${BASE_URL}/announcements`)
  }
}
