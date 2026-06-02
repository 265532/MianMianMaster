export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  phone?: string;
  role_ids?: number[];
}

export interface Token {
  access_token: string;
  token_type: string;
  refresh_token: string;
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

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
}

export interface ChangePhoneRequest {
  new_phone: string;
  code: string;
}
