// ============================================================
// notification 模块 — 自动生成类型骨架
// 来源: docs/api/schemas/notification.openapi.json
// 用途: 作为 src/api/types/ 下手动类型的参考基准，对齐后端 Schema
// ============================================================

export interface Notification {
  /** Id */
  id: number;

  /** Title */
  title: string;

  /** Content */
  content: string;

  /** Type */
  type: string;

  /** Is Read */
  is_read: boolean;

  /** Created At */
  created_at: string;

  /** Link */
  link?: string | null;

}

export interface NotificationPreferences {
  /** Email Notifications */
  email_notifications: boolean;

  /** Push Notifications */
  push_notifications: boolean;

  /** Interview Reminders */
  interview_reminders: boolean;

  /** Community Updates */
  community_updates: boolean;

  /** Learning Reminders */
  learning_reminders: boolean;

}

export interface NotificationPreferencesUpdate {
  /** Email Notifications */
  email_notifications?: boolean;

  /** Push Notifications */
  push_notifications?: boolean;

  /** Interview Reminders */
  interview_reminders?: boolean;

  /** Community Updates */
  community_updates?: boolean;

  /** Learning Reminders */
  learning_reminders?: boolean;

}

export interface DeviceTokenRegisterRequest {
  /** Token */
  token: string;

  /** Platform */
  platform: string;

}
