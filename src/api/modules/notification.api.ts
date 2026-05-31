import { get, post, put } from '@/utils/request'
import type { Notification, NotificationPreferences } from '../types/notification.types'
import type { ResponseModel } from '../types/response.types'

const BASE_URL = '/notifications'

export const notificationApi = {
  getNotifications(params?: { skip?: number; limit?: number }): Promise<ResponseModel<Notification[]>> {
    return get<ResponseModel<Notification[]>>(`${BASE_URL}`, params as Record<string, any>)
  },

  getUnreadCount(): Promise<ResponseModel<number>> {
    return get<ResponseModel<number>>(`${BASE_URL}/unread-count`)
  },

  markAsRead(id: number): Promise<ResponseModel<string>> {
    return put<ResponseModel<string>>(`${BASE_URL}/${id}/read`, {})
  },

  markAllAsRead(): Promise<ResponseModel<string>> {
    return put<ResponseModel<string>>(`${BASE_URL}/read-all`, {})
  },

  getPreferences(): Promise<ResponseModel<NotificationPreferences>> {
    return get<ResponseModel<NotificationPreferences>>(`${BASE_URL}/preferences`)
  },

  updatePreferences(data: Partial<NotificationPreferences>): Promise<ResponseModel<NotificationPreferences>> {
    return put<ResponseModel<NotificationPreferences>>(`${BASE_URL}/preferences`, data)
  },

  registerDeviceToken(data: { token: string; platform: string }): Promise<ResponseModel<string>> {
    return post<ResponseModel<string>>(`${BASE_URL}/device-token`, data)
  }
}
