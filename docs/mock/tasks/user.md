# User 模块 — 实施计划

> **模块**: 用户中心（User）  
> **优先级**: P0 — 个人中心核心功能  
> **后端前缀**: `/api/v1/user`  
> **预估数据量**: ~20 条记录  
> **依赖**: Auth 模块（users 表需先存在）

---

## 0. 前置确认

- [ ] 确认 `users` 表已存在且包含 `id=1`（王同学）的用户
- [ ] 确认 `user_profiles` 表 Schema（或确认 profile 字段是 users 表的 JSON 列）
- [ ] 确认 `interview_history` 表是否需要新建（当前后端无此接口）
- [ ] 确认 `ability_data` 存储方案（当前后端无此接口）
- [ ] 确认 `resume` 表是否需要新建（当前后端无此接口）
- [ ] 确认 `resume_diagnosis` 表是否需要新建（当前后端无此接口）

---

## 1. 数据库表创建

### 1.1 User Profile 表

- [ ] 1.1.1 确认 `user_profiles` 表结构

| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer | 主键 |
| user_id | integer | 外键 → users.id |
| avatar_url | varchar | 头像 URL |
| education | varchar | 教育背景 |
| target_position | varchar | 目标岗位 |
| work_years | integer | 工作年限 |
| created_at | timestamp | 创建时间 |
| updated_at | timestamp | 更新时间 |

### 1.2 面试历史表（需后端新增接口）

- [ ] 1.2.1 确认是否需要新建 `interview_history` 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer | 主键 |
| user_id | integer | 外键 → users.id |
| date | date | 面试日期 |
| company | varchar | 公司名称 |
| position | varchar | 面试岗位 |
| round | varchar | 面试轮次 |
| type | varchar | 面试类型 |
| score | integer | 总评分 |
| status | varchar | 状态（passed / failed） |
| tags | text[] | 标签 |
| feedback | text | 反馈 |
| details | jsonb | 子维度评分 |

### 1.3 简历表（需后端新增接口）

- [ ] 1.3.1 确认是否需要新建 `resumes` 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer | 主键 |
| user_id | integer | 外键 → users.id |
| basic_info | jsonb | 基本信息 |
| education | jsonb | 教育经历 |
| experience | jsonb | 工作/实习经历 |
| skills | jsonb | 技能列表 |
| projects | jsonb | 项目经历 |

### 1.4 简历诊断结果表（需后端新增接口）

- [ ] 1.4.1 确认是否需要新建 `resume_diagnoses` 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer | 主键 |
| user_id | integer | 外键 → users.id |
| overall_score | integer | 总分 |
| strengths | jsonb | 优势 |
| weaknesses | jsonb | 短板 |
| suggestions | text[] | 建议 |
| match_rate | jsonb | 岗位匹配度 |

---

## 2. 种子数据插入

### 2.1 User Profile

- [ ] 2.1.1 插入王同学的用户画像（见 Auth 模块 2.4.1，此处已包含）

### 2.2 面试历史（12 条）

- [ ] 2.2.1 插入面试历史记录

| ID | 日期 | 公司 | 岗位 | 轮次 | 类型 | 评分 | 状态 | 标签 |
|----|------|------|------|------|------|------|------|------|
| 1 | 2026-03-15 | 字节跳动 | 前端开发工程师 | 二面 | 技术面 | 88 | passed | Vue3, TypeScript, 算法 |
| 2 | 2026-02-28 | 阿里巴巴 | Java 开发工程师 | 一面 | 技术面 | 82 | passed | Java, Spring Boot, 数据库 |
| 3 | 2025-11-15 | 腾讯 | UI 设计师 | 三面 | 设计面 | 91 | passed | UI/UX, Figma, 交互设计 |
| 4 | 2025-10-20 | 美团 | 产品经理 | 一面 | 产品面 | 78 | failed | 产品设计, 用户研究, 数据分析 |
| 5 | 2025-09-10 | 百度 | 数据分析师 | 二面 | 技术面 | 85 | passed | 数据分析, SQL, Python |
| 6 | 2025-08-05 | 京东 | 后端开发工程师 | 一面 | 技术面 | 80 | passed | Java, 微服务, 分布式 |
| 7 | 2025-06-20 | 拼多多 | 前端开发工程师 | 三面 | 技术面 | 92 | passed | React, Node.js, 性能优化 |
| 8 | 2025-05-15 | 小米 | 测试工程师 | 一面 | 技术面 | 76 | failed | 测试, 自动化, 质量保证 |
| 9 | 2025-04-10 | 网易 | 前端开发工程师 | 二面 | 技术面 | 86 | passed | Vue3, Webpack, 响应式设计 |
| 10 | 2025-03-05 | 新浪 | 后端开发工程师 | 一面 | 技术面 | 79 | passed | Java, Spring Cloud, 缓存 |
| 11 | 2024-12-20 | 搜狐 | 前端开发工程师 | 一面 | 技术面 | 83 | passed | JavaScript, HTML/CSS, 浏览器原理 |
| 12 | 2024-11-10 | 优酷 | 产品经理 | 二面 | 产品面 | 81 | failed | 产品规划, 用户体验, 市场分析 |

