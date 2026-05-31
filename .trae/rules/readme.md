---
alwaysApply: true
---
# MianMianMaster Frontend - 内部文档导航

欢迎来到 MianMianMaster 前端项目的内部文档库。这里的文档主要用于团队协作、规范对齐以及为 AI 辅助编程提供上下文。

## 核心规约

> **最高准则**：当代码与任何外部认知发生冲突时，请以以下规约和 `src/` 目录下的实际代码为准。

- 📜 **[前端开发规约](./frontend-development-specification.md)**
  前端项目的架构约束、技术栈选型（Vue 3 + TypeScript + Pinia）、代码风格、Store 重构规范、组件开发规范等核心规则的统一集合。

## 模块交接文档 (Handovers)

为保证业务开发的连续性，每次完成特定模块开发后需生成的上下文交接文档：

- 🔌 **[前端API联调交接](/docs/frontend-api/handover.md)**

## 经验与排坑记录 (Knowledge Base)

记录开发过程中遇到的关键问题及解决方案：

- 🐛 **[前端渲染报错与警告修复](/docs/debug/2026-05-10-frontend-render-errors-and-warnings.md)**

---

*注：IDE 的 AI 提示词配置文件存放在项目根目录的 `.trae/rules/` 文件夹中，由开发工具自动读取。*
