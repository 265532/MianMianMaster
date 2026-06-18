// ============================================================
// system 模块 — 自动生成类型骨架
// 来源: docs/api/schemas/system.openapi.json
// 用途: 作为 src/api/types/ 下手动类型的参考基准，对齐后端 Schema
// ============================================================

export interface SystemConfigCreate {
  /** Key */
  key: string;

  /** Value */
  value: string;

  /** Description */
  description?: string | null;

}

export interface SystemConfig {
  /** Key */
  key: string;

  /** Value */
  value: string;

  /** Description */
  description?: string | null;

}

export interface SystemHealth {
  /** Status */
  status: string;

  /** Version */
  version: string;

  /** Uptime */
  uptime: number;

  /** Database */
  database: string;

  /** Redis */
  redis: string;

}

export interface SystemAnnouncement {
  /** Id */
  id: number;

  /** Title */
  title: string;

  /** Content */
  content: string;

  /** Type */
  type: string;

  /** Start Time */
  start_time: string;

  /** End Time */
  end_time?: string | null;

  /** Is Active */
  is_active: boolean;

}

export interface AuditLog {
  /** Id */
  id: number;

  /** User Id */
  user_id: number;

  /** Username */
  username?: string | null;

  /** Action */
  action: string;

  /** Resource */
  resource: string;

  /** Detail */
  detail?: string | null;

  /** Ip Address */
  ip_address?: string | null;

  /** Created At */
  created_at: string;

}
