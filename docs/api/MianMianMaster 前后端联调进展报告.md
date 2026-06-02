# MianMianMaster 前后端联调进展报告

> **报告日期**: 2026-06-02\
> **联调就绪度**: **\~95%**（前端基础设施）
> **后端服务状态**: 部分可用（Swagger UI 可访问，但 `/auth/login` 超时）

***

## 一、总体进度概览

| 阶段          | 名称                           | 状态         | 完成日期       |
| :---------- | :--------------------------- | :--------- | :--------- |
| Phase 1     | 基础设施搭建（HTTP/类型/API/环境）       | ✅ 完成       | 2026-05-10 |
| Phase 2     | 认证系统对接（Store/路由守卫/LoginForm） | ✅ 完成       | 2026-05-10 |
| Phase 3     | Mock 数据迁移（6 模块 + 适配器）        | ✅ 完成       | 2026-05-10 |
| Phase 4     | Store 层重构与 View 层对接          | ✅ 完成       | 2026-05-10 |
| Phase 5     | 优化收尾（骨架屏/错误边界/懒加载）           | ✅ 完成       | 2026-05-10 |
| —           | API 基础设施联调审查                 | ✅ 完成       | 2026-05-31 |
| —           | 前端接口缺陷修复（16项）                | ✅ 完成       | 2026-06-01 |
| —           | Auth 模块代码对齐                  | ✅ 完成       | 2026-06-02 |
| **Phase 6** | **逐模块联调**                    | **🔄 进行中** | —          |

***

## 二、已完成的前端基础设施

### 2.1 API 服务层覆盖

前端已实现 **11 个 API 模块**，对应后端全部 73 个端点：

| API 模块                | 端点 | 类型定义 | Mock 数据 | Mock Handler | Store 对接              |
| :-------------------- | :- | :--- | :------ | :----------- | :-------------------- |
| `auth.api.ts`         | 10 | ✅    | ✅       | ✅            | ✅ `userStore`         |
| `user.api.ts`         | 9  | ✅    | ✅       | ✅            | ✅ `userStore`         |
| `job.api.ts`          | 4  | ✅    | ✅       | ✅            | 🟡 无独立 Store          |
| `assessment.api.ts`   | 4  | ✅    | ✅       | ✅            | ✅ `assessmentStore`   |
| `learning.api.ts`     | 15 | ✅    | ✅       | ✅            | ✅ `learningStore`     |
| `interview.api.ts`    | 13 | ✅    | ✅       | ✅            | ✅ `interviewStore`    |
| `community.api.ts`    | 12 | ✅    | ✅       | ✅            | ✅ `communityStore`    |
| `notification.api.ts` | 7  | ✅    | ✅       | ✅            | ✅ `notificationStore` |
| `system.api.ts`       | 5  | ✅    | ✅       | ✅            | —                     |
| `business.api.ts`     | 9  | ✅    | ❌       | ❌            | —                     |
| `role.api.ts`         | 5  | ✅    | ❌       | ❌            | —                     |

### 2.2 关键技术特性

| 特性                                  | 状态 |
| :---------------------------------- | :- |
| JWT Token 自动注入                      | ✅  |
| Token 自动刷新（`isRefreshing` 锁 + 请求队列） | ✅  |
| 请求自动重试（2 次，指数退避）                    | ✅  |
| SSE 流式对话（fetch + ReadableStream）    | ✅  |
| SSE Mock 中间件（Vite 插件）               | ✅  |
| 响应拦截器自动解包                           | ✅  |
| 统一错误处理（网络/超时/业务错误）                  | ✅  |
| API 耗时监控（`getApiMetrics()`）         | ✅  |
| XSS 防护（模板转义，无 `v-html` 渲染用户内容）      | ✅  |
| 敏感数据脱敏（日志不打印 password/token）        | ✅  |
| 多标签页登录状态同步（`useCrossTabSync`）       | ✅  |

***

## 三、正在进行联调的功能点

### 3.1 Auth 模块（P0，最早联调）— 代码对齐完成，浏览器验证待做

