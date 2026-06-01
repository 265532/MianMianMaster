# API 基础设施联调 交接文档

**模块**: 前端 API 基础设施联调准备
**完成日期**: 2026-05-31
**关联文档**:
- 审查报告: [infrastructure-review-report.md](./infrastructure-review-report.md)
- 修复清单: [fix-checklist.md](./fix-checklist.md)
- 后端接口大纲: [frontend-api-integration-guide.md](./frontend-api-integration-guide.md)
- 前期交接: [docs/frontend-api/handover.md](../frontend-api/handover.md)

---

## 会话背景

本轮对话的核心任务是对前端项目做一次"手术式"联调基础设施审查与修复，确保前端代码具备与后端无缝对接的能力。审查覆盖了分层架构、HTTP 客户端、API 模块化、类型系统、Mock 体系、认证系统、Store 对接、环境变量、代理配置、SSE 流式对话等全部基础设施。

---

## 一、审查结论

**联调就绪度**: 从 85% 提升至 **95%+**

- 发现 5 个 P0 问题（全部修复）、5 个 P1 问题（全部修复）、5 个 P2 优化（3 完成、2 已基于后端接口清单确认并修复）、1 个额外发现（修正）+ 1 个重大增强（SSE）
- 累计修改/新建 **30+ 文件**

---

## 二、FIX 阶段完成的修复

### 🔴 P0 — 联调阻塞项（5/5 全部完成）

| # | 问题 | 文件 | 方案 |
|---|------|------|------|
| 1 | 缺少 Token 自动刷新 | `utils/http.ts`, `api/modules/auth.api.ts` | `isRefreshing` 锁 + `pendingRequests` 请求队列 + 401→`/auth/refresh`→重试 |
| 2 | `api/index.ts` 缺 3 个模块导出 | `api/index.ts`, `api/types/index.ts` | 补全 `interviewApi`/`notificationApi`/`systemApi` |
| 3 | 缺少 Notification Store | `stores/notification.ts`（新建） | 7 个 action 对接 `notificationApi` |
| 4 | 缺少 Notification/System Mock | 新建 4 文件 + `adapter.ts` 注册 | 通知 7 端点 + 系统 3 端点 Mock |
| 5 | `mock/handlers/index.ts` 导出不完整 | 补全导出 | 4 个 Handler + 2 个数据导出 |

### 🟡 P1 — 类型安全与语义（5/5 全部完成）

| # | 问题 | 文件 | 方案 |
|---|------|------|------|
| 6 | `user.api.ts` 5 个 `any` | `api/types/user.types.ts` + `user.api.ts` | 新增 14 个类型定义，Store 也改为从 types 导入 |
| 7 | `community.api.ts` 2 个 `any[]` | `community.types.ts` + `community.api.ts` | `HotTopic` + `ActiveUser` 提取到 types |
| 8 | `learning.api.ts` 3 个 `Record<string, any>` | `learning.types.ts` + `learning.api.ts` | 具体请求体类型 |
| 9 | `knowledge.store.ts` 无用状态 | `stores/knowledge.ts` | 移除 `categories`/`categoryDetails` |
| 10 | `practice.store.ts` 语义偏差 | `learning.api.ts` + `practice.ts` | 新增 `getPracticeBanks()` 方法 |

### 🟢 P2 — 优化与增强（3 完成 + 2 基于后端接口确认修复）

| # | 问题 | 方案 |
|---|------|------|
| 11 | `tsconfig.app.json` 重复配置 | 清理重复的 `baseUrl`/`paths` |
| 12 | 401 跳转丢失 redirect | `window.location.href` 携带 `redirect` 参数 |
| 13 | Assessment BASE_URL 不一致 | 基于后端接口清单确认：后端是 `/assessments`（复数），已修正 |
| 14 | WebSocket/SSE 代理 | 后端用 SSE 非 WebSocket，已添加 `timeout: 60000` |
| 15 | 生产环境 API 前缀 | 后端接口清单确认基础路径 `/api/v1`，`.env.production` 已显式声明 |

### 额外修复

