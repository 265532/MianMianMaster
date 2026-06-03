interface ApiError {
  code: number;
  message: string;
  data?: unknown;
}

const ERROR_CODE_MAP: Record<number, string> = {
  400: "请求参数错误",
  401: "未授权，请登录",
  403: "拒绝访问",
  404: "资源不存在",
  405: "请求方法不允许",
  408: "请求超时",
  500: "服务器内部错误",
  502: "网关错误",
  503: "服务不可用",
  504: "网关超时",
};

const HTTP_STATUS_MESSAGES: Record<number, string> = {
  400: "请求参数有误，请检查后重试",
  401: "账号或密码错误，请重新输入",
  403: "账号已被禁用或未授权，请联系客服",
  404: "请求的资源不存在",
  408: "请求超时，请检查网络后重试",
  409: "该信息已被注册，请使用其他内容或直接登录",
  422: "提交信息有误，请检查后重试",
  429: "操作过于频繁，请稍后再试",
  500: "服务器开了小差，请稍后再试",
  502: "服务暂不可用，请稍后再试",
  503: "服务维护中，请稍后再试",
  504: "网关超时，请检查网络后重试",
};

const BUSINESS_CODE_MESSAGES: Record<number, string> = {
  1001: "用户不存在，请先注册",
  1002: "密码错误，请重新输入",
  1003: "账号已被禁用，请联系客服",
  1004: "账号已过期，请续期后登录",
  1005: "验证码错误或已过期，请重新获取",
  1006: "两次输入的密码不一致",
  1007: "账号已在其他设备登录，请重新登录",
  2001: "用户名已被占用，请更换其他用户名",
  2002: "邮箱已被注册，请使用其他邮箱或直接登录",
  2003: "手机号已被注册，请使用其他手机号或直接登录",
  2004: "密码强度不足，请使用 6-20 位字母数字组合",
  2005: "邮箱格式不正确",
  2006: "手机号格式不正确",
  3001: "登录已过期，请重新登录",
  3002: "登录凭证无效，请重新登录",
  3003: "权限不足，无法访问该资源",
};

export function handleApiError(error: ApiError): void {
  const { code, message } = error;

  if (code >= 400 && code < 500) {
    console.warn(`[Business Error] ${code}: ${message}`);
  } else if (code >= 500) {
    console.error(`[Server Error] ${code}: ${message}`);
  }
}

export function formatErrorMessage(error: unknown): string {
  if (typeof error === "string") {
    return error;
  }

  const err = error as {
    response?: { data?: { message?: string } };
    message?: string;
  } | null;
  if (!err) return "未知错误";

  if (err.response?.data?.message) {
    return err.response.data.message;
  }

  if (err.message) {
    return err.message;
  }

  return "未知错误";
}

export function isNetworkError(error: unknown): boolean {
  const err = error as { response?: unknown; message?: string } | null;
  return !err?.response && !!err?.message;
}

export function isTimeoutError(error: unknown): boolean {
  const err = error as { code?: string; message?: string } | null;
  return err?.code === "ECONNABORTED" || !!err?.message?.includes("timeout");
}

export type AuthErrorContext = "login" | "register" | "common";

const CONTEXT_FALLBACK: Record<AuthErrorContext, string> = {
  login: "登录失败，请稍后重试",
  register: "注册失败，请稍后重试",
  common: "操作失败，请稍后重试",
};

export function getAuthErrorMessage(
  error: unknown,
  context: AuthErrorContext = "common",
): string {
  const err = error as {
    response?: {
      status?: number;
      data?: { code?: number; message?: string };
    };
    code?: string;
    message?: string;
  } | null;

  if (!err) return CONTEXT_FALLBACK[context];

  if (isNetworkError(err)) {
    if (isTimeoutError(err)) {
      return "请求超时，请检查网络后重试";
    }
    return "网络连接失败，请检查网络设置";
  }

  const businessCode = err.response?.data?.code;
  const httpStatus = err.response?.status;
  const serverMessage = err.response?.data?.message;

  if (typeof businessCode === "number" && BUSINESS_CODE_MESSAGES[businessCode]) {
    return BUSINESS_CODE_MESSAGES[businessCode];
  }

  if (typeof httpStatus === "number" && HTTP_STATUS_MESSAGES[httpStatus]) {
    return HTTP_STATUS_MESSAGES[httpStatus];
  }

  if (serverMessage && typeof serverMessage === "string") {
    return serverMessage;
  }

  return CONTEXT_FALLBACK[context];
}

export { ERROR_CODE_MAP };
