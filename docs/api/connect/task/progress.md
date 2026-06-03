# 前后端契约漂移修复 — 总体进度文档

> **项目**: MianMianMaster 前后端 API 契约漂移修复  
> **契约基准文档**: [api-contract-summary.md](./api-contract-summary.md)（从 `openapi.json` 自动提取，共 94 个端点）  
> **最后更新**: 2026-06-03  
> **总模块数**: 11  
> **总端点数**: 按 OpenAPI 规范共 94 个端点，修复范围覆盖 72 个核心端点（按优先级分 4 个阶段）  
> **修复策略**: 按优先级顺序(P0 → P1 → P2 → P3)，每阶段完成后在浏览器逐页验证

---

## 一、项目目标与范围

### 目标

消除前端代码与后端 API 契约之间的所有不一致（契约漂移），确保：

1. 前端类型定义与后端 OpenAPI 规范 100% 对齐
2. API 调用函数的参数/返回值类型完全匹配
3. 业务组件正确适配最新的接口字段定义
4. 所有接口通过前后端联调验证

### 范围

修复范围覆盖 `api-contract-summary.md` 中列出的所有 11 个模块共 94 个端点。根据业务重要性和依赖关系，划分为 4 个阶段按周推进。

### 标准修复流程

```
┌─────────────────────────────────────────────────────────┐
│ Step 1: 从 api-contract-summary.md 获取最新字段定义       │
│   ↓                                                      │
│ Step 2: 与前端现有代码进行详细 Diff 分析，识别契约漂移点    │
│   ↓                                                      │
│ Step 3: 按顺序实施修复                                     │
│   ├── 3a. 更新前端类型文件 (*.types.ts / *.d.ts)           │
│   ├── 3b. 更新 API 调用函数 (参数和返回类型对齐)            │
│   └── 3c. 更新相关业务组件 (适配新接口定义)                 │
│   ↓                                                      │
│ Step 4: 前后端联调验证 (浏览器逐页验证 + curl/Postman)      │
└─────────────────────────────────────────────────────────┘
```

---

## 二、阶段划分概览

| 阶段 | 周期 | 模块 | 优先级 | 端点数 | 子任务文档 | 状态 |
|------|------|------|--------|--------|------------|------|
| Week 1 | 第1周 | Auth + User + Job | P0 | 18 | [week1-auth-user-job.md](./week1-auth-user-job.md) | 🔴 待启动 |
| Week 2 | 第2周 | Assessment + Learning + Interview + Notification | P1 | 28 | [week2-assessment-learning-interview-notification.md](./week2-assessment-learning-interview-notification.md) | 🔴 待启动 |
| Week 3 | 第3周 | Community | P2 | 9 | [week3-community.md](./week3-community.md) | 🔴 待启动 |
| Week 4 | 第4周 | Business + Role + System | P3 | 17 | [week4-business-role-system.md](./week4-business-role-system.md) | 🔴 待启动 |

> **说明**: 端点计数以 `api-contract-summary.md` 中的实际接口数量为准。P0 为所有功能的前置依赖，必须最先完成。

---

## 三、总体进度跟踪

### 3.1 模块进度总览

| # | 模块 | 优先级 | 阶段 | 端点数 | 契约漂移点 (待识别) | 修复完成率 | 联调验证 | 状态 |
|---|------|--------|------|--------|---------------------|------------|----------|------|
| 1 | Auth（认证） | P0 | Week 1 | 10 | - | 0% | [ ] | 🔴 待启动 |
| 2 | User（用户） | P0 | Week 1 | 9 | - | 0% | [ ] | 🔴 待启动 |
| 3 | Job（岗位） | P0 | Week 1 | 4 | - | 0% | [ ] | 🔴 待启动 |
| 4 | Assessment（测评） | P1 | Week 2 | 4 | - | 0% | [ ] | 🔴 待启动 |
| 5 | Learning（学习） | P1 | Week 2 | 14 | - | 0% | [ ] | 🔴 待启动 |
| 6 | Interview（面试） | P1 | Week 2 | 11 | - | 0% | [ ] | 🔴 待启动 |
| 7 | Notification（通知） | P1 | Week 2 | 8 | - | 0% | [ ] | 🔴 待启动 |
| 8 | Community（社区） | P2 | Week 3 | 12 | - | 0% | [ ] | 🔴 待启动 |
| 9 | Business（业务配置） | P3 | Week 4 | 9 | - | 0% | [ ] | 🔴 待启动 |
| 10 | Role（权限管理） | P3 | Week 4 | 5 | - | 0% | [ ] | 🔴 待启动 |
| 11 | System（系统管理） | P3 | Week 4 | 5 | - | 0% | [ ] | 🔴 待启动 |

