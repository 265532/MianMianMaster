# 前端对接接口清单

> **文档用途**: 供前端开发团队对接后端 API 参考  
> **生成日期**: 2026-05-31  
> **适用后端版本**: MianMianMaster Backend (Phase 4 完成版)  
> **基础路径**: `http://<host>:<port>/api/v1`

---

## 阅读指南

### 优先级定义

| 优先级 | 含义 | 建议对接时机 |
|--------|------|-------------|
| **P0** | 核心阻塞 | 必须最先对接，其他功能依赖它 |
| **P1** | 重要功能 | 主业务流程必备，P0 完成后立即对接 |
| **P2** | 增值功能 | 提升用户体验，可在主链路完成后对接 |
| **P3** | 管理后台 | 主要面向管理员/教研人员 |

### 通用约定

- **认证方式**: JWT Bearer Token (`Authorization: Bearer <token>`)
- **响应格式**: 统一包装为 `{"code": 200, "message": "success", "data": ...}`
- **业务错误**: HTTP 状态码始终为 200，错误码在 JSON body 的 `code` 字段中
- **分页参数**: 列表接口默认支持 `skip`/`offset` + `limit` 分页
- **限流提示**: 部分接口（登录、面试对话）有速率限制，超限返回 429

---

## 一、用户认证模块 (Auth)

> **前缀**: `/api/v1/auth`  
> **优先级**: **P0** — 所有功能的前置依赖

| # | 方法 | 路径 | 说明 | 认证 | 限流 |
|---|------|------|------|------|------|
| 1 | POST | `/auth/register` | 用户注册（用户名+密码） | 否 | 3/分钟 |
| 2 | POST | `/auth/login` | 账号密码登录 | 否 | 5/分钟 |
| 3 | POST | `/auth/sms/send` | 发送短信验证码 | 否 | 1/分钟 |
| 4 | POST | `/auth/sms/login` | 短信验证码登录/注册 | 否 | - |
| 5 | GET | `/auth/me` | 获取当前登录用户信息 | 是 | - |
| 6 | POST | `/auth/refresh` | 刷新 Access Token | 否 | - |
| 7 | POST | `/auth/logout` | 登出（吊销 Token） | 是 | - |
| 8 | POST | `/auth/password/reset-token` | 请求密码重置 Token | 否 | 3/分钟 |
| 9 | POST | `/auth/password/reset` | 重置密码 | 否 | 5/分钟 |
| 10 | POST | `/auth/unlock/{username}` | 管理员解锁被锁定用户 | 是(管理员) | - |

### 前端对接要点

- **双 Token 机制**: `access_token`（短期）+ `refresh_token`（长期）
- **Token 刷新**: access_token 过期前调用 `/auth/refresh` 换取新 token
- **登录锁定**: 连续失败 5 次后锁定 15 分钟，前端需友好提示剩余时间
- **Swagger 登录**: 开发调试可用 `/auth/swagger-login`（表单登录，仅 Swagger UI 使用）

---

## 二、用户中心模块 (User)

> **前缀**: `/api/v1/user`  
> **优先级**: **P0** — 个人中心核心功能

| # | 方法 | 路径 | 说明 | 认证 |
|---|------|------|------|------|
| 1 | GET | `/user/profile` | 获取用户画像（含自动初始化） | 是 |
| 2 | PUT | `/user/profile` | 更新用户画像（支持部分更新） | 是 |
| 3 | POST | `/user/security/change-password` | 修改密码（需验证旧密码） | 是 |
| 4 | POST | `/user/security/change-phone` | 修改手机号（需短信验证） | 是 |

### 前端对接要点

- **自动初始化**: 首次获取画像时若不存在，后端自动创建空记录，前端无需特殊处理
- **部分更新**: `PUT /profile` 使用 `exclude_unset=True`，只传需要修改的字段即可
- **头像字段**: `avatar_url` 当前为字符串 URL，后续将接入 OSS 上传

---

## 三、消息通知模块 (Notification)

> **前缀**: `/api/v1/notifications`  
> **优先级**: **P1** — 提升用户体验

| # | 方法 | 路径 | 说明 | 认证 |
|---|------|------|------|------|
| 1 | GET | `/notifications` | 获取消息列表（分页） | 是 |
| 2 | GET | `/notifications/unread-count` | 获取未读消息总数（红点用） | 是 |
| 3 | PUT | `/notifications/{id}/read` | 单条标记已读 | 是 |
| 4 | PUT | `/notifications/read-all` | 一键全部已读 | 是 |

