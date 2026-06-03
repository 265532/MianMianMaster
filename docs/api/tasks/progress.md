# 前后端联调总体进度

> **最后更新**: 2026-06-03  
> **总模块数**: 11  
> **总端点数**: ~80  
> **对接策略**: 按优先级顺序（P0 → P1 → P2 → P3），每阶段完成后在浏览器逐页验证

---

## 模块进度总览

| # | 模块 | 优先级 | 端点数 | OpenAPI Schema | 任务文件 | 状态 |
|---|------|--------|--------|----------------|----------|------|
| 1 | Auth（认证） | P0 | 10 | [auth.openapi.json](../schemas/auth.openapi.json) | [auth.md](./auth.md) | [x] 已完成 |
| 2 | User（用户） | P0 | 9 | [user.openapi.json](../schemas/user.openapi.json) | [user.md](./user.md) | [x] Schema 完成 |
| 3 | Job & Skill（岗位） | P0 | 4 | [job.openapi.json](../schemas/job.openapi.json) | [job.md](./job.md) | [x] Schema 完成 |
| 4 | Assessment（测评） | P1 | 3 | [assessment.openapi.json](../schemas/assessment.openapi.json) | [assessment.md](./assessment.md) | [x] Schema 完成 |
| 5 | Learning（学习） | P1 | 14 | [learning.openapi.json](../schemas/learning.openapi.json) | [learning.md](./learning.md) | [x] Schema 完成 |
| 6 | Interview（面试） | P1 | 13 | [interview.openapi.json](../schemas/interview.openapi.json) | [interview.md](./interview.md) | [x] Schema 完成 |
| 7 | Notification（通知） | P1 | 7 | [notification.openapi.json](../schemas/notification.openapi.json) | [notification.md](./notification.md) | [x] Schema 完成 |
| 8 | Community（社区） | P2 | 12 | [community.openapi.json](../schemas/community.openapi.json) | [community.md](./community.md) | [x] Schema 完成 |
| 9 | Business（业务配置） | P3 | 9 | [business.openapi.json](../schemas/business.openapi.json) | [business.md](./business.md) | [x] Schema 完成 |
| 10 | Role（权限管理） | P3 | 5 | [role.openapi.json](../schemas/role.openapi.json) | [role.md](./role.md) | [x] Schema 完成 |
| 11 | System（系统管理） | P3 | 5 | [system.openapi.json](../schemas/system.openapi.json) | [system.md](./system.md) | [x] Schema 完成 |

---

## 接口契约定义完成

**所有 11 个模块的 OpenAPI/JSON Schema 已全部定义完成**，共计约 80 个端点，以前端 UI 需求为准。

### 各模块端点清单

#### P0 核心基建

- **Auth（认证）** — 10 端点
  - `POST /auth/login` — 账号密码登录
  - `POST /auth/register` — 注册
  - `GET /auth/me` — 获取当前用户
  - `POST /auth/refresh` — 刷新 Token
  - `POST /auth/logout` — 登出
  - `POST /auth/unlock/{username}` — 解锁用户
  - `POST /auth/sms/send` — 发送短信验证码
  - `POST /auth/sms/login` — 短信登录
  - `POST /auth/password/reset-token` — 生成密码重置令牌
  - `POST /auth/password/reset` — 重置密码

- **User（用户）** — 9 端点
  - `GET /user/profile` — 获取用户画像
  - `PUT /user/profile` — 更新用户画像
  - `POST /user/security/change-password` — 修改密码
  - `POST /user/security/change-phone` — 修改手机号
  - `GET /user/interview-history` — 模拟面试历史（分页）
  - `GET /user/ability-data` — 能力评估数据（雷达图）
  - `GET /user/game-interview-data` — 游戏化面试数据
  - `GET /user/resume` — 简历数据
  - `POST /user/resume/diagnose` — AI 简历诊断

- **Job & Skill（岗位）** — 4 端点
  - `POST /jobs` — 创建岗位
  - `GET /jobs` — 岗位列表（分页）
  - `GET /jobs/{job_id}/skill-tree` — 技能树
  - `GET /jobs/{job_id}/match` — 岗位匹配度

#### P1 主业务流程

- **Assessment（测评）** — 3 端点
  - `GET /assessments` — 测评列表
  - `POST /assessments` — 创建测评
  - `GET /assessments/{assessment_id}/result` — 测评结果