> **状态图例**: 🔴 待启动 | 🟡 进行中 | 🟢 已完成 | ⚪ 已跳过

### 3.2 阶段里程碑

| 阶段 | 计划开始 | 计划完成 | 实际开始 | 实际完成 | 完成率 | 状态 |
|------|----------|----------|----------|----------|--------|------|
| Week 1: P0 核心基建 | - | - | - | - | 0% | 🔴 |
| Week 2: P1 主业务流程 | - | - | - | - | 0% | 🔴 |
| Week 3: P2 增值功能 | - | - | - | - | 0% | 🔴 |
| Week 4: P3 管理后台 | - | - | - | - | 0% | 🔴 |

### 3.3 总体质量指标

| 指标 | 目标 | 当前值 | 状态 |
|------|------|--------|------|
| TypeScript 编译零错误 (`vue-tsc --noEmit`) | 0 errors | 待验证 | [ ] |
| Vite 构建成功 (`vite build`) | 通过 | 待验证 | [ ] |
| 契约对齐率 | 100% | 0% | [ ] |
| 浏览器逐页验证通过率 | 100% | 0% | [ ] |
| Mock 模式可用 | 所有模块 | 待验证 | [ ] |

---

## 四、全局质量检查清单

每个阶段完成后，必须执行以下验证项：

### 4.1 代码质量

- [ ] **TypeScript 类型检查**: `vue-tsc --noEmit` 零错误
- [ ] **构建验证**: `vite build` 构建成功
- [ ] **类型定义准确性**: 所有接口类型字段与 `api-contract-summary.md` 一致
- [ ] **命名规范**: 字段名使用 `snake_case` 与后端对齐，禁止混用 `camelCase`
- [ ] **导入路径**: 使用 `@/` 别名，禁止跨目录相对路径
- [ ] **any 使用审查**: 仅在 `catch` 子句中使用 `any`，其余使用明确类型或 `Record<string, unknown>`

### 4.2 功能完整性

- [ ] **API 函数签名**: 所有 API 函数参数/返回值类型与契约一致
- [ ] **Mock 数据**: 所有端点均有 Mock handler 覆盖
- [ ] **Store 层对接**: 所有 View 层通过 Store 访问数据，无直接调用 API
- [ ] **错误处理**: 网络错误/超时/401/业务错误均有友好提示
- [ ] **路由守卫**: 受保护页面的认证拦截正常

### 4.3 浏览器逐页验证

按以下页面顺序逐页验证，确保所有功能正常：

- [ ] **登录页** (`/login`): 账号登录、短信登录、注册、密码重置
- [ ] **首页** (`/`): 功能卡片、数据展示
- [ ] **社区页** (`/community`): 帖子列表、发帖、评论、点赞
- [ ] **个人中心页** (`/profile`): 用户信息、简历、历史记录
- [ ] **能力提升页** (`/practice`): 题库、学习进度
- [ ] **知识库页** (`/knowledge`): 技能树、岗位匹配
- [ ] **面试页** (`/interview`): 会话创建、SSE 对话、报告

### 4.4 Mock/真实后端切换

