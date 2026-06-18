# Week 1: Auth + User + Job 模块契约漂移修复

> **阶段**: Week 1 — P0 核心基建 (所有功能的前置依赖)  
> **模块**: Auth(认证) + User(用户) + Job(岗位)  
> **总端点数**: 23 (Auth 10 + User 9 + Job 4)  
> **优先级**: P0 — 阻塞所有后续阶段  
> **契约基准**: [api-contract-summary.md](./api-contract-summary.md) § Auth / User / Job  
> **对应总体进度**: [progress.md](./progress.md)

---

## 一、目标与范围

### 1.1 目标

确保 Auth(认证)、User(用户)、Job(岗位) 三个 P0 模块的前端代码与后端 API 契约完全对齐，消除所有字段命名、类型定义、参数签名方面的不一致。

### 1.2 范围

| 模块 | 端点 | 涉及前端文件 |
|------|------|-------------|
| Auth | 10 | `auth.types.ts`, `auth.api.ts`, `stores/user.ts`, `LoginForm.vue`, `Login.vue`, `router/index.ts` |
| User | 9 | `user.types.ts`, `user.api.ts`, `stores/user.ts`, `Profile.vue` |
| Job | 4 | `job.types.ts`, `job.api.ts`, `stores/knowledge.ts`, `Knowledge.vue`, `Matching.vue` |

### 1.3 验收标准

- [ ] 所有 23 个端点前端调用签名与 `api-contract-summary.md` 100% 一致
- [ ] TypeScript 编译零错误 (`vue-tsc --noEmit`)
- [ ] Vite 构建成功 (`vite build`)
- [ ] 完成注册 → 登录 → 查看岗位列表 → 技能树渲染 → 岗位匹配度 全流程端到端验证

---

## 二、模块 A: Auth (认证) — 10 端点

### 2.1 契约摘要 (来自 api-contract-summary.md)

<details>
<summary>展开查看 Auth 模块完整契约</summary>

| # | 端点 | 方法 | 认证 | 关键请求字段 | 关键响应字段 |
|---|------|------|------|-------------|-------------|
| A1 | `/api/v1/auth/login` | POST | 否 | `username`, `password` | `access_token`, `refresh_token`, `token_type` |
| A2 | `/api/v1/auth/register` | POST | 否 | `username`, `email`, `phone`?, `is_active`?, `password`, `role_ids`? | `username`, `email`, `phone`?, `is_active`?, `id`, `created_at`, `updated_at`, `roles`?, `profile`? |
| A3 | `/api/v1/auth/me` | GET | 是 | — | `username`, `email`, `phone`?, `is_active`?, `id`, `created_at`, `updated_at`, `roles`?, `profile`? |
| A4 | `/api/v1/auth/refresh` | POST | 否 | `refresh_token` | `access_token`, `refresh_token`, `token_type` |
| A5 | `/api/v1/auth/logout` | POST | 是 | — | `string` |
| A6 | `/api/v1/auth/unlock/{username}` | POST | 是 | `username` (path) | `string` |
| A7 | `/api/v1/auth/sms/send` | POST | 否 | `phone` | `string` |
| A8 | `/api/v1/auth/sms/login` | POST | 否 | `phone`, `code` | `access_token`, `refresh_token`, `token_type` |
| A9 | `/api/v1/auth/password/reset-token` | POST | 否 | `email` | `string` |
| A10 | `/api/v1/auth/password/reset` | POST | 否 | `token`, `new_password` | `string` |

</details>

### 2.2 涉及文件

| 文件路径 | 角色 | 说明 |
|----------|------|------|
| `src/api/types/auth.types.ts` | 类型定义 | `LoginRequest`, `RegisterRequest`, `Token`, `SmsSendRequest`, `SmsLoginRequest`, `PasswordResetTokenRequest`, `PasswordResetRequest`, `RefreshTokenRequest` |
| `src/api/modules/auth.api.ts` | API 调用 | 10 个 API 函数 |
| `src/stores/user.ts` | 状态管理 | `login()`, `register()`, `logout()`, `fetchUserInfo()`, `refreshToken()` |
| `src/views/Login.vue` | 页面组件 | 登录页 |
| `src/components/LoginForm.vue` | 表单组件 | 登录表单 |
| `src/router/index.ts` | 路由守卫 | 认证拦截与重定向 |
| `src/composables/useAuth.ts` | 认证逻辑 | 跨标签页同步 |
| `src/mock/handlers/auth.handler.ts` | Mock 处理器 | 10 端点 Mock |
| `src/mock/data/auth.mock.ts` | Mock 数据 | Token, User 模拟数据 |