| 发现 | 修复 |
|------|------|
| P2-13 回退：后端接口清单确认 Assessment 为复数 | `assessment.api.ts` 和 `assessment.handler.ts` 保持 `/assessments` |
| Interview API 全面对齐后端 8 端点 | 类型 (`snake_case`)、API 方法、Store 全部重构 |
| `interview.store.ts` 旧字段名清理 | `jobTitle`→`job_title`, `endTime`→`ended_at` 等 |

---

## 三、SSE 流式对话集成（本轮核心增强）

### 背景

后端面试模块 (`/interview/sessions/{id}/chat`) 使用 **SSE（Server-Sent Events）** 返回 `text/event-stream`，包含 `token`/`done`/`error`/`round_limit` 四种事件。前端需支持 `fetch` + `ReadableStream` 解析。

### 新建文件

| 文件 | 说明 |
|------|------|
| `src/mock/plugins/mock-sse-plugin.ts` | Vite 开发服务器中间件，拦截 SSE chat 请求并返回流式 Mock 响应 |
| `src/stores/__tests__/interview.test.ts` | Interview Store 集成测试（18 用例） |

### 关键设计

**SSE Mock 中间件** (`mock-sse-plugin.ts`):
- 在 Vite dev server 层用 `server.middlewares.use()` 拦截请求
- 匹配 `POST /api/v1/interview/sessions/:id/chat`
- 内置 4 套面试回复模板（default/vue/react/system），根据消息关键词匹配
- 逐字输出 `event: token` → `data: xxx`，80-200ms 随机延迟
- 终端同步输出 `[Mock SSE]` 日志
- 仅在 `VITE_USE_MOCK=true` 时注册到 Vite 插件

> **为什么不用 axios-mock-adapter？** `chatSSE()` 使用原生 `fetch()` 非 axios，`axios-mock-adapter` 无法拦截。Vite 中间件在 HTTP 层拦截，无论请求来源都能生效。

**SSE 解析逻辑** (`interview.api.ts` → `chatSSE()`):
- 使用 `fetch()` + `ReadableStream.getReader()` 接收流
- 按 SSE 协议解析 `event:` 和 `data:` 行
- 返回 `AbortController` 供调用方中断连接
- 全部日志通过 `VITE_ENABLE_DEBUG_LOG` 控制

**Store 层 SSE 封装** (`stores/interview.ts`):
- `sendChatMessage(sessionId, message, onEvent, onError)` → 自动创建/中断 SSE 连接
- `stopChat()` → 中断当前 SSE 连接
- `endInterview()` / `cancelInterview()` → 自动中断 SSE 再调 API
- 每条 action 都有 `[InterviewStore]` 前缀 debug log

### Logger 规范

```typescript
// API 层：模块前缀 + 操作名 + 参数/结果
const DEBUG = import.meta.env.VITE_ENABLE_DEBUG_LOG === "true";
function log(...args: unknown[]): void {
  if (DEBUG) console.debug("[InterviewAPI]", ...args);
}

// SSE 流关键日志节点：
// - 请求发起 (url, sessionId, message)
// - HTTP 响应 (status, content-type)
// - 流启动 (starting stream read loop)
// - 每个 chunk 原始字节 (JSON.stringify)
// - 每个 event 解析结果 (type, data)
// - 无法识别的行格式
// - 流结束 (total events) + buffer 残留
// - 异常/中止
```

### E2E 测试结果

| 测试项 | 结果 |
|--------|------|
| 默认对话流（自我介? | 7 tokens + Done 事件 ✅ |
| Vue 关键词匹配 | 跳转 Vue 问答模板 ✅ |
| Content-Type | `text/event-stream` ✅ |
| `vue-tsc --noEmit` | 零错误 ✅ |
| `vite build` | 构建成功 ✅ |
| `vitest` (interview.test.ts) | 18/18 通过 ✅ |

### 测试覆盖总览

| 测试文件 | 用例数 | 覆盖 |
|----------|--------|------|
| `stores/__tests__/interview.test.ts` | 18 | 创建/启动/SSE 对话/中止/结束/取消/报告/全流程 |

**总计**: 工具测试 45 + Store 集成测试 33 + Interview 测试 18 = **96 个测试**

---

## 四、修改文件清单

### 本轮新增文件

