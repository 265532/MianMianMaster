# 后端补充接口计划清单 — 用户模块 3 个缺失端点

> **生成日期**: 2026-06-03
> **后端完成日期**: 2026-06-03
> **集成验证日期**: 2026-06-03
> **背景**: 前端 Profile.vue 页面调用以下 3 个接口时后端返回 500，原因是后端**未实现**这些路由
> **后端技术栈**: FastAPI + SQLAlchemy + Alembic
> **响应格式**: `{ code: 200, message: "success", data: <T> }`

---

## 集成验证结果

### 接口可达性: ✅ 全部通过

| 接口 | 状态码 | 响应 |
|------|--------|------|
| `GET /user/interview-history` | 200 | `data: []` |
| `GET /user/ability-data` | 200 | `data: []` |
| `GET /user/game-interview-data` | 200 | `data: { total_interviews, completed_interviews, ... }` |

### 数据结构匹配度

| 接口 | 匹配 | 说明 |
|------|------|------|
| `interview-history` | ⚠️ 部分 | 无数据时返回 `[]` 而非 `{ items, total, page, page_size }`，store 兼容处理 |
| `ability-data` | ⚠️ 部分 | 无数据时返回 `[]` 而非 `Record<string, AbilityDataItem>`，Profile.vue fallback 兼容 |
| `game-interview-data` | ❌ 不匹配 | 后端返回统计摘要，前端期望 `{ stats[], levels[], achievements[], leaderboard[] }` |

### 待后端跟进

1. **`interview-history`**: 有数据时需确认返回格式为 `{ items: [...], total, page, page_size }`（分页对象）
2. **`ability-data`**: 有数据时需确认返回格式为 `{ "岗位名": { current, required, indicators, gapSkills, strengths } }`（按岗位分组的对象）
3. **`game-interview-data`**: 需按前端 `GameInterviewDataResponse` 类型补充 `levels` / `achievements` / `leaderboard` 字段

---

## 接口 1: `GET /api/v1/user/interview-history`

> 获取当前用户的模拟面试历史记录（分页）

### 1.1 数据库

- [ ] 创建 `interview_histories` 表，字段如下：

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | INTEGER | PK, autoincrement | 主键 |
| user_id | INTEGER | FK → users.id, NOT NULL | 关联用户 |
| date | VARCHAR(10) | NOT NULL | 面试日期，格式 `YYYY-MM-DD` |
| company | VARCHAR(100) | NOT NULL | 公司名称 |
| position | VARCHAR(100) | NOT NULL | 岗位名称 |
| round | VARCHAR(50) | NOT NULL | 轮次（一面/二面/三面/HR面） |
| type | VARCHAR(50) | NOT NULL | 类型（技术面/产品面/设计面/HR面） |
| score | INTEGER | NOT NULL | 综合评分 0-100 |
| status | VARCHAR(20) | NOT NULL | 状态（passed/failed/pending） |
| tags | JSON | NULL | 标签数组，如 `["Vue3", "TypeScript"]` |
| feedback | TEXT | NULL | 面试反馈 |
| details | JSON | NULL | 分项评分 `{ technical, communication, logic, problem_solving }` |
| created_at | DATETIME | NOT NULL, default now | 创建时间 |
| updated_at | DATETIME | NOT NULL, default now, on update | 更新时间 |

- [ ] 生成 Alembic migration 并执行

### 1.2 Pydantic Schema

```python
class InterviewHistoryItem(BaseModel):
    id: int
    date: str
    company: str
    position: str
    round: str
    type: str
    score: int
    status: str
    tags: list[str] | None = None
    feedback: str | None = None
    details: dict | None = None  # { technical, communication, logic, problem_solving }

class InterviewHistoryResponse(BaseModel):
    items: list[InterviewHistoryItem]
    total: int
    page: int
    page_size: int
```

- [ ] 创建 `InterviewHistoryItem` schema
- [ ] 创建 `InterviewHistoryResponse` schema

### 1.3 CRUD / Service 层

- [ ] 实现 `get_interview_history(db, user_id, skip, limit)` 函数
- [ ] 按 `user_id` 过滤，按 `date DESC` 排序
- [ ] 支持分页参数 `skip`（默认 0）和 `limit`（默认 10）
- [ ] 返回 `(items, total)` 元组

### 1.4 Router 端点

```python
@router.get("/interview-history", response_model=ResponseModel[InterviewHistoryResponse])
def get_interview_history(
    skip: int = 0,
    limit: int = 10,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    ...
```

- [ ] 注册路由 `GET /user/interview-history`
- [ ] 从 token 中获取 `current_user`
- [ ] 调用 service 层查询数据
- [ ] 返回 `ResponseModel(code=200, message="success", data=InterviewHistoryResponse(...))`