每条记录的 `details` 子维度评分：

| ID | technical | communication | logic | problem_solving |
|----|-----------|---------------|-------|-----------------|
| 1 | 90 | 85 | 92 | 88 |
| 2 | 85 | 78 | 88 | 82 |
| 3 | 92 | 90 | 85 | 88 |
| 4 | 75 | 82 | 78 | 75 |
| 5 | 88 | 82 | 90 | 85 |
| 6 | 82 | 78 | 85 | 80 |
| 7 | 95 | 90 | 92 | 90 |
| 8 | 78 | 75 | 72 | 76 |
| 9 | 88 | 85 | 86 | 84 |
| 10 | 82 | 75 | 80 | 78 |
| 11 | 85 | 80 | 82 | 83 |
| 12 | 78 | 85 | 80 | 79 |

### 2.3 能力雷达数据（4 个岗位）

- [ ] 2.3.1 插入能力数据（如后端有对应表）

#### 前端开发工程师

```json
{
  "position": "前端开发工程师",
  "current": [85, 78, 92, 70, 88, 75, 82],
  "required": [90, 85, 80, 90, 85, 95, 90],
  "indicators": [
    { "name": "技术深度", "max": 100 },
    { "name": "逻辑思维", "max": 100 },
    { "name": "表达能力", "max": 100 },
    { "name": "项目经验", "max": 100 },
    { "name": "学习潜力", "max": 100 },
    { "name": "工程化能力", "max": 100 },
    { "name": "团队协作", "max": 100 }
  ],
  "gap_skills": [
    { "name": "Vue3 源码深度", "gap": 15, "level": "high" },
    { "name": "工程化架构能力", "gap": 20, "level": "high" },
    { "name": "项目经验", "gap": 20, "level": "high" },
    { "name": "团队协作", "gap": 8, "level": "medium" }
  ],
  "strengths": [
    { "name": "表达能力", "score": 92 },
    { "name": "学习潜力", "score": 88 },
    { "name": "技术深度", "score": 85 }
  ]
}
```

#### Java 开发工程师

```json
{
  "position": "Java 开发工程师",
  "current": [70, 85, 75, 65, 80, 60, 75],
  "required": [90, 85, 80, 90, 85, 85, 85],
  "indicators": [
    { "name": "技术深度", "max": 100 },
    { "name": "逻辑思维", "max": 100 },
    { "name": "表达能力", "max": 100 },
    { "name": "项目经验", "max": 100 },
    { "name": "学习潜力", "max": 100 },
    { "name": "系统设计", "max": 100 },
    { "name": "团队协作", "max": 100 }
  ],
  "gap_skills": [
    { "name": "系统设计", "gap": 25, "level": "high" },
    { "name": "技术深度", "gap": 20, "level": "high" },
    { "name": "项目经验", "gap": 25, "level": "high" },
    { "name": "工程化能力", "gap": 15, "level": "medium" }
  ],
  "strengths": [
    { "name": "逻辑思维", "score": 85 },
    { "name": "学习潜力", "score": 80 },
    { "name": "团队协作", "score": 75 }
  ]
}
```

#### 产品经理

```json
{
  "position": "产品经理",
  "current": [65, 80, 90, 75, 85, 82, 95],
  "required": [70, 85, 90, 85, 85, 90, 90],
  "indicators": [
    { "name": "业务理解", "max": 100 },
    { "name": "逻辑思维", "max": 100 },
    { "name": "表达能力", "max": 100 },
    { "name": "项目经验", "max": 100 },
    { "name": "学习潜力", "max": 100 },
    { "name": "用户研究", "max": 100 },
    { "name": "团队协作", "max": 100 }
  ],
  "gap_skills": [
    { "name": "用户研究", "gap": 8, "level": "medium" },
    { "name": "项目经验", "gap": 10, "level": "medium" },
    { "name": "业务理解", "gap": 5, "level": "low" }
  ],
  "strengths": [
    { "name": "团队协作", "score": 95 },
    { "name": "表达能力", "score": 90 },
    { "name": "学习潜力", "score": 85 }
  ]
}
```

#### UI 设计师

```json
{
  "position": "UI 设计师",
  "current": [80, 75, 85, 70, 90, 88, 82],
  "required": [90, 85, 85, 85, 85, 95, 85],
  "indicators": [
    { "name": "设计能力", "max": 100 },
    { "name": "创意思维", "max": 100 },
    { "name": "表达能力", "max": 100 },
    { "name": "项目经验", "max": 100 },
    { "name": "学习潜力", "max": 100 },
    { "name": "工具熟练度", "max": 100 },
    { "name": "团队协作", "max": 100 }
  ],
  "gap_skills": [
    { "name": "工具熟练度", "gap": 7, "level": "medium" },
    { "name": "项目经验", "gap": 15, "level": "high" },
    { "name": "创意思维", "gap": 10, "level": "medium" }
  ],
  "strengths": [
    { "name": "学习潜力", "score": 90 },
    { "name": "工具熟练度", "score": 88 },
    { "name": "表达能力", "score": 85 }
  ]
}
```

