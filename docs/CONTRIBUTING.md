# 贡献指南

欢迎您为面面俱到项目贡献代码和建议！我们非常感谢您的参与和支持。本指南将帮助您了解如何有效地为项目做出贡献。

## 贡献方式

您可以通过以下方式为项目做出贡献：

1. **报告bug**：发现并报告项目中的问题
2. **提出功能建议**：为项目提出新功能或改进建议
3. **提交代码**：直接贡献代码修复bug或实现新功能
4. **改进文档**：完善项目文档，包括README、API文档等
5. **参与社区**：回答其他用户的问题，分享使用经验

## 开发环境设置

### 1. 克隆代码库

```bash
git clone https://github.com/yourusername/ai-interview-manager.git
cd ai-interview-manager
```

### 2. 安装依赖

```bash
npm install
```

### 3. 运行开发服务器

```bash
npm run dev
```

### 4. 构建项目

```bash
npm run build
```

## 代码规范

为了保持代码的一致性和可维护性，我们遵循以下代码规范：

### 1. 代码风格

- 使用TypeScript进行类型检查
- 遵循ESLint和Prettier的代码风格规则
- 使用4空格缩进
- 每行代码长度不超过100个字符
- 使用单引号而非双引号
- 箭头函数使用简写形式

### 2. 命名规范

- 变量和函数：使用驼峰命名法（camelCase）
- 组件和类：使用帕斯卡命名法（PascalCase）
- 常量：使用全大写加下划线（UPPER_CASE_WITH_UNDERSCORES）
- 私有属性和方法：使用下划线前缀（_privateMethod）

### 3. 注释规范

- 为公共API和复杂逻辑添加JSDoc注释
- 为关键业务逻辑添加行内注释
- 注释应该清晰、简洁，解释"为什么"而不是"是什么"

## 提交代码流程

### 1. 创建分支

在开始工作前，创建一个新的分支：

```bash
git checkout -b feature/your-feature-name
# 或
git checkout -b fix/your-bug-fix
```

### 2. 编写代码

- 实现功能或修复bug
- 确保代码符合项目的代码规范
- 添加必要的测试
- 更新相关文档

### 3. 运行测试

在提交代码前，确保所有测试都通过：

```bash
# 运行单元测试
npm test

# 运行类型检查
npm run typecheck

# 运行代码风格检查
npm run lint
```

### 4. 提交代码

使用规范的提交信息格式：

```bash
git add .
git commit -m "feat: 描述你的功能"
# 或
git commit -m "fix: 描述你的修复"
```

提交信息格式：
- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码风格调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建或依赖更新

### 5. 推送分支

```bash
git push origin feature/your-feature-name
```

### 6. 创建Pull Request

1. 访问GitHub仓库
2. 点击"Pull requests"标签
3. 点击"New pull request"按钮
4. 选择您的分支和目标分支
5. 填写PR标题和描述，包括：
   - 变更的目的
   - 实现的方法
   - 测试结果
   - 相关issue（如果有）
6. 点击"Create pull request"按钮

## 代码审查

提交PR后，项目维护者会进行代码审查。在审查过程中：

- 请及时回应审查意见
- 对代码进行必要的修改
- 确保所有测试都通过
- 保持PR的专注性，一个PR只解决一个问题

## 发布流程

项目维护者负责版本发布，发布流程如下：

1. 合并所有待发布的PR
2. 更新版本号（遵循语义化版本规范）
3. 更新CHANGELOG.md
4. 构建项目
5. 创建发布标签
6. 发布到相应平台

## 行为准则

我们希望所有贡献者都能遵守以下行为准则：

- 尊重他人，保持友善和专业的态度
- 接受建设性批评
- 关注问题本身，不进行人身攻击
- 包容不同的观点和经验
- 共同维护一个积极、包容的社区环境

## 联系方式

如果您有任何问题或需要帮助，可以通过以下方式联系项目维护者：

- GitHub Issues: [https://github.com/yourusername/ai-interview-manager/issues](https://github.com/yourusername/ai-interview-manager/issues)
- 邮箱: maintainers@ai-interview-manager.com

## 感谢

感谢您为面面俱到项目做出的贡献！您的参与对项目的发展至关重要。我们期待与您一起构建更好的面试平台，帮助更多人实现职业梦想。