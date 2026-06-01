# 《AI VibeCoding 开发规约》完整修复清单

> 基于审查报告 [ai-vibecoding-specification-review.md](./ai-vibecoding-specification-review.md) 及补充核查，对照 `.trae/rules/ai-vibecoding-specification.md` 与 `src/` 实际代码，生成如下完整修复清单。

---

## 一、环境变量：规约 §10 与实际文件逐项差异对照

### 规约声明的变量 vs 实际文件内容

| 变量 | 规约归属 | 实际 `.env` | 实际 `.env.development` | 实际 `.env.production` | 实际 `.env.staging` |
|------|---------|:--:|:--:|:--:|:--:|
| `VITE_APP_TITLE` | `.env` → `面面俱到` | ❌ 无此文件 | `MianMianMaster Dev` | `面面俱到` | `面面俱到(Staging)` |
| `VITE_APP_VERSION` | `.env` → `1.0.0` | ❌ 无此文件 | `0.0.0` | `0.0.0` | `0.0.0` |
| `VITE_API_TIMEOUT` | `.env` → `30000` | ❌ 无此文件 | `15000` | `15000` | `15000` |
| `VITE_API_BASE_URL` | `.env.development` → `http://localhost:8080/api` `.env.production` → `https://api.mianmianmaster.com/api` | ❌ | `/api/v1` | `/api/v1` | `/api/v1` |
| `VITE_USE_MOCK` | `.env.development` → `true` `.env.production` → `false` | ❌ | `true` ✅ | `false` ✅ | `false` |
| `VITE_ENABLE_DEBUG_LOG` | `.env.development` → `true` `.env.production` → `false` | ❌ | `true` ✅ | `false` ✅ | `true` |
| `VITE_MOCK_DELAY` | **未提及** | ❌ | `300` | — | — |
| `VITE_PROXY_TARGET` | **未提及**（仅在 §11 示例出现） | ❌ | `http://localhost:8081` | — | `http://localhost:8081` |
| `VITE_CDN_URL` | `.env.production` → `https://cdn.mianmianmaster.com` | ❌ | — | **不存在** | — |
| `VITE_ENABLE_ERROR_MONITOR` | `.env.production` → `true` | ❌ | — | **不存在** | — |
| `.env.staging` 文件 | **完全未提及** | — | — | — | 存在（7个变量） |

### 修复操作

#### 🔴 FIX-01：创建 `.env` 文件（通用配置）
**当前状态**：文件不存在。
**决策**：以实际代码为准（规约 §20），根据当前 env 文件的分布情况决定。

**推荐方案 A — 创建 `.env` 并提取三个文件的公共变量**：

```bash
# .env（通用 — 所有环境共享）
VITE_APP_VERSION=0.0.0
VITE_API_BASE_URL=/api/v1
VITE_API_TIMEOUT=15000
```

> `.env.development` 和 `.env.production` 中删除 `VITE_API_BASE_URL`、`VITE_API_TIMEOUT`、`VITE_APP_VERSION`（它们会从 `.env` 继承）。保留 `VITE_APP_TITLE` 在各环境文件中（值不同）。

**推荐方案 B — 不创建 `.env`，仅修正规约文档**（改动最小）：
在规约 §10 中删除 `.env`（通用）的描述，明确项目使用三文件模式 `.env.development` / `.env.staging` / `.env.production`。

> ⚠️ 请在 A/B 之间做出选择后再执行。两种方案都合理，取决于团队偏好。

---

#### 🔴 FIX-02：对齐 `.env.development` 与规约

| 操作 | 变量 | 原因 |
|------|------|------|
| **规约需补充** | `VITE_APP_TITLE=MianMianMaster Dev` | 规约未列出（或以为只在 `.env` 中） |
| **规约需补充** | `VITE_APP_VERSION=0.0.0` | 同上 |
| **规约需补充** | `VITE_API_TIMEOUT=15000` | 同上 |
| **规约需修正** | `VITE_API_BASE_URL` 值 | 规约写 `http://localhost:8080/api`，实际为 `/api/v1` |
| **规约需补充** | `VITE_MOCK_DELAY=300` | 规约完全未提及 |
| **规约需补充** | `VITE_PROXY_TARGET=http://localhost:8081` | 规约仅在 §11 示例中出现，未在 §10 变量清单列出 |

