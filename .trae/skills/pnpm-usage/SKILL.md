---
name: "pnpm-usage"
description: "Provides comprehensive guide on using pnpm as Node package manager, including installation, commands, and best practices. Invoke when user needs help with pnpm setup or usage."
---

# pnpm 使用指南

## 什么是 pnpm

pnpm 是一个快速、节省空间的 Node.js 包管理器，使用硬链接和符号链接来高效存储和共享依赖，显著减少磁盘空间使用和安装时间。

## 安装 pnpm

### 全局安装

```bash
# 使用 npm
npm install -g pnpm

# 使用 npx
npx pnpm add -g pnpm

# 使用 Homebrew (macOS)
brew install pnpm

# 使用 Chocolatey (Windows)
choco install pnpm

# 使用 Scoop (Windows)
scoop install pnpm
```

### 检查安装

```bash
pnpm --version
```

## 基本命令

### 初始化项目

```bash
# 创建新的 package.json
pnpm init

# 使用模板
pnpm create vite@latest my-project
```

### 安装依赖

```bash
# 安装所有依赖
pnpm install

# 安装单个包
pnpm add <package>

# 安装开发依赖
pnpm add -D <package>

# 安装全局包
pnpm add -g <package>

# 安装特定版本
pnpm add <package>@<version>
```

### 卸载依赖

```bash
# 卸载包
pnpm remove <package>

# 卸载全局包
pnpm remove -g <package>
```

### 更新依赖

```bash
# 更新所有依赖
pnpm update

# 更新单个包
pnpm update <package>

# 检查过时的依赖
pnpm outdated
```

### 运行脚本

```bash
# 运行 package.json 中的脚本
pnpm run <script>

# 运行开发服务器
pnpm dev

# 构建项目
pnpm build

# 运行测试
pnpm test
```

### 其他常用命令

```bash
# 列出已安装的包
pnpm list

# 查看包信息
pnpm view <package>

# 清理缓存
pnpm store prune

# 检查依赖树
pnpm ls
```

## 高级特性

### 工作区 (Workspaces)

在 monorepo 项目中管理多个包：

1. 在根目录创建 `pnpm-workspace.yaml` 文件：

```yaml
packages:
  - 'packages/*'
  - 'apps/*'
```

2. 安装所有工作区依赖：

```bash
pnpm install
```

3. 在特定工作区安装依赖：

```bash
pnpm add <package> --filter <workspace>
```

4. 在工作区之间链接依赖：

```bash
pnpm link --global
pnpm link <package> --filter <workspace>
```

### 配置文件

pnpm 使用 `.npmrc` 文件进行配置：

```ini
# 设置存储路径
store-dir=~/.pnpm-store

# 设置注册表
registry=https://registry.npmmirror.com

# 启用严格 peer 依赖检查
strict-peer-dependencies=true

# 配置自动安装 peer 依赖
auto-install-peers=true
```

### 缓存管理

```bash
# 查看缓存大小
pnpm store status

# 清理缓存
pnpm store prune

# 清理特定包的缓存
pnpm store remove <package>
```

## 与 npm/yarn 的比较

| 特性 | pnpm | npm | yarn |
|------|------|-----|------|
| 安装速度 | 极快 | 中等 | 快 |
| 磁盘空间 | 节省 | 占用大 | 中等 |
| 依赖解析 | 严格 | 宽松 | 严格 |
| 工作区支持 | 原生 | 支持 | 支持 |
| 缓存机制 | 高效 | 基础 | 基础 |

## 最佳实践

1. **使用工作区**：对于多包项目，使用 pnpm 工作区管理依赖
2. **配置注册表**：使用国内镜像加速安装
3. **锁定版本**：使用 `pnpm-lock.yaml` 确保依赖版本一致
4. **清理缓存**：定期运行 `pnpm store prune` 清理缓存
5. **检查依赖**：使用 `pnpm audit` 检查安全漏洞
6. **使用 pnpm dlx**：临时运行包而不安装

## 常见问题

### 权限问题

```bash
# 修复权限
pnpm setup
```

### 依赖冲突

```bash
# 检查依赖树
pnpm ls

# 解决 peer 依赖问题
pnpm add --save-peer <package>
```

### 安装失败

```bash
# 清理缓存后重试
pnpm store prune
pnpm install
```

## 相关工具

- **pnpm dlx**：临时运行包
- **pnpm exec**：在项目上下文中执行命令
- **pnpm import**：从其他包管理器导入锁文件
- **pnpm patch**：修改已安装的包

## 总结

pnpm 是一个现代化的 Node.js 包管理器，通过其高效的存储机制和快速的安装速度，为开发人员提供了更好的依赖管理体验。无论是单个项目还是 monorepo，pnpm 都能显著提升开发效率。