interface ApiError {
  code: number;
  message: string;
  data?: any;
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

export function handleApiError(error: ApiError): void {
  const { code, message } = error;

  if (code >= 400 && code < 500) {
    console.warn(`[Business Error] ${code}: ${message}`);
  } else if (code >= 500) {
    console.error(`[Server Error] ${code}: ${message}`);
  }
}

export function formatErrorMessage(error: any): string {
  if (typeof error === "string") {
    return error;
  }

  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.message) {
    return error.message;
  }

  return "未知错误";
}

export function isNetworkError(error: any): boolean {
  return !error.response && !!error.message;
}

export function isTimeoutError(error: any): boolean {
  return error.code === "ECONNABORTED" || error.message?.includes("timeout");
}

export { ERROR_CODE_MAP };
