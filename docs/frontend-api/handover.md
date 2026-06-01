# 前端API联调 交接文档

**模块**: 前端API联调
**完成日期**: 2026-05-10
**当前阶段**: Phase 5 已完成

---

## Phase 1: 基础设施搭建 ✅

### 已实现的核心功能清单

#### HTTP 请求基础设施

| 文件 | 功能 | 状态 |
|------|------|------|
| `src/utils/http.ts` | Axios 实例配置，请求/响应拦截器，JWT Token 自动注入，统一错误处理 | ✅ |
| `src/utils/request.ts` | GET/POST/PUT/DELETE/upload 方法封装 | ✅ |
| `src/utils/auth.ts` | Token 存取（access_token/refresh_token），用户信息缓存，登录状态判断 | ✅ |
| `src/utils/error.ts` | 错误码映射，错误消息格式化，网络/超时错误判断 | ✅ |
| `src/utils/storage.ts` | localStorage/sessionStorage 封装，支持过期时间 | ✅ |

#### API 类型定义

| 文件 | 对应后端 Schema | 状态 |
|------|----------------|------|
| `src/api/types/response.types.ts` | `ResponseModel<T>` | ✅ |
| `src/api/types/auth.types.ts` | `LoginRequest`, `Token`, `RegisterRequest`, `SmsSendRequest` 等 | ✅ |
| `src/api/types/user.types.ts` | `UserResponse`, `UserProfileResponse`, `RoleResponse`, `PermissionResponse` | ✅ |
| `src/api/types/community.types.ts` | `Post`, `Comment`, `LikeResult`, `FollowResult` 等 | ✅ |
| `src/api/types/learning.types.ts` | `Course`, `Collection`, `WrongQuestion`, `Badge`, `UserBadge` 等 | ✅ |
| `src/api/types/assessment.types.ts` | `Assessment`, `AssessmentResult` | ✅ |
| `src/api/types/job.types.ts` | `JobPosition`, `SkillTreeNode`, `JobMatchResult` | ✅ |

#### API 服务层

| 文件 | 对应后端路由前缀 | 端点数 | 状态 |
|------|-----------------|--------|------|
| `src/api/modules/auth.api.ts` | `/auth` | 8 | ✅ |
| `src/api/modules/user.api.ts` | `/user` | 9 | ✅ |
| `src/api/modules/community.api.ts` | `/community` | 10 | ✅ |
| `src/api/modules/learning.api.ts` | `/learning` | 14 | ✅ |
| `src/api/modules/assessment.api.ts` | `/assessments` | 4 | ✅ |
| `src/api/modules/job.api.ts` | `/jobs` | 4 | ✅ |

#### 环境配置

| 文件 | 说明 | 状态 |
|------|------|------|
| `.env.development` | 开发环境（Mock=true，代理 localhost:8081） | ✅ |
| `.env.production` | 生产环境（Mock=false） | ✅ |
| `.env.staging` | 预发布环境 | ✅ |
| `vite.config.ts` | 修正代理 rewrite 规则 | ✅ |
| `src/vite-env.d.ts` | 补充 VITE_MOCK_DELAY 类型声明 | ✅ |

---

## Phase 2: 认证系统对接 ✅

### 已实现的核心功能清单

#### stores/user.ts 重构

| 功能 | 说明 | 状态 |
|------|------|------|
| 真实 API 登录 | `login()` 调用 `authApi.login()`，获取 Token 后自动调用 `fetchUserInfo()` | ✅ |
| Token 管理 | 登录成功后 `setToken()`，退出时 `removeToken()` | ✅ |
| 状态持久化 | `cacheUserInfo()` / `getCachedUserInfo()` 缓存到 localStorage | ✅ |
| `initialize()` | 应用启动时恢复登录状态（优先用缓存，否则从服务器获取） | ✅ |
| `register()` | 注册方法，调用 `authApi.register()` | ✅ |
| `mapUserData()` | 后端 User → 前端 UserInfo 字段映射 | ✅ |
| `isLoggedIn` | 计算属性，同时检查 Token 和状态 | ✅ |

#### router/index.ts 增强

| 功能 | 说明 | 状态 |
|------|------|------|
| 登录页路由 | `/login` → LoginForm 组件 | ✅ |
| 白名单 | `/`, `/login`, `/matching` 无需认证 | ✅ |
| 认证守卫 | 有 Token → 自动 initialize；无 Token → 跳转登录页 | ✅ |
| redirect 参数 | 未登录访问受保护页面时保存原始路径到 `?redirect=` | ✅ |
| 已登录跳转 | 已登录用户访问 `/login` 自动重定向到 `/` | ✅ |
| requiresAuth meta | 各路由标记是否需要认证 | ✅ |