### 前端对接要点

- **轮询策略**: 当前无 WebSocket 推送，建议前端轮询 `/unread-count`（如每 30 秒）
- **红点提示**: 未读数 > 0 时展示红点，点击进入消息中心后调用 `/read-all`

---

## 四、岗位与知识图谱模块 (Job & Skill Tree)

> **前缀**: `/api/v1/jobs`  
> **优先级**: **P0** — 测评和面试的前置基础数据

| # | 方法 | 路径 | 说明 | 认证 |
|---|------|------|------|------|
| 1 | POST | `/jobs` | 创建岗位（管理后台） | 否 |
| 2 | GET | `/jobs` | 获取岗位列表（分页） | 否 |
| 3 | GET | `/jobs/{job_id}/skill-tree` | 获取岗位高亮技能树 | 否 |
| 4 | GET | `/jobs/{job_id}/match` | 计算当前用户与该岗位的匹配度 | 是 |

### 前端对接要点

- **技能树渲染**: `/skill-tree` 返回带 `is_required` 和 `has_required_child` 标记的树形结构，前端可直接渲染高亮节点
- **匹配度**: `/match` 返回 0-100 的浮点数，表示用户技能掌握度与岗位要求的匹配程度
- **岗位选择**: 用户注册/完善画像时需选择目标岗位，后续测评和面试均围绕该岗位展开

---

## 五、测评系统模块 (Assessment)

> **前缀**: `/api/v1/assessments`  
> **优先级**: **P1** — 核心业务闭环起点

| # | 方法 | 路径 | 说明 | 认证 |
|---|------|------|------|------|
| 1 | POST | `/assessments` | 创建测评试卷（含题目，管理后台） | 否 |
| 2 | POST | `/assessments/submit` | 提交答卷 | 是 |

### 前端对接要点

- **题目类型**: 支持 `single_choice` / `multiple_choice` / `text`（简答）
- **自动判卷**: 客观题后端自动判卷；`text` 类型题目由 LLM 异步判卷，失败时回退为 0 分
- **技能掌握度**: 提交后后端自动更新 `user_skill_mastery` 表，影响岗位匹配度
- **异步接口**: `submit` 为 `async` 接口，可能需要稍长等待时间（LLM 判卷）

---

## 六、学习系统模块 (Learning)

> **前缀**: `/api/v1/learning`  
> **优先级**: **P1** — 用户成长路径核心

### 6.1 课程与资料

| # | 方法 | 路径 | 说明 | 认证 |
|---|------|------|------|------|
| 1 | POST | `/learning/courses` | 创建课程（管理后台） | 否 |
| 2 | GET | `/learning/courses` | 获取课程列表（分页） | 否 |
| 3 | POST | `/learning/materials` | 为课程添加资料（管理后台） | 否 |
| 4 | POST | `/learning/progress/update` | 更新学习进度 | 是 |
| 5 | GET | `/learning/progress/{course_id}` | 获取某课程的学习进度详情 | 是 |

### 6.2 题库练习（收藏/错题）

| # | 方法 | 路径 | 说明 | 认证 |
|---|------|------|------|------|
| 6 | POST | `/learning/collections` | 收藏题目 | 是 |
| 7 | GET | `/learning/collections` | 获取收藏列表（分页） | 是 |
| 8 | POST | `/learning/wrong-questions` | 记录错题 | 是 |
| 9 | GET | `/learning/wrong-questions` | 获取错题列表（分页） | 是 |
| 10 | POST | `/learning/wrong-questions/{question_id}/master` | 标记错题已掌握 | 是 |

### 6.3 徽章系统

| # | 方法 | 路径 | 说明 | 认证 |
|---|------|------|------|------|
| 11 | POST | `/learning/badges` | 创建徽章定义（管理后台） | 否 |
| 12 | GET | `/learning/badges` | 获取徽章列表 | 否 |
| 13 | POST | `/learning/badges/award/{badge_id}` | 为用户颁发徽章 | 是 |
| 14 | GET | `/learning/my-badges` | 获取当前用户的徽章 | 是 |

### 前端对接要点

