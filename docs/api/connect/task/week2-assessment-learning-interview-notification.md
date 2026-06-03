# Week 2: Assessment + Learning + Interview + Notification 模块契约漂移修复

> **阶段**: Week 2 — P1 主业务流程\
> **模块**: Assessment(测评) + Learning(学习) + Interview(面试) + Notification(通知)\
> **总端点数**: 37 (Assessment 4 + Learning 14 + Interview 11 + Notification 8)\
> **优先级**: P1 — 核心业务流程闭环\
> **前置依赖**: Week 1 完成 (Auth + User + Job)\
> **契约基准**: [api-contract-summary.md](./api-contract-summary.md) § Assessment / Learning / Interview / Notification\
> **对应总体进度**: [progress.md](./progress.md)

***

## 一、目标与范围

### 1.1 目标

确保 Assessment(测评)、Learning(学习)、Interview(面试)、Notification(通知) 四个 P1 模块的前端代码与后端 API 契约完全对齐，打通完整的 "测评 → 学习 → 面试 → 通知" 业务流程闭环。

### 1.2 范围

| 模块           | 端点数 | 涉及前端文件                                                                                                                                                |
| ------------ | --- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Assessment   | 4   | `assessment.types.ts`, `assessment.api.ts`, `stores/assessment.ts`, `Report.vue`                                                                      |
| Learning     | 14  | `learning.types.ts`, `learning.api.ts`, `stores/learning.ts`, `stores/practice.ts`, `Practice.vue`, `PathPractice.vue`, `JobSpecificQuestionBank.vue` |
| Interview    | 11  | `interview.types.ts`, `interview.api.ts`, `stores/interview.ts`, `Interview.vue`, `GameInterview.vue`                                                 |
| Notification | 8   | `notification.types.ts`, `notification.api.ts`, `stores/notification.ts`                                                                              |

### 1.3 验收标准

- [ ] 所有 37 个端点前端调用签名与 `api-contract-summary.md` 100% 一致
- [ ] TypeScript 编译零错误 (`vue-tsc --noEmit`)
- [ ] Vite 构建成功 (`vite build`)
- [ ] 完成测评 → 学习 → 面试(S含SE流式对话) → 通知 全流程端到端验证

***

## 二、模块 D: Assessment (测评) — 4 端点

### 2.1 契约摘要

<details>
<summary>展开查看 Assessment 模块完整契约</summary>

| #  | 端点                                           | 方法   | 认证 | 关键字段                                                                                                                                                                                              |
| -- | -------------------------------------------- | ---- | -- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D1 | `/api/v1/assessments`                        | POST | 是  | 请求: `title`, `description`?, `job_position_id`?, `questions`? (QuestionCreate\[]) ⏐ 响应: `title`, `description`?, `job_position_id`?, `id`, `created_at`, `updated_at`, `questions`? (Question\[]) |
| D2 | `/api/v1/assessments`                        | GET  | 否  | 查询: `skip`?, `limit`? ⏐ 响应数组: `title`, `description`?, `job_position_id`?, `id`, `created_at`, `updated_at`, `questions_count`?                                                                   |
| D3 | `/api/v1/assessments/submit`                 | POST | 是  | 请求: `assessment_id`, `answers` (AssessmentSubmitItem\[]) ⏐ 响应: `id`, `user_id`, `assessment_id`, `total_score`, `details` (object), `created_at`                                                  |
| D4 | `/api/v1/assessments/{assessment_id}/result` | GET  | 是  | 路径: `assessment_id` ⏐ 响应: `id`, `user_id`, `assessment_id`, `total_score`, `details` (object), `created_at`                                                                                       |

</details>

### 2.2 涉及文件

| 文件                                        | 角色                                                                                                                         |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `src/api/types/assessment.types.ts`       | 类型: `AssessmentCreate`, `Assessment`, `AssessmentQuestion`, `AssessmentSubmit`, `AssessmentSubmitItem`, `AssessmentResult` |
| `src/api/modules/assessment.api.ts`       | API: `createAssessment()`, `listAssessments()`, `submitAssessment()`, `getAssessmentResult()`                              |
| `src/stores/assessment.ts`                | Store: 测评状态与 action                                                                                                        |
| `src/views/Report.vue`                    | 页面: 测评报告                                                                                                                   |
| `src/mock/handlers/assessment.handler.ts` | Mock: 4 端点处理器                                                                                                              |

### 2.3 差异分析

#### 2.3.1 创建测评 (`POST /assessments`)

| 契约字段                             | 前端类型                               | 匹配   | 漂移描述   | 修复方案   |
| -------------------------------- | ---------------------------------- | ---- | ------ | ------ |
| `title`                          | `AssessmentCreate.title`           | \[ ] | <br /> | <br /> |
| `description` (?)                | `AssessmentCreate.description`     | \[ ] | <br /> | <br /> |
| `job_position_id` (integer?)     | `AssessmentCreate.job_position_id` | \[ ] | <br /> | <br /> |
| `questions` (QuestionCreate\[]?) | `AssessmentCreate.questions`       | \[ ] | <br /> | <br /> |

