# Interview 模块 — 实施计划

> **模块**: AI 面试（Interview）  
> **优先级**: P1 — 产品核心卖点  
> **后端前缀**: `/api/v1/interview`  
> **预估数据量**: 3 条会话 + 1 份报告 + 5 个关卡 + 5 个成就 + 5 条排行榜  
> **依赖**: Auth 模块、Job 模块

---

## 0. 前置确认

- [ ] 确认 `interview_sessions` 表 Schema（含 `status`, `max_rounds`, `current_round`, `feedback` 等）
- [ ] 确认 `interview_messages` 表 Schema（对话记录）
- [ ] 确认 `interview_reports` 表 Schema（面试报告）
- [ ] 确认 `game_levels` 表是否需要新建（当前后端无此接口）
- [ ] 确认 `game_achievements` 表是否需要新建（或合并到 Learning 徽章系统）
- [ ] 确认 `leaderboard` 表/视图是否需要新建（当前后端无此接口）
- [ ] 确认 SSE 流式对话 `/chat` 接口实现方式
- [ ] 确认 Celery 异步报告生成机制
- [ ] 确认面试状态机：`scheduled` → `in_progress` → `completed`/`cancelled`

---

## 1. 数据库表创建

### 1.1 面试会话表

- [ ] 1.1.1 确认 `interview_sessions` 表结构

| 字段 | 类型 | 说明 |
|------|------|------|
| id | varchar | 主键（如 session-001） |
| user_id | integer | 外键 → users.id |
| job_title | varchar | 面试岗位 |
| company | varchar | 公司名称 |
| status | varchar | 状态（scheduled / in_progress / completed / cancelled） |
| type | varchar | 面试类型 |
| max_rounds | integer | 最大轮次 |
| current_round | integer | 当前轮次 |
| total_score | integer | 总分（可为 null） |
| feedback | text | 反馈（可为 null） |
| details | jsonb | 子维度评分（可为 null） |
| created_at | timestamp | 创建时间 |
| started_at | timestamp | 开始时间（可为 null） |
| ended_at | timestamp | 结束时间（可为 null） |

### 1.2 面试报告表

- [ ] 1.2.1 确认 `interview_reports` 表结构

| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer | 主键 |
| session_id | varchar | 外键 → interview_sessions.id |
| status | varchar | 报告状态（pending / generating / completed / failed） |
| overall_score | integer | 总分 |
| dimensions | jsonb | 各维度评分 |
| strengths | text[] | 优势 |
| weaknesses | text[] | 短板 |
| suggestions | text[] | 建议 |
| generated_at | timestamp | 生成时间 |

### 1.3 游戏化关表（需后端新增接口）

- [ ] 1.3.1 确认是否需要新建 `game_levels` 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer | 主键 |
| name | varchar | 关卡名称 |
| title | varchar | 关卡标题 |
| difficulty | varchar | 难度（简单/中等/困难/专家/终极） |
| description | text | 描述 |
| interviews | integer | 面试数量 |
| skills | text[] | 考察技能 |
| unlock_requirements | varchar | 解锁条件 |
| icon | varchar | 图标 |
| reward | varchar | 奖励 |
| question_count | integer | 题目数量 |
| time_limit | integer | 时间限制（分钟） |
| sort_order | integer | 排序 |

### 1.4 游戏化成就表（需后端新增接口）

- [ ] 1.4.1 确认是否需要新建 `game_achievements` 表（或复用 Learning 徽章系统）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer | 主键 |
| name | varchar | 成就名称 |
| description | text | 描述 |
| unlocked | boolean | 是否解锁 |
| unlocked_at | timestamp | 解锁时间 |
| progress | integer | 进度（0-100） |

### 1.5 排行榜表（需后端新增接口）

- [ ] 1.5.1 确认是否需要新建 `leaderboard` 表/视图

| 字段 | 类型 | 说明 |
|------|------|------|
| rank | integer | 排名 |
| user_id | integer | 外键 → users.id |
| name | varchar | 昵称 |
| score | integer | 得分 |
| avatar | varchar | 头像 |

