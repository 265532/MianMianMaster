# Mock 数据填充后端数据库 — 需求分析文档

> **文档版本**: v1.0  
> **创建日期**: 2026-06-01  
> **作者**: AI 辅助分析  
> **最终目标**: 审查现有项目中所有的 Mock 数据，将全部数据按模块、按接口整理成一份 Mock 数据清单，用于填充后端数据库。

---

## 1. 项目背景

### 1.1 当前状况

MianMianMaster 前端项目当前使用 **两层 Mock 架构** 来支撑离线开发：

| 层级 | 技术方案 | 位置 | 用途 |
|------|----------|------|------|
| axios 请求拦截 | `axios-mock-adapter` | `src/mock/handlers/` | 拦截标准 REST API 请求 |
| HTTP 中间件拦截 | Vite 插件 | `src/mock/plugins/` | 拦截 SSE 流式请求（`fetch()` 请求） |

Mock 数据通过环境变量 `VITE_USE_MOCK=true` 启用，`VITE_USE_MOCK=false` 时所有请求透传至真实后端。

### 1.2 目标

将 Mock 数据从纯前端开发支架转变为后端数据库的**种子数据**，使后端服务启动后即可拥有完整、可用的业务数据，支撑前端联调和演示。

### 1.3 范围

- **分析范围**: `src/mock/data/` 下全部 Mock 数据文件，以及 `src/mock/handlers/` 和 `src/mock/plugins/` 中定义的接口映射关系
- **参考文档**: `docs/api/frontend-api-integration-guide.md`（后端 API 接口清单）
- **不涉及**: 后端数据库 Schema 设计、后端 API 实现细节（仅关注数据内容和接口映射）

---

## 2. Mock 数据架构总览

### 2.1 文件结构

```
src/mock/
├── adapter.ts                   # Mock 适配器入口，注册所有 handler
├── data/                        # Mock 数据定义层
│   ├── index.ts                 # 统一导出
│   ├── auth.mock.ts             # 认证模块数据
│   ├── user.mock.ts             # 用户模块数据（含面试历史、能力数据、简历等）
│   ├── assessment.mock.ts       # 测评模块数据
│   ├── interview.mock.ts        # 面试模块数据（含游戏化关卡、排行榜等）
│   ├── learning.mock.ts         # 学习模块数据（课程、收藏、错题、徽章）
│   ├── job.mock.ts              # 岗位模块数据（岗位、技能树、匹配度）
│   ├── community.mock.ts        # 社区模块数据（帖子、评论、话题、活跃用户）
│   ├── notification.mock.ts     # 通知模块数据
│   └── system.mock.ts           # 系统模块数据（配置、健康、公告）
├── handlers/                    # Mock 处理器层（API 路由 → 数据映射）
│   ├── index.ts
│   ├── auth.handler.ts
│   ├── user.handler.ts
│   ├── assessment.handler.ts
│   ├── interview.handler.ts
│   ├── learning.handler.ts
│   ├── job.handler.ts
│   ├── community.handler.ts
│   ├── notification.handler.ts
│   └── system.handler.ts
└── plugins/
    └── mock-sse-plugin.ts       # SSE 流式响应 Mock（面试对话）
```

### 2.2 统一响应格式

所有 Mock 数据通过 `success<T>()` 辅助函数包装为统一响应格式：

```typescript
{
  code: 200,
  message: "success",
  data: T
}
```

分页接口额外包装为 `PaginatedData<T>` 格式：

```typescript
{
  code: 200,
  message: "success",
  data: {
    items: T[],
    total: number,
    page: number,
    page_size: number
  }
}
```

### 2.3 模块概览

| 模块 | 数据文件 | Handler | 后端优先级 | 接口数量 |
|------|----------|---------|-----------|---------|
| Auth（认证） | `auth.mock.ts` | `auth.handler.ts` | P0 | 8 |
| User（用户） | `user.mock.ts` | `user.handler.ts` | P0 | 8 |
| Job（岗位） | `job.mock.ts` | `job.handler.ts` | P0 | 4 |
| Assessment（测评） | `assessment.mock.ts` | `assessment.handler.ts` | P1 | 4 |
| Interview（面试） | `interview.mock.ts` | `interview.handler.ts` | P1 | 12（含 SSE） |
| Learning（学习） | `learning.mock.ts` | `learning.handler.ts` | P1 | 14 |
| Notification（通知） | `notification.mock.ts` | `notification.handler.ts` | P1 | 7 |
| Community（社区） | `community.mock.ts` | `community.handler.ts` | P2 | 11 |
| System（系统） | `system.mock.ts` | `system.handler.ts` | P3 | 3 |

---

## 3. 模块 Mock 数据详细清单

### 3.1 Auth 模块（认证）

**文件**: `src/mock/data/auth.mock.ts`  
**Handler**: `src/mock/handlers/auth.handler.ts`  
**后端前缀**: `/api/v1/auth`  
**优先级**: P0

#### 3.1.1 Mock 数据实体

| 数据变量 | 类型 | 对应后端接口 | 说明 |
|----------|------|-------------|------|
| `mockToken` | `Token` | `POST /auth/login` | access_token + token_type |
| `mockLoginResponse` | `{ token, user }` | `POST /auth/login` | 登录完整响应（含用户信息） |
| `mockRegisterUser` | `UserResponse` | `POST /auth/register` | 注册返回的用户对象 |

#### 3.1.2 接口-数据映射表

| # | 方法 | 路径 | Mock 返回数据 | 是否动态生成 | 数据来源 |
|---|------|------|--------------|-------------|---------|
| 1 | POST | `/auth/login` | `{ access_token, token_type }` | 是（token 含时间戳） | `mockToken` 结构 |
| 2 | POST | `/auth/swagger-login` | `{ access_token, token_type }` | 是（token 含时间戳） | `mockToken` 结构 |
| 3 | POST | `/auth/register` | `UserResponse` | 是（合并请求体） | `mockRegisterUser` |
| 4 | GET | `/auth/me` | `UserResponse` | 否 | `mockUser`（user.mock.ts） |
| 5 | POST | `/auth/sms/send` | `"SMS_CODE_SENT"` | 否 | 字符串常量 |
| 6 | POST | `/auth/sms/login` | `{ access_token, token_type }` | 是（token 含时间戳） | `mockToken` 结构 |
| 7 | POST | `/auth/password/reset-token` | `"RESET_TOKEN_GENERATED"` | 否 | 字符串常量 |
| 8 | POST | `/auth/password/reset` | `"PASSWORD_RESET_SUCCESS"` | 否 | 字符串常量 |

