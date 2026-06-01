# 后端/文档问题清单 — API 接口文档缺陷

> **生成日期**: 2026-05-31  
> **来源**: 基于 `docs/api/api-review-report.md` 审查报告，提取所有后端需确认或接口文档需补充的问题  
> **前提**: 不修改后端接口的前提下，以下问题均为文档层面可修复的缺陷

---

## 概述

| 统计项 | 数量 |
|--------|------|
| 🔴 文档缺失（接口未收录） | 19 |
| 🟡 文档不完整（参数/字段/流程遗漏） | 12 |
| ⚫ 全局内容缺失 | 6 |
| ❓ 需后端确认 | 5 |
| **合计** | **42** |

---

## 一、🔴 文档缺失 — 前端已实现但文档未收录的接口

以下接口前端 `src/api/modules/` 中已实现并调用，但 `frontend-api-integration-guide.md` 完全未收录。**需要后端团队确认这些接口是否真实存在，若存在则补充到文档中。**

### 1.1 User 模块（5 个）

| # | 编号 | 方法 | 路径 | 前端调用位置 | 使用场景 |
|---|------|------|------|-------------|----------|
| 1 | B-001 | GET | `/user/interview-history` | [user.api.ts:L44](file:///d:/code/MianMianMaster/src/api/modules/user.api.ts#L44) | 个人中心"面试历史"列表 |
| 2 | B-002 | GET | `/user/ability-data` | [user.api.ts:L50](file:///d:/code/MianMianMaster/src/api/modules/user.api.ts#L50) | 个人中心"能力雷达图"数据 |
| 3 | B-003 | GET | `/user/game-interview-data` | [user.api.ts:L56](file:///d:/code/MianMianMaster/src/api/modules/user.api.ts#L56) | 首页"游戏化面试数据" |
| 4 | B-004 | GET | `/user/resume` | [user.api.ts:L62](file:///d:/code/MianMianMaster/src/api/modules/user.api.ts#L62) | 简历管理页面 |
| 5 | B-005 | POST | `/user/resume/diagnose` | [user.api.ts:L66](file:///d:/code/MianMianMaster/src/api/modules/user.api.ts#L66) | 简历诊断功能 |

### 1.2 Notification 模块（3 个）

| # | 编号 | 方法 | 路径 | 前端调用位置 | 使用场景 |
|---|------|------|------|-------------|----------|
| 6 | B-006 | GET | `/notifications/preferences` | [notification.api.ts:L33](file:///d:/code/MianMianMaster/src/api/modules/notification.api.ts#L33) | 通知偏好设置页面 |
| 7 | B-007 | PUT | `/notifications/preferences` | [notification.api.ts:L39](file:///d:/code/MianMianMaster/src/api/modules/notification.api.ts#L39) | 更新通知偏好 |
| 8 | B-008 | POST | `/notifications/device-token` | [notification.api.ts:L48](file:///d:/code/MianMianMaster/src/api/modules/notification.api.ts#L48) | 推送设备注册 |

> ⚠️ B-008 的存在暗示后端可能已支持或规划支持推送通知，与文档"当前无 WebSocket 推送"的描述矛盾。需确认推送方案。

### 1.3 Assessment 模块（2 个）

| # | 编号 | 方法 | 路径 | 前端调用位置 | 使用场景 |
|---|------|------|------|-------------|----------|
| 9 | B-009 | GET | `/assessments` | [assessment.api.ts:L12](file:///d:/code/MianMianMaster/src/api/modules/assessment.api.ts#L12) | 测评列表页 |
| 10 | B-010 | GET | `/assessments/{id}/result` | [assessment.api.ts:L30](file:///d:/code/MianMianMaster/src/api/modules/assessment.api.ts#L30) | 查看测评结果详情 |

### 1.4 Community 模块（3 个）

| # | 编号 | 方法 | 路径 | 前端调用位置 | 使用场景 |
|---|------|------|------|-------------|----------|
| 11 | B-011 | GET | `/community/posts/{id}/comments` | [community.api.ts:L61](file:///d:/code/MianMianMaster/src/api/modules/community.api.ts#L61) | 帖子详情页评论列表 |
| 12 | B-012 | GET | `/community/hot-topics` | [community.api.ts:L67](file:///d:/code/MianMianMaster/src/api/modules/community.api.ts#L67) | 社区首页"热门话题" |
| 13 | B-013 | GET | `/community/active-users` | [community.api.ts:L70](file:///d:/code/MianMianMaster/src/api/modules/community.api.ts#L70) | 社区首页"活跃用户" |

### 1.5 Interview 模块（5 个游戏化接口）

| # | 编号 | 方法 | 路径 | 前端调用位置 | 使用场景 |
|---|------|------|------|-------------|----------|
| 14 | B-014 | GET | `/interview/questions` | [interview.api.ts:L178](file:///d:/code/MianMianMaster/src/api/modules/interview.api.ts#L178) | 面试题库页面 |
| 15 | B-015 | GET | `/interview/game/levels` | [interview.api.ts:L190](file:///d:/code/MianMianMaster/src/api/modules/interview.api.ts#L190) | 游戏化闯关页面 |
| 16 | B-016 | GET | `/interview/game/stats` | [interview.api.ts:L194](file:///d:/code/MianMianMaster/src/api/modules/interview.api.ts#L194) | 游戏化统计数据 |
| 17 | B-017 | GET | `/interview/game/achievements` | [interview.api.ts:L198](file:///d:/code/MianMianMaster/src/api/modules/interview.api.ts#L198) | 游戏化成就列表 |
| 18 | B-018 | GET | `/interview/game/leaderboard` | [interview.api.ts:L202](file:///d:/code/MianMianMaster/src/api/modules/interview.api.ts#L202) | 排行榜页面 |

### 1.6 System 模块（2 个）

| # | 编号 | 方法 | 路径 | 前端调用位置 | 使用场景 |
|---|------|------|------|-------------|----------|
| 19 | B-019 | GET | `/system/health` | [system.api.ts:L16](file:///d:/code/MianMianMaster/src/api/modules/system.api.ts#L16) | 系统健康检查 |
| 20 | B-020 | GET | `/system/announcements` | [system.api.ts:L20](file:///d:/code/MianMianMaster/src/api/modules/system.api.ts#L20) | 系统公告展示 |

---

## 二、🟡 文档不完整 — 已收录接口的参数/字段/流程遗漏

### 2.1 Auth 模块

**B-021 | `swagger-login` 未入接口主表**

- 文档仅在"前端对接要点"中提及 `/auth/swagger-login`，未列入接口清单表格。
- **建议**: 在接口主表中补充一行，标注"仅 Swagger UI 调试用"。

**B-022 | `RegisterRequest` 参数未完整列出**

- 文档注册接口仅描述"用户名+密码"，但前端 `RegisterRequest` 包含 `email`、`phone`、`role_ids` 字段。
- **建议**: 在文档中明确列出注册接口的完整请求参数及是否必填。

**B-023 | `PasswordResetTokenRequest` 字段语义模糊**

- 前端使用 `email` 字段发起密码重置请求，但文档上下文在"短信验证码"部分，存在手机号与邮箱使用场景混淆。
- **建议**: 明确密码重置流程是通过邮箱还是手机号，并统一文档描述。

### 2.2 Job 模块

**B-024 | `POST /jobs` 认证标注矛盾**

- 文档标注"认证: 否"，但用途描述为"管理后台"。
- **建议**: 管理后台创建岗位通常需要管理员认证，请确认并修正文档中的认证标注。

**B-025 | 岗位搜索筛选参数未列出**

- 文档仅提及分页参数，但 `GET /jobs` 可能支持关键词、地区、薪资范围等筛选。
- **建议**: 补充完整的查询参数列表。

**B-026 | `JobPosition` 响应字段未完整列出**

- 文档未提及 `JobPosition` 包含 `company`、`location`、`salary_range`、`requirements` 等字段（前端 [job.types.ts](file:///d:/code/MianMianMaster/src/api/types/job.types.ts#L1-L11) 中已定义）。
- **建议**: 补充完整的响应字段说明。

### 2.3 Notification 模块

**B-027 | 通知类型未列出**

- 前端 `Notification` 类型定义了四种通知类型：`system`、`interview`、`community`、`learning`。
- **建议**: 在文档中列出通知类型枚举及含义。

**B-028 | 通知 `link` 字段未提及**

- 前端 `Notification` 包含 `link?: string` 字段用于点击跳转。
- **建议**: 补充说明 `link` 字段的格式和用途。

**B-029 | 推送方案描述矛盾**

- 文档说"当前无 WebSocket 推送，建议前端轮询"，但前端已实现 `device-token` 注册（暗示可能有推送）。
- **建议**: 确认推送方案并更新文档描述。

### 2.4 Assessment 模块

**B-030 | 测评异步判卷状态机制未说明**

- 文档提到 LLM 异步判卷，`submit` 为 async 接口，但未说明前端如何感知判卷完成。
- **建议**: 补充说明判卷状态流转（如 `pending → judging → completed`）及前端推荐的轮询/回调方式。

**B-031 | 题目模型未在文档中定义**

- 文档提到三种题目类型（`single_choice` / `multiple_choice` / `text`），但未给出完整的题目数据结构。
- **建议**: 补充 `Question` 对象的字段定义，包括 `id`、`type`、`content`、`options`、`points` 等。

### 2.5 Learning 模块

**B-032 | 收藏接口参数语义需澄清**

- 文档描述"收藏题目"，暗示只需 `question_id`。但前端 `AddToCollectionRequest` 包含 `title`、`description`、`question_ids`、`category`、`difficulty`。
- **建议**: 确认"收藏"的语义是"收藏单个题目"还是"创建收藏题集"，并统一文档和代码。

**B-033 | 徽章触发机制未标注自动化**

- 文档提到"测评得分 > 80 分也会自动触发 `score_reached` 徽章"，但未明确标注这是后端自动行为，前端无需干预。
- **建议**: 对自动触发的徽章标注"后端自动颁发"，避免前端开发困惑。

**B-034 | 进度更新请求体格式未说明**

- 文档仅说"用户看完资料/视频后调用 `/progress/update`"，未说明请求体格式。
- **建议**: 补充 `course_id` + `progress`（百分比）字段说明。

### 2.6 Interview 模块

**B-035 | SSE 请求参数未说明**

- 文档描述 `/chat` 为 SSE 流式接口，但未说明请求体的 `message` 字段格式。
- **建议**: 补充请求体示例：`{ "message": "用户回答内容" }`。

**B-036 | SSE `error` 事件数据格式未说明**

- 文档列出 SSE 事件类型（token/done/error/round_limit），但未说明 `error` 事件中 `data` 字段的格式。
- **建议**: 补充错误事件数据结构，如 `{ "code": 40001, "message": "rate limit exceeded" }`。

**B-037 | `INTERVIEW_TIMEOUT_MINUTES` 默认值未给出**

- 文档提到"会话超过 `INTERVIEW_TIMEOUT_MINUTES`（默认配置）后自动结束"，但未给出具体默认值。
- **建议**: 补充超时默认值（如 30 分钟），前端需此值做倒计时/超时提示。

### 2.7 System 模块

**B-038 | `SystemConfig` 类型与创建接口不匹配**

- 文档 `GET /system/config` 描述为"获取系统配置列表"，`POST /system/config` 需要 `config:create` 权限。但前端 `SystemConfig` 为 `{ key, value, description }` 键值对结构，不清楚创建接口的请求体格式。
- **建议**: 补充 `POST /system/config` 的请求体定义。

---

## 三、⚫ 全局内容缺失 — 影响所有模块的文档缺陷

| # | 编号 | 缺失内容 | 影响 |
|---|------|----------|------|
| 1 | B-039 | **无请求/响应 JSON 示例** | 前端开发需自行推断数据格式，联调效率低 |
| 2 | B-040 | **无错误码列表** | 前端无法针对特定错误码（如密码错误、账号锁定、Token 过期）做友好提示 |
| 3 | B-041 | **无 429 限流错误响应格式** | 文档提到限流但未说明超限时返回的 JSON 结构 |
| 4 | B-042 | **无认证流程时序图** | Token 刷新/过期处理逻辑需前端自行设计，可能出现理解偏差 |
| 5 | B-043 | **无分页响应统一格式** | 部分接口返回数组，部分应返回 `{ items, total, page, page_size }`，未统一说明 |
| 6 | B-044 | **无文件上传接口定义** | 文档提到"后续将接入 OSS 上传"但无任何上传接口说明 |

### 建议补充的错误码示例

```markdown
| 错误码 | HTTP 状态 | 含义 | 前端处理建议 |
|--------|-----------|------|-------------|
| 401 | 200 | 未认证/Token 无效 | 清除 Token，跳转登录页 |
| 403 | 200 | 权限不足 | 提示"无操作权限" |
| 404 | 200 | 资源不存在 | 提示"资源不存在" |
| 429 | 429 | 请求过于频繁 | 显示倒计时，禁用按钮 |
| 40001 | 200 | 用户名或密码错误 | 表单提示错误 |
| 40002 | 200 | 账号已锁定 | 显示剩余锁定时间 |
| 40003 | 200 | Token 已过期 | 自动调用 refresh 接口 |
| 500 | 200 | 服务器内部错误 | 提示"系统繁忙，请稍后重试" |
```

### 建议补充的分页格式说明

```markdown
**分页列表接口返回格式**:
{
  "code": 200,
  "message": "success",
  "data": {
    "items": [...],
    "total": 100,
    "page": 1,
    "page_size": 20
  }
}

**非分页列表接口返回格式**:
{
  "code": 200,
  "message": "success",
  "data": [...]
}
```

---

## 四、❓ 需后端确认的问题

以下问题无法仅从文档和前端代码判断，需要后端团队明确答复。

| # | 编号 | 问题 | 上下文 |
|---|------|------|--------|
| 1 | B-045 | Business 模块 9 个接口是否由独立管理后台项目实现？ | 前端 `src/api/` 中完全缺失该模块，需确认交付策略 |
| 2 | B-046 | Role 模块 5 个接口是否由独立管理后台项目实现？ | 同上，但 `RoleResponse` 类型已存在于 `user.types.ts` |
| 3 | B-047 | 前端已实现的 19 个未文档化接口（B-001 ~ B-020）是否真实可用？ | 若后端未实现，前端需移除调用或降级为 Mock |
| 4 | B-048 | Token 响应中是否确实包含 `refresh_token`？ | 文档说双 Token，但前端 `Token` 接口未定义此字段 |
| 5 | B-049 | 通知推送方案是什么？ | 文档说轮询，前端有 `device-token` 注册，矛盾 |

---

## 五、处理优先级

```
P0（本周内完成，直接影响联调效率）:
  B-045 确认 Business/Role 模块交付策略
  B-047 确认 19 个未文档化接口的可用性
  B-039 为每个接口添加请求/响应示例
  B-040 建立错误码文档
  B-041 补充 429 限流响应格式

P1（下个迭代完成，提升文档质量）:
  B-001 ~ B-020 将 19 个接口补充到文档中
  B-022 ~ B-038 补充各接口缺失的参数/字段/流程说明
  B-043 统一分页响应格式说明
  B-042 补充认证流程时序图

P2（持续完善）:
  B-044 补充文件上传接口定义
  B-048 确认 Token 响应结构
  B-049 确认推送方案
```

---

## 附录：建议的文档更新模板

建议为每个接口补充以下标准信息块：

```markdown
### POST /api/v1/auth/login — 账号密码登录

**请求体**:
```json
{
  "username": "string",
  "password": "string"
}
```

**成功响应** (200):
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "access_token": "eyJhbGciOi...",
    "refresh_token": "eyJhbGciOi...",
    "token_type": "bearer"
  }
}
```

**错误响应**:
| code | 含义 |
|------|------|
| 40001 | 用户名或密码错误 |
| 40002 | 账号已锁定，剩余 X 分钟 |
| 429 | 登录频率超限（5次/分钟） |

**限流**: 5 次/分钟/账号
**认证**: 否
```