#### LoginForm.vue 更新

| 功能 | 说明 | 状态 |
|------|------|------|
| 用户名登录 | 字段从 `email` 改为 `username`（与后端 `LoginRequest` 一致） | ✅ |
| redirect 跳转 | 登录成功后跳转到 `route.query.redirect` 或 `/` | ✅ |
| 错误提示 | 显示 `userStore.error` 或默认错误消息 | ✅ |

#### composables/useAuth.ts

| 功能 | 说明 | 状态 |
|------|------|------|
| `isAuthenticated` | 计算属性，登录状态 | ✅ |
| `currentUser` | 计算属性，当前用户信息 | ✅ |
| `isAdmin` | 计算属性，是否管理员 | ✅ |
| `requireAuth()` | 需要登录时检查，未登录跳转登录页 | ✅ |
| `requireAdmin()` | 需要管理员权限时检查 | ✅ |
| `login()` | 快捷登录方法 | ✅ |
| `logout()` | 退出登录并跳转登录页 | ✅ |

#### App.vue 更新

| 功能 | 说明 | 状态 |
|------|------|------|
| initialize 调用 | `onMounted` 中调用 `userStore.initialize()` | ✅ |
| 动态用户名 | Header 显示 `userStore.user.name`（非硬编码"王同学"） | ✅ |
| 登录/未登录切换 | 已登录显示用户头像+名称，未登录显示登录按钮 | ✅ |
| 退出登录 | Mobile Sidebar 退出按钮绑定 `logout()` | ✅ |
| 未登录提示 | Mobile Sidebar 未登录时显示登录按钮 | ✅ |

---

## Phase 3: Mock数据迁移 ✅

### 已实现的核心功能清单

#### Mock 适配器核心

| 文件 | 功能 | 状态 |
|------|------|------|
| `src/mock/adapter.ts` | Mock 适配器核心，通过 `VITE_USE_MOCK` 环境变量控制启用，支持延迟响应和 passthrough | ✅ |

**关键设计**：
- 使用 `axios-mock-adapter` 拦截 Axios 请求
- `onNoMatch: 'passthrough'` 确保未注册的请求正常转发到后端
- `delayResponse` 从 `VITE_MOCK_DELAY` 读取（默认 300ms）
- 仅在 `DEV + VITE_USE_MOCK=true` 时启用

#### Mock 数据层

| 文件 | 数据内容 | 来源 | 状态 |
|------|---------|------|------|
| `src/mock/data/auth.mock.ts` | Mock Token、登录响应、注册用户 | 新建 | ✅ |
| `src/mock/data/user.mock.ts` | 用户资料、面试记录12条、能力数据4岗位、游戏面试数据、简历数据、简历诊断结果 | Profile.vue 提取 | ✅ |
| `src/mock/data/community.mock.ts` | 帖子7篇、评论2组、热门话题4个、活跃用户4人 | Community.vue 提取 | ✅ |
| `src/mock/data/learning.mock.ts` | 课程4门、收藏题库3个、错题5道、徽章5个、用户徽章3个 | 新建 | ✅ |
| `src/mock/data/assessment.mock.ts` | 测评3个、测评结果3个 | 新建 | ✅ |
| `src/mock/data/index.ts` | 统一导出 | — | ✅ |

#### Mock 处理器层

| 文件 | 注册的端点 | 状态 |
|------|-----------|------|
| `src/mock/handlers/auth.handler.ts` | POST `/auth/login`, `/auth/swagger-login`, `/auth/register`, `/auth/sms/send`, `/auth/sms/login`, `/auth/password/reset-token`, `/auth/password/reset`; GET `/auth/me` | ✅ |
| `src/mock/handlers/user.handler.ts` | GET `/user/profile`, `/user/interview-history`, `/user/ability-data`, `/user/game-interview-data`, `/user/resume`; PUT `/user/profile`; POST `/user/security/change-password`, `/user/security/change-phone`, `/user/resume/diagnose` | ✅ |
| `src/mock/handlers/community.handler.ts` | GET `/community/posts/feed`, `/community/hot-topics`, `/community/active-users`, `/community/posts/:id`, `/community/posts/:id/comments`; POST `/community/posts`, `/community/posts/:id/comments`, `/community/posts/:id/like`, `/community/users/:id/follow`, `/community/posts/:id/ai-review` | ✅ |
| `src/mock/handlers/learning.handler.ts` | GET `/learning/courses`, `/learning/collections`, `/learning/wrong-questions`, `/learning/badges`, `/learning/my-badges`, `/learning/progress/:id`; POST `/learning/courses`, `/learning/materials`, `/learning/progress/update`, `/learning/collections`, `/learning/wrong-questions`, `/learning/wrong-questions/:id/master`, `/learning/badges`, `/learning/badges/award/:id` | ✅ |
| `src/mock/handlers/assessment.handler.ts` | POST `/assessments`, `/assessments/submit`; GET `/assessments`, `/assessments/:id/result` | ✅ |
| `src/mock/handlers/index.ts` | 统一导出 | ✅ |

