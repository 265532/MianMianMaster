# 契约漂移修复 — 交接文档 (2026-06-04 更新)

> **模块**: Week 1 (Auth/User/Job) + Week 2 (Assessment/Learning/Interview/Notification)
> **日期**: 2026-06-04
> **状态**: 类型/API/Mock/Store 四层修复完成，视图组件适配大部分完成，联调验证待续

---

## 一、已完成的工作总览

### 1.1 Week 1: Auth + User + Job (P0)

| 模块 | 类型 | API | Store | Mock | 组件适配 | 完成率 |
|------|------|-----|-------|------|----------|--------|
| Auth | ✅ | ✅ | ✅ | ✅ | ✅ (A-4, A-5) | ~85% |
| User | ✅ | ✅ | ✅ | ✅ | ✅ (U-4) | ~85% |
| Job | ✅ | ✅ | ✅ | ✅ | ✅ (J-4) | ~90% |

### 1.2 Week 2: Assessment + Learning + Interview + Notification (P1)

| 模块 | 类型 | API | Store | Mock | 组件适配 | 完成率 |
|------|------|-----|-------|------|----------|--------|
| Assessment | ✅ | ✅ | ✅ | ✅ | ✅ (D-4) | ~90% |
| Learning | ✅ | ✅ | ✅ | ✅ | 🟡 (E-4.1 完成) | ~80% |
| Interview | ✅ | ✅ | ✅ | ✅ | 🟡 (F-4.3, F-4.4 完成) | ~80% |
| Notification | ✅ | ✅ | ✅ | ✅ | ✅ (G-4) | ~90% |

### 1.3 视图组件适配详情

| 视图文件 | 任务 | 状态 | 关键变更 |
|----------|------|------|----------|
| `Report.vue` | D-4 | ✅ | 去硬编码，接入 interviewStore.fetchReport()，使用 InterviewReport 类型，雷达图动态渲染 |
| `GameInterview.vue` | F-4.3 | ✅ | statItems 映射 GameStats 新字段；Level 模板简化为 GameLevel 可用字段；Achievement 使用 is_unlocked/icon_url/unlocked_at；移除 Certification 硬编码 |
| `Practice.vue` | E-4.1 | ✅ | 字段名适配 snake_case (category→level, questionCount→question_count 等) |
| `Knowledge.vue` | J-4.1, J-4.2 | ✅ | 新增「岗位与技能树」板块，用 jobPositions/skillTrees 渲染，is_required/has_required_child 高亮 |
| `Matching.vue` | J-4.3, J-4.4 | ✅ | jobMatches 改为 computed 从 knowledgeStore.jobPositions 映射，异步调用 getJobMatch() 获取匹配分数，缺失字段用占位值 |
| `practiceStore` | E-3 | ✅ | 类型从 store 内联移至 api/types/practice.types.ts，字段 snake_case 对齐 |

---

## 二、质量验证结果

| 验证项 | 结果 |
|--------|------|
| `vue-tsc --noEmit` | ✅ 零错误 |
| `vite build` | ✅ 构建成功 (18.30s) |
| `vitest run` | ✅ 9 个测试文件，78 个测试全部通过 (3.72s) |

---

## 三、待完成的工作（下次 Agent 接手）

### 3.1 高优先级

- [ ] **F-4.1, F-4.2** Interview.vue 会话创建/列表/SSE对话 — 272KB 文件需大规模重构，建议拆分为子组件后逐步适配
- [ ] **E-4.2** PathPractice.vue 学习路径对接 (仍为硬编码模拟)
- [ ] **E-4.3** JobSpecificQuestionBank.vue 岗位题库对接 (仍为硬编码)
- [ ] **A-7, U-5, J-5** Week 1 联调验证 — Auth/User/Job 端到端验证

### 3.2 中优先级

