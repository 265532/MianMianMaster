---
alwaysApply: false
description: AI 协作与交接规范。包含模块交接文档的生成要求、踩坑记录同步更新机制、项目踩坑记录索引表，以及调试文档生成器的使用说明。
---
# 06 — AI 协作与交接规范

> 适用范围：AI 助手完成任意业务模块开发/重构/Debug 后的知识管理工作流程。

---

## 1. AI 记忆与交接规约

- **强制 Must**: 每次完成特定业务模块的开发、重构或复杂 Debug 后，AI 助手**必须**在 `docs/` 目录下的对应模块子目录中（如 `docs/auth/handover.md`）生成或更新**模块交接文档**。
- **强制 Must**: 交接文档内容必须包含：当前已实现的核心功能清单、修改文件清单、未完成的 Todo 事项、关键技术决策说明、踩坑记录与经验教训、以及下一步开发的建议上下文，以便在下一次开启全新对话时，新的 AI 助手能快速恢复上下文。
- **强制 Must**: 发现新的踩坑模式时，**必须**同步更新对应模块规约文档中的相关条目。

**正例**: 在完成登录模块重构后，主动更新 `docs/auth/handover.md`，记录 JWT 过期时间的配置位置和当前的 RBAC 进度。
**反例**: 完成了大量修改后直接结束对话，导致下一次对话中 AI 助手丢失对刚完成工作的上下文感知。

---

## 2. 调试文档生成

> 参见 [调试文档生成器规则](./debug-documentation-generator.md)

- 调试完成后应将关键发现、解决方案、踩坑记录整理为结构化 Markdown 文档，保存至 `docs/debug/` 目录。
- 文件命名格式：`YYYY-MM-DD-问题简述.md`（如 `2025-07-15-nginx-502-bad-gateway.md`）。
- 文档必须包含：问题现象 → 根因分析 → 修复步骤 → 验证方法 → 后续预防措施 → 相关代码片段。

---

## 踩坑记录索引

| 日期 | 问题 | 相关规约 | Debug 文档 |
|------|------|----------|-----------|
| 2026-05-10 | Store 重构后模板遗留旧变量名导致渲染崩溃 | [02 §2](./02-pinia-store.md) | [frontend-render-errors-and-warnings.md](/docs/debug/2026-05-10-frontend-render-errors-and-warnings.md) |
| 2026-05-10 | 构建通过但运行时崩溃（Vue SFC 模板编译限制） | [05 §1](./05-build-and-quality.md) | 同上 |
| 2026-05-10 | ECharts + v-if 导致 cartesian2d 错误 | [03 §7](./03-vue-component.md) | 同上 |
| 2026-05-10 | ECharts 重复初始化警告（未先 dispose） | [03 §7](./03-vue-component.md) | 同上 |
| 2026-05-10 | Router-view Component 为 null 导致级联错误 | [03 §6](./03-vue-component.md) | 同上 |
| 2026-05-10 | LoginForm 缺少 autocomplete 属性 | [03 §8](./03-vue-component.md) | 同上 |
| 2026-05-10 | Store 数据为 null 时模板直接访问属性报错 | [02 §3](./02-pinia-store.md) | 同上 |
| 2026-05-10 | 类型导入路径错误（UserResponse 从 auth.types 导入） | [04 §2](./04-api-and-mock.md) | [handover.md](/docs/frontend-api/handover.md) |
| 2026-05-10 | tsconfig 缺少 paths 配置导致 @/ 导入类型检查失败 | [05 §1](./05-build-and-quality.md) | [handover.md](/docs/frontend-api/handover.md) |
| 2026-05-31 | axios-mock-adapter 无法拦截 fetch/SSE 流式请求 | [04 §4-5](./04-api-and-mock.md) | [handover.md](/docs/api/handover.md) |
| 2026-05-31 | 盲目修改 API 路径/字段名而不核对后端文档 | [04 §6](./04-api-and-mock.md) | [handover.md](/docs/api/handover.md) |

---

## 相关文档

- [01 — 核心架构与基础规范](./01-core-architecture.md)
- [05 — 构建与质量管理规范](./05-build-and-quality.md)
- [调试文档生成器规则](./debug-documentation-generator.md)