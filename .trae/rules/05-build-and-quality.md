---
alwaysApply: false
description: 构建与质量管理规范。包含构建验证流程（vue-tsc + vite build + 浏览器验证）、日志调试策略、性能优化（懒加载、v-for key、tree-shaking）、测试策略（vitest/Playwright）、Git 分支与提交规范（Conventional Commits）以及 CodeReview 门禁要求。
---
# 05 — 构建与质量管理规范

> 适用范围：所有代码提交前的验证流程、日志策略、性能优化、测试编写及 Git 工作流。

---

## 1. 🔴 构建验证（踩坑提炼）

> **背景**: `vue-tsc --noEmit` 和 `vite build` 均通过，但浏览器运行时崩溃。原因是 Vue SFC 的模板编译在 build 阶段不检查变量是否在 `setup` 中定义。

- **强制 Must**: 每次代码变更后，**必须**执行以下验证：
  1. `vue-tsc --noEmit` — TypeScript 类型检查零错误
  2. `vite build` — 生产构建成功
  3. **浏览器实际访问受影响页面** — 无控制台报错（⚠️ 构建通过 ≠ 运行时无错）
- **强制 Must**: 新增文件或修改导入路径后，**必须**确认 `tsconfig.app.json` 的 `paths` 配置能正确解析。
- **强制 Must**: 每个 Phase 完成后，**必须**启动 `vite dev` 并在浏览器中逐页验证。
- **推荐 Should**: 验证清单：登录页 → 首页 → 社区页 → 个人中心页 → 能力提升页 → 知识库页。

---

## 2. 日志与调试规范

- **强制 Must**: 调试日志统一通过 `VITE_ENABLE_DEBUG_LOG` 环境变量控制开关。
- **强制 Must**: 生产环境禁止输出 `console.log`，错误信息通过 `VITE_ENABLE_ERROR_MONITOR` 控制是否上报。
- **强制 Must**: 日志分级策略：`console.log` / `console.warn` 通过 `VITE_ENABLE_DEBUG_LOG` 控制；`console.error` 同样通过 `VITE_ENABLE_DEBUG_LOG` 控制，关键错误（如认证失效 401）可在 `VITE_ENABLE_DEBUG_LOG` 为 false 时仍保留。
- **推荐 Should**: 开发环境使用 `console.debug` / `console.warn` 分级输出，生产构建时通过 Vite 配置自动移除。

**正例**:
```typescript
if (import.meta.env.VITE_ENABLE_DEBUG_LOG === 'true') {
  console.debug('[InterviewStore] startInterview:', job_title)
}
```

**反例**: 在代码中直接使用 `console.log(user.password)` 输出敏感信息。

---

## 3. 性能规约

- **强制 Must**: 路由组件必须使用动态 `import()` 进行懒加载，避免首屏打包体积过大（豁免规则见 [03 — Vue 组件开发规范 §5](./03-vue-component.md)）。
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

---

## 4. 测试策略

- **强制 Must**: 核心 Store 逻辑必须编写单元测试。
- **推荐 Should**: 使用 `vitest`（与 Vite 生态一致）编写单元测试，测试文件与源文件同目录或放在 `tests/` 目录下。
- **推荐 Should**: 关键用户流程编写 E2E 测试（如 Playwright）。

---

## 5. 分支与提交信息

- **强制 Must**: 分支命名遵循 `feature/xxx`、`bugfix/xxx`、`hotfix/xxx` 规范。
- **强制 Must**: 提交信息遵循 Conventional Commits 规范（如 `feat(interview): add AI scoring panel`、`fix(router): resolve navigation guard loop`）。

**正例**: `feat(stores): 新增面试会话状态管理`
**反例**: `update code`、`fix bug`

---

## 6. CodeReview 门禁

- **强制 Must**: 所有代码合入前必须通过 ESLint + Prettier 检查（0 警告 0 错误）。
- **强制 Must**: TypeScript 编译无错误（`vue-tsc -b` 通过）。
- **强制 Must**: Vite 生产构建成功（`vite build` 无报错）。

**正例**: 提交前运行 `pnpm build`（含 `vue-tsc -b && vite build`）和 ESLint 检查。
**反例**: 跳过类型检查直接推送代码。

---

## 相关文档

- [01 — 核心架构与基础规范](./01-core-architecture.md)
- [03 — Vue 组件开发规范](./03-vue-component.md)
- [06 — AI 协作与交接规范](./06-ai-handover.md)