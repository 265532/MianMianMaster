# System 模块联调任务清单

> **优先级**: P3 — 管理后台专用  
> **后端前缀**: `/api/v1/system`  
> **后端接口数量**: 3 个端点  
> **现有文件**: [system.api.ts](file:///d:/code/MianMianMaster/src/api/modules/system.api.ts) | [system.types.ts](file:///d:/code/MianMianMaster/src/api/types/system.types.ts) | [system.handler.ts](file:///d:/code/MianMianMaster/src/mock/handlers/system.handler.ts) | ⚠️ 无独立 Store

---

## 前置条件

- [ ] Auth + Role 联调完成（System 需要管理员权限）

---

## 差异分析

> ⚠️ **前端多出 2 个端点**（`/health` GET + `/announcements` GET），不在后端规范中。
> `/health` 可降级为空操作；`/announcements` 需与后端确认是否添加。

---

## Task 1: 标准端点签名对齐

| # | 端点 | 方法 | 权限 | 前端方法 | 状态 |
|---|------|------|------|----------|------|
| 1.1 | `/system/config` | GET | `config:read` | `systemApi.getConfig()` | [ ] |
| 1.2 | `/system/config` | POST | `config:create` | `systemApi.createConfig()` | [ ] |
| 1.3 | `/system/audit-log` | GET | `audit_log:read` | `systemApi.getAuditLog()` | [ ] |

---

## Task 2: 类型定义对齐

- [ ] 2.1 `SystemConfig` 类型字段：`key`/`value`/`description`
- [ ] 2.2 `AuditLog` 类型字段：`id`/`user_id`/`action`/`ip_address`/`created_at`
- [ ] 2.3 `SystemHealth` 类型（超范围端点，可能不需要）
- [ ] 2.4 `SystemAnnouncement` 类型（超范围端点）

---

## Task 3: 接口可用性验证

- [ ] 3.1 **系统配置列表**: `GET /system/config` → 管理员权限验证
- [ ] 3.2 **创建配置**: `POST /system/config` → 仅管理员可创建
- [ ] 3.3 **审计日志**: `GET /system/audit-log` → 分页参数（`skip`/`limit`）

---

## Task 4: RBAC 权限验证

- [ ] 4.1 非管理员 Token → 返回 403
- [ ] 4.2 管理员 Token 无 `config:read` scope → 返回 403
- [ ] 4.3 管理员 Token 无 `audit_log:read` scope → 返回 403

---

## Task 5: 超范围端点降级

- [ ] 5.1 `getHealth()` → 移除或降级为空操作
- [ ] 5.2 `getAnnouncements()` → 与后端确认是否添加对应端点

---

## Task 6: 首页功能对接

> [Home.vue](file:///d:/code/MianMianMaster/src/views/Home.vue) 展示型页面，部分数据可能来自系统配置（功能列表/服务介绍等）

- [ ] 6.1 首页功能列表是否应从 `GET /system/config` 获取
- [ ] 6.2 首页 FAQ/新闻数据是否应从系统配置获取

---

## 依赖关系

```
Auth + Role → System
System → 无后续依赖
```