#### 2.3.2 测评列表 (`GET /assessments`)

| 契约字段                         | 前端类型   | 匹配   | 漂移描述   | 修复方案   |
| ---------------------------- | ------ | ---- | ------ | ------ |
| `questions_count` (integer?) | <br /> | \[ ] | <br /> | <br /> |

#### 2.3.3 提交测评 (`POST /assessments/submit`)

| 契约字段                                | 前端类型   | 匹配   | 漂移描述   | 修复方案   |
| ----------------------------------- | ------ | ---- | ------ | ------ |
| `answers` (AssessmentSubmitItem\[]) | <br /> | \[ ] | <br /> | <br /> |
| : 响应 `details` (object)             | <br /> | \[ ] | <br /> | <br /> |
| : 响应 `total_score` (number)         | <br /> | \[ ] | <br /> | <br /> |

#### 2.3.4 测评结果 (`GET /assessments/{assessment_id}/result`)

| 契约字段               | 前端类型   | 匹配   | 漂移描述   | 修复方案   |
| ------------------ | ------ | ---- | ------ | ------ |
| `details` (object) | <br /> | \[ ] | <br /> | <br /> |

### 2.4 修复任务检查清单

#### Task D-1: 类型文件更新 (`assessment.types.ts`)

- [ ] D-1.1 核对 `AssessmentCreate` 字段与 `POST /assessments` 一致
- [ ] D-1.2 核对 `Assessment` 列表项是否包含 `questions_count`
- [ ] D-1.3 核对 `AssessmentSubmit` 类型 (`assessment_id` + `answers`)
- [ ] D-1.4 核对 `AssessmentSubmitItem` 的子结构
- [ ] D-1.5 核对 `AssessmentResult` 包含 `details: object`
- [ ] D-1.6 核对 `QuestionCreate` / `Question` 类型定义（3 种题型）

#### Task D-2: API 函数更新 (`assessment.api.ts`)

- [ ] D-2.1 `createAssessment()` 参数签名对齐
- [ ] D-2.2 `listAssessments()` 支持分页参数
- [ ] D-2.3 `submitAssessment()` 参数/返回值签名对齐
- [ ] D-2.4 `getAssessmentResult()` 路径参数 `assessment_id`

#### Task D-3: Store 层适配

- [ ] D-3.1 `assessmentStore` 状态定义与类型一致
- [ ] D-3.2 提交测评后状态更新正确
- [ ] D-3.3 测评结果缓存逻辑正确

#### Task D-4: 视图组件适配

