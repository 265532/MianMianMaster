---
alwaysApply: true
---
# MianMianMaster Frontend - 内部文档导航

欢迎来到 MianMianMaster 前端项目的内部文档库。这里的文档主要用于团队协作、规范对齐以及为 AI 辅助编程提供上下文。

## 核心规约

> **最高准则**：当代码与任何外部认知发生冲突时，请以以下规约和 `src/` 目录下的实际代码为准。

- 📜 **[前端开发规约（主索引）](./frontend-development-specification.md)**
  规约体系的主入口，包含核心架构约束精要与完整的子文档导航。

### 子规约文档

| 编号 | 文档 | 说明 |
|------|------|------|
| 01 | [核心架构与基础规范](./01-core-architecture.md) | 分层架构、技术栈版本、包管理、目录结构、代码风格、导入路径、环境变量、冲突策略 |
| 02 | [Pinia Store 开发规范](./02-pinia-store.md) | Store 结构顺序、重构检查清单、模板空值防护 |
| 03 | [Vue 组件开发规范](./03-vue-component.md) | Props/Emits、样式色板、图标库、动画过渡、路由、ECharts 防御、表单 autocomplete |
| 04 | [API 与 Mock 开发规范](./04-api-and-mock.md) | Mock 架构、API 类型定义、JWT 认证、SSE 流式响应、Mock 层级分工、后端对齐 |
| 05 | [构建与质量管理规范](./05-build-and-quality.md) | 构建验证、日志策略、性能优化、测试、Git 规范、CodeReview 门禁 |
| 06 | [AI 协作与交接规范](./06-ai-handover.md) | 模块交接文档、踩坑记录索引、调试文档生成 |

### 其他工作流规约

- 🤖 **[Agent Coding 行为规约](./agent-specification.md)**
  遇到不明确的地方必须主动提问，绝不猜测用户意图。

- 🐛 **[调试文档生成器](./debug-documentation-generator.md)**
  将调试过程中的关键发现、解决方案、踩坑记录整理为结构化 Markdown 技术文档。

## 模块交接文档 (Handovers)

为保证业务开发的连续性，每次完成特定模块开发后需生成的上下文交接文档：

- 🔌 **[前端API联调交接](/docs/frontend-api/handover.md)**

## 经验与排坑记录 (Knowledge Base)

记录开发过程中遇到的关键问题及解决方案：

- 🐛 **[前端渲染报错与警告修复](/docs/debug/2026-05-10-frontend-render-errors-and-warnings.md)**

---

*注：IDE 的 AI 提示词配置文件存放在项目根目录的 `.trae/rules/` 文件夹中，由开发工具自动读取。*