- **Learning（学习）** — 14 端点
  - `POST /learning/courses` — 创建课程
  - `GET /learning/courses` — 课程列表（含 type=practice 题库）
  - `POST /learning/materials` — 添加资料
  - `POST /learning/progress/update` — 更新进度
  - `GET /learning/progress/{course_id}` — 获取进度
  - `POST /learning/collections` — 添加收藏
  - `GET /learning/collections` — 收藏列表（分页）
  - `POST /learning/wrong-questions` — 记录错题
  - `GET /learning/wrong-questions` — 错题列表（分页）
  - `POST /learning/wrong-questions/{question_id}/master` — 标记已掌握
  - `POST /learning/badges` — 创建徽章
  - `GET /learning/badges` — 徽章列表
  - `POST /learning/badges/award/{badge_id}` — 授予徽章
  - `GET /learning/my-badges` — 我的徽章

- **Interview（面试）** — 13 端点
  - `POST /interview/sessions` — 创建面试会话
  - `GET /interview/sessions` — 会话列表（分页，支持 status 筛选）
  - `GET /interview/sessions/{session_id}` — 会话详情
  - `POST /interview/sessions/{session_id}/start` — 开始面试
  - `POST /interview/sessions/{session_id}/chat` — SSE 流式对话
  - `POST /interview/sessions/{session_id}/end` — 结束面试
  - `POST /interview/sessions/{session_id}/cancel` — 取消面试
  - `GET /interview/sessions/{session_id}/report` — 面试报告
  - `GET /interview/questions` — 题库（支持 category/difficulty/type 筛选）
  - `GET /interview/game/levels` — 游戏化关卡
  - `GET /interview/game/stats` — 游戏化统计
  - `GET /interview/game/achievements` — 游戏化成就
  - `GET /interview/game/leaderboard` — 排行榜

- **Notification（通知）** — 7 端点
  - `GET /notifications` — 通知列表（分页）
  - `GET /notifications/unread-count` — 未读计数
  - `PUT /notifications/{notification_id}/read` — 标记已读
  - `PUT /notifications/read-all` — 全部已读
  - `GET /notifications/preferences` — 通知偏好
  - `PUT /notifications/preferences` — 更新偏好
  - `POST /notifications/device-token` — 注册设备推送令牌

#### P2 增值功能

- **Community（社区）** — 12 端点
  - `GET /community/posts` — 帖子列表（分页）
  - `POST /community/posts` — 发帖
  - `GET /community/posts/{post_id}` — 帖子详情
  - `POST /community/posts/{post_id}/like` — 点赞
  - `DELETE /community/posts/{post_id}/like` — 取消点赞
  - `POST /community/posts/{post_id}/comment` — 评论
  - `GET /community/posts/{post_id}/comments` — 评论列表
  - `GET /community/hot-topics` — 热门话题
  - `GET /community/active-users` — 活跃用户
  - `POST /community/follow/{user_id}` — 关注用户
  - `DELETE /community/follow/{user_id}` — 取消关注
  - `GET /community/following` — 关注列表

#### P3 管理后台

- **Business（业务配置）** — 9 端点
  - `GET /business/config` — 业务配置列表
  - `POST /business/config` — 创建配置
  - `PUT /business/config/{config_id}` — 更新配置
  - `DELETE /business/config/{config_id}` — 删除配置
  - 及其它业务配置端点

- **Role（权限管理）** — 5 端点
  - `GET /roles` — 角色列表
  - `POST /roles` — 创建角色
  - `POST /roles/{role_id}/permissions` — 角色分配权限
  - `POST /users/{user_id}/roles` — 用户分配角色
  - `GET /permissions` — 权限列表

- **System（系统管理）** — 5 端点
  - `GET /system/config` — 系统配置列表
  - `POST /system/config` — 创建系统配置
  - `GET /system/health` — 健康检查
  - `GET /system/announcements` — 公告列表
  - `GET /system/audit-log` — 审计日志（分页）

---

## 阶段划分

### Phase 1: P0 核心基建（3 模块 / 23 端点）

- [x] **Auth（认证）** — [auth.md](./auth.md)
  > 10 端点，8 个 Task，~40 个子项  
  > 是所有其他模块的前置依赖
  > ✅ 已完成：端点对齐、类型对齐、登录/登出/错误处理、浏览器 E2E 验证通过