- [ ] D-4.1 [Report.vue](file:///d:/code/MianMianMaster/src/views/Report.vue) 去硬编码，接入 Store
- [ ] D-4.2 测评结果展示 `details` 对象数据

#### Task D-5: 联调验证

- [ ] D-5.1 `POST /assessments` — 创建测评
- [ ] D-5.2 `GET /assessments` — 测评列表分页
- [ ] D-5.3 `POST /assessments/submit` — 提交测评
- [ ] D-5.4 `GET /assessments/{id}/result` — 获取测评结果

***

## 三、模块 E: Learning (学习) — 14 端点

### 3.1 契约摘要

<details>
<summary>展开查看 Learning 模块完整契约</summary>

| #   | 端点                                                      | 方法   | 认证 | 关键字段                                                                                                                                                                                |
| --- | ------------------------------------------------------- | ---- | -- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| E1  | `/api/v1/learning/courses`                              | POST | 否  | 请求: `title`, `description`?, `level`?, `cover_url`? ⏐ 响应: 同上 + `id`, `created_at`, `updated_at`, `materials`?                                                                       |
| E2  | `/api/v1/learning/courses`                              | GET  | 否  | 查询: `skip`?, `limit`? ⏐ 响应数组: 同上                                                                                                                                                    |
| E3  | `/api/v1/learning/materials`                            | POST | 否  | 请求: `title`, `material_type`, `url`, `duration`?, `order_num`?, `knowledge_graph_id`?, `course_id` ⏐ 响应: 同上 + `id`, `course_id`, `created_at`                                       |
| E4  | `/api/v1/learning/progress/update`                      | POST | 是  | 查询: `course_id`, `material_id` ⏐ 请求: `progress_percent`, `is_completed`? ⏐ 响应: `progress_percent`, `is_completed`?, `id`, `user_id`, `course_id`, `material_id`, `last_accessed_at` |
| E5  | `/api/v1/learning/progress/{course_id}`                 | GET  | 是  | 路径: `course_id` ⏐ 响应数组: 同 E4 响应                                                                                                                                                     |
| E6  | `/api/v1/learning/collections`                          | POST | 是  | 请求: `title`, `description`?, `category`?, `difficulty`?, `question_ids`? ⏐ 响应: `id`, `user_id`, `title`, `description`?, `category`?, `difficulty`?, `questions`?, `created_at`     |
| E7  | `/api/v1/learning/collections`                          | GET  | 是  | 查询: `skip`?, `limit`? ⏐ 响应数组: 同上                                                                                                                                                    |
| E8  | `/api/v1/learning/wrong-questions`                      | POST | 是  | 请求: `question_id`, `wrong_answer` (any) ⏐ 响应: `id`, `user_id`, `question_id`, `wrong_answer`, `answer_count`, `is_mastered`, `last_answered_at`                                     |
| E9  | `/api/v1/learning/wrong-questions`                      | GET  | 是  | 查询: `skip`?, `limit`? ⏐ 响应数组: 同上                                                                                                                                                    |
| E10 | `/api/v1/learning/wrong-questions/{question_id}/master` | POST | 是  | 路径: `question_id` ⏐ 响应: 同 E8 响应                                                                                                                                                     |
| E11 | `/api/v1/learning/badges`                               | POST | 否  | 请求: `name`, `description`?, `icon_url`?, `condition_type`, `condition_value`? ⏐ 响应: 同上 + `id`, `created_at`                                                                         |
| E12 | `/api/v1/learning/badges`                               | GET  | 否  | 查询: `skip`?, `limit`? ⏐ 响应数组: 同上                                                                                                                                                    |
| E13 | `/api/v1/learning/badges/award/{badge_id}`              | POST | 是  | 路径: `badge_id` ⏐ 响应: `id`, `user_id`, `badge_id`, `awarded_at`, `tx_hash`?                                                                                                          |
| E14 | `/api/v1/learning/my-badges`                            | GET  | 是  | 响应数组: `id`, `user_id`, `badge_id`, `awarded_at`, `tx_hash`?                                                                                                                         |

</details>

### 3.2 涉及文件

| 文件                                      | 角色                                                                                                                                                                                                                    |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/api/types/learning.types.ts`       | 类型: `Course`, `CourseCreate`, `CourseMaterial`, `MaterialCreate`, `LearningProgress`, `ProgressUpdate`, `Collection`, `CollectionCreate`, `WrongQuestion`, `WrongQuestionCreate`, `Badge`, `BadgeCreate`, `UserBadge` |
| `src/api/modules/learning.api.ts`       | API: 14 个 API 函数 + `getPracticeBanks()`                                                                                                                                                                               |
| `src/stores/learning.ts`                | Store: 学习状态                                                                                                                                                                                                           |
| `src/stores/practice.ts`                | Store: 练习/题库状态                                                                                                                                                                                                        |
| `src/views/Practice.vue`                | 页面: 能力提升                                                                                                                                                                                                              |
| `src/views/PathPractice.vue`            | 页面: 学习路径练习                                                                                                                                                                                                            |
| `src/views/JobSpecificQuestionBank.vue` | 页面: 岗位题库                                                                                                                                                                                                              |

### 3.3 差异分析

#### 关键对比点

| 接口                        | 契约定义                             | 前端当前   | 匹配   | 漂移描述   |
| ------------------------- | -------------------------------- | ------ | ---- | ------ |
| `POST /courses`           | 请求含 `level`?, `cover_url`?       | <br /> | \[ ] | <br /> |
| `POST /courses`           | 响应含 `materials`?                 | <br /> | \[ ] | <br /> |
| `POST /materials`         | `course_id` 必填                   | <br /> | \[ ] | <br /> |
| `POST /materials`         | 含 `knowledge_graph_id`?          | <br /> | \[ ] | <br /> |
| `POST /progress/update`   | `course_id`, `material_id` 在查询参数 | <br /> | \[ ] | <br /> |
| `POST /progress/update`   | 响应含 `last_accessed_at`           | <br /> | \[ ] | <br /> |
| `POST /wrong-questions`   | `wrong_answer` 类型为 `any`         | <br /> | \[ ] | <br /> |
| `POST /collections`       | 含 `difficulty`?                  | <br /> | \[ ] | <br /> |
| `POST /badges`            | 必填 `condition_type`              | <br /> | \[ ] | <br /> |
| `POST /badges/award/{id}` | 响应含 `tx_hash`? (区块链)             | <br /> | \[ ] | <br /> |

### 3.4 修复任务检查清单

#### Task E-1: 类型文件更新 (`learning.types.ts`)

- [ ] E-1.1 核对 `Course` / `CourseCreate` 包含 `level`?, `cover_url`?, `materials`?
- [ ] E-1.2 核对 `MaterialCreate` 包含所有字段 (`knowledge_graph_id`? 等)
- [ ] E-1.3 核对 `ProgressUpdate` 请求参数 (`course_id`/`material_id` 作为查询参数)
- [ ] E-1.4 核对 `LearningProgress` 响应含 `last_accessed_at`
- [ ] E-1.5 核对 `WrongQuestionCreate` (`wrong_answer: any`)
- [ ] E-1.6 核对 `WrongQuestion` 响应 (`answer_count`, `is_mastered`, `last_answered_at`)
- [ ] E-1.7 核对 `Collection` / `CollectionCreate` 含 `difficulty`?
- [ ] E-1.8 核对 `Badge` / `BadgeCreate` (`condition_type` 必填)
- [ ] E-1.9 核对 `UserBadge` 含 `tx_hash`?

#### Task E-2: API 函数更新 (`learning.api.ts`)

- [ ] E-2.1 `createCourse()` / `getCourses()` 签名对齐
- [ ] E-2.2 `addMaterial()` 签名对齐
- [ ] E-2.3 `updateProgress()` 传参方式 (查询参数 vs 请求体)
- [ ] E-2.4 `getProgress()` 路径参数 `course_id`
- [ ] E-2.5 `createCollection()` / `getCollections()` 签名对齐
- [ ] E-2.6 `recordWrongQuestion()` / `getWrongQuestions()` 签名对齐
- [ ] E-2.7 `markWrongQuestionMastered()` 路径参数
- [ ] E-2.8 `createBadge()` / `getBadges()` 签名对齐
- [ ] E-2.9 `awardBadge()` 路径参数 + `tx_hash` 响应
- [ ] E-2.10 `getMyBadges()` 返回值签名对齐

#### Task E-3: Store 层适配

- [ ] E-3.1 `learningStore` 课程/收藏/错题状态对接 API
- [ ] E-3.2 `practiceStore` 使用 `getPracticeBanks()` 而非错误方法
- [ ] E-3.3 学习进度更新 action 正确
- [ ] E-3.4 徽章状态流转正确

#### Task E-4: 视图组件适配

- [ ] E-4.1 [Practice.vue](file:///d:/code/MianMianMaster/src/views/Practice.vue) 题库展示正确
- [ ] E-4.2 [PathPractice.vue](file:///d:/code/MianMianMaster/src/views/PathPractice.vue) 学习路径对接
- [ ] E-4.3 [JobSpecificQuestionBank.vue](file:///d:/code/MianMianMaster/src/views/JobSpecificQuestionBank.vue) 岗位题库对接
- [ ] E-4.4 错题本功能 (记录/查看/标记掌握)
- [ ] E-4.5 收藏集功能 (创建/查看)
- [ ] E-4.6 徽章展示 (列表/我的徽章)

#### Task E-5: 联调验证

- [ ] E-5.1 `POST/GET /learning/courses` — 课程创建与列表
- [ ] E-5.2 `POST /learning/materials` — 添加学习资料
- [ ] E-5.3 `POST /learning/progress/update` + `GET /progress/{id}` — 进度更新与查询
- [ ] E-5.4 `POST/GET /learning/collections` — 收藏集
- [ ] E-5.5 `POST/GET /learning/wrong-questions` + master — 错题闭环
- [ ] E-5.6 `POST/GET /learning/badges` + award + my-badges — 徽章全流程

***

## 四、模块 F: Interview (面试) — 11 端点

### 4.1 契约摘要

<details>
<summary>展开查看 Interview 模块完整契约</summary>

| #   | 端点                                               | 方法   | 认证 | 关键字段                                                                                                                                                                                                                                                                                                |
| --- | ------------------------------------------------ | ---- | -- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| F1  | `/api/v1/interview/sessions`                     | POST | 是  | 请求: `job_position_id`?, `strategy_id`?, `max_rounds`? ⏐ 响应: `id`, `candidate_id`, `config_id`?, `strategy_id`?, `status`, `current_round`?, `score`?, `summary`?, `start_time`?, `end_time`?, `created_at`, `conversation_turns`?                                                                   |
| F2  | `/api/v1/interview/sessions`                     | GET  | 是  | 查询: `status`?, `offset`?, `limit`? ⏐ 响应数组: `id`, `candidate_id`, `status`, `current_round`?, `score`?, `start_time`?, `end_time`?, `created_at`                                                                                                                                                     |
| F3  | `/api/v1/interview/sessions/{session_id}`        | GET  | 是  | 路径: `session_id` ⏐ 响应: 同 F1 响应 (含 `conversation_turns`?)                                                                                                                                                                                                                                            |
| F4  | `/api/v1/interview/sessions/{session_id}/start`  | POST | 是  | 响应: `session_id`, `opening_message`, `status`                                                                                                                                                                                                                                                       |
| F5  | `/api/v1/interview/sessions/{session_id}/chat`   | POST | 是  | 请求: `message` ⏐ 响应: SSE `text/event-stream`                                                                                                                                                                                                                                                         |
| F6  | `/api/v1/interview/sessions/{session_id}/end`    | POST | 是  | 响应: 同 F1 完整响应                                                                                                                                                                                                                                                                                       |
| F7  | `/api/v1/interview/sessions/{session_id}/cancel` | POST | 是  | 响应: 同 F1 完整响应                                                                                                                                                                                                                                                                                       |
| F8  | `/api/v1/interview/sessions/{session_id}/report` | GET  | 是  | 响应: `id`, `session_id`, `content_score`?, `depth_score`?, `logic_score`?, `match_score`?, `overall_score`?, `clarity_score`?, `confidence_score`?, `strength_areas`?, `weakness_areas`?, `improvement_plan`?, `offer_recommendation`?, `full_report_text`?, `status`?, `created_at`?, `updated_at`? |
| F9  | `/api/v1/interview/questions`                    | GET  | 是  | 查询: `skip`?, `limit`? ⏐ 响应数组: `id`, `content`, `question_type`, `difficulty`?                                                                                                                                                                                                                       |
| F10 | `/api/v1/interview/game/levels`                  | GET  | 是  | 响应数组: `id`, `name`, `description`?, `difficulty`, `is_unlocked`?, `questions_count`?                                                                                                                                                                                                                |
| F11 | `/api/v1/interview/game/stats`                   | GET  | 是  | 响应: `total_xp`?, `current_level`?, `completed_challenges`?, `accuracy_rate`?                                                                                                                                                                                                                        |
| F12 | `/api/v1/interview/game/achievements`            | GET  | 是  | 响应数组: `id`, `name`, `description`?, `icon_url`?, `is_unlocked`?, `unlocked_at`?                                                                                                                                                                                                                     |
| F13 | `/api/v1/interview/game/leaderboard`             | GET  | 否  | 查询: `skip`?, `limit`? ⏐ 响应数组: `rank`, `user_id`, `username`, `avatar_url`?, `score`                                                                                                                                                                                                                 |

> 注: 实际端点按 `api-contract-summary.md` 为 13 个 (含 game 子模块的 5 个端点)

</details>

### 4.2 涉及文件

| 文件                                       | 角色                                                                                                                                                                                                             |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/api/types/interview.types.ts`       | 类型: `InterviewSession`, `InterviewSessionCreate`, `InterviewStartResponse`, `ChatRequest`, `SseEvent`, `InterviewReport`, `InterviewQuestion`, `GameLevel`, `GameStats`, `GameAchievement`, `LeaderboardEntry` |
| `src/api/modules/interview.api.ts`       | API: 11 个 API 函数 + `chatSSE()` 流式                                                                                                                                                                              |
| `src/stores/interview.ts`                | Store: 会话管理 + SSE 流式对话                                                                                                                                                                                         |
| `src/views/Interview.vue`                | 页面: 面试会话                                                                                                                                                                                                       |
| `src/views/GameInterview.vue`            | 页面: 游戏化面试                                                                                                                                                                                                      |
| `src/mock/plugins/mock-sse-plugin.ts`    | Mock: SSE 流式 Vite 插件                                                                                                                                                                                           |
| `src/mock/handlers/interview.handler.ts` | Mock: 面试端点处理器                                                                                                                                                                                                  |

### 4.3 差异分析

#### 关键对比点

| 接口                          | 契约定义                                                  | 前端当前   | 匹配   | 漂移描述   |
| --------------------------- | ----------------------------------------------------- | ------ | ---- | ------ |
| `POST /sessions`            | 请求含 `job_position_id`?, `strategy_id`?, `max_rounds`? | <br /> | \[ ] | <br /> |
| `GET /sessions`             | 查询参数 `offset`? (非 `skip`)                             | <br /> | \[ ] | <br /> |
| `POST /sessions/{id}/start` | 响应含 `opening_message`                                 | <br /> | \[ ] | <br /> |
| `POST /sessions/{id}/chat`  | SSE `text/event-stream`                               | <br /> | \[ ] | <br /> |
| `GET /sessions/{id}/report` | 9 项评分子项 + `offer_recommendation`?                     | <br /> | \[ ] | <br /> |
| `GET /game/leaderboard`     | 认证: 否                                                 | <br /> | \[ ] | <br /> |
| `GET /game/levels`          | 响应含 `is_unlocked`?, `questions_count`?                | <br /> | \[ ] | <br /> |
| `GET /game/stats`           | 响应含 `total_xp`?, `accuracy_rate`?                     | <br /> | \[ ] | <br /> |

### 4.4 修复任务检查清单

#### Task F-1: 类型文件更新 (`interview.types.ts`)

- [ ] F-1.1 核对 `InterviewSessionCreate` 字段 (`job_position_id`, `strategy_id`, `max_rounds`)
- [ ] F-1.2 核对 `InterviewSession` 包含 `config_id`, `candidate_id`, `conversation_turns`
- [ ] F-1.3 核对 `InterviewStartResponse` 包含 `opening_message`
- [ ] F-1.4 核对 `ChatRequest` 仅含 `message`
- [ ] F-1.5 核对 `InterviewReport` 所有 9 个评分维度 + `offer_recommendation`
- [ ] F-1.6 核对 `InterviewQuestion` 字段 (`content`, `question_type`, `difficulty`)
- [ ] F-1.7 核对 `GameLevel` (`is_unlocked`?, `questions_count`?)
- [ ] F-1.8 核对 `GameStats` (`total_xp`?, `accuracy_rate`?)
- [ ] F-1.9 核对 `GameAchievement` (`is_unlocked`?, `unlocked_at`?)
- [ ] F-1.10 核对 `LeaderboardEntry` (`rank`, `username`, `avatar_url`?, `score`)

#### Task F-2: API 函数更新 (`interview.api.ts`)

- [ ] F-2.1 `createSession()` 参数含 `job_position_id`? / `strategy_id`? / `max_rounds`?
- [ ] F-2.2 `listSessions()` 使用 `offset` (非 `skip`) + `status` 筛选
- [ ] F-2.3 `getSession()` 路径参数 `session_id`
- [ ] F-2.4 `startInterview()` 返回 `InterviewStartResponse`
- [ ] F-2.5 `chatSSE()` SSE 流式解析正确
- [ ] F-2.6 `endInterview()` / `cancelInterview()` 签名对齐
- [ ] F-2.7 `getInterviewReport()` 路径参数 `session_id`
- [ ] F-2.8 `getQuestions()` 支持分页
- [ ] F-2.9 `getGameLevels()` / `getGameStats()` / `getGameAchievements()` / `getLeaderboard()` 签名对齐

#### Task F-3: Store 层适配

- [ ] F-3.1 `interviewStore` 会话状态定义与 API 一致
- [ ] F-3.2 SSE 流式对话 `sendChatMessage()` + `stopChat()` 正确
- [ ] F-3.3 `endInterview()` / `cancelInterview()` 自动中断 SSE
- [ ] F-3.4 面试报告状态正确缓存
- [ ] F-3.5 游戏化面试数据状态定义

#### Task F-4: 视图组件适配

- [ ] F-4.1 [Interview.vue](file:///d:/code/MianMianMaster/src/views/Interview.vue) 会话创建/列表展示正确
- [ ] F-4.2 SSE 流式对话 UI 实时渲染
- [ ] F-4.3 [GameInterview.vue](file:///d:/code/MianMianMaster/src/views/GameInterview.vue) 关卡/统计/成就/排行榜展示
- [ ] F-4.4 报告页 (`Report.vue`) 面试报告展示

#### Task F-5: 联调验证

- [ ] F-5.1 `POST /interview/sessions` — 创建会话
- [ ] F-5.2 `GET /interview/sessions` — 会话列表 (含 status 筛选)
- [ ] F-5.3 `GET /interview/sessions/{id}` — 会话详情
- [ ] F-5.4 `POST /interview/sessions/{id}/start` — 开始面试 (含 opening\_message)
- [ ] F-5.5 `POST /interview/sessions/{id}/chat` — SSE 流式对话 (Mock 模式下 token/done 事件)
- [ ] F-5.6 `POST /interview/sessions/{id}/end` — 结束面试
- [ ] F-5.7 `POST /interview/sessions/{id}/cancel` — 取消面试
- [ ] F-5.8 `GET /interview/sessions/{id}/report` — 面试报告
- [ ] F-5.9 `GET /interview/questions` — 题库
- [ ] F-5.10 游戏化面试: 关卡/统计/成就/排行榜

***

## 五、模块 G: Notification (通知) — 8 端点

### 5.1 契约摘要

<details>
<summary>展开查看 Notification 模块完整契约</summary>

| #  | 端点                                             | 方法   | 认证 | 关键字段                                                                                                                           |
| -- | ---------------------------------------------- | ---- | -- | ------------------------------------------------------------------------------------------------------------------------------ |
| G1 | `/api/v1/notifications`                        | GET  | 是  | 查询: `skip`?, `limit`? ⏐ 响应数组: `title`, `content`, `type` (NotificationType), `id`, `user_id`, `is_read`, `link`?, `created_at` |
| G2 | `/api/v1/notifications`                        | POST | 是  | 请求: `title`, `content`, `type`, `user_id`, `link`? ⏐ 响应: 同上 (单条)                                                               |
| G3 | `/api/v1/notifications/unread-count`           | GET  | 是  | 响应: `integer`                                                                                                                  |
| G4 | `/api/v1/notifications/{notification_id}/read` | PUT  | 是  | 路径: `notification_id` ⏐ 响应: 同 G1 响应 (单条)                                                                                       |
| G5 | `/api/v1/notifications/read-all`               | PUT  | 是  | 响应: `string`                                                                                                                   |
| G6 | `/api/v1/notifications/preferences`            | GET  | 是  | 响应: `interview_reminder`?, `community_interaction`?, `learning_reminder`?, `system_announcement`?                              |
| G7 | `/api/v1/notifications/preferences`            | PUT  | 是  | 请求/响应: 同 G6                                                                                                                    |
| G8 | `/api/v1/notifications/device-token`           | POST | 是  | 请求: `device_token`, `platform` ⏐ 响应: `string`                                                                                  |

</details>

### 5.2 涉及文件

| 文件                                          | 角色                                                                                                            |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `src/api/types/notification.types.ts`       | 类型: `Notification`, `NotificationCreate`, `NotificationType`, `NotificationPreferences`, `DeviceTokenRequest` |
| `src/api/modules/notification.api.ts`       | API: 8 个 API 函数                                                                                               |
| `src/stores/notification.ts`                | Store: 通知状态 (7 action)                                                                                        |
| `src/mock/handlers/notification.handler.ts` | Mock: 8 端点处理器                                                                                                 |

### 5.3 差异分析

| 契约字段                           | 前端类型   | 匹配   | 漂移描述   | 修复方案   |
| ------------------------------ | ------ | ---- | ------ | ------ |
| 通知列表 `link`?                   | <br /> | \[ ] | <br /> | <br /> |
| 通知列表 `type` (NotificationType) | <br /> | \[ ] | <br /> | <br /> |
| 创建通知: 请求含 `user_id`            | <br /> | \[ ] | <br /> | <br /> |
| `unread-count` 返回 `integer`    | <br /> | \[ ] | <br /> | <br /> |
| `device-token` 请求含 `platform`  | <br /> | \[ ] | <br /> | <br /> |
| 偏好: 4 个字段全可选                   | <br /> | \[ ] | <br /> | <br /> |

### 5.4 修复任务检查清单

#### Task G-1: 类型文件更新 (`notification.types.ts`)

- [ ] G-1.1 核对 `Notification` 类型字段 (`link`? 等)
- [ ] G-1.2 核对 `NotificationType` 枚举/联合类型
- [ ] G-1.3 核对 `NotificationCreate` 包含 `user_id`
- [ ] G-1.4 核对 `NotificationPreferences` 4 字段全可选
- [ ] G-1.5 核对 `DeviceTokenRequest` 含 `platform`

#### Task G-2: API 函数更新 (`notification.api.ts`)

- [ ] G-2.1 `getNotifications()` 支持分页
- [ ] G-2.2 `createNotification()` 参数含 `user_id`
- [ ] G-2.3 `getUnreadCount()` 返回 `number`
- [ ] G-2.4 `markAsRead()` 路径参数 `notification_id`
- [ ] G-2.5 `markAllAsRead()` 签名正确
- [ ] G-2.6 `getPreferences()` / `updatePreferences()` 签名对齐
- [ ] G-2.7 `registerDeviceToken()` 参数含 `platform`

#### Task G-3: Store 层适配

- [ ] G-3.1 `notificationStore` 未读计数状态实时更新
- [ ] G-3.2 标记已读/全部已读 action 正确
- [ ] G-3.3 偏好设置正确保存与回显

#### Task G-4: 联调验证

- [ ] G-4.1 `GET /notifications` — 通知列表分页
- [ ] G-4.2 `POST /notifications` — 创建通知
- [ ] G-4.3 `GET /notifications/unread-count` — 未读计数
- [ ] G-4.4 `PUT /notifications/{id}/read` — 标记已读
- [ ] G-4.5 `PUT /notifications/read-all` — 全部已读
- [ ] G-4.6 `GET/PUT /notifications/preferences` — 偏好读写
- [ ] G-4.7 `POST /notifications/device-token` — 设备推送注册

***

## 六、Week 2 进度跟踪

### 6.1 模块进度

| 模块           | 端点数 | 漂移点  | 类型   | API  | Store | 组件   | Mock | 联调   | 完成率 |
| ------------ | --- | ---- | ---- | ---- | ----- | ---- | ---- | ---- | --- |
| Assessment   | 4   | \[ ] | \[ ] | \[ ] | \[ ]  | \[ ] | \[ ] | \[ ] | 0%  |
| Learning     | 14  | \[ ] | \[ ] | \[ ] | \[ ]  | \[ ] | \[ ] | \[ ] | 0%  |
| Interview    | 13  | \[ ] | \[ ] | \[ ] | \[ ]  | \[ ] | \[ ] | \[ ] | 0%  |
| Notification | 8   | \[ ] | \[ ] | \[ ] | \[ ]  | \[ ] | \[ ] | \[ ] | 0%  |

### 6.2 任务进度

| 任务                     | 子项数 | 已完成 | 进度 | 负责人 | 计划完成 | 实际完成 | 状态 |
| ---------------------- | --- | --- | -- | --- | ---- | ---- | -- |
| Assessment: Diff 分析    | 9   | 0   | 0% | -   | -    | -    | 🔴 |
| Assessment: 类型更新       | 6   | 0   | 0% | -   | -    | -    | 🔴 |
| Assessment: API 更新     | 4   | 0   | 0% | -   | -    | -    | 🔴 |
| Assessment: Store 适配   | 3   | 0   | 0% | -   | -    | -    | 🔴 |
| Assessment: 组件适配       | 2   | 0   | 0% | -   | -    | -    | 🔴 |
| Assessment: 联调验证       | 4   | 0   | 0% | -   | -    | -    | 🔴 |
| Learning: Diff 分析      | 10  | 0   | 0% | -   | -    | -    | 🔴 |
| Learning: 类型更新         | 9   | 0   | 0% | -   | -    | -    | 🔴 |
| Learning: API 更新       | 10  | 0   | 0% | -   | -    | -    | 🔴 |
| Learning: Store 适配     | 4   | 0   | 0% | -   | -    | -    | 🔴 |
| Learning: 组件适配         | 6   | 0   | 0% | -   | -    | -    | 🔴 |
| Learning: 联调验证         | 6   | 0   | 0% | -   | -    | -    | 🔴 |
| Interview: Diff 分析     | 8   | 0   | 0% | -   | -    | -    | 🔴 |
| Interview: 类型更新        | 10  | 0   | 0% | -   | -    | -    | 🔴 |
| Interview: API 更新      | 9   | 0   | 0% | -   | -    | -    | 🔴 |
| Interview: Store 适配    | 5   | 0   | 0% | -   | -    | -    | 🔴 |
| Interview: 组件适配        | 4   | 0   | 0% | -   | -    | -    | 🔴 |
| Interview: 联调验证        | 10  | 0   | 0% | -   | -    | -    | 🔴 |
| Notification: Diff 分析  | 6   | 0   | 0% | -   | -    | -    | 🔴 |
| Notification: 类型更新     | 5   | 0   | 0% | -   | -    | -    | 🔴 |
| Notification: API 更新   | 7   | 0   | 0% | -   | -    | -    | 🔴 |
| Notification: Store 适配 | 3   | 0   | 0% | -   | -    | -    | 🔴 |
| Notification: 联调验证     | 7   | 0   | 0% | -   | -    | -    | 🔴 |

### 6.3 Week 2 质量门禁

- [ ] `vue-tsc --noEmit` 零错误
- [ ] `vite build` 构建成功
- [ ] Mock 模式: 测评/学习/面试/通知页面全部正常
- [ ] SSE 流式对话 Mock 验证通过 (token/done 事件)
- [ ] 浏览器验证: 测评 → 学习 → 面试 → 通知 业务流程闭环

***

## 七、风险与问题记录

### Week 2 特定风险

| #    | 风险                                   | 影响模块         | 对策                             | 状态   |
| ---- | ------------------------------------ | ------------ | ------------------------------ | ---- |
| W2-1 | SSE 流式对话为技术难点                        | Interview    | 已有 Vite SSE Mock 插件，优先 Mock 验证 | \[ ] |
| W2-2 | 面试报告 9 维评分结构复杂                       | Interview    | 仔细对齐每个字段的可选性                   | \[ ] |
| W2-3 | Learning 模块端点数量最多 (14)               | Learning     | 按子功能分批: 课程→进度→收藏→错题→徽章         | \[ ] |
| W2-4 | Game 子模块独立性强                         | Interview    | 与核心面试流程并行推进                    | \[ ] |
| W2-5 | Assessment 测评报告 `details` 为 `object` | Assessment   | 与后端确认具体结构                      | \[ ] |
| W2-6 | 通知偏好 4 字段均为可选                        | Notification | 确保前端正确处理全可选场景                  | \[ ] |

### Week 2 问题记录

| # | 日期 | 问题描述 | 影响模块 | 解决方案 | 状态 |
| - | -- | ---- | ---- | ---- | -- |
| - | -  | 暂无   | -    | -    | -  |

***

## 八、依赖关系

```
Week 1 完成 →
  Week 2 启动:
    ├── Assessment: 依赖 Auth (认证) + Job (岗位)
    ├── Learning: 依赖 Auth (认证)
    ├── Interview: 依赖 Auth + User + Job
    └── Notification: 依赖 Auth + User
```

***

## 九、变更记录

| 日期         | 变更               | 作者 |
| ---------- | ---------------- | -- |
| 2026-06-03 | 初始化 Week 2 子任务文档 | AI |

