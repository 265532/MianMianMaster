# 后端字段补齐清单

> **生成日期**: 2026-06-02
> **触发事件**: `Profile.vue:1085` 渲染报错 `Cannot read properties of undefined (reading 'slice')`
> **根因**: 真实后端 `/user/interview-history` 响应 `items[]` 缺少 `tags` 字段，前端类型 `InterviewHistoryItem.tags: string[]` 声明为必填，模板直接 `.slice()` 触发 TypeError，Vue 在渲染过程中未捕获异常导致组件 unmount，整页空白（`App.vue` 调用的 `useErrorBoundary()` 仅 `console.error` 打印日志，`onErrorCaptured` 返回 `false` 不阻止错误传播，无真实兜底）。
> **复核范围**: `docs/api/openapi.json` ⇋ `src/api/types/*.types.ts` ⇋ `src/api/modules/*.api.ts` 三角对照
> **关联文档**:
> - [docs/api/api-review-report.md](./api-review-report.md) — 已有审查报告
> - [docs/api/frontend-issues.md](./frontend-issues.md) — 前端侧问题清单（F-001~F-016）
> - [docs/api/tasks/user.md](./tasks/user.md) — User 模块联调任务

---

## 总体优先级

| 优先级 | 数量 | 含义 |
|--------|------|------|
| 🔴 P0 | 7 项 | 阻塞主流程，本周必做 |
| 🟡 P1 | 8 项 | 影响功能完整性，下迭代完成 |
| ⚪ P2 | 15 项 | 按排期，可与 Mock 长期共存 |

---

## 一、P0 — 阻塞（本周必做）

### 1.1 `GET /user/interview-history` 响应字段补齐 🔴

**Bug 状态**: 前端类型侧已将 `tags` / `feedback` / `details` 改为可选（`src/api/types/user.types.ts:60-67`）。**`item.tags` 已在 `Profile.vue` 8 处加 `?? []` 模板兜底**（`1085/1092/1094/1209/2159/2166/2168/2281`），可独立于后端修复发布；**但 `item.feedback`（2 处：`1198/2270`）与 `item.details.*`（16 处：`1123/1130/1139/1147/1157/1164/1173/1181/2197/2204/2213/2220/2229/2236/2245/2253`）仍**未保护**，后端补齐前点击展开详情会立刻抛 `Cannot read properties of undefined (reading 'technical')` 等错误。**前端需同步兜底，否则后端上线后仍会出现新 Bug**。

**每条 `InterviewHistoryItem` 缺失字段**：

| # | 字段 | 类型 | 缺省值建议 | 前端使用位置 | 状态 |
|---|------|------|------------|--------------|------|
| 1 | `tags` | `string[]` | `[]` | `Profile.vue:1085/1092/1094/1209/2159/2166/2168/2281` | 🔴 已造成线上 Bug |
| 2 | `feedback` | `string` | `""` | `Profile.vue:1198/2270` | 🔴 确认缺失，前端未兜底 |
| 3 | `details.technical` | `number` | `0` | `Profile.vue:1123/1130/2197/2204` | 🔴 确认缺失，前端未兜底 |
| 4 | `details.communication` | `number` | `0` | `Profile.vue:1139/1147/2213/2220` | 🔴 确认缺失，前端未兜底 |
| 5 | `details.logic` | `number` | `0` | `Profile.vue:1157/1164/2229/2236` | 🔴 确认缺失，前端未兜底 |
| 6 | `details.problem_solving` | `number` | `0` | `Profile.vue:1173/1181/2245/2253` | 🔴 确认缺失，前端未兜底 |

> **重要**: 即使无数据，请**返回空值**（`[]` / `""` / `0`），**勿省略字段**或返回 `null`。前端已在类型层加可选防御，但语义化数据才能正确展示。