- [ ] **E-4.4~E-4.6** Learning 视图功能: 错题本/收藏集/徽章 UI
- [ ] **U-4.3** 修改密码/手机号表单字段正确
- [ ] **U-1~U-2** User 类型/API 差异分析中未确认的匹配项

### 3.3 低优先级

- [ ] Knowledge.vue 知识分类/热门解析/推荐资源/最新动态 — 目前为硬编码，后端无对应 API，待后端补充接口后对接
- [ ] Matching.vue 缺失字段 — responsibilities/benefits/experience/education/companyInfo/jobType/publishDate/deadline 等字段后端 API 不提供，当前用占位值，待后端扩展接口后对接

### 3.4 后端需补充的接口/数据

| 模块 | 缺失内容 | 影响 |
|------|----------|------|
| Job | 技能树 API (`GET /jobs/{id}/skill-tree`) 当前返回空对象 | Knowledge.vue 技能树板块无法展示数据 |
| Job | 岗位详情字段 (responsibilities/benefits/experience/education 等) | Matching.vue 用占位值填充 |
| Knowledge | 知识分类/热门话题/推荐资源 API | Knowledge.vue 硬编码内容无法替换 |
| Learning | 练习路径 API | PathPractice.vue 纯模拟页面无法对接 |
| Interview | 题目详情字段 (tags/answer/likes/views/jobCategory) | JobSpecificQuestionBank.vue 用占位值填充 |
| Community | Week 3 模块全部 | 尚未启动 |

---

## 四、关键设计决策记录

### 4.1 Knowledge.vue 岗位与技能树板块设计

**决策**: 在现有页面新增「岗位与技能树」板块，保留原有硬编码内容不动。原因：后端目前没有知识库数据的接口，原有内容（分类/热门解析/资源/动态）无法对接。

**实现**:
- 岗位列表从 `knowledgeStore.jobPositions` 渲染
- 点击岗位展开技能树，调用 `knowledgeStore.fetchSkillTree(jobId)`
- 技能树节点 `is_required` 用 primary 色高亮，`has_required_child` 用 orange 标记
- 后端技能树 API 暂返回空对象，显示「暂无技能树数据」空状态

### 4.2 Matching.vue Store 接入策略

**决策**: 接入 Store 数据，保留现有 UI 布局，缺失字段用占位值填充。

**映射关系**:
- `jobMatches` 从 `computed<JobMatch[]>` 映射 `knowledgeStore.jobPositions`
- `matchRate` 通过异步调用 `jobApi.getJobMatch(job.id)` 获取
- `tags` 从 `job.required_skills?.map(s => s.concept_name)` 提取
- 缺失字段 (responsibilities/benefits/education 等) 用占位值如 `'暂无数据'`/`'不限'`

### 4.3 Interview Session ID 类型: string → number

后端实际使用数字 ID，前端旧代码使用字符串。决策：全链路改为 `number`。

### 4.4 Learning updateProgress 查询参数

后端契约 `POST /learning/progress/update` 将 `course_id` 和 `material_id` 放在查询参数。决策：使用 AxiosRequestConfig 的 `params` 属性。

### 4.5 Assessment Store 严重 Bug 修复

1. `createAssessment()` 参数类型完全错误 → 改为 `AssessmentCreate`
2. `submitAssessment()` 传 2 个参数 → 改为单参数 `AssessmentSubmit`

### 4.6 Notification unreadCount 持久化

旧代码 `unreadCount` 是 computed 属性。新增 `unreadCountValue` ref 存储，`markAsRead` 递减，`markAllAsRead` 重置为 0。

### 4.7 practiceStore 类型迁移

`PracticeQuestion` 和 `PracticeBank` 从 `stores/practice.ts` 内联定义移至 `api/types/practice.types.ts`，字段从 camelCase 转为 snake_case。

---

## 五、已修改文件清单

### Week 1 类型/API/Mock/Store (Session 1)