| 步骤                                                                        | 状态                                    |
| :------------------------------------------------------------------------ | :------------------------------------ |
| 10 个端点签名对齐（通过 OpenAPI 逐一比对）                                               | ✅                                     |
| 类型定义对齐（`refresh_token`、`RefreshTokenRequest` 新增）                          | ✅                                     |
| 注册 API 验证（curl 调用成功）                                                      | ✅                                     |
| 代码修复（`login()` 保存 `refresh_token`、`logout()` 调 API、`http.ts` 刷新保存新 token） | ✅                                     |
| 错误处理改进（网络/超时中文提示）                                                         | ✅                                     |
| `swaggerLogin()` 废弃方法清理                                                   | ✅                                     |
| 浏览器端到端验证（登录/路由守卫/Token持久化/刷新）                                             | ⚠️ **阻塞于后端** **`/auth/login`** **超时** |

**阻塞项**: 后端 `POST /api/v1/auth/login` 端点超时（60s+），`/auth/register` 和 `/health` 正常。疑似 bcrypt 哈希耗时过长或数据库连接问题。

### 3.2 View 层 Store 对接状态

| 页面                              | Store 对接                                   | 硬编码数据        |
| :------------------------------ | :----------------------------------------- | :----------- |
| Profile.vue                     | ✅ `useUserStore` + `useLearningStore`      | 无            |
| Community.vue                   | ✅ `useCommunityStore` + `useLearningStore` | 无            |
| GameInterview\.vue              | ✅ `useInterviewStore`                      | 无            |
| Knowledge.vue                   | ✅ `useKnowledgeStore`                      | 静态分类导航保留     |
| Practice.vue                    | ✅ `usePracticeStore`                       | 无            |
| **Growth.vue**                  | **🟡 部分**                                  | 大量（图表数据复杂）   |
| **Matching.vue**                | **🟡 部分**                                  | 大量（5个岗位匹配结果） |
| **Interview\.vue**              | **🟡 部分**                                  | 面试流程动态数据     |
| **LevelChallenge.vue**          | **❌**                                      | 中（5关卡/面试问题）  |
| **LevelDetail.vue**             | **❌**                                      | 小            |
| **JobSpecificQuestionBank.vue** | **🟡** 通过 jobApi                           | 大量           |
| **PathPractice.vue**            | **🟡** 通过 learningStore                    | 小            |
| **Report.vue**                  | **🟡** 通过 assessmentStore                  | 中            |
| **Home.vue**                    | **🟡** 通过 systemApi                        | 中            |

***

## 四、尚未开始联调的任务项

根据 `docs/api/tasks/progress.md`，除 Auth 外其余 10 个模块的**逐模块联调任务**均尚未开始：

| 优先级 | 模块                 | 端点数 | 子任务数 | 状态    |
| :-- | :----------------- | :-- | :--- | :---- |
| P0  | User（用户中心）         | 4   | \~25 | ⬜ 待开始 |
| P0  | Job & Skill（岗位技能树） | 4   | \~15 | ⬜ 待开始 |
| P1  | Assessment（测评）     | 2   | \~15 | ⬜ 待开始 |
| P1  | Learning（学习）       | 14  | \~30 | ⬜ 待开始 |
| P1  | Interview（面试）      | 8   | \~35 | ⬜ 待开始 |
| P1  | Notification（通知）   | 4   | \~20 | ⬜ 待开始 |
| P2  | Community（社区）      | 9   | \~25 | ⬜ 待开始 |
| P3  | Business（业务配置）     | 9   | \~15 | ⬜ 待开始 |
| P3  | Role（权限管理）         | 5   | \~15 | ⬜ 待开始 |
| P3  | System（系统管理）       | 3   | \~15 | ⬜ 待开始 |

**总计约 180 个子任务**，目前仅有 Auth 模块完成了代码侧对齐（尚未完成浏览器端验证）。

***

## 五、联调过程中遇到的主要问题及解决方案

### 5.1 已解决的问题