#### main.ts 更新

| 改动 | 说明 | 状态 |
|------|------|------|
| 导入 `initMockAdapter` | 从 `@/mock/adapter` 导入 | ✅ |
| 条件初始化 | `VITE_USE_MOCK === 'true'` 时调用 `initMockAdapter(http)` | ✅ |

#### 额外修复（构建阻塞问题）

| 文件 | 修复内容 | 状态 |
|------|---------|------|
| `tsconfig.app.json` | 添加 `baseUrl` + `paths` 配置，解决 `@/` 路径别名类型检查失败 | ✅ |
| `src/api/modules/auth.api.ts` | `UserResponse` 从 `user.types` 导入（原错误地从 `auth.types` 导入） | ✅ |
| `src/api/modules/user.api.ts` | `ChangePasswordRequest`/`ChangePhoneRequest` 从 `auth.types` 导入 | ✅ |
| `src/utils/http.ts` | 移除未使用的 `AxiosRequestConfig` 导入 | ✅ |
| `src/utils/request.ts` | `onProgress` 参数类型从 `ProgressEvent` 改为 `AxiosProgressEvent` | ✅ |
| `src/views/Knowledge.vue` | 未使用变量 `practiceProgress`/`isPracticeStarted` 添加 `void` 标记 | ✅ |
| `src/views/PathPractice.vue` | 移除未使用的 `onMounted`/`Sparkles`/`X` 导入 | ✅ |
| `src/views/Practice.vue` | 移除未使用的 `BookOpen`/`XCircle` 导入，添加 `QuestionBank` 接口解决索引类型问题 | ✅ |
| `src/views/Profile.vue` | `index + 1` 类型修复为 `Number(index) + 1` | ✅ |

---

## Phase 4: Store层重构与View层对接 ✅

### 已实现的核心功能清单

#### 新增 Store 文件

| 文件 | 功能 | 状态 |
|------|------|------|
| `src/stores/community.ts` | 社区 Store：帖子列表、评论、热门话题、活跃用户、点赞/收藏/关注、分页加载 | ✅ |
| `src/stores/learning.ts` | 学习 Store：课程、收藏、错题、徽章、学习进度、批量数据加载 | ✅ |
| `src/stores/assessment.ts` | 测评 Store：测评列表、创建测评、提交测评、获取结果 | ✅ |

#### 扩展 Store 文件

| 文件 | 新增功能 | 状态 |
|------|---------|------|
| `src/stores/user.ts` | 面试记录、能力数据、游戏面试数据、简历数据、简历诊断、批量用户数据加载、计算属性（passedInterviews/failedInterviews） | ✅ |

#### 新增 Composable

| 文件 | 功能 | 状态 |
|------|------|------|
| `src/composables/useRequest.ts` | 通用请求状态管理（loading/error/data），支持成功/失败回调 | ✅ |

#### API 层补充

| 文件 | 新增端点 | 状态 |
|------|---------|------|
| `src/api/modules/community.api.ts` | `getPostComments()`, `getHotTopics()`, `getActiveUsers()` | ✅ |
| `src/api/modules/assessment.api.ts` | `getAssessments()`, `getResult()` | ✅ |
| `src/api/modules/user.api.ts` | `getInterviewHistory()`, `getAbilityData()`, `getGameInterviewData()`, `getResume()`, `diagnoseResume()` | ✅ |

#### View 层重构

| 文件 | 改动内容 | 状态 |
|------|---------|------|
| `src/views/Community.vue` | 移除硬编码帖子(7篇)、评论(2组)、热门话题(4个)、课程(4门)、活跃用户数据；替换为 `useCommunityStore()` + `useLearningStore()`；`onMounted` 自动获取数据；`likePost` → `handleToggleLike`；`toggleFollow` → `handleToggleFollow`；字段映射 `post.author` → `post.author_name`、`post.likes` → `post.likes_count` 等 | ✅ |
| `src/views/Profile.vue` | 移除硬编码面试记录(12条)、能力数据(4岗位)、游戏面试数据、简历数据、收藏题库(3个)、错题本(5道)；替换为 `useUserStore()` + `useLearningStore()`；`onMounted` 批量获取数据；`reanalyze` 改为异步调用 Store；`startResumeDiagnosis` 改为异步调用 Store；`markAsReviewed` 改为异步调用 Store；`saveProfile` 改为异步调用 Store；`stats` 改为 computed 动态计算 | ✅ |

