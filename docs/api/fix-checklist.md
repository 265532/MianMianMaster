# 后端联调基础设施修复任务清单

> **来源**: [基础设施联调审查报告](./infrastructure-review-report.md)
> **创建日期**: 2026-05-31
> **最后更新**: 2026-05-31
> **总任务数**: 15 项（P0: 5 / P1: 5 / P2: 5）
> **已完成**: 13 项 | **待确认**: 2 项（P2-14 WebSocket、P2-15 生产环境 API 前缀）

---

## 🔴 P0 — 联调前必须修复（5 项） ✅ 全部完成

### 任务 1: 实现 Token 自动刷新机制 ✅

**影响**: Token 过期后用户被强制跳转登录页，体验差
**涉及文件**: `src/utils/http.ts`、`src/api/modules/auth.api.ts`

- [x] 1.1 在 `src/api/modules/auth.api.ts` 中添加 `refreshToken()` 接口方法
  > ⚠️ 需与后端确认实际的 refresh 接口路径和参数格式

- [x] 1.2 在 `src/utils/http.ts` 的响应拦截器 401 分支中，替换硬跳转逻辑为 Token 刷新 + 请求重试

- [x] 1.3 在 `src/utils/http.ts` 中添加 `isRefreshing` 锁和 `pendingRequests` 待重试请求队列

- [x] 1.4 验证：`vue-tsc --noEmit` + `vite build` 通过

---

### 任务 2: 补充 `api/index.ts` 缺失的模块导出 ✅

**影响**: 入口文件与实际模块不一致，维护性差
**涉及文件**: `src/api/index.ts`、`src/api/types/index.ts`

- [x] 2.1 在 `src/api/index.ts` 中补充 3 个缺失的导出：`interviewApi`、`notificationApi`、`systemApi`

- [x] 2.2 同步更新 `src/api/types/index.ts` 补充缺失的类型导出：`interview.types`、`notification.types`、`system.types`

- [x] 2.3 验证：`vue-tsc --noEmit` 通过，确认无导入错误

---

### 任务 3: 创建 Notification Store ✅

**影响**: 通知功能无法在 View 层使用，功能缺失
**涉及文件**: 新建 `src/stores/notification.ts`

- [x] 3.1 创建 `src/stores/notification.ts`，对接 `notificationApi`，包含 `notifications`、`preferences`、`loading`、`error` 状态

- [x] 3.2 在 Store 中实现所有 action 方法：`fetchNotifications`、`fetchUnreadCount`、`markAsRead`、`markAllAsRead`、`fetchPreferences`、`updatePreferences`、`registerDeviceToken`

- [x] 3.3 验证：`vue-tsc --noEmit` 通过

---

### 任务 4: 创建 Notification/System Mock Handler ✅

**影响**: 开发环境无法独立调试通知和系统功能
**涉及文件**: 新建 4 个文件

- [x] 4.1 创建 `src/mock/data/notification.mock.ts`，定义 5 条通知 Mock 数据和偏好设置

- [x] 4.2 创建 `src/mock/handlers/notification.handler.ts`，注册 7 个端点的 Mock

- [x] 4.3 创建 `src/mock/data/system.mock.ts`，定义系统配置、健康检查、公告 Mock 数据

- [x] 4.4 创建 `src/mock/handlers/system.handler.ts`，注册 3 个端点的 Mock

- [x] 4.5 在 `src/mock/adapter.ts` 中注册新的 Handler（`registerNotificationHandlers`、`registerSystemHandlers`）

- [x] 4.6 更新 `src/mock/data/index.ts` 和 `src/mock/handlers/index.ts` 的导出

- [x] 4.7 验证：`vue-tsc --noEmit` + `vite build` 通过

---

### 任务 5: 补充 `mock/handlers/index.ts` 缺失的 Handler 导出 ✅

**影响**: 模块导出不完整，维护性差
**涉及文件**: `src/mock/handlers/index.ts`

- [x] 5.1 在 `src/mock/handlers/index.ts` 中补充 4 个缺失的导出：`registerInterviewHandlers`、`registerJobHandlers`、`registerNotificationHandlers`、`registerSystemHandlers`

- [x] 5.2 验证：`vue-tsc --noEmit` 通过

---

## 🟡 P1 — 联调期间优先修复（5 项） ✅ 全部完成

### 任务 6: 替换 `user.api.ts` 中的 `any` 返回类型 ✅

**影响**: 类型安全缺失，IDE 无法提供准确的类型提示
**涉及文件**: `src/api/modules/user.api.ts`、`src/api/types/user.types.ts`、`src/stores/user.ts`

- [x] 6.1 在 `src/api/types/user.types.ts` 中新增类型定义：`InterviewHistoryItem`、`InterviewHistoryResponse`、`AbilityDataIndicator`、`AbilityDataGapSkill`、`AbilityDataStrength`、`AbilityDataItem`、`GameStatItem`、`GameInterviewDataResponse`、`ResumeBasicInfo`、`ResumeEducation`、`ResumeExperience`、`ResumeProject`、`ResumeData`、`ResumeDiagnosisResult`

