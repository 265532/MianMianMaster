# Learning 模块 — 实施计划

> **模块**: 学习系统（Learning）  
> **优先级**: P1 — 用户成长路径核心  
> **后端前缀**: `/api/v1/learning`  
> **预估数据量**: 4 门课程 + 3 个收藏 + 5 道错题 + 5 个徽章 + 3 个用户徽章  
> **依赖**: Auth 模块

---

## 0. 前置确认

- [ ] 确认 `courses` 表 Schema（含 `title`, `description`, `category`, `difficulty` 等）
- [ ] 确认 `course_materials` 表 Schema（课程资料）
- [ ] 确认 `learning_progress` 表 Schema（用户学习进度）
- [ ] 确认 `collections` 表 Schema（收藏题库）
- [ ] 确认 `wrong_questions` 表 Schema（错题本）
- [ ] 确认 `badges` 表 Schema（徽章定义）
- [ ] 确认 `user_badges` 表 Schema（用户徽章关联）
- [ ] 确认进度 100% 时自动颁发 `course_completed` 徽章的触发器

---

## 1. 数据库表创建

### 1.1 课程表

- [ ] 1.1.1 确认 `courses` 表结构

| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer | 主键 |
| title | varchar | 课程标题 |
| description | text | 课程描述 |
| category | varchar | 分类 |
| difficulty | varchar | 难度（easy / medium / hard） |
| created_at | timestamp | 创建时间 |
| updated_at | timestamp | 更新时间 |

### 1.2 收藏题库表

- [ ] 1.2.1 确认 `collections` 表结构

| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer | 主键 |
| user_id | integer | 外键 → users.id |
| title | varchar | 标题 |
| description | text | 描述 |
| question_count | integer | 题目数 |
| category | varchar | 分类 |
| difficulty | varchar | 难度 |
| saved_at | date | 收藏时间 |
| last_practiced | date | 最后练习时间 |

### 1.3 错题表

- [ ] 1.3.1 确认 `wrong_questions` 表结构

| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer | 主键 |
| user_id | integer | 外键 → users.id |
| question | text | 题目内容 |
| user_answer | text | 用户答案 |
| correct_answer | text | 正确答案 |
| explanation | text | 解析 |
| category | varchar | 分类 |
| difficulty | varchar | 难度 |
| mistake_count | integer | 错误次数 |
| last_mistake_at | date | 最后错误时间 |
| status | varchar | 状态（unreviewed / reviewed / mastered） |

### 1.4 徽章表

- [ ] 1.4.1 确认 `badges` 表结构

| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer | 主键 |
| name | varchar | 徽章名称 |
| description | text | 描述 |
| icon_url | varchar | 图标 |
| created_at | timestamp | 创建时间 |

### 1.5 用户徽章表

- [ ] 1.5.1 确认 `user_badges` 表结构

| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer | 主键 |
| user_id | integer | 外键 → users.id |
| badge_id | integer | 外键 → badges.id |
| awarded_at | timestamp | 颁发时间 |

---

## 2. 种子数据插入

### 2.1 课程数据（4 门）

- [ ] 2.1.1 插入课程

| ID | 标题 | 分类 | 难度 | 描述 |
|----|------|------|------|------|
| 1 | 逻辑思维提升 | 逻辑思维 | easy | 通过系统训练提升逻辑思维能力，掌握结构化思考方法，提高面试中的问题分析和解决能力。 |
| 2 | 表达结构优化 | 表达结构 | medium | 学习STAR法则等表达技巧，掌握清晰、有条理的表达方法，提高面试中的沟通效果。 |
| 3 | 专业深度强化 | 专业深度 | hard | 深入探讨技术领域的核心概念和前沿趋势，提升专业知识深度，应对技术面试中的 challenging questions。 |
| 4 | 面试技巧全攻略 | 面试技巧 | easy | 全面覆盖面试各个环节的技巧，包括简历准备、自我介绍、行为问题回答、薪资谈判等。 |

所有课程 `created_at`: `2026-01-01T00:00:00Z`, `updated_at`: `2026-05-09T00:00:00Z`

### 2.2 收藏题库（3 个，user_id=1）

- [ ] 2.2.1 插入收藏

| ID | 标题 | 描述 | 题目数 | 分类 | 难度 | 收藏时间 | 最后练习 |
|----|------|------|--------|------|------|----------|----------|
| 1 | 高频算法 50 题 | 涵盖面试中常见的算法题，包括排序、查找、动态规划等 | 24 | 算法 | medium | 2026-03-20 | 2026-03-25 |
| 2 | 前端框架高频题 | Vue、React、Angular 等前端框架的常见面试题 | 32 | 前端 | medium | 2026-03-15 | 2026-03-22 |
| 3 | 系统设计基础 | 分布式系统、微服务、缓存等系统设计相关问题 | 18 | 后端 | hard | 2026-03-10 | 2026-03-18 |

### 2.3 错题数据（5 道，user_id=1）

- [ ] 2.3.1 插入错题

