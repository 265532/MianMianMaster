import { get, post } from "@/utils/request";
import type {
  RoleCreate,
  AssignRolePermissions,
  AssignUserRoles,
} from "../types/role.types";
import type { RoleResponse, PermissionResponse } from "../types/user.types";
import type { ResponseModel } from "../types/response.types";

const BASE_URL = "/roles";

export const roleApi = {
  getRoles(): Promise<ResponseModel<RoleResponse[]>> {
    return get<ResponseModel<RoleResponse[]>>(`${BASE_URL}`);
  },

  createRole(data: RoleCreate): Promise<ResponseModel<RoleResponse>> {
    return post<ResponseModel<RoleResponse>>(`${BASE_URL}`, data);
  },

  assignRolePermissions(
    roleId: number,
    data: AssignRolePermissions,
  ): Promise<ResponseModel<string>> {
    return post<ResponseModel<string>>(
      `${BASE_URL}/${roleId}/permissions`,
      data,
    );
  },

  assignUserRoles(
    userId: number,
    data: AssignUserRoles,
  ): Promise<ResponseModel<string>> {
    return post<ResponseModel<string>>(`/users/${userId}/roles`, data);
  },

  getPermissions(): Promise<ResponseModel<PermissionResponse[]>> {
    return get<ResponseModel<PermissionResponse[]>>(`/permissions`);
  },
};