- **进度更新**: 用户看完资料/视频后调用 `/progress/update`，进度 100% 时后端自动颁发 `course_completed` 徽章
- **错题本**: 测评提交后前端可引导用户将错题加入错题本，后续针对性复习
- **徽章触发**: 除课程完成外，测评得分 > 80 分也会自动触发 `score_reached` 徽章

---

## 七、社区互动模块 (Community)

> **前缀**: `/api/v1/community`  
> **优先级**: **P2** — 社交增值功能

| # | 方法 | 路径 | 说明 | 认证 |
|---|------|------|------|------|
| 1 | POST | `/community/posts` | 创建帖子 | 是 |
| 2 | GET | `/community/posts/feed` | 获取社区信息流（分页+搜索） | 否 |
| 3 | GET | `/community/posts/{post_id}` | 获取帖子详情 | 否 |
| 4 | PUT | `/community/posts/{post_id}` | 编辑帖子 | 是 |
| 5 | DELETE | `/community/posts/{post_id}` | 删除帖子 | 是 |
| 6 | POST | `/community/posts/{post_id}/comments` | 发表评论（支持楼中楼） | 是 |
| 7 | POST | `/community/posts/{post_id}/like` | 点赞/取消点赞 | 是 |
| 8 | POST | `/community/users/{user_id}/follow` | 关注/取消关注用户 | 是 |
| 9 | POST | `/community/posts/{post_id}/ai-review` | 触发 AI 点评帖子 | 是 |

### 前端对接要点

- **帖子分类**: 支持 `interview_review`（面试复盘）/ `real_questions`（真题分享）/ `experience`（经验分享）
- **AI 点评**: 创建帖子后自动触发 Celery 异步点评，结果写入 `ai_review_content`，前端可轮询详情获取
- **楼中楼**: 评论通过 `parent_id` 实现回复，前端需支持嵌套展示
- **信息流**: `/feed` 支持 `keyword` 搜索，目前按创建时间倒序，后续将加入热榜算法

---

## 八、AI 面试模块 (Interview)

> **前缀**: `/api/v1/interview`  
> **优先级**: **P1** — 产品核心卖点

| # | 方法 | 路径 | 说明 | 认证 | 限流 |
|---|------|------|------|------|------|
| 1 | POST | `/interview/sessions` | 创建面试会话 | 是 | - |
| 2 | GET | `/interview/sessions/{session_id}` | 获取会话详情 | 是 | - |
| 3 | GET | `/interview/sessions` | 获取会话列表（分页+状态筛选） | 是 | - |
| 4 | POST | `/interview/sessions/{session_id}/start` | 开始面试（生成开场白） | 是 | 5/分钟 |
| 5 | POST | `/interview/sessions/{session_id}/chat` | 流式对话（SSE） | 是 | 5/分钟 |
| 6 | POST | `/interview/sessions/{session_id}/end` | 结束面试 | 是 | - |
| 7 | POST | `/interview/sessions/{session_id}/cancel` | 取消面试 | 是 | - |
| 8 | GET | `/interview/sessions/{session_id}/report` | 获取面试报告 | 是 | - |

### 前端对接要点

- **SSE 流式对话**: `/chat` 返回 `text/event-stream`，前端必须使用 `EventSource` 接收，事件类型包括：
  - `token` — LLM 逐字输出
  - `done` — 输出完成
  - `error` — 发生错误
  - `round_limit` — 达到轮次上限
- **面试状态机**: `scheduled` → `in_progress` → `completed`/`cancelled`，非法状态转换会报错
- **自动超时**: 会话超过 `INTERVIEW_TIMEOUT_MINUTES`（默认配置）后自动结束
- **报告生成**: 面试结束后 Celery 异步生成报告，前端需轮询 `/report` 获取结果（状态：`pending` → `generating` → `completed`/`failed`）
- **轮次控制**: 每次对话后 `current_round` 递增，达到 `max_rounds` 后无法继续对话

---

## 九、业务配置模块 (Business)

> **前缀**: `/api/v1/business`  
> **优先级**: **P3** — 管理后台专用