---

## 2. 种子数据插入

### 2.1 面试会话（3 条，user_id=1）

- [ ] 2.1.1 插入面试会话

| ID | 岗位 | 公司 | 状态 | 类型 | 最大轮次 | 当前轮次 | 总分 | 反馈 |
|----|------|------|------|------|----------|----------|------|------|
| session-001 | 前端开发工程师 | 字节跳动 | completed | technical | 10 | 10 | 85 | 技术基础扎实，沟通表达清晰，建议加强系统设计能力。 |
| session-002 | 全栈开发工程师 | 腾讯 | in_progress | technical | 10 | 3 | null | null |
| session-003 | React 开发工程师 | 阿里巴巴 | scheduled | technical | 8 | 0 | null | null |

各会话的 `details` 和时间：

**session-001**:
```json
{
  "details": { "technical": 88, "communication": 82, "logic": 85, "problem_solving": 80 },
  "created_at": "2026-05-28T10:00:00Z",
  "started_at": "2026-05-28T10:01:00Z",
  "ended_at": "2026-05-28T10:30:00Z"
}
```

**session-002**:
```json
{
  "created_at": "2026-05-30T14:00:00Z",
  "started_at": "2026-05-30T14:01:00Z"
}
```

**session-003**:
```json
{
  "created_at": "2026-05-31T09:00:00Z"
}
```

### 2.2 面试报告（1 份，关联 session-001）

- [ ] 2.2.1 插入面试报告

```json
{
  "session_id": "session-001",
  "status": "completed",
  "overall_score": 85,
  "dimensions": {
    "technical": 88,
    "communication": 82,
    "logic": 85,
    "problem_solving": 80
  },
  "strengths": [
    "Vue 3 Composition API 理解深入",
    "对前端性能优化有实际经验",
    "代码组织能力较强"
  ],
  "weaknesses": [
    "系统设计思维需要加强",
    "对微前端架构了解不够深入"
  ],
  "suggestions": [
    "建议学习系统设计方法论，如 CAP 理论、分布式系统设计",
    "可以尝试实践微前端架构，了解 qiankun 或 Module Federation",
    "多参与技术分享，提升表达能力"
  ],
  "generated_at": "2026-05-28T10:31:00Z"
}
```

### 2.3 游戏化关卡（5 个）

- [ ] 2.3.1 插入游戏化关卡数据

| ID | 名称 | 标题 | 难度 | 状态 | 进度 | 面试数 | 完成数 | 用时 | 正确率 | 题目数 | 时限 |
|----|------|------|------|------|------|--------|--------|------|--------|--------|------|
| 1 | 关卡 01 | 初级：校招面试 | 简单 | 已解锁 | 100% | 5 | 5 | 45分钟 | 80% | 8 | 30 |
| 2 | 关卡 02 | 中级：社招面试 | 中等 | 已解锁 | 30% | 8 | 2 | 30分钟 | 75% | 12 | 45 |
| 3 | 关卡 03 | 高级：架构师面试 | 困难 | 未解锁 | 0% | 10 | 0 | 0分钟 | 0% | 15 | 60 |
| 4 | 关卡 04 | 专家：CTO面试 | 专家 | 未解锁 | 0% | 12 | 0 | 0分钟 | 0% | 20 | 90 |
| 5 | 关卡 05 | 终极：AI面试官 | 终极 | 未解锁 | 0% | 15 | 0 | 0分钟 | 0% | 25 | 120 |

每个关卡的完整数据：

