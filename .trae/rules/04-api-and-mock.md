---
alwaysApply: false
description: API 与 Mock 开发规范。包含 Mock 数据架构、API 类型定义（snake_case 对齐）、JWT 认证系统、SSE 流式响应处理、Mock 层级分工（axios-mock-adapter vs Vite 中间件）以及后端 API 字段对齐等踩坑提炼的强制规则。
---
# 04 — API 与 Mock 开发规范

> 适用范围：`src/api/`、`src/mock/` 目录下的 API 服务层与 Mock 数据层开发。

---

## 1. Mock 数据架构

- **强制 Must**: Mock 数据结构与后端 API 响应格式完全一致（`ResponseModel<T>` 格式）。
- **强制 Must**: Mock 处理器使用 `success<T>()` 辅助函数返回统一格式响应。
- **强制 Must**: Mock 适配器设置 `onNoMatch: 'passthrough'`，未匹配的请求自动转发到真实后端。
- **强制 Must**: 通过 `VITE_USE_MOCK` 环境变量控制 Mock 启用/禁用，业务代码中不得出现 Mock 相关的条件判断。
- **推荐 Should**: 从 View 文件提取硬编码数据到 Mock 文件时，保留原始数据结构和字段名。

---

## 2. API 类型定义

- **强制 Must**: 前端 API 类型定义**必须**与后端 Pydantic Schema 保持一致，字段名使用 `snake_case`（与后端一致）。
- **强制 Must**: API 服务层方法的返回类型**必须**明确声明，禁止省略或使用 `any`。
- **强制 Must**: 类型导入路径必须正确，不得从错误的 types 文件中导入（如 `UserResponse` 应从 `user.types` 导入，不从 `auth.types` 导入）。

---

## 3. 认证系统

- **强制 Must**: JWT Token 存储在 localStorage 中，通过 `utils/auth.ts` 统一管理。
- **强制 Must**: 所有需要认证的 API 请求自动注入 `Authorization: Bearer <token>` 头（通过 axios 拦截器）。
- **强制 Must**: 401 响应自动清除 Token 并跳转登录页。
- **强制 Must**: 路由守卫检查 Token 存在性，未登录访问受保护页面时跳转登录页并携带 `redirect` 参数。

---

## 4. 🔴 SSE 流式响应（踩坑提炼）

> **背景**: 后端面试模块 `/interview/sessions/{id}/chat` 使用 SSE 返回 `text/event-stream`，前端 `chatSSE()` 使用 `fetch()` 而非 axios，`axios-mock-adapter` 无法拦截。

- **强制 Must**: SSE 流式响应的 Mock **必须**使用 Vite 中间件插件（`mock/plugins/`）在 HTTP 层拦截，**禁止**使用 `axios-mock-adapter` 模拟。
- **强制 Must**: SSE 解析使用 `fetch()` + `ReadableStream.getReader()`，**禁止**使用 `EventSource`（不支持 POST + 自定义 Header）。
- **强制 Must**: SSE 连接必须返回 `AbortController`，供调用方中断旧连接后发起新请求。
- **强制 Must**: SSE 流解析日志必须记录：HTTP 状态/content-type → 流启动 → 每个 raw chunk → 每个 event 解析 → 流结束/异常。全部通过 `VITE_ENABLE_DEBUG_LOG` 控制。
- **强制 Must**: 组件 `onUnmounted` 时必须 `stopChat()` 中断 SSE 连接。

**SSE Mock 中间件标准模式**:
```typescript
// src/mock/plugins/mock-sse-plugin.ts
import type { Plugin } from "vite";

export function mockSsePlugin(): Plugin {
  return {
    name: "mock-sse-server",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // 匹配 SSE endpoint
        if (req.url?.match(/sse-pattern/) && req.method === "POST") {
          // 读取请求体
          // 设置 SSE headers
          res.writeHead(200, {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
          });
          // 逐条发送 event: xxx\ndata: yyy\n\n
          // 最后 res.end()
          return;
        }
        next();
      });
    },
  };
}
```

**SSE API 层标准模式**:
```typescript
chatSSE(sessionId: string, message: string,
  onEvent: (e: SseEvent) => void,
  onError?: (e: Error) => void
): AbortController {
  const controller = new AbortController();
  fetch(`${baseURL}/sessions/${sessionId}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ message }),
    signal: controller.signal,
  }).then(async (response) => {
    const reader = response.body?.getReader();
    // SSE 协议解析循环：event: xxx → data: yyy
  }).catch(err => {
    if (err.name !== "AbortError") onError?.(err);
  });
  return controller;
}
```

---

## 5. 🔴 Mock 层级分工（踩坑提炼）

> **背景**: `axios-mock-adapter` 无法拦截 `fetch()` 请求，SSE 流式 Mock 需用 Vite 中间件。

- **强制 Must**: Mock 体系分为两层：
  - **axios 请求** → `axios-mock-adapter`（`mock/handlers/`）
  - **fetch/SSE/WebSocket 请求** → Vite 中间件插件（`mock/plugins/`）
- **强制 Must**: Vite 中间件插件必须在 `vite.config.ts` 的 `plugins` 中注册，并通过 `VITE_USE_MOCK` 条件启用。
- **强制 Must**: 新增强制 HTTP 层的 Mock 需求时，先评估是 `axios-mock-adapter` 可拦截还是需要 Vite 中间件。

---

## 6. 🔴 后端 API 对齐规范（踩坑提炼）

> **背景**: P2-13 盲目将 Assessment BASE_URL 改为单数 `/assessment`，实际后端使用复数 `/assessments`。Interview Session 字段使用 camelCase（`jobTitle`），后端使用 snake_case（`job_title`）。

- **强制 Must**: 前后端字段命名的唯一权威来源是**后端代码/Schema/接口文档**（本项目中为 `docs/api/frontend-api-integration-guide.md`）。禁止凭猜测或"风格一致"来修改。
- **强制 Must**: API 类型定义（`src/api/types/`）字段名**必须**与后端 snake_case 严格一致。
- **强制 Must**: 修改 `BASE_URL` 或端点路径前，**必须**与后端文档核对后端的实际路由前缀。
- **推荐 Should**: 在 `docs/api/` 目录维护一份后端接口清单，作为联调时的字段对齐参考。

---

## 相关文档

- [01 — 核心架构与基础规范](./01-core-architecture.md)
- [03 — Vue 组件开发规范](./03-vue-component.md)
- [05 — 构建与质量管理规范](./05-build-and-quality.md)