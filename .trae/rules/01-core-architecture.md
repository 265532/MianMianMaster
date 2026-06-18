---
alwaysApply: false
description: 前端项目核心架构与基础规范。包含分层架构约束、技术栈版本锁定、包管理策略、目录结构、代码风格、导入路径、环境变量配置及冲突裁决策略。
---
# 01 — 核心架构与基础规范

> 适用范围：所有前端代码开发。本文档定义项目最基础的架构约束、技术栈版本和代码风格，是其他所有规约的上位文档。

---

## 1. 架构约束

- **强制 Must**: 采用分层架构（View → Store → API → HTTP），禁止在 View 层直接调用 axios 或 HTTP 方法。
- **强制 Must**: View 层只负责 UI 展示和用户交互，业务逻辑放在 Store 或 Composable 中。
- **强制 Must**: API 层封装所有 HTTP 请求，Store 层通过调用 API 层方法获取数据。
- **强制 Must**: 状态管理统一使用 Pinia（Composition API 风格），禁止在组件内直接管理跨页面共享状态。
- **推荐 Should**: 复杂的可复用逻辑抽取为 Composable（`composables/*.ts`）。

**正例**: View 通过 `storeToRefs(learningStore)` 获取响应式数据，通过 `learningStore.fetchCollections()` 触发数据加载。
**反例**: 在 `<script setup>` 中直接 `axios.get('/api/v1/learning/collections')`。

---

## 2. 技术栈版本

- **强制 Must**: 严格锁定以下技术栈及版本：

| 类别 | 技术 | 版本 |
|------|------|------|
| 框架 | Vue 3 | `^3.5.25` |
| 路由 | Vue Router | `^4.6.4` |
| 状态管理 | Pinia | `^3.0.4` |
| 构建工具 | Vite | `^7.3.1` |
| 类型系统 | TypeScript | `~5.9.3` |
| 样式方案 | Tailwind CSS | `^4.2.1` |
| 图标库 | lucide-vue-next | `^0.575.0` |
| 图表库 | ECharts | `^6.0.0` |
| 图表库 | Chart.js | `^4.5.1` |
| HTTP 客户端 | Axios | `^1.16.0` |
| Mock 适配器 | axios-mock-adapter | 最新稳定版 |
| 包管理器 | pnpm | 最新稳定版 |
| 代码格式化 | ESLint + Prettier | 配套最新版 |

- **强制 Must**: `tsconfig` 必须启用 `strict: true`、`noUnusedLocals: true`、`noUnusedParameters: true`。

---

## 3. 包管理策略

- **强制 Must**: 使用 `pnpm` 作为包管理器，`package.json` 中锁定所有依赖版本为精确版本（使用 `^` 或 `~` 范围限定）。
- **强制 Must**: 生产依赖（`dependencies`）与开发依赖（`devDependencies`）严格分离，构建工具、类型声明、Linter 等归入 `devDependencies`。

**正例**: `"vue": "^3.5.25"`, `"typescript": "~5.9.3"`, `"@types/mockjs": "^1.0.10"` 归入 `devDependencies`
**反例**: 使用 `"vue": "latest"` 或将 Linter 放入 `dependencies`

---

## 4. 目录命名

- **强制 Must**: 必须遵守以下 `src` 目录结构：
  - `src/api/modules/`：API 服务层（按业务模块划分，如 `auth.api.ts`）
  - `src/api/types/`：API 类型定义（与后端 Schema 对齐）
  - `src/stores/`：Pinia Store（按业务域划分）
  - `src/composables/`：组合式函数
  - `src/mock/data/`：Mock 数据定义
  - `src/mock/handlers/`：Mock 请求处理器
  - `src/mock/plugins/`：Vite 中间件 Mock 插件（SSE/WebSocket 等）
  - `src/utils/`：工具函数（http、auth、error、storage 等）
  - `src/views/`：页面组件
  - `src/components/`：公共组件
  - `src/router/`：路由配置
  - `src/config/`：应用配置和常量
