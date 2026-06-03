import axios from "axios";
import type {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosError,
} from "axios";
import { getToken, getRefreshToken, setToken, removeToken } from "./auth";
import { handleApiError, formatErrorMessage } from "./error";
import type { ResponseModel } from "@/api/types/response.types";
import type { Token } from "@/api/types/auth.types";
import {
  API_TIMEOUT,
  HTTP_MAX_RETRY_COUNT,
  HTTP_RETRY_DELAY,
  HTTP_SLOW_REQUEST_THRESHOLD,
  HTTP_SLOW_REQUEST_MAX_LOGS,
} from "@/config";

const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api/v1",
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
  },
});

const DEBUG = import.meta.env.VITE_ENABLE_DEBUG_LOG === "true";

let isRefreshing = false;
let isUnauthorized = false;
let pendingRequests: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function onTokenRefreshed(newToken: string): void {
  pendingRequests.forEach(({ resolve }) => resolve(newToken));
  pendingRequests = [];
}

function onRefreshFailed(error: unknown): void {
  pendingRequests.forEach(({ reject }) => reject(error));
  pendingRequests = [];
}

/** 派发全局401事件（防重入：同一轮未授权只派发一次） */
function dispatchUnauthorized(): void {
  if (isUnauthorized) return;
  isUnauthorized = true;
  window.dispatchEvent(new CustomEvent("auth:unauthorized"));
}

/** 登录成功后调用，重置防重入标志 */
export function resetUnauthorizedFlag(): void {
  isUnauthorized = false;
}

const apiMetrics = {
  requests: 0,
  errors: 0,
  totalTime: 0,
  slowRequests: [] as { url: string; duration: number }[],
};

export function getApiMetrics() {
  return {
    ...apiMetrics,
    avgTime:
      apiMetrics.requests > 0
        ? Math.round(apiMetrics.totalTime / apiMetrics.requests)
        : 0,
    errorRate:
      apiMetrics.requests > 0
        ? Math.round((apiMetrics.errors / apiMetrics.requests) * 100)
        : 0,
  };
}

declare module "axios" {
  interface InternalAxiosRequestConfig {
    _retry?: number;
    _startTime?: number;
  }
}

service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.method === "get") {
      config.params = {
        ...config.params,
        _t: Date.now(),
      };
    }

    config._startTime = Date.now();
    apiMetrics.requests++;

    if (DEBUG) {
      console.log(
        `[API Request] ${config.method?.toUpperCase()} ${config.url}`,
        config.params || config.data,
      );
    }

    return config;
  },
  (error: AxiosError) => {
    apiMetrics.errors++;
    if (DEBUG) console.error("[API Request Error]", error);
    return Promise.reject(error);
  },
);

service.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data, config } = response;

    if (config._startTime) {
      const duration = Date.now() - config._startTime;
      apiMetrics.totalTime += duration;
      if (duration > HTTP_SLOW_REQUEST_THRESHOLD) {
        apiMetrics.slowRequests.push({ url: config.url || "", duration });
        if (apiMetrics.slowRequests.length > HTTP_SLOW_REQUEST_MAX_LOGS) {
          apiMetrics.slowRequests.shift();
        }
      }
    }

    if (DEBUG) {
      console.log(`[API Response] ${config.url}`, data);
    }

    if (data.code !== undefined && data.code === 401) {
      removeToken();
      dispatchUnauthorized();
      return Promise.reject(new Error(data.message || "登录已过期，请重新登录"));
    }

    if (data.code !== undefined && data.code !== 200) {
      handleApiError(data);
      return Promise.reject(new Error(data.message || "请求失败"));
    }

    return data;
  },
  async (error: AxiosError) => {
    const { response, message, config } = error;

    if (config?._startTime) {
      const duration = Date.now() - config._startTime;
      apiMetrics.totalTime += duration;
    }

    apiMetrics.errors++;

    if (DEBUG) {
      console.error(`[API Error] ${config?.url}`, error);
    }

    const retryCount = config?._retry || 0;
    const shouldRetry =
      !response && retryCount < HTTP_MAX_RETRY_COUNT && message !== "cancel";

    if (shouldRetry && config) {
      config._retry = retryCount + 1;
      console.warn(
        `[API Retry] ${config.url} (attempt ${config._retry}/${HTTP_MAX_RETRY_COUNT})`,
      );

      await new Promise((resolve) =>
        setTimeout(resolve, HTTP_RETRY_DELAY * config._retry!),
      );
      return service(config);
    }

    if (response) {
      switch (response.status) {
        case 401: {
          const refreshTokenValue = getRefreshToken();
          if (!refreshTokenValue) {
            removeToken();
            dispatchUnauthorized();
            break;
          }

          if (isRefreshing) {
            return new Promise<AxiosResponse>((resolve, reject) => {
              pendingRequests.push({
                resolve: (newToken: string) => {
                  if (config) {
                    config.headers.Authorization = `Bearer ${newToken}`;
                    resolve(service(config));
                  } else {
                    reject(error);
                  }
                },
                reject,
              });
            });
          }

          isRefreshing = true;
          try {
            const refreshResponse = await service.post<ResponseModel<Token>>(
              "/auth/refresh",
              { refresh_token: refreshTokenValue },
            );
            const newToken = refreshResponse.data.access_token;
            const newRefreshToken = refreshResponse.data.refresh_token;
            setToken(newToken);
            if (newRefreshToken) {
              setRefreshToken(newRefreshToken);
            }
            onTokenRefreshed(newToken);

            if (config) {
              config.headers.Authorization = `Bearer ${newToken}`;
              return service(config);
            }
            return Promise.reject(error);
          } catch (refreshError) {
            onRefreshFailed(refreshError);
            removeToken();
            dispatchUnauthorized();
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        }
        case 403:
          if (DEBUG) console.error("[API Error] 没有权限访问");
          break;
        case 404:
          if (DEBUG) console.error("[API Error] 请求的资源不存在");
          break;
        case 500:
          if (DEBUG) console.error("[API Error] 服务器内部错误");
          break;
        default:
          if (DEBUG) console.error(`[API Error] ${formatErrorMessage(error)}`);
      }
    } else if (message.includes("timeout")) {
      if (DEBUG) console.error("[API Error] 请求超时，请稍后重试");
    } else if (message.includes("Network")) {
      if (DEBUG) console.error("[API Error] 网络连接失败，请检查网络");
    } else {
      if (DEBUG) console.error(`[API Error] ${formatErrorMessage(error)}`);
    }

    return Promise.reject(error);
  },
);

export default service;