| #  | 问题                             | 严重度         | 解决方案                                                |
| :- | :----------------------------- | :---------- | :-------------------------------------------------- |
| 1  | Token 响应缺少 `refresh_token`     | 🔴 P0       | 类型定义补全 + `login()` 保存 + `http.ts` 刷新时同步保存           |
| 2  | 登出接口未实现                        | 🔴 P0       | 新增 `authApi.logout()`，`userStore.logout()` 改为 async |
| 3  | `SkillTreeNode` 缺失高亮标记         | 🔴 P0       | 补充 `is_required` + `has_required_child`             |
| 4  | 帖子缺 `category`/评论缺 `parent_id` | 🔴 P0       | 类型补全 + API 方法补充                                     |
| 5  | 帖子编辑/删除接口缺失                    | 🔴 P0       | 新增 `editPost()` + `deletePost()`                    |
| 6  | AI 点评内容无法获取                    | 🟡 P1       | `AiReviewResult` + `Post` 补 `ai_review_content`     |
| 7  | 测评题目模型缺失                       | 🟡 P1       | 新增 `AssessmentQuestion` + `AssessmentSubmit` 类型     |
| 8  | Business/Role 模块 API 全缺失       | 🟡 P1       | 新建 4 个文件（types + api 模块）                            |
| 9  | `user.api.ts` 5 个 `any` 返回类型   | 🟡 P1       | 新增 14 个具体类型定义                                       |
| 10 | Store 重构后模板遗留旧变量名              | 🔴 Critical | 全局搜索替换 + 浏览器逐页验证                                    |
| 11 | ECharts + `v-if` 生命周期问题        | 🟡 High     | `watch` + `nextTick` + `dispose()`                  |
| 12 | Router-view Component 为 null   | 🟡 High     | `<component :is="Component" v-if="Component" />`    |
| 13 | ECharts 重复初始化警告                | 🟡 High     | 所有 `echarts.init()` 前先 `dispose()`                  |
| 14 | `ResponseModel` 默认泛型 `any`     | 🟢 P2       | 改为 `unknown`                                        |
| 15 | 错误消息不区分网络/超时                   | 🟢 P2       | 引入 `isNetworkError`/`isTimeoutError`                |

### 5.2 当前阻塞项

| #   | 问题                              | 严重度   | 说明                                                            |
| :-- | :------------------------------ | :---- | :------------------------------------------------------------ |
| B-1 | **后端** **`/auth/login`** **超时** | 🔴 P0 | 60s+ 超时，注册和健康检查正常。阻塞所有登录相关浏览器验证                               |
| B-2 | **16 个前端已实现端点后端未声明**            | 🟡 P1 | 包括 User×5、Interview 游戏化×5、Notification×3、Community×2、System×1 |
| B-3 | **7 项 P0 后端字段需补齐**              | 🔴 P0 | `interview-history` 响应缺少 `tags/feedback/details`              |
| B-4 | **`problem_solving`** **命名不一致** | 🔴 P0 | 类型使用 snake\_case 但模板使用 camelCase，无运行时转换层                      |
| B-5 | **Business/Role 模块无 Mock 支持**   | 🟢 P2 | P3 管理后台模块暂无 Mock handler                                      |
| B-6 | **Token 刷新机制缺少后端 refresh 端点实测** | 🟡 P1 | 代码已就绪，需后端登录就绪后验证                                              |

***

## 六、测试覆盖率

### 6.1 单元测试 + 集成测试

| 测试类别       | 文件数   | 用例数    | 覆盖范围                                                                  |
| :--------- | :---- | :----- | :-------------------------------------------------------------------- |
| 工具函数单元测试   | 5     | 45     | auth / error / storage / http / request                               |
| Store 集成测试 | 4     | 51     | user(5) / community(5) / learning(5) / interview(18) / (含 Mock API 层) |
| **合计**     | **9** | **96** | —                                                                     |

### 6.2 构建验证

| 验证项                       | 结果             |
| :------------------------ | :------------- |
| `vue-tsc --noEmit` 类型检查   | ✅ 零错误          |
| `vite build` 生产构建         | ✅ 通过（\~17.67s） |
| ECharts 按需引入（-51% bundle） | ✅ 534KB        |
| axios-mock-adapter 生产排除   | ✅ 0KB          |
| 首屏 JS 优化（懒加载 + 分包）        | ✅ 54kB         |

### 6.3 尚未覆盖的测试

- ❌ E2E 浏览器验证（6 个页面）— 阻塞于后端 login
- ❌ SSE 真实后端联调 — 阻塞于后端
- ❌ Playwright 端到端测试 — 未开始
- ❌ 其余 10 个模块的 Store 集成测试 — 未开始

***

## 七、接口文档完善程度

### 7.1 文档矩阵

