import service from "./http";
import type { AxiosRequestConfig, AxiosProgressEvent } from "axios";

export function request<T = any>(config: AxiosRequestConfig): Promise<T> {
  return service.request(config) as Promise<T>;
}

export function get<T = any>(
  url: string,
  params?: Record<string, any>,
  config?: AxiosRequestConfig,
): Promise<T> {
  return service.get(url, { params, ...config }) as Promise<T>;
}

export function post<T = any>(
  url: string,
  data?: Record<string, any> | URLSearchParams,
  config?: AxiosRequestConfig,
): Promise<T> {
  return service.post(url, data, config) as Promise<T>;
}

export function put<T = any>(
  url: string,
  data?: Record<string, any>,
  config?: AxiosRequestConfig,
): Promise<T> {
  return service.put(url, data, config) as Promise<T>;
}

export function del<T = any>(
  url: string,
  params?: Record<string, any>,
  config?: AxiosRequestConfig,
): Promise<T> {
  return service.delete(url, { params, ...config }) as Promise<T>;
}

export function upload<T = any>(
  url: string,
  file: File | FormData,
  onProgress?: (progressEvent: AxiosProgressEvent) => void,
  config?: AxiosRequestConfig,
): Promise<T> {
  const formData = file instanceof File ? new FormData() : file;

  if (file instanceof File) {
    formData.append("file", file);
  }

  return service.post(url, formData, {
    ...config,
    headers: {
      "Content-Type": "multipart/form-data",
      ...config?.headers,
    },
    onUploadProgress: onProgress,
  }) as Promise<T>;
}
