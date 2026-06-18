# Job & Skill 模块联调任务清单

> **优先级**: P0 — 核心阻塞  
> **后端前缀**: `/api/v1/jobs`  
> **接口数量**: 4 个端点  
> **现有文件**: [job.api.ts](file:///d:/code/MianMianMaster/src/api/modules/job.api.ts) | [job.types.ts](file:///d:/code/MianMianMaster/src/api/types/job.types.ts) | [job.handler.ts](file:///d:/code/MianMianMaster/src/mock/handlers/job.handler.ts) | [knowledge Store](file:///d:/code/MianMianMaster/src/stores/knowledge.ts) | [Matching.vue](file:///d:/code/MianMianMaster/src/views/Matching.vue)

---

## 前置条件

- [ ] Auth 模块联调完成
- [ ] 后端数据库已填充岗位与技能树数据

---

## 差异分析

> ⚠️ **前端无独立 Job Store**，岗位数据通过 `knowledgeStore` 暴露，需确认 Store 职责划分是否合理。
> ⚠️ Job 模块的 Mock 数据和处理器在 P2 补充阶段创建，需确认是否覆盖全部 4 个端点。

---

## Task 1: 端点签名对齐

| # | 端点 | 方法 | 前端方法 | 状态 |
|---|------|------|----------|------|
| 1.1 | `/jobs` | POST | `jobApi.createJobPosition()` | [ ] |
| 1.2 | `/jobs` | GET | `jobApi.listJobPositions()` | [ ] |
| 1.3 | `/jobs/{job_id}/skill-tree` | GET | `jobApi.getSkillTree()` | [ ] |
| 1.4 | `/jobs/{job_id}/match` | GET | `jobApi.getJobMatch()` | [ ] |

**验收标准**: Swagger 验证每个端点可用，前端 `baseURL` 前缀与后端路由一致（`/api/v1/jobs`）。

---

## Task 2: 类型定义对齐

- [ ] 2.1 确认 `JobPosition` 类型包含 `id`/`name`/`description`/`requirements`/`skills` 等字段
- [ ] 2.2 确认 `SkillTreeNode` 类型支持 `is_required` / `has_required_child` 标记，与后端返回一致
- [ ] 2.3 确认 `JobMatchResult` 包含 `match_score`（0-100 浮点数）和 `matched_skills`/`missing_skills`
- [ ] 2.4 确认 `JobPositionCreate` 创建请求字段与后端 `POST /jobs` 一致

---

## Task 3: 岗位列表与技能树验证

- [ ] 3.1 **岗位列表**: `GET /jobs` → 验证分页参数（`skip`/`limit`）正常工作
- [ ] 3.2 **技能树获取**: `GET /jobs/{job_id}/skill-tree` → 验证返回树形结构，`is_required` 标记正确
- [ ] 3.3 **技能树渲染**: [Knowledge.vue](file:///d:/code/MianMianMaster/src/views/Knowledge.vue) 中技能树组件正常渲染高亮节点
- [ ] 3.4 **技能树条件渲染**: `is_required`=true 节点视觉高亮，`has_required_child`=true 父节点展示特殊样式

---

## Task 4: 岗位匹配验证

- [ ] 4.1 **匹配度计算**: `GET /jobs/{job_id}/match` → 验证认证 Token 正确传递
- [ ] 4.2 **匹配度展示**: [Matching.vue](file:///d:/code/MianMianMaster/src/views/Matching.vue) 中匹配度数据正确展示（0-100 分 + 技能对比）
- [ ] 4.3 **无认证访问**: 未登录时调用 `/match` → 返回 401，前端处理

---

## Task 5: Store 层审查

- [ ] 5.1 [knowledgeStore](file:///d:/code/MianMianMaster/src/stores/knowledge.ts) 是否已正确暴露 job API 调用
- [ ] 5.2 评估是否需要独立 `jobStore`（当 Job 相关逻辑与 Knowledge 耦合度过低时）
- [ ] 5.3 `Matching.vue` 硬编码岗位数据替换为 Store 数据（当前标注为 🟡 部分对接）

---

## 依赖关系

```
Auth + User → Job & Skill
Job & Skill → Assessment / Interview（测评和面试围绕岗位展开）
```