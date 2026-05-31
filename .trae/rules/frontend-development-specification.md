---
alwaysApply: true
description: 前端项目面向 AI 代码助手的统一开发规约。包含架构约束、技术栈选型、代码风格、Store重构规范、组件开发规范等核心规则，以及从实际踩坑中提炼的强制检查项。
---
# MianMianMaster Frontend - AI 开发规约

> 本文档为 MianMianMaster 前端项目面向 AI 代码助手的统一开发规约。如有冲突，以此文件为准。
> 本文档从实际开发踩坑中持续迭代，**红色标记的条目均为真实踩坑产生的强制规则**。

## 1. 架构约束

- **强制 Must**: 采用分层架构（View → Store → API → HTTP），禁止在 View 层直接调用 axios 或 HTTP 方法。
- **强制 Must**: View 层只负责 UI 展示和用户交互，业务逻辑放在 Store 或 Composable 中。
- **强制 Must**: API 层封装所有 HTTP 请求，Store 层通过调用 API 层方法获取数据。
- **推荐 Should**: 复杂的可复用逻辑抽取为 Composable（`composables/*.ts`）。

**正例**: View 通过 `storeToRefs(learningStore)` 获取响应式数据，通过 `learningStore.fetchCollections()` 触发数据加载。
**反例**: 在 `<script setup>` 中直接 `axios.get('/api/v1/learning/collections')`。

## 2. 技术栈版本

- **强制 Must**:
  - Vue 3.5+ (Composition API + `<script setup>`)
  - TypeScript 5.x (strict 模式)
  - Pinia 3.x (Setup Store 语法 `defineStore('name', () => {...})`)
  - Vite 7.x
  - Axios (HTTP 客户端)
  - axios-mock-adapter (Mock 适配器)
  - TailwindCSS 4.x

## 3. 目录命名

- **强制 Must**: 必须遵守以下 `src` 目录结构：
  - `src/api/modules/`：API 服务层（按业务模块划分，如 `auth.api.ts`）
  - `src/api/types/`：API 类型定义（与后端 Schema 对齐）
  - `src/stores/`：Pinia Store（按业务域划分）
  - `src/composables/`：组合式函数
  - `src/mock/data/`：Mock 数据定义
  - `src/mock/handlers/`：Mock 请求处理器
  - `src/utils/`：工具函数（http、auth、error、storage 等）
  - `src/views/`：页面组件
  - `src/components/`：公共组件
  - `src/router/`：路由配置
  - `src/config/`：应用配置和常量
- **强制 Must**: 文件名使用 `kebab-case` 或 `dot-separated`（如 `auth.api.ts`、`user.mock.ts`），组件文件名使用 `PascalCase.vue`。

## 4. 代码风格

- **强制 Must**: 必须包含完整的 TypeScript 类型提示，禁止使用 `any`（除非有充分理由并添加注释说明）。
- **强制 Must**: 使用 `@/` 路径别名导入，禁止使用相对路径跨目录导入。
- **强制 Must**: Store 使用 Setup Store 语法（`defineStore('name', () => {...})`），不使用 Options Store。
- **推荐 Should**: View 层通过 `storeToRefs()` 解构 Store 的响应式状态，避免丢失响应性。

## 5. 🔴 Store 重构后强制检查项（踩坑提炼）

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

## 6. 🔴 ECharts 与条件渲染（踩坑提炼）

> **背景**: Growth.vue 的 ECharts 图表容器在 `v-if` 条件渲染内，切换 Tab 后图表 DOM 被销毁再重建，但 ECharts 实例未重新初始化，导致 `cartesian2d cannot be found` 错误。Profile.vue 的 `initChart()` 多次调用 `echarts.init()` 但未先 `dispose()` 已有实例，导致 `There is a chart instance already initialized on the dom` 警告重复触发。

- **强制 Must**: 所有 `echarts.init()` 调用前，**必须**先检查并 `dispose()` 已有实例，无论是否使用 `v-if` 条件渲染。
- **强制 Must**: 当 ECharts 图表容器使用 `v-if` 条件渲染时，**必须**配合 `watch` 监听条件变化，在条件变为 `true` 时通过 `nextTick` 重新初始化图表。
- **强制 Must**: 组件 `onUnmounted` 时，**必须**调用 `dispose()` 销毁所有 ECharts 实例并移除 resize 监听。
- **推荐 Should**: 如果图表不需要频繁销毁重建，优先使用 `v-show`（仅隐藏 DOM，不销毁）替代 `v-if`。

