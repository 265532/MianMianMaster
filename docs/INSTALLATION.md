# 安装部署指南

## 环境要求

在开始安装之前，请确保您的系统满足以下要求：

| 依赖 | 版本要求 | 用途 |
|------|---------|------|
| Node.js | 16.0.0 或更高 | 运行时环境 |
| npm | 7.0.0 或更高 | 包管理工具 |
| Git | 2.0.0 或更高 | 版本控制 |

## 安装步骤

### 1. 克隆项目代码

```bash
git clone https://github.com/yourusername/ai-interview-manager.git
cd ai-interview-manager
```

### 2. 安装依赖

使用 pnpm（推荐）：

```bash
pnpm install
```

### 3. 配置环境变量

根据您的部署环境，可能需要配置以下环境变量：

| 环境变量 | 描述 | 默认值 |
|---------|------|--------|
| VITE_API_BASE_URL | API 基础路径 | http://localhost:3000 |
| VITE_APP_TITLE | 应用标题 | 面面俱到 |
| VITE_APP_VERSION | 应用版本 | 1.0.0 |

### 4. 开发环境运行

启动开发服务器：

```bash
npm run dev
```

开发服务器启动后，您可以通过浏览器访问 `http://localhost:5173` 查看应用。

### 5. 构建生产版本

构建用于生产环境的应用：

```bash
npm run build
```

构建完成后，生成的文件将位于 `dist` 目录中。

## 部署方法

### 1. 静态网站部署

您可以将构建后的 `dist` 目录部署到任何静态网站托管服务，如：

- GitHub Pages
- Vercel
- Netlify
- AWS S3 + CloudFront

### 2. 容器化部署

#### Docker 部署

1. 创建 `Dockerfile`：

```dockerfile
FROM node:16-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

2. 构建镜像：

```bash
docker build -t ai-interview-manager .
```

3. 运行容器：

```bash
docker run -d -p 8080:80 ai-interview-manager
```

### 3. 服务器部署

1. 将构建后的 `dist` 目录上传到服务器
2. 配置 Nginx 或 Apache 作为静态文件服务器

#### Nginx 配置示例

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    root /path/to/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 常见问题

### 1. 安装依赖失败

如果遇到依赖安装失败的问题，可以尝试以下解决方案：

- 清除 npm 缓存：`npm cache clean --force`
- 使用较新版本的 Node.js
- 检查网络连接

### 2. 开发服务器启动失败

- 检查端口是否被占用
- 确保依赖已正确安装
- 查看终端输出的错误信息

### 3. 构建失败

- 检查 TypeScript 类型错误
- 确保所有依赖都已正确安装
- 查看构建日志获取详细错误信息

## 升级指南

当项目有新版本发布时，您可以按照以下步骤进行升级：

1. 拉取最新代码：

```bash
git pull origin main
```

2. 安装新依赖：

```bash
npm install
```

3. 重新构建：

```bash
npm run build
```

4. 部署更新后的版本

## 技术支持

如果您在安装部署过程中遇到任何问题，请参考以下资源：

- [Vue.js 官方文档](https://vuejs.org/)
- [Vite 官方文档](https://vitejs.dev/)
- [Tailwind CSS 文档](https://tailwindcss.com/)

或者联系项目维护者获取帮助。