| # | 方法 | 路径 | 说明 | 认证(权限) |
|---|------|------|------|-----------|
| 1 | GET | `/business/knowledge-graph` | 获取知识图谱列表 | 是(`knowledge_graph:read`) |
| 2 | POST | `/business/knowledge-graph` | 创建知识图谱节点 | 是(`knowledge_graph:create`) |
| 3 | GET | `/business/ai-strategy` | 获取 AI 策略列表 | 是(`ai_strategy:read`) |
| 4 | POST | `/business/ai-strategy` | 创建 AI 策略 | 是(`ai_strategy:create`) |
| 5 | GET | `/business/interview-config` | 获取面试配置列表 | 是(`interview_config:read`) |
| 6 | POST | `/business/interview-config` | 创建面试配置 | 是(`interview_config:create`) |
| 7 | GET | `/business/interview-session` | 获取面试会话列表 | 是(`interview_session:read`) |
| 8 | POST | `/business/interview-session` | 创建面试会话 | 是(`interview_session:create`) |
| 9 | GET | `/business/agent-state` | 获取 Agent 状态列表 | 是(`agent_state:read`) |

### 前端对接要点

- **RBAC 权限**: 所有接口需要管理员角色权限，前端需在路由层面做权限控制
- **知识图谱层级**: 创建节点时通过 `parent_id` 指定父节点，形成树形结构
- **AI 策略**: 用于定义不同面试官性格（压力/温和/引导）和类型的 System Prompt

---

## 十、权限管理模块 (Role)

> **前缀**: `/api/v1`  
> **优先级**: **P3** — 管理后台专用

| # | 方法 | 路径 | 说明 | 认证(权限) |
|---|------|------|------|-----------|
| 1 | GET | `/roles` | 获取角色列表 | 是(`role:read`) |
| 2 | POST | `/roles` | 创建角色 | 是(`role:create`) |
| 3 | POST | `/roles/{role_id}/permissions` | 为角色分配权限 | 是(`role:update`) |
| 4 | POST | `/users/{user_id}/roles` | 为用户分配角色 | 是(`user:update`) |
| 5 | GET | `/permissions` | 获取权限列表 | 是(`role:read`) |

---

## 十一、系统管理模块 (System)

> **前缀**: `/api/v1/system`  
> **优先级**: **P3** — 管理后台专用

| # | 方法 | 路径 | 说明 | 认证(权限) |
|---|------|------|------|-----------|
| 1 | GET | `/system/config` | 获取系统配置列表 | 是(`config:read`) |
| 2 | POST | `/system/config` | 创建系统配置 | 是(`config:create`) |
| 3 | GET | `/system/audit-log` | 获取审计日志 | 是(`audit_log:read`) |

---

## 附录

### A. 接口总数统计

| 模块 | 接口数 | P0 | P1 | P2 | P3 |
|------|--------|----|----|----|----|
| Auth | 10 | 10 | 0 | 0 | 0 |
| User | 4 | 4 | 0 | 0 | 0 |
| Notification | 4 | 0 | 4 | 0 | 0 |
| Job & Skill | 4 | 4 | 0 | 0 | 0 |
| Assessment | 2 | 0 | 2 | 0 | 0 |
| Learning | 14 | 0 | 14 | 0 | 0 |
| Community | 9 | 0 | 0 | 9 | 0 |
| Interview | 8 | 0 | 8 | 0 | 0 |
| Business | 9 | 0 | 0 | 0 | 9 |
| Role | 5 | 0 | 0 | 0 | 5 |
| System | 3 | 0 | 0 | 0 | 3 |
| **合计** | **73** | **18** | **28** | **9** | **17** |

### B. 推荐对接顺序

```
Week 1: P0 核心基建
  ├─ Auth (注册/登录/Token刷新/登出)
  ├─ User (画像获取/更新)
  └─ Job & Skill (岗位列表/技能树)

Week 2: P1 主业务流程
  ├─ Assessment (测评列表/提交答卷)
  ├─ Learning (课程/进度/收藏/错题)
  ├─ Interview (创建会话/开始/流式对话/结束/报告)
  └─ Notification (消息列表/未读数)

Week 3: P2 增值功能
  └─ Community (帖子/评论/点赞/关注/AI点评)

Week 4: P3 管理后台
  └─ Business / Role / System (按需对接)
```

### C. 环境配置检查清单

前后端联调前，请确认以下服务已就绪：

- [ ] PostgreSQL 数据库运行正常，且已执行 `alembic upgrade head`
- [ ] Redis 运行正常（用于缓存、Token 黑名单、Celery）
- [ ] Celery Worker 已启动（面试报告、AI 点评依赖异步任务）
- [ ] `.env` 中 `LLM_PROVIDER` 和对应 API Key 已配置
- [ ] 后端服务已启动，Swagger UI (`/docs`) 可正常访问
