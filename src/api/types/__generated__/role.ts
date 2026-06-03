// ============================================================
// role 模块 — 自动生成类型骨架
// 来源: docs/api/schemas/role.openapi.json
// 用途: 作为 src/api/types/ 下手动类型的参考基准，对齐后端 Schema
// ============================================================

export interface RoleCreate {
  /** Name */
  name: string;

  /** Description */
  description?: string | null;

  /** Parent Id */
  parent_id?: number | null;

}

export interface RoleResponse {
  /** Id */
  id: number;

  /** Name */
  name: string;

  /** Description */
  description?: string | null;

  /** Parent Id */
  parent_id?: number | null;

  /** Created At */
  created_at: string;

  /** Updated At */
  updated_at: string;

}

export interface PermissionResponse {
  /** Id */
  id: number;

  /** Name */
  name: string;

  /** Description */
  description?: string | null;

  /** Resource */
  resource: string;

  /** Action */
  action: string;

  /** Created At */
  created_at: string;

  /** Updated At */
  updated_at: string;

}

export interface AssignRolePermissions {
  /** Permission Ids */
  permission_ids: number[];

}

export interface AssignUserRoles {
  /** Role Ids */
  role_ids: number[];

}