- [ ] **Mock 模式** (`VITE_USE_MOCK=true`): 所有页面正常渲染
- [ ] **真实后端模式** (`VITE_USE_MOCK=false`): Vite Proxy 代理正常工作
- [ ] **Token 刷新**: 401 自动刷新 Token，队列请求重放
- [ ] **多标签页同步**: 登出/登录状态跨标签页同步

---

## 五、风险与问题记录

### 5.1 已知风险

| # | 风险 | 影响模块 | 严重度 | 对策 | 状态 |
|---|------|----------|--------|------|------|
| R1 | 后端服务未就绪或部分端点未实现 | 全部 | 🔴 高 | 优先使用 Mock 模式验证前端；标记未就绪端点 | [ ] 待处理 |
| R2 | Auth/User 模块阻塞所有后续阶段 | Auth, User | 🔴 高 | Week1 优先集中资源完成 | [ ] 待处理 |
| R3 | SSE 流式对话为技术难点 | Interview | 🟡 中 | 已有 Vite SSE Mock 插件，优先 Mock 验证 | [ ] 待处理 |
| R4 | Celery/LLM 异步任务可能未就绪 | Assessment, Interview, Community | 🟡 中 | 同步端点优先验证，异步任务暂用 Mock | [ ] 待处理 |
| R5 | Business/Role/System 模块缺少 Mock handler | Business, Role, System | 🟡 中 | Week 4 前补充 Mock 数据 | [ ] 待处理 |
| R6 | Job 模块无独立 Store | Job | 🟢 低 | 评估是否需要新建 `jobStore` | [ ] 待处理 |
| R7 | 部分 View 页面仍使用硬编码数据 | Matching, Growth, Report | 🟢 低 | 在对应阶段逐步替换为 Store 数据 | [ ] 待处理 |
| R8 | SMS 服务可能未配置 | Auth | 🟢 低 | 短信登录部分可暂不验证 | [ ] 待处理 |

### 5.2 问题记录

| # | 日期 | 问题描述 | 影响 | 解决方案 | 状态 |
|---|------|----------|------|----------|------|
| - | - | 暂无 | - | - | - |

---

## 六、关键依赖关系

```
Auth (认证) ─────── 所有功能的前置依赖
  ├── User (用户) ─── 依赖于 Auth
  ├── Job (岗位) ──── 依赖于 Auth + User
  │   ├── Assessment (测评) ─── 依赖于 User + Job
  │   └── Interview (面试) ──── 依赖于 User + Job
  ├── Learning (学习) ─── 依赖于 Auth
  ├── Notification (通知) ─── 依赖于 Auth + User
  ├── Community (社区) ──── 依赖于 Auth + User
  ├── Business (业务配置) ── 依赖于 Auth (管理后台)
  ├── Role (权限管理) ──── 依赖于 Auth (管理后台)
  └── System (系统管理) ── 依赖于 Auth (管理后台)
```

---

## 七、相关文档索引

| 文档 | 路径 | 说明 |
|------|------|------|
| API 契约摘要 | [api-contract-summary.md](./api-contract-summary.md) | 修复基准文档 |
| Week 1 子任务 | [week1-auth-user-job.md](./week1-auth-user-job.md) | Auth + User + Job (P0) |
| Week 2 子任务 | [week2-assessment-learning-interview-notification.md](./week2-assessment-learning-interview-notification.md) | Assessment + Learning + Interview + Notification (P1) |
| Week 3 子任务 | [week3-community.md](./week3-community.md) | Community (P2) |
| Week 4 子任务 | [week4-business-role-system.md](./week4-business-role-system.md) | Business + Role + System (P3) |
| 前端开发规约 | [frontend-development-specification.md](../../../.trae/rules/frontend-development-specification.md) | 核心架构与技术栈 |
| 前期联调交接 | [handover.md](../handover.md) | 历史修复记录与踩坑经验 |

---

## 八、变更记录

| 日期 | 变更 | 作者 |
|------|------|------|
| 2026-06-03 | 初始化契约漂移修复总体进度文档 | AI |