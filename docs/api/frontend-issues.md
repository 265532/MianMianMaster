# 前端问题清单 — API 接口对接缺陷

> **生成日期**: 2026-05-31  
> **来源**: 基于 `docs/api/api-review-report.md` 审查报告，提取所有前端代码侧需修复的问题  
> **前提**: 以 `docs/api/frontend-api-integration-guide.md`（后端接口文档）为准，以下问题均为前端代码与文档描述不一致之处

---

## 概述

| 统计项 | 数量 |
|--------|------|
| 🔴 严重问题（阻塞） | 8 |
| 🟡 中等问题 | 8 |
| **合计** | **16** |

---

## 🔴 严重问题（阻塞功能交付）

### F-001 | Token 接口缺失 `refresh_token` 字段

- **文件**: [src/api/types/auth.types.ts](file:///d:/code/MianMianMaster/src/api/types/auth.types.ts#L14-L17)
- **问题**: 文档明确描述双 Token 机制（`access_token` + `refresh_token`），但 `Token` 接口仅含 `access_token` 和 `token_type`，缺失 `refresh_token`。
- **影响**: 前端无法在登录/刷新响应中获取 `refresh_token`，Token 刷新流程不可用，登录态无法维持。
- **修复方案**: 在 `Token` 接口中添加 `refresh_token: string`。

```typescript
// 当前
export interface Token {
  access_token: string;
  token_type: string;
}

// 应改为
export interface Token {
  access_token: string;
  token_type: string;
  refresh_token: string;
}
```

---

### F-002 | 登出接口未实现

- **文件**: [src/api/modules/auth.api.ts](file:///d:/code/MianMianMaster/src/api/modules/auth.api.ts)
- **问题**: 文档列出 `POST /auth/logout`，但 `authApi` 中无 `logout()` 方法。
- **影响**: 用户无法主动登出并吊销 Token。
- **修复方案**: 在 `authApi` 中添加：

```typescript
logout(): Promise<ResponseModel<string>> {
  return post<ResponseModel<string>>(`${BASE_URL}/logout`);
}
```

---

### F-003 | 管理员解锁用户接口未实现

- **文件**: [src/api/modules/auth.api.ts](file:///d:/code/MianMianMaster/src/api/modules/auth.api.ts)
- **问题**: 文档列出 `POST /auth/unlock/{username}`（管理员功能），前端未实现。
- **影响**: 管理后台无法解锁被锁定的用户。
- **修复方案**: 在 `authApi` 中添加：

```typescript
unlockUser(username: string): Promise<ResponseModel<string>> {
  return post<ResponseModel<string>>(`${BASE_URL}/unlock/${username}`);
}
```

---

### F-004 | SkillTreeNode 缺失高亮标记字段

- **文件**: [src/api/types/job.types.ts](file:///d:/code/MianMianMaster/src/api/types/job.types.ts#L22-L28)
- **问题**: 文档明确说明技能树返回 `is_required` 和 `has_required_child` 标记用于前端高亮渲染。但 `SkillTreeNode` 中缺失这两个字段。
- **影响**: 前端无法区分"必须掌握的技能"和"可选技能"，技能树渲染不正确。
- **修复方案**: 补充字段：

```typescript
// 当前
export interface SkillTreeNode {
  id: number;
  name: string;
  category?: string;
  level?: number;
  children?: SkillTreeNode[];
}

// 应改为
export interface SkillTreeNode {
  id: number;
  name: string;
  category?: string;
  level?: number;
  is_required: boolean;
  has_required_child: boolean;
  children?: SkillTreeNode[];
}
```

---

### F-005 | 社区帖子编辑接口未实现

- **文件**: [src/api/modules/community.api.ts](file:///d:/code/MianMianMaster/src/api/modules/community.api.ts)
- **问题**: 文档列出 `PUT /community/posts/{post_id}`，前端未实现。
- **影响**: 用户无法编辑已发布的帖子。
- **修复方案**: 在 `communityApi` 中添加：

```typescript
editPost(postId: number, data: PostCreate): Promise<ResponseModel<Post>> {
  return put<ResponseModel<Post>>(`${BASE_URL}/posts/${postId}`, data);
}
```

---

### F-006 | 社区帖子删除接口未实现

- **文件**: [src/api/modules/community.api.ts](file:///d:/code/MianMianMaster/src/api/modules/community.api.ts)
- **问题**: 文档列出 `DELETE /community/posts/{post_id}`，前端未实现。
- **影响**: 用户无法删除已发布的帖子。
- **修复方案**: 在 `communityApi` 中添加：

```typescript
deletePost(postId: number): Promise<ResponseModel<string>> {
  return del<ResponseModel<string>>(`${BASE_URL}/posts/${postId}`);
}
```

> 注意：需确认 `src/utils/request.ts` 已导出 `del` 方法，若未导出则需补充。

---

### F-007 | PostCreate 缺失 `category` 字段

- **文件**: [src/api/types/community.types.ts](file:///d:/code/MianMianMaster/src/api/types/community.types.ts#L15-L18)
- **问题**: 文档明确帖子分为 `interview_review`（面试复盘）、`real_questions`（真题分享）、`experience`（经验分享）。但 `PostCreate` 仅含 `title` 和 `content`，缺失 `category` 字段。`Post` 接口同样缺失此字段。
- **影响**: 前端无法在创建帖子时指定分类，社区页无法按分类筛选帖子。
- **修复方案**: 在 `PostCreate` 和 `Post` 中补充 `category` 字段：

```typescript
export interface PostCreate {
  title: string;
  content: string;
  category: 'interview_review' | 'real_questions' | 'experience';
}

export interface Post {
  // ... 现有字段
  category: 'interview_review' | 'real_questions' | 'experience';
}
```

---

### F-008 | CommentCreate 缺失 `parent_id` 字段

- **文件**: [src/api/types/community.types.ts](file:///d:/code/MianMianMaster/src/api/types/community.types.ts#L29-L31)
- **问题**: 文档明确说明评论通过 `parent_id` 实现楼中楼嵌套回复。但 `CommentCreate` 仅含 `content`，缺失 `parent_id` 字段。`Comment` 接口同样缺失此字段。
- **影响**: 楼中楼嵌套评论功能完全无法实现。
- **修复方案**:

```typescript
export interface CommentCreate {
  content: string;
  parent_id?: number;
}

export interface Comment {
  // ... 现有字段
  parent_id?: number;
  replies?: Comment[];
}
```

---

## 🟡 中等问题（功能不完整）

### F-009 | AiReviewResult 无法获取点评内容

- **文件**: [src/api/types/community.types.ts](file:///d:/code/MianMianMaster/src/api/types/community.types.ts#L42-L45)
- **问题**: 文档说 AI 点评结果写入 `ai_review_content` 字段。当前 `AiReviewResult` 仅含 `task_id` 和 `status`，`Post` 接口也缺失 `ai_review_content`。
- **影响**: 触发 AI 点评后，前端无法获取点评内容展示给用户。
- **修复方案**:

```typescript
export interface AiReviewResult {
  task_id: string;
  status: string;
  ai_review_content?: string;
}

// Post 接口补充
export interface Post {
  // ... 现有字段
  ai_review_content?: string;
}
```

---

### F-010 | 测评题目模型缺失

- **文件**: [src/api/types/assessment.types.ts](file:///d:/code/MianMianMaster/src/api/types/assessment.types.ts)
- **问题**: 文档提到三种题目类型（`single_choice` / `multiple_choice` / `text`），但前端 `src/api/types/` 中无独立的 `Question` 类型定义。
- **影响**: 测评页面无法正确渲染不同类型的题目 UI。
- **修复方案**: 在 `assessment.types.ts` 中补充题目模型：

```typescript
export interface AssessmentQuestion {
  id: number;
  type: 'single_choice' | 'multiple_choice' | 'text';
  content: string;
  options?: string[];
  correct_answer?: string | string[];
  points: number;
}

export interface AssessmentCreate {
  type?: string;
  questions: AssessmentQuestion[];
}

export interface AssessmentSubmit {
  assessment_id: number;
  answers: Array<{
    question_id: number;
    answer: string | string[];
  }>;
}
```

---

### F-011 | 测评 Submit 请求体结构不清晰

- **文件**: [src/api/modules/assessment.api.ts](file:///d:/code/MianMianMaster/src/api/modules/assessment.api.ts#L20-L28)
- **问题**: `submitAssessment` 传参为 `{ id, ...data }`，其中 `AssessmentCreate` 仅含 `type?` 和 `answers?: Record<string, any>`，与文档描述的"题目类型 + 作答"细粒度结构不匹配。
- **影响**: 前端不知如何正确构造提交数据。
- **修复方案**: 参见 F-010 的 `AssessmentSubmit` 类型定义，重构 `submitAssessment`：

```typescript
submitAssessment(
  data: AssessmentSubmit,
): Promise<ResponseModel<AssessmentResult>> {
  return post<ResponseModel<AssessmentResult>>(`${BASE_URL}/submit`, data);
}
```

---

### F-012 | Business 模块 9 个接口全部缺失

- **文件**: 需新建 `src/api/modules/business.api.ts` + `src/api/types/business.types.ts`
- **问题**: 文档列出了 Business 模块的 9 个管理后台接口，前端 API 层完全未实现。
- **影响**: 管理后台功能（知识图谱、AI 策略、面试配置、Agent 状态等）完全不可用。
- **修复方案**: 新建 `business.api.ts` 和 `business.types.ts`，实现以下接口：

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/business/knowledge-graph` | 获取知识图谱列表 |
| POST | `/business/knowledge-graph` | 创建知识图谱节点 |
| GET | `/business/ai-strategy` | 获取 AI 策略列表 |
| POST | `/business/ai-strategy` | 创建 AI 策略 |
| GET | `/business/interview-config` | 获取面试配置列表 |
| POST | `/business/interview-config` | 创建面试配置 |
| GET | `/business/interview-session` | 获取面试会话列表 |
| POST | `/business/interview-session` | 创建面试会话 |
| GET | `/business/agent-state` | 获取 Agent 状态列表 |

> ⚠️ 若管理后台为独立项目，则此问题可关闭，但需在文档中明确标注。

---

### F-013 | Role 模块 5 个接口全部缺失

- **文件**: 需新建 `src/api/modules/role.api.ts` + `src/api/types/role.types.ts`
- **问题**: 文档列出了 Role 模块的 5 个权限管理接口，前端 API 层完全未实现。
- **影响**: 角色管理与权限分配功能完全不可用。
- **修复方案**: 新建 `role.api.ts` 和 `role.types.ts`，实现以下接口：

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/roles` | 获取角色列表 |
| POST | `/roles` | 创建角色 |
| POST | `/roles/{role_id}/permissions` | 为角色分配权限 |
| POST | `/users/{user_id}/roles` | 为用户分配角色 |
| GET | `/permissions` | 获取权限列表 |

> 注意：`RoleResponse` 和 `PermissionResponse` 类型已存在于 [user.types.ts](file:///d:/code/MianMianMaster/src/api/types/user.types.ts#L31-L49)，新模块可直接复用。

---

### F-014 | System 模块 POST config 和审计日志缺失

- **文件**: [src/api/modules/system.api.ts](file:///d:/code/MianMianMaster/src/api/modules/system.api.ts)
- **问题**: 文档列出 `POST /system/config` 和 `GET /system/audit-log`，前端未实现。
- **影响**: 管理后台无法创建系统配置和查看审计日志。
- **修复方案**: 在 `systemApi` 中添加：

```typescript
createConfig(data: SystemConfig): Promise<ResponseModel<SystemConfig>> {
  return post<ResponseModel<SystemConfig>>(`${BASE_URL}/config`, data);
}

getAuditLog(params?: PaginationParams): Promise<ResponseModel<AuditLog[]>> {
  return get<ResponseModel<AuditLog[]>>(`${BASE_URL}/audit-log`, params as Record<string, any>);
}
```

同时需在 `system.types.ts` 中补充 `AuditLog` 类型定义。

---

### F-015 | 社区评论列表接口调用方式需确认

- **文件**: [src/api/modules/community.api.ts](file:///d:/code/MianMianMaster/src/api/modules/community.api.ts#L61-L65)
- **问题**: 前端已有 `getPostComments()` 方法（`GET /community/posts/{id}/comments`），但文档未列出此接口。需确认后端是否已实现该端点。
- **影响**: 若后端未实现，社区帖子详情页将无法加载评论列表。
- **修复方案**: 与后端确认此接口是否存在，若不存在则需后端补充。

---

### F-016 | 前端实现的接口须确认后端兼容性

以下前端已实现但文档未列出的接口，**需要逐项与后端确认是否已部署**：

| 模块 | 接口 | 前端文件 |
|------|------|----------|
| User | `GET /user/interview-history` | [user.api.ts](file:///d:/code/MianMianMaster/src/api/modules/user.api.ts#L44) |
| User | `GET /user/ability-data` | [user.api.ts](file:///d:/code/MianMianMaster/src/api/modules/user.api.ts#L50) |
| User | `GET /user/game-interview-data` | [user.api.ts](file:///d:/code/MianMianMaster/src/api/modules/user.api.ts#L56) |
| User | `GET /user/resume` | [user.api.ts](file:///d:/code/MianMianMaster/src/api/modules/user.api.ts#L62) |
| User | `POST /user/resume/diagnose` | [user.api.ts](file:///d:/code/MianMianMaster/src/api/modules/user.api.ts#L66) |
| Notification | `GET /notifications/preferences` | [notification.api.ts](file:///d:/code/MianMianMaster/src/api/modules/notification.api.ts#L33) |
| Notification | `PUT /notifications/preferences` | [notification.api.ts](file:///d:/code/MianMianMaster/src/api/modules/notification.api.ts#L39) |
| Notification | `POST /notifications/device-token` | [notification.api.ts](file:///d:/code/MianMianMaster/src/api/modules/notification.api.ts#L48) |
| Assessment | `GET /assessments` | [assessment.api.ts](file:///d:/code/MianMianMaster/src/api/modules/assessment.api.ts#L12) |
| Assessment | `GET /assessments/{id}/result` | [assessment.api.ts](file:///d:/code/MianMianMaster/src/api/modules/assessment.api.ts#L30) |
| Community | `GET /community/hot-topics` | [community.api.ts](file:///d:/code/MianMianMaster/src/api/modules/community.api.ts#L67) |
| Community | `GET /community/active-users` | [community.api.ts](file:///d:/code/MianMianMaster/src/api/modules/community.api.ts#L70) |
| Interview | `GET /interview/questions` | [interview.api.ts](file:///d:/code/MianMianMaster/src/api/modules/interview.api.ts#L178) |
| Interview | `GET /interview/game/levels` | [interview.api.ts](file:///d:/code/MianMianMaster/src/api/modules/interview.api.ts#L190) |
| Interview | `GET /interview/game/stats` | [interview.api.ts](file:///d:/code/MianMianMaster/src/api/modules/interview.api.ts#L194) |
| Interview | `GET /interview/game/achievements` | [interview.api.ts](file:///d:/code/MianMianMaster/src/api/modules/interview.api.ts#L198) |
| Interview | `GET /interview/game/leaderboard` | [interview.api.ts](file:///d:/code/MianMianMaster/src/api/modules/interview.api.ts#L202) |
| System | `GET /system/health` | [system.api.ts](file:///d:/code/MianMianMaster/src/api/modules/system.api.ts#L16) |
| System | `GET /system/announcements` | [system.api.ts](file:///d:/code/MianMianMaster/src/api/modules/system.api.ts#L20) |

> 若后端未实现这些接口，前端需移除对应调用或降级为 Mock 数据。

---

## 修复优先级

```
P0（立即修复，阻塞主流程）:
  F-001 Token 补充 refresh_token
  F-004 技能树补充高亮标记
  F-007 帖子补充 category 字段
  F-008 评论补充 parent_id 字段

P1（本周内修复，影响功能完整性）:
  F-002 登出接口
  F-005 编辑帖子
  F-006 删除帖子
  F-009 AI 点评内容
  F-010 测评题目模型
  F-011 测评提交结构
  F-015 评论列表确认

P2（管理后台，按需修复）:
  F-003 管理员解锁用户
  F-012 Business 模块
  F-013 Role 模块
  F-014 系统配置/审计日志

P3（需后端确认）:
  F-016 前端已实现接口与后端对齐
```