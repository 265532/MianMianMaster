# 前后端联调总体进度

> **最后更新**: 2026-06-02  
> **总模块数**: 11  
> **总子任务数**: ~180  
> **对接策略**: 按优先级顺序（P0 → P1 → P2 → P3），每阶段完成后在浏览器逐页验证

---

## 模块进度总览

| # | 模块 | 优先级 | 端点数 | 任务文件 | 状态 |
|---|------|--------|--------|----------|------|
| 1 | Auth（认证） | P0 | 10 | [auth.md](./auth.md) | [~] 代码对齐完成，浏览器验证待做 |
| 2 | User（用户） | P0 | 4 | [user.md](./user.md) | [ ] 待开始 |
| 3 | Job & Skill（岗位） | P0 | 4 | [job.md](./job.md) | [ ] 待开始 |
| 4 | Assessment（测评） | P1 | 2 | [assessment.md](./assessment.md) | [ ] 待开始 |
| 5 | Learning（学习） | P1 | 14 | [learning.md](./learning.md) | [ ] 待开始 |
| 6 | Interview（面试） | P1 | 8 | [interview.md](./interview.md) | [ ] 待开始 |
| 7 | Notification（通知） | P1 | 4 | [notification.md](./notification.md) | [ ] 待开始 |
| 8 | Community（社区） | P2 | 9 | [community.md](./community.md) | [ ] 待开始 |
| 9 | Business（业务配置） | P3 | 9 | [business.md](./business.md) | [ ] 待开始 |
| 10 | Role（权限管理） | P3 | 5 | [role.md](./role.md) | [ ] 待开始 |
| 11 | System（系统管理） | P3 | 3 | [system.md](./system.md) | [ ] 待开始 |

---

## 阶段划分

### Phase 1: P0 核心基建（3 模块 / 18 端点）

- [ ] **Auth（认证）** — [auth.md](./auth.md)
  > 10 端点，8 个 Task，~40 个子项  
  > 是所有其他模块的前置依赖

- [ ] **User（用户）** — [user.md](./user.md)
  > 4 端点，6 个 Task，~25 个子项  
  > 含 5 个超范围端点的降级处理

- [ ] **Job & Skill（岗位）** — [job.md](./job.md)
  > 4 端点，5 个 Task，~15 个子项  
  > 依赖 Auth + User

**Phase 1 验收标准**: 可完成注册、登录、查看岗位列表、技能树渲染、岗位匹配度

---

### Phase 2: P1 主业务流程（4 模块 / 28 端点）

- [ ] **Assessment（测评）** — [assessment.md](./assessment.md)
  > 2 端点，5 个 Task，~15 个子项  
  > 含 LLM 异步判卷

- [ ] **Learning（学习）** — [learning.md](./learning.md)
  > 14 端点，8 个 Task，~30 个子项  
  > 含课程/进度/收藏/错题/徽章

- [ ] **Interview（面试）** — [interview.md](./interview.md)
  > 8 端点，8 个 Task，~35 个子项  
  > 含 SSE 流式对话、状态机、异步报告

- [ ] **Notification（通知）** — [notification.md](./notification.md)
  > 4 端点，7 个 Task，~20 个子项  
  > 含 30s 轮询 + 已读状态

**Phase 2 验收标准**: 完整业务流程闭环（测评 → 学习 → 面试 → 通知）

---

### Phase 3: P2 增值功能（1 模块 / 9 端点）

- [ ] **Community（社区）** — [community.md](./community.md)
  > 9 端点，7 个 Task，~25 个子项  
  > 含 AI 点评、楼中楼评论

**Phase 3 验收标准**: 社区互动完整（发帖/评论/点赞/关注/AI点评）

---

### Phase 4: P3 管理后台（3 模块 / 17 端点）

- [ ] **Business（业务配置）** — [business.md](./business.md)
  > 9 端点，5 个 Task，~15 个子项  
  > 需补充 Mock handler

- [ ] **Role（权限管理）** — [role.md](./role.md)
  > 5 端点，6 个 Task，~15 个子项  
  > 需补充 Mock handler + 路由权限

- [ ] **System（系统管理）** — [system.md](./system.md)
  > 3 端点，6 个 Task，~15 个子项

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
| 前端有超范围端点（user×5, interview×5, notification×3, community×2, system×2） | User, Interview, Notification, Community, System | 联调时降级处理，静默返回空数据 |
| Business / Role 模块缺少 Mock handler | Business, Role | Phase 4 前补充 Mock 数据 |
| Job 模块无独立 Store | Job | 评估是否需新建 `jobStore` |
| SSE 流式对话为技术难点 | Interview | 优先用 Swagger 验证后端 SSE 端点 |
| Celery/LLM 可能未就绪 | Assessment, Interview, Community | 异步任务部分可暂不验证，仅验证同步端点 |
| SMS 服务可能未配置 | Auth | 短信登录部分可暂不验证 |

---

## 变更记录

| 日期 | 变更 | 作者 |
|------|------|------|
| 2026-06-02 | 初始化所有模块任务清单和总体进度 | AI |