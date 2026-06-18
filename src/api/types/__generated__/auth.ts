// ============================================================
// auth 模块 — 自动生成类型骨架
// 来源: docs/api/schemas/auth.openapi.json
// 用途: 作为 src/api/types/ 下手动类型的参考基准，对齐后端 Schema
// ============================================================

export interface LoginRequest {
  /** Username */
  username: string;

  /** Password */
  password: string;

}

export interface UserCreate {
  /** Username */
  username: string;

  /** Email */
  email: string;

  /** Phone */
  phone?: string | null;

  /** Is Active */
  is_active?: boolean;

  /** Password */
  password: string;

  /** Role Ids */
  role_ids?: number[];

}

export interface RefreshTokenRequest {
  /** Refresh Token */
  refresh_token: string;

}

export interface SmsSendRequest {
  /** Phone */
  phone: string;

}

export interface SmsLoginRequest {
  /** Phone */
  phone: string;

  /** Code */
  code: string;

}

export interface PasswordResetTokenRequest {
  /** Email */
  email: string;

}

export interface PasswordResetRequest {
  /** Token */
  token: string;

  /** New Password */
  new_password: string;

}

export interface Token {
  /** Access Token */
  access_token: string;

  /** Refresh Token */
  refresh_token: string;

  /** Token Type */
  token_type?: string;

}

export interface User {
  /** Username */
  username: string;

  /** Email */
  email: string;

  /** Phone */
  phone?: string | null;

  /** Is Active */
  is_active?: boolean;

  /** Id */
  id: number;

  /** Created At */
  created_at: string;

  /** Updated At */
  updated_at: string;

  /** Roles */
  roles?: Role[];

  /** profile */
  profile?: UserProfile | null;

}

export interface Role {
  /** Name */
  name: string;

  /** Description */
  description?: string | null;

  /** Parent Id */
  parent_id?: number | null;

  /** Id */
  id: number;

  /** Created At */
  created_at: string;

  /** Updated At */
  updated_at: string;

  /** Permissions */
  permissions?: Permission[];

}

export interface UserProfile {
  /** Avatar Url */
  avatar_url?: string | null;

  /** Education */
  education?: string | null;

  /** Target Position */
  target_position?: string | null;

  /** Work Years */
  work_years?: number | null;

  /** Id */
  id: number;

  /** User Id */
  user_id: number;

  /** Created At */
  created_at: string;

  /** Updated At */
  updated_at: string;

}

export interface Permission {
  /** Name */
  name: string;

  /** Description */
  description?: string | null;

  /** Resource */
  resource: string;

  /** Action */
  action: string;

  /** Id */
  id: number;

  /** Created At */
  created_at: string;

  /** Updated At */
  updated_at: string;

}
