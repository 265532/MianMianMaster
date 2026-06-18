import type { RoleResponse, PermissionResponse } from "./user.types";

export type RoleListResponse = RoleResponse;

export type PermissionListResponse = PermissionResponse;

export interface RoleCreate {
  name: string;
  description?: string;
  parent_id?: number;
}

export interface AssignRolePermissions {
  permission_ids: number[];
}

export interface AssignUserRoles {
  role_ids: number[];
}
