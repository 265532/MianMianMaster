# 前端渲染报错与警告修复

## 1. 问题现象描述

开发环境浏览器控制台出现以下 6 类错误和警告：

1. **DOM autocomplete 警告**：
   ```
   [DOM] Input elements should have autocomplete attributes (suggested: "current-password")
   ```
   出现在 `LoginForm.vue` 的 `<input type="password">` 元素上。

2. **Vue 未定义属性访问警告**：
   ```
   [Vue warn]: Property "savedQuestionBanks" was accessed during render but is not defined on instance.
   ```
   出现在 `Profile.vue` 渲染过程中。

3. **Vue 渲染错误 + TypeError**：
   ```
   [Vue warn]: Unhandled error during execution of render function
   Uncaught TypeError: Cannot read properties of undefined (reading 'length')
     at Proxy._sfc_render (Profile.vue:1128:43)
   ```
   `Profile.vue` 第 1128 行访问 `savedQuestionBanks.length` 时崩溃。

4. **ECharts 坐标系错误**：
   ```
   [ECharts] cartesian2d cannot be found for series.line (index: 0).
   ```
   出现在 `Growth.vue` 中，且切换 Tab 后反复触发。

5. **路由组件 null 引用错误**：
   ```
   [Vue warn]: Unhandled error during execution of component update
   Uncaught (in promise) TypeError: Cannot read properties of null (reading 'component')
   ```
   出现在 `App.vue` 的 `<router-view>` 更新过程中。

6. **ECharts 重复初始化警告**：
   ```
   [ECharts] There is a chart instance already initialized on the dom.
   ```
   出现在 `Profile.vue` 中，每次切换岗位或重新分析时重复触发，累计出现 11+ 次。

## 2. 根因分析

### 2.1 autocomplete 警告

Chrome 浏览器要求登录表单的 `<input>` 元素添加 `autocomplete` 属性，以便密码管理器正确识别和自动填充。`LoginForm.vue` 的用户名和密码输入框均缺少该属性。

### 2.2 savedQuestionBanks 未定义

Phase 4 Store 层重构时，`Profile.vue` 的硬编码数据被替换为 Store 响应式数据，但模板中 `savedQuestionBanks`（旧变量名）未被同步替换为 `collections`（来自 `storeToRefs(learningStore)`）。该变量从未在 `<script setup>` 中声明，导致渲染时为 `undefined`。

同理，`mistakeBook`（第 1228 行）也是遗留的未定义变量，应替换为 `wrongQuestions`。

### 2.3 ECharts cartesian2d 错误

`Growth.vue` 的图表容器位于 `v-if="activeTab === 'growth'"` 条件渲染内。问题链路：

1. 组件 `onMounted` 时 `activeTab` 默认为 `'growth'`，图表正常初始化
2. 用户切换到其他 Tab → `v-if` 为 `false` → 图表 DOM 被销毁
3. 用户切回 `growth` Tab → DOM 重建，但 `initCharts()` 不会再次调用
4. ECharts 实例指向已销毁的 DOM，无法创建 `cartesian2d` 坐标系

此外，`initCharts()` 没有在重新初始化前 `dispose()` 旧实例，可能导致内存泄漏。

### 2.4 路由组件 null 引用

`App.vue` 使用 `<router-view v-slot="{ Component }">` + `<component :is="Component" />` 模式。当 `Profile.vue` 因 `savedQuestionBanks` 未定义而渲染崩溃时，Vue 在错误恢复过程中将 `Component` 设为 `null`，导致 `<component :is="null" />` 抛出 `Cannot read properties of null (reading 'component')`。

这是 2.2 的级联错误。

### 2.5 ECharts 重复初始化警告

`Profile.vue` 的 `initChart()` 函数在以下 3 个调用点直接调用 `echarts.init(chartRef.value)`，未检查 DOM 上是否已有 ECharts 实例：

1. `onMounted` — 首次初始化（正常）
2. `changePosition()` — 用户切换目标岗位时
3. `reanalyze()` — 用户点击重新分析时

每次调用 `echarts.init()` 时，ECharts 检测到该 DOM 元素上已绑定实例，便输出警告。虽然功能不受影响（ECharts 会复用已有实例），但大量重复警告会污染控制台，且说明代码未正确管理实例生命周期。

## 3. 修复步骤

### 3.1 LoginForm.vue — 添加 autocomplete 属性

```html
<!-- 修复前 -->
<input type="text" id="username" v-model="form.username" ... />
<input type="password" id="password" v-model="form.password" ... />

<!-- 修复后 -->
<input type="text" id="username" v-model="form.username" autocomplete="username" ... />
<input type="password" id="password" v-model="form.password" autocomplete="current-password" ... />
```

### 3.2 Profile.vue — 替换未定义变量