| 文件 | 变更类型 |
|------|----------|
| `src/api/types/auth.types.ts` | 新增 RegisterRequest 字段 |
| `src/api/types/user.types.ts` | 新增多个接口类型 |
| `src/api/types/job.types.ts` | 新增 level/industry/required_skills/skill_ids |
| `src/api/modules/auth.api.ts` | 签名对齐 |
| `src/api/modules/user.api.ts` | 签名对齐 |
| `src/api/modules/job.api.ts` | 签名对齐 |
| `src/stores/user.ts` | 类型适配 |
| `src/stores/knowledge.ts` | skillTrees 类型改为联合类型 |
| `src/mock/data/auth.mock.ts` | 对齐新类型 |
| `src/mock/data/user.mock.ts` | 对齐新类型 |
| `src/mock/data/job.mock.ts` | 对齐新类型 |
| `src/mock/handlers/auth.handler.ts` | handler 对齐 |
| `src/mock/handlers/user.handler.ts` | handler 对齐 |
| `src/mock/handlers/job.handler.ts` | handler 对齐 |

### Week 2 类型/API/Mock/Store (Session 1)

| 文件 | 变更类型 |
|------|----------|
| `src/api/types/assessment.types.ts` | 完全重写 |
| `src/api/types/learning.types.ts` | 完全重写 |
| `src/api/types/interview.types.ts` | 完全重写 |
| `src/api/types/notification.types.ts` | 完全重写 |
| `src/api/modules/assessment.api.ts` | 新增 PaginationParams |
| `src/api/modules/learning.api.ts` | 6 个函数签名变更 |
| `src/api/modules/interview.api.ts` | session ID 类型 + 返回类型变更 |
| `src/api/modules/notification.api.ts` | 新增 createNotification, 签名变更 |
| `src/stores/assessment.ts` | 修复 2 个严重 Bug |
| `src/stores/learning.ts` | 类型适配 + 移除 mock fallback |
| `src/stores/interview.ts` | session ID 类型变更 |
| `src/stores/notification.ts` | unreadCount 持久化 + 新增 createNotification |
| `src/mock/data/assessment.mock.ts` | 全部重写对齐新类型 |
| `src/mock/data/learning.mock.ts` | 全部重写对齐新类型 |
| `src/mock/data/interview.mock.ts` | 全部重写对齐新类型 |
| `src/mock/data/notification.mock.ts` | 全部重写对齐新类型 |
| `src/mock/handlers/assessment.handler.ts` | handler 对齐新类型 |
| `src/mock/handlers/learning.handler.ts` | handler 对齐新类型 |
| `src/mock/handlers/interview.handler.ts` | URL regex + handler 对齐 |
| `src/mock/handlers/notification.handler.ts` | 新增 POST handler |
| `src/stores/__tests__/learning.test.ts` | 修复测试: addToCollection→createCollection |

### 视图组件适配 (Session 2)

| 文件 | 变更类型 |
|------|----------|
| `src/views/Report.vue` | 完全重写: 接入 interviewStore.fetchReport() |
| `src/views/GameInterview.vue` | 大幅修改: statItems/Level/Achievement/Leaderboard 字段适配 |
| `src/views/Practice.vue` | 字段名 snake_case 适配 |
| `src/api/types/practice.types.ts` | 新建: 从 practiceStore 迁移类型 |
| `src/stores/practice.ts` | 类型导入改为 api/types，字段 snake_case |

### 视图组件适配 (Session 3 — 本次)

| 文件 | 变更类型 |
|------|----------|
| `src/views/Knowledge.vue` | 新增「岗位与技能树」板块，导入 SkillTreeNode 类型，新增 selectJob/closeSkillTree/getSkillTreeNodes |
| `src/views/Matching.vue` | jobMatches 从硬编码数组改为 computed 映射 knowledgeStore.jobPositions，新增 matchScores 异步加载，新增 onMounted 调用 fetchAllData |

