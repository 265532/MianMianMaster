import { post, get } from "@/utils/request";
import type {
  LoginRequest,
  Token,
  RegisterRequest,
  SmsSendRequest,
  SmsLoginRequest,
  PasswordResetTokenRequest,
  PasswordResetRequest,
  RefreshTokenRequest,
} from "../types/auth.types";
import type { UserResponse } from "../types/user.types";
import type { ResponseModel } from "../types/response.types";

const BASE_URL = "/auth";

export const authApi = {
  login(data: LoginRequest): Promise<ResponseModel<Token>> {
    return post<ResponseModel<Token>>(`${BASE_URL}/login`, data);
  },

  register(data: RegisterRequest): Promise<ResponseModel<UserResponse>> {
    return post<ResponseModel<UserResponse>>(`${BASE_URL}/register`, data);
  },

  getUserInfo(): Promise<ResponseModel<UserResponse>> {
    return get<ResponseModel<UserResponse>>(`${BASE_URL}/me`);
  },

  sendSmsCode(data: SmsSendRequest): Promise<ResponseModel<string>> {
    return post<ResponseModel<string>>(`${BASE_URL}/sms/send`, data);
  },

  smsLogin(data: SmsLoginRequest): Promise<ResponseModel<Token>> {
    return post<ResponseModel<Token>>(`${BASE_URL}/sms/login`, data);
  },

  generatePasswordResetToken(
    data: PasswordResetTokenRequest,
  ): Promise<ResponseModel<string>> {
    return post<ResponseModel<string>>(
      `${BASE_URL}/password/reset-token`,
      data,
    );
  },

  resetPassword(data: PasswordResetRequest): Promise<ResponseModel<string>> {
    return post<ResponseModel<string>>(`${BASE_URL}/password/reset`, data);
  },

  refreshToken(
    data: RefreshTokenRequest,
  ): Promise<ResponseModel<Token>> {
    return post<ResponseModel<Token>>(`${BASE_URL}/refresh`, data);
  },

  logout(): Promise<ResponseModel<string>> {
    return post<ResponseModel<string>>(`${BASE_URL}/logout`);
  },

  unlockUser(username: string): Promise<ResponseModel<string>> {
    return post<ResponseModel<string>>(`${BASE_URL}/unlock/${username}`);
  },
};
