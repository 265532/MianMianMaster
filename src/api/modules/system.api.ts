import { get, post } from "@/utils/request";
import type {
  SystemConfig,
  SystemHealth,
  SystemAnnouncement,
  AuditLog,
} from "../types/system.types";
import type { ResponseModel, PaginationParams } from "../types/response.types";

const BASE_URL = "/system";

export const systemApi = {
  getConfig(): Promise<ResponseModel<SystemConfig[]>> {
    return get<ResponseModel<SystemConfig[]>>(`${BASE_URL}/config`);
  },

  createConfig(data: SystemConfig): Promise<ResponseModel<SystemConfig>> {
    return post<ResponseModel<SystemConfig>>(`${BASE_URL}/config`, data);
  },

  getHealth(): Promise<ResponseModel<SystemHealth>> {
    return get<ResponseModel<SystemHealth>>(`${BASE_URL}/health`);
  },

  getAnnouncements(): Promise<ResponseModel<SystemAnnouncement[]>> {
    return get<ResponseModel<SystemAnnouncement[]>>(
      `${BASE_URL}/announcements`,
    );
  },

  getAuditLog(
    params?: PaginationParams,
  ): Promise<ResponseModel<AuditLog[]>> {
    return get<ResponseModel<AuditLog[]>>(
      `${BASE_URL}/audit-log`,
      params as Record<string, any>,
    );
  },
};