---

## 六、踩坑记录

1. **Assessment Store createAssessment 参数类型完全错误**: 旧代码传 `{type?: string; answers?: Record<string, any>}`，与 `AssessmentCreate` 完全不匹配。
2. **Assessment Store submitAssessment 参数数量错误**: 旧代码传 `(id, data)` 两个参数，但 API 只接受 `AssessmentSubmit` 一个参数。
3. **Learning addToCollection → createCollection**: API 函数重命名，测试文件未同步更新。
4. **Learning updateProgress 查询参数**: `course_id` 和 `material_id` 必须通过 URL query params 传递。
5. **Interview Session ID string→number**: 全链路变更，Mock handler URL regex 也需修改。
6. **Notification unreadCount 不持久化**: 新增 `unreadCountValue` ref 解决。
7. **Learning Store mock fallback**: `await import("@/mock/data/learning.mock")` 在 catch 块中不安全，已移除。
8. **NotificationPreferences 字段名完全不同**: 旧 5 字段 → 后端 4 字段，全新结构。
9. **GameInterview.vue 字段不匹配**: 旧模板引用 `level.公司`/`achievement.rarity` 等不存在字段，需完全重写模板。
10. **Interview.vue 272KB**: 文件过大无法在单次会话中重构，需拆分子组件。
11. **后端 /interview/questions difficulty 全为 null**: 后端数据问题，前端类型已用 `difficulty?: string | null` 处理。
12. **Matching.vue 缺失字段**: JobPosition 类型缺少 responsibilities/benefits/experience/education 等 UI 所需字段，用占位值填充。

---

## 七、后端 API 探测结果摘要

| 端点 | 发现 |
|------|------|
| `GET /assessments` | 返回 `questions_count` 而非 `questions` 数组 |
| `GET /notifications/unread-count` | 返回裸数字，非包装对象 |
| `GET /notifications/preferences` | 4 个可选布尔字段 |
| `GET /interview/game/achievements` | `icon_url` 存储 lucide 图标名而非 URL |
| `GET /interview/game/stats` | 全部 number 字段，非 string |
| `GET /interview/questions` | 19 条记录，difficulty 全为 null |
| `GET /interview/game/levels` | 3 条记录，Level 2 questions_count=0 |
| `GET /jobs` | 返回岗位列表，skill-tree 返回空对象 |
| `POST /auth/register` | 密码需满足强度要求 (Test@123456) |

**测试账号**: `testuser` / `Test@123456` (user_id=109)

---

## 八、下次 Agent 快速接手指南

### 优先级排序

1. **Interview.vue 重构** (F-4.1, F-4.2) — 核心业务页面，建议先拆分子组件
2. **PathPractice.vue / JobSpecificQuestionBank.vue** (E-4.2, E-4.3) — 学习路径/岗位题库对接
3. **Week 1 联调收尾** (A-7, U-5, J-5) — Auth/User/Job 端到端验证
4. **Learning 视图功能** (E-4.4~E-4.6) — 错题本/收藏集/徽章

### 关键文件路径

- 类型: `src/api/types/{auth,user,job,assessment,learning,interview,notification,practice}.types.ts`
- API: `src/api/modules/{auth,user,job,assessment,learning,interview,notification}.api.ts`
- Store: `src/stores/{user,knowledge,assessment,learning,interview,notification,practice}.ts`
- Mock: `src/mock/{data,handlers}/{auth,user,job,assessment,learning,interview,notification}.*`
- 视图: `src/views/{Knowledge,Matching,Report,Practice,PathPractice,JobSpecificQuestionBank,Interview,GameInterview}.vue`

### 环境配置

- 后端: `localhost:8081`
- `.env.development`: `VITE_USE_MOCK=false`, `VITE_PROXY_TARGET=http://localhost:8081`
- 切换 Mock: 设置 `VITE_USE_MOCK=true` 并重启 dev server