### 1.5 验收测试

- [ ] 新用户无数据时返回 `{ items: [], total: 0, page: 1, page_size: 10 }`
- [ ] 有数据时返回正确分页结果
- [ ] 无 Token 调用返回 401
- [ ] 分页参数生效（skip=5, limit=5 返回第 2 页）

---

## 接口 2: `GET /api/v1/user/ability-data`

> 获取当前用户的能力评估数据，按岗位分组

### 2.1 数据库

- [ ] 创建 `ability_data` 表，字段如下：

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | INTEGER | PK, autoincrement | 主键 |
| user_id | INTEGER | FK → users.id, NOT NULL | 关联用户 |
| position | VARCHAR(100) | NOT NULL | 岗位名称（如 "前端开发工程师"） |
| current | JSON | NOT NULL | 当前能力值数组 `[85, 78, 92, ...]` |
| required | JSON | NOT NULL | 岗位要求值数组 `[90, 85, 80, ...]` |
| indicators | JSON | NOT NULL | 指标定义 `[{ name, max }]` |
| gap_skills | JSON | NOT NULL | 薄弱技能 `[{ name, gap, level }]` |
| strengths | JSON | NOT NULL | 优势技能 `[{ name, score }]` |
| created_at | DATETIME | NOT NULL, default now | 创建时间 |
| updated_at | DATETIME | NOT NULL, default now, on update | 更新时间 |

- [ ] 唯一约束：`(user_id, position)`
- [ ] 生成 Alembic migration 并执行

### 2.2 Pydantic Schema

```python
class AbilityDataIndicator(BaseModel):
    name: str
    max: int

class AbilityDataGapSkill(BaseModel):
    name: str
    gap: int
    level: str  # "low" | "medium" | "high"

class AbilityDataStrength(BaseModel):
    name: str
    score: int

class AbilityDataItem(BaseModel):
    current: list[int]
    required: list[int]
    indicators: list[AbilityDataIndicator]
    gap_skills: list[AbilityDataGapSkill]
    strengths: list[AbilityDataStrength]
```

- [ ] 创建上述 4 个 schema

### 2.3 CRUD / Service 层

- [ ] 实现 `get_ability_data(db, user_id)` 函数
- [ ] 按 `user_id` 过滤所有岗位的能力数据
- [ ] 返回 `dict[str, AbilityDataItem]`，key 为岗位名称

### 2.4 Router 端点

```python
@router.get("/ability-data", response_model=ResponseModel[dict[str, AbilityDataItem]])
def get_ability_data(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    ...
```

- [ ] 注册路由 `GET /user/ability-data`
- [ ] 从 token 中获取 `current_user`
- [ ] 调用 service 层查询数据
- [ ] 返回 `ResponseModel(code=200, message="success", data={...})`

### 2.5 验收测试

- [ ] 新用户无数据时返回 `{}`
- [ ] 有数据时返回按岗位分组的能力数据
- [ ] 无 Token 调用返回 401
- [ ] `current` 和 `required` 数组长度与 `indicators` 数组一致

---

## 接口 3: `GET /api/v1/user/game-interview-data`

> 获取当前用户的游戏化面试数据（统计、关卡、成就、排行榜）

### 3.1 数据库

需要 3 张表：

**表 1: `game_levels`**

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | INTEGER | PK, autoincrement | 主键 |
| user_id | INTEGER | FK → users.id, NOT NULL | 关联用户 |
| level_id | INTEGER | NOT NULL | 关卡编号 1-6 |
| name | VARCHAR(100) | NOT NULL | 关卡名称 |
| difficulty | VARCHAR(20) | NOT NULL | 难度（easy/medium/hard/expert） |
| progress | INTEGER | NOT NULL, default 0 | 进度 0-100 |
| completed | BOOLEAN | NOT NULL, default false | 是否完成 |
| questions | INTEGER | NOT NULL, default 0 | 总题数 |
| correct | INTEGER | NOT NULL, default 0 | 正确数 |
| time_spent | VARCHAR(20) | NOT NULL, default "0h 0m" | 耗时 |
| badge | VARCHAR(20) | NULL | 徽章（bronze/silver/gold/null） |
| skills | JSON | NOT NULL | 技能标签数组 |
| created_at | DATETIME | NOT NULL, default now | 创建时间 |
| updated_at | DATETIME | NOT NULL, default now, on update | 更新时间 |

- [ ] 唯一约束：`(user_id, level_id)`

