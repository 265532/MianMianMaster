---
alwaysApply: false
description: Pinia Store 开发规范。包含 Store 结构定义、内部编码顺序、类型管理，以及 Store 重构变量重命名检查清单和模板空值防护等踩坑提炼的强制规则。
---
# 02 — Pinia Store 开发规范

> 适用范围：所有 `src/stores/` 目录下的 Pinia Store 模块开发与重构。

---

## 1. Store 结构规范

- **强制 Must**: 使用 Pinia Composition API 风格定义 Store（`defineStore('name', () => { ... })`），禁止使用 Options API 风格。
- **强制 Must**: Store 内部结构顺序：state（ref）→ getter（computed）→ action（function）。
- **强制 Must**: 接口/类型定义放在 Store 文件顶部或独立 `types/` 文件中。
- **推荐 Should**: 复杂异步操作封装在 action 中，包含 loading/error 状态管理。

**正例**:
```typescript
// stores/interview.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface InterviewSession {
  id: string
  job_title: string
  status: 'pending' | 'in_progress' | 'completed'
}

export const useInterviewStore = defineStore('interview', () => {
  // 状态
  const sessions = ref<InterviewSession[]>([])
  const currentSession = ref<InterviewSession | null>(null)
  const loading = ref(false)

  // 计算属性
  const activeSessions = computed(() =>
    sessions.value.filter(s => s.status === 'in_progress')
  )

  // 方法
  function startInterview(job_title: string): InterviewSession {
    const session: InterviewSession = {
      id: Date.now().toString(),
      job_title,
      status: 'in_progress'
    }
    sessions.value.push(session)
    currentSession.value = session
    return session
  }

  return { sessions, currentSession, loading, activeSessions, startInterview }
})
```

---

## 2. 🔴 Store 重构后强制检查项（踩坑提炼）

> **背景**: Phase 4 Store 层重构后，因模板中遗留旧变量名导致运行时崩溃（`savedQuestionBanks` → `collections`、`mistakeBook` → `wrongQuestions` 未同步替换）。

- **强制 Must**: Store 重构涉及变量重命名时，**必须**在所有 `.vue` 文件的 `<template>` 和 `<script>` 中全局搜索旧变量名，确认无遗留引用。
- **强制 Must**: Store 重构完成后，**必须**执行 `vue-tsc --noEmit` 类型检查和 `vite build` 生产构建，确保零错误。
- **强制 Must**: Store 重构完成后，**必须**在浏览器中实际访问所有受影响的页面，验证渲染无报错。
- **强制 Must**: 变量重命名时，应同步更新所有相关的计算属性、watch、事件处理函数中的引用。

**检查清单**:
```
Store 重构完成后的必做检查：
1. 全局搜索旧变量名 → 确认零匹配
2. vue-tsc --noEmit → 零错误
3. vite build → 构建成功
4. 浏览器访问受影响页面 → 无控制台报错
5. 检查 storeToRefs 解构是否完整覆盖模板中使用的所有变量
```

**正例**: 重构 `savedQuestionBanks` → `collections` 后，在 Profile.vue 模板中将所有 `savedQuestionBanks` 替换为 `collections`。
**反例**: 只在 `<script setup>` 中定义了新变量 `collections`，但 `<template>` 中仍引用 `savedQuestionBanks`，导致运行时 `undefined` 崩溃。

---

## 3. 🔴 Store 数据空值防护（踩坑提炼）

> **背景**: Store 中的 `gameInterviewData`、`resumeData` 等初始值为 `null`，模板直接访问 `.stats`、`.levels` 等属性会报错。

- **强制 Must**: 模板中访问 Store 的 nullable 数据时，**必须**使用可选链 `?.` 或提供默认值 `|| []`。
- **强制 Must**: Store 中初始值可能为 `null` 的响应式变量，在模板中使用前必须做空值判断。

**正例**: `v-for="item in (gameInterviewData?.stats || [])"`
**反例**: `v-for="item in gameInterviewData.stats"`

---

## 相关文档

- [01 — 核心架构与基础规范](./01-core-architecture.md)
- [03 — Vue 组件开发规范](./03-vue-component.md)
- [06 — AI 协作与交接规范](./06-ai-handover.md)