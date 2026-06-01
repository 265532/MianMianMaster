# 开发规约文档 - 模块交接

> 最后更新: 2026-05-30

## 已完成的核心功能清单

1. **[ai-development-specification.md](docs/ai-development-specification.md)**: 项目原始开发规约（第一版）
2. **[ai-development-specification-universal.md](docs/ai-development-specification-universal.md)**: 从原始规约抽离的通用版规约，去除项目特定内容，可复用于其他 Python/FastAPI 项目
3. **[ai-vibecoding-specification.md](docs/ai-vibecoding-specification.md)**: **新增** — 基于通用规约框架，针对当前 Vue 3 前端项目量身定制的 AI VibeCoding 专属规约，共 20 章，每章包含实际代码正例/反例/AI 提示词模板

## 修改文件清单

| 操作 | 文件路径 |
|------|---------|
| 新增 | `docs/ai-development-specification-universal.md` |
| 新增 | `docs/ai-vibecoding-specification.md` |
| 新增 | `docs/specs/handover.md` |

## 关键技术决策说明

1. **项目实际是 Vue 3 前端而非 Python 后端**: 原始 `ai-development-specification.md` 描述的是 FastAPI + SQLAlchemy 后端技术栈，但 `src/` 目录下的实际代码是 Vue 3 + Vite + TypeScript 的前端项目。新生成的 `ai-vibecoding-specification.md` 以后端规约框架为基础，全面映射到前端实际技术栈。
2. **实际代码优先原则**: 规约中的所有正例均摘录自 `src/` 下的真实代码，确保文档与代码一致。
3. **20 章全覆盖**: 从架构约束、技术栈、Store 规范、样式规范到性能规约、CI/CD 门禁，覆盖所有 VibeCoding 场景。

## 未完成的 Todo 事项

- [ ] 原始 `ai-development-specification.md` 中的 Python 后端部分可能与实际项目不匹配，需确认是否存在独立的后端仓库
- [ ] `ai-vibecoding-specification.md` 可能需要补充 API 层（如 `src/api/` 或 `src/services/`）的规范（当前项目尚未建立 API 请求封装层）
- [ ] CSS 中 `style.css` 存在重复的 `--background-gradient-yellow-orange` 定义（第 24-26 行），需要修复
- [ ] 组件导入路径混用相对路径和 `@/` 别名，需要在规约中明确统一策略

## 下一步开发建议

1. **API 请求层封装**: 建议在 `src/api/` 或 `src/services/` 下建立统一的 HTTP 客户端封装（如基于 `fetch` 或 `axios` 的 request 实例），并在规约中补充对应章节
2. **类型定义目录**: 建议建立 `src/types/` 用于存放跨模块共享的 TypeScript 接口定义
3. **Mock 数据规范**: 当前 `mockjs` 已引入但未见具体 mock 数据文件，建议建立 `src/mock/` 目录统一管理
4. **测试框架搭建**: 项目当前无测试配置，建议引入 `vitest` 并编写核心 Store 的单元测试