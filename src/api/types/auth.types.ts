/**
 * Auth API 类型定义
 *
 * 所有字段统一使用 snake_case，匹配后端线格式。
 * 部分类型从生成的 OpenAPI Schema 派生，未在 Schema 中的暂保持手写。
 */

// ─── 请求类型 ────────────────────────────────────────

export interface LoginRequest {
  username: string;
  password: string;
}

/** 注册请求（后端 schema 名为 UserCreate） */
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  phone?: string;
  is_active?: boolean;
  role_ids?: number[];
}

export interface SmsSendRequest {
  phone: string;
}

export interface SmsLoginRequest {
  phone: string;
  code: string;
}

export interface PasswordResetTokenRequest {
  email: string;
}

export interface PasswordResetRequest {
  token: string;
  new_password: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

// ─── 安全相关（User 模块端点，暂归属此处） ─────────────

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
}

export interface ChangePhoneRequest {
  new_phone: string;
  code: string;
}

// ─── 响应类型 ────────────────────────────────────────

export interface Token {
  access_token: string;
  token_type?: string;
  refresh_token: string;
}
