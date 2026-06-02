# Mock 数据填充后端数据库 — 总体进度

> **项目**: MianMianMaster Mock 数据 → 后端种子数据迁移  
> **开始日期**: 2026-06-01  
> **总模块数**: 9  
> **总数据记录**: ~120 条

---

## 模块进度总览

| 序号 | 模块 | 优先级 | 任务文档 | 状态 | 开始日期 | 完成日期 | 负责人 |
|------|------|--------|----------|------|----------|----------|--------|
| 1 | Auth（认证） | P0 | [auth.md](./auth.md) | ⬜ 未开始 | — | — | — |
| 2 | User（用户） | P0 | [user.md](./user.md) | ⬜ 未开始 | — | — | — |
| 3 | Job（岗位） | P0 | [job.md](./job.md) | ⬜ 未开始 | — | — | — |
| 4 | Assessment（测评） | P1 | [assessment.md](./assessment.md) | ⬜ 未开始 | — | — | — |
| 5 | Interview（面试） | P1 | [interview.md](./interview.md) | ⬜ 未开始 | — | — | — |
| 6 | Learning（学习） | P1 | [learning.md](./learning.md) | ⬜ 未开始 | — | — | — |
| 7 | Notification（通知） | P1 | [notification.md](./notification.md) | ⬜ 未开始 | — | — | — |
| 8 | Community（社区） | P2 | [community.md](./community.md) | ⬜ 未开始 | — | — | — |
| 9 | System（系统） | P3 | [system.md](./system.md) | ⬜ 未开始 | — | — | — |

**进度**: 0/9 模块完成

---

## Phase 进度

### Phase 1 — P0 核心基建（Auth + User + Job）

- [ ] Auth 模块完成
- [ ] User 模块完成
- [ ] Job 模块完成

### Phase 2 — P1 主业务流程（Assessment + Interview + Learning + Notification）

- [ ] Assessment 模块完成
- [ ] Interview 模块完成
- [ ] Learning 模块完成
- [ ] Notification 模块完成

### Phase 3 — P2 增值功能（Community）

- [ ] Community 模块完成

### Phase 4 — P3 管理后台（System）

- [ ] System 模块完成

---

## 任务统计

| 模块 | 子任务数 | 数据表数 | 数据记录数 |
|------|----------|----------|-----------|
| Auth | ~15 | 3 | 3 |
| User | ~25 | 6+ | ~20 |
| Job | ~14 | 3+ | 5 + 1 + 5 = 11 |
| Assessment | ~14 | 3+ | 3 + 3 = 6 |
| Interview | ~32 | 6+ | 3 + 1 + 5 + 1 + 5 + 5 = 20 |
| Learning | ~24 | 5+ | 4 + 3 + 5 + 5 + 3 = 20 |
| Community | ~28 | 4+ | 7 + 4 + 4 + 4 = 19 |
| Notification | ~15 | 3+ | 5 + 1 = 6 |
| System | ~11 | 3+ | 3 + 2 = 5 |
| **合计** | **~178** | **~36** | **~120** |

---

## 需后端确认的差异接口

以下接口在前端 Mock 中存在但后端 API 清单中无对应实现，需要确认处理方案：

| # | 模块 | 接口 | 建议 | 确认结果 |
|---|------|------|------|----------|
| 1 | User | `GET /user/interview-history` | 合并到 Interview 模块 | — |
| 2 | User | `GET /user/ability-data` | 由 Assessment 计算 | — |
| 3 | User | `GET /user/game-interview-data` | 合并到 Interview 模块 | — |
| 4 | User | `GET /user/resume` | 新增简历模块 | — |
| 5 | User | `POST /user/resume/diagnose` | 新增简历模块 | — |
| 6 | Interview | `GET /interview/game/levels` | 面试配置的一部分 | — |
| 7 | Interview | `GET /interview/game/stats` | 由现有数据计算 | — |
| 8 | Interview | `GET /interview/game/achievements` | 合并到 Learning 徽章 | — |
| 9 | Interview | `GET /interview/game/leaderboard` | 新增排行榜模块 | — |
| 10 | Community | `GET /community/hot-topics` | 后端算法计算 | — |
| 11 | Community | `GET /community/active-users` | 后端统计得出 | — |
| 12 | Notification | `GET /notifications/preferences` | 合并到 User 模块 | — |
| 13 | Notification | `PUT /notifications/preferences` | 合并到 User 模块 | — |
| 14 | Notification | `POST /notifications/device-token` | 新增推送模块 | — |
| 15 | System | `GET /system/health` | 新增运维接口 | — |
| 16 | System | `GET /system/announcements` | 新增公告模块 | — |

---

## 关键决策记录

| 日期 | 决策 | 影响 | 决策人 |
|------|------|------|--------|
| — | 测试密码统一使用 `password123` | Auth 模块 | — |
| — | 排行榜需要额外创建 3 个测试用户（张三/李四/王五/赵六） | Interview 模块 | — |
| — | SSE 对话数据不入库，由 LLM 实时生成 | Interview 模块 | — |
| — | 游戏化数据（关卡/成就/排行榜）是否独立建表 | Interview 模块 | — |

---

## 状态图例

| 图标 | 含义 |
|------|------|
| ⬜ 未开始 | 尚未开始 |
| 🔄 进行中 | 正在实施 |
| ✅ 已完成 | 所有子任务完成 |
| ⚠️ 阻塞 | 被外部依赖阻塞 |
| ❌ 已取消 | 不再需要 |