- **强制 Must**: 文件名使用 `kebab-case` 或 `dot-separated`（如 `auth.api.ts`、`user.mock.ts`），组件文件名使用 `PascalCase.vue`。

---

## 5. 代码风格

- **强制 Must**: 必须包含完整的 TypeScript 类型提示，函数参数、返回值、ref、computed 均需显式标注类型。
- **强制 Must**: `catch` 子句的 `any` 属于 TypeScript 语言限制，允许使用；`ref` 和函数参数禁止使用 `any`，必须定义具体类型；后端 Schema 未确定时可使用 `Record<string, unknown>` 过渡。
- **强制 Must**: Store 使用 Setup Store 语法（`defineStore('name', () => {...})`），不使用 Options Store。
- **强制 Must**: 单文件组件结构顺序为 `<script setup lang="ts">` → `<template>` → `<style scoped>`。
- **推荐 Should**: View 层通过 `storeToRefs()` 解构 Store 的响应式状态，避免丢失响应性。
- **推荐 Should**: 复杂模板表达式提取为 computed 或 method，保持模板简洁可读。

---

## 6. 导入路径规范

- **强制 Must**: 使用 `@/` 别名引用 `src/` 目录下的模块（由 `vite.config.ts` 中的 `resolve.alias` 配置）。
- **推荐 Should**: 同类模块内部可使用相对导入（如 Store 之间的引用），跨目录引用优先使用 `@/` 别名。

**正例**:
```typescript
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
```

**反例**:
```typescript
import { useUserStore } from '../../../stores/user'
```

---

## 7. 环境变量

- **强制 Must**: 所有环境配置通过 `VITE_` 前缀的环境变量管理，不得在代码中硬编码。
- **强制 Must**: 环境变量类型声明必须在 `src/vite-env.d.ts` 中补充。
- **强制 Must**: 环境变量文件按环境分离：`.env`（通用）、`.env.development`（开发）、`.env.staging`（预发布）、`.env.production`（生产）。
- **强制 Must**: 禁止在前端 `.env` 文件中存储任何密钥、Token 或敏感凭证。

**已定义的环境变量**:
```bash
# .env（通用 — 所有环境共享）
VITE_APP_VERSION=0.0.0
VITE_API_BASE_URL=/api/v1
VITE_API_TIMEOUT=15000

# .env.development
VITE_APP_TITLE=MianMianMaster Dev
VITE_USE_MOCK=true
VITE_MOCK_DELAY=300
VITE_ENABLE_DEBUG_LOG=true
VITE_PROXY_TARGET=http://localhost:8081

# .env.staging
VITE_APP_TITLE=面面俱到(Staging)
VITE_USE_MOCK=false
VITE_ENABLE_DEBUG_LOG=true
VITE_PROXY_TARGET=http://localhost:8081

# .env.production
VITE_APP_TITLE=面面俱到
VITE_USE_MOCK=false
VITE_ENABLE_DEBUG_LOG=false
VITE_CDN_URL=https://cdn.mianmianmaster.com
VITE_ENABLE_ERROR_MONITOR=true
```

---

## 8. 冲突裁决策略

- **强制 Must**: 遇到多源文档对同一主题描述不一致时，**永远以当前项目正在生效的最新代码（`src/` 目录下的实现）为最高准则**。
- **强制 Must**: 前后端字段名不一致时，API 类型定义以**后端 Schema** 为准，View 层展示可做映射。
- **强制 Must**: AI 助手生成代码前应阅读同目录下至少 1~2 个现有文件，把握当前代码模式后再输出。

**正例**: "根据现有 `src/stores/user.ts` 的模式，为您生成相同 Composition API 风格的 Store 代码。"
**反例**: 忽略现有代码用 Options API 的方式编写 Store。

---

## 相关文档

- [02 — Pinia Store 开发规范](./02-pinia-store.md)
- [03 — Vue 组件开发规范](./03-vue-component.md)
- [04 — API 与 Mock 开发规范](./04-api-and-mock.md)
- [05 — 构建与质量管理规范](./05-build-and-quality.md)
- [06 — AI 协作与交接规范](./06-ai-handover.md)