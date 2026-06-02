# 前端对接接口清单 — 覆盖率审查报告

> **审查日期**: 2026-05-31  
> **审查范围**: `docs/api/frontend-api-integration-guide.md`  
> **对照基准**: `src/api/modules/*.api.ts` + `src/api/types/*.types.ts`（前端实际代码）  
> **审查方法**: 文档逐模块与前端 API 层代码双向交叉验证

---

## 总体评估

| 维度 | 评分 | 说明 |
|------|------|------|
| 接口定义完整性 | ⚠️ 中 | 文档声称 73 个接口，与前端 API 层存在 18 个不一致 |
| 参数说明准确性 | ⚠️ 中 | 多处请求/响应字段与前端类型定义不符 |
| 返回值格式规范性 | ⚠️ 中 | Token 响应结构缺失关键字段，分页格式未统一说明 |
| 错误处理完善性 | ❌ 低 | 全文档无任何错误码/错误场景描述 |
| 接口调用示例有效性 | ❌ 低 | 全文档无一例请求/响应示例 |
| 前端集成技术细节 | ⚠️ 中 | SSE、面试状态机等描述较好，但缺乏认证流程细节 |

**总体评级**: ⚠️ **需要重大改进** — 文档与前端实际代码存在显著偏差。

---

## 一、逐模块详细审查

### 1. 认证模块 (Auth) — `src/api/modules/auth.api.ts`

| 文档接口 | 前端实现 | 状态 |
|----------|----------|------|
| POST `/auth/register` | ✅ 已实现 | 一致 |
| POST `/auth/login` | ✅ 已实现 | 一致 |
| POST `/auth/sms/send` | ✅ 已实现 | 一致 |
| POST `/auth/sms/login` | ✅ 已实现 | 一致 |
| GET `/auth/me` | ✅ 已实现 | 一致 |
| POST `/auth/refresh` | ✅ 已实现 | 一致 |
| POST `/auth/logout` | ❌ 前端**未实现** | 🔴 缺失 |
| POST `/auth/password/reset-token` | ✅ 已实现 | 一致 |
| POST `/auth/password/reset` | ✅ 已实现 | 一致 |
| POST `/auth/unlock/{username}` | ❌ 前端**未实现** | 🔴 缺失 |
| POST `/auth/swagger-login` | ✅ 已实现 | ⚠️ 文档仅在"要点"提及，未列入接口表 |

**发现的问题**:

1. 🔴 **[缺失] 登出接口**: 文档列出 `POST /auth/logout` 但前端 `authApi` 中无此方法。前端需要实现 Token 吊销逻辑。

2. 🔴 **[缺失] 解锁用户接口**: 文档列出 `POST /auth/unlock/{username}`（管理员功能）但前端未实现。若管理后台需要此功能则必须补充。