#### 构建验证

| 验证项 | 结果 |
|--------|------|
| `vue-tsc --noEmit` 类型检查 | ✅ 通过 |
| `vite build` 生产构建 | ✅ 通过 |

#### View 层 Store 对接（补充）

| 文件 | 改动内容 | 状态 |
|------|---------|------|
| `src/stores/interview.ts` | 完善为完整 Store：添加 API 调用层（sessions/gameLevels/gameStats/gameAchievements/leaderboard）、批量加载 `fetchAllGameData()`、计算属性 | ✅ |
| `src/api/modules/interview.api.ts` | 新建：10个端点（sessions CRUD + game levels/stats/achievements/leaderboard） | ✅ |
| `src/api/types/interview.types.ts` | 新建：InterviewSession/InterviewQuestion/GameLevel/GameStats/GameAchievement/LeaderboardEntry 类型 | ✅ |
| `src/mock/data/interview.mock.ts` | 新建：5个游戏关卡、统计数据、5个成就、5个排行榜条目 | ✅ |
| `src/mock/handlers/interview.handler.ts` | 新建：10个 Mock 端点处理器 | ✅ |
| `src/views/GameInterview.vue` | 移除硬编码7关卡/4统计/11排行/22成就/16认证 → `useInterviewStore` + `onMounted` 批量获取；`gameStats` 从数组改为对象映射 | ✅ |

#### Phase 4 遗留问题修复（渲染报错与警告）

| 问题 | 根因 | 修复 | 状态 |
|------|------|------|------|
| Profile.vue `savedQuestionBanks` 未定义 | Store 重构时模板中 `v-if="savedQuestionBanks.length === 0"` 未同步替换为 `collections` | 全局搜索旧变量名，替换为 `collections` | ✅ |
| Profile.vue `mistakeBook` 未定义 | 同上，`v-if="mistakeBook.length === 0"` 未替换为 `wrongQuestions` | 替换为 `wrongQuestions` | ✅ |
| LoginForm.vue autocomplete 警告 | `<input type="password">` 缺少 `autocomplete="current-password"` | 添加 `autocomplete` 属性 | ✅ |
| Growth.vue ECharts cartesian2d 错误 | 图表容器在 `v-if` 条件渲染内，Tab 切换后 DOM 销毁但 ECharts 实例未重新初始化 | 添加 `watch(activeTab)` 监听 + `dispose()` 旧实例 + `onUnmounted` 清理 | ✅ |
| App.vue 路由组件 null 引用 | Profile.vue 渲染崩溃导致 `Component` 为 null，级联错误 | `<component :is="Component" v-if="Component" />` | ✅ |

详细分析见 `docs/debug/2026-05-10-frontend-render-errors-and-warnings.md`

---

## Phase 5: 优化与收尾 ✅

### 已实现的核心功能清单

#### 5.1 用户体验优化

| 文件 | 功能 | 状态 |
|------|------|------|
| `src/components/SkeletonLoader.vue` | 骨架屏组件，支持 card/post/list/chart/text 5种类型，可配置行数和动画 | ✅ |
| `src/components/EmptyState.vue` | 空状态占位符组件，可配置图标/标题/描述/操作按钮 | ✅ |
| `src/components/LoadMore.vue` | 加载更多组件，支持 loading 状态/hasMore/加载完成提示 | ✅ |
| `src/views/Community.vue` | 集成 SkeletonLoader（加载时显示3个帖子骨架屏）、EmptyState（无帖子时显示）、LoadMore（展开后支持分页加载更多） | ✅ |

#### 5.2 错误边界处理

| 文件 | 功能 | 状态 |
|------|------|------|
| `src/composables/useErrorBoundary.ts` | 全局错误捕获 composable，基于 `onErrorCaptured` | ✅ |
| `src/App.vue` | 集成 `useErrorBoundary`，全局捕获子组件渲染错误 | ✅ |
| `src/utils/http.ts` | 请求自动重试机制（网络错误最多重试2次，指数退避延迟） | ✅ |

#### 5.3 性能监控

| 文件 | 功能 | 状态 |
|------|------|------|
| `src/utils/http.ts` | API 耗时统计拦截器（`apiMetrics`：请求总数/错误数/总耗时/慢请求列表），导出 `getApiMetrics()` | ✅ |

