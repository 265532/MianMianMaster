export interface SystemConfig {
  key: string;
  value: string;
  description?: string;
}

export interface SystemHealth {
  status: string;
  version: string;
  uptime: number;
  database: string;
  redis: string;
}

export interface SystemAnnouncement {
  id: number;
  title: string;
  content: string;
  type: "info" | "warning" | "maintenance";
  start_time: string;
  end_time?: string;
  is_active: boolean;
}

export interface AuditLog {
  id: number;
  user_id: number;
  username?: string;
  action: string;
  resource: string;
  detail?: string;
  ip_address?: string;
  created_at: string;
}
