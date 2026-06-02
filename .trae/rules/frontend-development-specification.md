---
alwaysApply: true
description: MianMianMaster 前端项目 AI 开发规约主索引。包含核心架构约束与代码风格精要，以及完整的子文档导航体系。
---
# MianMianMaster Frontend - AI 开发规约

> 本文档为项目规约体系的主入口。详细的领域规约已拆分为独立子文档，按需查阅。
> **最高准则**：当代码与任何外部认知发生冲突时，以 `src/` 目录下的实际代码为准。

---

## 核心约束（AI 必须始终遵守）

### 1. 分层架构

**强制 Must**: View → Store → API → HTTP 四层架构。View 层禁止直接调用 axios 或 HTTP 方法。

| 层级 | 职责 | 目录 |
|------|------|------|
| View | UI 展示与用户交互 | `src/views/`, `src/components/` |
| Store | 业务状态与副作用 | `src/stores/` |
| API | HTTP 请求封装 | `src/api/modules/` |
| HTTP | 请求/响应拦截 | `src/utils/http.ts` |

### 2. 技术栈

Vue 3 (`^3.5.25`) + TypeScript (`~5.9.3`, strict) + Pinia 3 (`^3.0.4`) + Vite 7 (`^7.3.1`) + Tailwind CSS 4 (`^4.2.1`)

### 3. 代码风格精要

- **SFC 顺序**: `<script setup lang="ts">` → `<template>` → `<style scoped>`
- **类型**: 所有 ref/函数参数/返回值必须显式标注类型；`any` 仅允许在 `catch` 子句；未知 Schema 用 `Record<string, unknown>` 过渡
- **导入**: 使用 `@/` 别名（`import { X } from '@/stores/x'`），禁止跨目录相对路径
- **Store**: 仅使用 Setup Store 语法（`defineStore('name', () => {...})`），禁止 Options Store
- **响应式**: View 层通过 `storeToRefs()` 解构 Store 状态

### 4. 冲突裁决

以 `src/` 目录下的实际代码为最高准则。AI 生成代码前应阅读同目录下至少 1~2 个现有文件。

---

## 规约文档体系

| 编号 | 文档 | 适用范围 | 说明 |
|------|------|----------|------|
| 01 | [核心架构与基础规范](./01-core-architecture.md) | 全局 | 分层架构、技术栈版本表、包管理、目录结构、代码风格、导入路径、环境变量、冲突策略 |
| 02 | [Pinia Store 开发规范](./02-pinia-store.md) | `src/stores/` | Store 结构顺序、重构检查清单、模板空值防护（🔴 踩坑） |
| 03 | [Vue 组件开发规范](./03-vue-component.md) | `src/views/`, `src/components/` | Props/Emits、样式色板、图标库、动画过渡、路由、ECharts 防御、表单 autocomplete（🔴 踩坑） |
| 04 | [API 与 Mock 开发规范](./04-api-and-mock.md) | `src/api/`, `src/mock/` | Mock 架构、API 类型定义、JWT 认证、SSE 流式响应、Mock 层级分工、后端对齐（🔴 踩坑） |
| 05 | [构建与质量管理规范](./05-build-and-quality.md) | 全局 | 构建验证流程、日志策略、性能优化、测试策略、Git 规范、CodeReview 门禁（🔴 踩坑） |
| 06 | [AI 协作与交接规范](./06-ai-handover.md) | AI 工作流 | 模块交接文档、踩坑记录索引、调试文档生成 |

---

## 快速参考

| 场景 | 查阅文档 |
|------|----------|
| 新建 Store 模块 | [02](./02-pinia-store.md) §1 |
| Store 重命名 | [02](./02-pinia-store.md) §2（🔴 强制检查清单） |
| 模板访问 Store 数据 | [02](./02-pinia-store.md) §3（🔴 空值防护） |
| 新建 Vue 组件 | [03](./03-vue-component.md) §1-3 |
| 使用图标 | [03](./03-vue-component.md) §3（仅 lucide-vue-next） |
| 使用主题色 | [03](./03-vue-component.md) §2（主题色板表） |
| 使用 ECharts | [03](./03-vue-component.md) §7（🔴 dispose + watch） |
| 新建路由 | [03](./03-vue-component.md) §5, [03](./03-vue-component.md) §6（🔴 v-if Component） |
| 新建 API 接口 | [04](./04-api-and-mock.md) §2（snake_case 对齐） |
| 添加 Mock 数据 | [04](./04-api-and-mock.md) §1, §5（层级分工） |
| 处理 SSE 流 | [04](./04-api-and-mock.md) §4（fetch + AbortController） |
| 调试日志 | [05](./05-build-and-quality.md) §2（VITE_ENABLE_DEBUG_LOG） |
| 提交代码前 | [05](./05-build-and-quality.md) §1（三步验证）, §6（门禁） |
| 完成模块开发后 | [06](./06-ai-handover.md) §1（生成交接文档） |