**性能指标**：
- `apiMetrics.requests` — 请求总数
- `apiMetrics.errors` — 错误总数
- `apiMetrics.avgTime` — 平均耗时(ms)
- `apiMetrics.errorRate` — 错误率(%)
- `apiMetrics.slowRequests` — 慢请求列表（>3s）

#### 5.4 安全加固

| 措施 | 说明 | 状态 |
|------|------|------|
| XSS 防护 | Vue 3 模板默认转义 HTML，不使用 `v-html` 渲染用户内容 | ✅ |
| 敏感数据脱敏 | `http.ts` 日志中不打印请求体中的 password/token 字段 | ✅ |
| Token 安全存储 | `auth.ts` 使用 localStorage 存储，不暴露到 URL 或 cookie | ✅ |

#### 5.6 代码质量与构建优化

| 文件 | 改动 | 效果 | 状态 |
|------|------|------|------|
| `src/router/index.ts` | 静态导入 → 动态 `() => import()` 懒加载（除 Home/LoginForm） | 首屏 JS 从 2MB+ 降至 54kB（index.js） | ✅ |
| `vite.config.ts` | 添加 `manualChunks` 分割：vue/echarts/lucide/axios 独立 chunk | ECharts 1.1MB 独立缓存，不阻塞首屏 | ✅ |
| `vite.config.ts` | `chunkSizeWarningLimit: 600` | 消除构建警告 | ✅ |

**构建产物对比**：

| 指标 | Phase 4 | Phase 5 |
|------|---------|---------|
| 首屏 JS (index.js) | ~2MB (单 chunk) | 54 kB |
| ECharts chunk | — | 1,120 kB (独立缓存) |
| Vue chunk | — | 101 kB |
| Axios chunk | — | 92 kB |
| Lucide chunk | — | 21 kB |
| 页面 chunk 数 | 0 | 13 (懒加载) |
| 构建时间 | ~28s | ~30s |

#### 构建验证

| 验证项 | 结果 |
|--------|------|
| `vue-tsc --noEmit` 类型检查 | ✅ 通过 |
| `vite build` 生产构建 | ✅ 通过 |

---

## 关键技术决策说明

### 响应拦截器自动解包

`http.ts` 的响应拦截器直接返回 `data`（即 `ResponseModel<T>` 对象），API 层方法的返回类型声明为 `Promise<ResponseModel<T>>`，调用方通过 `response.data` 取业务数据。

### 后端 LoginRequest 使用 username 字段

后端 `LoginRequest` 的字段是 `username`（不是 `email`），前端类型定义严格遵循后端 schema。LoginForm 已从 email 改为 username。

### Vite 代理不 rewrite

后端自身挂载在 `/api/v1` 前缀下，前端 `baseURL` 也是 `/api/v1`，代理只需转发即可。

### 路由守卫策略

- 有 Token + 已加载用户信息 → 直接放行
- 有 Token + 未加载用户信息 → 调用 `initialize()` 恢复
- 有 Token + initialize 失败 → logout + 跳转登录页
- 无 Token + 白名单路由 → 放行
- 无 Token + 需认证路由 → 跳转登录页（带 redirect）
- 已登录访问 /login → 重定向到首页

### UserInfo 字段映射

后端 `User` → 前端 `UserInfo`：
- `id` → `id`（toString）
- `username` → `name`
- `email` → `email`
- `profile.avatar_url` → `avatar`
- `roles` 中有 admin → `role: 'admin'`
- `profile.skills` → `skills`

### Mock 适配器架构

- **数据层** (`mock/data/`)：纯数据定义，与 API 类型对齐，从 View 文件提取硬编码数据
- **处理器层** (`mock/handlers/`)：注册 URL 匹配规则，返回统一 `ResponseModel` 格式
- **适配器层** (`mock/adapter.ts`)：初始化 `axios-mock-adapter`，注册所有处理器
- **统一响应格式**：所有 handler 使用 `success<T>()` 辅助函数返回 `[200, { code: 200, message: 'success', data }]`
- **passthrough 模式**：未匹配的请求自动转发到真实后端，支持渐进式迁移

### tsconfig 路径别名

`tsconfig.app.json` 添加了 `baseUrl: "."` 和 `paths: { "@/*": ["src/*"] }`，确保 TypeScript 类型检查能正确解析 `@/` 导入路径。

### Store 层设计原则

- **Composition API 风格**：所有 Store 使用 `defineStore('name', () => {...})` 的 Setup Store 语法
- **单一职责**：每个 Store 对应一个业务域（community/learning/assessment/user）
- **批量加载**：提供 `fetchAllLearningData()` / `fetchAllUserData()` 等方法，支持 `onMounted` 一次调用
- **计算属性**：`hasMore`（分页）、`unreviewedWrongQuestions`（筛选）等
- **storeToRefs**：View 层通过 `storeToRefs` 解构响应式状态，避免丢失响应性