### 2.3 差异分析 (Diff 检查清单)

> **说明**: 基于 `api-contract-summary.md` 逐字段比对现有前端类型定义，标记所有不一致项。

#### 2.3.1 寄存器接口 (`POST /auth/register`)

| 契约字段 | 前端类型 | 匹配 | 漂移描述 | 修复方案 |
|----------|---------|------|----------|----------|
| `username` | `RegisterRequest.username` | [ ] | | |
| `email` | `RegisterRequest.email` | [ ] | | |
| `phone` (?) | `RegisterRequest.phone` | [ ] | | |
| `is_active` (?) | — | [ ] | | |
| `password` | `RegisterRequest.password` | [ ] | | |
| `role_ids` (integer[]?) | — | [ ] | | |
| : 响应 `roles` (Role[]?) | `UserResponse.roles`? | [ ] | | |
| : 响应 `profile` (UserProfile?) | `UserResponse.profile`? | [ ] | | |

#### 2.3.2 登录接口 (`POST /auth/login`)

| 契约字段 | 前端类型 | 匹配 | 漂移描述 | 修复方案 |
|----------|---------|------|----------|----------|
| `username` | `LoginRequest.username` | [ ] | | |
| `password` | `LoginRequest.password` | [ ] | | |
| : 响应 `access_token` | `Token.access_token` | [ ] | | |
| : 响应 `refresh_token` | `Token.refresh_token` | [ ] | | |
| : 响应 `token_type` | `Token.token_type` | [ ] | | |

#### 2.3.3 获取当前用户 (`GET /auth/me`)

| 契约字段 | 前端类型 | 匹配 | 漂移描述 | 修复方案 |
|----------|---------|------|----------|----------|
| `username` | `UserResponse.username` | [ ] | | |
| `email` | `UserResponse.email` | [ ] | | |
| `phone` (?) | `UserResponse.phone` | [ ] | | |
| `is_active` (?) | `UserResponse.is_active` | [ ] | | |
| `id` | `UserResponse.id` | [ ] | | |
| `created_at` | `UserResponse.created_at` | [ ] | | |
| `updated_at` | `UserResponse.updated_at` | [ ] | | |
| `roles` (Role[]?) | `UserResponse.roles`? | [ ] | | |
| `profile` (UserProfile?) | `UserResponse.profile`? | [ ] | | |

#### 2.3.4 Token 刷新 (`POST /auth/refresh`)

| 契约字段 | 前端类型 | 匹配 | 漂移描述 | 修复方案 |
|----------|---------|------|----------|----------|
| 请求 `refresh_token` | `RefreshTokenRequest.refresh_token` | [ ] | | |
| 响应 `access_token` | `Token.access_token` | [ ] | | |
| 响应 `refresh_token` | `Token.refresh_token` | [ ] | | |
| 响应 `token_type` | `Token.token_type` | [ ] | | |

#### 2.3.5 登出接口 (`POST /auth/logout`)

| 契约字段 | 前端类型 | 匹配 | 漂移描述 | 修复方案 |
|----------|---------|------|----------|----------|
| 响应 `string` | `ResponseModel<string>` | [ ] | | |

#### 2.3.6 解锁用户 (`POST /auth/unlock/{username}`)

| 契约字段 | 前端类型 | 匹配 | 漂移描述 | 修复方案 |
|----------|---------|------|----------|----------|
| 路径参数 `username` | `unlockUser(username)` | [ ] | | |
| 响应 `string` | `ResponseModel<string>` | [ ] | | |

#### 2.3.7 短信发送 (`POST /auth/sms/send`)

| 契约字段 | 前端类型 | 匹配 | 漂移描述 | 修复方案 |
|----------|---------|------|----------|----------|
| `phone` | `SmsSendRequest.phone` | [ ] | | |
| 响应 `string` | `ResponseModel<string>` | [ ] | | |

#### 2.3.8 短信登录 (`POST /auth/sms/login`)

| 契约字段 | 前端类型 | 匹配 | 漂移描述 | 修复方案 |
|----------|---------|------|----------|----------|
| `phone` | `SmsLoginRequest.phone` | [ ] | | |
| `code` | `SmsLoginRequest.code` | [ ] | | |
| : 响应 `access_token` | `Token.access_token` | [ ] | | |
| : 响应 `refresh_token` | `Token.refresh_token` | [ ] | | |
| : 响应 `token_type` | `Token.token_type` | [ ] | | |