- [x] **User（用户）** — [user.md](./user.md)
  > 9 端点，6 个 Task，~25 个子项  
  > ✅ Schema 完成：包含 interview-history、ability-data、game-interview-data、resume、resume/diagnose

- [x] **Job & Skill（岗位）** — [job.md](./job.md)
  > 4 端点，5 个 Task，~15 个子项  
  > ✅ Schema 完成：包含 create/list job-positions、skill-tree、match

**Phase 1 验收标准**: 可完成注册、登录、查看岗位列表、技能树渲染、岗位匹配度

---

### Phase 2: P1 主业务流程（4 模块 / 37 端点）

- [x] **Assessment（测评）** — [assessment.md](./assessment.md)
  > 3 端点，5 个 Task，~15 个子项  
  > ✅ Schema 完成：包含 list/create assessments、get result

- [x] **Learning（学习）** — [learning.md](./learning.md)
  > 14 端点，8 个 Task，~30 个子项  
  > ✅ Schema 完成：包含 courses（含 type=practice 题库）、materials、progress、collections、wrong-questions、badges

- [x] **Interview（面试）** — [interview.md](./interview.md)
  > 13 端点，8 个 Task，~35 个子项  
  > ✅ Schema 完成：包含 sessions CRUD、SSE 流式对话、report、questions、game/levels/stats/achievements/leaderboard

- [x] **Notification（通知）** — [notification.md](./notification.md)
  > 7 端点，7 个 Task，~20 个子项  
  > ✅ Schema 完成：包含 list、unread-count、read、preferences、device-token

**Phase 2 验收标准**: 完整业务流程闭环（测评 → 学习 → 面试 → 通知）

---

### Phase 3: P2 增值功能（1 模块 / 12 端点）

- [x] **Community（社区）** — [community.md](./community.md)
  > 12 端点，7 个 Task，~25 个子项  
  > ✅ Schema 完成：包含 posts CRUD、like、comment、hot-topics、active-users、follow

**Phase 3 验收标准**: 社区互动完整（发帖/评论/点赞/关注/AI点评）

---

### Phase 4: P3 管理后台（3 模块 / 19 端点）

- [x] **Business（业务配置）** — [business.md](./business.md)
  > 9 端点，5 个 Task，~15 个子项  
  > ✅ Schema 完成

- [x] **Role（权限管理）** — [role.md](./role.md)
  > 5 端点，6 个 Task，~15 个子项  
  > ✅ Schema 完成：包含 roles CRUD、权限分配、用户角色分配

- [x] **System（系统管理）** — [system.md](./system.md)
  > 5 端点，6 个 Task，~15 个子项  
  > ✅ Schema 完成：包含 config、health、announcements、audit-log

**Phase 4 验收标准**: 管理员可管理角色/权限/业务配置/审计日志

---

## 全局验证清单

每个 Phase 完成后，必须执行：

- [ ] **类型检查**: `vue-tsc --noEmit` 通过
- [ ] **构建验证**: `vite build` 通过
- [ ] **浏览器逐页验证**: 
  - [ ] 登录页 → [ ] 首页 → [ ] 社区页 → [ ] 个人中心页 → [ ] 能力提升页 → [ ] 知识库页 → [ ] 面试页
- [ ] **Mock 开关切换**: 验证 `VITE_USE_MOCK=false` + `VITE_PROXY_TARGET` 指向真实后端时所有页面正常

---

## 已知风险

| 风险 | 影响模块 | 对策 |
|------|---------|------|
| Auth 已完成，User 模块为下一个 P0 阻塞项 | User | 立即开始 User 联调 |
| Business / Role 模块缺少 Mock handler | Business, Role | Phase 4 前补充 Mock 数据 |
| Job 模块无独立 Store | Job | 评估是否需新建 `jobStore` |
| SSE 流式对话为技术难点 | Interview | 优先用 Swagger 验证后端 SSE 端点 |
| Celery/LLM 可能未就绪 | Assessment, Interview, Community | 异步任务部分可暂不验证，仅验证同步端点 |
| SMS 服务可能未配置 | Auth | 短信登录部分可暂不验证 |

---

## 变更记录

| 日期 | 变更 | 作者 |
|------|------|------|
| 2026-06-03 | Auth 模块联调完成（端点对齐、浏览器 E2E 验证通过）；Phase 1 标记 Auth 完成，标记 User 为下一步 | AI |
| 2026-06-02 | 初始化所有模块任务清单和总体进度 | AI |