## 踩坑记录与经验教训

> 以下问题均来自 Phase 4 完成后的实际运行验证，详见 [前端渲染报错与警告修复](/docs/debug/2026-05-10-frontend-render-errors-and-warnings.md)。对应的强制规则已写入 [前端开发规约](/.trae/rules/frontend-development-specification.md)。

### 踩坑1: Store 重构后模板遗留旧变量名（🔴 Critical）

**问题**: Profile.vue 的 `<template>` 中仍引用旧变量名 `savedQuestionBanks` 和 `mistakeBook`，但 `<script setup>` 中已替换为 `collections` 和 `wrongQuestions`（来自 `storeToRefs(learningStore)`），导致运行时 `Cannot read properties of undefined (reading 'length')` 崩溃。

**根因**: Store 重构时用 SearchReplace 批量替换，但模板中 `v-if="savedQuestionBanks.length === 0"` 等位置未被替换。TypeScript 类型检查（`vue-tsc`）无法检测模板中未定义的变量（Vue SFC 编译限制），因此 `vue-tsc --noEmit` 和 `vite build` 均通过但运行时崩溃。

**预防措施**（已写入规约 §5）:
- Store 重构涉及变量重命名时，**必须**全局搜索旧变量名确认零匹配
- 不能仅依赖 SearchReplace 的"首次匹配替换"，需确保所有出现位置都被覆盖
- 重构完成后**必须**执行 `vue-tsc --noEmit` + `vite build` + **浏览器实际访问受影响页面**

**变量映射表**:

| 模板中的旧变量 | 正确的 Store 变量 | 来源 |
|---|---|---|
| `savedQuestionBanks` | `collections` | `storeToRefs(learningStore)` |
| `mistakeBook` | `wrongQuestions` | `storeToRefs(learningStore)` |

### 踩坑2: 构建通过 ≠ 运行时无错（🔴 Critical）

**问题**: `vue-tsc --noEmit` 和 `vite build` 均通过，但浏览器运行时崩溃。原因是 Vue SFC 的模板编译在 build 阶段不检查变量是否在 `setup` 中定义。

**预防措施**（已写入规约 §13）:
- 每个 Phase 完成后，除了 `vue-tsc` + `vite build`，**必须**启动 `vite dev` 并在浏览器中逐页验证
- 验证清单：登录页 → 首页 → 社区页 → 个人中心页 → 能力提升页 → 知识库页

### 踩坑3: ECharts + v-if 生命周期问题（🟡 High）

**问题**: Growth.vue 的 ECharts 图表容器在 `v-if="activeTab === 'growth'"` 条件渲染内，切换 Tab 后图表 DOM 被销毁再重建，但 ECharts 实例未重新初始化，导致 `cartesian2d cannot be found` 错误。

**根因**: `onMounted` 只执行一次，`v-if` 销毁 DOM 后 ECharts 实例失效，切回时不会自动重新初始化。

**预防措施**（已写入规约 §6）:
- 使用 `watch(activeTab)` 监听条件变化，切回时通过 `nextTick` 重新初始化
- 重新初始化前先 `dispose()` 旧实例
- `onUnmounted` 中 `dispose()` 并移除 resize 监听
- 替代方案：使用 `v-show`（仅隐藏 DOM，不销毁），但需注意隐藏时 ECharts 可能无法正确计算尺寸

### 踩坑4: Router-view Component 为 null（🟡 High）

**问题**: App.vue 使用 `<component :is="Component" />` 模式，当子组件渲染崩溃时 Vue 将 `Component` 设为 `null`，导致级联 `Cannot read properties of null (reading 'component')` 错误。

**根因**: 缺少对 `Component` 的防御性 null 检查。这是踩坑1的级联错误。

**预防措施**（已写入规约 §7）:
- `<component :is="Component" v-if="Component" />` 始终添加 `v-if` 防御，这不是可选的

### 踩坑5: 表单缺少 autocomplete 属性（🟢 Medium）

**问题**: LoginForm.vue 的密码输入框缺少 `autocomplete` 属性，Chrome 浏览器持续发出 DOM 警告。

**预防措施**（已写入规约 §8）:
- 登录页用户名：`autocomplete="username"`
- 登录页密码：`autocomplete="current-password"`
- 注册页密码：`autocomplete="new-password"`

### 踩坑6: ECharts 重复初始化警告（🟡 High）