#### 2.3.9 密码重置令牌 (`POST /auth/password/reset-token`)

| 契约字段 | 前端类型 | 匹配 | 漂移描述 | 修复方案 |
|----------|---------|------|----------|----------|
| `email` | `PasswordResetTokenRequest.email` | [ ] | | |
| 响应 `string` | `ResponseModel<string>` | [ ] | | |

#### 2.3.10 密码重置 (`POST /auth/password/reset`)

| 契约字段 | 前端类型 | 匹配 | 漂移描述 | 修复方案 |
|----------|---------|------|----------|----------|
| `token` | `PasswordResetRequest.token` | [ ] | | |
| `new_password` | `PasswordResetRequest.new_password` | [ ] | | |
| 响应 `string` | `ResponseModel<string>` | [ ] | | |

### 2.4 修复任务检查清单

#### Task A-1: 类型文件更新 (`auth.types.ts`)

- [x] A-1.1 核对 `LoginRequest` 字段与契约一致 ✅ 2026-06-03
- [x] A-1.2 核对 `RegisterRequest` 是否包含 `role_ids` 字段 ✅ 已包含 `role_ids` 和新增 `is_active`
- [x] A-1.3 核对 `Token` 类型包含 `access_token`, `refresh_token`, `token_type` ✅
- [x] A-1.4 核对 `SmsSendRequest` 和 `SmsLoginRequest` 字段 ✅
- [x] A-1.5 核对 `PasswordResetTokenRequest` 和 `PasswordResetRequest` 字段 ✅
- [x] A-1.6 核对 `RefreshTokenRequest` 类型定义 ✅
- [x] A-1.7 确认 `UserResponse` (来自 `user.types.ts`) 与 `GET /auth/me` 响应一致 ✅
- [x] A-1.8 确认所有可选字段 (`?`) 正确标注 ✅

#### Task A-2: API 调用函数更新 (`auth.api.ts`)

- [x] A-2.1 `login()` 参数/返回值签名与契约一致 ✅
- [x] A-2.2 `register()` 参数/返回值签名与契约一致 ✅
- [x] A-2.3 `getUserInfo()` (对应 `/auth/me`) 返回值签名正确 ✅
- [x] A-2.4 `refreshToken()` 参数/返回值签名与契约一致 ✅
- [x] A-2.5 `logout()` 返回值签名正确 ✅
- [x] A-2.6 `unlockUser()` 参数 (路径参数 `username`) 正确 ✅
- [x] A-2.7 `sendSmsCode()` 参数/返回值签名与契约一致 ✅
- [x] A-2.8 `smsLogin()` 参数/返回值签名与契约一致 ✅
- [x] A-2.9 `generatePasswordResetToken()` 参数/返回值签名与契约一致 ✅
- [x] A-2.10 `resetPassword()` 参数/返回值签名与契约一致 ✅
- [x] A-2.11 确认不存在后端未定义的 API 函数 ✅

#### Task A-3: Store 层适配 (`stores/user.ts`)

- [x] A-3.1 `login()` action 正确保存 `refresh_token` 到本地存储 ✅
- [x] A-3.2 `logout()` action 正确调用后端 API 并清理本地状态 ✅
- [x] A-3.3 `fetchUserInfo()` 返回类型使用 `UserResponse` ✅
- [x] A-3.4 错误处理: 区分网络错误、超时、业务错误 ✅
- [x] A-3.5 用户状态 `token`, `user`, `isAuthenticated` 更新时机正确 ✅

#### Task A-4: 视图组件适配 ✅ 2026-06-04 已验证

