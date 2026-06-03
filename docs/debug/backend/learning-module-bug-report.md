# 学习模块 Bug 调试报告

**日期**: 2026-06-03  
**排查接口**: 
- `GET /api/v1/learning/collections` (收藏列表)
- `GET /api/v1/learning/wrong-questions` (错题本)

---

## 一、问题概述

用户反馈学习模块的收藏列表和错题本两个接口在运行时抛出未捕获的异常。

## 二、排查过程

### 2.1 数据库表结构验证 ✅

**结论**: 数据库表结构完整，与 ORM 模型定义一致。

| 表名 | 状态 | 外键指向 |
|------|------|----------|
| `user_question_collections` | ✅ 存在 | `questions.id`, `users.id` |
| `user_wrong_questions` | ✅ 存在 | `questions.id`, `users.id` |
| `questions` | ✅ 存在 | `assessments.id`, `knowledge_graphs.id` |

Alembic 迁移版本: `37f0b8c56d5c` (已正确应用)

### 2.2 ORM 查询逻辑验证 ✅

**结论**: Service 层查询逻辑正确，无语法错误。

```python
# src/services/learning_service.py

def get_collections(self, db: Session, user_id: int, skip: int = 0, limit: int = 10):
    return db.query(UserQuestionCollection).filter(
        UserQuestionCollection.user_id == user_id
    ).offset(skip).limit(limit).all()

def get_wrong_questions(self, db: Session, user_id: int, skip: int = 0, limit: int = 10):
    return db.query(UserWrongQuestion).filter(
        UserWrongQuestion.user_id == user_id
    ).offset(skip).limit(limit).all()
```

使用 TestClient 测试结果:
- `GET /api/v1/learning/collections` → 200 OK, `{"code": 200, "message": "success", "data": []}`
- `GET /api/v1/learning/wrong-questions` → 200 OK, `{"code": 200, "message": "success", "data": []}`

### 2.3 认证中间件验证 ✅

**结论**: 认证流程正确（修复后），依赖注入链完整。

依赖注入链: `oauth2_scheme` → `get_current_user` → `get_current_active_user`

---

## 三、发现的问题

### 问题 1: `slowapi` 依赖缺失 ❌ [已修复]

**严重程度**: 🔴 致命 (阻塞应用启动)

**现象**: 
```
ModuleNotFoundError: No module named 'slowapi'
```

**原因**: `requirements.txt` 中声明了 `slowapi==0.1.8`，但未安装到当前环境。

**影响**: 应用无法启动，**所有接口均不可用**，不仅是学习模块。

**修复**: 
```bash
pip install slowapi
```

---

### 问题 2: Redis 连接初始化缺陷 ❌ [已修复]

**严重程度**: 🔴 致命 (导致所有认证接口 500 错误)

**原始代码** (`src/db/redis_client.py`):
```python
# 启动时立即创建连接，Redis 不可用时 get_redis() 调用会抛异常
redis_client = redis.Redis(
    host=settings.REDIS_HOST,
    port=settings.REDIS_PORT,
    db=settings.REDIS_DB,
    decode_responses=True
)

def get_redis():
    return redis_client
```

**问题链路**:
1. `GET /api/v1/learning/collections` 需要认证
2. → `get_current_user()` → `is_token_blacklisted(jti)` 
3. → `get_redis()` → `redis_client.exists(key)` 
4. → Redis 不可用时抛出 `redis.ConnectionError`
5. → 异常未在 `security.py` 中被捕获，向上传播
6. → FastAPI 全局异常处理器返回 500

**修复** (已在 `src/db/redis_client.py` 中应用):

```python
# 懒加载 Redis 连接
_redis_client = None

def _create_redis_client():
    return redis.Redis(
        host=settings.REDIS_HOST,
        port=settings.REDIS_PORT,
        db=settings.REDIS_DB,
        decode_responses=True,
        socket_connect_timeout=5
    )

def get_redis():
    global _redis_client
    if _redis_client is None:
        _redis_client = _create_redis_client()
    return _redis_client
```

---

### 问题 3: `security.py` 中 Redis 操作未做容错 ❌ [已修复]

**严重程度**: 🟠 高 (Redis 不可用时认证链路中断)

**原始代码** (`src/core/security.py`):
```python
def is_token_blacklisted(jti: str) -> bool:
    redis_client = get_redis()          # ← 这里可能抛异常
    redis_key = f"token:blacklist:{jti}"
    return redis_client.exists(redis_key) > 0
```

**问题**: `get_current_user()` 每次认证都会调用 `is_token_blacklisted()`，若 Redis 不可用则抛出未捕获异常。

