# Job 模块 — 实施计划

> **模块**: 岗位与技能树（Job & Skill Tree）  
> **优先级**: P0 — 测评和面试的前置基础数据  
> **后端前缀**: `/api/v1/jobs`  
> **预估数据量**: 5 条岗位 + 1 棵技能树 + 5 条匹配度  
> **依赖**: Auth 模块（users 表需先存在）

---

## 0. 前置确认

- [ ] 确认 `jobs` 表 Schema（含 `title`, `description`, `company`, `location`, `salary_range`, `requirements` 等）
- [ ] 确认 `skill_tree_nodes` 表 Schema（树形结构 `parent_id` 自引用）
- [ ] 确认 `job_skill_requirements` 关联表 Schema（岗位-技能关联）
- [ ] 确认 `user_skill_mastery` 表 Schema（用户技能掌握度，用于匹配度计算）
- [ ] 确认匹配度计算逻辑（后端 `/jobs/{job_id}/match` 接口实现方式）

---

## 1. 数据库表创建

### 1.1 岗位表

- [ ] 1.1.1 确认 `jobs` 表结构

| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer | 主键 |
| title | varchar | 岗位名称 |
| description | text | 岗位描述 |
| company | varchar | 公司名称 |
| location | varchar | 工作地点 |
| salary_range | varchar | 薪资范围 |
| requirements | text[] | 技能要求 |
| created_at | timestamp | 创建时间 |
| updated_at | timestamp | 更新时间 |

### 1.2 技能树表

- [ ] 1.2.1 确认 `skill_tree_nodes` 表结构

| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer | 主键 |
| name | varchar | 节点名称 |
| category | varchar | 分类 |
| level | integer | 层级（1/2/3） |
| parent_id | integer | 父节点 ID（自引用，可为 null） |
| is_required | boolean | 是否必需技能 |
| has_required_child | boolean | 是否有必需子节点 |
| job_id | integer | 关联岗位 ID |

### 1.3 匹配度表

- [ ] 1.3.1 确认是否需要存储匹配度结果（或完全由后端实时计算）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer | 主键 |
| user_id | integer | 外键 → users.id |
| job_id | integer | 外键 → jobs.id |
| match_score | float | 匹配度（0-100） |
| matched_skills | text[] | 匹配的技能 |
| missing_skills | text[] | 缺失的技能 |

---

## 2. 种子数据插入

### 2.1 岗位数据（5 条）

- [ ] 2.1.1 插入岗位数据

| ID | 岗位 | 公司 | 地点 | 薪资 | 技能要求 |
|----|------|------|------|------|----------|
| 1 | 前端开发工程师 | 字节跳动 | 北京 | 25k-45k | Vue3, TypeScript, CSS3 |
| 2 | Java开发工程师 | 阿里巴巴 | 杭州 | 30k-50k | Java, Spring Boot, MySQL |
| 3 | 产品经理 | 腾讯 | 深圳 | 25k-40k | 产品规划, 用户研究, 数据分析 |
| 4 | UI设计师 | 网易 | 广州 | 20k-35k | Figma, 交互设计, 视觉设计 |
| 5 | 数据分析师 | 美团 | 北京 | 25k-40k | Python, SQL, 数据可视化 |

所有岗位的 `created_at` 和 `updated_at` 统一为对应日期：
- 岗位 1: `2026-04-01`
- 岗位 2: `2026-04-02`
- 岗位 3: `2026-04-03`
- 岗位 4: `2026-04-04`
- 岗位 5: `2026-04-05`

### 2.2 技能树数据（前端开发 — 3 级嵌套，共 13 个节点）

- [ ] 2.2.1 插入技能树节点（关联 job_id=1）

```json
[
  { "id": 1,  "name": "前端开发",  "category": "技术", "level": 1, "parent_id": null,  "job_id": 1 },
  { "id": 11, "name": "HTML/CSS",  "category": "基础", "level": 2, "parent_id": 1,    "job_id": 1 },
  { "id": 111,"name": "HTML5",     "category": null,  "level": 3, "parent_id": 11,   "job_id": 1 },
  { "id": 112,"name": "CSS3",      "category": null,  "level": 3, "parent_id": 11,   "job_id": 1 },
  { "id": 113,"name": "响应式设计", "category": null,  "level": 3, "parent_id": 11,   "job_id": 1 },
  { "id": 12, "name": "JavaScript","category": "核心", "level": 2, "parent_id": 1,    "job_id": 1 },
  { "id": 121,"name": "ES6+",      "category": null,  "level": 3, "parent_id": 12,   "job_id": 1 },
  { "id": 122,"name": "TypeScript","category": null,  "level": 3, "parent_id": 12,   "job_id": 1 },
  { "id": 123,"name": "异步编程",   "category": null,  "level": 3, "parent_id": 12,   "job_id": 1 },
  { "id": 13, "name": "框架",       "category": "应用", "level": 2, "parent_id": 1,    "job_id": 1 },
  { "id": 131,"name": "Vue3",      "category": null,  "level": 3, "parent_id": 13,   "job_id": 1 },
  { "id": 132,"name": "React",     "category": null,  "level": 3, "parent_id": 13,   "job_id": 1 },
  { "id": 133,"name": "Angular",   "category": null,  "level": 3, "parent_id": 13,   "job_id": 1 }
]
```

> **注意**: 后端返回的 `skill-tree` 接口包含 `is_required` 和 `has_required_child` 标记，Mock 中未包含这些字段，需后端业务逻辑补充。

### 2.3 用户技能匹配度数据（5 条）

- [ ] 2.3.1 插入匹配度数据（user_id=1 对各岗位的匹配度）

| 岗位ID | 匹配度 | 匹配技能 | 缺失技能 |
|--------|--------|----------|----------|
| 1 | 85 | Vue3, TypeScript, CSS3 | Webpack, 性能优化 |
| 2 | 65 | Java | Spring Boot, MySQL, 微服务 |
| 3 | 70 | 数据分析 | 产品规划, 用户研究 |
| 4 | 55 | — | Figma, 交互设计, 视觉设计 |
| 5 | 60 | Python, SQL | 数据可视化, 机器学习 |

> **注意**: 如果后端匹配度是实时计算的，这组数据可作为计算公式的验证用例。

---

## 3. API 接口验证

- [ ] 3.1 `POST /jobs` — 创建岗位（管理后台）
- [ ] 3.2 `GET /jobs` — 获取岗位列表（验证分页）
- [ ] 3.3 `GET /jobs/{job_id}/skill-tree` — 获取岗位技能树（验证 `is_required` 标记）
- [ ] 3.4 `GET /jobs/{job_id}/match` — 计算用户-岗位匹配度（验证 0-100 浮点数）

---

## 4. 验证清单

- [ ] 4.1 调用 `GET /jobs` 返回 5 个岗位
- [ ] 4.2 调用 `GET /jobs/1/skill-tree` 返回完整 3 级技能树
- [ ] 4.3 登录后调用 `GET /jobs/1/match`，返回匹配度 85
- [ ] 4.4 调用 `GET /jobs/4/match`（UI设计师），匹配度最低（55），缺失技能最多