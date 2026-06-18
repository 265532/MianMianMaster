# Week 1 契约漂移修复 — 交接文档

> **模块**: Auth + User + Job (P0 核心基建)
> **日期**: 2026-06-03
> **状态**: 类型/API/Mock/Store/视图组件适配完成 + 深度审查修复完成，联调验证待续

---

## 一、本次完成的工作

### 1.1 Auth 模块 (10 端点)

| 层级 | 完成项 | 说明 |
|------|--------|------|
| 类型 | `auth.types.ts` | `RegisterRequest` 新增 `is_active?: boolean` |
| API | `auth.api.ts` | 验证完毕，所有 10 个端点签名与契约一致，无需修改 |
| Mock | `auth.mock.ts` / `auth.handler.ts` | `mockRegisterUser` 新增 `phone: undefined`，所有 10 端点已覆盖 |
| Store | `stores/user.ts` | 无需修改，Auth 相关 action 已正确 |

### 1.2 User 模块 (9 端点) — 重大重构

| 层级 | 完成项 | 关键变更 |
|------|--------|----------|
| 类型 | `user.types.ts` | **重写 5 个核心类型** |
| API | `user.api.ts` | **4 个函数签名变更** |
| Mock | `user.mock.ts` / `user.handler.ts` | **全部 mock 数据重写** |
| Store | `stores/user.ts` | **4 处适配** (含 updateProfile 调用真实 API) |
| **视图** | **Profile.vue** | **9 个区域适配完成** |

**Profile.vue 视图适配详情：**

| 区域 | 旧实现 | 新实现（对齐契约） |
|------|--------|-------------------|
| 能力数据 | `abilityData.value[targetPosition.value]` | `abilityData.value?.abilities?.[0]` |
| 能力差距字段 | `gapSkills` | `gap_skills` |
| 面试历史排序 | `b.date` | `b.start_time \|\| b.created_at` |
| 面试历史分数 | `b.score` | `(b.score ?? 0)` |
| 面试历史模板 | `item.position/company/date/round/type/tags/feedback/details` | `item.job_position_title/start_time/current_round/status/score/created_at` |
| 面试状态显示 | `item.status === '已通过'` | `item.status === 'completed'` |
| 游戏化面试 | 四标签页 (概览/关卡/成就/排行榜) | 单标签页概览 (total_sessions/completed_sessions/average_score/current_streak/best_streak) |
| 简历数据 | `resumeData?.basicInfo?.name/major/grade/school`, `resumeData?.projects` | `resumeData?.name/email/phone/summary`, skills 为 `string[]` |
| 简历诊断 | `diagnoseResume()` 无参数，结果有 `overallScore/strengths/weaknesses/matchRate/suggestions` | `diagnoseResume(resumeId, targetPosition)`, 结果有 `overall_score/scores/summary` |
| 个人档案表单 | name/major/grade/school/email/phone/skills/experience/education/certifications | education/target_position/work_years (对齐 `UserProfileUpdateRequest`) |
| Store updateProfile | `Partial<UserInfo>` 本地赋值 | `UserProfileUpdateRequest` 调用真实 API |

### 1.3 Job 模块 (4 端点)

| 层级 | 完成项 | 关键变更 |
|------|--------|----------|
| 类型 | `job.types.ts` | **新增 3 个字段，修正 2 个类型** |
| API | `job.api.ts` | **2 个返回类型变更** |
| Mock | `job.mock.ts` / `job.handler.ts` | **mock 数据和 handler 对齐** |
| Store | `knowledge.ts` | skillTrees 类型适配 |

---

## 二、质量验证结果

| 验证项 | 结果 |
|--------|------|
| `vue-tsc --noEmit` | ✅ 零错误 |
| `vite build` | ✅ 构建成功 (20.04s) |
| `vitest run` | ✅ 9 个测试文件，78 个测试全部通过 (4.32s) |

---

## 三、待完成的工作（下次 Agent 接手）

### 3.1 Auth 视图组件适配 (中优先级)

- [ ] A-4.1 LoginForm.vue 表单字段验证
- [ ] A-4.2 Login.vue 注册表单字段验证
- [ ] A-4.3 短信登录流程验证
- [ ] A-4.4 密码重置流程验证

### 3.2 路由守卫验证 (中优先级)

- [ ] A-5.1 ~ A-5.4 路由守卫功能验证

### 3.3 Job 视图组件适配 (低优先级)

- [ ] J-4.1 Knowledge.vue 技能树渲染 (后端返回空对象，需确认后端是否补充数据)
- [ ] J-4.2 Matching.vue 岗位匹配数据替换硬编码

### 3.4 User 模块剩余适配 (低优先级)

- [ ] U-4.3 修改密码/手机号表单字段正确 (Profile.vue 中可能未实现此功能)

### 3.5 联调验证 (所有模块)

- [ ] Auth 模块联调 (A-7.1 ~ A-7.10)
- [ ] User 模块联调 (U-5.1 ~ U-5.9)
- [ ] Job 模块联调 (J-5.1 ~ J-5.4)

---

## 四、关键设计决策记录

### 4.1 `requirements` 字段类型变更

后端契约定义 `requirements` 为 `string?`（单个字符串），但前端旧代码使用 `string[]?`（字符串数组）。已按契约改为 `string?`。Mock 数据中用逗号分隔的字符串替代数组。

### 4.2 `SkillTreeNode` 保留策略