```json
[
  {
    "id": 1, "name": "关卡 01", "title": "初级：校招面试",
    "difficulty": "简单", "description": "模拟校招面试场景，面试官会问一些基础的技术问题和行为问题，适合刚毕业的学生或实习生",
    "interviews": 5, "completed": 5, "time_spent": "45分钟", "success_rate": "80%",
    "skills": ["基础知识", "自我介绍", "项目经验", "行为问题"],
    "unlock_requirements": null, "icon": "🎓", "reward": "校招面试认证",
    "question_count": 8, "time_limit": 30, "sort_order": 1
  },
  {
    "id": 2, "name": "关卡 02", "title": "中级：社招面试",
    "difficulty": "中等", "description": "模拟社招面试场景，面试官会问一些项目经验和技术深度的问题，适合有1-3年工作经验的开发者",
    "interviews": 8, "completed": 2, "time_spent": "30分钟", "success_rate": "75%",
    "skills": ["项目经验", "技术深度", "系统设计", "团队协作"],
    "unlock_requirements": "完成关卡 01", "icon": "💼", "reward": "社招面试认证",
    "question_count": 12, "time_limit": 45, "sort_order": 2
  },
  {
    "id": 3, "name": "关卡 03", "title": "高级：架构师面试",
    "difficulty": "困难", "description": "模拟架构师面试场景，面试官会问一些架构设计和技术选型的问题，适合有5年以上经验的资深开发者",
    "interviews": 10, "completed": 0, "time_spent": "0分钟", "success_rate": "0%",
    "skills": ["架构设计", "技术选型", "性能优化", "团队管理"],
    "unlock_requirements": "完成关卡 02", "icon": "🏗️", "reward": "架构师认证",
    "question_count": 15, "time_limit": 60, "sort_order": 3
  },
  {
    "id": 4, "name": "关卡 04", "title": "专家：CTO面试",
    "difficulty": "专家", "description": "模拟CTO面试场景，面试官会问一些战略规划和技术管理的问题，适合有8年以上经验的技术管理者",
    "interviews": 12, "completed": 0, "time_spent": "0分钟", "success_rate": "0%",
    "skills": ["战略规划", "技术管理", "商业模式", "领导力"],
    "unlock_requirements": "完成关卡 03", "icon": "👑", "reward": "CTO认证",
    "question_count": 20, "time_limit": 90, "sort_order": 4
  },
  {
    "id": 5, "name": "关卡 05", "title": "终极：AI面试官",
    "difficulty": "终极", "description": "与AI面试官进行1v1深度面试，AI会根据你的回答动态调整问题难度和方向",
    "interviews": 15, "completed": 0, "time_spent": "0分钟", "success_rate": "0%",
    "skills": ["综合能力", "临场应变", "深度思考", "创新思维"],
    "unlock_requirements": "完成关卡 04", "icon": "🤖", "reward": "AI面试官认证",
    "question_count": 25, "time_limit": 120, "sort_order": 5
  }
]
```

### 2.4 游戏化统计（user_id=1）

- [ ] 2.4.1 插入游戏化统计

```json
{
  "user_id": 1,
  "completed_levels": 1,
  "total_questions": 45,
  "correct_rate": "80%",
  "certifications": 1,
  "streak": "3天",
  "total_score": "1,250"
}
```

### 2.5 游戏化成就（5 个，user_id=1）

- [ ] 2.5.1 插入游戏化成就

```json
[
  { "id": 1, "name": "初次尝试", "description": "完成第一次游戏式面试",     "unlocked": true,  "unlocked_at": "2026-03-01", "progress": 100 },
  { "id": 2, "name": "连续打卡", "description": "连续10天进行面试练习",     "unlocked": true,  "unlocked_at": "2026-03-12", "progress": 100 },
  { "id": 3, "name": "正确率达人","description": "单次关卡正确率达到90%以上","unlocked": true,  "unlocked_at": "2026-03-18", "progress": 100 },
  { "id": 4, "name": "挑战大师",  "description": "完成所有困难级别关卡",     "unlocked": false, "unlocked_at": null,          "progress": 25  },
  { "id": 5, "name": "知识渊博",  "description": "完成所有技能类别的题目",    "unlocked": false, "unlocked_at": null,          "progress": 40  }
]
```

### 2.6 排行榜（5 条）

- [ ] 2.6.1 插入排行榜数据