**ECharts + v-if 标准模式**:
```typescript
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import * as echarts from 'echarts'

const activeTab = ref('growth')
const chartRef = ref<HTMLElement>()
const chartInstance = ref<echarts.ECharts>()

const initChart = () => {
  if (!chartRef.value) return
  if (chartInstance.value) {
    chartInstance.value.dispose()
  }
  chartInstance.value = echarts.init(chartRef.value)
  chartInstance.value.setOption({ /* ... */ })
}

watch(activeTab, (newTab) => {
  if (newTab === 'growth') {
    nextTick(() => initChart())
  }
})

onMounted(() => {
  if (activeTab.value === 'growth') {
    nextTick(() => initChart())
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance.value?.dispose()
  chartInstance.value = null
})
```

## 7. 🔴 Router-view 防御性编程（踩坑提炼）

> **背景**: App.vue 使用 `<router-view v-slot="{ Component }">` + `<component :is="Component" />` 模式，当子组件渲染崩溃时 Vue 将 Component 设为 null，导致级联错误。

- **强制 Must**: 使用 `<router-view>` 的 scoped slot 模式时，**必须**对 `Component` 添加 `v-if` 防御性检查。

**正例**:
```html
<router-view v-slot="{ Component }">
  <component :is="Component" v-if="Component" />
</router-view>
```

**反例**:
```html
<router-view v-slot="{ Component }">
  <component :is="Component" />
</router-view>
```

## 8. 🔴 表单 autocomplete 属性（踩坑提炼）

> **背景**: LoginForm.vue 的密码输入框缺少 `autocomplete` 属性，Chrome 浏览器持续发出 DOM 警告。

- **强制 Must**: 所有涉及密码的 `<input>` 元素**必须**添加 `autocomplete` 属性：
  - 登录表单：`autocomplete="current-password"`
  - 注册表单：`autocomplete="new-password"`
  - 用户名输入：`autocomplete="username"`
- **推荐 Should**: 所有表单输入元素均应添加合适的 `autocomplete` 属性，提升浏览器自动填充体验。

## 9. Mock 数据架构

- **强制 Must**: Mock 数据结构与后端 API 响应格式完全一致（`ResponseModel<T>` 格式）。
- **强制 Must**: Mock 处理器使用 `success<T>()` 辅助函数返回统一格式响应。
- **强制 Must**: Mock 适配器设置 `onNoMatch: 'passthrough'`，未匹配的请求自动转发到真实后端。
- **强制 Must**: 通过 `VITE_USE_MOCK` 环境变量控制 Mock 启用/禁用，业务代码中不得出现 Mock 相关的条件判断。
- **推荐 Should**: 从 View 文件提取硬编码数据到 Mock 文件时，保留原始数据结构和字段名。

## 10. API 类型定义

- **强制 Must**: 前端 API 类型定义**必须**与后端 Pydantic Schema 保持一致，字段名使用 `snake_case`（与后端一致）。
- **强制 Must**: API 服务层方法的返回类型**必须**明确声明，禁止省略或使用 `any`。
- **强制 Must**: 类型导入路径必须正确，不得从错误的 types 文件中导入（如 `UserResponse` 应从 `user.types` 导入，不从 `auth.types` 导入）。

## 11. 认证系统

- **强制 Must**: JWT Token 存储在 localStorage 中，通过 `utils/auth.ts` 统一管理。
- **强制 Must**: 所有需要认证的 API 请求自动注入 `Authorization: Bearer <token>` 头（通过 axios 拦截器）。
- **强制 Must**: 401 响应自动清除 Token 并跳转登录页。
- **强制 Must**: 路由守卫检查 Token 存在性，未登录访问受保护页面时跳转登录页并携带 `redirect` 参数。

## 12. 环境变量

- **强制 Must**: 所有环境相关配置通过 `VITE_` 前缀的环境变量管理，不得在代码中硬编码。
- **强制 Must**: 环境变量类型声明必须在 `src/vite-env.d.ts` 中补充。
- **推荐 Should**: 敏感配置（如 API Key）不得提交到版本控制。

