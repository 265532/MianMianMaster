# User 模块联调任务清单

> **优先级**: P0 — 核心阻塞  
> **后端前缀**: `/api/v1/user`  
> **后端接口数量**: 4 个端点  
> **现有文件**: [user.api.ts](file:///d:/code/MianMianMaster/src/api/modules/user.api.ts) | [user.types.ts](file:///d:/code/MianMianMaster/src/api/types/user.types.ts) | [user.handler.ts](file:///d:/code/MianMianMaster/src/mock/handlers/user.handler.ts) | [user Store](file:///d:/code/MianMianMaster/src/stores/user.ts) | [Profile.vue](file:///d:/code/MianMianMaster/src/views/Profile.vue)

---

## 前置条件

- [ ] Auth 模块联调完成（登录/Token 管理正常）

---

## 差异分析

> **⚠️ 前端比后端多了 5 个端点，这些不在当前后端 Phase 4 中**，需确认：
> - `GET /user/interview-history`
> - `GET /user/ability-data`
> - `GET /user/game-interview-data`
> - `GET /user/resume`
> - `POST /user/resume/diagnose`
>
> 这些端点当前依赖 Mock 数据，联调时需 **降级处理**（静默返回空数组或错误提示），或与后端确认排期。

---

## Task 1: 标准端点签名对齐

| # | 端点 | 方法 | 前端方法 | 状态 |
|---|------|------|----------|------|
| 1.1 | `/user/profile` | GET | `userApi.getProfile()` | [ ] |
| 1.2 | `/user/profile` | PUT | `userApi.updateProfile()` | [ ] |
| 1.3 | `/user/security/change-password` | POST | `userApi.changePassword()` | [ ] |
| 1.4 | `/user/security/change-phone` | POST | `userApi.changePhone()` | [ ] |

---

## Task 2: 类型定义对齐

- [ ] 2.1 确认 `UserProfileUpdateRequest` 字段与后端 `PUT /user/profile` 一致，使用 `exclude_unset=True` 部分更新
- [ ] 2.2 确认 `ChangePasswordRequest`（`old_password`/`new_password`）字段
- [ ] 2.3 确认 `ChangePhoneRequest`（`phone`/`code`）字段
- [ ] 2.4 确认 `UserResponse` 包含 `id`/`username`/`email`/`profile`/`roles` 等关键字段

---

## Task 3: 用户画像获取与更新验证

- [ ] 3.1 **获取画像**: `GET /user/profile` → 验证返回用户画像，前端 Store `fetchUserInfo()` 正常
- [ ] 3.2 **首次自动初始化**: 新用户首次调用 → 验证后端自动创建空记录，前端无报错
- [ ] 3.3 **部分更新**: `PUT /user/profile` 只传 `skills` 字段 → 只更新该字段，不影响其他数据
- [ ] 3.4 **头像字段**: `avatar_url` 展示正常（当前为字符串 URL）
- [ ] 3.5 **Profile.vue 页面**: 页面加载后画像数据正确展示

---

## Task 4: 安全操作验证

- [ ] 4.1 **修改密码**: `POST /user/security/change-password` → 验证旧密码 → 新密码生效
- [ ] 4.2 **修改手机号**: `POST /user/security/change-phone` → 短信验证码验证 → 新手机号生效

---

## Task 5: 超范围端点降级处理

- [ ] 5.1 `getInterviewHistory()` 改为返回空数组 `[]`（或带上"暂不支持"提示），避免调用不存在端点
- [ ] 5.2 `getAbilityData()` 改为返回空对象 `{}`
- [ ] 5.3 `getGameInterviewData()` 改为返回空数据，`GameInterview.vue` 显示 EmptyState
- [ ] 5.4 `getResume()` 改为返回空对象 `{}`
- [ ] 5.5 `diagnoseResume()` 改为返回"功能开发中"提示
- [ ] 5.6 **确认策略**: 上述端点是否全量降级，还是部分已有后端对应用法（如通过其他模块暴露）

---

## Task 6: 错误处理验证

- [ ] 6.1 无 Token 调用 `GET /user/profile` → 返回 401，前端自动处理
- [ ] 6.2 修改密码传错误旧密码 → 显示错误消息
- [ ] 6.3 修改手机号验证码错误 → 显示错误消息

---

## 依赖关系

```
Auth 模块 → User 模块
User 模块 → Job & Skill（岗位匹配需要用户画像）
```