- [x] 6.2 更新 `src/api/modules/user.api.ts` 中 5 个方法的返回类型，消除所有 `any`

- [x] 6.3 将 `src/stores/user.ts` 中定义的重复类型移除，改为从 `@/api/types/user.types` 导入

- [x] 6.4 验证：`vue-tsc --noEmit` 通过，确认无类型错误

---

### 任务 7: 替换 `community.api.ts` 中的 `any[]` 返回类型 ✅

**影响**: 类型安全缺失
**涉及文件**: `src/api/types/community.types.ts`、`src/api/modules/community.api.ts`、`src/stores/community.ts`

- [x] 7.1 将 `HotTopic` 和 `ActiveUser` 接口添加到 `src/api/types/community.types.ts`

- [x] 7.2 更新 `src/api/modules/community.api.ts` 中 `getHotTopics()` 和 `getActiveUsers()` 的返回类型

- [x] 7.3 更新 `src/stores/community.ts` 的导入，从 `@/api/types/community.types` 导入 `HotTopic`、`ActiveUser`，移除 Store 内部重复定义

- [x] 7.4 验证：`vue-tsc --noEmit` 通过

---

### 任务 8: 替换 `learning.api.ts` 中的 `Record<string, any>` 参数类型 ✅

**影响**: 类型安全缺失，入参校验不完整
**涉及文件**: `src/api/types/learning.types.ts`、`src/api/modules/learning.api.ts`

- [x] 8.1 在 `src/api/types/learning.types.ts` 中新增 3 个请求体类型：`AddToCollectionRequest`、`RecordWrongQuestionRequest`、`CreateBadgeRequest`

- [x] 8.2 更新 `src/api/modules/learning.api.ts` 中 3 个方法的参数类型

- [x] 8.3 验证：`vue-tsc --noEmit` 通过

---

### 任务 9: 明确 `knowledge.store.ts` 中 `categories` 的数据来源 ✅

**影响**: 状态存在但无数据加载逻辑，功能不完整
**涉及文件**: `src/stores/knowledge.ts`

- [x] 9.1 确认 `categories` 和 `categoryDetails` 在 View 层（`Knowledge.vue`）中为组件内部硬编码数据，非来自 Store

- [x] 9.2 移除 Store 中无用的 `categories`（`any[]`）和 `categoryDetails` 状态，以及 `CategoryDetail` 接口

- [x] 9.3 验证：`vue-tsc --noEmit` + `vite build` 通过

---

### 任务 10: 重构 `practice.store.ts` 语义偏差 ✅

**影响**: 复用 `learningApi.getCourses()` 获取题库数据，语义不准确
**涉及文件**: `src/stores/practice.ts`、`src/api/modules/learning.api.ts`

- [x] 10.1 在 `learning.api.ts` 中新增 `getPracticeBanks()` 方法，语义上明确区分（传递 `type: "practice"` 参数）

- [x] 10.2 更新 `src/stores/practice.ts` 中的 `fetchBanks()` 方法，替换 `learningApi.getCourses()` 为 `learningApi.getPracticeBanks()`，消除 `any` 类型映射

- [x] 10.3 Mock Handler 无需更新（`getPracticeBanks` 复用 `/learning/courses` 端点，已有 Mock 覆盖）

- [x] 10.4 验证：`vue-tsc --noEmit` + `vite build` 通过

---

## 🟢 P2 — 优化建议（5 项） — 3 项完成 / 2 项待确认

### 任务 11: 清理 `tsconfig.app.json` 重复配置 ✅

**影响**: 配置冗余，不影响编译但影响可维护性
**涉及文件**: `tsconfig.app.json`

- [x] 11.1 删除重复的 `baseUrl` 和 `paths` 配置块，保留 `./src/*` 版本

- [x] 11.2 验证：`vue-tsc --noEmit` 通过，确认 `@/` 别名导入正常

---

### 任务 12: 修复 HTTP 拦截器 401 硬跳转 ✅

**影响**: 硬跳转丢失 `redirect` 参数，登录后无法回到原页面
**涉及文件**: `src/utils/http.ts`

- [x] 12.1 将 `window.location.href = "/login"` 改为携带 `redirect` 参数的跳转：
  ```typescript
  const currentPath = window.location.pathname + window.location.search;
  window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
  ```
  > 采用方案 B（`window.location` + redirect 参数），避免循环依赖

- [x] 12.2 验证：`vue-tsc --noEmit` + `vite build` 通过

---

### 任务 13: 统一 Assessment 模块 BASE_URL 路径风格 ✅

**影响**: 风格不一致，后端路由可能不匹配
**涉及文件**: `src/api/modules/assessment.api.ts`、`src/mock/handlers/assessment.handler.ts`

- [x] 13.1 将 `BASE_URL` 从 `/assessments`（复数）改为 `/assessment`（单数），与其他模块保持一致

- [x] 13.2 同步更新 Mock Handler 中 4 个端点路径：`/assessment`、`/assessment/submit`、`/assessment/{id}/result`

