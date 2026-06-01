import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { notificationApi } from "@/api/modules/notification.api";
import type {
  Notification,
  NotificationPreferences,
} from "@/api/types/notification.types";

export const useNotificationStore = defineStore("notification", () => {
  const notifications = ref<Notification[]>([]);
  const preferences = ref<NotificationPreferences | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const unreadCount = computed(() =>
    notifications.value.filter((n) => !n.is_read).length,
  );

  const unreadNotifications = computed(() =>
    notifications.value.filter((n) => !n.is_read),
  );

  async function fetchNotifications(params?: {
    skip?: number;
    limit?: number;
  }): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      const response = await notificationApi.getNotifications(params);
      notifications.value = response.data;
    } catch (err: any) {
      error.value =
        err?.response?.data?.message || err?.message || "获取通知失败";
      console.error("[Notification] fetchNotifications error:", err);
    } finally {
      loading.value = false;
    }
  }

  async function fetchUnreadCount(): Promise<number> {
    try {
      const response = await notificationApi.getUnreadCount();
      return response.data;
    } catch (err: any) {
      console.error("[Notification] fetchUnreadCount error:", err);
      return 0;
    }
  }

  async function markAsRead(id: number): Promise<boolean> {
    try {
      await notificationApi.markAsRead(id);
      const notification = notifications.value.find((n) => n.id === id);
      if (notification) {
        notification.is_read = true;
      }
      return true;
    } catch (err: any) {
      error.value =
        err?.response?.data?.message || err?.message || "标记已读失败";
      console.error("[Notification] markAsRead error:", err);
      return false;
    }
  }

  async function markAllAsRead(): Promise<boolean> {
    try {
      await notificationApi.markAllAsRead();
      notifications.value.forEach((n) => {
        n.is_read = true;
      });
      return true;
    } catch (err: any) {
      error.value =
        err?.response?.data?.message || err?.message || "全部标记已读失败";
      console.error("[Notification] markAllAsRead error:", err);
      return false;
    }
  }

  async function fetchPreferences(): Promise<void> {
    try {
      const response = await notificationApi.getPreferences();
      preferences.value = response.data;
    } catch (err: any) {
      console.error("[Notification] fetchPreferences error:", err);
    }
  }

  async function updatePreferences(
    data: Partial<NotificationPreferences>,
  ): Promise<boolean> {
    try {
      const response = await notificationApi.updatePreferences(data);
      preferences.value = response.data;
      return true;
    } catch (err: any) {
      error.value =
        err?.response?.data?.message || err?.message || "更新偏好失败";
      console.error("[Notification] updatePreferences error:", err);
      return false;
    }
  }

  async function registerDeviceToken(data: {
    token: string;
    platform: string;
  }): Promise<boolean> {
    try {
      await notificationApi.registerDeviceToken(data);
      return true;
    } catch (err: any) {
      console.error("[Notification] registerDeviceToken error:", err);
      return false;
    }
  }

  return {
    notifications,
    preferences,
    loading,
    error,
    unreadCount,
    unreadNotifications,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    fetchPreferences,
    updatePreferences,
    registerDeviceToken,
  };
});
