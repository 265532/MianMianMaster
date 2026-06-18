export type NotificationType = 'system' | 'interview_result' | 'community' | 'learning';

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  content: string;
  type: NotificationType;
  is_read: boolean;
  link?: string;
  created_at: string;
}

export interface NotificationCreate {
  title: string;
  content: string;
  type: NotificationType;
  user_id: number;
  link?: string;
}

export interface NotificationPreferences {
  interview_reminder?: boolean;
  community_interaction?: boolean;
  learning_reminder?: boolean;
  system_announcement?: boolean;
}

export interface DeviceTokenRequest {
  device_token: string;
  platform: string;
}