#### 3.1.3 关键数据字段

**Token 对象**:
```
access_token: string  // "mock_jwt_token_" + Date.now()
token_type: "bearer"
```

**注册用户（mockRegisterUser）**:
```
id: 2
username: "new_user"
email: "new@example.com"
is_active: true
created_at: ISO8601
updated_at: ISO8601
roles: []
profile: undefined
```

#### 3.1.4 后端对齐分析

| 后端接口 | Mock 已覆盖 | 差异/缺失 |
|----------|------------|----------|
| `POST /auth/register` | ✅ | — |
| `POST /auth/login` | ✅ | — |
| `POST /auth/sms/send` | ✅ | — |
| `POST /auth/sms/login` | ✅ | — |
| `GET /auth/me` | ✅ | — |
| `POST /auth/refresh` | ❌ 未覆盖 | 后端有，Mock 未实现 |
| `POST /auth/logout` | ❌ 未覆盖 | 后端有，Mock 未实现 |
| `POST /auth/password/reset-token` | ✅ | — |
| `POST /auth/password/reset` | ✅ | — |
| `POST /auth/unlock/{username}` | ❌ 未覆盖 | 后端有，Mock 未实现 |

---

### 3.2 User 模块（用户中心）

**文件**: `src/mock/data/user.mock.ts`  
**Handler**: `src/mock/handlers/user.handler.ts`  
**后端前缀**: `/api/v1/user`  
**优先级**: P0

#### 3.2.1 Mock 数据实体

| 数据变量 | 类型 | 说明 | 数据量 |
|----------|------|------|--------|
| `mockUser` | `UserResponse` | 当前登录用户完整信息 | 1 条 |
| `mockInterviewHistory` | `Array` | 面试历史记录 | 12 条 |
| `mockAbilityData` | `Record<string, object>` | 多岗位能力雷达数据 | 4 个岗位 |
| `mockGameInterviewData` | `object` | 游戏化面试数据（统计+关卡+成就+排行榜） | 1 套 |
| `mockResumeData` | `object` | 简历数据（基本信息+教育+经历+技能+项目） | 1 份 |
| `mockResumeDiagnosisResult` | `object` | 简历诊断结果 | 1 份 |

#### 3.2.2 接口-数据映射表

| # | 方法 | 路径 | Mock 返回数据 | 数据来源 |
|---|------|------|--------------|---------|
| 1 | GET | `/user/profile` | `UserResponse` | `mockUser` |
| 2 | PUT | `/user/profile` | `UserResponse`（合并请求体） | `mockUser` + 动态合并 |
| 3 | POST | `/user/security/change-password` | `"PASSWORD_CHANGED"` | 字符串常量 |
| 4 | POST | `/user/security/change-phone` | `"PHONE_CHANGED"` | 字符串常量 |
| 5 | GET | `/user/interview-history` | `PaginatedData<InterviewHistory>` | `mockInterviewHistory` |
| 6 | GET | `/user/ability-data` | `Record<string, AbilityData>` | `mockAbilityData` |
| 7 | GET | `/user/game-interview-data` | `GameInterviewData` | `mockGameInterviewData` |
| 8 | GET | `/user/resume` | `ResumeData` | `mockResumeData` |
| 9 | POST | `/user/resume/diagnose` | `ResumeDiagnosisResult` | `mockResumeDiagnosisResult` |

#### 3.2.3 关键数据字段

**mockUser（用户画像）**:
```
id: 1
username: "王同学"
email: "wang@example.com"
phone: "138****8000"
is_active: true
created_at: "2026-01-01T00:00:00Z"
updated_at: "2026-05-09T00:00:00Z"
roles: [{ id: 1, name: "user", description: "普通用户", permissions: [] }]
profile:
  id: 1
  user_id: 1
  avatar_url: ""
  education: "北京大学计算机科学与技术专业"
  target_position: "前端开发工程师"
  work_years: 2
  created_at: "2026-01-01T00:00:00Z"
  updated_at: "2026-05-09T00:00:00Z"
```

**mockInterviewHistory（面试历史 — 12 条）**:

| ID | 日期 | 公司 | 岗位 | 轮次 | 类型 | 评分 | 状态 |
|----|------|------|------|------|------|------|------|
| 1 | 2026-03-15 | 字节跳动 | 前端开发工程师 | 二面 | 技术面 | 88 | passed |
| 2 | 2026-02-28 | 阿里巴巴 | Java 开发工程师 | 一面 | 技术面 | 82 | passed |
| 3 | 2025-11-15 | 腾讯 | UI 设计师 | 三面 | 设计面 | 91 | passed |
| 4 | 2025-10-20 | 美团 | 产品经理 | 一面 | 产品面 | 78 | failed |
| 5 | 2025-09-10 | 百度 | 数据分析师 | 二面 | 技术面 | 85 | passed |
| 6 | 2025-08-05 | 京东 | 后端开发工程师 | 一面 | 技术面 | 80 | passed |
| 7 | 2025-06-20 | 拼多多 | 前端开发工程师 | 三面 | 技术面 | 92 | passed |
| 8 | 2025-05-15 | 小米 | 测试工程师 | 一面 | 技术面 | 76 | failed |
| 9 | 2025-04-10 | 网易 | 前端开发工程师 | 二面 | 技术面 | 86 | passed |
| 10 | 2025-03-05 | 新浪 | 后端开发工程师 | 一面 | 技术面 | 79 | passed |
| 11 | 2024-12-20 | 搜狐 | 前端开发工程师 | 一面 | 技术面 | 83 | passed |
| 12 | 2024-11-10 | 优酷 | 产品经理 | 二面 | 产品面 | 81 | failed |

每条面试历史包含 `details` 子维度评分（technical / communication / logic / problem_solving）。

**mockAbilityData（能力雷达 — 4 个岗位）**:

