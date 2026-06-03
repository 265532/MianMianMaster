# Role 模块 — 接口契约摘要

> 自动生成自 `docs/api/schemas/role.openapi.json`
> 用途: 给 AI Agent 提供精简接口契约上下文，替代原始 OpenAPI JSON

## GET `/roles`

> 获取角色列表

- **认证**: ✓
- **标签**: role

### 响应: `ResponseModel_List_RoleResponse_`

数据载体: `RoleResponse[]`

## POST `/roles`

> 创建角色

- **认证**: ✓
- **标签**: role

### 请求体: `RoleCreate`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `name` | `string` | ✓ |  |
| `description` | `string` |  |  |
| `parent_id` | `number` |  |  |

### 响应: `ResponseModel_RoleResponse_`

数据载体: `RoleResponse`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | `number` | ✓ |  |
| `name` | `string` | ✓ |  |
| `description` | `string` |  |  |
| `parent_id` | `number` |  |  |
| `created_at` | `string` | ✓ |  |
| `updated_at` | `string` | ✓ |  |

## POST `/roles/{role_id}/permissions`

> 为角色分配权限

- **认证**: ✓
- **标签**: role

### 请求体: `AssignRolePermissions`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `permission_ids` | `number[]` | ✓ |  |

### 参数

| 字段 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `role_id` | path | `number` | ✓ |  |

### 响应: `ResponseModel_str_`

数据载体: `string`

## POST `/users/{user_id}/roles`

> 为用户分配角色

- **认证**: ✓
- **标签**: role

### 请求体: `AssignUserRoles`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `role_ids` | `number[]` | ✓ |  |

### 参数

| 字段 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `user_id` | path | `number` | ✓ |  |

### 响应: `ResponseModel_str_`

数据载体: `string`

## GET `/permissions`

> 获取权限列表

- **认证**: ✓
- **标签**: role

### 响应: `ResponseModel_List_PermissionResponse_`

数据载体: `PermissionResponse[]`
