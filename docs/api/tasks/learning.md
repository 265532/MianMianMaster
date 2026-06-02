# Learning 模块联调任务清单

> **优先级**: P1 — 主业务流程  
> **后端前缀**: `/api/v1/learning`  
> **后端接口数量**: 14 个端点（3 个子模块）  
> **现有文件**: [learning.api.ts](file:///d:/code/MianMianMaster/src/api/modules/learning.api.ts) | [learning.types.ts](file:///d:/code/MianMianMaster/src/api/types/learning.types.ts) | [learning.handler.ts](file:///d:/code/MianMianMaster/src/mock/handlers/learning.handler.ts) | [learning Store](file:///d:/code/MianMianMaster/src/stores/learning.ts) | [PathPractice.vue](file:///d:/code/MianMianMaster/src/views/PathPractice.vue)

---

## 前置条件

- [ ] Auth + User 联调完成
- [ ] 后端数据库已填充课程与徽章数据

---

## Task 1: 端点签名对齐 — 课程与资料

| # | 端点 | 方法 | 前端方法 | 状态 |
|---|------|------|----------|------|
| 1.1 | `/learning/courses` | POST | `learningApi.createCourse()` | [ ] |
| 1.2 | `/learning/courses` | GET | `learningApi.getCourses()` | [ ] |
| 1.3 | `/learning/materials` | POST | `learningApi.addMaterial()` | [ ] |
| 1.4 | `/learning/progress/update` | POST | `learningApi.updateProgress()` | [ ] |
| 1.5 | `/learning/progress/{course_id}` | GET | `learningApi.getProgress()` | [ ] |

---

## Task 2: 端点签名对齐 — 题库练习

| # | 端点 | 方法 | 前端方法 | 状态 |
|---|------|------|----------|------|
| 2.1 | `/learning/collections` | POST | `learningApi.addToCollection()` | [ ] |
| 2.2 | `/learning/collections` | GET | `learningApi.getCollections()` | [ ] |
| 2.3 | `/learning/wrong-questions` | POST | `learningApi.recordWrongQuestion()` | [ ] |
| 2.4 | `/learning/wrong-questions` | GET | `learningApi.getWrongQuestions()` | [ ] |
| 2.5 | `/learning/wrong-questions/{question_id}/master` | POST | `learningApi.markWrongQuestionMastered()` | [ ] |

---

## Task 3: 端点签名对齐 — 徽章系统

| # | 端点 | 方法 | 前端方法 | 状态 |
|---|------|------|----------|------|
| 3.1 | `/learning/badges` | POST | `learningApi.createBadge()` | [ ] |
| 3.2 | `/learning/badges` | GET | `learningApi.getBadges()` | [ ] |
| 3.3 | `/learning/badges/award/{badge_id}` | POST | `learningApi.awardBadge()` | [ ] |
| 3.4 | `/learning/my-badges` | GET | `learningApi.getMyBadges()` | [ ] |

---

## Task 4: 类型定义对齐

- [ ] 4.1 `Course` / `CourseCreate` 与后端 Schema 对齐
- [ ] 4.2 `Material` / `MaterialCreate` 与后端对齐
- [ ] 4.3 `LearningProgress` 含 `progress`（百分比）字段
- [ ] 4.4 `Collection` / `AddToCollectionRequest` 对齐
- [ ] 4.5 `WrongQuestion` / `RecordWrongQuestionRequest` 对齐
- [ ] 4.6 `Badge` / `CreateBadgeRequest` / `UserBadge` 对齐

---

## Task 5: 课程与进度验证

- [ ] 5.1 **课程列表**: `GET /learning/courses` → 分页正常，`learningStore.courses` 响应式更新
- [ ] 5.2 **进度更新**: `POST /learning/progress/update` → 传 `course_id` + `progress`，返回更新后进度
- [ ] 5.3 **进度 100%**: 进度达 100% 后验证后端自动颁发 `course_completed` 徽章
- [ ] 5.4 **进度查询**: `GET /learning/progress/{course_id}` → 返回进度详情

---

## Task 6: 题库练习验证

- [ ] 6.1 **收藏题目**: `POST /learning/collections` → 收藏后列表更新
- [ ] 6.2 **收藏列表**: `GET /learning/collections` → [Profile.vue](file:///d:/code/MianMianMaster/src/views/Profile.vue) 中用 `collections` 替代旧变量 `savedQuestionBanks`
- [ ] 6.3 **记录错题**: `POST /learning/wrong-questions` → 测评提交后引导用户加入错题本
- [ ] 6.4 **错题列表**: `GET /learning/wrong-questions` → [Profile.vue](file:///d:/code/MianMianMaster/src/views/Profile.vue) 中用 `wrongQuestions` 替代旧变量 `mistakeBook`
- [ ] 6.5 **标记已掌握**: `POST /learning/wrong-questions/{id}/master` → 错题从列表中移除/标记

---

## Task 7: 徽章系统验证

- [ ] 7.1 **徽章列表**: `GET /learning/badges` → 显示所有可获取徽章
- [ ] 7.2 **我的徽章**: `GET /learning/my-badges` → 用户已获徽章正常展示
- [ ] 7.3 **自动触发**: 课程 100% → `course_completed` 徽章；测评得分 > 80 → `score_reached` 徽章
- [ ] 7.4 **徽章展示**: [Profile.vue](file:///d:/code/MianMianMaster/src/views/Profile.vue) 和 [Community.vue](file:///d:/code/MianMianMaster/src/views/Community.vue) 中徽章渲染正常

---

## Task 8: 前端页面验证

- [ ] 8.1 [PathPractice.vue](file:///d:/code/MianMianMaster/src/views/PathPractice.vue) 使用 `learningStore` 正确展示学习路径数据
- [ ] 8.2 [Profile.vue](file:///d:/code/MianMianMaster/src/views/Profile.vue) 收藏+错题数据正常（已完成 Store 对接）
- [ ] 8.3 [Community.vue](file:///d:/code/MianMianMaster/src/views/Community.vue) 课程推荐数据正常

---

## 依赖关系

```
Assessment → Learning（错题本 + 收藏）
Learning → 无后续依赖
```