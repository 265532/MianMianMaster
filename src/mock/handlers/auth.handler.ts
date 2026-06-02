import type MockAdapter from "axios-mock-adapter";
import { mockRegisterUser } from "../data/auth.mock";
import { mockUser } from "../data/user.mock";

function success<T>(
  data: T,
): [number, { code: number; message: string; data: T }] {
  return [200, { code: 200, message: "success", data }];
}

function fail(
  httpStatus: number,
  businessCode: number,
  message: string,
): [number, { code: number; message: string; data: null }] {
  return [httpStatus, { code: businessCode, message, data: null }];
}

const RESERVED_USERNAMES = new Set(["admin", "test", "demo", "user"]);

export function registerAuthHandlers(mock: MockAdapter): void {
  mock.onPost("/auth/login").reply((config) => {
    const data = JSON.parse(config.data || "{}");
    const { username, password } = data;

    if (!username || !password) {
      return fail(400, 400, "请求参数有误，请填写完整的账号和密码");
    }

    if (username === "locked") {
      return fail(403, 1003, "账号已被禁用，请联系客服");
    }

    if (username === "ratelimit") {
      return fail(429, 429, "操作过于频繁，请稍后再试");
    }

    if (username === "ghost" || username === "nonexistent") {
      return fail(401, 1001, "用户不存在，请先注册");
    }

    if (password === "wrong") {
      return fail(401, 1002, "密码错误，请重新输入");
    }

    return success({
      access_token: "mock_jwt_token_" + Date.now(),
      token_type: "bearer",
      refresh_token: "mock_refresh_token_" + Date.now(),
    });
  });

  mock.onPost("/auth/register").reply((config) => {
    const data = JSON.parse(config.data || "{}");
    const { username, email, password, phone } = data;

    if (!username || !email || !password) {
      return fail(400, 400, "请填写完整的注册信息");
    }

    if (RESERVED_USERNAMES.has(username.toLowerCase())) {
      return fail(409, 2001, "用户名已被占用，请更换其他用户名");
    }

    if (email.toLowerCase() === "taken@example.com") {
      return fail(409, 2002, "邮箱已被注册，请使用其他邮箱或直接登录");
    }

    if (phone === "13800000000") {
      return fail(409, 2003, "手机号已被注册，请使用其他手机号或直接登录");
    }

    if (password.length < 6 || password === "12345") {
      return fail(422, 2004, "密码强度不足，请使用 6-20 位字母数字组合");
    }

    return success({
      ...mockRegisterUser,
      id: Math.floor(Math.random() * 100000) + 1000,
      username: username,
      email: email,
      phone: phone || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  });

  mock.onGet("/auth/me").reply(() => {
    return success(mockUser);
  });

  mock.onPost("/auth/refresh").reply(() => {
    return success({
      access_token: "mock_refreshed_token_" + Date.now(),
      token_type: "bearer",
      refresh_token: "mock_new_refresh_token_" + Date.now(),
    });
  });

  mock.onPost("/auth/logout").reply(() => {
    return success("LOGOUT_SUCCESS");
  });

  mock.onPost("/auth/sms/send").reply(() => {
    return success("SMS_CODE_SENT");
  });

  mock.onPost("/auth/sms/login").reply(() => {
    return success({
      access_token: "mock_sms_token_" + Date.now(),
      token_type: "bearer",
      refresh_token: "mock_sms_refresh_token_" + Date.now(),
    });
  });

  mock.onPost("/auth/password/reset-token").reply(() => {
    return success("RESET_TOKEN_GENERATED");
  });

  mock.onPost("/auth/password/reset").reply(() => {
    return success("PASSWORD_RESET_SUCCESS");
  });

  mock.onPost(/\/auth\/unlock\/.+/).reply(() => {
    return success("USER_UNLOCKED");
  });

  console.log("[Mock] Auth handlers registered");
}
