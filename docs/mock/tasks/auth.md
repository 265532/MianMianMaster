# Auth 模块 — 实施计划

> **模块**: 认证（Auth）  
> **优先级**: P0 — 所有功能的前置依赖  
> **后端前缀**: `/api/v1/auth`  
> **预估数据量**: 3 条记录  
> **依赖**: 无（独立模块，但 User 表需先存在）

---

## 0. 前置确认

- [ ] 确认后端数据库 `users` 表 Schema
- [ ] 确认 `roles` 表是否存在（用户注册需要角色关联）
- [ ] 确认密码哈希算法（bcrypt / argon2 等）
- [ ] 确认 JWT Token 签发机制（secret key、过期时间）

---

## 1. 数据库表创建

- [ ] 1.1 确认 `users` 表已存在（含 `email`, `phone`, `hashed_password`, `is_active`, `is_locked` 等字段）
- [ ] 1.2 确认 `user_roles` 关联表已存在
- [ ] 1.3 确认 `roles` 表已存在且至少包含 `user` 角色

---

## 2. 种子数据插入

### 2.1 角色数据

- [ ] 2.1.1 插入 `user` 角色（如果不存在）

```json
{
  "id": 1,
  "name": "user",
  "description": "普通用户"
}
```

### 2.2 用户数据 — 主用户（王同学）

- [ ] 2.2.1 插入用户 `mockUser`

```json
{
  "id": 1,
  "username": "王同学",
  "email": "wang@example.com",
  "phone": "138****8000",
  "hashed_password": "<bcrypt_hash_of_'password123'>",
  "is_active": true,
  "is_locked": false,
  "created_at": "2026-01-01T00:00:00Z",
  "updated_at": "2026-05-09T00:00:00Z"
}
```

- [ ] 2.2.2 为用户分配 `user` 角色（`user_roles` 表）

### 2.3 用户数据 — 注册测试用户（new_user）

- [ ] 2.3.1 插入用户 `mockRegisterUser`

```json
{
  "id": 2,
  "username": "new_user",
  "email": "new@example.com",
  "phone": null,
  "hashed_password": "<bcrypt_hash_of_'password123'>",
  "is_active": true,
  "is_locked": false,
  "created_at": "2026-01-01T00:00:00Z",
  "updated_at": "2026-01-01T00:00:00Z"
}
```

- [ ] 2.3.2 为用户分配 `user` 角色

### 2.4 用户画像数据 — 王同学 Profile

- [ ] 2.4.1 插入用户画像（关联 user_id=1）

```json
{
  "id": 1,
  "user_id": 1,
  "avatar_url": "",
  "education": "北京大学计算机科学与技术专业",
  "target_position": "前端开发工程师",
  "work_years": 2,
  "created_at": "2026-01-01T00:00:00Z",
  "updated_at": "2026-05-09T00:00:00Z"
}
```

---

## 3. API 接口验证

- [ ] 3.1 `POST /auth/register` — 用户名+密码注册（验证密码哈希、角色分配）
- [ ] 3.2 `POST /auth/login` — 账号密码登录（验证 JWT 签发、refresh_token）
- [ ] 3.3 `POST /auth/sms/send` — 发送短信验证码（如已实现）
- [ ] 3.4 `POST /auth/sms/login` — 短信验证码登录（如已实现）
- [ ] 3.5 `GET /auth/me` — 获取当前用户信息（验证 JWT 认证、返回 Profile）
- [ ] 3.6 `POST /auth/refresh` — 刷新 Token
- [ ] 3.7 `POST /auth/logout` — 登出（Token 黑名单）
- [ ] 3.8 `POST /auth/password/reset-token` — 请求密码重置
- [ ] 3.9 `POST /auth/password/reset` — 重置密码
- [ ] 3.10 `POST /auth/unlock/{username}` — 管理员解锁用户

---

## 4. 验证清单

- [ ] 4.1 使用 `wang@example.com` / `password123` 登录成功，返回 JWT Token
- [ ] 4.2 使用返回的 Token 调用 `GET /auth/me`，返回王同学完整信息
- [ ] 4.3 登录失败 5 次后用户被锁定（如后端已实现）
- [ ] 4.4 注册新用户后可用新账号登录

---

## 5. 注意事项

1. **密码**: 前端 Mock 中无密码字段，建议种子数据统一使用 `password123` 作为测试密码
2. **Token**: Mock 中 token 是动态生成的 mock 字符串，实际后端需通过 JWT 签发
3. **phone 字段**: `138****8000` 是脱敏后的展示值，数据库存储时需要完整手机号或标记为已脱敏
4. **Swagger 登录**: `POST /auth/swagger-login` 仅用于 Swagger UI 调试，种子数据不需要专门处理