| 排名 | 用户ID | 昵称 | 得分 | 头像 |
|------|--------|------|------|------|
| 1 | 101 | 张三 | 3250 | 👨‍💻 |
| 2 | 102 | 李四 | 3120 | 👩‍💻 |
| 3 | 103 | 王五 | 2980 | 👨‍💻 |
| 4 | 104 | 赵六 | 2950 | 👩‍💻 |
| 5 | 1 | 王同学 | 2850 | 🧑‍💻 |

> **注意**: 排行榜中排名 2-4 的用户（李四、王五、赵六）在种子数据中不存在，需要额外创建 3 个测试用户，或标记为可选。

### 2.7 SSE 对话预设数据（仅参考，不入库）

> **注意**: SSE 流式对话数据在 Mock 中为前端模拟，实际对话由后端 LLM 实时生成，无需种子数据。以下为 Mock 预设的 4 组对话场景，供后端开发 LLM 策略时参考：

- **default**（自我介绍引导）: "你好！我是今天的面试官，很高兴能和你交流。我们先从自我介绍开始吧，请简单介绍一下你自己，包括你的技术栈和项目经验。"
- **vue**（Vue 3 问题）: "我们来聊聊 Vue 3 的问题。请问 Vue 3 的 Composition API 和 Options API 有什么区别？你在项目中更倾向于使用哪种？为什么？"
- **react**（React 问题）: "接下来我们聊聊 React。请解释一下 React Hooks 的闭包陷阱是什么？你在实际开发中遇到过吗？是如何解决的？"
- **system**（系统设计）: "我们来讨论一个系统设计问题。如果让你设计一个短链接服务，你会怎么设计？请从高可用、高性能和可扩展性三个角度来分析。"

---

## 3. API 接口验证

- [ ] 3.1 `POST /interview/sessions` — 创建面试会话
- [ ] 3.2 `GET /interview/sessions/{session_id}` — 获取会话详情
- [ ] 3.3 `GET /interview/sessions` — 获取会话列表（分页+状态筛选）
- [ ] 3.4 `POST /interview/sessions/{session_id}/start` — 开始面试（生成开场白）
- [ ] 3.5 `POST /interview/sessions/{session_id}/chat` — 流式对话（SSE，验证 token/done/error/round_limit 事件）
- [ ] 3.6 `POST /interview/sessions/{session_id}/end` — 结束面试
- [ ] 3.7 `POST /interview/sessions/{session_id}/cancel` — 取消面试
- [ ] 3.8 `GET /interview/sessions/{session_id}/report` — 获取面试报告（验证 Celery 异步生成状态）

---

## 4. ⚠️ 需后端新增的接口

以下接口在 Mock 中存在但后端 API 清单中无对应实现：

- [ ] 4.1 `GET /interview/game/levels` — 游戏化关卡列表
- [ ] 4.2 `GET /interview/game/stats` — 游戏化统计
- [ ] 4.3 `GET /interview/game/achievements` — 游戏化成就
- [ ] 4.4 `GET /interview/game/leaderboard` — 排行榜
- [ ] 4.5 `GET /interview/questions` — 面试题库（Mock 返回空数组，需实现）

---

## 5. 验证清单

- [ ] 5.1 创建新会话，状态为 `scheduled`，`current_round=0`
- [ ] 5.2 启动会话，状态变为 `in_progress`，`started_at` 已设置
- [ ] 5.3 发送对话消息，SSE 流式返回 token 事件，`current_round` 递增
- [ ] 5.4 达到 `max_rounds` 后无法继续对话
- [ ] 5.5 结束会话，状态变为 `completed`，Celery 异步生成报告
- [ ] 5.6 轮询报告接口，状态从 `pending` → `generating` → `completed`
- [ ] 5.7 取消会话，状态变为 `cancelled`
- [ ] 5.8 非法状态转换报错（如 scheduled → end）
- [ ] 5.9 会话超时自动结束（`INTERVIEW_TIMEOUT_MINUTES`）