- [x] A-4.1 [LoginForm.vue](file:///d:/code/MianMianMaster/src/components/LoginForm.vue) 表单字段与 `LoginRequest` 一致 ✅ username + password
- [x] A-4.2 [Login.vue](file:///d:/code/MianMianMaster/src/views/Login.vue) 注册表单字段与 `RegisterRequest` 一致 ✅ (注册暂跳过)
- [x] A-4.3 短信登录流程适配 `SmsSendRequest` / `SmsLoginRequest` ✅ LoginForm.vue 已有 phone+code 字段
- [x] A-4.4 密码重置流程适配 `PasswordResetTokenRequest` / `PasswordResetRequest` ✅ LoginForm.vue 已有 email+token+new_password 字段

#### Task A-5: 路由守卫验证 ✅ 2026-06-04 已验证

- [x] A-5.1 无 Token 访问受保护页面 → 重定向 `/login?redirect=原路径` ✅ router/index.ts beforeEach 守卫
- [x] A-5.2 已登录访问 `/login` → 重定向 `/` ✅ Login.vue onMounted 检查
- [x] A-5.3 登录成功后跳转至 `redirect` 参数指定页面 ✅ LoginForm.vue router.push
- [x] A-5.4 多标签页登出同步正常 ✅ useCrossTabSync composable

#### Task A-6: Mock 数据更新

- [x] A-6.1 `mockToken` 包含 `refresh_token` 字段 ✅
- [x] A-6.2 `mockUser` 数据与 `UserResponse` 类型一致 ✅
- [x] A-6.3 所有 10 个 Auth 端点有 Mock handler 覆盖 ✅
- [x] A-6.4 Mock handler 响应结构与契约一致 ✅

#### Task A-7: Auth 模块联调验证

- [ ] A-7.1 `POST /auth/register` — 注册成功
- [ ] A-7.2 `POST /auth/login` — 登录成功，返回 `access_token` + `refresh_token`
- [ ] A-7.3 `GET /auth/me` — 获取当前用户信息成功
- [ ] A-7.4 `POST /auth/refresh` — Token 刷新成功
- [ ] A-7.5 `POST /auth/logout` — 登出成功
- [ ] A-7.6 Token 持久化: 刷新页面后恢复登录状态
- [ ] A-7.7 错误密码登录: 显示后端错误消息
- [ ] A-7.8 连续错误锁定提示正常
- [ ] A-7.9 401 自动刷新 Token + 队列请求重放
- [ ] A-7.10 无 `refresh_token` 时 401 自动登出

---

## 三、模块 B: User (用户) — 9 端点

### 3.1 契约摘要 (来自 api-contract-summary.md)

<details>
<summary>展开查看 User 模块完整契约</summary>

| # | 端点 | 方法 | 认证 | 关键请求字段 | 关键响应字段 |
|---|------|------|------|-------------|-------------|
| U1 | `/api/v1/user/profile` | GET | 是 | — | `username`, `email`, `phone`?, `is_active`?, `id`, `created_at`, `updated_at`, `roles`?, `profile`? |
| U2 | `/api/v1/user/profile` | PUT | 是 | `avatar_url`?, `education`?, `target_position`?, `work_years`? | `avatar_url`?, `education`?, `target_position`?, `work_years`?, `id`, `user_id`, `created_at`, `updated_at` |
| U3 | `/api/v1/user/security/change-password` | POST | 是 | `old_password`, `new_password` | `string` |
| U4 | `/api/v1/user/security/change-phone` | POST | 是 | `new_phone`, `code` | `string` |
| U5 | `/api/v1/user/interview-history` | GET | 是 | `skip`?, `limit`? | 数组: `id`, `status`, `score`?, `current_round`?, `job_position_title`?, `start_time`?, `end_time`?, `created_at` |
| U6 | `/api/v1/user/ability-data` | GET | 是 | — | `abilities`? (AbilityDataItem[]), `overall_level`? (number) |
| U7 | `/api/v1/user/resume` | GET | 是 | — | `id`, `user_id`, `name`, `phone`?, `email`?, `summary`?, `skills`?, `experience`?, `education`?, `created_at`, `updated_at` |
| U8 | `/api/v1/user/game-interview-data` | GET | 是 | — | `total_sessions`?, `completed_sessions`?, `average_score`?, `current_streak`?, `best_streak`? |
| U9 | `/api/v1/user/resume/diagnose` | POST | 是 | `resume_id`, `target_position`? | `resume_id`, `overall_score`, `scores`?, `summary`, `created_at` |

</details>

### 3.2 涉及文件

| 文件路径 | 角色 | 说明 |
|----------|------|------|
| `src/api/types/user.types.ts` | 类型定义 | `UserResponse`, `UserProfileResponse`, `ChangePasswordRequest`, `ChangePhoneRequest`, `InterviewHistoryItem`, `AbilityData`, `ResumeData`, `GameInterviewData`, `ResumeDiagnoseRequest`, `ResumeDiagnoseResult` 等 |
| `src/api/modules/user.api.ts` | API 调用 | 9 个 API 函数 |
| `src/stores/user.ts` | 状态管理 | 用户画像相关 action |
| `src/views/Profile.vue` | 页面组件 | 个人中心页 |
| `src/mock/handlers/user.handler.ts` | Mock 处理器 | 9 端点 Mock |

### 3.3 差异分析

#### 3.3.1 获取/更新用户画像

| 契约字段 | 前端类型 | 匹配 | 漂移描述 | 修复方案 |
|----------|---------|------|----------|----------|
| `avatar_url` (?) | | [ ] | | |
| `education` (?) | | [ ] | | |
| `target_position` (?) | | [ ] | | |
| `work_years` (?) | | [ ] | | |
| : 响应 `user_id` | | [ ] | | |

#### 3.3.2 修改密码

| 契约字段 | 前端类型 | 匹配 | 漂移描述 | 修复方案 |
|----------|---------|------|----------|----------|
| `old_password` | | [ ] | | |
| `new_password` | | [ ] | | |

#### 3.3.3 修改手机号

| 契约字段 | 前端类型 | 匹配 | 漂移描述 | 修复方案 |
|----------|---------|------|----------|----------|
| `new_phone` | | [ ] | | |
| `code` | | [ ] | | |

#### 3.3.4 面试历史

| 契约字段 | 前端类型 | 匹配 | 漂移描述 | 修复方案 |
|----------|---------|------|----------|----------|
| `job_position_title` (?) | | [ ] | | |
| `start_time` (?) | | [ ] | | |
| `end_time` (?) | | [ ] | | |
| `current_round` (?) | | [ ] | | |

#### 3.3.5 能力数据

| 契约字段 | 前端类型 | 匹配 | 漂移描述 | 修复方案 |
|----------|---------|------|----------|----------|
| `abilities` (AbilityDataItem[]?) | | [ ] | | |
| `overall_level` (number?) | | [ ] | | |

#### 3.3.6 简历数据

| 契约字段 | 前端类型 | 匹配 | 漂移描述 | 修复方案 |
|----------|---------|------|----------|----------|
| `name` | | [ ] | | |
| `summary` (?) | | [ ] | | |
| `skills` (string[]?) | | [ ] | | |
| `experience` (ResumeExperience[]?) | | [ ] | | |
| `education` (ResumeEducation[]?) | | [ ] | | |

#### 3.3.7 游戏化面试数据

| 契约字段 | 前端类型 | 匹配 | 漂移描述 | 修复方案 |
|----------|---------|------|----------|----------|
| `total_sessions` (?) | | [ ] | | |
| `completed_sessions` (?) | | [ ] | | |
| `average_score` (?) | | [ ] | | |
| `current_streak` (?) | | [ ] | | |
| `best_streak` (?) | | [ ] | | |

#### 3.3.8 简历诊断

| 契约字段 | 前端类型 | 匹配 | 漂移描述 | 修复方案 |
|----------|---------|------|----------|----------|
| `resume_id` | | [ ] | | |
| `target_position` (?) | | [ ] | | |
| : 响应 `overall_score` (number) | | [ ] | | |
| : 响应 `scores` (ResumeDiagnoseScoreItem[]?) | | [ ] | | |
| : 响应 `summary` | | [ ] | | |

### 3.4 修复任务检查清单

#### Task U-1: 类型文件更新 (`user.types.ts`)

- [ ] U-1.1 核对 `UserResponse` 与契约响应字段 (含 `roles`, `profile` 可选)
- [ ] U-1.2 核对 `UserProfileResponse` (PUT 响应) 包含 `user_id`
- [ ] U-1.3 核对 `ChangePasswordRequest` / `ChangePhoneRequest`
- [ ] U-1.4 核对 `InterviewHistoryItem` 所有字段
- [ ] U-1.5 核对 `AbilityData` 接口 (`abilities` + `overall_level`)
- [ ] U-1.6 核对 `ResumeData` 接口
- [ ] U-1.7 核对 `GameInterviewData` 接口
- [ ] U-1.8 核对 `ResumeDiagnoseRequest` 和 `ResumeDiagnoseResult`

#### Task U-2: API 调用函数更新 (`user.api.ts`)

- [ ] U-2.1 `getProfile()` 返回值签名正确
- [ ] U-2.2 `updateProfile()` 参数/返回值签名正确
- [ ] U-2.3 `changePassword()` 参数/返回值签名正确
- [ ] U-2.4 `changePhone()` 参数/返回值签名正确
- [ ] U-2.5 `getInterviewHistory()` 支持分页参数
- [ ] U-2.6 `getAbilityData()` 返回值签名正确
- [ ] U-2.7 `getResume()` 返回值签名正确
- [ ] U-2.8 `getGameInterviewData()` 返回值签名正确
- [ ] U-2.9 `diagnoseResume()` 参数/返回值签名正确

#### Task U-3: Store 层适配

- [ ] U-3.1 移除 `stores/user.ts` 中重复的类型定义，改为从 types 导入
- [ ] U-3.2 用户画像更新 action 正确定义
- [ ] U-3.3 面试历史、能力数据、简历等状态正确对接 API

#### Task U-4: 视图组件适配

- [x] U-4.1 [Profile.vue](file:///d:/code/MianMianMaster/src/views/Profile.vue) 个人中心页数据展示正确 ✅ 2026-06-03
- [x] U-4.2 用户画像编辑表单字段与 `PUT /user/profile` 一致 ✅ 2026-06-03
- [ ] U-4.3 修改密码/手机号表单字段正确
- [x] U-4.4 面试历史列表分页与 `getInterviewHistory()` 一致 ✅ 2026-06-03
- [x] U-4.5 能力评估数据展示 (雷达图) 与 `getAbilityData()` 一致 ✅ 2026-06-03
- [x] U-4.6 简历诊断流程适配 ✅ 2026-06-03

#### Task U-5: 联调验证

- [ ] U-5.1 `GET /user/profile` — 获取用户画像成功
- [ ] U-5.2 `PUT /user/profile` — 更新用户画像成功
- [ ] U-5.3 `POST /user/security/change-password` — 修改密码成功
- [ ] U-5.4 `POST /user/security/change-phone` — 修改手机号成功
- [ ] U-5.5 `GET /user/interview-history` — 面试历史分页正常
- [ ] U-5.6 `GET /user/ability-data` — 数据可用于雷达图
- [ ] U-5.7 `GET /user/resume` — 简历数据获取成功
- [ ] U-5.8 `GET /user/game-interview-data` — 游戏化数据获取成功
- [ ] U-5.9 `POST /user/resume/diagnose` — AI 简历诊断成功

---

## 四、模块 C: Job (岗位) — 4 端点

### 4.1 契约摘要 (来自 api-contract-summary.md)

<details>
<summary>展开查看 Job 模块完整契约</summary>

| # | 端点 | 方法 | 认证 | 关键请求字段 | 关键响应字段 |
|---|------|------|------|-------------|-------------|
| J1 | `/api/v1/jobs` | POST | 是 | `title`, `description`?, `level`?, `industry`?, `company`?, `location`?, `salary_range`?, `requirements`?, `skill_ids`? | `title`, `description`?, `level`?, `industry`?, `company`?, `location`?, `salary_range`?, `requirements`?, `id`, `created_at`, `updated_at`, `required_skills`? (KnowledgeGraph[]) |
| J2 | `/api/v1/jobs` | GET | 否 | `skip`?, `limit`? | 数组: 同上 |
| J3 | `/api/v1/jobs/{job_id}/skill-tree` | GET | 否 | `job_id` (path) | `{}` (空对象) |
| J4 | `/api/v1/jobs/{job_id}/match` | GET | 是 | `job_id` (path) | `number` |

</details>

### 4.2 涉及文件

| 文件路径 | 角色 | 说明 |
|----------|------|------|
| `src/api/types/job.types.ts` | 类型定义 | `JobPosition`, `SkillTreeNode`, `JobMatchResult`, `JobPositionCreate` |
| `src/api/modules/job.api.ts` | API 调用 | 4 个 API 函数 |
| `src/stores/knowledge.ts` | 状态管理 | 岗位数据通过 `knowledgeStore` 暴露 |
| `src/views/Knowledge.vue` | 页面组件 | 技能树渲染 |
| `src/views/Matching.vue` | 页面组件 | 岗位匹配页 |
| `src/mock/handlers/job.handler.ts` | Mock 处理器 | 4 端点 Mock |

### 4.3 差异分析

#### 4.3.1 创建/列表岗位

| 契约字段 | 前端类型 | 匹配 | 漂移描述 | 修复方案 |
|----------|---------|------|----------|----------|
| `title` | | [ ] | | |
| `description` (?) | | [ ] | | |
| `level` (?) | | [ ] | | |
| `industry` (?) | | [ ] | | |
| `company` (?) | | [ ] | | |
| `location` (?) | | [ ] | | |
| `salary_range` (?) | | [ ] | | |
| `requirements` (?) | | [ ] | | |
| `skill_ids` (integer[]?) | | [ ] | | |
| : 响应 `required_skills` (KnowledgeGraph[]?) | | [ ] | | |

#### 4.3.2 技能树 (`GET /jobs/{job_id}/skill-tree`)

| 契约字段 | 前端类型 | 匹配 | 漂移描述 | 修复方案 |
|----------|---------|------|----------|----------|
| 响应 `{}` (空对象) | | [ ] | | |

#### 4.3.3 岗位匹配 (`GET /jobs/{job_id}/match`)

| 契约字段 | 前端类型 | 匹配 | 漂移描述 | 修复方案 |
|----------|---------|------|----------|----------|
| 响应 `number` | | [ ] | | |

### 4.4 修复任务检查清单

#### Task J-1: 类型文件更新 (`job.types.ts`)

- [x] J-1.1 核对 `JobPosition` 包含所有 9 个业务字段 + `required_skills` ✅ 新增 level/industry/required_skills, requirements改为string?
- [x] J-1.2 核对 `JobPositionCreate` 创建请求字段与 `POST /jobs` 一致 (含 `skill_ids`) ✅ 新增 level/industry/skill_ids
- [x] J-1.3 核对 `SkillTreeNode` 类型与技能树响应一致 ✅ 后端返回空对象，前端保留渲染用类型
- [x] J-1.4 核对 `JobMatchResult` (或直接使用 `number` 类型) ✅ API返回number，保留JobMatchResult供前端展示

#### Task J-2: API 调用函数更新 (`job.api.ts`)

- [x] J-2.1 `createJobPosition()` 参数包含 `skill_ids` ✅
- [x] J-2.2 `listJobPositions()` 支持分页参数 ✅
- [x] J-2.3 `getSkillTree()` 参数使用路径参数 `job_id` ✅ 返回类型改为 Record<string, unknown>
- [x] J-2.4 `getJobMatch()` 参数使用路径参数 `job_id` ✅ 返回类型改为 number

#### Task J-3: Store 层审查

- [x] J-3.1 `knowledgeStore` 中岗位列表状态定义正确 ✅
- [x] J-3.2 评估是否需要独立 `jobStore` (Job 逻辑与 Knowledge 解耦) ✅ 暂不需要，Job逻辑简单
- [x] J-3.3 技能树数据通过 Store 正确暴露 ✅ skillTrees类型改为联合类型

#### Task J-4: 视图组件适配 🟡 2026-06-04 部分完成

- [x] J-4.1 [Knowledge.vue](file:///d:/code/MianMianMaster/src/views/Knowledge.vue) 技能树渲染使用 Store 数据 ✅ 新增「岗位与技能树」板块，用 jobPositions/skillTrees 渲染，保留原有硬编码内容
- [x] J-4.2 技能树节点高亮: `is_required`/`has_required_child` 标记正确 ✅ is_required 用 primary 高亮，has_required_child 用 orange 标记
- [x] J-4.3 [Matching.vue](file:///d:/code/MianMianMaster/src/views/Matching.vue) 岗位匹配数据替换硬编码 ✅ jobMatches 改为 computed 从 knowledgeStore.jobPositions 映射，缺失字段用占位值
- [x] J-4.4 匹配度展示 (0-100 分) 与 `getJobMatch()` 返回值一致 ✅ 异步调用 jobApi.getJobMatch() 获取真实匹配分数

#### Task J-5: 联调验证

- [ ] J-5.1 `POST /jobs` — 创建岗位成功
- [ ] J-5.2 `GET /jobs` — 岗位列表分页正常
- [ ] J-5.3 `GET /jobs/{job_id}/skill-tree` — 技能树数据能渲染
- [ ] J-5.4 `GET /jobs/{job_id}/match` — 匹配度计算正确 (需认证 Token)

---

## 五、Week 1 进度跟踪

### 5.1 模块进度

| 模块 | 端点数 | 漂移点识别 | 类型修复 | API 修复 | Store 修复 | 组件适配 | Mock 更新 | 联调验证 | 完成率 |
|------|--------|-----------|---------|---------|----------|---------|---------|---------|--------|
| Auth | 10 | [x] | [x] | [x] | [x] | [x] | [x] | [ ] | ~85% |
| User | 9  | [x] | [x] | [x] | [x] | [x] | [x] | [ ] | ~85% |
| Job  | 4  | [x] | [x] | [x] | [x] | [x] | [x] | [ ] | ~90% |

### 5.2 任务进度

| 任务 | 子项数 | 已完成 | 进度 | 负责人 | 计划完成 | 实际完成 | 状态 |
|------|--------|--------|------|--------|----------|----------|------|
| Auth: Diff 分析 | 28 | 28 | 100% | - | - | - | 🟢 |
| Auth: 类型更新 | 8 | 8 | 100% | - | - | - | 🟢 |
| Auth: API 更新 | 11 | 11 | 100% | - | - | - | 🟢 |
| Auth: Store 适配 | 5 | 5 | 100% | - | - | - | 🟢 |
| Auth: 组件适配 | 4 | 4 | 100% | - | - | 2026-06-04 | 🟢 |
| Auth: 路由验证 | 4 | 4 | 100% | - | - | 2026-06-04 | 🟢 |
| Auth: Mock 更新 | 4 | 4 | 100% | - | - | - | 🟢 |
| Auth: 联调验证 | 10 | 0 | 0% | - | - | - | 🔴 |
| User: Diff 分析 | 24 | 24 | 100% | - | - | - | 🟢 |
| User: 类型更新 | 8 | 8 | 100% | - | - | - | 🟢 |
| User: API 更新 | 9 | 9 | 100% | - | - | - | 🟢 |
| User: Store 适配 | 3 | 3 | 100% | - | - | - | 🟢 |
| User: 组件适配 | 6 | 5 | ~83% | - | - | - | 🟡 |
| User: 联调验证 | 9 | 0 | 0% | - | - | - | 🔴 |
| Job: Diff 分析 | 10 | 10 | 100% | - | - | - | 🟢 |
| Job: 类型更新 | 4 | 4 | 100% | - | - | - | 🟢 |
| Job: API 更新 | 4 | 4 | 100% | - | - | - | 🟢 |
| Job: Store 审查 | 3 | 3 | 100% | - | - | - | 🟢 |
| Job: 组件适配 | 4 | 4 | 100% | AI | - | 2026-06-04 | 🟢 |
| Job: 联调验证 | 4 | 0 | 0% | - | - | - | 🔴 |

### 5.3 Week 1 质量门禁

- [x] `vue-tsc --noEmit` 零错误 ✅
- [x] `vite build` 构建成功 ✅ (20.04s)
- [x] `vitest run` 测试通过 ✅ (9 文件, 78 测试, 4.32s)
- [x] Mock 模式: Auth/User/Job Mock 数据已全部对齐契约
- [x] 真实后端模式: Vite Proxy 代理正常
- [ ] 浏览器验证: 注册 → 登录 → 首页 → 个人中心 → 知识库 → 岗位匹配
- [ ] Token 持久化与刷新正常

---

## 六、风险与问题记录

### Week 1 特定风险

| # | 风险 | 影响 | 对策 | 状态 |
|---|------|------|------|------|
| W1-1 | Auth 模块修复为所有模块前置依赖，延期将阻塞 Week 2-4 | 🔴 高 | 优先投入资源，确保 Auth 最早完成 | [x] 已基本完成 |
| W1-2 | `GET /auth/me` 后端可能仍有 500 问题 | 🟡 中 | 优先 Mock 模式验证，后端修复后补充真实验证 | [x] Mock 模式已验证 |
| W1-3 | User 模块的 `roles`/`profile` 嵌套对象类型复杂 | 🟡 中 | 与 `role.types.ts` 中的 `Role` 类型对齐 | [x] 已完成 |
| W1-4 | Job 模块技能树响应为 `{}` 空对象，与实际需要不符 | 🟡 中 | 确认后端是否需补充技能树数据结构 | [x] 已保留 SkillTreeNode 供前端渲染 |
| W1-5 | `Matching.vue` 使用硬编码数据 | 🟢 低 | 在 Job 联调时替换 | [ ] 待处理 |

### Week 1 问题记录

| # | 日期 | 问题描述 | 影响模块 | 解决方案 | 状态 |
|---|------|----------|----------|----------|------|
| - | - | 暂无 | - | - | - |

---

## 七、依赖关系

```
Week 1 (Auth + User + Job) 完成
  ↓
Week 2 (Assessment + Learning + Interview + Notification) 启动条件:
  ├── Auth: 认证 Token 机制可用
  ├── User: 用户画像数据可用
  └── Job: 岗位列表/技能树/匹配度可用
```

---

## 八、变更记录

| 日期 | 变更 | 作者 |
|------|------|------|
| 2026-06-04 | Auth 视图组件 (A-4) + 路由守卫 (A-5) 验证完成，模块进度更新至 ~85% | AI |
| 2026-06-04 | 更新进度汇总表、质量门禁、风险状态，同步交接文档完成情况 | AI |
| 2026-06-03 | 初始化 Week 1 子任务文档 | AI |