后端 `GET /jobs/{job_id}/skill-tree` 暂返回空对象 `{}`，但前端技能树渲染需要结构化数据。决策：
- API 层返回类型改为 `Record<string, unknown>` 对齐契约
- `SkillTreeNode` 类型保留在 `job.types.ts` 中供前端渲染使用
- Mock handler 返回空对象，前端需从其他来源获取技能树数据或等待后端补充

### 4.3 `JobMatchResult` 保留策略

后端 `GET /jobs/{job_id}/match` 直接返回 `number`，但前端展示需要匹配详情。决策：
- API 层返回类型改为 `number` 对齐契约
- `JobMatchResult` 类型保留供前端内部使用
- Mock handler 返回 `number`（match_score），前端如需详情需另行处理

### 4.4 `GameInterviewDataResponse` 结构简化

后端契约仅返回 5 个简单统计字段，前端旧代码有丰富的关卡/成就/排行榜 UI。决策：
- 类型严格对齐契约
- 视图层已重新设计：移除关卡/成就/排行榜标签页，仅保留概览标签页展示统计数据
- 关卡详情模态框 (`showLevelDetail`) 已置空，待后端补充数据后恢复

### 4.5 `ResumeData` 结构简化

后端契约的 `ResumeData` 无 `basicInfo` 嵌套和 `projects` 字段。决策：
- 简历预览直接使用 `resumeData?.name/email/phone/summary`
- 教育经历使用 `edu.period` 替代 `edu.startDate/endDate`
- 技能列表从 `{name, level}[]` 简化为 `string[]`，移除 `getSkillLevelText/getSkillLevelColor` 函数
- 移除项目经历区域（后端契约无此字段）

### 4.6 个人档案表单对齐 `UserProfileUpdateRequest`

后端 `PUT /user/profile` 仅接受 `avatar_url/education/target_position/work_years` 四个字段。决策：
- 表单简化为三个字段 (education/target_position/work_years)，avatar_url 暂不提供编辑入口
- Store 的 `updateProfile` 改为调用真实 API (`userApi.updateProfile`)，参数类型改为 `UserProfileUpdateRequest`

---

## 五、已修改文件清单

| 文件 | 变更类型 |
|------|----------|
| `src/api/types/auth.types.ts` | 新增 `is_active?: boolean` |
| `src/api/types/user.types.ts` | 重写 5 个核心类型，新增 3 个类型 |
| `src/api/types/job.types.ts` | 新增 `KnowledgeGraph`，修改 `JobPosition`/`JobPositionCreate` |
| `src/api/modules/user.api.ts` | 4 个函数签名变更 |
| `src/api/modules/job.api.ts` | 2 个函数返回类型变更 |
| `src/mock/data/auth.mock.ts` | `mockRegisterUser` 新增 phone |
| `src/mock/data/user.mock.ts` | 全部 mock 数据重写对齐新类型 |
| `src/mock/data/job.mock.ts` | mock 数据对齐新类型 |
| `src/mock/handlers/user.handler.ts` | handler 返回结构对齐 |
| `src/mock/handlers/job.handler.ts` | handler 返回值对齐 |
| `src/stores/user.ts` | 4 处适配 (含 updateProfile 调用真实 API) |
| `src/stores/knowledge.ts` | skillTrees 类型适配 |
| **`src/views/Profile.vue`** | **9 个区域视图适配** |

---

## 六、踩坑记录

1. **`InterviewHistoryItem` 状态值变更**: 旧代码用 `"passed"/"failed"`，契约用 `"completed"/"failed"`。Store 中 `passedInterviews` 的过滤条件已更新。视图层过滤按钮也已从"已通过"改为"已完成"。
2. **`diagnoseResume()` 需要参数**: 旧代码无参数调用，新契约要求 `resume_id`（必填）和 `target_position`（可选）。Store 和视图均已适配。
3. **`requirements` 从数组变字符串**: Job 模块的 `requirements` 字段后端定义为 `string?`，前端旧代码当数组使用。Mock 数据已改为逗号分隔字符串，视图层需适配。
4. **`gapSkills` → `gap_skills`**: 能力数据中的差距技能字段名从 camelCase 改为 snake_case，模板中所有引用已更新。
5. **`ResumeEducation.period`**: 旧结构使用 `startDate/endDate` 两个字段，新结构使用单个 `period` 字段。模板已适配。
6. **游戏化面试关卡详情**: `showLevelDetail` 函数已置空，因为后端不再返回 `levels` 数据。关卡详情模态框代码保留但不会被触发。
7. **深度审查修复 — 可选字段对齐**: `Token.token_type`、`UserResponse.is_active`、`UserResponse.roles` 在契约中为可选，但 TS 中为必填，已改为可选。
8. **深度审查修复 — RoleResponse 缺 permissions**: 契约中 `RoleResponse` 包含 `permissions?: PermissionResponse[]`，TS 类型中缺失，已补充。
9. **深度审查修复 — fetchInterviewHistory 分页**: Store action 不接受分页参数，已添加 `params?: { skip?: number; limit?: number }` 并透传给 API。
10. **深度审查修复 — diagnose handler**: Mock handler 未解析请求体中的 `resume_id`，已修复为解析并回填响应。
11. **深度审查修复 — 死导入**: `job.handler.ts` 中 `mockSkillTree` 被导入但未使用，已清理。
