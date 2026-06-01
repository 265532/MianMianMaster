export interface Notification {
  id: number;
  title: string;
  content: string;
  type: "system" | "interview" | "community" | "learning";
  is_read: boolean;
  created_at: string;
  link?: string;
}

export interface NotificationPreferences {
  email_notifications: boolean;
  push_notifications: boolean;
  interview_reminders: boolean;
  community_updates: boolean;
  learning_reminders: boolean;
}