| 岗位 | current | required | indicators | gapSkills | strengths |
|------|---------|----------|------------|-----------|-----------|
| 前端开发工程师 | [85,78,92,70,88,75,82] | [90,85,80,90,85,95,90] | 7 项 | 4 项 | 3 项 |
| Java 开发工程师 | [70,85,75,65,80,60,75] | [90,85,80,90,85,85,85] | 7 项 | 4 项 | 3 项 |
| 产品经理 | [65,80,90,75,85,82,95] | [70,85,90,85,85,90,90] | 7 项 | 3 项 | 3 项 |
| UI 设计师 | [80,75,85,70,90,88,82] | [90,85,85,85,85,95,85] | 7 项 | 3 项 | 3 项 |

**mockGameInterviewData**:
- `stats`: 6 项统计指标（已完成关卡、总答题数、正确率、技能认证、连续打卡、总得分）
- `levels`: 6 个关卡（基础入门→前端进阶→后端基础→系统设计→高级算法→架构实战）
- `achievements`: 5 个成就（初次尝试、连续打卡、正确率达人、挑战大师、知识渊博）
- `leaderboard`: 5 条排行榜数据

**mockResumeData**:
- `basic_info`: 姓名、专业、年级、学校
- `education`: 1 条教育经历
- `experience`: 2 条实习经历（字节跳动、阿里巴巴）
- `skills`: 6 项技能（Vue3 expert / React advanced / TypeScript advanced / Java intermediate / Python intermediate / SQL intermediate）
- `projects`: 2 个项目经历

**mockResumeDiagnosisResult**:
- `overall_score`: 85
- `strengths`: 3 项优势
- `weaknesses`: 3 项短板
- `suggestions`: 5 条优化建议
- `match_rate`: 4 个岗位匹配度

#### 3.2.4 后端对齐分析

| 后端接口 | Mock 已覆盖 | 差异/缺失 |
|----------|------------|----------|
| `GET /user/profile` | ✅ | — |
| `PUT /user/profile` | ✅ | — |
| `POST /user/security/change-password` | ✅ | — |
| `POST /user/security/change-phone` | ✅ | — |
| 面试历史 | ❌ 后端无对应接口 | Mock 中存在，后端需新增 |
| 能力数据 | ❌ 后端无对应接口 | Mock 中存在，后端需新增 |
| 游戏化面试数据 | ❌ 后端无对应接口 | Mock 中存在，后端需新增 |
| 简历数据 | ❌ 后端无对应接口 | Mock 中存在，后端需新增 |
| 简历诊断 | ❌ 后端无对应接口 | Mock 中存在，后端需新增 |

> **⚠️ 重要发现**: User 模块有 5 个 Mock 接口在后端 API 清单中不存在对应接口。这些数据可能需要新建后端模块，或合并到已有模块中。

---

### 3.3 Job 模块（岗位与技能树）

**文件**: `src/mock/data/job.mock.ts`  
**Handler**: `src/mock/handlers/job.handler.ts`  
**后端前缀**: `/api/v1/jobs`  
**优先级**: P0

#### 3.3.1 Mock 数据实体

| 数据变量 | 类型 | 说明 | 数据量 |
|----------|------|------|--------|
| `mockJobPositions` | `JobPosition[]` | 岗位列表 | 5 条 |
| `mockSkillTree` | `SkillTreeNode` | 前端开发技能树（3 级嵌套） | 1 棵树 |
| `mockJobMatchResults` | `Record<number, JobMatchResult>` | 各岗位匹配度 | 5 条 |

#### 3.3.2 接口-数据映射表

| # | 方法 | 路径 | Mock 返回数据 | 数据来源 |
|---|------|------|--------------|---------|
| 1 | POST | `/jobs` | `JobPosition`（合并请求体） | 动态生成 |
| 2 | GET | `/jobs` | `JobPosition[]` | `mockJobPositions` |
| 3 | GET | `/jobs/{job_id}/skill-tree` | `SkillTreeNode` | `mockSkillTree` |
| 4 | GET | `/jobs/{job_id}/match` | `JobMatchResult` | `mockJobMatchResults[jobId]` |

#### 3.3.3 关键数据字段

**mockJobPositions（5 个岗位）**:

| ID | 岗位 | 公司 | 地点 | 薪资 | 技能要求 |
|----|------|------|------|------|----------|
| 1 | 前端开发工程师 | 字节跳动 | 北京 | 25k-45k | Vue3, TypeScript, CSS3 |
| 2 | Java开发工程师 | 阿里巴巴 | 杭州 | 30k-50k | Java, Spring Boot, MySQL |
| 3 | 产品经理 | 腾讯 | 深圳 | 25k-40k | 产品规划, 用户研究, 数据分析 |
| 4 | UI设计师 | 网易 | 广州 | 20k-35k | Figma, 交互设计, 视觉设计 |
| 5 | 数据分析师 | 美团 | 北京 | 25k-40k | Python, SQL, 数据可视化 |

**mockSkillTree（前端开发技能树 — 3 级嵌套）**:
```
前端开发 (L1)
├── HTML/CSS (L2)
│   ├── HTML5 (L3)
│   ├── CSS3 (L3)
│   └── 响应式设计 (L3)
├── JavaScript (L2)
│   ├── ES6+ (L3)
│   ├── TypeScript (L3)
│   └── 异步编程 (L3)
└── 框架 (L2)
    ├── Vue3 (L3)
    ├── React (L3)
    └── Angular (L3)
```

**mockJobMatchResults（5 条匹配度）**:

| 岗位ID | 匹配度 | 匹配技能 | 缺失技能 |
|--------|--------|----------|----------|
| 1 | 85 | Vue3, TypeScript, CSS3 | Webpack, 性能优化 |
| 2 | 65 | Java | Spring Boot, MySQL, 微服务 |
| 3 | 70 | 数据分析 | 产品规划, 用户研究 |
| 4 | 55 | — | Figma, 交互设计, 视觉设计 |
| 5 | 60 | Python, SQL | 数据可视化, 机器学习 |

#### 3.3.4 后端对齐分析

| 后端接口 | Mock 已覆盖 | 差异/缺失 |
|----------|------------|----------|
| `POST /jobs` | ✅ | — |
| `GET /jobs` | ✅ | — |
| `GET /jobs/{job_id}/skill-tree` | ✅ | 后端返回 `is_required`/`has_required_child` 标记，Mock 中缺失 |
| `GET /jobs/{job_id}/match` | ✅ | — |

