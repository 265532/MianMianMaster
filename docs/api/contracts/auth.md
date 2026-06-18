# Auth 模块 — 接口契约摘要

> 自动生成自 `docs/api/schemas/auth.openapi.json`
> 用途: 给 AI Agent 提供精简接口契约上下文，替代原始 OpenAPI JSON

## POST `/auth/login`

> Login Access Token

- **认证**: ✗
- **标签**: auth

### 请求体: `LoginRequest`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `username` | `string` | ✓ |  |
| `password` | `string` | ✓ |  |

### 响应: `ResponseModel_Token_`

数据载体: `Token`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `access_token` | `string` | ✓ |  |
| `refresh_token` | `string` | ✓ |  |
| `token_type` | `string` |  |  |

## POST `/auth/register`

> Register User

- **认证**: ✗
- **标签**: auth

### 请求体: `UserCreate`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `username` | `string` | ✓ |  |
| `email` | `string` | ✓ |  |
| `phone` | `string` |  |  |
| `is_active` | `boolean` |  |  |
| `password` | `string` | ✓ |  |
| `role_ids` | `number[]` |  |  |

### 响应: `ResponseModel_User_`

数据载体: `User`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `username` | `string` | ✓ |  |
| `email` | `string` | ✓ |  |
| `phone` | `string` |  |  |
| `is_active` | `boolean` |  |  |
| `id` | `number` | ✓ |  |
| `created_at` | `string` | ✓ |  |
| `updated_at` | `string` | ✓ |  |
| `roles` | `Role[]` |  |  |
| ↳ `name` | `string` | ✓ |  |
| ↳ `description` | `string` |  |  |
| ↳ `parent_id` | `number` |  |  |
| ↳ `id` | `number` | ✓ |  |
| ↳ `created_at` | `string` | ✓ |  |
| ↳ ... 还有 2 个嵌套字段 | | | |
| `profile` | `UserProfile` |  |  |
| ↳ `avatar_url` | `string` |  |  |
| ↳ `education` | `string` |  |  |
| ↳ `target_position` | `string` |  |  |
| ↳ `work_years` | `number` |  |  |
| ↳ `id` | `number` | ✓ |  |
| ↳ ... 还有 3 个嵌套字段 | | | |

## GET `/auth/me`

> Read Users Me

- **认证**: ✓
- **标签**: auth

### 响应: `ResponseModel_User_`

数据载体: `User`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `username` | `string` | ✓ |  |
| `email` | `string` | ✓ |  |
| `phone` | `string` |  |  |
| `is_active` | `boolean` |  |  |
| `id` | `number` | ✓ |  |
| `created_at` | `string` | ✓ |  |
| `updated_at` | `string` | ✓ |  |
| `roles` | `Role[]` |  |  |
| ↳ `name` | `string` | ✓ |  |
| ↳ `description` | `string` |  |  |
| ↳ `parent_id` | `number` |  |  |
| ↳ `id` | `number` | ✓ |  |
| ↳ `created_at` | `string` | ✓ |  |
| ↳ ... 还有 2 个嵌套字段 | | | |
| `profile` | `UserProfile` |  |  |
| ↳ `avatar_url` | `string` |  |  |
| ↳ `education` | `string` |  |  |
| ↳ `target_position` | `string` |  |  |
| ↳ `work_years` | `number` |  |  |
| ↳ `id` | `number` | ✓ |  |
| ↳ ... 还有 3 个嵌套字段 | | | |

## POST `/auth/refresh`

> Refresh Token

- **认证**: ✗
- **标签**: auth

### 请求体: `RefreshTokenRequest`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `refresh_token` | `string` | ✓ |  |

### 响应: `ResponseModel_Token_`

数据载体: `Token`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `access_token` | `string` | ✓ |  |
| `refresh_token` | `string` | ✓ |  |
| `token_type` | `string` |  |  |

## POST `/auth/logout`

> Logout

- **认证**: ✓
- **标签**: auth

### 响应: `ResponseModel_str_`

数据载体: `string`

## POST `/auth/unlock/{username}`

> Unlock User

- **认证**: ✓
- **标签**: auth

### 参数

| 字段 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `username` | path | `string` | ✓ |  |

### 响应: `ResponseModel_str_`

数据载体: `string`

## POST `/auth/sms/send`

> Send Sms Code

- **认证**: ✗
- **标签**: auth

### 请求体: `SmsSendRequest`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `phone` | `string` | ✓ |  |

### 响应: `ResponseModel_str_`

数据载体: `string`

## POST `/auth/sms/login`

> Sms Login

- **认证**: ✗
- **标签**: auth

### 请求体: `SmsLoginRequest`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `phone` | `string` | ✓ |  |
| `code` | `string` | ✓ |  |

### 响应: `ResponseModel_Token_`

数据载体: `Token`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `access_token` | `string` | ✓ |  |
| `refresh_token` | `string` | ✓ |  |
| `token_type` | `string` |  |  |

## POST `/auth/password/reset-token`

> Generate Password Reset Token

- **认证**: ✗
- **标签**: auth

### 请求体: `PasswordResetTokenRequest`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `email` | `string` | ✓ |  |

### 响应: `ResponseModel_str_`

数据载体: `string`

## POST `/auth/password/reset`

> Reset Password

- **认证**: ✗
- **标签**: auth

### 请求体: `PasswordResetRequest`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `token` | `string` | ✓ |  |
| `new_password` | `string` | ✓ |  |

### 响应: `ResponseModel_str_`

数据载体: `string`