| 文档           | 路径                                             | 状态      | 说明                                   |
| :----------- | :--------------------------------------------- | :------ | :----------------------------------- |
| 后端对接接口大纲     | `docs/api/frontend-api-integration-guide.md`   | ⚠️ 部分完善 | 73 个端点清单 + 优先级 + 阅读指南，但无请求/响应示例、无错误码 |
| 基础设施审查报告     | `docs/api/infrastructure-review-report.md`     | ✅ 完善    | 逐模块双向交叉验证，含 26 项发现                   |
| 前端问题清单       | `docs/api/frontend-issues.md`                  | ✅ 完善    | 16 项 F-001\~F-016 全部修复               |
| 修复任务清单       | `docs/api/fix-checklist.md`                    | ✅ 完善    | 15 项 P0/P1/P2 全部完成                   |
| 后端字段补齐清单     | `docs/api/backend-missing-fields-checklist.md` | ✅ 完善    | 7 项 P0 + 8 项 P1 + 16 项 P2            |
| 逐模块任务清单（11个） | `docs/api/tasks/*.md`                          | ✅ 已生成   | 含每个模块的验收标准                           |
| API 联调交接文档   | `docs/api/handover.md`                         | ✅ 完善    | 本轮全部工作记录                             |
| 前期交接文档       | `docs/frontend-api/handover.md`                | ✅ 完善    | Phase 1-5 详细记录                       |

### 7.2 接口文档待改进项

- ❌ 无任何请求/响应 JSON 示例
- ❌ 无错误码列表（401/403/429/500 等）
- ❌ 无 429 限流响应格式
- ❌ 无认证流程时序图
- ❌ 分页响应格式未统一说明
- ❌ SSE `error` 事件数据格式未规范

***

## 八、后续联调计划

根据 [progress.md](file:///d:/code/MianMianMaster/docs/api/tasks/progress.md) 中的阶段划分：

### Phase 1: P0 核心基建（3 模块 / 18 端点）— **当前阶段**

```
Week 1-2（当前）:
  ├─ Auth（认证）    → 代码对齐完成，等待后端 login 修复后进行浏览器验证
  ├─ User（用户）    → 待 Auth 就绪后开始
  └─ Job & Skill    → 依赖 Auth + User
```

**验收标准**: 可完成注册 → 登录 → 查看岗位列表 → 技能树渲染 → 岗位匹配度

### Phase 2: P1 主业务流程（4 模块 / 28 端点）

```
Week 3-4:
  ├─ Assessment（测评）→ 含 LLM 异步判卷
  ├─ Learning（学习） → 含课程/进度/收藏/错题/徽章
  ├─ Interview（面试）→ 含 SSE 流式对话、状态机、异步报告
  └─ Notification（通知）→ 含 30s 轮询 + 已读状态
```

**验收标准**: 完整业务流程闭环（测评 → 学习 → 面试 → 通知）

### Phase 3: P2 增值功能（1 模块 / 9 端点）

```
Week 5:
  └─ Community（社区）→ 含 AI 点评、楼中楼评论
```

### Phase 4: P3 管理后台（3 模块 / 17 端点）

```
Week 6:
  └─ Business / Role / System → 按需对接
```

### 立即需要做的事情

1. 🔴 **排查后端** **`/auth/login`** **超时** — 这是最高优先级阻塞项
2. 🔴 **补齐 7 项 P0 后端字段**（`interview-history` 的 `tags/feedback/details`）
3. 🟡 **确认 16 项前端已实现但后端未声明的端点排期**
4. 🟡 **Profile.vue 补充 22 处模板兜底**（`item.feedback` + `item.details.*` + `problem_solving` 修正）
5. 🟢 **Business/Role 模块补充 Mock handler**（P3 管理后台）

**总结要点**：

- **前端基础设施就绪度 95%+**，11 个 API 模块、96 个测试、Token 刷新/SSE/错误处理等关键特性均已实现
- **Auth 模块代码侧对齐已完成**（13 项修复），但浏览器端验证**被后端** **`/auth/login`** **超时阻塞**
- **剩余 10 个模块的逐模块联调**（约 180 个子任务）均未开始，等待 Auth 就绪后按 P0→P1→P2→P3 顺序推进
- 当前最高优先级阻塞项是**后端 login 端点超时问题**和**7 项 P0 字段补齐**