---

### 3.4 Assessment 模块（测评）

**文件**: `src/mock/data/assessment.mock.ts`  
**Handler**: `src/mock/handlers/assessment.handler.ts`  
**后端前缀**: `/api/v1/assessments`  
**优先级**: P1

#### 3.4.1 Mock 数据实体

| 数据变量 | 类型 | 说明 | 数据量 |
|----------|------|------|--------|
| `mockAssessments` | `Assessment[]` | 测评试卷列表 | 3 条 |
| `mockAssessmentResults` | `AssessmentResult[]` | 测评结果列表 | 3 条 |

#### 3.4.2 接口-数据映射表

| # | 方法 | 路径 | Mock 返回数据 | 数据来源 |
|---|------|------|--------------|---------|
| 1 | POST | `/assessments` | `Assessment` | 动态生成（合并请求体） |
| 2 | POST | `/assessments/submit` | `AssessmentResult` | `mockAssessmentResults` 匹配或随机生成 |
| 3 | GET | `/assessments` | `Assessment[]` | `mockAssessments` |
| 4 | GET | `/assessments/{id}/result` | `AssessmentResult` | `mockAssessmentResults` 按 assessment_id 匹配 |

#### 3.4.3 关键数据字段

**mockAssessments（3 个测评）**:

| ID | 标题 | 类型 | 创建时间 |
|----|------|------|----------|
| 1 | 前端开发能力测评 | technical | 2026-05-09 |
| 2 | 逻辑思维测评 | logic | 2026-05-08 |
| 3 | 表达能力测评 | communication | 2026-05-07 |

**mockAssessmentResults（3 条结果）**:

| ID | 测评ID | 总分 | 子维度 | 创建时间 |
|----|--------|------|--------|----------|
| 1 | 1 | 85 | technical:90, communication:85, logic:92, problem_solving:88 | 2026-05-09 |
| 2 | 2 | 78 | logical_reasoning:82, analytical_thinking:75, pattern_recognition:80, critical_thinking:76 | 2026-05-08 |
| 3 | 3 | 92 | clarity:95, structure:90, persuasion:88, listening:94 | 2026-05-07 |

#### 3.4.4 后端对齐分析

| 后端接口 | Mock 已覆盖 | 差异/缺失 |
|----------|------------|----------|
| `POST /assessments` | ✅ | Mock 缺失题目内容（questions 字段），后端需要题目数据 |
| `POST /assessments/submit` | ✅ | — |
| `GET /assessments`（列表） | ✅ | 后端支持分页，Mock 直接返回数组 |
| `GET /assessments/{id}/result` | ✅ | 后端可能无此独立接口，结果由 submit 返回 |

---

### 3.5 Interview 模块（AI 面试）

**文件**: `src/mock/data/interview.mock.ts`  
**Handler**: `src/mock/handlers/interview.handler.ts` + `src/mock/plugins/mock-sse-plugin.ts`  
**后端前缀**: `/api/v1/interview`  
**优先级**: P1

#### 3.5.1 Mock 数据实体

| 数据变量 | 类型 | 说明 | 数据量 |
|----------|------|------|--------|
| `mockInterviewSessions` | `InterviewSession[]` | 面试会话列表 | 3 条 |
| `mockInterviewReport` | `InterviewReport` | 面试报告 | 1 份 |
| `mockGameLevels` | `GameLevel[]` | 游戏化关卡 | 5 个关卡 |
| `mockGameStats` | `GameStats` | 游戏化统计数据 | 1 套 |
| `mockGameAchievements` | `GameAchievement[]` | 游戏化成就 | 5 个 |
| `mockLeaderboard` | `LeaderboardEntry[]` | 排行榜 | 5 条 |
| SSE 对话数据 | `Record<string, string[]>` | 4 组预设对话 | 4 组 |

#### 3.5.2 接口-数据映射表

| # | 方法 | 路径 | Mock 返回数据 | 数据来源 |
|---|------|------|--------------|---------|
| 1 | POST | `/interview/sessions` | `InterviewSession` | 动态生成（合并请求体） |
| 2 | GET | `/interview/sessions` | `InterviewSession[]` | `mockInterviewSessions` |
| 3 | GET | `/interview/sessions/{id}` | `InterviewSession` | 按 ID 匹配或默认值 |
| 4 | POST | `/interview/sessions/{id}/start` | `InterviewSession` | 更新会话状态 |
| 5 | POST | `/interview/sessions/{id}/chat` | SSE 流 | SSE 插件预设对话 |
| 6 | POST | `/interview/sessions/{id}/end` | `InterviewSession` | 更新会话状态 |
| 7 | POST | `/interview/sessions/{id}/cancel` | `InterviewSession` | 更新会话状态 |
| 8 | GET | `/interview/sessions/{id}/report` | `InterviewReport` | `mockInterviewReport`（替换 session_id） |
| 9 | GET | `/interview/questions` | `[]` | 空数组 |
| 10 | GET | `/interview/game/levels` | `GameLevel[]` | `mockGameLevels` |
| 11 | GET | `/interview/game/stats` | `GameStats` | `mockGameStats` |
| 12 | GET | `/interview/game/achievements` | `GameAchievement[]` | `mockGameAchievements` |
| 13 | GET | `/interview/game/leaderboard` | `LeaderboardEntry[]` | `mockLeaderboard` |

#### 3.5.3 关键数据字段

**mockInterviewSessions（3 个会话）**:

| ID | 岗位 | 公司 | 状态 | 轮次 | 评分 |
|----|------|------|------|------|------|
| session-001 | 前端开发工程师 | 字节跳动 | completed | 10/10 | 85 |
| session-002 | 全栈开发工程师 | 腾讯 | in_progress | 3/10 | — |
| session-003 | React 开发工程师 | 阿里巴巴 | scheduled | 0/8 | — |

**mockInterviewReport**:
```
session_id: "session-001"
overall_score: 85
dimensions: { technical:88, communication:82, logic:85, problem_solving:80 }
strengths: ["Vue 3 Composition API 理解深入", "对前端性能优化有实际经验", "代码组织能力较强"]
weaknesses: ["系统设计思维需要加强", "对微前端架构了解不够深入"]
suggestions: 3 条建议
```