| 文件 | 说明 |
|------|------|
| `src/stores/notification.ts` | Notification Store（7 action） |
| `src/mock/data/notification.mock.ts` | 通知 Mock 数据 |
| `src/mock/data/system.mock.ts` | 系统 Mock 数据 |
| `src/mock/handlers/notification.handler.ts` | 通知 Mock Handler |
| `src/mock/handlers/system.handler.ts` | 系统 Mock Handler |
| `src/mock/plugins/mock-sse-plugin.ts` | SSE Mock Vite 插件 |
| `src/stores/__tests__/interview.test.ts` | Interview 集成测试 |

### 本轮修改文件

| 文件 | 改动内容 |
|------|---------|
| `src/utils/http.ts` | Token 自动刷新 + 请求队列 + 401 redirect |
| `src/api/modules/auth.api.ts` | 新增 `refreshToken()` |
| `src/api/index.ts` | 补充 3 个模块导出 |
| `src/api/types/index.ts` | 补充 3 个类型导出 |
| `src/api/modules/user.api.ts` | 5 个 `any` → 具体类型 |
| `src/api/modules/community.api.ts` | 2 个 `any[]` → 具体类型 |
| `src/api/modules/learning.api.ts` | 3 个 `Record<string, any>` → 具体类型 + `getPracticeBanks()` |
| `src/api/modules/assessment.api.ts` | `BASE_URL` 保持 `/assessments`（后端确认） |
| `src/api/modules/interview.api.ts` | 对齐后端 8 端点 + SSE `chatSSE()` + 完整 logger |
| `src/api/types/user.types.ts` | 新增 14 个类型定义 |
| `src/api/types/community.types.ts` | 新增 `HotTopic`/`ActiveUser` |
| `src/api/types/learning.types.ts` | 新增 3 个请求体类型 |
| `src/api/types/interview.types.ts` | 新增 `InterviewSessionCreate`/`InterviewReport`/`SseEvent`，字段 `snake_case` |
| `src/stores/user.ts` | 移除重复类型定义，改为从 types 导入 |
| `src/stores/community.ts` | 同上 |
| `src/stores/knowledge.ts` | 移除无用状态 |
| `src/stores/practice.ts` | 改用 `getPracticeBanks()` |
| `src/stores/interview.ts` | 对齐后端 API + SSE 方法 + 完整 logger |
| `src/mock/data/interview.mock.ts` | 新增 `mockInterviewSessions` + `mockInterviewReport` |
| `src/mock/handlers/interview.handler.ts` | 对齐后端 8 端点 + 报告 |
| `src/mock/handlers/assessment.handler.ts` | 路径保持 `/assessments` |
| `src/mock/handlers/index.ts` | 补充 4 个 Handler 导出 |
| `src/mock/data/index.ts` | 补充 2 个数据导出 |
| `src/mock/adapter.ts` | 注册 Notification/System Handler |
| `vite.config.ts` | 注册 SSE Mock 插件 + 代理 timeout |
| `tsconfig.app.json` | 清理重复配置 |
| `.env.production` | 显式声明 `VITE_API_BASE_URL=/api/v1` |

---

## 五、关键技术决策

### 1. Token 刷新采用请求队列

```typescript
// 多请求同时触发 401 → 只有第一个触发刷新，其余排队等待
let isRefreshing = false;
const pendingRequests: Array<(token: string) => void> = [];

// 刷新成功后批量重放队列中的请求
pendingRequests.forEach(cb => cb(newToken));
```

### 2. SSE 使用原生 fetch 而非 EventSource

`EventSource` 不支持 POST 请求，且不支持自定义 Authorization 头。因此使用 `fetch()` + `ReadableStream` 手写 SSE 协议解析。

### 3. Mock 双层架构

```
axios 请求 → axios-mock-adapter（业务 API Mock）
fetch 请求 → Vite 中间件插件（SSE 流 Mock）
```

### 4. 字段命名：与后端严格一致的 snake_case

```typescript
// 错误（前端习惯的 camelCase）
interface InterviewSession {
  jobTitle: string;
  maxRounds: number;
  currentRound: number;
}

// 正确（与后端一致的 snake_case）
interface InterviewSession {
  job_title: string;
  max_rounds: number;
  current_round: number;
}
```