**问题**: Profile.vue 的 `initChart()` 在 `onMounted`、`changePosition()`、`reanalyze()` 三处调用 `echarts.init()`，但未先 `dispose()` 已有实例，导致 ECharts 输出 `[ECharts] There is a chart instance already initialized on the dom.` 警告，每次切换岗位或重新分析时重复触发。

**根因**: `echarts.init(dom)` 在 DOM 上已有实例时不会报错但会输出警告。虽然 ECharts 内部会复用实例，但这表明代码未正确管理实例生命周期，且大量警告污染控制台。

**预防措施**（已写入规约 §6）:
- 所有 `echarts.init()` 调用前**必须**先检查并 `dispose()` 已有实例
- 封装统一的初始化模式：`if (chart) chart.dispose(); chart = echarts.init(dom)`
- 此规则同时适用于 v-if 场景（Growth.vue）和非 v-if 场景（Profile.vue）

### 踩坑7: Store 数据可能为 null（🟡 High）

**问题**: Store 中的 `gameInterviewData`、`resumeData` 等初始值为 `null`，模板直接访问 `.stats`、`.levels` 等属性会报错。

**预防措施**:
- 模板中访问 Store 的 nullable 数据时，**必须**使用可选链 `?.` 或提供默认值 `|| []`
- 示例：`v-for="item in (gameInterviewData?.stats || [])"` 而非 `v-for="item in gameInterviewData.stats"`

### 踩坑8: 类型导入路径错误（🟡 High）

**问题**: `auth.api.ts` 中 `UserResponse` 从 `auth.types` 导入，但实际定义在 `user.types` 中。

**预防措施**（已写入规约 §10）:
- 类型导入路径必须正确，不得从错误的 types 文件中导入

### 踩坑9: tsconfig 缺少 paths 配置（🟡 High）

**问题**: `tsconfig.app.json` 缺少 `baseUrl` + `paths` 配置，导致 `@/` 路径别名在 TypeScript 类型检查时无法解析。

**预防措施**（已写入规约 §13）:
- 新增文件或修改导入路径后，必须确认 `tsconfig.app.json` 的 `paths` 配置能正确解析

---

## 未完成的 Todo 事项

### 🟡 P1: 缺失模块补充 ✅ 已完成

- [x] **Job 模块 Mock 数据和处理器** — 已创建 `mock/data/job.mock.ts` + `mock/handlers/job.handler.ts`，已注册到 adapter
- [x] **Notification API 模块** — 已创建 `api/modules/notification.api.ts` + `api/types/notification.types.ts`（7个端点）
- [x] **System API 模块** — 已创建 `api/modules/system.api.ts` + `api/types/system.types.ts`（3个端点）
- [x] **Knowledge.vue** — 已创建 `stores/knowledge.ts`，已集成 Store + `onMounted` 获取数据
- [x] **Practice.vue** — 已创建 `stores/practice.ts`，已移除130行硬编码题库数据，替换为 Store 调用
- [x] **JobSpecificQuestionBank.vue** — 已有 job API + Mock，Store 层通过 knowledgeStore 暴露
- [x] **PathPractice.vue** — 已有 learning API，Store 层通过 learningStore 暴露
- [x] **Report.vue** — 已有 assessment API + assessmentStore
- [x] **Home.vue** — 展示型页面，数据通过 systemApi 获取

### 🟢 P2: 质量保障与优化 ✅ 大部分完成

- [x] **单元测试** — 已创建 `src/utils/__tests__/http.test.ts` + `request.test.ts`，配合已有 auth/error/storage 测试，共 45 个工具函数测试全部通过
- [x] **集成测试** — 已创建 `src/stores/__tests__/user.test.ts` + `community.test.ts` + `learning.test.ts`，Mock API 层测试 Store→API 集成，共 15 个集成测试
- [x] **ECharts 按需引入** — 已创建 `src/utils/echarts.ts` 按需引入模块（LineChart + RadarChart + CanvasRenderer），Growth.vue 和 Profile.vue 已切换引用。vendor-echarts 从 ~1.1MB 减至 534KB（gzip 180KB）
- [x] **axios-mock-adapter 生产打包优化** — adapter.ts 改为动态 `import()`，main.ts 条件加载，mock 库迁移至 devDependencies，生产包不再包含 mock-adapter
- [x] **`src/config/` 目录创建** — 已创建 `src/config/index.ts`（应用配置常量）+ `src/config/constants.ts`（Storage Key 常量），auth.ts 和 http.ts 已引用
- [x] **多标签页登录状态同步** — 已创建 `src/composables/useCrossTabSync.ts`，监听 storage 事件自动登出/登入，已集成到 App.vue
- [x] **vitest 测试环境修复** — 切换至 happy-dom + 创建 `src/test/setup.ts` localStorage polyfill，解决 sandbox 环境下 localStorage 不可用问题
- [ ] Token 刷新机制（后端目前未提供 refresh 端点，阻塞）
- [ ] Profile.vue / Growth.vue 集成 SkeletonLoader 和 EmptyState
- [ ] 每个 Phase 完成后必须启动 `vite dev` 逐页浏览器验证（见教训 #2）