```html
<!-- 修复前（第 1128 行） -->
<div v-if="savedQuestionBanks.length === 0" ...>

<!-- 修复后 -->
<div v-if="collections.length === 0" ...>

<!-- 修复前（第 1228 行） -->
<div v-if="mistakeBook.length === 0" ...>

<!-- 修复后 -->
<div v-if="wrongQuestions.length === 0" ...>
```

`collections` 和 `wrongQuestions` 均来自 `storeToRefs(learningStore)`，在 `<script setup>` 第 41 行已正确定义。

### 3.3 Growth.vue — 修复 ECharts 生命周期

**a) 添加 `watch` 和 `onUnmounted` 导入：**

```typescript
// 修复前
import { ref, computed, onMounted, nextTick } from 'vue'

// 修复后
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
```

**b) `initCharts()` 中先 `dispose()` 旧实例：**

```typescript
const initCharts = () => {
  if (growthChartRef.value) {
    if (growthChart.value) {
      growthChart.value.dispose()
    }
    growthChart.value = echarts.init(growthChartRef.value)
    // ... setOption
  }

  if (radarChartRef.value) {
    if (radarChart.value) {
      radarChart.value.dispose()
    }
    radarChart.value = echarts.init(radarChartRef.value)
    // ... setOption
  }
}
```

**c) 监听 Tab 切换，切回时重新初始化图表：**

```typescript
watch(activeTab, (newTab) => {
  if (newTab === 'growth') {
    nextTick(() => {
      initCharts()
    })
  }
})
```

**d) 添加 `onUnmounted` 清理：**

```typescript
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  growthChart.value?.dispose()
  radarChart.value?.dispose()
  growthChart.value = null
  radarChart.value = null
})
```

### 3.4 App.vue — 防御性 null 检查

```html
<!-- 修复前 -->
<component :is="Component" />

<!-- 修复后 -->
<component :is="Component" v-if="Component" />
```

### 3.5 Profile.vue — 修复 ECharts 重复初始化

```typescript
// 修复前
const initChart = () => {
  if (chartRef.value) {
    isChartLoading.value = false
    myChart = echarts.init(chartRef.value)
    // ...
  }
}

// 修复后：先 dispose 旧实例再 init
const initChart = () => {
  if (chartRef.value) {
    isChartLoading.value = false
    if (myChart) {
      myChart.dispose()
    }
    myChart = echarts.init(chartRef.value)
    // ...
  }
}
```

## 4. 验证方法

1. **类型检查**：`npx vue-tsc --noEmit` — ✅ 通过，0 错误
2. **生产构建**：`npx vite build` — ✅ 通过，28.50s 构建完成
3. **浏览器验证**：
   - 登录页：密码输入框不再出现 autocomplete 警告
   - 个人中心页：`savedQuestionBanks` / `mistakeBook` 相关警告和 TypeError 消失
   - 个人中心页：切换岗位、重新分析时不再出现 ECharts 重复初始化警告
   - 能力提升页：切换 Tab 后图表正常渲染，无 cartesian2d 错误
   - 路由导航：页面切换无 `Cannot read properties of null` 错误

## 5. 后续预防措施

1. **变量重命名检查**：Store 层重构后，应全局搜索旧变量名（如 `savedQuestionBanks`、`mistakeBook`）确认模板中无遗留引用
2. **ECharts 初始化规范**：所有 `echarts.init()` 调用前必须先检查并 `dispose()` 已有实例，封装为统一的初始化模式
3. **ECharts + v-if 模式**：当图表容器使用 `v-if` 条件渲染时，必须配合 `watch` 在条件为 `true` 时重新初始化，或改用 `v-show`（仅隐藏 DOM，不销毁）
4. **防御性组件渲染**：`<router-view>` 的 scoped slot 模式建议始终添加 `v-if="Component"` 防御
5. **autocomplete 规范**：所有涉及密码的表单均应添加 `autocomplete` 属性（登录用 `current-password`，注册用 `new-password`）

## 6. 相关代码片段或配置示例

### 变量来源对照表（Profile.vue）

| 模板中的旧变量 | 正确的 Store 变量 | 来源 |
|---|---|---|
| `savedQuestionBanks` | `collections` | `storeToRefs(learningStore)` |
| `mistakeBook` | `wrongQuestions` | `storeToRefs(learningStore)` |

### ECharts 初始化的推荐模式（适用于所有 Vue 组件）

```typescript
// 统一模式：init 前 dispose + v-if 场景 watch + onUnmounted 清理
const initChart = (container: HTMLElement, chartInstance: ref<ECharts | null>) => {
  if (chartInstance.value) {
    chartInstance.value.dispose()
  }
  chartInstance.value = echarts.init(container)
  chartInstance.value.setOption({ /* ... */ })
}

// v-if 条件渲染场景：watch 触发重新初始化
watch(activeTab, (newTab) => {
  if (newTab === 'growth') {
    nextTick(() => initCharts())
  }
})

// 组件卸载时清理
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance.value?.dispose()
  chartInstance.value = null
})
```
