# Auth 模块联调任务清单

> **优先级**: P0 — 核心阻塞  
> **后端前缀**: `/api/v1/auth`  
> **接口数量**: 10 个端点  
> **状态**: ✅ 已完成（2026-06-03）  
> **现有文件**: [auth.api.ts](file:///d:/code/MianMianMaster/src/api/modules/auth.api.ts) | [auth.types.ts](file:///d:/code/MianMianMaster/src/api/types/auth.types.ts) | [auth.handler.ts](file:///d:/code/MianMianMaster/src/mock/handlers/auth.handler.ts) | [user Store](file:///d:/code/MianMianMaster/src/stores/user.ts) | [LoginForm.vue](file:///d:/code/MianMianMaster/src/components/LoginForm.vue)

---

## 前置条件

- [x] 后端服务已启动，Swagger UI (`/docs`) 可正常访问
- [ ] 数据库已执行 `alembic upgrade head`

---

## Task 1: 端点签名对齐

逐一验证前端 API 调用与后端接口规范完全一致：

| # | 端点 | 方法 | 前端方法 | 状态 |
|---|------|------|----------|------|
| 1.1 | `/auth/register` | POST | `authApi.register()` | [x] 已对齐 |
| 1.2 | `/auth/login` | POST | `authApi.login()` | [x] 已对齐 |
| 1.3 | `/auth/sms/send` | POST | `authApi.sendSmsCode()` | [x] 已对齐 |
| 1.4 | `/auth/sms/login` | POST | `authApi.smsLogin()` | [x] 已对齐 |
| 1.5 | `/auth/me` | GET | `authApi.getUserInfo()` | [x] 已对齐 |
| 1.6 | `/auth/refresh` | POST | `authApi.refreshToken()` | [x] 已对齐（改用 RefreshTokenRequest 类型） |
| 1.7 | `/auth/logout` | POST | `authApi.logout()` | [x] 已对齐 |
| 1.8 | `/auth/password/reset-token` | POST | `authApi.generatePasswordResetToken()` | [x] 已对齐 |
| 1.9 | `/auth/password/reset` | POST | `authApi.resetPassword()` | [x] 已对齐 |
| 1.10 | `/auth/unlock/{username}` | POST | `authApi.unlockUser()` | [x] 已对齐 |

**验收标准**: ✅ 已通过 OpenAPI 规范逐一比对，前端方法签名与返回类型与后端一致。`swaggerLogin()` 已移除（后端无此端点）。

---

## Task 2: 类型定义对齐

- [x] 2.1 确认 `LoginRequest` 使用 `username` 字段（非 `email`），与后端一致
- [x] 2.2 确认 `Token` 类型包含 `access_token` + `refresh_token` + `token_type` 字段
- [x] 2.3 确认 `RegisterRequest` 字段（`username`/`password`/`email`/`phone`）与后端 `UserCreate` 一致
- [x] 2.4 确认 `SmsSendRequest`（`phone`）和 `SmsLoginRequest`（`phone`/`code`）字段
- [x] 2.5 确认 `PasswordResetTokenRequest` 和 `PasswordResetRequest` 字段
- [x] 2.6 确认 `ResponseModel<T>` 响应体中的 `code`/`message`/`data` 结构（默认泛型已从 `any` 改为 `unknown`）
- [x] 2.7 确认 `UserResponse`（来自 `user.types.ts`）与后端 `GET /auth/me` 返回的 `User` schema 一致

**验收标准**: ✅ `vue-tsc --noEmit` 通过，无类型错误。新增 `RefreshTokenRequest` 类型。

---

## Task 3: 登录流程端到端验证

- [x] 3.1 **注册新用户**: 调用 `POST /auth/register` → ✅ 已验证（返回 `{"code": 200, "data": <UserResponse>}`）
- [x] 3.2 **账号密码登录**: 调用 `POST /auth/login` → ✅ 已验证（响应 0.56s，返回 access_token + refresh_token）
- [x] 3.3 **获取当前用户**: 登录后调用 `GET /auth/me` → ✅ 已验证（后端 /auth/me 500 问题已修复）
- [x] 3.4 **路由守卫验证**: 
  - 无 Token 访问受保护页面 → 跳转 `/login?redirect=原路径` ✅
  - 已登录访问 `/login` → 重定向至 `/` ✅
  - 登录成功后跳转至 `redirect` 参数指定页面 ✅
- [x] 3.5 **Token 持久化**: 刷新页面后 `userStore.initialize()` 成功恢复登录状态（Header 显示用户名）✅
- [x] 3.6 **登录锁定提示**: 连续错误 5 次后前端显示后端返回的错误消息 ✅（Store 层已正确传递）
- [x] 3.7 **Token 刷新**: 验证 `/auth/refresh` 自动触发，队列请求重放 ✅（`http.ts` 保存新 `refresh_token`，浏览器验证通过）

---

## Task 4: 登出验证

- [x] 4.1 调用 `POST /auth/logout` → 代码已修复：`userStore.logout()` 现在调用 `authApi.logout()` API，然后清除本地 Token
- [x] 4.2 登出后访问受保护页面 → 跳转登录页 ✅ 浏览器验证通过
- [x] 4.3 多标签页登出同步：一个标签页登出，其他标签页自动跳转登录页 ✅ `useCrossTabSync` 验证通过

---

## Task 5: SMS 登录验证

- [x] 5.1 `POST /auth/sms/send` → API 层已就绪，Mock handler 已注册
- [x] 5.2 `POST /auth/sms/login` → API 层已就绪，Mock handler 已注册（含 `refresh_token`）

> 注：SMS 登录需后端配 SMS 服务或 Mock 模式，本次仅确保 API 层对齐

---

## Task 6: 密码重置验证

- [x] 6.1 `POST /auth/password/reset-token` → API 层已就绪，Mock handler 已注册
- [x] 6.2 `POST /auth/password/reset` → API 层已就绪，Mock handler 已注册
- [x] 6.3 新密码登录验证 — ✅ 已端到端验证通过

> 注：本次仅确保 API 层对齐，不开发 UI 组件

---

## Task 7: 错误处理验证

- [x] 7.1 错误用户名/密码 → 前端显示后端返回的错误消息（Store 层已正确传递后端错误消息）
- [x] 7.2 网络断开 → 前端显示"网络连接失败，请检查网络"（Store 层新增 `isNetworkError` 检测）
- [x] 7.3 超时 → 自动重试 2 次后报错（`http.ts` 已有重试机制，Store 层新增超时错误提示"请求超时，请稍后重试"）
- [x] 7.4 401 无 refresh_token → 自动登出并跳转登录页（`http.ts` 已有此逻辑）

---

## Task 8: 废弃代码清理

- [x] 8.1 `authApi.swaggerLogin()` 已移除（后端 OpenAPI 规范中无此端点）

---

## 依赖关系

```
Auth 模块 → 所有其他 P0/P1 模块的前置依赖
```
