import type MockAdapter from "axios-mock-adapter";
import { mockRegisterUser } from "../data/auth.mock";
import { mockUser } from "../data/user.mock";

function success<T>(
  data: T,
): [number, { code: number; message: string; data: T }] {
  return [200, { code: 200, message: "success", data }];
}

export function registerAuthHandlers(mock: MockAdapter): void {
  mock.onPost("/auth/login").reply((config) => {
    const data = JSON.parse(config.data);
    if (data.username && data.password) {
      return success({
        access_token: "mock_jwt_token_" + Date.now(),
        token_type: "bearer",
      });
    }
    return [400, { code: 400, message: "INVALID_CREDENTIALS", data: null }];
  });

  mock.onPost("/auth/swagger-login").reply(() => {
    return success({
      access_token: "mock_swagger_token_" + Date.now(),
      token_type: "bearer",
    });
  });

  mock.onPost("/auth/register").reply((config) => {
    const data = JSON.parse(config.data);
    return success({
      ...mockRegisterUser,
      username: data.username || mockRegisterUser.username,
      email: data.email || mockRegisterUser.email,
    });
  });

  mock.onGet("/auth/me").reply(() => {
    return success(mockUser);
  });

  mock.onPost("/auth/sms/send").reply(() => {
    return success("SMS_CODE_SENT");
  });

  mock.onPost("/auth/sms/login").reply(() => {
    return success({
      access_token: "mock_sms_token_" + Date.now(),
      token_type: "bearer",
    });
  });

  mock.onPost("/auth/password/reset-token").reply(() => {
    return success("RESET_TOKEN_GENERATED");
  });

  mock.onPost("/auth/password/reset").reply(() => {
    return success("PASSWORD_RESET_SUCCESS");
  });

  console.log("[Mock] Auth handlers registered");
}
