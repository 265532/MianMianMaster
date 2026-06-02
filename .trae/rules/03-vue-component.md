---
alwaysApply: false
description: Vue 组件开发规范。包含组件通信（Props/Emits）、样式与主题色板、图标使用、动画过渡、路由配置，以及 Router-view 防御、ECharts 条件渲染、表单 autocomplete 等踩坑提炼的强制规则。
---
# 03 — Vue 组件开发规范

> 适用范围：所有 `src/views/` 和 `src/components/` 目录下的 Vue 单文件组件开发。

---

## 1. 组件通信规范

- **强制 Must**: 父子组件通信使用 `defineProps` + `defineEmits`，跨层级共享状态使用 Pinia Store。
- **推荐 Should**: Props 使用 TypeScript 泛型 + `withDefaults` 定义默认值。

**正例**:
```vue
<script setup lang="ts">
interface Props {
  title: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
})

const emit = defineEmits<{
  submit: [value: string]
}>()
</script>
```

**反例**: 使用 `$parent`、`$children` 或依赖注入（`provide/inject`）传递复杂的业务状态。

---

## 2. 样式规范

- **强制 Must**: 使用 Tailwind CSS 4 作为主样式方案，全局自定义主题变量定义在 `src/style.css` 中（通过 `@theme` 指令）。
- **强制 Must**: 项目设计 Token 必须通过 Tailwind 类名引用，禁止内联硬编码颜色值。
- **强制 Must**: 组件级样式使用 `<style scoped>`，全局工具类（如 `.gradient-primary`）定义在 `src/style.css` 中。

**主题色板**:

| Token | 色值 | Tailwind 类名 |
|-------|------|---------------|
| 主题色 | `#18C5C7` | `bg-primary text-primary` |
| 主题色浅 | `#95E0E1` | `bg-primary-light` |
| 主题色深 | `#14A7A9` | `bg-primary-dark` |
| 辅助黄 | `#FFEAC2` | `bg-auxiliary-yellow` |
| 辅助橙 | `#FFC585` | `bg-auxiliary-orange` |
| 辅助绿 | `#A3D47F` | `bg-auxiliary-green` |
| 背景 | `#F8FAFC` | `bg-neutral-bg` |
| 标题 | `#1E293B` | `text-neutral-title` |
| 正文 | `#64748B` | `text-neutral-body` |
| 辅助文字 | `#94A3B8` | `text-neutral-helper` |
| 边框 | `#CBD5E1` | `border-neutral-border` |

**预置渐变工具类**: `gradient-primary`、`gradient-cyan-yellow`、`gradient-yellow-orange`

**正例**:
```vue
<button class="px-6 py-3 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/30">
  立即体验
</button>
```

**反例**:
```vue
<button style="background-color: #18C5C7; color: white">立即体验</button>
```

---

## 3. 图标使用规范

- **强制 Must**: 统一使用 `lucide-vue-next` 图标库，禁止混用多个图标库或使用 emoji 作为图标。
- **强制 Must**: 图标通过 `<component :is="IconName" :size="20" />` 方式动态使用，`size` 统一使用数字而非字符串。

**正例**:
```vue
<script setup lang="ts">
import { Zap, Target, Brain } from 'lucide-vue-next'
</script>
<template>
  <Zap :size="20" class="text-primary" />
</template>
```

**反例**: 使用 `<i class="icon-zap"></i>` 或 `<span>⚡</span>` 代替。

---

## 4. 动画与过渡规范

- **强制 Must**: 页面切换使用 Vue `<Transition>` 组件配合 `router-view` 的 slot 模式。
- **强制 Must**: 组件内部动画 CSS 定义在 `<style scoped>` 中使用 `@keyframes`；页面级过渡动画（如 router-view 切换）使用非 scoped 的 `<style>` 块（因 scoped 无法穿透动态组件）。

**正例**:
```vue
<router-view v-slot="{ Component }">
  <transition name="page" mode="out-in">
    <component :is="Component" v-if="Component" />
  </transition>
</router-view>

<style>
.page-enter-active, .page-leave-active {
  transition: all 0.3s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
```

---

## 5. 路由规范

- **强制 Must**: 路由配置集中在 `src/router/index.ts`，使用 Vue Router `createWebHistory` 模式。
- **强制 Must**: 每个页面对应一个路由记录，包含 `name`、`path`、`component` 和 `meta`（含 `title`）。
- **强制 Must**: 路由守卫（`beforeEach`）用于权限校验和页面标题动态设置。
- **强制 Must**: 路由组件必须使用动态 `import()` 进行懒加载。登录页等高频入口路由可豁免懒加载（同步导入以避免白屏闪烁），但需在代码注释中说明原因。
- **推荐 Should**: 路由路径使用 kebab-case，与页面组件名称语义对应。

**正例**:
```typescript
const routes = [
  {
    path: "/interview",
    name: "Interview",
    component: () => import("@/views/Interview.vue"),
    meta: { title: "面试实战" },
  },
]

router.beforeEach((to, _from, next) => {
  document.title = `${to.meta.title} | 面面俱到`
  next()
})
```

**反例**: 在组件内部使用 `window.location.href` 跳转，或不设置 `meta.title`。

---

## 6. 🔴 Router-view 防御性编程（踩坑提炼）

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

---

## 7. 🔴 ECharts 与条件渲染（踩坑提炼）

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

---

## 8. 🔴 表单 autocomplete 属性（踩坑提炼）

> **背景**: LoginForm.vue 的密码输入框缺少 `autocomplete` 属性，Chrome 浏览器持续发出 DOM 警告。

- **强制 Must**: 所有涉及密码的 `<input>` 元素**必须**添加 `autocomplete` 属性：
  - 登录表单：`autocomplete="current-password"`
  - 注册表单：`autocomplete="new-password"`
  - 用户名输入：`autocomplete="username"`
- **推荐 Should**: 所有表单输入元素均应添加合适的 `autocomplete` 属性，提升浏览器自动填充体验。

---

## 相关文档

- [01 — 核心架构与基础规范](./01-core-architecture.md)
- [02 — Pinia Store 开发规范](./02-pinia-store.md)
- [04 — API 与 Mock 开发规范](./04-api-and-mock.md)
- [05 — 构建与质量管理规范](./05-build-and-quality.md)