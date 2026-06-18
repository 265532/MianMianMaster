# Business 模块联调任务清单

> **优先级**: P3 — 管理后台专用  
> **后端前缀**: `/api/v1/business`  
> **后端接口数量**: 9 个端点  
> **现有文件**: [business.api.ts](file:///d:/code/MianMianMaster/src/api/modules/business.api.ts) | [business.types.ts](file:///d:/code/MianMianMaster/src/api/types/business.types.ts) | ⚠️ 无 Mock handler | ⚠️ 无独立 Store

---

## 前置条件

- [ ] Auth + Role 联调完成（Business 需要管理员权限 + 特定 RBAC scope）
- [ ] 管理员用户已创建并分配相应权限

---

## 差异分析

> ⚠️ **前端无 Mock handler 和 Store**，需在联调前补充 Mock 数据或直接对接真实后端。
> ⚠️ **无管理后台前端页面**，当前仅需验证 API 层可用性。

---

## Task 1: 端点签名对齐

| # | 端点 | 方法 | 权限 | 前端方法 | 状态 |
|---|------|------|------|----------|------|
| 1.1 | `/business/knowledge-graph` | GET | `knowledge_graph:read` | `businessApi.getKnowledgeGraphs()` | [ ] |
| 1.2 | `/business/knowledge-graph` | POST | `knowledge_graph:create` | `businessApi.createKnowledgeGraph()` | [ ] |
| 1.3 | `/business/ai-strategy` | GET | `ai_strategy:read` | `businessApi.getAiStrategies()` | [ ] |
| 1.4 | `/business/ai-strategy` | POST | `ai_strategy:create` | `businessApi.createAiStrategy()` | [ ] |
| 1.5 | `/business/interview-config` | GET | `interview_config:read` | `businessApi.getInterviewConfigs()` | [ ] |
| 1.6 | `/business/interview-config` | POST | `interview_config:create` | `businessApi.createInterviewConfig()` | [ ] |
| 1.7 | `/business/interview-session` | GET | `interview_session:read` | `businessApi.getInterviewSessions()` | [ ] |
| 1.8 | `/business/interview-session` | POST | `interview_session:create` | `businessApi.createInterviewSession()` | [ ] |
| 1.9 | `/business/agent-state` | GET | `agent_state:read` | `businessApi.getAgentStates()` | [ ] |

---

## Task 2: 类型定义对齐

- [ ] 2.1 `KnowledgeGraph` / `KnowledgeGraphCreate`（含 `parent_id` 树形层级）
- [ ] 2.2 `AiStrategy` / `AiStrategyCreate`（定义不同面试官性格的 System Prompt）
- [ ] 2.3 `InterviewConfig` / `InterviewConfigCreate`
- [ ] 2.4 `InterviewSession` / `InterviewSessionCreate`
- [ ] 2.5 `AgentState`

---

## Task 3: RBAC 权限验证

- [ ] 3.1 非管理员 Token → 调用 GET `/business/knowledge-graph` → 返回 403
- [ ] 3.2 管理员 Token 但无 `knowledge_graph:read` scope → 返回 403
- [ ] 3.3 管理员 Token + 正确 scope → 返回 200 + 数据
- [ ] 3.4 前端 [composables/useAuth.ts:requireAdmin()](file:///d:/code/MianMianMaster/src/composables/useAuth.ts) 是否正确拦截

---

## Task 4: Mock 数据补充

- [ ] 4.1 创建 `src/mock/data/business.mock.ts`
- [ ] 4.2 创建 `src/mock/handlers/business.handler.ts`，注册到 `adapter.ts` 和 `handlers/index.ts`
- [ ] 4.3 Mock 数据覆盖知识图谱（至少 3 层树形结构）、AI 策略（压力/温和/引导 3 种）、面试配置、Agent 状态

---

## Task 5: 接口可用性验证

- [ ] 5.1 用 Swagger UI 逐条验证 9 个端点可用
- [ ] 5.2 用 `curl` + Admin Token 验证响应结构符合类型定义

---

## 依赖关系

```
Auth + Role（权限系统）→ Business
Business → Knowledge.vue（知识图谱渲染）
```