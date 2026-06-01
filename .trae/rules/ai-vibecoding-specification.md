---
alwaysApply: true
---
# 面面俱到 Vue 3 前端 AI VibeCoding 开发规约

> 本文档为「面面俱到」Vue 3 前端项目面向 AI 代码助手（Trae、Cursor、GitHub Copilot 等）的专属开发规约。基于通用规约框架并结合项目实际代码风格生成，如有冲突，以此文件为准。

---

## 1. 架构约束

- **强制 Must**: 采用 Vue 3 单文件组件分层架构：`views/`（页面级路由组件）→ `components/`（可复用通用组件）→ `stores/`（Pinia 状态管理）。页面组件负责组装布局与路由参数获取，通用组件负责 UI 复用，Store 负责业务状态与副作用。
- **强制 Must**: 所有组件使用 `<script setup lang="ts">` + Composition API，禁止使用 Options API。
- **强制 Must**: 状态管理统一使用 Pinia（Composition API 风格），禁止在组件内直接管理跨页面共享状态。
- **推荐 Should**: 复杂业务逻辑（如 API 调用、数据聚合）应封装在 Pinia Store 的 action 中，组件仅调用 action 并消费响应式 state。

**正例**:
```typescript
// stores/user.ts —— Store 封装登录逻辑
export const useUserStore = defineStore('user', () => {
  const user = ref<User>({ ... })
  const loading = ref(false)
  
  async function login(email: string, password: string) {
    loading.value = true
    // ...API 调用
    loading.value = false
  }
  return { user, loading, login }
})
```

```vue
<!-- views/Profile.vue —— 组件仅消费 Store -->
<script setup lang="ts">
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
</script>
```

**反例**: 在 `views/Home.vue` 中直接使用 `fetch()` 发起登录请求并管理 `loading` 和 `error` 等状态。

**AI 提示词模板**: `请为 [模块名] 编写 Vue 3 `<script setup lang="ts">` 组件，状态管理使用 Pinia Composition API 风格的 Store，页面级逻辑放在 views/ 下，复用组件放在 components/ 下。`

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
  | 包管理器 | pnpm | 最新稳定版 |
  | 代码格式化 | ESLint + Prettier | 配套最新版 |

- **强制 Must**: `tsconfig` 必须启用 `strict: true`、`noUnusedLocals: true`、`noUnusedParameters: true`。

**AI 提示词模板**: `请使用 Vue 3.5 + TypeScript 5.9 + Tailwind CSS 4 + Vite 7 编写 [功能描述]，严格启用 TypeScript strict 模式。`

---

## 3. 包管理策略

- **强制 Must**: 使用 `pnpm` 作为包管理器，`package.json` 中锁定所有依赖版本为精确版本（使用 `^` 或 `~` 范围限定）。
- **强制 Must**: 生产依赖（`dependencies`）与开发依赖（`devDependencies`）严格分离，构建工具、类型声明、Linter 等归入 `devDependencies`。

**正例**: `"vue": "^3.5.25"`, `"typescript": "~5.9.3"`, `"@types/mockjs": "^1.0.10"` 归入 `devDependencies`
**反例**: 使用 `"vue": "latest"` 或将 Linter 放入 `dependencies`

**AI 提示词模板**: `如果需要引入新依赖，请使用 pnpm add [package] 并在 package.json 中指定范围版本号，区分 dependencies 与 devDependencies。`

---

## 4. 目录与命名规范

- **强制 Must**: 遵守以下 `src/` 目录结构：
  - `src/views/`：页面级路由组件（每个页面一个文件，PascalCase 命名如 `Home.vue`, `Interview.vue`）
  - `src/components/`：可复用的通用组件（PascalCase 命名如 `LoginForm.vue`）
  - `src/stores/`：Pinia Store 模块（camelCase 按功能域命名如 `user.ts`, `interview.ts`）
  - `src/router/`：路由配置（`index.ts`）
  - `src/assets/`：静态资源
- **强制 Must**: Vue 组件文件名使用 `PascalCase`（如 `LoginForm.vue`），Store 文件使用 `camelCase` 或 `kebab-case`（如 `user.ts`），普通工具/类型文件使用 `camelCase`。
- **强制 Must**: `script` 标签必须包含 `setup lang="ts"`，顺序为 `script` → `template` → `style scoped`。

**正例**:
```
src/views/Home.vue
src/components/LoginForm.vue
src/stores/user.ts
src/router/index.ts
```

**反例**:
```
src/views/home_page.vue       ← 应使用 PascalCase
src/stores/UserStore.ts       ← 应使用 camelCase/kebab-case
```

**AI 提示词模板**: `请在 src/[views|components|stores]/ 目录下新建一个符合命名规范的文件，Vue 组件使用 PascalCase，Store 文件使用 camelCase。`

---

## 5. 代码风格