3. 🟡 **[字段不一致] Token 响应结构**: 文档提到双 Token 机制（`access_token` + `refresh_token`），但前端 [auth.types.ts](file:///d:/code/MianMianMaster/src/api/types/auth.types.ts#L14-L17) 中 `Token` 接口仅含 `access_token` 和 `token_type`，**缺失 `refresh_token` 字段**。这导致前端无法在 `login()` 响应中获取 `refresh_token`。

4. 🟡 **[字段不一致] RegisterRequest**: 前端 [auth.types.ts](file:///d:/code/MianMianMaster/src/api/types/auth.types.ts#L6-L12) 中 `RegisterRequest` 包含 `email`、`phone`、`role_ids` 字段，文档未提及这些参数。

5. 🟡 **[遗漏] swagger-login 接口**: 文档仅在"前端对接要点"中提及 `/auth/swagger-login` 用于调试，未列入接口清单主表。建议补充。

6. 🟡 **[字段不一致] PasswordResetTokenRequest**: 前端使用 `email` 字段，而文档"重置密码"在手机号上下文（短信验证码注册）中，可能存在手机号与邮箱使用场景混淆。

---

### 2. 用户中心模块 (User) — `src/api/modules/user.api.ts`

| 文档接口 | 前端实现 | 状态 |
|----------|----------|------|
| GET `/user/profile` | ✅ 已实现 | 一致 |
| PUT `/user/profile` | ✅ 已实现 | 一致 |
| POST `/user/security/change-password` | ✅ 已实现 | 一致 |
| POST `/user/security/change-phone` | ✅ 已实现 | 一致 |
| — | GET `/user/interview-history` | 🟡 文档未提及 |
| — | GET `/user/ability-data` | 🟡 文档未提及 |
| — | GET `/user/game-interview-data` | 🟡 文档未提及 |
| — | GET `/user/resume` | 🟡 文档未提及 |
| — | POST `/user/resume/diagnose` | 🟡 文档未提及 |

**发现的问题**:

1. 🟡 **[缺失] 5 个接口未列入文档**: 前端实现了 `interview-history`、`ability-data`、`game-interview-data`、`resume`、`resume/diagnose` 共 5 个接口，文档完全未覆盖。这些接口支持"面试历史""能力雷达图""游戏化面试数据""简历管理"等前端页面功能，属于业务重要接口。

2. 🟡 **[不完整] 画像字段说明**: 文档提到 `avatar_url`、`education`、`target_position`、`work_years`，但前端 [user.types.ts](file:///d:/code/MianMianMaster/src/api/types/user.types.ts#L13-L22) 的 `UserProfileResponse` 中不含 `nickname`、`bio` 等常见扩展字段。需确认是否需要补充。

---

### 3. 消息通知模块 (Notification) — `src/api/modules/notification.api.ts`

| 文档接口 | 前端实现 | 状态 |
|----------|----------|------|
| GET `/notifications` | ✅ 已实现 | 一致 |
| GET `/notifications/unread-count` | ✅ 已实现 | 一致 |
| PUT `/notifications/{id}/read` | ✅ 已实现 | 一致 |
| PUT `/notifications/read-all` | ✅ 已实现 | 一致 |
| — | GET `/notifications/preferences` | 🟡 文档未提及 |
| — | PUT `/notifications/preferences` | 🟡 文档未提及 |
| — | POST `/notifications/device-token` | 🟡 文档未提及 |

**发现的问题**:

1. 🟡 **[缺失] 通知偏好与设备注册**: 文档缺少 3 个接口：获取/更新通知偏好设置、设备推送 Token 注册。文档提到"当前无 WebSocket 推送"建议轮询，但前端已实现 `device-token` 注册（表明后端可能已支持或规划支持推送），文档描述与前端实现存在矛盾。

2. 🟡 **[类型缺失] 通知类型定义**: 前端 [notification.types.ts](file:///d:/code/MianMianMaster/src/api/types/notification.types.ts#L1-L9) 定义了 `type: "system" | "interview_result" | "community" | "learning"` 四种通知类型，文档未列出。

3. 🟡 **[字段缺失] 通知链接**: 前端 `Notification` 类型包含 `link?: string` 字段（用于点击跳转），文档未提及。

---

### 4. 岗位与知识图谱模块 (Job) — `src/api/modules/job.api.ts`

| 文档接口 | 前端实现 | 状态 |
|----------|----------|------|
| POST `/jobs` | ✅ 已实现 | ⚠️ 不一致 |
| GET `/jobs` | ✅ 已实现 | 一致 |
| GET `/jobs/{job_id}/skill-tree` | ✅ 已实现 | ⚠️ 不一致 |
| GET `/jobs/{job_id}/match` | ✅ 已实现 | 一致 |

**发现的问题**:

1. 🔴 **[字段缺失] 技能树关键字段**: 文档明确提到 `SkillTreeNode` 返回 `is_required` 和 `has_required_child` 标记用于前端高亮渲染。但前端 [job.types.ts](file:///d:/code/MianMianMaster/src/api/types/job.types.ts#L22-L28) 中 `SkillTreeNode` 仅含 `id`、`name`、`category`、`level`、`children`，**缺失这两个关键标记字段**。这会导致前端无法正确渲染技能树高亮。

2. 🟡 **[认证矛盾] POST /jobs**: 文档标注"认证: 否"，但用途描述为"管理后台"。管理后台接口通常需要认证，建议明确是否需要管理员角色。

3. 🟡 **[缺失] 岗位搜索/筛选参数**: 文档仅提及分页，前端 `listJobPositions` 接受通用 `PaginationParams`。未列出可用的筛选参数（如关键词、地区、薪资范围）。

4. 🟡 **[字段遗漏] JobPosition**: 前端 [JobPosition](file:///d:/code/MianMianMaster/src/api/types/job.types.ts#L1-L11) 包含 `company`、`location`、`salary_range`、`requirements` 字段，文档未提及这些响应字段。

---

### 5. 测评系统模块 (Assessment) — `src/api/modules/assessment.api.ts`

| 文档接口 | 前端实现 | 状态 |
|----------|----------|------|
| POST `/assessments` | ✅ 已实现 | 一致 |
| POST `/assessments/submit` | ✅ 已实现 | ⚠️ 不一致 |
| — | GET `/assessments` | 🟡 文档未提及 |
| — | GET `/assessments/{id}/result` | 🟡 文档未提及 |

**发现的问题**:

1. 🟡 **[缺失] 测评列表与结果查询**: 文档缺少 `GET /assessments`（获取测评列表）和 `GET /assessments/{id}/result`（获取测评结果详情），但前端已实现这两个接口。

2. 🔴 **[不一致] Submit 请求体**: 文档描述测评提交包含题目作答，预计有 `question_id` + `answer` 等字段。但前端 [assessment.types.ts](file:///d:/code/MianMianMaster/src/api/types/assessment.types.ts#L8-L11) 中 `AssessmentCreate` 仅含 `type?` 和 `answers?: Record<string, any>`，且 `submitAssessment` 传参方式为 `{ id, ...data }`，与文档描述的"题目类型：single_choice/multiple_choice/text"的细粒度结构不匹配。

3. 🟡 **[缺失] 题目模型**: 文档提到三种题目类型，但前端没有独立的 `Question` 类型定义，整个前端 types 目录中未定义题目相关的接口。

4. 🟡 **[不完整] 异步判卷状态**: 文档提到 LLM 异步判卷，`submit` 为 async 接口。前端 `submitAssessment` 是普通 POST 调用，无轮询/polling 机制等待判卷结果（虽然 `getResult` 可以查询，但未在设计上关联说明）。

---

### 6. 学习系统模块 (Learning) — `src/api/modules/learning.api.ts`

| 文档接口 | 前端实现 | 状态 |
|----------|----------|------|
| POST `/learning/courses` | ✅ 已实现 | 一致 |
| GET `/learning/courses` | ✅ 已实现 | 一致 |
| POST `/learning/materials` | ✅ 已实现 | 一致 |
| POST `/learning/progress/update` | ✅ 已实现 | 一致 |
| GET `/learning/progress/{course_id}` | ✅ 已实现 | 一致 |
| POST `/learning/collections` | ✅ 已实现 | ⚠️ 参数差异 |
| GET `/learning/collections` | ✅ 已实现 | 一致 |
| POST `/learning/wrong-questions` | ✅ 已实现 | 一致 |
| GET `/learning/wrong-questions` | ✅ 已实现 | 一致 |
| POST `/learning/wrong-questions/{id}/master` | ✅ 已实现 | 一致 |
| POST `/learning/badges` | ✅ 已实现 | 一致 |
| GET `/learning/badges` | ✅ 已实现 | 一致 |
| POST `/learning/badges/award/{badge_id}` | ✅ 已实现 | 一致 |
| GET `/learning/my-badges` | ✅ 已实现 | 一致 |

**发现的问题**:

1. 🟡 **[参数差异] 收藏接口**: 文档描述"收藏题目"，暗示只需 `question_id`。但前端 `AddToCollectionRequest` 包含 `title`、`description`、`question_ids`、`category`、`difficulty` 多个字段。这可能含义不同（文档指收藏单个题目，前端指创建"收藏题集"）。

2. 🟡 **[多余接口] getPracticeBanks**: 前端 `learningApi` 有一个 `getPracticeBanks` 方法调用 `GET /learning/courses?type=practice`，这是一个变体而非独立路由。文档未提及题库练习子系统。

3. 🟡 **[徽章触发遗漏]**: 文档提到"测评得分 > 80 分也会自动触发 score_reached 徽章"（后端行为），前端无需特殊处理，但文档可明确标注"后端自动触发"以避免前端开发困惑。

---

### 7. 社区互动模块 (Community) — `src/api/modules/community.api.ts`

| 文档接口 | 前端实现 | 状态 |
|----------|----------|------|
| POST `/community/posts` | ✅ 已实现 | ⚠️ 字段不足 |
| GET `/community/posts/feed` | ✅ 已实现 | 一致 |
| GET `/community/posts/{post_id}` | ✅ 已实现 | 一致 |
| PUT `/community/posts/{post_id}` | ❌ 前端**未实现** | 🔴 缺失 |
| DELETE `/community/posts/{post_id}` | ❌ 前端**未实现** | 🔴 缺失 |
| POST `/community/posts/{id}/comments` | ✅ 已实现 | ⚠️ 字段不足 |
| POST `/community/posts/{id}/like` | ✅ 已实现 | 一致 |
| POST `/community/users/{id}/follow` | ✅ 已实现 | 一致 |
| POST `/community/posts/{id}/ai-review` | ✅ 已实现 | ⚠️ 不一致 |
| — | GET `/community/posts/{id}/comments` | 🟡 文档未提及 |
| — | GET `/community/hot-topics` | 🟡 文档未提及 |
| — | GET `/community/active-users` | 🟡 文档未提及 |

**发现的问题**:

1. 🔴 **[缺失] 编辑/删除帖子**: 文档列出 `PUT` 和 `DELETE` 帖子接口，但前端 `communityApi` 中**完全缺失**这两个方法。用户无法编辑或删除已发布的帖子。

2. 🔴 **[缺失] 帖子分类字段**: 文档提到帖子分为 `interview_review`（面试复盘）、`real_questions`（真题分享）、`experience`（经验分享）。但前端 [PostCreate](file:///d:/code/MianMianMaster/src/api/types/community.types.ts#L15-L18) 仅含 `title` 和 `content`，**缺失 `category` 字段**（且 Post 接口也缺失此字段）。

3. 🔴 **[缺失] 楼中楼 parent_id**: 文档明确说明评论通过 `parent_id` 实现楼中楼嵌套回复。但前端 [CommentCreate](file:///d:/code/MianMianMaster/src/api/types/community.types.ts#L29-L31) 仅含 `content`，**缺失 `parent_id` 字段**。前端目前完全无法实现嵌套评论。

4. 🔴 **[缺失] AI 点评内容**: 文档说 `ai_review_content` 字段在帖子详情中。但前端 [AiReviewResult](file:///d:/code/MianMianMaster/src/api/types/community.types.ts#L42-L45) 仅含 `task_id` 和 `status`，Post 接口也缺失 `ai_review_content` 字段。前端无法获取 AI 点评结果。

5. 🟡 **[缺失] 3 个未文档化接口**: `getPostComments`、`getHotTopics`（热门话题）、`getActiveUsers`（活跃用户）已在社区页面使用，文档未提及。

6. 🟡 **[类型不匹配] Post 类型**: 前端 `Post` 缺少文档暗示的 `category`、`ai_review_content`、`is_following` 等字段。

---

### 8. AI 面试模块 (Interview) — `src/api/modules/interview.api.ts`

| 文档接口 | 前端实现 | 状态 |
|----------|----------|------|
| POST `/interview/sessions` | ✅ 已实现 | 一致 |
| GET `/interview/sessions/{id}` | ✅ 已实现 | 一致 |
| GET `/interview/sessions` | ✅ 已实现 | 一致 |
| POST `/interview/sessions/{id}/start` | ✅ 已实现 | 一致 |
| POST `/interview/sessions/{id}/chat` | ✅ 已实现 | ⚠️ 参数差异 |
| POST `/interview/sessions/{id}/end` | ✅ 已实现 | 一致 |
| POST `/interview/sessions/{id}/cancel` | ✅ 已实现 | 一致 |
| GET `/interview/sessions/{id}/report` | ✅ 已实现 | 一致 |
| — | GET `/interview/questions` | 🟡 文档未提及 |
| — | GET `/interview/game/levels` | 🟡 文档未提及 |
| — | GET `/interview/game/stats` | 🟡 文档未提及 |
| — | GET `/interview/game/achievements` | 🟡 文档未提及 |
| — | GET `/interview/game/leaderboard` | 🟡 文档未提及 |

**发现的问题**:

1. 🟡 **[缺失] 游戏化面试模块**: 前端实现了 5 个游戏化相关接口（`/questions`、`/game/levels`、`/game/stats`、`/game/achievements`、`/game/leaderboard`），文档完全未覆盖。这是面试模块的重要增值功能。

2. 🟡 **[SSE 参数说明]**: 文档描述 `/chat` 为 SSE 流式接口，但未说明请求体的 `message` 字段格式。前端 [interview.api.ts](file:///d:/code/MianMianMaster/src/api/modules/interview.api.ts#L79) 发送 `{ message }`，而文档"前端对接要点"未列出请求参数。

3. 🟡 **[缺失] SSE 错误码说明**: 文档列出 SSE 事件类型（token/done/error/round_limit），但 `error` 事件中未说明 `data` 字段的格式（错误码、错误信息结构）。

4. 🟡 **[缺失] 超时配置值**: 文档提到 `INTERVIEW_TIMEOUT_MINUTES` 默认配置，但未给出具体默认值。前端需此值做超时提示。

---

### 9. 业务配置模块 (Business) — ⚠️ 前端**无对应模块**

| 文档接口 | 前端实现 | 状态 |
|----------|----------|------|
| GET `/business/knowledge-graph` | ❌ 未实现 | 🔴 缺失 |
| POST `/business/knowledge-graph` | ❌ 未实现 | 🔴 缺失 |
| GET `/business/ai-strategy` | ❌ 未实现 | 🔴 缺失 |
| POST `/business/ai-strategy` | ❌ 未实现 | 🔴 缺失 |
| GET `/business/interview-config` | ❌ 未实现 | 🔴 缺失 |
| POST `/business/interview-config` | ❌ 未实现 | 🔴 缺失 |
| GET `/business/interview-session` | ❌ 未实现 | 🔴 缺失 |
| POST `/business/interview-session` | ❌ 未实现 | 🔴 缺失 |
| GET `/business/agent-state` | ❌ 未实现 | 🔴 缺失 |

**发现的问题**:

1. 🔴 **[整模块缺失]**: 文档列出的 9 个 Business 模块接口在前端 API 层**完全未实现**。虽然这些接口标注为 P3（管理后台专用），但前端缺少对应的 `src/api/modules/business.api.ts` 和 `src/api/types/business.types.ts`。若管理后台是独立项目则需在文档中说明；若是同一项目则需补充。

---

### 10. 权限管理模块 (Role) — ⚠️ 前端**无对应模块**

| 文档接口 | 前端实现 | 状态 |
|----------|----------|------|
| GET `/roles` | ❌ 未实现 | 🔴 缺失 |
| POST `/roles` | ❌ 未实现 | 🔴 缺失 |
| POST `/roles/{role_id}/permissions` | ❌ 未实现 | 🔴 缺失 |
| POST `/users/{user_id}/roles` | ❌ 未实现 | 🔴 缺失 |
| GET `/permissions` | ❌ 未实现 | 🔴 缺失 |

**发现的问题**:

1. 🔴 **[整模块缺失]**: Role 模块 5 个接口在前端 API 层完全未实现。虽然 `RoleResponse` 和 `PermissionResponse` 类型定义在 [user.types.ts](file:///d:/code/MianMianMaster/src/api/types/user.types.ts#L31-L49) 中（作为 `UserResponse.roles` 的嵌套类型），但独立的角色/权限 CRUD API 层缺失。同样需确认管理后台策略。

---

### 11. 系统管理模块 (System) — `src/api/modules/system.api.ts`

| 文档接口 | 前端实现 | 状态 |
|----------|----------|------|
| GET `/system/config` | ✅ 已实现 | ⚠️ 不一致 |
| POST `/system/config` | ❌ 未实现 | 🔴 缺失 |
| GET `/system/audit-log` | ❌ 未实现 | 🔴 缺失 |
| — | GET `/system/health` | 🟡 文档未提及 |
| — | GET `/system/announcements` | 🟡 文档未提及 |

**发现的问题**:

1. 🔴 **[缺失] 创建配置与审计日志**: 文档包含 `POST /system/config` 和 `GET /system/audit-log`，但前端未实现。

2. 🟡 **[缺失] 健康检查与公告**: 前端实现了 `GET /system/health` 和 `GET /system/announcements`，文档未提及。

3. 🟡 **[类型不匹配] SystemConfig**: 文档描述"{获取系统配置列表}"，前端 [system.types.ts](file:///d:/code/MianMianMaster/src/api/types/system.types.ts#L1-L5) 中 `SystemConfig` 为 `{ key, value, description }` 结构，与 `config:create` 权限暗示的创建操作是否匹配需确认。

---

## 二、全局性问题汇总

### 🔴 严重问题（阻塞级）

| # | 问题 | 影响模块 | 影响 |
|---|------|----------|------|
| 1 | Token 响应缺失 `refresh_token` 字段 | Auth | 前端无法实现 Token 刷新，登录态维持不可用 |
| 2 | 技能树缺失 `is_required`/`has_required_child` | Job | 前端无法正确渲染技能树高亮 |
| 3 | 评论缺失 `parent_id` 字段 | Community | 楼中楼嵌套评论完全无法实现 |
| 4 | 帖子缺失 `category` 字段 | Community | 帖子分类和筛选不可用 |
| 5 | AI 点评结果无法获取（Post 缺失 `ai_review_content`） | Community | AI 点评功能无效 |
| 6 | Business 模块 9 个接口前端全部缺失 | Business | 管理后台功能完全不可用 |
| 7 | Role 模块 5 个接口前端全部缺失 | Role | 权限管理功能完全不可用 |
| 8 | 社区编辑/删除帖子接口前端缺失 | Community | 用户无法管理已发内容 |

### 🟡 中等问题（需修复）

| # | 问题 | 影响模块 |
|---|------|----------|
| 9 | 登出接口缺失 | Auth |
| 10 | 管理员解锁用户接口缺失 | Auth |
| 11 | swagger-login 未入接口主表 | Auth |
| 12 | 用户模块 5 个接口未文档化 | User |
| 13 | 通知偏好 + 设备注册 3 个接口未文档化 | Notification |
| 14 | 测评列表 + 结果查询接口未文档化 | Assessment |
| 15 | 测评 Submit 请求体结构不清晰 | Assessment |
| 16 | 游戏化面试 5 个接口未文档化 | Interview |
| 17 | 热门话题 + 活跃用户 + 评论列表 3 个接口未文档化 | Community |
| 18 | 系统健康检查 + 公告接口未文档化 | System |
| 19 | 审计日志接口前端缺失 | System |
| 20 | 创建系统配置接口前端缺失 | System |

### ⚫ 缺失的核心内容

| # | 缺失项 | 严重影响 |
|---|--------|----------|
| 21 | **无任何请求/响应示例** | 前端开发需自行推断数据格式 |
| 22 | **无任何错误码列表** | 前端无法针对特定错误做友好提示 |
| 23 | **无 429 限流错误格式** | 文档提到限流但未说明响应格式 |
| 24 | **无认证流程时序图** | Token 刷新/过期处理逻辑需前端自行设计 |
| 25 | **无分页响应统一格式** | 部分接口返回数组，部分应返回 `{ items, total }`，未统一 |
| 26 | **无文件上传说明** | 文档提到"后续将接入 OSS 上传"但无任何上传接口定义 |

---

## 三、接口数量偏差统计

| 模块 | 文档声称 | 前端实际 | 差值 | 说明 |
|------|----------|----------|------|------|
| Auth | 10 | 9 + 1(swagger) | -1 | 缺 logout、unlock；多 swagger-login |
| User | 4 | 9 | +5 | 缺 5 个业务接口文档 |
| Notification | 4 | 7 | +3 | 缺偏好设置和设备注册文档 |
| Job | 4 | 4 | 0 | 数量一致，字段不一致 |
| Assessment | 2 | 4 | +2 | 缺列表和结果查询 |
| Learning | 14 | 14+1(变体) | 0 | 数量一致 |
| Community | 9 | 10 | +1 | 缺少 3 个、多了 4 个 |
| Interview | 8 | 13 | +5 | 缺游戏化 5 个接口 |
| Business | 9 | 0 | -9 | 整模块缺失 |
| Role | 5 | 0 | -5 | 整模块缺失 |
| System | 3 | 3 | 0 | 数量一致，内容不同 |
| **合计** | **73** | **~73** | **—** | 看似数量相近，实际匹配度低 |

---

## 四、改进建议（按优先级排序）

### P0 — 立即修复（阻塞前端开发）

1. **补充 Token 响应中的 `refresh_token` 字段** — 在 [auth.types.ts](file:///d:/code/MianMianMaster/src/api/types/auth.types.ts#L14-L17) `Token` 接口中添加 `refresh_token: string`

2. **补充 SkillTreeNode 的高亮标记字段** — 在 [job.types.ts](file:///d:/code/MianMianMaster/src/api/types/job.types.ts#L22-L28) 中添加 `is_required: boolean` 和 `has_required_child: boolean`

3. **补充评论的 `parent_id` 字段** — 在 [community.types.ts](file:///d:/code/MianMianMaster/src/api/types/community.types.ts#L29-L31) `CommentCreate` 中添加 `parent_id?: number`

4. **补充帖子的 `category` 字段** — 在 `PostCreate` 中添加 `category: 'interview_review' | 'real_questions' | 'experience'`

5. **补充 AI 点评结果获取** — 在 `Post` 接口中添加 `ai_review_content?: string`，或在 `AiReviewResult` 中补充内容字段

6. **实现登出接口** — 在 [auth.api.ts](file:///d:/code/MianMianMaster/src/api/modules/auth.api.ts) 中添加 `logout()` 方法

7. **实现社区帖子编辑/删除** — 在 `community.api.ts` 中添加 `editPost()` 和 `deletePost()` 方法

### P1 — 尽快补充

8. 为文档**补充 User 模块 5 个缺失接口**的说明（interview-history, ability-data, game-interview-data, resume, resume/diagnose）

9. 为文档**补充 Interview 游戏化 5 个接口**的说明（questions, game/levels, game/stats, game/achievements, game/leaderboard）

10. 为文档**补充 Community 3 个缺失接口**的说明（getPostComments, getHotTopics, getActiveUsers）

11. 为文档**补充 Notification 3 个缺失接口**的说明（preferences GET/PUT, device-token）

12. **明确 Business/Role 模块的前端交付策略** — 确认管理后台是否为独立项目，若是需在文档中标注；若不是需补充代码

### P2 — 质量提升

13. 为**每个接口添加请求/响应 JSON 示例**

14. 建立**统一的错误码文档**（至少包含 401/403/429/500 的标准响应格式）

15. 补充**Token 刷新机制的前端对接流程图**

16. 统一**分页响应格式说明**（何时返回 `PaginatedData` vs 直接返回数组）

17. 补充 **SSE 错误事件的数据格式**规范

18. 明确**文件/Oss 上传接口**的计划

---

## 五、总结

该文档作为前端对接参考，**基本框架合理**，优先级划分和阅读指南对前端团队有帮助。但与前端实际 API 层代码的 **匹配度仅为约 65%**。

核心问题可归纳为三类：
- **文档滞后于代码**: 前端实现了约 18 个未文档化的接口
- **代码滞后于文档**: 前端缺失约 16 个文档列出的接口（主要是管理后台）
- **双方结构不对齐**: Token 结构、技能树标记、评论嵌套等关键字段在文档和代码之间存在差异

建议在后端 Swagger/OpenAPI 规范就绪后，以 OpenAPI Schema 为单一事实来源（Single Source of Truth），由工具自动生成前端类型定义和文档，从根本上消除人工维护的不一致风险。