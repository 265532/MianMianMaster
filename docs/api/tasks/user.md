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

> **✅ 已补充的端点（2026-06-03 后端已实现）**：
> - `GET /user/interview-history` — ⚠️ 数据结构待对齐（见下方验证结果）
> - `GET /user/ability-data` — ⚠️ 数据结构待对齐
> - `GET /user/game-interview-data` — ⚠️ 数据结构待对齐
>
> **仍未实现的端点**：
> - `GET /user/resume`
> - `POST /user/resume/diagnose`
>
> 前端已对所有超范围端点做了 Mock 降级处理（API 失败时自动回退到 Mock 数据）。

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

- [x] 5.1 `getInterviewHistory()` — API 失败时降级到 Mock 数据（`src/stores/user.ts`）
- [x] 5.2 `getAbilityData()` — API 失败时降级到 Mock 数据（`src/stores/user.ts`）
- [x] 5.3 `getGameInterviewData()` — API 失败时降级到 Mock 数据（`src/stores/user.ts`）
- [x] 5.4 `getResume()` — API 失败时降级到 Mock 数据（`src/stores/user.ts`）
- [x] 5.5 `diagnoseResume()` — API 失败时降级到 Mock 数据（`src/stores/user.ts`）
- [x] 5.6 学习模块 `fetchCollections()` / `fetchWrongQuestions()` 同样做了 Mock 降级（`src/stores/learning.ts`）

---

## Task 6: 错误处理验证

- [ ] 6.1 无 Token 调用 `GET /user/profile` → 返回 401，前端自动处理
- [ ] 6.2 修改密码传错误旧密码 → 显示错误消息
- [ ] 6.3 修改手机号验证码错误 → 显示错误消息

---

## Task 7: 集成验证（2026-06-03）

> 后端 3 个用户端点已补充 + 学习模块 Bug 已修复，验证结果如下：

### 7.1 接口可达性 ✅

| 接口 | HTTP 状态 | 响应码 | 结果 |
|------|----------|--------|------|
| `GET /user/interview-history` | 200 | 200 | ✅ 正常 |
| `GET /user/ability-data` | 200 | 200 | ✅ 正常 |
| `GET /user/game-interview-data` | 200 | 200 | ✅ 正常 |
| `GET /learning/collections` | 200 | 200 | ✅ 正常（Bug 已修复） |
| `GET /learning/wrong-questions` | 200 | 200 | ✅ 正常（Bug 已修复） |

### 7.2 数据结构匹配 ⚠️

| 接口 | 后端实际返回 `data` | 前端期望类型 | 匹配 |
|------|-------------------|------------|------|
| `interview-history` | `[]` (list) | `{ items, total, page, page_size }` | ⚠️ 无数据时返回空列表而非分页对象，但 store 中 `data.items \|\| data` 兼容 |
| `ability-data` | `[]` (list) | `Record<string, AbilityDataItem>` | ⚠️ 无数据时返回空列表而非空对象，Profile.vue 用 `abilityData[pos]` 访问，undefined 走 fallback |
| `game-interview-data` | `{ total_interviews, completed_interviews, average_score, ... }` | `{ stats[], levels[], achievements[], leaderboard[] }` | ❌ 结构完全不同，页面依赖 Mock 降级 |
| `learning/collections` | `[]` (list) | `Collection[]` | ✅ 匹配 |
| `learning/wrong-questions` | `[]` (list) | `WrongQuestion[]` | ✅ 匹配 |

### 7.3 结论

- **学习模块**: 接口正常，数据结构匹配，Mock 降级仅在后端不可用时生效 ✅
- **用户模块 interview-history / ability-data**: 接口正常，无数据时结构差异被 store 代码兼容，有数据后需验证实际字段是否匹配
- **用户模块 game-interview-data**: 后端返回统计摘要，前端期望游戏化关卡/成就/排行榜，**结构完全不匹配**，当前完全依赖 Mock 降级
- **需后端跟进**: `game-interview-data` 需按前端 `GameInterviewDataResponse` 类型补充 `levels` / `achievements` / `leaderboard` 字段

---

## 依赖关系

```
Auth 模块 → User 模块
User 模块 → Job & Skill（岗位匹配需要用户画像）
```