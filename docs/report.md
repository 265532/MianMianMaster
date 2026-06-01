# 《面面俱到 Vue 3 前端 AI VibeCoding 开发规约》审查报告 & 修复计划

> 审查日期：2026-05-31 | 审查范围：`docs/ai-vibecoding-specification.md` 全部 20 条规约 vs `src/` 实际代码

---

## 一、总体评价

| 维度 | 评分 | 说明 |
|------|------|------|
| 可靠性 | ⭐⭐⭐⭐ (80%) | 大部分声明有据可查，但实际代码存在 5 处与文档规则直接冲突 |
| 可行性 | ⭐⭐⭐⭐ (80%) | 技术栈选型合理、工具链完整，但 ESLint 实际不可用（缺配置文件） |
| 准确性 | ⭐⭐⭐ (75%) | 技术版本号 100% 准确，但代码风格约定与实际代码存在偏差 |

**核心结论**：文档整体质量较高，但 Section 20（冲突裁决）实际成了当前问题的盾牌 —— 约 5 处规约被实际代码"反例化"，需要修正代码以匹配文档。

---

## 二、逐条验证详情

### ✅ 完全一致的规约（14/20）

| 条款 | 验证结果 |
|------|----------|
| §1 架构约束 | 实际 Store 均为 Composition API 风格，组件均用 `<script setup lang="ts">` |
| §2 技术栈版本 | `package.json` 中所有版本号 100% 匹配：Vue `^3.5.25`、Pinia `^3.0.4`、Vite `^7.3.1`、TS `~5.9.3`、Tailwind `^4.2.1`、lucide `^0.575.0`、ECharts `^6.0.0` |
| §2 TypeScript 配置 | [tsconfig.app.json](file:///d:/code/MianMianMaster/tsconfig.app.json) 中 `strict: true`、`noUnusedLocals: true`、`noUnusedParameters: true` 三项全部启用 |
| §3 包管理 | 使用 pnpm，`dependencies` 与 `devDependencies` 分离正确 |
| §4 目录结构 | [src/](file:///d:/code/MianMianMaster/src) 下 `views/`、`components/`、`stores/`、`router/`、`assets/` 结构完整 |
| §4 命名规范 | 组件 PascalCase（`LoginForm.vue`, `Home.vue`），Store camelCase（`user.ts`, `interview.ts`） |
| §6 Pinia Store | 两个 Store 均为 Composition API → state(ref) → getter(computed) → action(function) 结构 |
| §7 路由模式 | 使用 `createWebHistory`，有 `beforeEach` 守卫设置 `document.title` |
| §8 主题 Token | [style.css](file:///d:/code/MianMianMaster/src/style.css) 中 `@theme` 定义的色值与文档色板完全匹配，渐变工具类 `gradient-primary` 等已实现 |
| §9 图标库 | 全项目统一使用 `lucide-vue-next`，按需导入，`size` 用数字 |
| §10 环境变量 | 三份 `.env` 文件内容与文档完全一致，均以 `VITE_` 前缀 |
| §11 代理配置 | [vite.config.ts](file:///d:/code/MianMianMaster/vite.config.ts) 中 proxy 配置与文档一致 |
| §14 动画过渡 | [App.vue](file:///d:/code/MianMianMaster/src/App.vue) 中使用 `<router-view v-slot>` + `<transition>` 实现页面过渡，动画在 `<style>` 中用 `@keyframes` |
| §20 冲突裁决 | 条款本身合理，且确实被需要（见下文不一致项） |

### ⚠️ 文档与实际代码不一致（5 处）

#### 🔴 严重 1：§17 路由懒加载 — 文档要求但代码未执行

- **文档第 454 行**："路由组件必须使用动态 `import()` 进行懒加载"
- **实际**：[router/index.ts](file:///d:/code/MianMianMaster/src/router/index.ts) 全部 7 个页面使用同步 `import` 语句
- **影响**：所有页面打入首屏 bundle，路由懒加载完全失效

#### 🔴 严重 2：§12 导入路径 — 文档要求但实际全部用相对路径

- **文档第 344 行**："使用 `@/` 别名引用 `src/` 目录下的模块"
- **实际**：[router/index.ts](file:///d:/code/MianMianMaster/src/router/index.ts)、[LoginForm.vue](file:///d:/code/MianMianMaster/src/components/LoginForm.vue) 均用 `../` 相对路径
- **影响**：项目范围 0 处使用 `@/` 别名

#### 🟡 中等 3：§5 组件结构顺序 — 文档与实际相反

- **文档第 114 行**："组件结构顺序为 `<template>` → `<script setup lang="ts">` → `<style scoped>`"
- **实际**：[Home.vue](file:///d:/code/MianMianMaster/src/views/Home.vue)、[App.vue](file:///d:/code/MianMianMaster/src/App.vue) 为 `<script>` → `<template>` → `<style>`
- **影响**：与主流 Vue 社区实践及官方示例相反

#### 🟡 中等 4：§8 禁止内联颜色值 — Home.vue 大面积违规

- **文档第 232 行**："禁止内联硬编码颜色值"
- **实际**：[Home.vue](file:///d:/code/MianMianMaster/src/views/Home.vue) 中存在大量 `style="color: #333;"` 等内联颜色
- **影响**：文档反例正是 `style="background-color: #18C5C7"`，与代码直接冲突

#### 🟡 中等 5：§19 ESLint 不可用 — 有依赖无配置

- **文档第 490 行**："所有代码合入前必须通过 ESLint + Prettier 检查"
- **实际**：项目根目录无 `eslint.config.*` 或 `.eslintrc.*` 配置文件，无 `lint` 脚本
- **影响**：ESLint 门禁形同虚设

### 🔶 文档内部自我矛盾（2 处）

#### 1. §4 命名规范描述歧义

- 第 86 行：`stores/` 标注为 "kebab-case"
- 第 89 行：改为 "`camelCase` 或 `kebab-case`"
- 第 106 行 AI 模板：又说 "Store 文件使用 kebab-case"
- **建议**：统一为 `camelCase`

#### 2. §7 路由守卫 `from` 参数未使用下划线前缀

- 文档正例（第 217 行）：`(to, _from, next)`
- 实际代码（第 61 行）：`(to, from, next)`
- `from` 未使用但声明为 `from`，`noUnusedParameters: true` 下会导致 TS 编译错误

### 💡 其他观察

| # | 问题 | 位置 |
|---|------|------|
| 1 | `--background-gradient-yellow-orange` 重复定义，后者覆盖前者 | [style.css](file:///d:/code/MianMianMaster/src/style.css) L23-L26 |
| 2 | `LoginForm.vue` 无 `<style scoped>` 块 | [LoginForm.vue](file:///d:/code/MianMianMaster/src/components/LoginForm.vue) |
| 3 | `Home.vue` 中 `toggleFaq(index)` 参数缺少类型标注 | [Home.vue](file:///d:/code/MianMianMaster/src/views/Home.vue) L264 |
| 4 | 项目无 `vitest` 依赖和任何测试文件，§15 测试策略未落地 | 全局 |
| 5 | `Profile.vue` 中 `import * as echarts from 'echarts'` 全量导入 | [Profile.vue](file:///d:/code/MianMianMaster/src/views/Profile.vue) L3 |

---

## 三、可执行修复计划

### 🔴 P0 — 必须立即修复（阻塞门禁通过）

---

#### 任务 P0-1：路由改为懒加载

**目标文件**：[src/router/index.ts](file:///d:/code/MianMianMaster/src/router/index.ts)

**当前状态**（同步导入）：
```typescript
import Home from "../views/Home.vue";
import Interview from "../views/Interview.vue";
import Profile from "../views/Profile.vue";
import Matching from "../views/Matching.vue";
import Growth from "../views/Growth.vue";
import Community from "../views/Community.vue";
import Knowledge from "../views/Knowledge.vue";
```

**目标状态**（懒加载）：
```typescript
// 删除所有同步 import 语句
const routes = [
  { path: "/", name: "Home", component: () => import("@/views/Home.vue"), meta: { title: "首页", hideSidebar: true } },
  { path: "/interview", name: "Interview", component: () => import("@/views/Interview.vue"), meta: { title: "面试实战" } },
  { path: "/matching", name: "Matching", component: () => import("@/views/Matching.vue"), meta: { title: "岗位匹配" } },
  { path: "/growth", name: "Growth", component: () => import("@/views/Growth.vue"), meta: { title: "能力提升" } },
  { path: "/community", name: "Community", component: () => import("@/views/Community.vue"), meta: { title: "面试社区" } },
  { path: "/knowledge", name: "Knowledge", component: () => import("@/views/Knowledge.vue"), meta: { title: "知识库" } },
  { path: "/profile", name: "Profile", component: () => import("@/views/Profile.vue"), meta: { title: "个人中心" } },
];
```

**Checklist**：
- [ ] 删除文件顶部所有 `src/views/` 的同步 `import` 语句
- [ ] 每个路由的 `component` 改为 `() => import("@/views/Xxx.vue")`
- [ ] 运行 `pnpm build` 确认构建成功
- [ ] 运行 `pnpm dev` 确认各页面路由跳转正常

---

#### 任务 P0-2：导入路径统一为 `@/` 别名

**涉及文件**：
- [src/router/index.ts](file:///d:/code/MianMianMaster/src/router/index.ts)
- [src/components/LoginForm.vue](file:///d:/code/MianMianMaster/src/components/LoginForm.vue)

**当前状态**：
```typescript
// router/index.ts
import { useUserStore } from "../stores/user";

// LoginForm.vue
import { useUserStore } from '../stores/user'
```

**目标状态**：
```typescript
// router/index.ts
import { useUserStore } from "@/stores/user";

// LoginForm.vue
import { useUserStore } from '@/stores/user'
```

**Checklist**：
- [ ] [router/index.ts](file:///d:/code/MianMianMaster/src/router/index.ts) 中 `import { useUserStore } from "../stores/user"` 改为 `from "@/stores/user"`
- [ ] [LoginForm.vue](file:///d:/code/MianMianMaster/src/components/LoginForm.vue) 中 `from '../stores/user'` 改为 `from '@/stores/user'`
- [ ] 全局搜索 `from '../` 和 `from "../` 确认无遗漏的跨目录相对导入
- [ ] 运行 `pnpm build` 确认别名解析正常

---

#### 任务 P0-3：修复 `from` → `_from`（TS 严格模式编译错误）

**目标文件**：[src/router/index.ts](file:///d:/code/MianMianMaster/src/router/index.ts#L61)

**当前状态**：
```typescript
router.beforeEach((to, from, next) => {
```

**目标状态**：
```typescript
router.beforeEach((to, _from, next) => {
```

**Checklist**：
- [ ] 将 `from` 改为 `_from`（告知 TS 此参数有意不使用）
- [ ] 运行 `vue-tsc -b` 确认类型检查通过

---

#### 任务 P0-4：添加 ESLint 配置文件 + `lint` 脚本

**目标**：使 §19 的 ESLint 门禁可执行

**新增文件**：`eslint.config.js`（ESLint flat config，与 eslint `^10.0.3` 版本匹配）

```javascript
import pluginVue from 'eslint-plugin-vue'
import vueTsEslintConfig from '@vue/eslint-config-typescript'
import prettierConfig from '@vue/eslint-config-prettier'

export default [
  ...pluginVue.configs['flat/recommended'],
  ...vueTsEslintConfig(),
  prettierConfig,
  {
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
]
```

**修改文件**：[package.json](file:///d:/code/MianMianMaster/package.json) — 添加 `lint` 脚本：
```json
"scripts": {
  "dev": "vite",
  "build": "vue-tsc -b && vite build",
  "preview": "vite preview",
  "lint": "eslint . --ext .vue,.ts,.tsx --fix"
}
```

**Checklist**：
- [ ] 新建 [eslint.config.js](file:///d:/code/MianMianMaster/eslint.config.js)（内容如上）
- [ ] 在 `package.json` 的 `scripts` 中添加 `"lint": "eslint . --ext .vue,.ts,.tsx --fix"`
- [ ] 运行 `pnpm lint` 确认 ESLint 正常执行
- [ ] 修复 ESLint 报告的现有问题
- [ ] 验证 `.prettierrc` 是否存在（若无则创建，确保 Prettier 格式化一致）

---

### 🟡 P1 — 应尽快修复（影响代码质量与一致性）

---

#### 任务 P1-1：修订文档 §5 组件结构顺序

**目标文件**：[docs/ai-vibecoding-specification.md](file:///d:/code/MianMianMaster/docs/ai-vibecoding-specification.md)

**当前**："单文件组件结构顺序为 `<template>` → `<script setup lang="ts">` → `<style scoped>`"

**修改为**："单文件组件结构顺序为 `<script setup lang="ts">` → `<template>` → `<style scoped>`"

**原因**：匹配实际代码风格 + Vue 官方文档示例 + 社区惯例

**Checklist**：
- [ ] 修改 §5 第 114 行的结构顺序描述
- [ ] 检查文档所有正例中的组件结构顺序是否一致（§1 正例已为 `<script>` → `<template>` ✅）
- [ ] 检查 §4 第 90 行是否也需要同步修改

---

#### 任务 P1-2：修订文档 §4 Store 命名规范

**目标文件**：[docs/ai-vibecoding-specification.md](file:///d:/code/MianMianMaster/docs/ai-vibecoding-specification.md)

**需要修改的位置**：
- 第 86 行：`src/stores/` 描述改为 "camelCase 按功能域命名"
- 第 106 行 AI 模板：改为 "Store 文件使用 camelCase"
- 保持第 89 行 "`camelCase` 或 `kebab-case`"（作为备选说明）

**Checklist**：
- [ ] 修改第 86 行 stores 命名描述为 `camelCase`
- [ ] 修改第 106 行 AI 提示词模板中的 `kebab-case` 为 `camelCase`
- [ ] 第 89 行保持 "`camelCase` 或 `kebab-case`" 作为容错说明

---

#### 任务 P1-3：消除 Home.vue 内联硬编码颜色值

**目标文件**：[src/views/Home.vue](file:///d:/code/MianMianMaster/src/views/Home.vue)

**当前问题分布**（约 20+ 处内联 `style` 颜色值）：

| 内联样式模式 | 应替换为 |
|-------------|----------|
| `style="color: #333;"` | `class="text-neutral-title"` |
| `style="color: #FFC585;"` | `class="text-auxiliary-orange"` |
| `style="color: #1E293B;"` | `class="text-neutral-title"` |
| `style="color: #64748B;"` | `class="text-neutral-body"` |
| `style="background: #18C5C7; color: #FFFFFF;"` | `class="bg-primary text-white"` |
| `style="background: #1E293B;"` | `class="bg-neutral-title"` |
| `style="color: #FFFFFF;"` | `class="text-white"` |
| `style="color: #E0F7FA;"` | 定义 CSS 变量或专用 class |
| `style="color: #B2EBF2;"` | 定义 CSS 变量或专用 class |
| `style="background: linear-gradient(...)"` | 使用 `gradient-*` 工具类或 Tailwind `bg-gradient-*` |

**特殊处理**：
- `:style="{ color: activeSection === link.id ? '#FFC585' : '#333' }"` 动态绑定 → 改为动态 class：
  ```vue
  :class="activeSection === link.id ? 'text-auxiliary-orange' : 'text-neutral-title'"
  ```
- `style="background: linear-gradient(135deg, ...)"` 多处 → 提取为 `@theme` 变量或使用 Tailwind gradient 语法

**Checklist**：
- [ ] 扫描 [Home.vue](file:///d:/code/MianMianMaster/src/views/Home.vue) 全部内联 `style` 颜色值（`grep -n 'style="' src/views/Home.vue`）
- [ ] 逐处替换为 Tailwind class 或 CSS 变量
- [ ] 动态 `:style` 绑定改为 `:class` 动态 class
- [ ] 页面视觉效果验证

---

#### 任务 P1-4：Profile.vue ECharts 按需引入

**目标文件**：[src/views/Profile.vue](file:///d:/code/MianMianMaster/src/views/Profile.vue)

**当前**：`import * as echarts from 'echarts'`（全量 ~1MB）

**目标**：按需引入所需模块

```typescript
// 按需引入
import * as echarts from 'echarts/core'
import { BarChart, RadarChart, PieChart } from 'echarts/charts'
import { TooltipComponent, LegendComponent, GridComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([BarChart, RadarChart, PieChart, TooltipComponent, LegendComponent, GridComponent, CanvasRenderer])
```

**Checklist**：
- [ ] 确认 Profile.vue 实际使用了哪些图表类型
- [ ] 改为按需引入
- [ ] 验证图表渲染正常

---

#### 任务 P1-5：修复 style.css 中 `--background-gradient-yellow-orange` 重复定义

**目标文件**：[src/style.css](file:///d:/code/MianMianMaster/src/style.css#L23-L26)

**当前**：
```css
--background-gradient-yellow-orange: linear-gradient(135deg, #FFEAC2 0%, #FFC585 100%);  /* L23 */
--background-gradient-yellow-orange: radial-gradient(circle at center, #FFEAC2 0%, #FFC585 100%);  /* L25 覆盖 */
```

**修复**：决定保留一个，或改为两个不同的变量名：
```css
--background-gradient-yellow-orange: linear-gradient(135deg, #FFEAC2 0%, #FFC585 100%);
--background-gradient-yellow-orange-radial: radial-gradient(circle at center, #FFEAC2 0%, #FFC585 100%);
```

**Checklist**：
- [ ] 确认 `gradient-yellow-orange` 工具类预期使用哪个渐变
- [ ] 删除或重命名重复定义
- [ ] 检查 `.gradient-yellow-orange` class 的视觉效果

---

### 🔵 P2 — 后续优化（非紧急）

---

#### 任务 P2-1：Home.vue `toggleFaq(index)` 添加类型标注

**目标文件**：[src/views/Home.vue](file:///d:/code/MianMianMaster/src/views/Home.vue#L264)

**当前**：
```typescript
const toggleFaq = (index) => {
```

**修改为**：
```typescript
const toggleFaq = (index: number) => {
```

**Checklist**：
- [ ] 添加 `index: number` 类型标注

---

#### 任务 P2-2：§15 测试策略落地

**Checklist**：
- [ ] `pnpm add -D vitest` 安装 vitest
- [ ] 创建 `vitest.config.ts`
- [ ] 为 `src/stores/user.ts` 编写单元测试
- [ ] 为 `src/stores/interview.ts` 编写单元测试
- [ ] 在 `package.json` 添加 `"test": "vitest run"` 脚本

---

#### 任务 P2-3：§19 CodeReview 门禁完善

**Checklist**：
- [ ] 确保 `pnpm lint` 通过（0 警告 0 错误）
- [ ] 确保 `pnpm build`（`vue-tsc -b && vite build`）通过
- [ ] 考虑添加 pre-commit hook（如 husky + lint-staged）强制执行门禁

---

## 四、执行顺序建议

```
第 1 轮（立即）：
  P0-1 → P0-2 → P0-3 → P0-4
  验证：pnpm build && pnpm lint 全部通过

第 2 轮（本周）：
  P1-1 → P1-2（文档修正）
  P1-3 → P1-4 → P1-5（代码质量修正）

第 3 轮（下周）：
  P2-1 → P2-2 → P2-3（长期质量建设）
```

---

## 五、最终可靠性评分

| 评估维度 | 修复前 | 修复后（预期） |
|----------|--------|----------------|
| 技术版本号准确性 | 100% | 100% |
| 配置声明准确性 | 95% | 100% |
| 代码风格约定一致性 | 60% | 95% |
| 工具链可用性 | 75% | 100% |
| **综合可靠性** | **可靠，但需修正** | **可作为权威规约** |