---

#### 🔴 FIX-03：对齐 `.env.production` 与规约

| 操作 | 变量 | 原因 |
|------|------|------|
| **规约需补充** | `VITE_APP_TITLE=面面俱到` | 规约未列出（或以为只在 `.env` 中） |
| **规约需补充** | `VITE_APP_VERSION=0.0.0` | 同上 |
| **规约需补充** | `VITE_API_TIMEOUT=15000` | 同上 |
| **规约需修正** | `VITE_API_BASE_URL` 值 | 规约写 `https://api.mianmianmaster.com/api`，实际为 `/api/v1` |
| **二选一** | `VITE_CDN_URL` | 实际文件缺失。**要么在文件中新增，要么从规约中删除** |
| **二选一** | `VITE_ENABLE_ERROR_MONITOR` | 同上。如果新增，需同时在代码中实现 `VITE_ENABLE_ERROR_MONITOR` 检查逻辑 |

---

#### 🔴 FIX-04：补充 `.env.staging` 到规约 §10

```bash
# .env.staging
VITE_APP_TITLE=面面俱到(Staging)
VITE_APP_VERSION=0.0.0
VITE_API_BASE_URL=/api/v1
VITE_API_TIMEOUT=15000
VITE_USE_MOCK=false
VITE_ENABLE_DEBUG_LOG=true
VITE_PROXY_TARGET=http://localhost:8081
```

同时更新 §10 文件列表为：`.env.development` / `.env.staging` / `.env.production`（如有 `.env` 则四文件）。

---

#### 🔴 FIX-05：规约 §11 Vite 代理配置对齐

**当前规约示例**（与实际不一致）：
```typescript
proxy: env.VITE_PROXY_TARGET ? {
  '/api': {
    target: env.VITE_PROXY_TARGET,
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, ''),  // ❌ 实际无此规则
  },
} : undefined,
```