- [x] 13.3 验证：`vue-tsc --noEmit` + `vite build` 通过

---

### 任务 14: 添加 WebSocket 代理配置（按需） ⏳ 待确认

**影响**: 如果有实时通知/面试对话等 WebSocket 需求，当前配置不支持
**涉及文件**: `vite.config.ts`

- [ ] 14.1 确认后端是否有 WebSocket 端点需求：
  - 如无 → 跳过此任务
  - 如有 → 在 `vite.config.ts` 的 proxy 配置中添加 `ws: true`

- [ ] 14.2 验证：前端 WebSocket 连接 → 确认代理转发正常

---

### 任务 15: 确认 `.env.production` API 前缀配置 ⏳ 待确认

**影响**: 生产环境 API 请求可能指向错误地址
**涉及文件**: `.env.production`

- [ ] 15.1 确认生产部署架构：
  - 如果使用 Nginx 反向代理（前端与 API 同域） → 保持 `VITE_API_BASE_URL=/api/v1`
  - 如果 API 独立部署（跨域） → 修改为完整 URL

- [ ] 15.2 根据确认结果更新 `.env.production` 中的 `VITE_API_BASE_URL`

- [ ] 15.3 验证：`vite build` 成功后，确认生产构建中的 API 请求地址正确

---

## 构建验证结果 ✅

- [x] `vue-tsc --noEmit` — TypeScript 类型检查零错误
- [x] `vite build` — 生产构建成功（无警告）
- [ ] `VITE_USE_MOCK=true pnpm dev` — Mock 模式启动正常，浏览器访问所有页面无报错（需手动验证）
- [ ] `VITE_USE_MOCK=false pnpm dev` — 代理模式启动正常，确认所有 API 请求正确转发到后端（需后端可用）
- [ ] 认证流程验证：登录 → 获取 Token → API 调用 → 登出（需手动验证）
- [ ] 关键页面运行时验证：首页 → 面试实战 → 能力提升 → 面试社区 → 知识库 → 个人中心（需手动验证）
- [ ] Notification 功能验证：通知列表 → 标记已读 → 偏好设置（需手动验证）
- [x] 类型引入验证：`api/index.ts`、`api/types/index.ts`、`mock/handlers/index.ts`、`mock/data/index.ts` 导出完整无遗漏

---

## 修改文件清单

| 文件 | 操作 | 说明 |
|------|------|------|
| `src/api/index.ts` | 修改 | 补充 3 个 API 模块导出 |
| `src/api/types/index.ts` | 修改 | 补充 3 个类型模块导出 |
| `src/api/modules/auth.api.ts` | 修改 | 新增 `refreshToken()` 方法 |
| `src/api/modules/user.api.ts` | 修改 | 替换 5 个 `any` 返回类型为具体类型 |
| `src/api/modules/community.api.ts` | 修改 | 替换 2 个 `any[]` 返回类型 |
| `src/api/modules/learning.api.ts` | 修改 | 替换 3 个 `Record<string, any>` 参数类型，新增 `getPracticeBanks()` |
| `src/api/modules/assessment.api.ts` | 修改 | `BASE_URL` 从 `/assessments` 改为 `/assessment` |
| `src/api/types/user.types.ts` | 修改 | 新增 14 个类型定义 |
| `src/api/types/community.types.ts` | 修改 | 新增 `HotTopic`、`ActiveUser` 类型 |
| `src/api/types/learning.types.ts` | 修改 | 新增 3 个请求体类型 |
| `src/utils/http.ts` | 修改 | Token 自动刷新 + 请求队列 + redirect 跳转 |
| `src/stores/user.ts` | 修改 | 移除重复类型定义，改为从 types 导入 |
| `src/stores/community.ts` | 修改 | 移除重复类型定义，改为从 types 导入 |
| `src/stores/knowledge.ts` | 修改 | 移除无用的 `categories`/`categoryDetails` 状态 |
| `src/stores/practice.ts` | 修改 | 改用 `getPracticeBanks()`，消除 `any` |
| `src/stores/notification.ts` | **新建** | Notification Store，7 个 action |
| `src/mock/data/notification.mock.ts` | **新建** | 通知 Mock 数据 |
| `src/mock/data/system.mock.ts` | **新建** | 系统 Mock 数据 |
| `src/mock/handlers/notification.handler.ts` | **新建** | 通知 Mock Handler（7 端点） |
| `src/mock/handlers/system.handler.ts` | **新建** | 系统 Mock Handler（3 端点） |
| `src/mock/handlers/index.ts` | 修改 | 补充 4 个 Handler 导出 |
| `src/mock/data/index.ts` | 修改 | 补充 2 个数据导出 |
| `src/mock/adapter.ts` | 修改 | 注册 Notification/System Handler |
| `src/mock/handlers/assessment.handler.ts` | 修改 | 路径从 `/assessments` 改为 `/assessment` |
| `tsconfig.app.json` | 修改 | 清理重复的 `baseUrl`/`paths` 配置 |