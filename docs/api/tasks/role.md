# Role 模块联调任务清单

> **优先级**: P3 — 管理后台专用  
> **后端前缀**: `/api/v1`（`/roles`、`/users/{id}/roles`、`/permissions`）  
> **后端接口数量**: 5 个端点  
> **现有文件**: [role.api.ts](file:///d:/code/MianMianMaster/src/api/modules/role.api.ts) | [role.types.ts](file:///d:/code/MianMianMaster/src/api/types/role.types.ts) | ⚠️ 无 Mock handler | ⚠️ 无独立 Store

---

## 前置条件

- [ ] Auth 联调完成
- [ ] 管理员用户已创建

---

## Task 1: 端点签名对齐

| # | 端点 | 方法 | 权限 | 前端方法 | 状态 |
|---|------|------|------|----------|------|
| 1.1 | `/roles` | GET | `role:read` | `roleApi.getRoles()` | [ ] |
| 1.2 | `/roles` | POST | `role:create` | `roleApi.createRole()` | [ ] |
| 1.3 | `/roles/{role_id}/permissions` | POST | `role:update` | `roleApi.assignRolePermissions()` | [ ] |
| 1.4 | `/users/{user_id}/roles` | POST | `user:update` | `roleApi.assignUserRoles()` | [ ] |
| 1.5 | `/permissions` | GET | `role:read` | `roleApi.getPermissions()` | [ ] |

---

## Task 2: 类型定义对齐

- [ ] 2.1 `RoleCreate` 字段：`name` + `description` + `permissions[]`
- [ ] 2.2 `AssignRolePermissions` 字段：`permission_ids[]`
- [ ] 2.3 `AssignUserRoles` 字段：`role_ids[]`
- [ ] 2.4 `RoleResponse`（来自 `user.types.ts`）字段对齐
- [ ] 2.5 `PermissionResponse`（来自 `user.types.ts`）字段对齐

---

## Task 3: 角色与权限 CRUD 验证

- [ ] 3.1 **角色列表**: `GET /roles` → 返回已定义角色
- [ ] 3.2 **创建角色**: `POST /roles` → 含权限列表
- [ ] 3.3 **分配权限**: `POST /roles/{id}/permissions` → 为角色添加/更新权限
- [ ] 3.4 **分配用户角色**: `POST /users/{id}/roles` → 为用户分配角色
- [ ] 3.5 **权限列表**: `GET /permissions` → 返回系统所有可用权限

---

## Task 4: RBAC 权限验证

- [ ] 4.1 非管理员用户访问 → 返回 403
- [ ] 4.2 管理员无需 scope 访问 → 验证是否放行
- [ ] 4.3 前端 `requireAdmin()` 守卫生效

---

## Task 5: Mock 数据补充

- [ ] 5.1 创建 `src/mock/data/role.mock.ts`
- [ ] 5.2 创建 `src/mock/handlers/role.handler.ts`，注册到 `adapter.ts` 和 `handlers/index.ts`
- [ ] 5.3 Mock 数据覆盖至少 3 个角色（admin/moderator/user）和 10+ 权限

---

## Task 6: 前端路由权限控制

- [ ] 6.1 后端 Business/Role/System 页面路由需要 `meta.requiresAdmin: true`
- [ ] 6.2 非管理员访问管理页面 → 跳转首页或 403 页面

---

## 依赖关系

```
Auth → Role
Role → Business / System（这些模块需要 RBAC 权限）
```