**修复**: 为所有 Redis 操作添加 try-except 容错:

| 函数 | 修复策略 |
|------|----------|
| `is_token_blacklisted()` | Redis 不可用时返回 `False` (假定未拉黑) |
| `is_refresh_token_valid()` | Redis 不可用时返回 `True` (允许刷新) |
| `is_reset_token_used()` | Redis 不可用时返回 `False` (假定未使用) |

---

### 问题 4: `deps.py` 中权限缓存 Redis 操作位置不当 ❌ [已修复]

**严重程度**: 🟡 中 (影响使用 `check_permissions` 的接口)

**原始代码** (`src/api/deps.py`):
```python
def _get_user_permissions(db: Session, user: User) -> List[str]:
    redis_client = get_redis()          # ← 在 try 外面，直接抛异常
    cache_key = f"user:perms:{user.id}"
    perms = None
    try:
        cached_perms = redis_client.get(cache_key)
        ...
```

**修复**: 将 `get_redis()` 调用移入 try-except 块内。

---

## 四、数据完整性检查

| 检查项 | 结果 |
|--------|------|
| `questions` 表数据 | 0 条 (空表) |
| `user_question_collections` 表数据 | 0 条 (空表) |
| `user_wrong_questions` 表数据 | 0 条 (空表) |
| FK 约束 `user_question_collections.question_id → questions.id` | ✅ 正确 |
| FK 约束 `user_wrong_questions.question_id → questions.id` | ✅ 正确 |
| 数据库列 `answer_count` nullable | ⚠️ `True` (模型默认值 `1`) |
| 数据库列 `is_mastered` nullable | ⚠️ `True` (模型默认值 `False`) |

> **注意**: `answer_count` 和 `is_mastered` 在数据库中允许 NULL，但 Pydantic Schema 中定义为非可选类型 (`int` / `bool`)。
> 若通过直接 SQL 或旧迁移插入的数据中这两列为 NULL，序列化时会报 Pydantic 验证错误。
> 当前因表中无数据，此问题未触发。

---

## 五、根因分析总结

```
学习模块 GET 接口 500 错误
    │
    ├── [根因 1] slowapi 未安装 → 应用无法启动 → 所有接口不可用
    │
    └── [根因 2] Redis 连接异常 → 认证中间件抛出未捕获异常
            │
            ├── is_token_blacklisted() 无 try-except
            ├── get_redis() 在 deps.py 中未容错
            └── redis_client 启动时创建连接（非懒加载）
```

**核心结论**: Bug 不在学习模块本身的查询逻辑中，而是**基础设施层**（Redis 连接管理 + 缺失依赖）导致的全局性故障。

---

## 六、已应用的修复

| 文件 | 修复内容 |
|------|----------|
| `src/db/redis_client.py` | 改为懒加载 Redis 连接，添加 `socket_connect_timeout=5` |
| `src/core/security.py` | 为 `is_token_blacklisted`、`is_refresh_token_valid`、`is_reset_token_used` 添加 try-except |
| `src/api/deps.py` | 将 `_get_user_permissions` 中的 `get_redis()` 调用移入 try 块 |
| 环境 | 安装 `slowapi` 依赖 |

---

## 七、验证建议

1. **启动验证**: `python -c "from src.main import app; print('OK')"`
2. **接口验证**: 使用有效 Token 调用 `GET /api/v1/learning/collections` 和 `GET /api/v1/learning/wrong-questions`
3. **Redis 容错验证**: 停止 Redis 服务后重复步骤 2，确认接口返回空数据而非 500 错误
4. **数据写入验证**: 先通过 `POST /api/v1/assessments/questions` 创建题目，再测试收藏/错题本的写入接口

---

## 八、集成验证结果（2026-06-03）

**验证环境**: 后端 `localhost:8081`，测试用户 `testuser`（id=22）

| 接口 | 状态码 | 响应 | 数据结构 | 结果 |
|------|--------|------|----------|------|
| `GET /learning/collections` | 200 | `{ code: 200, data: [] }` | `Collection[]` ✅ | ✅ 通过 |
| `GET /learning/wrong-questions` | 200 | `{ code: 200, data: [] }` | `WrongQuestion[]` ✅ | ✅ 通过 |

**结论**: 两个接口已从 500 恢复为正常 200 响应，数据结构与前端类型匹配。4 个根因问题（slowapi 缺失、Redis 连接、security.py 容错、deps.py 缓存）均已修复。当前表中无数据所以返回空列表，符合预期。