**表 2: `game_achievements`**

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | INTEGER | PK, autoincrement | 主键 |
| user_id | INTEGER | FK → users.id, NOT NULL | 关联用户 |
| achievement_id | INTEGER | NOT NULL | 成就编号 |
| name | VARCHAR(100) | NOT NULL | 成就名称 |
| description | TEXT | NOT NULL | 成就描述 |
| icon | VARCHAR(50) | NOT NULL | 图标名 |
| unlocked | BOOLEAN | NOT NULL, default false | 是否解锁 |
| unlocked_at | VARCHAR(10) | NULL | 解锁日期 |
| progress | INTEGER | NULL | 进度 0-100（未解锁时） |
| created_at | DATETIME | NOT NULL, default now | 创建时间 |

- [ ] 唯一约束：`(user_id, achievement_id)`

**表 3: `game_leaderboard`**（可选，也可用全局查询）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | INTEGER | PK, autoincrement | 主键 |
| user_id | INTEGER | FK → users.id, NOT NULL, UNIQUE | 关联用户 |
| name | VARCHAR(100) | NOT NULL | 显示名 |
| score | INTEGER | NOT NULL, default 0 | 总得分 |
| avatar | VARCHAR(20) | NOT NULL | 头像 emoji |
| created_at | DATETIME | NOT NULL, default now | 创建时间 |
| updated_at | DATETIME | NOT NULL, default now, on update | 更新时间 |

- [ ] 生成 Alembic migration 并执行

### 3.2 Pydantic Schema

```python
class GameStatItem(BaseModel):
    label: str
    value: str | int

class GameLevel(BaseModel):
    id: int
    name: str
    difficulty: str
    progress: int
    completed: bool
    questions: int
    correct: int
    time_spent: str
    badge: str | None
    skills: list[str]

class GameAchievement(BaseModel):
    id: int
    name: str
    description: str
    icon: str
    unlocked: bool
    unlocked_at: str | None = None
    progress: int | None = None

class LeaderboardEntry(BaseModel):
    rank: int
    name: str
    score: int
    avatar: str
    is_current_user: bool = False

class GameInterviewDataResponse(BaseModel):
    stats: list[GameStatItem]
    levels: list[GameLevel]
    achievements: list[GameAchievement]
    leaderboard: list[LeaderboardEntry]
```

- [ ] 创建上述 6 个 schema

### 3.3 CRUD / Service 层

- [ ] 实现 `get_game_interview_data(db, user_id)` 函数
- [ ] 查询用户的关卡数据 → 构建 `levels` 列表
- [ ] 查询用户的成就数据 → 构建 `achievements` 列表
- [ ] 从关卡数据聚合 `stats`（已完成关卡数、总答题数、正确率等）
- [ ] 查询排行榜 top 10，标记当前用户
- [ ] 新用户首次调用时自动创建 6 个默认关卡记录（progress=0）

### 3.4 Router 端点

```python
@router.get("/game-interview-data", response_model=ResponseModel[GameInterviewDataResponse])
def get_game_interview_data(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    ...
```

- [ ] 注册路由 `GET /user/game-interview-data`
- [ ] 从 token 中获取 `current_user`
- [ ] 调用 service 层查询/初始化数据
- [ ] 返回 `ResponseModel(code=200, message="success", data=GameInterviewDataResponse(...))`

### 3.5 验收测试

- [ ] 新用户首次调用返回默认空关卡（6 个关卡 progress=0）
- [ ] 有数据时返回完整的游戏化数据
- [ ] 排行榜包含当前用户且标记 `is_current_user: true`
- [ ] 无 Token 调用返回 401
- [ ] stats 聚合数据与 levels 实际数据一致

---

## 通用要求

- [x] 所有接口统一使用 `ResponseModel[T]` 响应格式
- [x] 所有接口需要 `OAuth2PasswordBearer` 认证
- [x] 数据库迁移：3 个接口共需创建 5 张新表，生成 Alembic migration 并执行
- [x] 错误处理：未捕获异常不应直接返回 500，需返回明确错误信息
- [x] 更新 OpenAPI 文档：重新生成 `docs/api/openapi.json`
- [x] 完成后更新 `docs/api/tasks/user.md` 中的 Task 5 降级清单状态

---

## 后续跟进事项

- [ ] `interview-history` 有数据时验证返回分页对象结构 `{ items, total, page, page_size }`
- [ ] `ability-data` 有数据时验证返回按岗位分组的对象结构
- [ ] `game-interview-data` 补充 `levels` / `achievements` / `leaderboard` 字段以匹配前端 `GameInterviewDataResponse` 类型
- [ ] 数据写入后端点端到端验证（创建面试记录/能力数据/游戏数据后查询）