| ID | 题目 | 用户答案 | 正确答案 | 分类 | 难度 | 错误次数 | 状态 |
|----|------|----------|----------|------|------|----------|------|
| 1 | 在 Vue3 中，如何实现组件间的通信？ | 使用 props 和 events | 使用 props、events、provide/inject、pinia 等多种方式 | 前端 | medium | 2 | unreviewed |
| 2 | 什么是闭包？ | 闭包是一个函数 | 闭包是指有权访问另一个函数作用域中变量的函数 | JavaScript | medium | 1 | reviewed |
| 3 | 如何优化 React 应用的性能？ | 使用 memo 和 useCallback | 使用 memo、useCallback、useMemo、虚拟列表、代码分割等多种方式 | 前端 | hard | 3 | unreviewed |
| 4 | 什么是事件冒泡和事件捕获？ | 事件冒泡是从子元素向父元素传播，事件捕获是从父元素向子元素传播 | 事件冒泡是从触发事件的元素开始，向上传播到根元素；事件捕获是从根元素开始，向下传播到触发事件的元素 | JavaScript | easy | 1 | reviewed |
| 5 | 如何实现一个深度克隆函数？ | 使用 JSON.parse(JSON.stringify(obj)) | JSON 方法有局限性，对于函数、Symbol、循环引用等无法正确处理，需要使用递归实现 | JavaScript | medium | 2 | unreviewed |

每条错题的 `explanation`（解析）和 `last_mistake_at`（最后错误时间）：

| ID | 解析 | 最后错误时间 |
|----|------|-------------|
| 1 | Vue3 提供了多种组件间通信方式，包括传统的 props 和 events，以及 provide/inject API，还有状态管理库如 pinia | 2026-03-24 |
| 2 | 闭包的核心特点是能够访问其词法作用域之外的变量，即使创建它的函数已经执行完毕 | 2026-03-20 |
| 3 | React 性能优化是一个综合工程，需要从多个方面入手，包括组件渲染优化、状态管理优化、资源加载优化等 | 2026-03-18 |
| 4 | DOM 事件流包括三个阶段：事件捕获阶段、目标阶段和事件冒泡阶段 | 2026-03-15 |
| 5 | JSON 序列化方法无法处理函数、Symbol、undefined、循环引用等情况，需要使用递归并处理这些特殊情况 | 2026-03-12 |

### 2.4 徽章定义（5 个）

- [ ] 2.4.1 插入徽章定义

| ID | 名称 | 描述 | 图标 |
|----|------|------|------|
| 1 | 初次尝试 | 完成第一次游戏式面试 | sparkles |
| 2 | 连续打卡 | 连续10天进行面试练习 | calendar |
| 3 | 正确率达人 | 单次关卡正确率达到90%以上 | check-circle |
| 4 | 挑战大师 | 完成所有困难级别关卡 | trophy |
| 5 | 知识渊博 | 完成所有技能类别的题目 | book-open |

所有徽章 `created_at`: `2026-01-01T00:00:00Z`

### 2.5 用户徽章（3 个，user_id=1）

- [ ] 2.5.1 插入用户徽章

| ID | 徽章ID | 徽章名称 | 颁发时间 |
|----|--------|----------|----------|
| 1 | 1 | 初次尝试 | 2026-03-01T00:00:00Z |
| 2 | 2 | 连续打卡 | 2026-03-12T00:00:00Z |
| 3 | 3 | 正确率达人 | 2026-03-18T00:00:00Z |

---

## 3. API 接口验证

### 3.1 课程与资料

- [ ] 3.1.1 `POST /learning/courses` — 创建课程（管理后台）
- [ ] 3.1.2 `GET /learning/courses` — 获取课程列表（验证分页）
- [ ] 3.1.3 `POST /learning/materials` — 为课程添加资料（管理后台）
- [ ] 3.1.4 `POST /learning/progress/update` — 更新学习进度
- [ ] 3.1.5 `GET /learning/progress/{course_id}` — 获取课程学习进度

### 3.2 题库练习

- [ ] 3.2.1 `POST /learning/collections` — 收藏题目
- [ ] 3.2.2 `GET /learning/collections` — 获取收藏列表（验证分页）
- [ ] 3.2.3 `POST /learning/wrong-questions` — 记录错题
- [ ] 3.2.4 `GET /learning/wrong-questions` — 获取错题列表（验证分页）
- [ ] 3.2.5 `POST /learning/wrong-questions/{question_id}/master` — 标记错题已掌握

### 3.3 徽章系统

- [ ] 3.3.1 `POST /learning/badges` — 创建徽章定义（管理后台）
- [ ] 3.3.2 `GET /learning/badges` — 获取徽章列表
- [ ] 3.3.3 `POST /learning/badges/award/{badge_id}` — 为用户颁发徽章
- [ ] 3.3.4 `GET /learning/my-badges` — 获取当前用户的徽章

---

## 4. 验证清单

- [ ] 4.1 调用 `GET /learning/courses` 返回 4 门课程
- [ ] 4.2 调用 `GET /learning/collections` 返回 3 个收藏题库
- [ ] 4.3 调用 `GET /learning/wrong-questions` 返回 5 道错题
- [ ] 4.4 调用 `GET /learning/badges` 返回 5 个徽章定义
- [ ] 4.5 调用 `GET /learning/my-badges` 返回 3 个用户已获得徽章
- [ ] 4.6 调用 `POST /learning/progress/update` 更新进度到 100%，验证自动颁发 `course_completed` 徽章
- [ ] 4.7 调用 `POST /learning/wrong-questions/{id}/master` 标记错题已掌握，状态变为 `mastered`