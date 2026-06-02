# Auth 模块接口文档

> **模块前缀**: `/api/v1/auth`
> **优先级**: **P0** — 所有功能的前置依赖
> **接口数量**: 10 个端点
> **认证机制**: JWT Bearer Token（`Authorization: Bearer <access_token>`）
> **OpenAPI 源**: [`openapi.json`](file:///d:/code/MianMianMaster/docs/api/openapi.json) `tags: ["auth"]`

---

## 目录

- [一、模块总览](#一模块总览)
- [二、通用约定](#二通用约定)
- [三、接口清单](#三接口清单)
- [四、接口详情](#四接口详情)
  - [4.1 用户注册 `POST /auth/register`](#41-用户注册-post-authregister)
  - [4.2 账号密码登录 `POST /auth/login`](#42-账号密码登录-post-authlogin)
  - [4.3 发送短信验证码 `POST /auth/sms/send`](#43-发送短信验证码-post-authsmssend)
  - [4.4 短信验证码登录 `POST /auth/sms/login`](#44-短信验证码登录-post-authsmslogin)
  - [4.5 获取当前用户 `GET /auth/me`](#45-获取当前用户-get-authme)
  - [4.6 刷新 Access Token `POST /auth/refresh`](#46-刷新-access-token-post-authrefresh)
  - [4.7 登出 `POST /auth/logout`](#47-登出-post-authlogout)
  - [4.8 请求密码重置 Token `POST /auth/password/reset-token`](#48-请求密码重置-token-post-authpasswordreset-token)
  - [4.9 重置密码 `POST /auth/password/reset`](#49-重置密码-post-authpasswordreset)
  - [4.10 管理员解锁用户 `POST /auth/unlock/{username}`](#410-管理员解锁用户-post-authunlockusername)
- [五、数据模型](#五数据模型)
- [六、错误码与处理](#六错误码与处理)
- [七、安全与限流](#七安全与限流)
- [八、附录](#八附录)

---

## 一、模块总览

Auth 模块是整个 MianMianMaster 系统的入口与权限闸门，承担以下职责：

- **账号体系**：用户注册、登录、登出
- **凭证管理**：JWT 双 Token 颁发与刷新
- **身份核验**：基于 JWT 的当前用户身份识别（`/auth/me`）
- **辅助登录**：手机短信验证码登录
- **密码安全**：密码重置 Token 申请与重置
- **账户保护**：账号锁定与管理员解锁

前端对接时，**所有受保护接口**（标记 ✅ Auth）必须在请求头携带 `Authorization: Bearer <access_token>`；**未受保护**接口（标记 ❌ Public）允许匿名访问。

---

## 二、通用约定

### 2.1 基础路径

```
http://<host>:<port>/api/v1
```

例如本地开发环境：`http://127.0.0.1:8000/api/v1/auth/login`

### 2.2 请求头

| Header | 必填 | 说明 |
|--------|------|------|
| `Content-Type` | 是 | 所有写接口固定为 `application/json` |
| `Authorization` | 受保护接口 | 格式 `Bearer <access_token>`，无前缀或前缀错误将返回 401 |

### 2.3 响应统一包装

所有业务接口（无论成功或业务失败）均返回 HTTP 200，错误码放在响应体 `code` 字段。仅 **入参校验失败**（Pydantic ValidationError）会返回 HTTP 422。

```json
{
  "code": 200,
  "message": "success",
  "data": { ... }
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `code` | `integer` | 业务状态码，`200` 表示成功，其余参见 [第六章](#六错误码与处理) |
| `message` | `string` | 人类可读消息；`"success"` 表示成功 |
| `data` | `T \| string` | 业务负载；为字符串时通常用于提示语 |

### 2.4 类型对齐（snake_case）

后端 OpenAPI 字段统一使用 `snake_case`，前端项目已在 [`auth.types.ts`](file:///d:/code/MianMianMaster/src/api/types/auth.types.ts) 中完成对齐，**禁止在调用层临时做命名转换**。

### 2.5 限流规则

| 接口 | 限制 |
|------|------|
| `/auth/register` | 3 次 / 分钟 |
| `/auth/login` | 5 次 / 分钟 |
| `/auth/sms/send` | 1 次 / 分钟 |
| `/auth/password/reset-token` | 3 次 / 分钟 |
| `/auth/password/reset` | 5 次 / 分钟 |
| `/auth/unlock/{username}` | 无显式限流（依赖 RBAC） |

超出后返回 HTTP 429，前端需识别 `code === 429` 并提示"操作过于频繁，请稍后再试"。

### 2.6 登录锁定策略

- 同一用户名连续登录失败 **5 次** → 账号自动锁定 **15 分钟**
- 锁定期间 `/auth/login` 仍返回 HTTP 200，但 `code` 为锁定码，提示剩余时间
- 管理员可调用 [`/auth/unlock/{username}`](#410-管理员解锁用户-post-authunlockusername) 提前解锁
- 前端需在 Store 层（[`user.ts`](file:///d:/code/MianMianMaster/src/stores/user.ts)）解析后端消息并友好展示

---

## 三、接口清单

| # | 方法 | 路径 | 说明 | 认证 | 限流 |
|---|------|------|------|------|------|
| 1 | POST | `/auth/register` | 用户注册（用户名 + 密码 + 邮箱） | ❌ Public | 3/分钟 |
| 2 | POST | `/auth/login` | 账号密码登录 | ❌ Public | 5/分钟 |
| 3 | POST | `/auth/sms/send` | 发送短信验证码 | ❌ Public | 1/分钟 |
| 4 | POST | `/auth/sms/login` | 短信验证码登录 / 注册 | ❌ Public | - |
| 5 | GET  | `/auth/me` | 获取当前登录用户信息 | ✅ Auth | - |
| 6 | POST | `/auth/refresh` | 刷新 Access Token | ❌ Public | - |
| 7 | POST | `/auth/logout` | 登出（吊销 Token） | ✅ Auth | - |
| 8 | POST | `/auth/password/reset-token` | 请求密码重置 Token | ❌ Public | 3/分钟 |
| 9 | POST | `/auth/password/reset` | 重置密码 | ❌ Public | 5/分钟 |
| 10 | POST | `/auth/unlock/{username}` | 管理员解锁被锁定用户 | ✅ Auth (Admin) | - |

> **Swagger 调试备注**：开发期可在 Swagger UI (`/docs`) 通过 `/auth/swagger-login`（表单登录）获取 Token，仅供调试使用，前端代码中**不**实现对应方法。

---

## 四、接口详情

### 4.1 用户注册 `POST /auth/register`

> **OpenAPI OperationId**: `register_user_api_v1_auth_register_post`

新用户注册，注册成功后默认返回 `User` 对象（不返回 Token，前端需引导用户跳转到登录页）。

#### 请求

| 项目 | 值 |
|------|------|
| Method | `POST` |
| URL | `/api/v1/auth/register` |
| Auth | ❌ |
| Body | `application/json` |

**请求体 Schema (`UserCreate`)**：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `username` | `string` | ✅ | 用户名，全局唯一 |
| `email` | `string<email>` | ✅ | 邮箱，格式必须合法 |
| `password` | `string` | ✅ | 明文密码（后端自动哈希） |
| `phone` | `string \| null` | ❌ | 手机号，默认为 `null` |
| `is_active` | `boolean` | ❌ | 是否启用，默认 `true` |
| `role_ids` | `integer[]` | ❌ | 角色 ID 列表，默认 `[]`（即默认角色） |

**请求示例**：

```http
POST /api/v1/auth/register HTTP/1.1
Content-Type: application/json
```

```json
{
  "username": "zhangsan",
  "email": "zhangsan@example.com",
  "password": "S3cure!pwd",
  "phone": "13800138000",
  "role_ids": []
}
```

#### 响应

**成功 (HTTP 200, `code=200`)**：返回 `ResponseModel<User>`

| 字段 | 类型 | 说明 |
|------|------|------|
| `code` | `integer` | 固定 `200` |
| `message` | `string` | `"success"` |
| `data` | [`User`](#user) | 创建成功的用户对象 |

**响应示例**：

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1024,
    "username": "zhangsan",
    "email": "zhangsan@example.com",
    "phone": "13800138000",
    "is_active": true,
    "created_at": "2026-06-02T10:00:00Z",
    "updated_at": "2026-06-02T10:00:00Z",
    "roles": [],
    "profile": null
  }
}
```

**失败**：

| HTTP | 触发条件 | 处理建议 |
|------|----------|----------|
| 200 | `code=4xx` 业务错误（用户名/邮箱已存在等） | 展示 `message` 提示 |
| 422 | 字段格式错误（邮箱非法、密码为空等） | 走全局校验错误处理 |
| 429 | 触发限流 | 提示稍后重试 |

#### 前端对接要点

- **类型来源**：[`RegisterRequest`](file:///d:/code/MianMianMaster/src/api/types/auth.types.ts#L6-L12)（注：前端已扩展 `role_ids` 字段，后端会忽略额外字段）
- **API 方法**：`authApi.register(data)`（参见 [`auth.api.ts`](file:///d:/code/MianMianMaster/src/api/modules/auth.api.ts#L22-L24)）
- **不返回 Token**：注册成功需手动调用 [`/auth/login`](#42-账号密码登录-post-authlogin) 获取 Token
- **Mock 提示**：开发期 Mock 处理器见 [`auth.handler.ts`](file:///d:/code/MianMianMaster/src/mock/handlers/auth.handler.ts)

---

### 4.2 账号密码登录 `POST /auth/login`

> **OpenAPI OperationId**: `login_access_token_api_v1_auth_login_post`

最常用的登录方式。成功后颁发双 Token。

#### 请求

| 项目 | 值 |
|------|------|
| Method | `POST` |
| URL | `/api/v1/auth/login` |
| Auth | ❌ |
| Body | `application/json` |

**请求体 Schema (`LoginRequest`)**：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `username` | `string` | ✅ | 用户名（**非**邮箱） |
| `password` | `string` | ✅ | 明文密码 |

**请求示例**：

```http
POST /api/v1/auth/login HTTP/1.1
Content-Type: application/json
```

```json
{
  "username": "zhangsan",
  "password": "S3cure!pwd"
}
```

#### 响应

**成功 (HTTP 200, `code=200`)**：返回 `ResponseModel<Token>`

| 字段 | 类型 | 说明 |
|------|------|------|
| `code` | `integer` | 固定 `200` |
| `message` | `string` | `"success"` |
| `data` | [`Token`](#token) | 包含 `access_token` + `refresh_token` |

**响应示例**：

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer"
  }
}
```

**失败**：

| 触发条件 | `code` | `message` 示例 |
|----------|--------|----------------|
| 用户名不存在 | 4001 | `用户不存在` |
| 密码错误 | 4002 | `密码错误` |
| 账号被锁定 | 4003 | `账号已被锁定，请 12 分钟后再试` |
| 账号已停用 | 4004 | `账号已停用` |

#### 前端对接要点

- **双 Token 保存**：`access_token`（短期）+ `refresh_token`（长期），均需保存到 localStorage；`http.ts` 拦截器会自动从 localStorage 读取 `access_token` 加入请求头
- **登录后必做**：
  1. 保存 `access_token` + `refresh_token`
  2. 调用 [`/auth/me`](#45-获取当前用户-get-authme) 拉取完整 `UserInfo`
  3. 写入 Pinia `userStore`
- **路由守卫**：无 Token 访问受保护页面需跳转 `/login?redirect=原路径`，已登录访问 `/login` 重定向至 `/`
- **锁定提示**：解析 `message` 中的剩余时间，友好展示（`账号已被锁定，请 X 分钟后再试`）
- **代码实现**：[`userStore.login()`](file:///d:/code/MianMianMaster/src/stores/user.ts) + [`authApi.login()`](file:///d:/code/MianMianMaster/src/api/modules/auth.api.ts#L18-L20)

---

### 4.3 发送短信验证码 `POST /auth/sms/send`

> **OpenAPI OperationId**: `send_sms_code_api_v1_auth_sms_send_post`

向指定手机号发送 6 位短信验证码（开发/测试环境默认 Mock 模式，直接返回验证码在 `message` 中）。

#### 请求

| 项目 | 值 |
|------|------|
| Method | `POST` |
| URL | `/api/v1/auth/sms/send` |
| Auth | ❌ |
| Body | `application/json` |
| 限流 | **1 次 / 分钟**（按 IP + 手机号双重维度） |

**请求体 Schema (`SmsSendRequest`)**：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `phone` | `string` | ✅ | 11 位中国大陆手机号 |

**请求示例**：

```http
POST /api/v1/auth/sms/send HTTP/1.1
Content-Type: application/json
```

```json
{
  "phone": "13800138000"
}
```

#### 响应

**成功 (HTTP 200, `code=200`)**：返回 `ResponseModel<string>`

| 字段 | 类型 | 说明 |
|------|------|------|
| `code` | `integer` | 固定 `200` |
| `message` | `string` | Mock 模式下包含验证码，生产环境为 `"验证码已发送"` |
| `data` | `string` | 提示语（一般等同 `message`） |

**响应示例（Mock）**：

```json
{
  "code": 200,
  "message": "验证码已发送（Mock 模式，验证码：123456）",
  "data": "验证码已发送"
}
```

#### 前端对接要点

- **倒计时 UI**：60 秒倒计时按钮（"60s 后重发"），由前端用 `setInterval` 控制；倒计时期间禁用按钮
- **限流降级**：`code=429` 时直接展示后端 `message`
- **真实环境差异**：生产环境 `message` 不会包含明文验证码
- **代码实现**：[`authApi.sendSmsCode()`](file:///d:/code/MianMianMaster/src/api/modules/auth.api.ts#L30-L32)

---

### 4.4 短信验证码登录 `POST /auth/sms/login`

> **OpenAPI OperationId**: `sms_login_api_v1_auth_sms_login_post`

通过短信验证码登录。**若手机号未注册则自动创建账号**（免注册登录）。

#### 请求

| 项目 | 值 |
|------|------|
| Method | `POST` |
| URL | `/api/v1/auth/sms/login` |
| Auth | ❌ |
| Body | `application/json` |

**请求体 Schema (`SmsLoginRequest`)**：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `phone` | `string` | ✅ | 手机号 |
| `code` | `string` | ✅ | 6 位短信验证码 |

**请求示例**：

```http
POST /api/v1/auth/sms/login HTTP/1.1
Content-Type: application/json
```

```json
{
  "phone": "13800138000",
  "code": "123456"
}
```

#### 响应

**成功 (HTTP 200, `code=200`)**：返回 `ResponseModel<Token>`，结构同 [`/auth/login`](#42-账号密码登录-post-authlogin)。

#### 前端对接要点

- **登录成功**后流程与账号密码登录完全一致（保存 Token → 拉取 `/auth/me`）
- **错误码**：
  - `code=4010` 验证码错误或已过期
  - `code=4011` 验证码已使用（5 分钟内不可重复使用）
- **代码实现**：[`authApi.smsLogin()`](file:///d:/code/MianMianMaster/src/api/modules/auth.api.ts#L34-L36)

---

### 4.5 获取当前用户 `GET /auth/me`

> **OpenAPI OperationId**: `read_users_me_api_v1_auth_me_get`

获取当前登录用户的完整信息，包含角色与画像。

#### 请求

| 项目 | 值 |
|------|------|
| Method | `GET` |
| URL | `/api/v1/auth/me` |
| Auth | ✅ `Bearer <access_token>` |

**请求示例**：

```http
GET /api/v1/auth/me HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 响应

**成功 (HTTP 200, `code=200`)**：返回 `ResponseModel<User>`

完整字段结构见 [`User`](#user)。典型响应：

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1024,
    "username": "zhangsan",
    "email": "zhangsan@example.com",
    "phone": "13800138000",
    "is_active": true,
    "id": 1024,
    "created_at": "2026-05-01T10:00:00Z",
    "updated_at": "2026-06-02T09:00:00Z",
    "roles": [
      {
        "id": 1,
        "name": "user",
        "description": "普通用户",
        "created_at": "2026-01-01T00:00:00Z",
        "updated_at": "2026-01-01T00:00:00Z",
        "permissions": [
          { "id": 10, "name": "assessment:read", "resource": "assessment", "action": "read", "created_at": "...", "updated_at": "..." }
        ]
      }
    ],
    "profile": {
      "id": 1,
      "user_id": 1024,
      "avatar_url": null,
      "education": "本科",
      "target_position": "前端工程师",
      "work_years": 3,
      "created_at": "2026-05-01T10:00:00Z",
      "updated_at": "2026-06-02T09:00:00Z"
    }
  }
}
```

#### 前端对接要点

- **触发时机**：
  1. 登录成功后立即调用
  2. 刷新页面时 `userStore.initialize()` 自动调用
  3. 修改用户信息后重新拉取
- **字段映射**：前端 `UserInfo` 需将 `username → name`、`roles → role`（见 [`user.ts` Store](file:///d:/code/MianMianMaster/src/stores/user.ts)）
- **失效处理**：HTTP 401 时 `http.ts` 自动尝试 `/auth/refresh`，若 refresh 也失败则跳转登录页
- **代码实现**：[`authApi.getUserInfo()`](file:///d:/code/MianMianMaster/src/api/modules/auth.api.ts#L26-L28)

---

### 4.6 刷新 Access Token `POST /auth/refresh`

> **OpenAPI OperationId**: `refresh_token_api_v1_auth_refresh_post`

使用长效 `refresh_token` 换取新双 Token。一般由 [`http.ts`](file:///d:/code/MianMianMaster/src/utils/http.ts) 拦截器自动触发（401 场景）。

#### 请求

| 项目 | 值 |
|------|------|
| Method | `POST` |
| URL | `/api/v1/auth/refresh` |
| Auth | ❌（携带 `refresh_token` 即可） |
| Body | `application/json` |

**请求体 Schema (`RefreshTokenRequest`)**：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `refresh_token` | `string` | ✅ | 上次登录或上次刷新时获得的 refresh_token |

**请求示例**：

```http
POST /api/v1/auth/refresh HTTP/1.1
Content-Type: application/json
```

```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 响应

**成功**：返回 `ResponseModel<Token>`，**包含全新的 `access_token` + `refresh_token`**（每次刷新都会轮换 refresh_token，必须覆盖旧值）。

**失败**：

| 触发条件 | `code` | 处理 |
|----------|--------|------|
| refresh_token 过期或伪造 | 4011 | 清除 Token，跳转登录页 |
| refresh_token 已被吊销（已登出） | 4012 | 清除 Token，跳转登录页 |

#### 前端对接要点

- **轮换策略**：`http.ts` 拦截器在收到 401 后，**串行调用 `/auth/refresh`**，成功后用新 token 重放原请求（队列处理）
- **必须覆盖**：刷新成功后**同时**保存新 `access_token` 和新 `refresh_token`，旧的 refresh_token 即刻失效
- **不暴露前端**：所有刷新逻辑都在 `http.ts` 内部，业务代码无需手动调用
- **代码实现**：[`authApi.refreshToken()`](file:///d:/code/MianMianMaster/src/api/modules/auth.api.ts#L51-L55)

---

### 4.7 登出 `POST /auth/logout`

> **OpenAPI OperationId**: `logout_api_v1_auth_logout_post`

将当前 token 加入黑名单（Redis），使该 token 立即失效。前端需同时清除本地 Token。

#### 请求

| 项目 | 值 |
|------|------|
| Method | `POST` |
| URL | `/api/v1/auth/logout` |
| Auth | ✅ `Bearer <access_token>` |

**请求示例**：

```http
POST /api/v1/auth/logout HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 响应

**成功 (HTTP 200, `code=200`)**：返回 `ResponseModel<string>`

```json
{
  "code": 200,
  "message": "success",
  "data": "登出成功"
}
```

#### 前端对接要点

- **顺序**：
  1. 调用 `/auth/logout`（即使失败也继续）
  2. 清除 `localStorage` 中的 `access_token` / `refresh_token`
  3. `userStore.logout()` 重置状态
  4. 跳转到登录页
- **多标签同步**：使用 [`useCrossTabSync`](file:///d:/code/MianMianMaster/src/utils/useCrossTabSync.ts) 通过 `storage` 事件监听其他标签页登出
- **代码实现**：[`authApi.logout()`](file:///d:/code/MianMianMaster/src/api/modules/auth.api.ts#L57-L59) + [`userStore.logout()`](file:///d:/code/MianMianMaster/src/stores/user.ts)

---

### 4.8 请求密码重置 Token `POST /auth/password/reset-token`

> **OpenAPI OperationId**: `generate_password_reset_token_api_v1_auth_password_reset_token_post`

向指定邮箱发送密码重置链接（含一次性 Token）。

#### 请求

| 项目 | 值 |
|------|------|
| Method | `POST` |
| URL | `/api/v1/auth/password/reset-token` |
| Auth | ❌ |
| 限流 | 3 次 / 分钟 |
| Body | `application/json` |

**请求体 Schema (`PasswordResetTokenRequest`)**：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `email` | `string<email>` | ✅ | 注册时使用的邮箱 |

**请求示例**：

```http
POST /api/v1/auth/password/reset-token HTTP/1.1
Content-Type: application/json
```

```json
{
  "email": "zhangsan@example.com"
}
```

#### 响应

**成功 (HTTP 200, `code=200`)**：返回 `ResponseModel<string>`

```json
{
  "code": 200,
  "message": "success",
  "data": "密码重置邮件已发送，请查收邮箱"
}
```

**失败**：

| 触发条件 | `code` | 说明 |
|----------|--------|------|
| 邮箱不存在 | 4040 | **为防止邮箱枚举，无论是否存在均返回 200**（前端按成功处理） |

#### 前端对接要点

- **安全设计**：无论邮箱是否存在都返回成功响应，避免泄露用户存在性
- **后端异步发送**：邮件发送通常异步执行（Celery 任务），接口会立即返回
- **UI 提示**：始终提示"如果该邮箱已注册，您将收到重置邮件"
- **代码实现**：[`authApi.generatePasswordResetToken()`](file:///d:/code/MianMianMaster/src/api/modules/auth.api.ts#L38-L45)

---

### 4.9 重置密码 `POST /auth/password/reset`

> **OpenAPI OperationId**: `reset_password_api_v1_auth_password_reset_post`

使用邮件中的 Token 重置密码。

#### 请求

| 项目 | 值 |
|------|------|
| Method | `POST` |
| URL | `/api/v1/auth/password/reset` |
| Auth | ❌ |
| 限流 | 5 次 / 分钟 |
| Body | `application/json` |

**请求体 Schema (`PasswordResetRequest`)**：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `token` | `string` | ✅ | 邮件链接中的重置 Token |
| `new_password` | `string` | ✅ | 新密码（建议前端做强度校验：≥ 8 位 + 字母数字） |

**请求示例**：

```http
POST /api/v1/auth/password/reset HTTP/1.1
Content-Type: application/json
```

```json
{
  "token": "abc123def456",
  "new_password": "NewP@ssw0rd!"
}
```

#### 响应

**成功 (HTTP 200, `code=200`)**：返回 `ResponseModel<string>`

```json
{
  "code": 200,
  "message": "success",
  "data": "密码重置成功，请使用新密码登录"
}
```

**失败**：

| 触发条件 | `code` | 说明 |
|----------|--------|------|
| Token 无效 | 4020 | Token 不存在或格式错误 |
| Token 已过期 | 4021 | 默认 30 分钟有效期 |
| Token 已使用 | 4022 | 重置流程不可重复提交 |

#### 前端对接要点

- **重置后引导**：成功后跳转登录页，提示"密码已重置，请使用新密码登录"
- **Token 来源**：通常从邮件中的链接 `https://<host>/reset-password?token=xxx` 提取，前端需解析 URL 参数
- **代码实现**：[`authApi.resetPassword()`](file:///d:/code/MianMianMaster/src/api/modules/auth.api.ts#L47-L49)

---

### 4.10 管理员解锁用户 `POST /auth/unlock/{username}`

> **OpenAPI OperationId**: `unlock_user_api_v1_auth_unlock__username__post`

管理员为被锁定的用户提前解除登录锁定。

#### 请求

| 项目 | 值 |
|------|------|
| Method | `POST` |
| URL | `/api/v1/auth/unlock/{username}` |
| Auth | ✅ `Bearer <access_token>` **且需要 `user:update` 权限（管理员）** |
| Path Param | `username: string` |

**请求示例**：

```http
POST /api/v1/auth/unlock/zhangsan HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 响应

**成功 (HTTP 200, `code=200`)**：返回 `ResponseModel<string>`

```json
{
  "code": 200,
  "message": "success",
  "data": "用户 zhangsan 已解锁"
}
```

**失败**：

| 触发条件 | HTTP | `code` |
|----------|------|--------|
| 无 Token | 401 | - |
| 无管理员权限 | 403 | 1003 |
| 用户不存在 | 200 | 4040 |
| 用户未被锁定 | 200 | 4030 |

#### 前端对接要点

- **路由权限**：仅管理员后台可见；前端路由需在 `meta.requiresPermission` 中配置 `user:update`
- **代码实现**：[`authApi.unlockUser()`](file:///d:/code/MianMianMaster/src/api/modules/auth.api.ts#L61-L63)

---

## 五、数据模型

### `Token`

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `access_token` | `string` | ✅ | - | JWT 访问令牌（短期） |
| `refresh_token` | `string` | ✅ | - | JWT 刷新令牌（长期） |
| `token_type` | `string` | ❌ | `"bearer"` | 固定为 `bearer` |

```typescript
export interface Token {
  access_token: string;
  token_type: string;        // "bearer"
  refresh_token: string;
}
```

### `User`

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `id` | `integer` | ✅ | - | 用户 ID（自增主键） |
| `username` | `string` | ✅ | - | 用户名 |
| `email` | `string<email>` | ✅ | - | 邮箱 |
| `phone` | `string \| null` | ❌ | `null` | 手机号 |
| `is_active` | `boolean` | ❌ | `true` | 账号是否启用 |
| `created_at` | `string<date-time>` | ✅ | - | ISO 8601 时间 |
| `updated_at` | `string<date-time>` | ✅ | - | ISO 8601 时间 |
| `roles` | `Role[]` | ❌ | `[]` | 角色列表（含权限） |
| `profile` | `UserProfile \| null` | ❌ | `null` | 用户画像（外键关联） |

```typescript
export interface UserResponse {
  id: number;
  username: string;
  email: string;
  phone?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  roles: RoleResponse[];
  profile?: UserProfileResponse;
}
```

### `UserCreate`

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `username` | `string` | ✅ | - | 用户名 |
| `email` | `string<email>` | ✅ | - | 邮箱 |
| `password` | `string` | ✅ | - | 明文密码 |
| `phone` | `string \| null` | ❌ | `null` | 手机号 |
| `is_active` | `boolean` | ❌ | `true` | 是否启用 |
| `role_ids` | `integer[]` | ❌ | `[]` | 角色 ID 列表 |

### `UserProfile`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | `integer` | ✅ | 主键 |
| `user_id` | `integer` | ✅ | 关联的用户 ID |
| `avatar_url` | `string \| null` | ❌ | 头像 URL |
| `education` | `string \| null` | ❌ | 学历 |
| `target_position` | `string \| null` | ❌ | 目标岗位 |
| `work_years` | `integer \| null` | ❌ | 工作年限 |
| `created_at` | `string<date-time>` | ✅ | - |
| `updated_at` | `string<date-time>` | ✅ | - |

### `Role`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | `integer` | ✅ | 角色 ID |
| `name` | `string` | ✅ | 角色名（如 `user` / `admin`） |
| `description` | `string \| null` | ❌ | 角色描述 |
| `parent_id` | `integer \| null` | ❌ | 父角色 ID（用于角色继承） |
| `created_at` | `string<date-time>` | ✅ | - |
| `updated_at` | `string<date-time>` | ✅ | - |
| `permissions` | `Permission[]` | ❌ | 权限列表 |

### `Permission`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | `integer` | ✅ | 权限 ID |
| `name` | `string` | ✅ | 权限名（如 `user:update`） |
| `description` | `string \| null` | ❌ | 权限描述 |
| `resource` | `string` | ✅ | 资源（如 `user`） |
| `action` | `string` | ✅ | 操作（如 `read` / `create`） |
| `created_at` | `string<date-time>` | ✅ | - |
| `updated_at` | `string<date-time>` | ✅ | - |

### `ResponseModel<T>`

```typescript
export interface ResponseModel<T = unknown> {
  code: number;      // 200=成功，其余=业务错误
  message: string;   // "success" 或错误描述
  data: T;           // 业务负载
}
```

### `HTTPValidationError`

仅在 HTTP 422 校验失败时返回：

```typescript
interface HTTPValidationError {
  detail: ValidationErrorItem[];
}
interface ValidationErrorItem {
  loc: (string | number)[];  // 字段路径
  msg: string;                // 错误消息
  type: string;               // 错误类型
}
```

---

## 六、错误码与处理

### 6.1 业务错误码

| 错误码范围 | 含义 | 建议处理 |
|------------|------|----------|
| 200 | 成功 | - |
| 4001 ~ 4049 | 账号/认证类错误 | 展示 `message`，可能需要跳转登录 |
| 4010 ~ 4019 | Token 类错误 | 清除本地 Token，跳转登录 |
| 4020 ~ 4029 | 密码重置类错误 | 引导用户重新申请重置 |
| 4030 ~ 4039 | 权限不足 | 展示"无权限访问" |
| 429 | 限流 | 提示"操作过于频繁" |
| 5000+ | 服务端异常 | 提示"系统繁忙，请稍后再试" |

### 6.2 关键错误码索引

| 业务错误码 | 触发场景 | 用户提示建议 |
|------------|----------|--------------|
| 4001 | 用户名不存在 | "用户名或密码错误"（**不要**精确提示"用户不存在"，避免枚举攻击） |
| 4002 | 密码错误 | "用户名或密码错误" |
| 4003 | 账号被锁定 | 解析 message 中的剩余分钟数："账号已被锁定，请 X 分钟后再试" |
| 4004 | 账号已停用 | "账号已停用，请联系管理员" |
| 4010 | 短信验证码错误 | "验证码错误或已过期" |
| 4011 | refresh_token 失效 | 静默跳转登录页 |
| 4020 | 重置 Token 无效 | "重置链接无效，请重新申请" |
| 4021 | 重置 Token 过期 | "重置链接已过期（30 分钟），请重新申请" |
| 4022 | 重置 Token 已使用 | "该链接已使用过，请重新申请" |
| 4030 | 非锁定用户执行解锁 | "该用户未被锁定" |
| 4040 | 资源不存在 | "用户不存在" |

### 6.3 HTTP 错误码

| HTTP | 含义 | 触发条件 | 处理 |
|------|------|----------|------|
| 401 | 未认证 | 缺少或无效 Token | 触发 refresh；refresh 失败则跳转登录 |
| 403 | 禁止访问 | 权限不足 | 展示"无权限访问"，隐藏敏感 UI |
| 422 | 入参校验失败 | Pydantic 校验 | 解析 `detail[].loc` 定位字段，红字提示 |
| 429 | 限流 | 超限 | 提示稍后重试，按 `Retry-After` 决定 |
| 5xx | 服务端异常 | 内部错误 | 通用降级页 + 日志上报 |

---

## 七、安全与限流

### 7.1 认证流程图

```
                    ┌─────────────────┐
                    │   客户端登录     │
                    └────────┬────────┘
                             │
                             ▼
              POST /auth/login (username+password)
                             │
                  ┌──────────┴──────────┐
                  ▼                     ▼
            code=200              code=4001~4004
            返回双 Token          业务错误
                  │                     │
                  ▼                     ▼
   存储到 localStorage           提示用户重试
                  │
                  ▼
        GET /auth/me (Bearer)
                  │
                  ▼
           渲染用户中心
                  │
        (access_token 过期)
                  │
                  ▼
       POST /auth/refresh (refresh_token)
                  │
                  ▼
           获取新双 Token
                  │
                  ▼
       重新发起原请求（队列重放）
```

### 7.2 Token 安全建议

- **存储**：`localStorage`（当前实现）；XSS 风险与无刷新即会话过期的便利性平衡
- **不存 Cookie**：避免 CSRF
- **HTTPS**：生产环境必须启用
- **Token 轮换**：每次 `/auth/refresh` 都返回新 `refresh_token`，必须覆盖旧值
- **登出即吊销**：调用 `/auth/logout` 后，旧 token 进入 Redis 黑名单（TTL = access_token 剩余有效期）

### 7.3 前端硬性安全要求

- ❌ **禁止**在前端日志（`console.log`）中打印完整 Token
- ❌ **禁止**将 Token 写入 URL 参数
- ❌ **禁止**在跨域请求中明文传递密码
- ✅ **必须**在 `Authorization` 头中携带 Token
- ✅ **必须**对所有写接口做 CSRF/XSS 防御
- ✅ **必须**对 `message` 中可能包含的手机号/邮箱做脱敏展示

---

## 八、附录

### A. 完整接口对照表

| 序号 | 方法 | 路径 | OpenAPI OperationId | 前端 API 方法 |
|------|------|------|---------------------|----------------|
| 1 | POST | `/auth/register` | `register_user_api_v1_auth_register_post` | `authApi.register()` |
| 2 | POST | `/auth/login` | `login_access_token_api_v1_auth_login_post` | `authApi.login()` |
| 3 | POST | `/auth/sms/send` | `send_sms_code_api_v1_auth_sms_send_post` | `authApi.sendSmsCode()` |
| 4 | POST | `/auth/sms/login` | `sms_login_api_v1_auth_sms_login_post` | `authApi.smsLogin()` |
| 5 | GET  | `/auth/me` | `read_users_me_api_v1_auth_me_get` | `authApi.getUserInfo()` |
| 6 | POST | `/auth/refresh` | `refresh_token_api_v1_auth_refresh_post` | `authApi.refreshToken()` |
| 7 | POST | `/auth/logout` | `logout_api_v1_auth_logout_post` | `authApi.logout()` |
| 8 | POST | `/auth/password/reset-token` | `generate_password_reset_token_api_v1_auth_password_reset_token_post` | `authApi.generatePasswordResetToken()` |
| 9 | POST | `/auth/password/reset` | `reset_password_api_v1_auth_password_reset_post` | `authApi.resetPassword()` |
| 10 | POST | `/auth/unlock/{username}` | `unlock_user_api_v1_auth_unlock__username__post` | `authApi.unlockUser()` |

### B. 关联文件

| 类型 | 路径 |
|------|------|
| API 封装 | [src/api/modules/auth.api.ts](file:///d:/code/MianMianMaster/src/api/modules/auth.api.ts) |
| 类型定义 | [src/api/types/auth.types.ts](file:///d:/code/MianMianMaster/src/api/types/auth.types.ts) |
| 用户响应类型 | [src/api/types/user.types.ts](file:///d:/code/MianMianMaster/src/api/types/user.types.ts) |
| 响应包装类型 | [src/api/types/response.types.ts](file:///d:/code/MianMianMaster/src/api/types/response.types.ts) |
| HTTP 拦截器 | [src/utils/http.ts](file:///d:/code/MianMianMaster/src/utils/http.ts) |
| 用户 Store | [src/stores/user.ts](file:///d:/code/MianMianMaster/src/stores/user.ts) |
| 登录组件 | [src/components/LoginForm.vue](file:///d:/code/MianMianMaster/src/components/LoginForm.vue) |
| Mock 处理器 | [src/mock/handlers/auth.handler.ts](file:///d:/code/MianMianMaster/src/mock/handlers/auth.handler.ts) |
| 联调任务清单 | [docs/api/tasks/auth.md](file:///d:/code/MianMianMaster/docs/api/tasks/auth.md) |
| 前端对接总览 | [docs/api/frontend-api-integration-guide.md](file:///d:/code/MianMianMaster/docs/api/frontend-api-integration-guide.md) |

### C. 推荐对接顺序

```
第 1 步: /auth/register      (注册)        → authApi.register()
第 2 步: /auth/login          (登录)        → authApi.login()
第 3 步: /auth/me             (获取用户)     → authApi.getUserInfo()
第 4 步: /auth/refresh        (刷新 Token)  → http.ts 自动触发
第 5 步: /auth/logout         (登出)        → userStore.logout()
第 6 步: /auth/sms/send       (发送验证码)  → authApi.sendSmsCode()
第 7 步: /auth/sms/login      (短信登录)    → authApi.smsLogin()
第 8 步: /auth/password/reset-token (请求重置) → authApi.generatePasswordResetToken()
第 9 步: /auth/password/reset (重置密码)    → authApi.resetPassword()
第 10 步: /auth/unlock/{username} (解锁)  → authApi.unlockUser() (管理后台)
```

### D. 调试清单

- [ ] Swagger UI (`/docs`) 可正常访问
- [ ] PostgreSQL 数据库已执行 `alembic upgrade head`
- [ ] Redis 运行正常（用于 Token 黑名单）
- [ ] `.env` 中 `JWT_SECRET_KEY` 已配置
- [ ] `.env` 中 `SMS_MOCK_MODE=true`（开发环境）
- [ ] 前端 `.env.development` 中 `VITE_USE_MOCK=true`（开发环境）

---

*文档基于 `openapi.json` (`tags: ["auth"]`) 自动生成，最后更新于 2026-06-02。*