**mockGameLevels（5 个关卡）**:

| ID | 名称 | 难度 | 状态 | 进度 | 面试数 | 题目数 | 时限 |
|----|------|------|------|------|--------|--------|------|
| 1 | 初级：校招面试 | 简单 | 已解锁 | 100% | 5 | 8 | 30min |
| 2 | 中级：社招面试 | 中等 | 已解锁 | 30% | 8 | 12 | 45min |
| 3 | 高级：架构师面试 | 困难 | 未解锁 | 0% | 10 | 15 | 60min |
| 4 | 专家：CTO面试 | 专家 | 未解锁 | 0% | 12 | 20 | 90min |
| 5 | 终极：AI面试官 | 终极 | 未解锁 | 0% | 15 | 25 | 120min |

**mockLeaderboard（5 条）**:

| 排名 | 昵称 | 得分 | 头像 |
|------|------|------|------|
| 1 | 张三 | 3250 | 👨‍💻 |
| 2 | 李四 | 3120 | 👩‍💻 |
| 3 | 王五 | 2980 | 👨‍💻 |
| 4 | 赵六 | 2950 | 👩‍💻 |
| 5 | 王同学 | 2850 | 🧑‍💻（当前用户） |

**SSE 对话预设（4 组）**:
- `default`: 自我介绍引导
- `vue`: Vue 3 Composition API 问题
- `react`: React Hooks 闭包陷阱问题
- `system`: 短链接服务系统设计问题

#### 3.5.4 后端对齐分析

| 后端接口 | Mock 已覆盖 | 差异/缺失 |
|----------|------------|----------|
| `POST /interview/sessions` | ✅ | — |
| `GET /interview/sessions/{id}` | ✅ | — |
| `GET /interview/sessions` | ✅ | — |
| `POST /interview/sessions/{id}/start` | ✅ | — |
| `POST /interview/sessions/{id}/chat` | ✅ | SSE 流式对话，Mock 通过 Vite 插件实现 |
| `POST /interview/sessions/{id}/end` | ✅ | — |
| `POST /interview/sessions/{id}/cancel` | ✅ | — |
| `GET /interview/sessions/{id}/report` | ✅ | — |
| 游戏化关卡 | ❌ 后端无对应接口 | Mock 中存在，后端需新增 |
| 游戏化统计 | ❌ 后端无对应接口 | Mock 中存在，后端需新增 |
| 游戏化成就 | ❌ 后端无对应接口 | Mock 中存在，后端需新增 |
| 排行榜 | ❌ 后端无对应接口 | Mock 中存在，后端需新增 |

> **⚠️ 重要发现**: Interview 模块有 4 个游戏化子接口在后端 API 清单中不存在。此外 `/interview/questions` 返回空数组，说明该接口待实现。

---

### 3.6 Learning 模块（学习系统）

**文件**: `src/mock/data/learning.mock.ts`  
**Handler**: `src/mock/handlers/learning.handler.ts`  
**后端前缀**: `/api/v1/learning`  
**优先级**: P1

#### 3.6.1 Mock 数据实体

| 数据变量 | 类型 | 说明 | 数据量 |
|----------|------|------|--------|
| `mockCourses` | `Course[]` | 课程列表 | 4 门 |
| `mockCollections` | `Collection[]` | 收藏题库 | 3 个 |
| `mockWrongQuestions` | `WrongQuestion[]` | 错题列表 | 5 道 |
| `mockBadges` | `Badge[]` | 徽章定义 | 5 个 |
| `mockUserBadges` | `UserBadge[]` | 用户已获得徽章 | 3 个 |

#### 3.6.2 接口-数据映射表

| # | 方法 | 路径 | Mock 返回数据 | 数据来源 |
|---|------|------|--------------|---------|
| 1 | GET | `/learning/courses` | `Course[]` | `mockCourses` |
| 2 | POST | `/learning/courses` | `Course` | 动态生成 |
| 3 | POST | `/learning/materials` | 资料对象 | 动态生成 |
| 4 | POST | `/learning/progress/update` | 进度对象 | 动态生成 |
| 5 | GET | `/learning/progress/{course_id}` | 进度对象 | 动态生成（progress=50） |
| 6 | GET | `/learning/collections` | `Collection[]` | `mockCollections` |
| 7 | POST | `/learning/collections` | `Collection` | 动态生成 |
| 8 | GET | `/learning/wrong-questions` | `WrongQuestion[]` | `mockWrongQuestions` |
| 9 | POST | `/learning/wrong-questions` | `WrongQuestion` | 动态生成 |
| 10 | POST | `/learning/wrong-questions/{id}/master` | `"MARKED_AS_MASTERED"` | 字符串常量 |
| 11 | GET | `/learning/badges` | `Badge[]` | `mockBadges` |
| 12 | POST | `/learning/badges` | `Badge` | 动态生成 |
| 13 | POST | `/learning/badges/award/{badge_id}` | `UserBadge` | 动态生成 |
| 14 | GET | `/learning/my-badges` | `UserBadge[]` | `mockUserBadges` |

#### 3.6.3 关键数据字段

**mockCourses（4 门课程）**:

| ID | 标题 | 分类 | 难度 |
|----|------|------|------|
| 1 | 逻辑思维提升 | 逻辑思维 | easy |
| 2 | 表达结构优化 | 表达结构 | medium |
| 3 | 专业深度强化 | 专业深度 | hard |
| 4 | 面试技巧全攻略 | 面试技巧 | easy |

**mockCollections（3 个收藏）**:

| ID | 标题 | 题目数 | 分类 | 难度 |
|----|------|--------|------|------|
| 1 | 高频算法 50 题 | 24 | 算法 | medium |
| 2 | 前端框架高频题 | 32 | 前端 | medium |
| 3 | 系统设计基础 | 18 | 后端 | hard |

**mockWrongQuestions（5 道错题）**:

| ID | 题目 | 分类 | 难度 | 错误次数 | 状态 |
|----|------|------|------|----------|------|
| 1 | Vue3 组件间通信方式 | 前端 | medium | 2 | unreviewed |
| 2 | 什么是闭包？ | JavaScript | medium | 1 | reviewed |
| 3 | React 应用性能优化 | 前端 | hard | 3 | unreviewed |
| 4 | 事件冒泡和事件捕获 | JavaScript | easy | 1 | reviewed |
| 5 | 深度克隆函数实现 | JavaScript | medium | 2 | unreviewed |

