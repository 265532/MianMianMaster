# Assessment 模块 — 实施计划

> **模块**: 测评系统（Assessment）  
> **优先级**: P1 — 核心业务闭环起点  
> **后端前缀**: `/api/v1/assessments`  
> **预估数据量**: 3 条测评 + 3 条结果  
> **依赖**: Auth 模块、Job 模块

---

## 0. 前置确认

- [ ] 确认 `assessments` 表 Schema（含 `title`, `type`, `questions` 等）
- [ ] 确认 `assessment_questions` 表 Schema（题目类型：single_choice / multiple_choice / text）
- [ ] 确认 `assessment_results` 表 Schema（含 `score`, `details` 等）
- [ ] 确认 `user_skill_mastery` 表（测评提交后后端自动更新技能掌握度）
- [ ] 确认 LLM 判卷异步任务机制（text 类型题目）

---

## 1. 数据库表创建

### 1.1 测评试卷表

- [ ] 1.1.1 确认 `assessments` 表结构

| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer | 主键 |
| title | varchar | 测评标题 |
| type | varchar | 类型（technical / logic / communication / general） |
| created_at | timestamp | 创建时间 |

### 1.2 测评题目表

- [ ] 1.2.1 确认 `assessment_questions` 表结构

| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer | 主键 |
| assessment_id | integer | 外键 → assessments.id |
| question_type | varchar | 题目类型（single_choice / multiple_choice / text） |
| content | text | 题目内容 |
| options | jsonb | 选项（选择题） |
| correct_answer | varchar | 正确答案 |
| score | integer | 分值 |

### 1.3 测评结果表

- [ ] 1.3.1 确认 `assessment_results` 表结构

| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer | 主键 |
| assessment_id | integer | 外键 → assessments.id |
| user_id | integer | 外键 → users.id |
| score | integer | 总分 |
| details | jsonb | 子维度评分 |
| created_at | timestamp | 提交时间 |

---

## 2. 种子数据插入

### 2.1 测评试卷（3 条）

- [ ] 2.1.1 插入测评试卷

| ID | 标题 | 类型 | 创建时间 |
|----|------|------|----------|
| 1 | 前端开发能力测评 | technical | 2026-05-09T00:00:00Z |
| 2 | 逻辑思维测评 | logic | 2026-05-08T00:00:00Z |
| 3 | 表达能力测评 | communication | 2026-05-07T00:00:00Z |

> **注意**: Mock 中未包含题目内容（questions 字段），后端需单独补充题目数据。以下为建议的题目结构：

### 2.2 测评题目（建议数据，Mock 中无）

- [ ] 2.2.1 为测评 1（前端开发能力测评）插入题目

```json
[
  {
    "assessment_id": 1,
    "question_type": "single_choice",
    "content": "Vue 3 的响应式系统基于哪个 API？",
    "options": ["Object.defineProperty", "Proxy", "Getter/Setter", "Observer"],
    "correct_answer": "Proxy",
    "score": 10
  },
  {
    "assessment_id": 1,
    "question_type": "multiple_choice",
    "content": "以下哪些是 TypeScript 的特性？",
    "options": ["静态类型检查", "接口", "泛型", "宏"],
    "correct_answer": "静态类型检查,接口,泛型",
    "score": 15
  },
  {
    "assessment_id": 1,
    "question_type": "text",
    "content": "请简述前端性能优化的常用手段。",
    "options": null,
    "correct_answer": null,
    "score": 25
  }
]
```

- [ ] 2.2.2 为测评 2（逻辑思维测评）插入题目（建议不少于 5 题）
- [ ] 2.2.3 为测评 3（表达能力测评）插入题目（建议不少于 5 题）

### 2.3 测评结果（3 条，user_id=1）

- [ ] 2.3.1 插入测评结果

| ID | 测评ID | 用户ID | 总分 | 子维度 | 时间 |
|----|--------|--------|------|--------|------|
| 1 | 1 | 1 | 85 | technical:90, communication:85, logic:92, problem_solving:88 | 2026-05-09T01:00:00Z |
| 2 | 2 | 1 | 78 | logical_reasoning:82, analytical_thinking:75, pattern_recognition:80, critical_thinking:76 | 2026-05-08T01:00:00Z |
| 3 | 3 | 1 | 92 | clarity:95, structure:90, persuasion:88, listening:94 | 2026-05-07T01:00:00Z |

每个结果的 `details` 数据结构：

```json
// 测评 1 (technical)
{
  "technical": 90,
  "communication": 85,
  "logic": 92,
  "problem_solving": 88
}

// 测评 2 (logic)
{
  "logical_reasoning": 82,
  "analytical_thinking": 75,
  "pattern_recognition": 80,
  "critical_thinking": 76
}

// 测评 3 (communication)
{
  "clarity": 95,
  "structure": 90,
  "persuasion": 88,
  "listening": 94
}
```

---

## 3. API 接口验证

- [ ] 3.1 `POST /assessments` — 创建测评试卷（含题目，管理后台）
- [ ] 3.2 `POST /assessments/submit` — 提交答卷（验证自动判卷 + 技能掌握度更新）
- [ ] 3.3 `GET /assessments` — 获取测评列表（验证分页）
- [ ] 3.4 `GET /assessments/{id}/result` — 获取测评结果（如后端已实现）

---

## 4. 验证清单

- [ ] 4.1 调用 `GET /assessments` 返回 3 个测评试卷
- [ ] 4.2 模拟提交测评 1 的答卷，返回结果 score=85
- [ ] 4.3 提交测评后，`user_skill_mastery` 表已更新
- [ ] 4.4 text 类型题目提交后，LLM 异步判卷正常（或回退为 0 分）