- **强制 Must**: 所有代码必须包含完整 TypeScript 类型标注，函数参数、返回值、ref、computed 均需显式标注类型。
- **强制 Must**: `catch` 子句的 `any` 属于 TypeScript 语言限制，允许使用；`ref` 和函数参数禁止使用 `any`，必须定义具体类型；后端 Schema 未确定时可使用 `Record<string, unknown>` 过渡。
- **强制 Must**: 使用 ESLint + Prettier 进行代码格式化与静态检查。
- **强制 Must**: 单文件组件结构顺序为 `<script setup lang="ts">` → `<template>` → `<style scoped>`。
- **推荐 Should**: 复杂模板表达式提取为 computed 或 method，保持模板简洁可读。

**正例**:
```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

interface Question {
  id: string
  content: string
  difficulty: 'easy' | 'medium' | 'hard'
}

const questions = ref<Question[]>([])
const hardCount = computed<number>(() => questions.value.filter(q => q.difficulty === 'hard').length)

function addQuestion(q: Question): void {
  questions.value.push(q)
}
</script>
```

**反例**:
```vue
<script setup>
const questions = ref([])     ← 缺少泛型和类型标注
```

**AI 提示词模板**: `请生成包含完整 TypeScript 类型标注的 Vue 3 组件代码，使用 `<script setup lang="ts">` 语法。`

---