**mockBadges（5 个徽章）**:

| ID | 名称 | 描述 | 图标 |
|----|------|------|------|
| 1 | 初次尝试 | 完成第一次游戏式面试 | sparkles |
| 2 | 连续打卡 | 连续10天进行面试练习 | calendar |
| 3 | 正确率达人 | 单次关卡正确率达到90%以上 | check-circle |
| 4 | 挑战大师 | 完成所有困难级别关卡 | trophy |
| 5 | 知识渊博 | 完成所有技能类别的题目 | book-open |

**mockUserBadges（3 个已获得徽章）**:
- 用户已获得：初次尝试（2026-03-01）、连续打卡（2026-03-12）、正确率达人（2026-03-18）

#### 3.6.4 后端对齐分析

| 后端接口 | Mock 已覆盖 | 差异/缺失 |
|----------|------------|----------|
| 全部 14 个接口 | ✅ 全部覆盖 | — |

---

### 3.7 Community 模块（社区）

**文件**: `src/mock/data/community.mock.ts`  
**Handler**: `src/mock/handlers/community.handler.ts`  
**后端前缀**: `/api/v1/community`  
**优先级**: P2

#### 3.7.1 Mock 数据实体

| 数据变量 | 类型 | 说明 | 数据量 |
|----------|------|------|--------|
| `mockPosts` | `Post[]` | 帖子列表 | 7 条 |
| `mockComments` | `Record<number, Comment[]>` | 评论（按帖子ID分组） | 2 组共 4 条 |
| `mockHotTopics` | `Array` | 热门话题 | 4 条 |
| `mockActiveUsers` | `Array` | 活跃用户 | 4 条 |

#### 3.7.2 接口-数据映射表

| # | 方法 | 路径 | Mock 返回数据 | 数据来源 |
|---|------|------|--------------|---------|
| 1 | GET | `/community/posts/feed` | `Post[]` | `mockPosts` |
| 2 | GET | `/community/posts/{id}` | `Post` | 按 ID 匹配 |
| 3 | POST | `/community/posts` | `Post` | 动态生成 |
| 4 | POST | `/community/posts/{id}/comments` | `Comment` | 动态生成 |
| 5 | POST | `/community/posts/{id}/like` | `{ liked, likes_count }` | 动态计算 |
| 6 | POST | `/community/posts/{id}/ai-review` | `{ task_id, status }` | 动态生成 |
| 7 | POST | `/community/users/{id}/follow` | `{ following: true }` | 固定值 |
| 8 | GET | `/community/hot-topics` | `Array` | `mockHotTopics` |
| 9 | GET | `/community/active-users` | `Array` | `mockActiveUsers` |
| 10 | GET | `/community/posts/{id}/comments` | `Comment[]` | `mockComments[postId]` |
| 11 | GET | `/community/posts/{id}/ai-review` | ❌ 未实现 | — |

#### 3.7.3 关键数据字段

**mockPosts（7 篇帖子）**:

| ID | 标题 | 作者 | 点赞 | 评论 | 时间 |
|----|------|------|------|------|------|
| 1 | 前端面试经验分享 | 匿名同学 | 128 | 24 | 2026-05-09 |
| 2 | Java 线程池深度分析 | 面霸 | 256 | 48 | 2026-05-09 |
| 3 | 产品经理面试心得 | 求职小白 | 96 | 18 | 2026-05-09 |
| 4 | 字节跳动算法题分享 | 技术大牛 | 320 | 56 | 2026-05-09 |
| 5 | HR 视角：面试官最看重的点 | HR 视角 | 180 | 32 | 2026-05-08 |
| 6 | Vue3 和 React 深度对比 | 前端专家 | 210 | 42 | 2026-05-08 |
| 7 | 系统设计面试准备指南 | 后端工程师 | 175 | 38 | 2026-05-07 |

**mockComments（4 条评论）**:
- 帖子 1（前端面试经验分享）：2 条评论
- 帖子 2（Java 线程池深度分析）：2 条评论

**mockActiveUsers（4 位活跃用户）**:

| ID | 昵称 | 帖子数 | 粉丝 | 简介 |
|----|------|--------|------|------|
| 3 | 面霸 | 128 | 520 | 专注于技术面试辅导 |
| 5 | 技术大牛 | 96 | 480 | 资深后端工程师 |
| 7 | 前端专家 | 84 | 420 | 前端架构师 |
| 6 | HR 视角 | 72 | 380 | 资深 HR，10 年招聘经验 |

#### 3.7.4 后端对齐分析

| 后端接口 | Mock 已覆盖 | 差异/缺失 |
|----------|------------|----------|
| 全部 9 个后端接口 | 覆盖 10 个（含额外） | Mock 额外实现了 `hot-topics` 和 `active-users`，后端无对应接口 |
| `PUT /community/posts/{id}` | ❌ 未覆盖 | 编辑帖子 |
| `DELETE /community/posts/{id}` | ❌ 未覆盖 | 删除帖子 |

---

### 3.8 Notification 模块（通知）

**文件**: `src/mock/data/notification.mock.ts`  
**Handler**: `src/mock/handlers/notification.handler.ts`  
**后端前缀**: `/api/v1/notifications`  
**优先级**: P1

#### 3.8.1 Mock 数据实体

| 数据变量 | 类型 | 说明 | 数据量 |
|----------|------|------|--------|
| `mockNotifications` | `Notification[]` | 通知列表 | 5 条 |
| `mockNotificationPreferences` | `NotificationPreferences` | 通知偏好设置 | 1 套 |

#### 3.8.2 接口-数据映射表

| # | 方法 | 路径 | Mock 返回数据 | 数据来源 |
|---|------|------|--------------|---------|
| 1 | GET | `/notifications` | `Notification[]` | `mockNotifications` |
| 2 | GET | `/notifications/unread-count` | `number` | 动态计算 |
| 3 | PUT | `/notifications/{id}/read` | `"MARKED_AS_READ"` | 字符串常量 |
| 4 | PUT | `/notifications/read-all` | `"ALL_MARKED_AS_READ"` | 字符串常量 |
| 5 | GET | `/notifications/preferences` | `NotificationPreferences` | `mockNotificationPreferences` |
| 6 | PUT | `/notifications/preferences` | `NotificationPreferences` | 合并请求体 |
| 7 | POST | `/notifications/device-token` | `"DEVICE_TOKEN_REGISTERED"` | 字符串常量 |