**实际代码** [vite.config.ts](file:///d:/code/MianMianMaster/vite.config.ts#L11-L18)：
```typescript
proxy: env.VITE_PROXY_TARGET
  ? {
      '/api': {
        target: env.VITE_PROXY_TARGET,
        changeOrigin: true,
      },
    }
  : undefined,
```

**修复**：更新规约 §11 示例，删除 `rewrite` 行。

---

## 二、`any` 类型：全局修复清单（规约 §5 + frontend-dev-spec §4）

> 审查报告仅列出 6 处（user.ts + vite-env.d.ts）。经全局 `grep ref<any>` 搜索，实际有 **18 处**，分布在 **7 个文件**。

### 按文件分组

#### [user.ts](file:///d:/code/MianMianMaster/src/stores/user.ts) — 3 处 + 函数签名

| 行号 | 当前代码 | 建议 |
|------|---------|------|
| L62 | `const gameInterviewData = ref<any>(null)` | 定义 `GameInterviewData` 接口 |
| L63 | `const resumeData = ref<any>(null)` | 定义 `ResumeData` 接口 |
| L64 | `const resumeDiagnosisResult = ref<any>(null)` | 定义 `ResumeDiagnosisResult` 接口 |
| L132 | `function mapUserData(apiUser: any)` | 定义 `ApiUser` 接口（含 `id`, `username`, `email`, `profile`, `roles` 等字段） |

#### [Profile.vue](file:///d:/code/MianMianMaster/src/views/Profile.vue) — 3 处

| 行号 | 当前代码 | 建议 |
|------|---------|------|
| L122 | `const currentBank = ref<any>(null)` | 定义 `QuestionBank` 接口 |
| L123 | `const currentMistake = ref<any>(null)` | 定义 `MistakeItem` 接口 |
| L124 | `const currentLevel = ref<any>(null)` | 定义 `GameLevel` 接口 |

#### [Matching.vue](file:///d:/code/MianMianMaster/src/views/Matching.vue) — 3 处

| 行号 | 当前代码 | 建议 |
|------|---------|------|
| L378 | `const selectedJob = ref<any>(null)` | 定义 `JobPosition` 接口 |
| L384 | `const assessmentResult = ref<any>(null)` | 定义 `AssessmentResult` 接口 |
| L394 | `const learningPlanResult = ref<any>(null)` | 定义 `LearningPlan` 接口 |

#### [Knowledge.vue](file:///d:/code/MianMianMaster/src/views/Knowledge.vue) — 3 处

| 行号 | 当前代码 | 建议 |
|------|---------|------|
| L746 | `const selectedResource = ref<any>(null)` | 定义 `KnowledgeResource` 接口 |
| L747 | `const selectedSubcategory = ref<any>(null)` | 定义 `Subcategory` 接口 |
| L749 | `const selectedAnalysis = ref<any>(null)` | 定义 `AnalysisResult` 接口 |

#### [Growth.vue](file:///d:/code/MianMianMaster/src/views/Growth.vue) — 4 处

| 行号 | 当前代码 | 建议 |
|------|---------|------|
| L32 | `const selectedResource = ref<any>(null)` | 定义 `LearningResource` 接口 |
| L33 | `const selectedWrongQuestion = ref<any>(null)` | 定义 `WrongQuestion` 接口 |
| L34 | `const selectedLearningPlan = ref<any>(null)` | 定义 `LearningPlan` 接口 |
| L35 | `const selectedQuestionBank = ref<any>(null)` | 定义 `QuestionBankSummary` 接口 |

#### [Community.vue](file:///d:/code/MianMianMaster/src/views/Community.vue) — 2 处

| 行号 | 当前代码 | 建议 |
|------|---------|------|
| L61 | `const selectedCourse = ref<any>(null)` | 定义 `Course` 接口 |
| L68 | `const selectedArchive = ref<any>(null)` | 定义 `Archive` 接口 |

#### 已记录为合理例外（无需修改）

| 位置 | 代码 | 原因 |
|------|------|------|
| user.ts:L91, L111, L177, L189, L201, L213, L225 | `catch (err: any)` | TypeScript 语言限制，catch 子句类型无法推断 |
| LoginForm.vue:L72 | `catch (err: any)` | 同上 |
| vite-env.d.ts:L5 | `DefineComponent<{}, {}, any>` | Vue 声明文件标准写法 |

### 修复操作

#### 🔴 FIX-06：为所有 `ref<any>` 定义具体类型

**推荐方案**：在对应 Store 或 `api/types/` 目录下定义接口，然后在组件中使用。如果后端 Schema 尚未固定导致无法定义精确类型，至少使用 `ref<Record<string, unknown> | null>(null)` 作为过渡方案（优于 `any`）。

**操作清单**：
- [ ] user.ts L62-64, L132 — 在 `api/types/user.types.ts` 中补充类型定义
- [ ] Profile.vue L122-124 — 引入对应接口
- [ ] Matching.vue L378, L384, L394 — 引入对应接口
- [ ] Knowledge.vue L746-749 — 引入对应接口
- [ ] Growth.vue L32-35 — 引入对应接口
- [ ] Community.vue L61, L68 — 引入对应接口

#### 🟡 FIX-07：规约 §5 补充 `any` 例外说明

在 [ai-vibecoding-specification.md](file:///d:/code/MianMianMaster/.trae/rules/ai-vibecoding-specification.md) §5 增加：

```
- catch 子句的 any 属于 TypeScript 语言限制，允许使用
- ref 和函数参数禁止使用 any，必须定义具体类型；待后端 Schema 未确定时可使用 Record<string, unknown> 过渡
```

---

## 三、路由规范：规约 §7 / §12 / §17 修复

#### 🔴 FIX-08：[router/index.ts](file:///d:/code/MianMianMaster/src/router/index.ts) 统一使用 `@/` 别名导入

**当前代码（全部使用相对路径）**：

```typescript
// L2-5 同步导入
import Home from '../views/Home.vue'
import LoginForm from '../components/LoginForm.vue'
import { useUserStore } from '../stores/user'
import { isLoggedIn as checkTokenExists } from '../utils/auth'

// L7-19 懒加载导入
const Interview = () => import('../views/Interview.vue')
const Profile = () => import('../views/Profile.vue')
// …共 12 个类似
```

**应改为**：

```typescript
import Home from '@/views/Home.vue'
import LoginForm from '@/components/LoginForm.vue'
import { useUserStore } from '@/stores/user'
import { isLoggedIn as checkTokenExists } from '@/utils/auth'

const Interview = () => import('@/views/Interview.vue')
const Profile = () => import('@/views/Profile.vue')
// …其余同理
```

**影响范围**：router/index.ts 全部 16 个 import（2 个同步 + 12 个懒加载 + 2 个工具/Store 导入）。

---

#### 🔴 FIX-09：[LoginForm.vue](file:///d:/code/MianMianMaster/src/components/LoginForm.vue) 调整 SFC 标签顺序

**当前**：`<template>`(L1) → `<script setup>`(L47)（无 `<style>`）

**应改为**：

```vue
<script setup lang="ts">
<!-- 原有脚本内容 -->
</script>

<template>
<!-- 原有模板内容 -->
</template>
```

**影响范围**：仅 LoginForm.vue 一个文件。

---

#### 🔴 FIX-10：Home 路由改为懒加载

**当前** [router/index.ts](file:///d:/code/MianMianMaster/src/router/index.ts#L2)：
```typescript
import Home from '../views/Home.vue'
```

**应改为**：
```typescript
// 删除顶部同步 import
// 在懒加载区域添加：
const Home = () => import('@/views/Home.vue')
```

> **是否也改 LoginForm？** LoginForm 是高频入口组件（登录页），同步加载可避免登录页白屏闪烁。规约 §17 的"强制 Must"未区分场景，建议团队明确：**登录页等高频入口路由是否豁免懒加载**，如豁免则在规约 §17 补充说明。

---

## 四、样式与动画：规约 §14 修复

#### 🟡 FIX-11：规约 §14 过渡动画示例修正

**问题**：规约 §14 正例使用 `<style scoped>`，但 [App.vue](file:///d:/code/MianMianMaster/src/App.vue#L232) 实际使用 `<style>`（非 scoped）。

**原因**：页面过渡动画作用在 `<router-view>` 内部动态组件上，`scoped` 属性会添加 data 属性哈希导致样式无法穿透到子组件。

**修复**：更新规约 §14 的"强制 Must"条目为：

```
- 强制 Must: 组件内部动画 CSS 定义在 <style scoped> 中使用 @keyframes
- 强制 Must: 页面级过渡动画（如 router-view 切换）使用非 scoped 的 <style> 块（因 scoped 无法穿透动态组件）
```

并更新对应正例的 `<style scoped>` → `<style>`，补充注释说明。

---

## 五、日志与调试：规约 §16 修复

#### 🟡 FIX-12：`console.error` 添加环境变量控制

**问题文件**：

| 文件 | 行号 | 示例 |
|------|------|------|
| [user.ts](file:///d:/code/MianMianMaster/src/stores/user.ts) | L127, L178, L190, L202, L214, L226 | `console.error('[UserStore] fetchUserInfo error:', err)` |
| [http.ts](file:///d:/code/MianMianMaster/src/utils/http.ts) | L72, L135, L138, L141, L144, L147, L149, L151 | `console.error('[API Error] 没有权限访问')` 等 |

**修复**：将所有 `console.error` 包裹在 `VITE_ENABLE_DEBUG_LOG` 检查中：

```typescript
const DEBUG = import.meta.env.VITE_ENABLE_DEBUG_LOG === 'true'
// ...
if (DEBUG) {
  console.error('[UserStore] fetchUserInfo error:', err)
}
```

> 如果某些 `console.error`（如 401 跳转前的错误日志）需要在生产环境保留用于错误监控，则使用 `VITE_ENABLE_ERROR_MONITOR` 控制，并在规约 §16 明确分级策略。

#### 🟡 FIX-13：规约 §16 明确日志分级策略

在规约 §16 补充：

```
- console.log → 生产环境严禁，通过 VITE_ENABLE_DEBUG_LOG 控制
- console.warn → 生产环境通过 VITE_ENABLE_DEBUG_LOG 控制（与 console.log 同级）
- console.error → 通过 VITE_ENABLE_ERROR_MONITOR 控制是否上报，关键错误（如认证失效）可在 VITE_ENABLE_ERROR_MONITOR 为 false 时仍保留
```

---

## 六、完整修复清单汇总

### 🔴 高优先级（影响代码正确性和规约权威性）

| 编号 | 类别 | 操作 | 涉及文件 |
|------|------|------|----------|
| FIX-01 | `.env` | 创建 `.env` 或更新规约删除其描述 | `.env`（新建）或 `.trae/rules/ai-vibecoding-specification.md` |
| FIX-02 | `.env.development` | 规约补充 5 个遗漏变量，修正 `VITE_API_BASE_URL` 值 | `.trae/rules/ai-vibecoding-specification.md` |
| FIX-03 | `.env.production` | 规约补充 3 个遗漏变量 + 处理 `VITE_CDN_URL` / `VITE_ENABLE_ERROR_MONITOR` 去留 | `.trae/rules/ai-vibecoding-specification.md`（+ 可选 `.env.production`） |
| FIX-04 | `.env.staging` | 规约新增 staging 文件描述 | `.trae/rules/ai-vibecoding-specification.md` |
| FIX-06 | `any` 类型 | 为 18 处 `ref<any>` 定义具体类型 | `user.ts`, `Profile.vue`, `Matching.vue`, `Knowledge.vue`, `Growth.vue`, `Community.vue` |
| FIX-08 | 路由导入 | 16 处 import 改为 `@/` 别名 | `src/router/index.ts` |
| FIX-09 | SFC 顺序 | `<script>` 移到 `<template>` 前 | `src/components/LoginForm.vue` |
| FIX-10 | 懒加载 | Home 改为动态 import | `src/router/index.ts` |

### 🟡 中优先级（文档对齐和代码优化）

| 编号 | 类别 | 操作 | 涉及文件 |
|------|------|------|----------|
| FIX-05 | Proxy 配置 | 规约 §11 示例删除 `rewrite` 行 | `.trae/rules/ai-vibecoding-specification.md` |
| FIX-07 | 类型规范 | 规约 §5 补充 `any` 例外说明 | `.trae/rules/ai-vibecoding-specification.md` |
| FIX-11 | 动画规范 | 规约 §14 区分 scoped / 非 scoped 使用场景 | `.trae/rules/ai-vibecoding-specification.md` |
| FIX-12 | 日志控制 | `console.error` 添加 DEBUG 包裹 | `src/stores/user.ts`, `src/utils/http.ts` |
| FIX-13 | 日志规范 | 规约 §16 明确分级策略 | `.trae/rules/ai-vibecoding-specification.md` |

---

## 七、修复后验证清单

所有修复完成后，依次执行：

```
1. Glob .env* 确认文件结构符合预期
2. grep -rn "ref<any>" src/ 确认零匹配（合理例外除外）
3. grep -rn "from '\.\." src/router/ 确认无相对路径导入
4. grep -rn "import.*from '\.\." src/components/LoginForm.vue 确认无相对路径
5. vue-tsc --noEmit → 零错误
6. vite build → 构建成功
7. pnpm lint → 零警告零错误
```

---

*生成日期: 2026-05-31*
*基于: 原审查报告 + 补充全局搜索核查*