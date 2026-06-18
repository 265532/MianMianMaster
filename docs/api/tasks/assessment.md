# Assessment 模块联调任务清单

> **优先级**: P1 — 主业务流程  
> **后端前缀**: `/api/v1/assessments`  
> **后端接口数量**: 2 个端点  
> **现有文件**: [assessment.api.ts](file:///d:/code/MianMianMaster/src/api/modules/assessment.api.ts) | [assessment.types.ts](file:///d:/code/MianMianMaster/src/api/types/assessment.types.ts) | [assessment.handler.ts](file:///d:/code/MianMianMaster/src/mock/handlers/assessment.handler.ts) | [assessment Store](file:///d:/code/MianMianMaster/src/stores/assessment.ts) | [Report.vue](file:///d:/code/MianMianMaster/src/views/Report.vue)

---

## 前置条件

- [ ] Auth + User 联调完成
- [ ] Job & Skill 联调完成（测评依赖岗位技能数据）
- [ ] 后端已创建测评试卷数据（通过 `POST /assessments` 管理后台）

---

## Task 1: 端点签名对齐

| # | 端点 | 方法 | 前端方法 | 状态 |
|---|------|------|----------|------|
| 1.1 | `/assessments` | POST | `assessmentApi.createAssessment()` | [ ] |
| 1.2 | `/assessments/submit` | POST | `assessmentApi.submitAssessment()` | [ ] |

> **注意**: 前端多出 2 个端点（`getAssessments`、`getResult`），不在后端当前规范中，需确认后端是否有对应路由。

---

## Task 2: 类型定义对齐

- [ ] 2.1 确认 `Assessment` 类型包含 `id`/`title`/`job_id`/`questions[]`/`created_at`
- [ ] 2.2 确认 `Question` 类型支持 `single_choice` / `multiple_choice` / `text` 三种 type
- [ ] 2.3 确认 `AssessmentSubmit` 包含 `assessment_id` + `answers[]`（每道题的 `question_id` + `answer`）
- [ ] 2.4 确认 `AssessmentResult` 包含 `score`/`passed`/`detail[]`/`total_score`
- [ ] 2.5 确认 `AssessmentCreate` 包含 `title`/`job_id`/`questions[]` 等字段

---

## Task 3: 测评创建与提交验证

- [ ] 3.1 **创建测评**: `POST /assessments` → 返回 `Assessment` 对象（管理后台用）
- [ ] 3.2 **提交答卷**: `POST /assessments/submit` → 提交含选择题和简答题的试卷
- [ ] 3.3 **自动判卷**: 客观题（`single_choice`/`multiple_choice`）后端自动判卷 → 验证分数正确
- [ ] 3.4 **LLM 判卷**: `text` 类型题目 → 验证异步判卷处理（可能需要较长等待时间）
- [ ] 3.5 **LLM 判卷失败**: 验证后端回退为 0 分的容错逻辑

---

## Task 4: 前端页面验证

- [ ] 4.1 [Report.vue](file:///d:/code/MianMianMaster/src/views/Report.vue) 使用 `assessmentStore` 正确展示测评结果
- [ ] 4.2 [Report.vue](file:///d:/code/MianMianMaster/src/views/Report.vue) 硬编码报告数据替换为 Store 数据（当前标注为 🟡 部分）
- [ ] 4.3 提交后技能掌握度 `user_skill_mastery` 自动更新 → 岗位匹配度变化验证

---

## Task 5: 错误处理验证

- [ ] 5.1 提交不存在的 `assessment_id` → 后端返回 404，前端展示错误提示
- [ ] 5.2 提交空答案 → 后端验证错误，前端展示具体字段错误
- [ ] 5.3 超长等待（LLM 判卷）→ 前端展示 loading 状态，不超时报错

---

## 依赖关系

```
Job & Skill → Assessment → Learning（错题本 + 收藏）
```