#### 3.8.3 关键数据字段

**mockNotifications（5 条通知）**:

| ID | 标题 | 类型 | 已读 | 时间 | 链接 |
|----|------|------|------|------|------|
| 1 | 面试邀请 | interview | 否 | 2026-05-30 | /interview |
| 2 | 社区互动 | community | 否 | 2026-05-29 | /community |
| 3 | 学习提醒 | learning | 是 | 2026-05-28 | /knowledge |
| 4 | 系统维护通知 | system | 是 | 2026-05-27 | — |
| 5 | 面试报告已生成 | interview | 否 | 2026-05-31 | /report |

**mockNotificationPreferences**:
```
email_notifications: true
push_notifications: true
interview_reminders: true
community_updates: false
learning_reminders: true
```

#### 3.8.4 后端对齐分析

| 后端接口 | Mock 已覆盖 | 差异/缺失 |
|----------|------------|----------|
| 全部 4 个后端接口 | 覆盖 7 个（含额外） | Mock 额外实现了偏好设置、设备 Token 注册，后端无对应接口 |

---

### 3.9 System 模块（系统管理）

**文件**: `src/mock/data/system.mock.ts`  
**Handler**: `src/mock/handlers/system.handler.ts`  
**后端前缀**: `/api/v1/system`  
**优先级**: P3

#### 3.9.1 Mock 数据实体

| 数据变量 | 类型 | 说明 | 数据量 |
|----------|------|------|--------|
| `mockSystemConfigs` | `SystemConfig[]` | 系统配置 | 3 条 |
| `mockSystemHealth` | `SystemHealth` | 系统健康状态 | 1 条 |
| `mockSystemAnnouncements` | `SystemAnnouncement[]` | 系统公告 | 2 条 |

#### 3.9.2 接口-数据映射表

| # | 方法 | 路径 | Mock 返回数据 | 数据来源 |
|---|------|------|--------------|---------|
| 1 | GET | `/system/config` | `SystemConfig[]` | `mockSystemConfigs` |
| 2 | GET | `/system/health` | `SystemHealth` | `mockSystemHealth` |
| 3 | GET | `/system/announcements` | `SystemAnnouncement[]` | `mockSystemAnnouncements` |

#### 3.9.3 关键数据字段

**mockSystemConfigs（3 条配置）**:
```
max_interview_sessions: "10"    — 用户最大同时进行面试会话数
ai_review_enabled: "true"       — 是否启用 AI 评审功能
daily_question_limit: "50"      — 每日刷题上限
```

**mockSystemHealth**:
```
status: "healthy"
version: "0.1.0"
uptime: 86400
database: "connected"
redis: "connected"
```

**mockSystemAnnouncements（2 条公告）**:

| ID | 标题 | 类型 | 有效期 | 状态 |
|----|------|------|--------|------|
| 1 | 新功能上线：AI 简历诊断 | info | 2026-05-25 ~ 2026-06-25 | active |
| 2 | 系统升级维护通知 | maintenance | 2026-05-28 起 | active |

#### 3.9.4 后端对齐分析

| 后端接口 | Mock 已覆盖 | 差异/缺失 |
|----------|------------|----------|
| `GET /system/config` | ✅ | — |
| `POST /system/config` | ❌ 未覆盖 | 创建配置 |
| `GET /system/audit-log` | ❌ 未覆盖 | 审计日志 |
| `GET /system/health` | ❌ 后端无此接口 | Mock 额外实现 |
| `GET /system/announcements` | ❌ 后端无此接口 | Mock 额外实现 |

---

## 4. Mock 与后端接口差异汇总

### 4.1 Mock 有但后端无的接口

这些接口在前端 Mock 中已实现但后端 API 清单中不存在，需要评估是否在后端新增：

| 模块 | 接口路径 | 说明 | 建议 |
|------|----------|------|------|
| User | `GET /user/interview-history` | 面试历史记录 | 评估是否合并到 Interview 模块 |
| User | `GET /user/ability-data` | 能力雷达数据 | 评估是否由 Assessment 结果计算得出 |
| User | `GET /user/game-interview-data` | 游戏化面试聚合数据 | 评估是否合并到 Interview 模块 |
| User | `GET /user/resume` | 简历数据 | 评估是否新增简历模块 |
| User | `POST /user/resume/diagnose` | 简历诊断 | 评估是否新增简历模块 |
| Interview | `GET /interview/game/levels` | 游戏化关卡 | 评估是否作为面试配置的一部分 |
| Interview | `GET /interview/game/stats` | 游戏化统计 | 评估是否由现有数据计算得出 |
| Interview | `GET /interview/game/achievements` | 游戏化成就 | 评估是否合并到 Learning 徽章系统 |
| Interview | `GET /interview/game/leaderboard` | 排行榜 | 评估是否新增排行榜模块 |
| Community | `GET /community/hot-topics` | 热门话题 | 评估是否由后端算法计算 |
| Community | `GET /community/active-users` | 活跃用户 | 评估是否由后端统计得出 |
| Notification | `GET /notifications/preferences` | 通知偏好 | 评估是否合并到 User 模块 |
| Notification | `PUT /notifications/preferences` | 更新通知偏好 | 评估是否合并到 User 模块 |
| Notification | `POST /notifications/device-token` | 设备 Token 注册 | 评估是否新增推送模块 |
| System | `GET /system/health` | 健康检查 | 评估是否新增运维接口 |
| System | `GET /system/announcements` | 系统公告 | 评估是否新增公告模块 |

### 4.2 后端有但 Mock 无的接口

这些接口在后端 API 清单中存在但前端 Mock 尚未实现：

| 模块 | 接口路径 | 优先级 |
|------|----------|--------|
| Auth | `POST /auth/refresh` | P0 |
| Auth | `POST /auth/logout` | P0 |
| Auth | `POST /auth/unlock/{username}` | P0 |
| Community | `PUT /community/posts/{id}` | P2 |
| Community | `DELETE /community/posts/{id}` | P2 |
| System | `POST /system/config` | P3 |
| System | `GET /system/audit-log` | P3 |
| Business | 全部 9 个接口 | P3 |
| Role | 全部 5 个接口 | P3 |