### 2.4 简历数据

- [ ] 2.4.1 插入简历数据（user_id=1）

```json
{
  "basic_info": {
    "name": "王同学",
    "major": "计算机专业",
    "grade": "大三",
    "school": "北京大学"
  },
  "education": [
    {
      "school": "北京大学",
      "major": "计算机科学与技术",
      "start_date": "2022-09",
      "end_date": "2026-06",
      "degree": "本科"
    }
  ],
  "experience": [
    {
      "company": "字节跳动",
      "position": "前端开发实习生",
      "start_date": "2025-07",
      "end_date": "2025-09",
      "description": "参与公司内部管理系统的前端开发，使用Vue3 + TypeScript技术栈，负责页面组件的开发和优化。"
    },
    {
      "company": "阿里巴巴",
      "position": "前端开发实习生",
      "start_date": "2024-07",
      "end_date": "2024-09",
      "description": "参与电商平台的前端开发，使用React + TypeScript技术栈，负责商品详情页的开发和性能优化。"
    }
  ],
  "skills": [
    { "name": "Vue3", "level": "expert" },
    { "name": "React", "level": "advanced" },
    { "name": "TypeScript", "level": "advanced" },
    { "name": "Java", "level": "intermediate" },
    { "name": "Python", "level": "intermediate" },
    { "name": "SQL", "level": "intermediate" }
  ],
  "projects": [
    {
      "name": "AI面试模拟平台",
      "role": "前端开发",
      "description": "使用Vue3 + TypeScript + Tailwind CSS开发的AI面试模拟平台，包含面试练习、能力评估、简历诊断等功能。",
      "technologies": "Vue3, TypeScript, Tailwind CSS, ECharts"
    },
    {
      "name": "在线学习平台",
      "role": "全栈开发",
      "description": "使用React + Node.js + MongoDB开发的在线学习平台，包含课程管理、用户管理、学习进度跟踪等功能。",
      "technologies": "React, Node.js, MongoDB, Express"
    }
  ]
}
```

### 2.5 简历诊断结果

- [ ] 2.5.1 插入简历诊断结果（user_id=1）

```json
{
  "overall_score": 85,
  "strengths": [
    { "name": "技术栈全面", "score": 90 },
    { "name": "项目经验丰富", "score": 85 },
    { "name": "实习经历优质", "score": 95 }
  ],
  "weaknesses": [
    { "name": "技能描述不够具体", "score": 65 },
    { "name": "项目成果量化不足", "score": 70 },
    { "name": "教育背景描述简单", "score": 75 }
  ],
  "suggestions": [
    "将技能水平具体化，例如：Vue3 (精通)、React (熟练)",
    "量化项目成果，例如：优化页面加载速度提升30%",
    "添加教育背景中的相关课程和成绩",
    "突出个人优势和独特性，避免模板化",
    "根据目标岗位调整简历内容，突出相关技能和经验"
  ],
  "match_rate": {
    "前端开发工程师": 90,
    "Java开发工程师": 75,
    "全栈开发工程师": 85,
    "产品经理": 60
  }
}
```

---

## 3. API 接口验证

- [ ] 3.1 `GET /user/profile` — 获取用户画像（含自动初始化）
- [ ] 3.2 `PUT /user/profile` — 更新用户画像（部分更新）
- [ ] 3.3 `POST /user/security/change-password` — 修改密码
- [ ] 3.4 `POST /user/security/change-phone` — 修改手机号

---

## 4. ⚠️ 需后端新增的接口

以下接口在 Mock 中存在但后端 API 清单中无对应实现：

- [ ] 4.1 `GET /user/interview-history` — 面试历史记录（建议合并到 Interview 模块）
- [ ] 4.2 `GET /user/ability-data` — 能力雷达数据（建议由 Assessment 结果计算得出）
- [ ] 4.3 `GET /user/game-interview-data` — 游戏化面试聚合数据（建议合并到 Interview 模块）
- [ ] 4.4 `GET /user/resume` — 简历数据（建议新增简历模块）
- [ ] 4.5 `POST /user/resume/diagnose` — 简历诊断（建议新增简历模块）

---

## 5. 验证清单

- [ ] 5.1 登录后调用 `GET /user/profile`，返回完整用户画像
- [ ] 5.2 调用 `PUT /user/profile` 更新 `target_position`，再次查询确认更新成功
- [ ] 5.3 调用 `POST /user/security/change-password` 修改密码，用新密码重新登录