**完整响应结构参考**：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "items": [
      {
        "id": 1,
        "date": "2026-03-15",
        "company": "字节跳动",
        "position": "前端开发工程师",
        "round": "二面",
        "type": "技术面",
        "score": 88,
        "status": "passed",
        "tags": ["Vue3", "TypeScript", "算法"],
        "feedback": "技术基础扎实，算法能力突出，表达清晰",
        "details": {
          "technical": 90,
          "communication": 85,
          "logic": 92,
          "problem_solving": 88
        }
      }
    ],
    "total": 12,
    "page": 1,
    "page_size": 10
  }
}
```

**对应类型定义**: [`src/api/types/user.types.ts:51-75`](../../src/api/types/user.types.ts#L51-L75)

---

### 1.2 `details.problem_solving` 字段名不一致 🔴

**Bug 状态**: 前端类型定义 [`user.types.ts:66`](../../src/api/types/user.types.ts#L66) 使用 `problem_solving`（snake_case），但 `Profile.vue` 模板 4 处使用了 `problemSolving`（camelCase）：`1173/1181/2245/2253`。**项目无任何 snake_case→camelCase 运行时转换**（`http.ts` 直接透传 `data`，`package.json` 无 `humps`/`camelcase-keys` 等库），导致 `problemSolving` 在 Mock 和真实后端模式下**永远为 `undefined`**。

| # | 位置 | 当前代码 | 应改为 |
|---|------|----------|--------|
| 1 | `Profile.vue:1173` | `{{ item.details.problemSolving }}%` | `{{ item.details.problem_solving }}%` |
| 2 | `Profile.vue:1181` | `:style="{ width: item.details.problemSolving + '%' }"` | `:style="{ width: item.details.problem_solving + '%' }"` |
| 3 | `Profile.vue:2245` | `{{ item.details.problemSolving }}%` | `{{ item.details.problem_solving }}%` |
| 4 | `Profile.vue:2253` | `:style="{ width: item.details.problemSolving + '%' }"` | `:style="{ width: item.details.problem_solving + '%' }"` |

> **注意**: 其他 3 个维度（`technical`/`communication`/`logic`）不存在此问题，因为它们的 snake_case 与 camelCase 拼写一致。仅 `problem_solving` 含下划线导致不一致。

---

> ⚠️ **历史条目（已删除）**: 此前 P0 曾列出 "`Token.refresh_token` 字段 OpenAPI 未声明"（#7）。经 2026-06-02 复核，[`docs/api/openapi.json:7131-7153`](./openapi.json) 中 `Token` schema **已声明** `refresh_token: string` 且列入 `required`。原条目作废。
> 真正需要核查的是**运行时** `/auth/login` / `/auth/refresh` 是否真的把 `refresh_token` 写入响应 JSON（OpenAPI 声明 ≠ 运行时实现），以及前端 [`src/utils/auth.ts`](../../src/utils/auth.ts) 是否正确持久化。**此问题已转交前端调研，本表不再追踪**。

---

## 二、P1 — 影响功能完整性（下迭代）

### 2.1 字段命名/类型差异（已存在但前后端不一致）

| # | 模块 | 前端期望 | 后端 OpenAPI 实际 | 对应类型 | 状态 |
|---|------|----------|-------------------|----------|------|
| 8 | Job | `SkillTreeNode.is_required: boolean` | 未列 | [`job.types.ts:22-28`](../../src/api/types/job.types.ts#L22-L28) | 🟡 |
| 9 | Job | `SkillTreeNode.has_required_child: boolean` | 未列 | [`job.types.ts:22-28`](../../src/api/types/job.types.ts#L22-L28) | 🟡 |
| 10 | Community | `Post.category: 'interview_review' \| 'real_questions' \| 'experience'` | 未列枚举 | [`community.types.ts:1-17`](../../src/api/types/community.types.ts#L1-L17) | 🟡 |
| ~~11~~ | ~~Community~~ | ~~`Comment.parent_id: number`~~ | ~~已声明（`openapi.json:3703/3732`，无需后端改动）~~ | — | ~~已删除（2026-06-02 复核）~~ |
| ~~12~~ | ~~Community~~ | ~~`Post.ai_review_content: string`~~ | ~~已声明（`openapi.json:5081`，nullable string）~~ | — | ~~已删除（2026-06-02 复核）~~ |
| 13 | Notification | `Notification.type: 'system' \| 'interview_result' \| 'community' \| 'learning'` | 未列枚举 | [`notification.types.ts:1-9`](../../src/api/types/notification.types.ts#L1-L9) | 🟡 |
| 14 | Notification | `Notification.link: string` | 未列 | [`notification.types.ts:1-9`](../../src/api/types/notification.types.ts#L1-L9) | 🟡 |
| 15 | Assessment | 前端 `AssessmentResult` 与后端 `UserAssessmentRecord` 字段不对齐 | 后端 `POST /assessments/submit` 返回 `UserAssessmentRecord`（`openapi.json:7224-7262`）含 `user_id`/`total_score`，前端 [`AssessmentResult`](../../src/api/types/assessment.types.ts#L30-L36) 仅有 `id`/`assessment_id`/`score`/`details`/`created_at`，缺少 `user_id`/`total_score`；且前端 `score` 应对应后端 `total_score`。另前端 [`Assessment`](../../src/api/types/assessment.types.ts#L1-L6) 类型缺少后端 `Assessment` schema（`openapi.json:3350-3408`）的 `questions`/`description`/`job_position_id`/`updated_at` 字段 | 🟡 |

### 2.2 请求体（Request Body）差异

| # | 接口 | 前端发送 | 后端 OpenAPI 实际 | 状态 |
|---|------|----------|-------------------|------|
| 16 | `POST /assessments` | `{ type?, questions: AssessmentQuestion[] }` | `AssessmentCreate` 必填 `title`，**无 `type` 字段**，有 `description` / `job_position_id` | 🟡 |
| 17 | `POST /assessments/submit` | `{ assessment_id, answers: Array<{question_id, answer}> }` | `AssessmentSubmitRequest` 期望 `assessment_id` + `answers[]`（每项含 `question_id` + `answer`），字段名已对齐，待确认 `answers` 是否必填 | 🟡 |

---

## 三、P2 — 端点完全缺失（OpenAPI 中未声明，前端依赖 Mock）

后端 OpenAPI 规范中**未声明**以下端点，需确认排期或确认前端降级为 Mock：

### 3.1 User 模块（个人中心重度依赖）🔴 优先

> 严格意义上属于 P0，但因端点未实现而非字段缺失，故放此处统一管理。

| # | 方法 | 路径 | 前端方法 | 期望响应类型 |
|---|------|------|----------|--------------|
| 19 | GET | `/user/interview-history` | `userApi.getInterviewHistory()` | `ResponseModel<InterviewHistoryResponse>` |
| 20 | GET | `/user/ability-data` | `userApi.getAbilityData()` | `ResponseModel<Record<string, AbilityDataItem>>` |
| 21 | GET | `/user/game-interview-data` | `userApi.getGameInterviewData()` | `ResponseModel<GameInterviewDataResponse>` |
| 22 | GET | `/user/resume` | `userApi.getResume()` | `ResponseModel<ResumeData>` |
| 23 | POST | `/user/resume/diagnose` | `userApi.diagnoseResume()` | `ResponseModel<ResumeDiagnosisResult>` |

**对应文件**: [`src/api/modules/user.api.ts`](../../src/api/modules/user.api.ts) | [`src/api/types/user.types.ts`](../../src/api/types/user.types.ts)

### 3.2 Notification 模块

| # | 方法 | 路径 | 前端方法 |
|---|------|------|----------|
| 24 | GET | `/notifications/preferences` | `notificationApi.getPreferences()` |
| 25 | PUT | `/notifications/preferences` | `notificationApi.updatePreferences()` |
| 26 | POST | `/notifications/device-token` | `notificationApi.registerDeviceToken()` |

### 3.3 Community 模块

| # | 方法 | 路径 | 前端方法 |
|---|------|------|----------|
| 27 | GET | `/community/hot-topics` | `communityApi.getHotTopics()` |
| 28 | GET | `/community/active-users` | `communityApi.getActiveUsers()` |

### 3.4 Interview 模块（游戏化面试）

| # | 方法 | 路径 | 前端方法 |
|---|------|------|----------|
| 29 | GET | `/interview/questions` | `interviewApi.getQuestions()` |
| 30 | GET | `/interview/game/levels` | `interviewApi.getGameLevels()` |
| 31 | GET | `/interview/game/stats` | `interviewApi.getGameStats()` |
| 32 | GET | `/interview/game/achievements` | `interviewApi.getGameAchievements()` |
| 33 | GET | `/interview/game/leaderboard` | `interviewApi.getGameLeaderboard()` |

### 3.5 System 模块

| # | 方法 | 路径 | 前端方法 |
|---|------|------|----------|
| 34 | GET | `/system/announcements` | `systemApi.getAnnouncements()` |

---

## 四、验证 Checklist

后端补齐后，前端按以下步骤回归：

```bash
# 1. 确认 .env.development 配置
# PowerShell: Get-Content .env.development
# Git Bash:  cat .env.development
# VITE_USE_MOCK=false           ← 必须为 false
# VITE_PROXY_TARGET=http://localhost:8081  ← 指向真实后端