### 4.3 数据量统计

| 模块 | Mock 数据实体数 | 数据记录数 | 预估数据库表数 |
|------|---------------|-----------|--------------|
| Auth | 3 | 3 | 2（users, tokens） |
| User | 6 | 1 + 12 + 4 + 1 + 1 + 1 | 6+ |
| Job | 3 | 5 + 1 + 5 | 3+ |
| Assessment | 2 | 3 + 3 | 2+ |
| Interview | 7 | 3 + 1 + 5 + 1 + 5 + 5 + 4 | 7+ |
| Learning | 5 | 4 + 3 + 5 + 5 + 3 | 5+ |
| Community | 4 | 7 + 4 + 4 + 4 | 4+ |
| Notification | 2 | 5 + 1 | 2+ |
| System | 3 | 3 + 1 + 2 | 3+ |
| **合计** | **35** | **~120 条记录** | **~34 张表** |

---

## 5. 数据迁移策略建议

### 5.1 迁移顺序

建议按后端 API 优先级分阶段迁移：

```
Phase 1 — P0 核心基建（先行）
├── Auth: 用户、Token 数据
├── User: 用户画像、Profile
└── Job: 岗位、技能树、匹配度

Phase 2 — P1 主业务流程
├── Assessment: 测评试卷、测评结果
├── Learning: 课程、收藏、错题、徽章
├── Interview: 面试会话、报告、游戏化数据
└── Notification: 通知、偏好

Phase 3 — P2 增值功能
└── Community: 帖子、评论、用户

Phase 4 — P3 管理后台
└── System: 配置、公告、健康检查
```

### 5.2 数据转换注意事项

1. **字段名对齐**: 前端 Mock 数据部分使用 camelCase，后端使用 snake_case，迁移时需转换
2. **关联数据**: 用户 ID、帖子 ID 等关联字段需确保引用完整性
3. **时间戳格式**: Mock 中使用字符串 ISO8601，后端可能使用 datetime 类型
4. **动态生成数据**: 部分 Mock 使用 `Date.now()` 动态生成，迁移时需替换为固定值
5. **枚举值**: `status`、`type`、`difficulty` 等字段需与后端枚举定义对齐

### 5.3 推荐方案

1. **SQL 种子脚本**: 为每个模块编写独立的 SQL INSERT 脚本
2. **Python 脚本（Alembic + Faker）**: 使用 Alembic 数据迁移 + Faker 生成符合 Schema 的种子数据
3. **JSON 种子文件 + 导入脚本**: 将 Mock 数据导出为 JSON，编写通用导入脚本

---

## 6. 风险与注意事项

### 6.1 数据一致性风险

- 多个模块引用同一用户（`mockUser` id=1），迁移时需确保用户先于其他数据创建
- 面试会话与面试报告的关联（session_id），需在迁移时保持引用一致性
- 社区帖子与评论、用户之间的关联关系

### 6.2 接口差异风险

- 16 个 Mock 接口在后端没有对应实现，需要产品/后端确认是否补充
- 9 个后端接口在前端 Mock 中没有实现，填充数据库时这些接口的数据可能需要额外构造

### 6.3 数据质量风险

- Mock 数据中的中文文本（如帖子内容、评论）可能包含模拟性质的描述，建议迁移时保持原样或替换为更真实的数据
- 部分能力评分数据（mockAbilityData）为硬编码数值，迁移后可能需根据实际业务逻辑调整

### 6.4 技术风险

- SSE 流式对话数据（`mock-sse-plugin.ts` 中的预设对话）为前端模拟，无法直接迁移到数据库，需后端实现对话逻辑
- 游戏化数据（关卡、成就、排行榜）的结构在后端可能完全不同

---

## 7. 下一步工作

1. **确认接口差异处理方案**: 与产品/后端团队确认 4.1 和 4.2 中列出的差异接口的处理方式
2. **获取后端数据库 Schema**: 确认各模块对应的数据库表结构，以便精确映射
3. **编写 Mock 数据清单**（下一阶段任务）: 将本文档中的分析结果转换为可直接用于填充数据库的结构化数据清单
4. **编写数据迁移脚本**: 按 Phase 1→4 的顺序编写种子数据脚本

---

## 附录 A：Mock 数据文件索引

| 文件路径 | 大小 | 导出变量数 |
|----------|------|-----------|
| `src/mock/data/auth.mock.ts` | ~500B | 3 |
| `src/mock/data/user.mock.ts` | ~12KB | 6 |
| `src/mock/data/assessment.mock.ts` | ~1.5KB | 2 |
| `src/mock/data/interview.mock.ts` | ~6KB | 7 |
| `src/mock/data/learning.mock.ts` | ~5KB | 5 |
| `src/mock/data/job.mock.ts` | ~3KB | 3 |
| `src/mock/data/community.mock.ts` | ~5.5KB | 4 |
| `src/mock/data/notification.mock.ts` | ~1.5KB | 2 |
| `src/mock/data/system.mock.ts` | ~1KB | 3 |

## 附录 B：Handler 文件索引

| 文件路径 | 注册接口数 |
|----------|-----------|
| `src/mock/handlers/auth.handler.ts` | 8 |
| `src/mock/handlers/user.handler.ts` | 9 |
| `src/mock/handlers/assessment.handler.ts` | 4 |
| `src/mock/handlers/interview.handler.ts` | 13 |
| `src/mock/handlers/learning.handler.ts` | 14 |
| `src/mock/handlers/job.handler.ts` | 4 |
| `src/mock/handlers/community.handler.ts` | 11 |
| `src/mock/handlers/notification.handler.ts` | 7 |
| `src/mock/handlers/system.handler.ts` | 3 |

## 附录 C：参考文档

- [前端 API 对接接口清单](file:///d:/code/MianMianMaster/docs/api/frontend-api-integration-guide.md)
- [API 与 Mock 开发规范](file:///d:/code/MianMianMaster/.trae/rules/04-api-and-mock.md)
- [前端开发规约主索引](file:///d:/code/MianMianMaster/.trae/rules/frontend-development-specification.md)