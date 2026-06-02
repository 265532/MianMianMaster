# Interview 模块联调任务清单

> **优先级**: P1 — 产品核心卖点  
> **后端前缀**: `/api/v1/interview`  
> **后端接口数量**: 8 个端点  
> **现有文件**: [interview.api.ts](file:///d:/code/MianMianMaster/src/api/modules/interview.api.ts) | [interview.types.ts](file:///d:/code/MianMianMaster/src/api/types/interview.types.ts) | [interview.handler.ts](file:///d:/code/MianMianMaster/src/mock/handlers/interview.handler.ts) | [interview Store](file:///d:/code/MianMianMaster/src/stores/interview.ts) | [Interview.vue](file:///d:/code/MianMianMaster/src/views/Interview.vue) | [GameInterview.vue](file:///d:/code/MianMianMaster/src/views/GameInterview.vue)

---

## 前置条件

- [ ] Auth + User 联调完成
- [ ] Job & Skill 联调完成（面试围绕岗位展开）
- [ ] Celery Worker 已启动（面试报告异步生成）
- [ ] LLM 配置就绪（SSE 流式对话依赖 LLM API）

---

## 差异分析

> ⚠️ **前端多出 5 个游戏化面试端点**（`/interview/questions`、`/game/levels`、`/game/stats`、`/game/achievements`、`/game/leaderboard`），这些不在后端 Phase 4 规范中。
> 联调时需降级处理或与后端确认排期。

---

## Task 1: 标准端点签名对齐

| # | 端点 | 方法 | 前端方法 | 限流 | 状态 |
|---|------|------|----------|------|------|
| 1.1 | `/interview/sessions` | POST | `interviewApi.createSession()` | - | [ ] |
| 1.2 | `/interview/sessions/{session_id}` | GET | `interviewApi.getSession()` | - | [ ] |
| 1.3 | `/interview/sessions` | GET | `interviewApi.getSessions()` | - | [ ] |
| 1.4 | `/interview/sessions/{session_id}/start` | POST | `interviewApi.startSession()` | 5/分钟 | [ ] |
| 1.5 | `/interview/sessions/{session_id}/chat` | POST (SSE) | `interviewApi.chatSSE()` | 5/分钟 | [ ] |
| 1.6 | `/interview/sessions/{session_id}/end` | POST | `interviewApi.endSession()` | - | [ ] |
| 1.7 | `/interview/sessions/{session_id}/cancel` | POST | `interviewApi.cancelSession()` | - | [ ] |
| 1.8 | `/interview/sessions/{session_id}/report` | GET | `interviewApi.getReport()` | - | [ ] |

---

## Task 2: 类型定义对齐

- [ ] 2.1 `InterviewSession` 与后端状态机对齐：`scheduled` → `in_progress` → `completed` / `cancelled`
- [ ] 2.2 `InterviewSessionCreate`：`job_id` / `max_rounds` 字段对齐
- [ ] 2.3 `InterviewReport` 类型与后端报告结构一致
- [ ] 2.4 `SseEvent` 事件类型：`token` / `done` / `error` / `round_limit`

---

## Task 3: 面试会话生命周期验证

- [ ] 3.1 **创建会话**: `POST /interview/sessions` → 传入 `job_id` + `max_rounds`
- [ ] 3.2 **获取会话**: `GET /interview/sessions/{session_id}` → 验证状态为 `scheduled`
- [ ] 3.3 **会话列表**: `GET /interview/sessions` → 支持 `status` 筛选 + `skip`/`limit` 分页
- [ ] 3.4 **开始面试**: `POST /sessions/{id}/start` → 返回开场白（LLM 生成）
- [ ] 3.5 **状态转换**: `scheduled` → `in_progress`（开始后）
- [ ] 3.6 **结束面试**: `POST /sessions/{id}/end` → 状态变为 `completed`
- [ ] 3.7 **取消面试**: `POST /sessions/{id}/cancel` → 状态变为 `cancelled`
- [ ] 3.8 **非法状态转换**: `completed` 状态下再次 `start` → 后端报错，前端提示

---

## Task 4: SSE 流式对话验证

> 这是联调中最复杂的部分，已在 [interview.api.ts:chatSSE()](file:///d:/code/MianMianMaster/src/api/modules/interview.api.ts#L60) 中使用 `fetch` + `ReadableStream` 实现。

- [ ] 4.1 **发送消息**: `POST /sessions/{id}/chat` → 验证 `Content-Type: text/event-stream`
- [ ] 4.2 **token 事件**: 接收逐字输出的 LLM Token → 前端逐字渲染
- [ ] 4.3 **done 事件**: 输出完成 → 前端停止渲染，更新对话历史
- [ ] 4.4 **error 事件**: 发生错误 → 前端显示错误提示
- [ ] 4.5 **round_limit 事件**: 达到轮次上限 → 前端提示"面试已结束"
- [ ] 4.6 **限流**: 5次/分钟超限 → 返回 429，前端友好提示
- [ ] 4.7 **中断**: 用户点击"停止"→ `AbortController.abort()` 取消流
- [ ] 4.8 **轮次控制**: `current_round` 递增，达到 `max_rounds` 后无法继续对话
- [ ] 4.9 **Token 传递**: SSE 请求中 Bearer Token 正确注入（非 Axios 请求，需手动处理）

---

## Task 5: 面试报告验证

- [ ] 5.1 **异步生成**: 面试结束后 Celery 异步生成报告
- [ ] 5.2 **轮询状态**: `GET /sessions/{id}/report` → `pending` → `generating` → `completed` / `failed`
- [ ] 5.3 **报告展示**: [Interview.vue](file:///d:/code/MianMianMaster/src/views/Interview.vue) 报告数据正确渲染
- [ ] 5.4 **报告失败**: 状态为 `failed` 时前端展示重试或错误提示

---

## Task 6: 前端页面验证

- [ ] 6.1 [Interview.vue](file:///d:/code/MianMianMaster/src/views/Interview.vue) 面试流程完整可用（创建→开始→对话→结束→报告）
- [ ] 6.2 [GameInterview.vue](file:///d:/code/MianMianMaster/src/views/GameInterview.vue) 使用 `interviewStore` 正确获取数据
- [ ] 6.3 [LevelChallenge.vue](file:///d:/code/MianMianMaster/src/views/LevelChallenge.vue) + [LevelDetail.vue](file:///d:/code/MianMianMaster/src/views/LevelDetail.vue) 关卡数据来自 Store
- [ ] 6.4 自动超时处理：超过 `INTERVIEW_TIMEOUT_MINUTES` 后自动结束（验证后端自动触发）

---

## Task 7: 游戏化端点降级处理

- [ ] 7.1 `getGameLevels()` → 降级为返回空数组或 Mock
- [ ] 7.2 `getGameStats()` → 降级为空对象
- [ ] 7.3 `getGameAchievements()` → 降级为空数组
- [ ] 7.4 `getLeaderboard()` → 降级为空数组
- [ ] 7.5 `getQuestions()` → 降级

---

## Task 8: 错误处理验证

- [ ] 8.1 SSE 连接断开 → 重连机制或友好提示
- [ ] 8.2 网络中断时 `fetch` → `AbortError` 处理
- [ ] 8.3 面试超时 → 后端自动结束，前端同步状态

---

## 依赖关系

```
Job & Skill → Interview
Interview → 无后续依赖
```