### 5. Logger 两层封装

- API 层（`[InterviewAPI]`）：记录 HTTP 请求/响应/SSE 流解析过程
- Store 层（`[InterviewStore]`）：记录业务操作和状态变更
- 全部通过 `VITE_ENABLE_DEBUG_LOG` 开关控制

---

## 六、踩坑记录

### 踩坑1: axios-mock-adapter 无法拦截 SSE 流

**问题**: `chatSSE()` 使用 `fetch()` 而非 axios，Mock adapter 不生效。
**解决**: 创建 Vite 中间件插件在 HTTP 层拦截。
**规约更新**: 已写入开发规约 §17

### 踩坑2: Assessment BASE_URL 误改为单数

**问题**: P2-13 盲目将 `/assessments` 改为 `/assessment`，未核对后端。
**解决**: 基于后端接口清单确认后端使用复数，回退修改。
**教训**: 任何与后端相关的配置变更必须以**后端实际代码/文档**为依据。

### 踩坑3: PowerShell 内联脚本的编码问题

**问题**: SSE E2E 测试脚本中含中文导致 PowerShell 编码错误。
**解决**: 改用 `.ps1` 脚本文件 + 纯英文测试消息。

---

## 七、验证方法

### 快速验证 SSE

```bash
# 启动 Mock 模式
pnpm dev

# 用 curl 测试 SSE（另开终端?
curl -N -X POST http://localhost:9000/api/v1/interview/sessions/test/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"hello"}'
```

### 完整验证流程

```bash
vue-tsc --noEmit          # TypeScript 零错误
vite build                # 构建成功
vitest run                # 96 测试全部通过
# 浏览器逐页验证：首页 / 面试 / 能力提升 / 社区 / 知识库 / 个人中心
```

---

## 八、未完成事项

| 事项 | 优先级 | 阻塞原因 |
|------|--------|---------|
| Growth.vue 接入 Store | 🟡 P1 | 图表数据结构复杂，需设计 API |
| Matching.vue 接入 Store | 🟡 P1 | 岗位匹配需 Job Store 完善 |
| LevelChallenge.vue 接入 Store | 🟡 P1 | 关卡数据需设计 API |
| Report.vue 完全去硬编码 | 🟢 P2 | 报告页数据依赖 assessmentStore |
| Home.vue 完全去硬编码 | 🟢 P2 | 主页功能卡片/评价等需要配置 API |
| Nginx 反向代理配置 | 🟢 P2 | 需运维配合 |

---

## 九、下一步开发建议

### 🔴 联调期（优先）

1. **后端服务就绪后**：设置 `VITE_USE_MOCK=false`，验证 Vite Proxy 代理正常工作
2. **逐模块联调**：Auth → User → Job → Assessment → Learning → Interview → Community → 管理后台
3. **SSE 真实联调**：接入真实 LLM 后验证 `chatSSE()` 的 `token`/`done`/`error`/`round_limit` 事件处理

### 🟡 短期（联调完成后）

4. **补完 View 层 Store 对接**：Growth.vue / Matching.vue / LevelChallenge.vue
5. **E2E 测试**：基于 Playwright 编写关键用户流程测试
6. **WebSocket 接入**：如果后端后续提供实时通知/对话推送

### 🟢 长期（迭代优化）

7. **API 指标面板**：利用 `getApiMetrics()` 构建开发环境 API 性能监控
8. **Token 续期优化**：提前 N 分钟主动刷新 Token（而非等 401）
9. **离线缓存**：Service Worker 缓存关键数据

---

## 十、文档索引

| 文档 | 路径 |
|------|------|
| 基础设施审查报告 | `docs/api/infrastructure-review-report.md` |
| 修复任务清单 | `docs/api/fix-checklist.md` |
| 后端对接接口大纲 | `docs/api/frontend-api-integration-guide.md` |
| 前端开发规约 | `.trae/rules/frontend-development-specification.md` |
| 前期交接文档 | `docs/frontend-api/handover.md` |
| 渲染报错 Debug | `docs/debug/2026-05-10-frontend-render-errors-and-warnings.md` |
| AI Vibecoding 规约审查 | `docs/ai-vibecoding-specification-review.md` |