**必要的环境变量**:
```bash
VITE_API_BASE_URL=/api/v1     # API 基础路径
VITE_USE_MOCK=true            # 是否启用 Mock
VITE_MOCK_DELAY=300           # Mock 延迟(ms)
```

## 13. 🔴 构建验证（踩坑提炼）

> **背景**: `vue-tsc --noEmit` 和 `vite build` 均通过，但浏览器运行时崩溃。原因是 Vue SFC 的模板编译在 build 阶段不检查变量是否在 `setup` 中定义。

- **强制 Must**: 每次代码变更后，**必须**执行以下验证：
  1. `vue-tsc --noEmit` — TypeScript 类型检查零错误
  2. `vite build` — 生产构建成功
  3. **浏览器实际访问受影响页面** — 无控制台报错（⚠️ 构建通过 ≠ 运行时无错）
- **强制 Must**: 新增文件或修改导入路径后，**必须**确认 `tsconfig.app.json` 的 `paths` 配置能正确解析。
- **强制 Must**: 每个 Phase 完成后，**必须**启动 `vite dev` 并在浏览器中逐页验证。
- **推荐 Should**: 验证清单：登录页 → 首页 → 社区页 → 个人中心页 → 能力提升页 → 知识库页。

## 14. 🔴 Store 数据空值防护（踩坑提炼）

> **背景**: Store 中的 `gameInterviewData`、`resumeData` 等初始值为 `null`，模板直接访问 `.stats`、`.levels` 等属性会报错。

- **强制 Must**: 模板中访问 Store 的 nullable 数据时，**必须**使用可选链 `?.` 或提供默认值 `|| []`。
- **强制 Must**: Store 中初始值可能为 `null` 的响应式变量，在模板中使用前必须做空值判断。

**正例**: `v-for="item in (gameInterviewData?.stats || [])"`
**反例**: `v-for="item in gameInterviewData.stats"`

## 15. 冲突裁决策略

- **强制 Must**: 遇到多源文档对同一主题描述不一致时，**永远以当前项目正在生效的最新代码（`src/` 目录下的实现）为最高准则**。
- **强制 Must**: 前后端字段名不一致时，API 类型定义以**后端 Schema** 为准，View 层展示可做映射。

## 16. AI 记忆与交接规约

- **强制 Must**: 每次完成特定业务模块的开发、重构或复杂 Debug 后，AI 助手**必须**在 `docs/` 目录下的对应模块子目录中生成或更新**模块交接文档**。
- **强制 Must**: 交接文档内容必须包含：当前已实现的核心功能清单、未完成的 Todo 事项、关键技术决策说明、踩坑记录与经验教训、以及下一步开发的建议上下文。
- **强制 Must**: 发现新的踩坑模式时，**必须**同步更新本规约文档（`frontend-development-specification.md`）中的对应红色标记条目。

---

## 踩坑记录索引

| 日期 | 问题 | 规约条目 | Debug 文档 |
|------|------|----------|-----------|
| 2026-05-10 | Store 重构后模板遗留旧变量名导致渲染崩溃 | §5 Store 重构后强制检查项 | [frontend-render-errors-and-warnings.md](/docs/debug/2026-05-10-frontend-render-errors-and-warnings.md) |
| 2026-05-10 | 构建通过但运行时崩溃（Vue SFC 模板编译限制） | §13 构建验证 | 同上 |
| 2026-05-10 | ECharts + v-if 导致 cartesian2d 错误 | §6 ECharts 与条件渲染 | 同上 |
| 2026-05-10 | ECharts 重复初始化警告（Profile.vue initChart 未 dispose） | §6 ECharts 与条件渲染 | 同上 |
| 2026-05-10 | Router-view Component 为 null 导致级联错误 | §7 Router-view 防御性编程 | 同上 |
| 2026-05-10 | LoginForm 缺少 autocomplete 属性 | §8 表单 autocomplete 属性 | 同上 |
| 2026-05-10 | Store 数据为 null 时模板直接访问属性报错 | §14 Store 数据空值防护 | 同上 |
| 2026-05-10 | 类型导入路径错误（UserResponse 从 auth.types 导入） | §10 API 类型定义 | [handover.md](/docs/frontend-api/handover.md) |
| 2026-05-10 | tsconfig 缺少 paths 配置导致 @/ 导入类型检查失败 | §13 构建验证 | [handover.md](/docs/frontend-api/handover.md) |