# 2. 启动前端
npm run dev

# 3. 浏览器 DevTools 打开
# - Network 面板
# - 访问 /profile
# - 观察 /user/interview-history 响应，每条 item 应包含 tags/feedback/details
# - 确认无 TypeError 报错
```

**功能验证**：
- [ ] 面试记录卡片正常渲染
- [ ] 标签 chip（Vue3 / TypeScript 等）正确显示
- [ ] 展开详情面板能看到评分维度
- [ ] 反馈文本正常展示

**数据契约断言**（Network 面板 /user/interview-history 响应 — 使用含数据的测试账号）：
- [ ] `items[0]` 至少包含 11 个字段（`id/date/company/position/round/type/score/status/tags/feedback/details`）
- [ ] 至少 1 条 `item.tags` 为非空数组（`length >= 1`）
- [ ] 至少 1 条 `item.details.technical` 数值在 `0-100` 区间
- [ ] 至少 1 条 `item.feedback` 为非空字符串
- [ ] 分页结构完整：`{ items, total, page, page_size }`

**空数据边界回归**（**关键 — 验证前端兜底是否到位 — 使用无数据/空数据测试账号，与上方断言分两次验证**）：
- [ ] 后端模拟返回 `items: [{ ..., tags: [], feedback: "", details: undefined }]`，UI **不抛 TypeError** 且能正常显示空状态
- [ ] 后端模拟返回 `items: []`，空状态组件正常出现
- [ ] 浏览器 Console 无 `Cannot read properties of undefined` 报错

**回归验证**（避免引入新问题）：
- [ ] Mock 模式（`VITE_USE_MOCK=true`）下功能仍正常
- [ ] `npx vue-tsc --noEmit -p tsconfig.app.json` 类型检查通过（**注意**：`vue-tsc -b` 是 build mode 会写盘，与 `--noEmit` 互斥；如需全量构建请用 `npm run build`）
- [ ] 登录态正常维持（refresh_token 可用）

---

## 五、备注

- **不要使用 `null` 替代空值**：前端在 `http.ts` 拦截器中已做 `data.code !== 200` 判断，但 `null` 字段会让 `.length` / `.slice` / `{{ x }}` 等运算产生额外异常分支。请返回**类型对应的零值**。
- **保留字段而非省略**：即使数据为空数组/空对象也请保留 key，方便前端统一处理。
- **命名规范**: 后端 JSON 字段统一使用 `snake_case`（与 OpenAPI 一致）。前端 TypeScript 类型定义同样使用 `snake_case` 以保证运行时直接对应，不存在自动 key 转换层。
- **分页格式**: 列表接口统一返回 `{ items, total, page, page_size }`（参考 [user.types.ts:70-75](../../src/api/types/user.types.ts#L70-L75)）。

---

**前端对应修复已完成**:
- ✅ `InterviewHistoryItem.tags / feedback / details` 改为可选类型（`src/api/types/user.types.ts:60-67`）
- ✅ `Profile.vue` 8 处 `item.tags` 加 `?? []` / `?.` 模板兜底（`1085/1092/1094/1209/2159/2166/2168/2281`）

**前端对应修复仍待完成**:
- ⏳ `Profile.vue` 2 处 `item.feedback` 加 `?? ''` 兜底（`1198/2270`）
- ⏳ `Profile.vue` 16 处 `item.details.*` 加 `?.` 兜底（`1123/1130/1139/1147/1157/1164/1173/1181/2197/2204/2213/2220/2229/2236/2245/2253`）
- ⏳ `Profile.vue` 4 处 `problemSolving` 改为 `problem_solving`（`1173/1181/2245/2253`）

**待后端响应**:
- ⏳ 补齐 7 项 P0 字段（interview-history 响应 `tags/feedback/details` + `problem_solving` 命名确认）
- ⏳ 确认 16 项 P2 端点排期

---

## 六、复核记录（2026-06-02）

本次复核采用 **三角对照法**（`openapi.json` ⇋ `src/api/types/*.types.ts` ⇋ `src/views/Profile.vue` ⇋ `src/App.vue` ⇋ `package.json`），发现并修正以下问题：

| # | 类型 | 原描述 | 实际情况 | 处置 |
|---|------|--------|----------|------|
| 1 | 事实错误 | P0 #7 `refresh_token` OpenAPI 未声明 | `openapi.json:7131-7153` `Token` schema 已声明且 required | 删除条目，转前端调研运行时 |
| 2 | 事实错误 | P1 #11 `Comment.parent_id` 未列 | `openapi.json:3703/3732` 已声明 | 删除条目 |
| 3 | 事实错误 | P1 #12 `Post.ai_review_content` 未列 | `openapi.json:5081` 已声明（nullable） | 删除条目 |
| 4 | 误描述 | "`App.vue` 的 `ErrorBoundary` 兜底" | 无 ErrorBoundary 组件；`useErrorBoundary` 仅打印日志且不阻止传播 | 修订根因描述 |
| 5 | 修复自述不准 | "已在 8 处加兜底" | `item.tags` 8 处已加；但 `item.feedback`（2 处）和 `item.details.*`（16 处）**仍**未保护 | 拆分"已完成/仍待完成"两节 |
| 6 | 命令错误 | `vue-tsc -b --noEmit` | `-b` 与 `--noEmit` 互斥 | 改为 `npx vue-tsc --noEmit -p tsconfig.app.json` |
| 7 | 数量自相矛盾 | P1 表声称 11 项 / P2 声称 12 项 | P1 实际 9 项 / P2 实际 17 项 | 修订数量 |
| 8 | 验证项过粗 | "正常渲染" 等主观描述 | 缺乏数据契约断言与空数据边界 | 新增"数据契约断言"与"空数据边界回归"两节 |

## 七、复核记录（2026-06-02 二次审查）

| # | 类型 | 原描述 | 实际情况 | 处置 |
|---|------|--------|----------|------|
| 9 | 事实错误 | P1 #18 `POST /community/posts` OpenAPI 缺 `category` | `PostCreate` schema（`openapi.json:5018-5020`）已声明且 required | 删除条目 |
| 10 | 事实错误 | P2 #34 `GET /system/health` 端点缺失 | `openapi.json:3183-3197` 已声明 `/health` 端点 | 删除条目 |
| 11 | 描述错误 | P1 #17 前端发送 `{ id, answers? }` | `AssessmentSubmit` 类型实际为 `{ assessment_id, answers }` | 修正描述，降级差异 |
| 12 | 描述错误 | P1 #15 `AssessmentResult.questions` 未列 | 前端 `AssessmentResult` 类型无 `questions` 字段；`questions` 在 `Assessment` schema | 修正归属 |
| 13 | 遗漏 Bug | P0 未提及 `details.problem_solving` 命名不一致 | 类型定义 `problem_solving`（snake_case），模板访问 `problemSolving`（camelCase），无运行时转换 | 新增 P0 1.2 节 |
| 14 | 误导陈述 | §五 "前端 TypeScript 自动映射" | 项目无任何 snake_case→camelCase 转换逻辑 | 修正为"类型定义同样使用 snake_case，不存在自动 key 转换层" |
| 15 | 可移植性 | 验证 Checklist `cat .env.development` | Windows PowerShell 不支持 `cat`（需 `Get-Content`） | 添加 PowerShell / Git Bash 双命令 |
| 16 | 数量不一致 | 摘要表 P2 声称 16 项 | 二次审查删除 #34 `/system/health` 后实际为 15 项（5+3+2+5+1） | 摘要表 16→15 |
