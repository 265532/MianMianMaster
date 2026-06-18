import { get, post, put } from "@/utils/request";
import type {
  Notification,
  NotificationCreate,
  NotificationType,
  NotificationPreferences,
  DeviceTokenRequest,
} from "../types/notification.types";
import type { ResponseModel, PaginationParams } from "../types/response.types";

const BASE_URL = "/notifications";

export const notificationApi = {
  getNotifications(params?: PaginationParams): Promise<ResponseModel<Notification[]>> {
    return get<ResponseModel<Notification[]>>(`${BASE_URL}`, params as Record<string, unknown>);
  },

  createNotification(data: NotificationCreate): Promise<ResponseModel<Notification>> {
    return post<ResponseModel<Notification>>(`${BASE_URL}`, data);
  },

  getUnreadCount(): Promise<ResponseModel<number>> {
    return get<ResponseModel<number>>(`${BASE_URL}/unread-count`);
  },

  markAsRead(notificationId: number): Promise<ResponseModel<Notification>> {
    return put<ResponseModel<Notification>>(`${BASE_URL}/${notificationId}/read`, {});
  },

  markAllAsRead(): Promise<ResponseModel<string>> {
    return put<ResponseModel<string>>(`${BASE_URL}/read-all`, {});
  },

  getPreferences(): Promise<ResponseModel<NotificationPreferences>> {
    return get<ResponseModel<NotificationPreferences>>(`${BASE_URL}/preferences`);
  },

  updatePreferences(data: NotificationPreferences): Promise<ResponseModel<NotificationPreferences>> {
    return put<ResponseModel<NotificationPreferences>>(`${BASE_URL}/preferences`, data);
  },

  registerDeviceToken(data: DeviceTokenRequest): Promise<ResponseModel<string>> {
    return post<ResponseModel<string>>(`${BASE_URL}/device-token`, data);
  },
};