## 6. Pinia Store 规范

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
  jobTitle: string
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
  function startInterview(jobTitle: string): InterviewSession {
    const session: InterviewSession = {
      id: Date.now().toString(),
      jobTitle,
      status: 'in_progress'
    }
    sessions.value.push(session)
    currentSession.value = session
    return session
  }

  return { sessions, currentSession, loading, activeSessions, startInterview }
})
```

**反例**: 使用 Options API 风格或将 Store 状态与组件私有状态混用。

**AI 提示词模板**: `请编写一个 Pinia Composition API 风格的 Store，包含 state(ref)、getter(computed) 和 action(function)，类型定义放在文件顶部。`

---

## 7. 路由规范

- **强制 Must**: 路由配置集中在 `src/router/index.ts`，使用 Vue Router `createWebHistory` 模式。
- **强制 Must**: 每个页面对应一个路由记录，包含 `name`、`path`、`component` 和 `meta`（含 `title`）。
- **强制 Must**: 路由守卫（`beforeEach`）用于权限校验和页面标题动态设置。
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

**AI 提示词模板**: `请在 src/router/index.ts 中添加新路由记录，包含 name、path（kebab-case）、component（懒加载导入）和 meta.title。`

---

## 8. 样式规范

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

**AI 提示词模板**: `请使用 Tailwind CSS 4 类名编写样式，项目主题色为 primary(#18C5C7)、auxiliary-yellow(#FFEAC2)、auxiliary-orange(#FFC585)，注意使用预置的 gradient-primary 等工具类。`

---

## 9. 图标使用规范

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

**AI 提示词模板**: `请使用 lucide-vue-next 图标库，按需导入所需图标组件，size 统一使用数字（如 :size="20"）。`

---

## 10. 环境变量规范

- **强制 Must**: 所有前端环境变量必须以 `VITE_` 为前缀，通过 `import.meta.env.VITE_xxx` 访问。
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

**AI 提示词模板**: `请添加新的前端环境变量，使用 VITE_ 前缀，并同步更新 .env、.env.development、.env.staging、.env.production 四份文件。`

---

## 11. API 与 Mock 规范

- **强制 Must**: 所有 API 请求通过 `VITE_API_BASE_URL` 环境变量配置基础 URL，开发环境通过 Vite proxy 代理 `/api` 前缀请求。
- **推荐 Should**: 开发阶段使用 `mockjs` 模拟后端接口，通过 `VITE_USE_MOCK` 环境变量控制开关。

**Vite 代理配置**:
```typescript
// vite.config.ts
server: {
  proxy: env.VITE_PROXY_TARGET ? {
    '/api': {
      target: env.VITE_PROXY_TARGET,
      changeOrigin: true,
    },
  } : undefined,
}
```

**AI 提示词模板**: `请在开发环境下使用 mockjs 模拟 [接口名] 接口数据，通过 VITE_USE_MOCK 环境变量控制启用/禁用。`

---

## 12. 导入路径规范

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

**AI 提示词模板**: `请使用 @/ 别名导入 src 目录下的模块，如 import { xxx } from '@/stores/xxx'。`

---

## 13. 组件通信规范

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

**AI 提示词模板**: `请使用 defineProps<Props>() + withDefaults 定义组件 Props，使用 defineEmits 定义事件。`

---

## 14. 动画与过渡规范

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

**AI 提示词模板**: `请使用 Vue Transition 组件为 [动画场景] 添加过渡动画，动画样式放在 scoped 样式块中。`

---

## 15. 测试策略

- **强制 Must**: 核心 Store 逻辑必须编写单元测试。
- **推荐 Should**: 使用 `vitest`（与 Vite 生态一致）编写单元测试，测试文件与源文件同目录或放在 `tests/` 目录下。
- **推荐 Should**: 关键用户流程编写 E2E 测试（如 Playwright）。

**AI 提示词模板**: `请为 [Store/组件] 编写基于 vitest 的单元测试，确保核心业务逻辑和边界情况得到覆盖。`

---

## 16. 日志与调试规范

- **强制 Must**: 调试日志统一通过 `VITE_ENABLE_DEBUG_LOG` 环境变量控制开关。
- **强制 Must**: 生产环境禁止输出 `console.log`，错误信息通过 `VITE_ENABLE_ERROR_MONITOR` 控制是否上报。
- **强制 Must**: 日志分级策略：`console.log` / `console.warn` 通过 `VITE_ENABLE_DEBUG_LOG` 控制；`console.error` 同样通过 `VITE_ENABLE_DEBUG_LOG` 控制，关键错误（如认证失效 401）可在 `VITE_ENABLE_DEBUG_LOG` 为 false 时仍保留。
- **推荐 Should**: 开发环境使用 `console.debug` / `console.warn` 分级输出，生产构建时通过 Vite 配置自动移除。

**正例**:
```typescript
if (import.meta.env.VITE_ENABLE_DEBUG_LOG === 'true') {
  console.debug('[InterviewStore] startInterview:', jobTitle)
}
```

**反例**: 在代码中直接使用 `console.log(user.password)` 输出敏感信息。

**AI 提示词模板**: `请在关键业务节点添加调试日志，使用 VITE_ENABLE_DEBUG_LOG 环境变量包裹，确保敏感字段脱敏。`

---

## 17. 性能规约

- **强制 Must**: 路由组件必须使用动态 `import()` 进行懒加载，避免首屏打包体积过大。登录页等高频入口路由可豁免懒加载（同步导入以避免白屏闪烁），但需在代码注释中说明原因。
- **强制 Must**: 列表渲染必须使用 `v-for` + `:key`（key 使用唯一 ID 而非 index）。
- **推荐 Should**: 大体积第三方库（如 ECharts）按需引入模块，避免全量导入。
- **推荐 Should**: 高频交互场景使用 `v-memo` 或 `shallowRef` 优化渲染。

**正例**:
```typescript
const routes = [
  { path: '/interview', component: () => import('@/views/Interview.vue') }
]
```

**反例**:
```typescript
import Interview from '@/views/Interview.vue'
const routes = [{ path: '/interview', component: Interview }]
```

**AI 提示词模板**: `请使用路由懒加载、v-for + 唯一 key、按需导入 ECharts 模块等方式优化组件性能。`

---

## 18. 分支与提交信息

- **强制 Must**: 分支命名遵循 `feature/xxx`、`bugfix/xxx`、`hotfix/xxx` 规范。
- **强制 Must**: 提交信息遵循 Conventional Commits 规范（如 `feat(interview): add AI scoring panel`、`fix(router): resolve navigation guard loop`）。

**正例**: `feat(stores): 新增面试会话状态管理`
**反例**: `update code`、`fix bug`

**AI 提示词模板**: `请为刚才的代码修改生成符合 Conventional Commits 规范的 Git 提交信息。`

---

## 19. CodeReview 门禁

- **强制 Must**: 所有代码合入前必须通过 ESLint + Prettier 检查（0 警告 0 错误）。
- **强制 Must**: TypeScript 编译无错误（`vue-tsc -b` 通过）。
- **强制 Must**: Vite 生产构建成功（`vite build` 无报错）。

**正例**: 提交前运行 `pnpm build`（含 `vue-tsc -b && vite build`）和 ESLint 检查。
**反例**: 跳过类型检查直接推送代码。

**AI 提示词模板**: `在提供最终代码前，请确保代码通过 vue-tsc 类型检查、ESLint 规则校验和 vite build 构建验证。`

---

## 20. 冲突裁决与现有代码优先

- **强制 Must**: 遇到文档描述与 `src/` 目录下实际代码不一致时，**以当前项目已生效的代码为最高准则**。
- **强制 Must**: AI 助手生成代码前应阅读同目录下至少 1~2 个现有文件，把握当前代码模式后再输出。
- **推荐 Should**: 发现不一致时，AI 应在响应中指出并说明裁决策略。

**正例**: "根据现有 `src/stores/user.ts` 的模式，为您生成相同 Composition API 风格的 Store 代码。"
**反例**: 忽略现有代码用 Options API 的方式编写 Store。

**AI 提示词模板**: `请在阅读 src/ 下至少 2 个相关文件后，保持现有代码风格一致性，再生成新代码。如遇冲突以实际代码为准。`