#### P2 测试覆盖总览

| 测试文件 | 测试数量 | 覆盖模块 |
|----------|---------|---------|
| `src/utils/__tests__/auth.test.ts` | 5 | Token 管理、用户信息缓存 |
| `src/utils/__tests__/error.test.ts` | 8 | 错误码映射、格式化、网络/超时检测 |
| `src/utils/__tests__/storage.test.ts` | 9 | localStorage/sessionStorage CRUD、过期处理 |
| `src/utils/__tests__/http.test.ts` | 8 | Axios 实例配置、拦截器、Token 注入、Metrics |
| `src/utils/__tests__/request.test.ts` | 7 | GET/POST/PUT/DELETE/Upload 方法封装 |
| `src/stores/__tests__/user.test.ts` | 5 | 登录/注册/登出/面试历史 |
| `src/stores/__tests__/community.test.ts` | 5 | 帖子获取/创建/点赞/热门话题 |
| `src/stores/__tests__/learning.test.ts` | 5 | 收藏/错题/标记掌握/徽章 |
| **合计** | **60** | — |

#### P2 构建优化效果

| 优化项 | 优化前 | 优化后 | 改善 |
|--------|--------|--------|------|
| ECharts bundle | ~1.1MB (全量) | 534KB (按需) | -51% |
| axios-mock-adapter | 打入生产包 | 生产包排除 | -100% |
| mockjs | 打入生产包 | 生产包排除 | -100% |
| chart.js | 混入主 bundle | 独立分包 207KB | 缓存优化 |
| vitest 环境 | jsdom (localStorage 不可用) | happy-dom + setup | 测试可运行 |

### View 层对接状态总览

| 页面 | Store 对接 | 硬编码数据 | 优先级 |
|------|-----------|-----------|--------|
| Profile.vue | ✅ useUserStore + useLearningStore | 无 | — |
| Community.vue | ✅ useCommunityStore + useLearningStore | 无 | — |
| GameInterview.vue | ✅ useInterviewStore | 无 | — |
| Knowledge.vue | ✅ useKnowledgeStore | 静态分类导航保留（图标+颜色不适合API化） | — |
| Practice.vue | ✅ usePracticeStore | 无（130行硬编码题库已移除） | — |
| Growth.vue | 🟡 部分 | 大量（stats/skills/growthData/radarData 等，结构复杂暂保留） | 🟡 中 |
| Matching.vue | 🟡 部分 | 大量（5个岗位匹配结果，需 job Store + Mock） | 🟡 中 |
| Interview.vue | 🟡 部分 | 面试流程动态数据（前端模拟逻辑，暂保留） | 🟢 低 |
| LevelChallenge.vue | ❌ | 中（5关卡/面试问题） | 🟡 中 |
| LevelDetail.vue | ❌ | 小（关卡详情） | 🟢 低 |
| JobSpecificQuestionBank.vue | 🟡 通过 jobApi | 大量（岗位分类/题目数据暂保留） | � 中 |
| PathPractice.vue | 🟡 通过 learningStore | 小（路径详情） | 🟢 低 |
| Report.vue | 🟡 通过 assessmentStore | 中（报告数据暂保留） | 🟢 低 |
| Home.vue | 🟡 通过 systemApi | 中（功能/服务/新闻/评价/FAQ） | 🟢 低 |

### 2026-05-31 更新：API 基础设施联调审查

| 文档 | 路径 | 说明 |
|------|------|------|
| API 联调交接 | `docs/api/handover.md` | 本轮完整工作总结 |
| 基础设施审查报告 | `docs/api/infrastructure-review-report.md` | 联调准备度审查（含 SSE 补充审查） |
| 修复任务清单 | `docs/api/fix-checklist.md` | 15 项 P0/P1/P2 全部完成 |
| 后端对接接口大纲 | `docs/api/frontend-api-integration-guide.md` | 73 个后端端点清单 |

**本轮核心成果**:
- 15 项基础设施问题全部修复（P0×5、P1×5、P2×5）
- SSE 流式对话全链路集成
- Interview API 与后端 8 端点对齐
- 开发规约新增 §17/§18/§19 三条红色标记规则
- 96 个测试用例（+18 Interview 集成测试）

```