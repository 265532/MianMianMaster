# MianMianMaster 前端API联调实施计划

**版本**: v1.1\
**创建日期**: 2026-05-09\
**最后更新**: 2026-05-10\
**状态**: Phase 1-4 已完成，Phase 5 待实施\
**预计工期**: 10-12个工作日（已完成 Day 1-8）

***

## 📋 目录

1. [项目背景与目标](#1-项目背景与目标)
2. [现状分析](#2-现状分析)
3. [架构设计方案](#3-架构设计方案)
4. [目录结构规划](#4-目录结构规划)
5. [HTTP请求基础设施实现](#5-http请求基础设施实现)
6. [认证系统对接方案](#6-认证系统对接方案)
7. [Mock数据软编码架构](#7-mock数据软编码架构)
8. [分阶段实施计划](#8-分阶段实施计划)
9. [代码示例与最佳实践](#9-代码示例与最佳实践)
10. [迁移指南](#10-迁移指南)
11. [测试策略](#11-测试策略)
12. [风险与缓解措施](#12-风险与缓解措施)

***

## 1. 项目背景与目标

### 1.1 业务背景

MianMianMaster 是一个AI模拟面试与能力提升平台，前端基于 Vue 3 + TypeScript + Pinia 技术栈，后端采用 FastAPI + SQLAlchemy 架构。当前前后端已分别开发完成，需要进行接口联调以实现完整的数据交互。

### 1.2 核心问题

| 问题类别           | 具体问题                    | 影响范围                | 优先级         |
| -------------- | ----------------------- | ------------------- | ----------- |
| **HTTP基础设施缺失** | 无axios封装、无API服务层、无拦截器   | 全局                  | 🔴 Critical |
| **认证系统未对接**    | 前端使用布尔标志，后端使用JWT Token  | 所有需登录接口             | 🔴 Critical |
| **数据硬编码**      | Store和Views中使用Mock硬编码数据 | Profile, Community等 | 🔴 Critical |

### 1.3 实施目标

#### 主要目标

1. ✅ 建立完整的HTTP请求基础设施（axios封装 + 拦截器 + 统一错误处理）
2. ✅ 对接JWT Token认证系统（登录/注册/Token管理）
3. ✅ 实现Mock数据软编码架构（支持Mock/真实API无缝切换）
4. ✅ 重构现有Store层（从硬编码迁移到API调用）

#### 设计原则

- **业内最佳实践**: 参考Ant Design Pro、Vue Element Admin等成熟方案
- **渐进式迁移**: 不破坏现有功能，平滑过渡
- **类型安全**: 全面的TypeScript类型定义
- **可维护性**: 清晰的代码结构和注释
- **可扩展性**: 易于添加新模块和新API

***

## 2. 现状分析

### 2.1 当前技术栈

```json
{
  "框架": "Vue 3.5.25",
  "语言": "TypeScript 5.9.3",
  "构建工具": "Vite 7.3.1",
  "状态管理": "Pinia 3.0.4",
  "路由": "Vue Router 4.6.4",
  "UI组件": "自定义组件 + Lucide Icons",
  "图表": "ECharts 6.0.0 + Chart.js 4.5.1",
  "Mock库": "MockJS 1.1.0 (已安装但未使用)",
  "CSS框架": "TailwindCSS 4.2.1"
}
```

### 2.2 现有代码结构

```
src/
├── assets/              # 静态资源
├── components/          # 公共组件
│   ├── HelloWorld.vue
│   └── LoginForm.vue
├── router/
│   └── index.ts         # 路由配置（含守卫）
├── stores/
│   ├── user.ts          # 用户状态（Mock登录）
│   └── interview.ts     # 面试状态（纯本地管理）
├── utils/
│   └── assessment.ts    # 测评工具函数（较完整）
├── views/               # 页面组件（15个页面）
│   ├── Home.vue
│   ├── Profile.vue      # ⚠️ 大量硬编码数据
│   ├── Community.vue    # ⚠️ 大量硬编码数据
│   └── ...
├── App.vue
├── main.ts
└── style.css
```

### 2.3 关键问题详解

#### 问题1: stores/user.ts - Mock登录实现

**当前代码**:

```typescript
function login(email: string, _password: string) {
  loading.value = true
  
  // ❌ 模拟登录请求 - 无真实API调用
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      user.value = {
        id: '1',
        name: '王同学',
        email: email,
        avatar: '',
        isAuthenticated: true,  // ❌ 使用布尔标志而非Token
        role: 'user',
        skills: ['前端开发', 'React', 'Vue']
      }
      loading.value = false
      resolve()
    }, 1000)
  })
}
```

**问题点**:

- 无HTTP请求
- 数据硬编码
- 无法获取JWT Token
- 无法持久化登录状态

#### 问题2: views/Profile.vue - 硬编码业务数据

**当前数据量统计**:

- 面试记录: 12条（第199-416行）
- 收藏题库: 3个（第504-551行）
- 错题本: 5道（第554-615行）
- 游戏式面试关卡: 6个（第752-874行）
- 成就徽章: 5个（第826-866行）
- 排行榜: 5人（第867-873行）

**示例代码**:

```typescript
// ❌ 第199行开始 - 硬编码面试记录
const interviewHistory = [
  { 
    id: 1, 
    date: '2026-03-15', 
    company: '字节跳动',
    position: '前端开发工程师',
    // ... 更多硬编码数据
  },
  // ... 共12条记录
]
```

**问题点**:

- 无法从后端动态加载
- 无法分页
- 无法筛选/排序（实际是前端过滤）
- 无法增删改

#### 问题3: views/Community.vue - 硬编码社区数据

**当前数据量统计**:

- 社区帖子: 7篇（第23-31行）
- 评论数据: 2组（第34-43行）
- 热门话题: 4个（第47-51行）
- 课程列表: 4门（第107-112行）
- 活跃用户: 4人（Community.vue中引用）

**问题点**:

- 无真实帖子流
- 无互动功能（点赞/评论仅本地状态）
- 无法发布新帖子

### 2.4 后端API就绪情况

根据审查报告，后端已提供：

- ✅ 50+个RESTful API端点
- ✅ Swagger文档 (`http://localhost:8081/docs`)
- ✅ JWT认证机制
- ✅ 统一响应格式 `ResponseModel<T>`
- ✅ CORS全开放配置
- ✅ 限流机制（SlowAPI + Redis）

***

## 3. 架构设计方案

### 3.1 整体架构图

```
┌─────────────────────────────────────────────────────────┐
│                    Vue Components                         │
│  (views/*.vue, components/*.vue)                        │
└─────────────┬───────────────────┬───────────────────────┘
              │                   │
              ▼                   ▼
┌─────────────────────┐ ┌─────────────────────┐
│   Pinia Stores      │ │   Composables       │
│  (stores/*.ts)      │ │  (hooks/*.ts)       │
│                     │ │                     │
│  • user.ts          │ │  • useAuth.ts       │
│  • community.ts     │ │  • usePagination.ts │
│  • learning.ts      │ │  • useLoading.ts    │
│  • assessment.ts    │ │                     │
└──────────┬──────────┘ └──────────┬──────────┘
           │                      │
           ▼                      ▼
┌─────────────────────────────────────────────────────────┐
│                  API Service Layer                        │
│                  (api/modules/*.ts)                       │
│                                                          │
│  • authApi.ts         • communityApi.ts                  │
│  • userApi.ts         • learningApi.ts                    │
│  • assessmentApi.ts   • notificationApi.ts               │
│  • jobApi.ts          • systemApi.ts                      │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│                 HTTP Client (Axios)                       │
│                 (utils/http.ts)                           │
│                                                          │
│  • Instance配置         • Request Interceptor            │
│  • Response Interceptor • Error Handler                  │
│  • Token Manager        • Retry Logic                    │
└──────────────────┬──────────────────────────────────────┘
                   │
           ┌───────┴───────┐
           │               │
           ▼               ▼
┌──────────────────┐ ┌──────────────────┐
│   Real Backend   │ │    Mock Server   │
│  (FastAPI)       │ │  (MockAdapter)   │
│                  │ │                  │
│  • Production    │ │  • Development   │
│  • Staging       │ │  • Testing       │
└──────────────────┘ └──────────────────┘
```

### 3.2 核心设计理念

#### 理念1: 分层解耦

- **View层**: 只负责UI展示和用户交互
- **Store层**: 管理业务状态和数据流
- **API层**: 封装所有HTTP请求
- **HTTP层**: 底层通信基础设施

#### 理念2: 依赖倒置

- Store依赖抽象的API接口（不直接依赖axios）
- 通过适配器模式切换真实/Mock数据源
- 符合SOLID原则

#### 理念3: 配置驱动

- 通过环境变量控制使用真实API还是Mock
- 开发环境默认使用Mock，生产环境使用真实API
- 一键切换，无需改动业务代码

***

## 4. 目录结构规划

### 4.1 目标目录结构

```
src/
├── api/                          # API服务层（新增）
│   ├── modules/                  # 按业务模块划分
│   │   ├── auth.api.ts          # 认证相关API
│   │   ├── user.api.ts          # 用户相关API
│   │   ├── community.api.ts     # 社区相关API
│   │   ├── learning.api.ts      # 学习相关API
│   │   ├── assessment.api.ts    # 测评相关API
│   │   ├── job.api.ts           # 职位相关API
│   │   ├── notification.api.ts  # 通知相关API
│   │   └── system.api.ts        # 系统配置API
│   ├── index.ts                 # API统一导出
│   └── types/                   # API相关的类型定义
│       ├── auth.types.ts
│       ├── user.types.ts
│       ├── community.types.ts
│       └── response.types.ts    # 通用响应类型
│
├── utils/                        # 工具函数（扩展）
│   ├── http.ts                  # Axios实例配置（核心）
│   ├── request.ts               # 请求封装方法
│   ├── auth.ts                  # Token管理工具
│   ├── error.ts                 # 错误处理工具
│   ├── storage.ts               # 本地存储封装
│   └── assessment.ts            # 已有，保留
│
├── mock/                         # Mock数据层（新增）
│   ├── adapter.ts               # Mock适配器（核心）
│   ├── index.ts                 # Mock数据统一导出
│   ├── data/                    # Mock数据文件
│   │   ├── auth.mock.ts         # 认证Mock数据
│   │   ├── user.mock.ts         # 用户Mock数据
│   │   ├── community.mock.ts    # 社区Mock数据
│   │   ├── learning.mock.ts     # 学习Mock数据
│   │   ├── assessment.mock.ts   # 测评Mock数据
│   │   └── index.ts             # Mock数据汇总
│   └── handlers/                # Mock处理器
│       ├── auth.handler.ts      # 认证请求处理
│       ├── user.handler.ts      # 用户请求处理
│       ├── community.handler.ts # 社区请求处理
│       └── index.ts             # 处理器注册
│
├── composables/                  # 组合式函数（新增）
│   ├── useAuth.ts              # 认证逻辑复用
│   ├── useRequest.ts           # 请求状态管理
│   ├── usePagination.ts        # 分页逻辑
│   └── index.ts
│
├── types/                        # 全局类型定义（新增）
│   ├── index.ts                 # 类型统一导出
│   ├── env.d.ts                 # 环境变量类型
│   └── api.d.ts                 # API相关全局类型
│
├── stores/                       # Pinia Store（重构）
│   ├── user.ts                  # 用户Store（重构）
│   ├── community.ts             # 社区Store（新增）
│   ├── learning.ts              # 学习Store（新增）
│   ├── assessment.ts            # 测评Store（新增）
│   ├── app.ts                   # 应用级Store（新增）
│   └── index.ts                 # Store统一导出
│
├── router/                       # 路由（扩展）
│   ├── index.ts                 # 路由配置（增强守卫）
│   └── guards/
│       └── auth.guard.ts        # 路由守卫
│
├── config/                       # 配置文件（新增）
│   ├── index.ts                 # 应用配置
│   ├── constants.ts             # 常量定义
│   └── enum.ts                  # 枚举定义
│
├── assets/                       # 静态资源
├── components/                   # 组件
├── views/                        # 页面（逐步改造）
├── App.vue
├── main.ts                       # 入口（扩展）
└── style.css
```

### 4.2 新增文件清单

| 文件路径                         | 类型 | 说明        | 优先级 |
| ---------------------------- | -- | --------- | --- |
| `utils/http.ts`              | 核心 | Axios实例配置 | P0  |
| `utils/auth.ts`              | 核心 | Token管理   | P0  |
| `utils/request.ts`           | 核心 | 请求方法封装    | P0  |
| `utils/error.ts`             | 核心 | 错误处理      | P0  |
| `utils/storage.ts`           | 工具 | 本地存储      | P0  |
| `mock/adapter.ts`            | 核心 | Mock适配器   | P0  |
| `mock/data/*.mock.ts`        | 数据 | Mock数据    | P0  |
| `mock/handlers/*.handler.ts` | 逻辑 | Mock处理    | P0  |
| `api/modules/*.api.ts`       | 服务 | API服务层    | P0  |
| `api/types/*.types.ts`       | 类型 | API类型定义   | P0  |
| `composables/useAuth.ts`     | 逻辑 | 认证组合函数    | P1  |
| `composables/useRequest.ts`  | 逻辑 | 请求状态管理    | P1  |
| `stores/community.ts`        | 状态 | 社区Store   | P1  |
| `stores/learning.ts`         | 状态 | 学习Store   | P1  |
| `config/index.ts`            | 配置 | 应用配置      | P1  |

***

## 5. HTTP请求基础设施实现

### 5.1 技术选型：为什么选择Axios？

| 特性       | Axios              | Fetch API          |
| -------- | ------------------ | ------------------ |
| 拦截器      | ✅ 原生支持             | ❌ 需手动封装            |
| 请求/响应转换  | ✅ 内置               | ❌ 需手动处理            |
| 取消请求     | ✅ CancelToken      | ✅ AbortController  |
| 超时控制     | ✅ 配置项              | ❌ 需AbortController |
| JSON自动解析 | ✅ 默认               | ❌ 需.json()         |
| 上传进度     | ✅ onUploadProgress | ❌ 复杂               |
| 浏览器兼容性   | ✅ 更好               | ES6+               |
| 社区生态     | ✅ 丰富               | 较少                 |

**结论**: Axios更适合企业级应用，功能完善，社区活跃。

### 5.2 安装依赖

```bash
pnpm add axios
pnpm add -D @types/axios  # TypeScript类型定义
```

### 5.3 核心文件：utils/http.ts

```typescript
/**
 * Axios HTTP Client 配置
 * 
 * 功能特性:
 * 1. 基础URL配置（支持环境变量）
 * 2. 请求/响应拦截器
 * 3. JWT Token自动注入
 * 4. 统一错误处理
 * 5. 请求重试机制
 * 6. 请求取消支持
 * 7. Loading状态管理
 */

import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
  type AxiosError
} from 'axios'
import { useUserStore } from '@/stores/user'
import { getToken, removeToken } from './auth'
import { handleApiError } from './error'
import { ElMessage } from 'element-plus' // 或其他UI库提示

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 15000, // 15秒超时
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 1. 注入Token
    const token = getToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // 2. 添加时间戳防止缓存（GET请求）
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      }
    }

    // 3. 显示Loading（可选）
    // showLoading()

    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.params || config.data)

    return config
  },
  (error: AxiosError) => {
    console.error('[API Request Error]', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data, config } = response
    
    console.log(`[API Response] ${config.url}`, data)

    // 1. 检查业务状态码
    if (data.code !== undefined && data.code !== 200 && data.code !== 20000) {
      // 业务错误
      handleApiError(data)
      return Promise.reject(new Error(data.message || '请求失败'))
    }

    // 2. 直接返回data字段（解包ResponseModel）
    return data
  },
  (error: AxiosError) => {
    const { response, message, config } = error

    console.error(`[API Error] ${config?.url}`, error)

    // 1. HTTP错误处理
    if (response) {
      switch (response.status) {
        case 401:
          // Token过期或无效
          ElMessage.error('登录已过期，请重新登录')
          removeToken()
          // 跳转到登录页
          window.location.href = '/login'
          break
        case 403:
          ElMessage.error('没有权限访问')
          break
        case 404:
          ElMessage.error('请求的资源不存在')
          break
        case 500:
          ElMessage.error('服务器内部错误')
          break
        default:
          ElMessage.error(response.data?.message || `请求失败(${response.status})`)
      }
    } else if (message.includes('timeout')) {
      ElMessage.error('请求超时，请稍后重试')
    } else if (message.includes('Network')) {
      ElMessage.error('网络连接失败，请检查网络')
    } else {
      ElMessage.error(message || '未知错误')
    }

    return Promise.reject(error)
  }
)

export default service
```

### 5.4 请求方法封装：utils/request.ts

```typescript
/**
 * 请求方法封装
 * 提供便捷的GET/POST/PUT/DELETE等方法
 */

import service from './http'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'

/**
 * 通用请求方法
 */
export function request<T = any>(config: AxiosRequestConfig): Promise<T> {
  return service.request(config) as Promise<T>
}

/**
 * GET请求
 */
export function get<T = any>(
  url: string,
  params?: Record<string, any>,
  config?: AxiosRequestConfig
): Promise<T> {
  return service.get(url, { params, ...config }) as Promise<T>
}

/**
 * POST请求
 */
export function post<T = any>(
  url: string,
  data?: Record<string, any>,
  config?: AxiosRequestConfig
): Promise<T> {
  return service.post(url, data, config) as Promise<T>
}

/**
 * PUT请求
 */
export function put<T = any>(
  url: string,
  data?: Record<string, any>,
  config?: AxiosRequestConfig
): Promise<T> {
  return service.put(url, data, config) as Promise<T>
}

/**
 * DELETE请求
 */
export function del<T = any>(
  url: string,
  params?: Record<string, any>,
  config?: AxiosRequestConfig
): Promise<T> {
  return service.delete(url, { params, ...config }) as Promise<T>
}

/**
 * 文件上传
 */
export function upload<T = any>(
  url: string,
  file: File | FormData,
  onProgress?: (progressEvent: ProgressEvent) => void,
  config?: AxiosRequestConfig
): Promise<T> {
  const formData = file instanceof File ? new FormData() : file
  
  if (file instanceof File) {
    formData.append('file', file)
  }

  return service.post(url, formData, {
    ...config,
    headers: {
      'Content-Type': 'multipart/form-data',
      ...config?.headers
    },
    onUploadProgress
  }) as Promise<T>
}
```

### 5.5 Token管理：utils/auth.ts

```typescript
/**
 * Token管理工具
 * 
 * 功能:
 * 1. Token存储（localStorage）
 * 2. Token读取
 * 3. Token删除
 * 4. Token过期检查
 */

const TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const USER_INFO_KEY = 'user_info'

/**
 * 获取访问令牌
 */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

/**
 * 设置访问令牌
 */
export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

/**
 * 获取刷新令牌
 */
export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

/**
 * 设置刷新令牌
 */
export function setRefreshToken(token: string): void {
  localStorage.setItem(REFRESH_TOKEN_KEY, token)
}

/**
 * 移除所有Token
 */
export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(USER_INFO_KEY)
}

/**
 * 检查是否已登录
 */
export function isLoggedIn(): boolean {
  return !!getToken()
}

/**
 * 获取用户信息（从缓存）
 */
export function getCachedUserInfo(): any {
  const userInfo = localStorage.getItem(USER_INFO_KEY)
  return userInfo ? JSON.parse(userInfo) : null
}

/**
 * 缓存用户信息
 */
export function cacheUserInfo(userInfo: any): void {
  localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo))
}
```

### 5.6 错误处理：utils/error.ts

```typescript
/**
 * 统一错误处理
 * 
 * 功能:
 * 1. 业务错误码映射
 * 2. 错误消息格式化
 * 3. 错误上报（可选）
 */

interface ApiError {
  code: number
  message: string
  data?: any
}

/**
 * 错误码映射表
 */
const ERROR_CODE_MAP: Record<number, string> = {
  400: '请求参数错误',
  401: '未授权，请登录',
  403: '拒绝访问',
  404: '资源不存在',
  405: '请求方法不允许',
  408: '请求超时',
  500: '服务器内部错误',
  502: '网关错误',
  503: '服务不可用',
  504: '网关超时'
}

/**
 * 处理API业务错误
 */
export function handleApiError(error: ApiError): void {
  const { code, message } = error
  
  // 根据错误码显示不同提示
  if (code >= 400 && code < 500) {
    // 客户端错误
    console.warn(`[Business Error] ${code}: ${message}`)
  } else if (code >= 500) {
    // 服务端错误
    console.error(`[Server Error] ${code}: ${message}`)
  }

  // 可选：错误上报
  // reportErrorToService(error)
}

/**
 * 格式化错误消息
 */
export function formatErrorMessage(error: any): string {
  if (typeof error === 'string') {
    return error
  }

  if (error?.response?.data?.message) {
    return error.response.data.message
  }

  if (error?.message) {
    return error.message
  }

  return '未知错误'
}

/**
 * 判断是否为网络错误
 */
export function isNetworkError(error: any): boolean {
  return !error.response && !!error.message
}

/**
 * 判断是否为超时错误
 */
export function isTimeoutError(error: any): boolean {
  return error.code === 'ECONNABORTED' || error.message?.includes('timeout')
}
```

### 5.7 本地存储封装：utils/storage.ts

```typescript
/**
 * 本地存储封装
 * 支持localStorage和sessionStorage
 */

type StorageType = 'local' | 'session'

class StorageHelper {
  private storage: Storage

  constructor(type: StorageType = 'local') {
    this.storage = type === 'local' ? localStorage : sessionStorage
  }

  /**
   * 设置值
   */
  set(key: string, value: any, expireInMinutes?: number): void {
    const item = {
      value,
      expire: expireInMinutes ? Date.now() + expireInMinutes * 60 * 1000 : null
    }
    this.storage.setItem(key, JSON.stringify(item))
  }

  /**
   * 获取值
   */
  get(key: string): any {
    const itemStr = this.storage.getItem(key)
    
    if (!itemStr) return null

    try {
      const item = JSON.parse(itemStr)
      
      // 检查过期
      if (item.expire && Date.now() > item.expire) {
        this.remove(key)
        return null
      }

      return item.value
    } catch {
      return null
    }
  }

  /**
   * 移除值
   */
  remove(key: string): void {
    this.storage.removeItem(key)
  }

  /**
   * 清空所有
   */
  clear(): void {
    this.storage.clear()
  }

  /**
   * 是否存在
   */
  has(key: string): boolean {
    return this.get(key) !== null
  }
}

// 导出实例
export const localCache = new StorageHelper('local')
export const sessionCache = new StorageHelper('session')
```

***

## 6. 认证系统对接方案

### 6.1 认证流程图

```
┌─────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Login  │───▶│  UserStore│───▶│ authApi  │───▶│  Backend │
│  Page   │    │          │    │ .login() │    │  /login  │
└─────────┘    └────┬─────┘    └────┬─────┘    └────┬─────┘
                    │               │                │
                    ▼               ▼                ▼
              ┌──────────┐   ┌──────────┐   ┌──────────┐
              │ Set State│   │ Return   │   │ Response │
              │ & Cache  │   │ Token    │   │ {token,  │
              │ Token    │   │ + User   │   │  user}   │
              └──────────┘   └──────────┘   └──────────┘
```

### 6.2 API服务层：api/modules/auth.api.ts

```typescript
/**
 * 认证相关API
 */

import { post, get } from '@/utils/request'
import type { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  UserResponse,
  SmsSendRequest,
  SmsLoginRequest,
  PasswordResetRequest,
  PasswordResetTokenRequest
} from '../types/auth.types'

const BASE_URL = '/auth'

export const authApi = {
  /**
   * 用户名密码登录
   */
  login(data: LoginRequest): Promise<LoginResponse> {
    return post<LoginResponse>(`${BASE_URL}/login`, data)
  },

  /**
   * Swagger UI 登录（用于调试）
   */
  swaggerLogin(username: string, password: string): Promise<LoginResponse> {
    const params = new URLSearchParams()
    params.append('username', username)
    params.append('password', password)
    
    return post<LoginResponse>(`${BASE_URL}/swagger-login`, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
  },

  /**
   * 用户注册
   */
  register(data: RegisterRequest): Promise<UserResponse> {
    return post<UserResponse>(`${BASE_URL}/register`, data)
  },

  /**
   * 获取当前用户信息
   */
  getUserInfo(): Promise<UserResponse> {
    return get<UserResponse>(`${BASE_URL}/me`)
  },

  /**
   * 发送短信验证码
   */
  sendSmsCode(data: SmsSendRequest): Promise<string> {
    return post<string>(`${BASE_URL}/sms/send`, data)
  },

  /**
   * 短信验证码登录
   */
  smsLogin(data: SmsLoginRequest): Promise<LoginResponse> {
    return post<LoginResponse>(`${BASE_URL}/sms/login`, data)
  },

  /**
   * 生成密码重置令牌
   */
  generatePasswordResetToken(data: PasswordResetTokenRequest): Promise<string> {
    return post<string>(`${BASE_URL}/password/reset-token`, data)
  },

  /**
   * 重置密码
   */
  resetPassword(data: PasswordResetRequest): Promise<string> {
    return post<string>(`${BASE_URL}/password/reset`, data)
  },

  /**
   * 退出登录
   */
  logout(): void {
    // 清除本地Token
    const { removeToken } = await import('@/utils/auth')
    removeToken()
    
    // 可选：调用后端注销接口（如果有）
    // return post(`${BASE_URL}/logout`)
  }
}
```

### 6.3 类型定义：api/types/auth.types.ts

```typescript
/**
 * 认证模块类型定义
 * 与后端 schemas/user.py 保持一致
 */

/** 登录请求 */
export interface LoginRequest {
  email: string
  password: string
}

/** 注册请求 */
export interface RegisterRequest {
  email: string
  password: string
  username?: string
  phone?: string
}

/** 登录响应（包含Token） */
export interface LoginResponse {
  access_token: string
  token_type: string
  expires_in?: number
  user?: UserResponse
}

/** 短信发送请求 */
export interface SmsSendRequest {
  phone: string
}

/** 短信登录请求 */
export interface SmsLoginRequest {
  phone: string
  code: string
}

/** 密码重置令牌请求 */
export interface PasswordResetTokenRequest {
  email: string
}

/** 密码重置请求 */
export interface PasswordResetRequest {
  token: string
  new_password: string
}

/** 用户响应 */
export interface UserResponse {
  id: number
  email: string
  username: string
  avatar_url?: string
  is_active: boolean
  role: string
  created_at: string
  updated_at: string
  profile?: UserProfile
}

/** 用户资料 */
export interface UserProfile {
  nickname?: string
  avatar_url?: string
  phone?: string
  education?: string
  target_position?: string
  work_years?: number
  skills?: string[]
}
```

### 6.4 Store重构：stores/user.ts

```typescript
/**
 * 用户Store（重构版）
 * 
 * 变更说明:
 * 1. 从Mock登录改为真实API调用
 * 2. 使用JWT Token进行认证
 * 3. 状态持久化到localStorage
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api/modules/auth.api'
import { setToken, removeToken, isLoggedIn, getCachedUserInfo, cacheUserInfo } from '@/utils/auth'

// 用户信息接口（保持与原结构兼容）
export interface UserInfo {
  id: string | number
  name: string
  email: string
  avatar: string
  isAuthenticated: boolean
  role: 'user' | 'admin'
  skills: string[]
  // 扩展字段
  accessToken?: string
  profile?: any
}

export const useUserStore = defineStore('user', () => {
  // 状态
  const user = ref<UserInfo>({
    id: '',
    name: '',
    email: '',
    avatar: '',
    isAuthenticated: false,
    role: 'user',
    skills: []
  })
  
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 计算属性
  const isLoggedIn = computed(() => {
    // 优先检查Token
    if (isLoggedIn()) {
      return true
    }
    return user.value.isAuthenticated
  })

  const hasSkills = computed(() => user.value.skills.length > 0)

  // 方法

  /**
   * 登录（真实API调用）
   */
  async function login(email: string, password: string): Promise<boolean> {
    loading.value = true
    error.value = null

    try {
      // 调用登录API
      const response = await authApi.login({ email, password })
      
      // 存储Token
      setToken(response.access_token)
      
      // 如果返回了用户信息，直接使用；否则单独获取
      if (response.user) {
        mapUserData(response.user)
        user.value.accessToken = response.access_token
        user.value.isAuthenticated = true
      } else {
        // 获取完整用户信息
        await fetchUserInfo()
      }

      // 缓存用户信息
      cacheUserInfo(user.value)

      return true
    } catch (err: any) {
      error.value = err.message || '登录失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 注册
   */
  async function register(email: string, password: string, username?: string): Promise<boolean> {
    loading.value = true
    error.value = null

    try {
      await authApi.register({ email, password, username })
      return true
    } catch (err: any) {
      error.value = err.message || '注册失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取用户信息
   */
  async function fetchUserInfo(): Promise<void> {
    try {
      const userInfo = await authApi.getUserInfo()
      mapUserData(userInfo)
      user.value.isAuthenticated = true
    } catch (err) {
      console.error('获取用户信息失败', err)
      // Token可能失效
      logout()
    }
  }

  /**
   * 映射用户数据（后端→前端）
   */
  function mapUserData(apiUser: any): void {
    user.value = {
      id: apiUser.id.toString(),
      name: apiUser.username || apiUser.email.split('@')[0],
      email: apiUser.email,
      avatar: apiUser.avatar_url || apiUser.profile?.avatar_url || '',
      isAuthenticated: true,
      role: apiUser.role === 'admin' ? 'admin' : 'user',
      skills: apiUser.profile?.skills || [],
      profile: apiUser.profile
    }
  }

  /**
   * 退出登录
   */
  function logout(): void {
    // 清除Token
    removeToken()
    
    // 重置状态
    user.value = {
      id: '',
      name: '',
      email: '',
      avatar: '',
      isAuthenticated: false,
      role: 'user',
      skills: []
    }
    
    // 可选：调用后端注销
    // authApi.logout()
  }

  /**
   * 更新用户资料
   */
  async function updateProfile(profileData: Partial<UserInfo>): Promise<void> {
    // TODO: 调用更新接口
    Object.assign(user.value, profileData)
    cacheUserInfo(user.value)
  }

  /**
   * 初始化（应用启动时调用）
   * 从缓存恢复登录状态
   */
  async function initialize(): Promise<void> {
    if (isLoggedIn()) {
      // 有Token，尝试恢复用户信息
      const cachedUser = getCachedUserInfo()
      if (cachedUser) {
        user.value = cachedUser
        user.value.isAuthenticated = true
      } else {
        // 从服务器获取最新信息
        await fetchUserInfo()
      }
    }
  }

  return {
    user,
    loading,
    error,
    isLoggedIn,
    hasSkills,
    login,
    register,
    logout,
    updateProfile,
    fetchUserInfo,
    initialize
  }
})
```

### 6.5 路由守卫增强：router/guards/auth.guard.ts

```typescript
/**
 * 认证路由守卫
 */

import type { Router } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { isLoggedIn } from '@/utils/auth'

/**
 * 白名单路由（不需要登录）
 */
const WHITE_LIST = [
  '/login',
  '/register',
  '/forgot-password',
  '/',
  '/matching'  // 首页和匹配页可以不登录访问
]

/**
 * 设置路由守卫
 */
export function setupAuthGuard(router: Router): void {
  router.beforeEach(async (to, _from, next) => {
    const userStore = useUserStore()
    
    // 检查是否需要认证
    const requiresAuth = to.meta.requiresAuth !== false && !WHITE_LIST.includes(to.path)

    if (requiresAuth) {
      // 需要认证的路由
      if (!isLoggedIn()) {
        // 未登录，跳转登录页
        next({
          path: '/login',
          query: { redirect: to.fullPath }  // 保存原始路径
        })
        return
      }

      // 已登录但用户信息未加载
      if (!userStore.user.isAuthenticated) {
        try {
          await userStore.initialize()
        } catch (error) {
          // Token无效，清除并跳转登录
          userStore.logout()
          next('/login')
          return
        }
      }
    }

    // 设置页面标题
    document.title = `${to.meta.title || ''} | 面面俱到`

    next()
  })

  // 路由后置钩子（可选：用于埋点统计）
  router.afterEach((to) => {
    // 页面访问统计
    console.log(`[Route] Navigated to: ${to.path}`)
  })
}
```

***

## 7. Mock数据软编码架构

### 7.1 设计目标

1. **无缝切换**: 通过环境变量一键切换Mock/真实API
2. **数据一致性**: Mock数据结构与后端API响应完全一致
3. **独立运行**: Mock模式下不依赖后端，可独立开发
4. **易于维护**: Mock数据集中管理，便于修改
5. **性能优秀**: Mock响应延迟低，适合快速迭代

### 7.2 架构设计

```
┌─────────────────────────────────────────────────────┐
│                  环境变量配置                           │
│  VITE_USE_MOCK=true/false                            │
└─────────────────────┬───────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│              Mock Adapter (适配器)                    │
│              mock/adapter.ts                         │
│                                                      │
│  功能:                                                │
│  • 拦截所有axios请求                                  │
│  • 匹配Mock处理器                                    │
│  • 返回Mock数据                                      │
│  • 模拟延迟                                           │
└─────────────────────┬───────────────────────────────┘
                      │
          ┌───────────┼───────────┐
          ▼           ▼           ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Auth Handler │ │ User Handler │ │ Community...  │
│              │ │              │ │              │
│ • login()    │ │ • profile()  │ │ • posts()    │
│ • register() │ │ • history()  │ │ • comments() │
│              │ │              │ │              │
└──────┬───────┘ └──────┬───────┘ └──────┬───────┘
       │                │                │
       ▼                ▼                ▼
┌─────────────────────────────────────────────────────┐
│              Mock Data (数据层)                       │
│              mock/data/*.mock.ts                      │
│                                                      │
│  • auth.mock.ts    • user.mock.ts                    │
│  • community.mock.ts • learning.mock.ts              │
│  • assessment.mock.ts                                │
└─────────────────────────────────────────────────────┘
```

### 7.3 核心实现：mock/adapter.ts

```typescript
/**
 * Mock适配器
 * 
 * 工作原理:
 * 1. 创建axios mock适配器实例
 * 2. 在开发环境且VITE_USE_MOCK=true时启用
 * 3. 拦截所有请求，返回预定义的Mock数据
 */

import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { registerAuthHandlers } from './handlers/auth.handler'
import { registerUserHandlers } from './handlers/user.handler'
import { registerCommunityHandlers } from './handlers/community.handler'
import { registerLearningHandlers } from './handlers/learning.handler'
import { registerAssessmentHandlers } from './handlers/assessment.handler'

// 创建Mock适配器实例
let mock: MockAdapter | null = null

/**
 * 初始化Mock适配器
 * @param axiosInstance axios实例
 */
export function initMockAdapter(axiosInstance: any): void {
  // 仅在开发环境启用
  const isDev = import.meta.env.DEV
  const useMock = import.meta.env.VITE_USE_MOCK === 'true'

  if (!isDev || !useMock) {
    console.log('[Mock] Mock模式已禁用，将使用真实API')
    return
  }

  console.log('[Mock] Mock模式已启用')

  // 创建适配器
  mock = new MockAdapter(axiosInstance, { delayResponse: 300 })

  // 注册各模块的Mock处理器
  registerAuthHandlers(mock)
  registerUserHandlers(mock)
  registerCommunityHandlers(mock)
  registerLearningHandlers(mock)
  registerAssessmentHandlers(mock)

  console.log('[Mock] Mock处理器注册完成')
}

/**
 * 导出Mock实例（用于测试）
 */
export function getMockInstance(): MockAdapter | null {
  return mock
}
```

### 7.4 Mock数据定义：mock/data/user.mock.ts

```typescript
/**
 * 用户相关Mock数据
 * 
 * 注意: 数据结构与后端API响应完全一致
 */

export const mockUser = {
  id: 1,
  email: 'wang@example.com',
  username: '王同学',
  avatar_url: '',
  is_active: true,
  role: 'user',
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-05-09T00:00:00Z',
  profile: {
    nickname: '王同学',
    education: '北京大学计算机科学与技术专业',
    target_position: '前端开发工程师',
    work_years: 2,
    skills: ['Vue3', 'React', 'TypeScript', 'JavaScript'],
    school: '北京大学',
    grade: '大三',
    major: '计算机专业',
    phone: '138****8000'
  }
}

export const mockInterviewHistory = [
  {
    id: 1,
    date: '2026-03-15',
    company: '字节跳动',
    position: '前端开发工程师',
    round: '二面',
    type: '技术面',
    score: 88,
    status: 'passed',
    tags: ['Vue3', 'TypeScript', '算法'],
    feedback: '技术基础扎实，算法能力突出，表达清晰',
    details: {
      technical: 90,
      communication: 85,
      logic: 92,
      problem_solving: 88
    }
  },
  // ... 更多记录（从Profile.vue迁移）
]

export const mockSavedQuestionBanks = [
  {
    id: 1,
    title: '高频算法 50 题',
    description: '涵盖面试中常见的算法题...',
    question_count: 24,
    category: '算法',
    difficulty: 'medium',
    saved_at: '2026-03-20',
    last_practiced: '2026-03-25',
    questions: [...]
  },
  // ... 更多题库
]

export const mockWrongQuestions = [
  {
    id: 1,
    question: '在 Vue3 中，如何实现组件间的通信？',
    user_answer: '使用 props 和 events',
    correct_answer: '使用 props、events、provide/inject、pinia 等',
    explanation: 'Vue3 提供了多种组件间通信方式...',
    category: '前端',
    difficulty: 'medium',
    mistake_count: 2,
    last_mistake_at: '2026-03-24',
    status: 'unreviewed'
  },
  // ... 更多错题
]
```

### 7.5 Mock处理器：mock/handlers/user.handler.ts

```typescript
/**
 * 用户模块Mock处理器
 */

import type { MockAdapter } from 'axios-mock-adapter'
import { mockUser, mockInterviewHistory, mockSavedQuestionBanks, mockWrongQuestions } from '../data/user.mock'

/**
 * 注册用户相关Mock处理器
 */
export function registerUserHandlers(mock: MockAdapter): void {
  // 获取用户信息 GET /user/profile
  mock.onGet('/user/profile').reply(200, {
    code: 200,
    message: 'success',
    data: mockUser
  })

  // 更新用户信息 PUT /user/profile
  mock.onPut('/user/profile').reply(200, {
    code: 200,
    message: '更新成功',
    data: { ...mockUser, ...mockUser.profile }
  })

  // 获取面试记录 GET /user/interview-history
  mock.onGet('/user/interview-history').reply(200, {
    code: 200,
    message: 'success',
    data: {
      items: mockInterviewHistory,
      total: mockInterviewHistory.length,
      page: 1,
      page_size: 10
    }
  })

  // 获取收藏题库 GET /learning/collections
  mock.onGet(/\/learning\/collections(\?.*)?$/).reply(200, {
    code: 200,
    message: 'success',
    data: mockSavedQuestionBanks
  })

  // 添加收藏 POST /learning/collections
  mock.onPost('/learning/collections').reply(200, {
    code: 200,
    message: '收藏成功',
    data: { id: Date.now(), status: 'success' }
  })

  // 获取错题本 GET /learning/wrong-questions
  mock.onGet(/\/learning\/wrong-questions(\?.*)?$/).reply(200, {
    code: 200,
    message: 'success',
    data: mockWrongQuestions
  })

  // 记录错题 POST /learning/wrong-questions
  mock.onPost('/learning/wrong-questions').reply(200, {
    code: 200,
    message: '记录成功',
    data: { id: Date.now(), status: 'recorded' }
  })

  // 标记错题已掌握 POST /learning/wrong-questions/:id/master
  mock.onPost(/\/learning\/wrong-questions\/\d+\/master/).reply(200, {
    code: 200,
    message: '标记成功',
    data: { status: 'mastered' }
  })
}
```

### 7.6 Mock处理器：mock/handlers/community.handler.ts

```typescript
/**
 * 社区模块Mock处理器
 */

import type { MockAdapter } from 'axios-mock-adapter'
import { mockPosts, mockComments, mockHotTopics } from '../data/community.mock'

/**
 * 注册社区相关Mock处理器
 */
export function registerCommunityHandlers(mock: MockAdapter): void {
  // 获取帖子流 GET /community/posts/feed
  mock.onGet(/\/community\/posts\/feed(\?.*)?$/).reply(200, {
    code: 200,
    message: 'success',
    data: mockPosts
  })

  // 获取帖子详情 GET /community/posts/:id
  mock.onGet(/\/community\/posts\/\d+/).reply(200, {
    code: 200,
    message: 'success',
    data: (config: any) => {
      const postId = parseInt(config.url.match(/\/posts\/(\d+)/)[1])
      const post = mockPosts.find((p: any) => p.id === postId)
      return post || mockPosts[0]
    }
  })

  // 创建帖子 POST /community/posts
  mock.onPost('/community/posts').reply(200, {
    code: 200,
    message: '发布成功',
    data: { id: Date.now(), status: 'published', created_at: new Date().toISOString() }
  })

  // 添加评论 POST /community/posts/:id/comments
  mock.onPost(/\/community\/posts\/\d+\/comments/).reply(200, {
    code: 200,
    message: '评论成功',
    data: { id: Date.now(), status: 'created' }
  })

  // 点赞/取消点赞 POST /community/posts/:id/like
  mock.onPost(/\/community\/posts\/\d+\/like/).reply(200, {
    code: 200,
    message: 'success',
    data: { liked: true, likes_count: 129 }
  })

  // 关注/取消关注 POST /community/users/:id/follow
  mock.onPost(/\/community\/users\/\d+\/follow/).reply(200, {
    code: 200,
    message: 'success',
    data: { following: true }
  })

  // 触发AI审核 POST /community/posts/:id/ai-review
  mock.onPost(/\/community\/posts\/\d+\/ai-review/).reply(200, {
    code: 200,
    message: '审核任务已提交',
    data: { task_id: 'task_' + Date.now(), status: 'pending' }
  })
}
```

### 7.7 环境变量配置

创建 `.env.development`:

```bash
# 开发环境配置
VITE_APP_TITLE=MianMianMaster Dev
VITE_API_BASE_URL=/api/v1
VITE_USE_MOCK=true  # 启用Mock模式
VITE_MOCK_DELAY=300   # Mock延迟(ms)
```

创建 `.env.production`:

```bash
# 生产环境配置
VITE_APP_TITLE=面面俱到
VITE_API_BASE_URL=https://api.mianmianmaster.com/api/v1
VITE_USE_MOCK=false  # 禁用Mock模式
```

创建 `.env.staging`:

```bash
# 预发布环境配置
VITE_APP_TITLE=面面俱到(Staging)
VITE_API_BASE_URL=https://staging-api.mianmianmaster.com/api/v1
VITE_USE_MOCK=false
```

***

## 8. 分阶段实施计划

### 8.1 Phase 1: 基础设施搭建（Day 1-2）

**目标**: 建立完整的HTTP请求基础设施

#### 任务清单

##### Day 1: 上午

- [ ] **1.1** 安装axios依赖
  ```bash
  pnpm add axios axios-mock-adapter
  pnpm add -D @types/axios
  ```
- [ ] **1.2** 创建环境变量配置文件
  - `.env.development`
  - `.env.production`
  - `.env.staging`
- [ ] **1.3** 实现 `utils/http.ts`
  - Axios实例配置
  - 请求拦截器（Token注入）
  - 响应拦截器（错误处理）

##### Day 1: 下午

- [ ] **1.4** 实现 `utils/request.ts`
  - GET/POST/PUT/DELETE封装
  - 文件上传方法
- [ ] **1.5** 实现 `utils/auth.ts`
  - Token存储/读取/删除
  - 用户信息缓存
- [ ] **1.6** 实现 `utils/error.ts`
  - 错误码映射
  - 错误消息格式化
- [ ] **1.7** 实现 `utils/storage.ts`
  - localStorage/sessionStorage封装
  - 过期时间支持

##### Day 2: 上午

- [ ] **1.8** 创建API类型定义
  - `api/types/response.types.ts` - 通用响应类型
  - `api/types/auth.types.ts` - 认证类型
  - `api/types/user.types.ts` - 用户类型
  - `api/types/community.types.ts` - 社区类型
- [ ] **1.9** 创建API服务层骨架
  - `api/modules/auth.api.ts`
  - `api/modules/user.api.ts`
  - `api/modules/community.api.ts`
  - `api/index.ts` - 统一导出

##### Day 2: 下午

- [ ] **1.10** 配置Vite代理（如需要）
  - 更新 `vite.config.ts`
- [ ] **1.11** 编写单元测试
  - HTTP客户端测试
  - Token管理测试
  - 错误处理测试
- [ ] **1.12** 代码审查和文档编写
  - README.md更新
  - JSDoc注释

**交付物**:

- ✅ 完整的HTTP基础设施
- ✅ 类型定义文件
- ✅ 单元测试
- ✅ 技术文档

***

### 8.2 Phase 2: 认证系统对接（Day 3-4）

**目标**: 实现完整的用户认证流程

#### 任务清单

##### Day 3: 上午

- [ ] **2.1** 完善 `api/modules/auth.api.ts`
  - login/register/getUserInfo
  - smsLogin/sendSmsCode
  - passwordReset
- [ ] **2.2** 重构 `stores/user.ts`
  - 对接真实登录API
  - Token管理
  - 状态持久化
  - initialize() 方法

##### Day 3: 下午

- [ ] **2.3** 增强 `router/index.ts`
  - 导入并使用新的认证守卫
  - 白名单配置
  - 登录回调处理
- [ ] **2.4** 更新 `LoginForm.vue` 组件
  - 调用store.login()
  - 错误提示
  - Loading状态
  - 表单验证增强
- [ ] **2.5** 实现登录后的跳转逻辑
  - 从query参数获取redirect
  - 跳转到原目标页面

##### Day 4: 上午

- [ ] **2.6** 实现 `composables/useAuth.ts`
  - 登录状态判断
  - 权限检查
  - 登录/登出快捷方法
- [ ] **2.7** 更新 `App.vue` 或布局组件
  - 根据登录状态显示/隐藏元素
  - 用户头像和信息展示

##### Day 4: 下午

- [ ] **2.8** 编写认证流程测试
  - 登录成功场景
  - 登录失败场景
  - Token过期场景
  - 路由守卫测试
- [ ] **2.9** 边界情况处理
  - 网络断开时登录
  - 并发登录
  - 多标签页同步

**交付物**:

- ✅ 完整的认证流程
- ✅ 重构后的User Store
- ✅ 增强的路由守卫
- ✅ 测试用例

***

### 8.3 Phase 3: Mock数据迁移（Day 5-6）

**目标**: 将硬编码数据迁移到Mock层

#### 任务清单

##### Day 5: 上午

- [ ] **3.1** 安装Mock依赖
  ```bash
  pnpm add axios-mock-adapter
  ```
- [ ] **3.2** 实现 `mock/adapter.ts`
  - Mock适配器初始化
  - 环境检测
  - 延迟配置
- [ ] **3.3** 迁移Profile.vue的数据
  - 创建 `mock/data/user.mock.ts`
  - 提取interviewHistory数据
  - 提取savedQuestionBanks数据
  - 提取wrongQuestions数据
  - 提取gameInterviewData数据

##### Day 5: 下午

- [ ] **3.4** 迁移Community.vue的数据
  - 创建 `mock/data/community.mock.ts`
  - 提取posts数据
  - 提取comments数据
  - 提取hotTopics数据
  - 提取courses数据
- [ ] **3.5** 实现Mock处理器
  - `mock/handlers/user.handler.ts`
  - `mock/handlers/community.handler.ts`
  - `mock/handlers/learning.handler.ts`
  - `mock/handlers/assessment.handler.ts`

##### Day 6: 上午

- [ ] **3.6** 注册Mock处理器
  - 更新 `mock/adapter.ts`
  - 测试各处理器
- [ ] **3.7** 创建 `mock/data/learning.mock.ts`
  - 课程数据
  - 学习进度数据
  - 徽章数据
- [ ] **3.8** 创建 `mock/data/assessment.mock.ts`
  - 测评题目
  - 测评结果

##### Day 6: 下午

- [ ] **3.9** 更新main.ts
  - 导入Mock适配器初始化
  - 条件性启用
- [ ] **3.10** 验证Mock模式
  - 启动开发服务器
  - 验证各页面数据正常
  - 检查Console日志
- [ ] **3.11** 编写Mock数据验证脚本
  - 自动化检查Mock覆盖率

**交付物**:

- ✅ 完整的Mock数据层
- ✅ Mock处理器
- ✅ 迁移后的Views（数据来源改为API）
- ✅ 验证报告

***

### 8.4 Phase 4: Store层重构（Day 7-8）

**目标**: 重构所有Store，使用API调用

#### 任务清单

##### Day 7: 上午

- [ ] **4.1** 创建 `stores/community.ts`
  - posts状态管理
  - 调用communityApi
  - 点赞/评论/关注操作
- [ ] **4.2** 创建 `stores/learning.ts`
  - 课程状态管理
  - 学习进度跟踪
  - 题库/错题/收藏管理
- [ ] **4.3** 创建 `stores/assessment.ts`
  - 测评状态管理
  - 结果计算（可复用assessment.ts工具）

##### Day 7: 下午

- [ ] **4.4** 重构 `views/Profile.vue`
  - 移除硬编码数据
  - 使用userStore/learningStore
  - 实现数据加载状态
  - 实现下拉刷新/上拉加载
- [ ] **4.5** 重构 `views/Community.vue`
  - 移除硬编码数据
  - 使用communityStore
  - 实现帖子流分页
  - 实现发布帖子功能

##### Day 8: 上午

- [ ] **4.6** 重构其他Views（按优先级）
  - `views/Growth.vue`
  - `views/Matching.vue`
  - `views/Knowledge.vue`
- [ ] **4.7** 实现全局Loading状态
  - `composables/useRequest.ts`
  - 请求中显示加载动画
  - 错误提示组件

##### Day 8: 下午

- [ ] **4.8** 性能优化
  - 请求去重
  - 数据缓存
  - 防抖/节流
- [ ] **4.9** 编写集成测试
  - Store单元测试
  - View组件测试
  - E2E测试场景

**交付物**:

- ✅ 重构后的所有Stores
- ✅ 重构后的主要Views
- ✅ 全局Loading/错误处理
- ✅ 测试套件

***

### 8.5 Phase 5: 优化与收尾（Day 9-10）

**目标**: 优化用户体验，完善文档

#### 任务清单

##### Day 9: 上午

- [ ] **5.1** 用户体验优化
  - 骨架屏（Skeleton）
  - 空状态占位符
  - 下拉刷新
  - 加载更多
- [ ] **5.2** 错误边界处理
  - 全局错误捕获
  - 友好的错误提示
  - 重试机制

##### Day 9: 下午

- [ ] **5.3** 性能监控
  - 接口耗时统计
  - 错误率监控
  - 性能指标收集
- [ ] **5.4** 安全加固
  - XSS防护
  - CSRF Token（如果需要）
  - 敏感数据脱敏日志

##### Day 10: 上午

- [ ] **5.5** 文档完善
  - API使用文档
  - Mock数据文档
  - 开发者指南
  - 故障排查手册
- [ ] **5.6** 代码质量
  - ESLint/Prettier检查
  - TypeScript严格模式
  - 代码复杂度分析

##### Day 10: 下午

- [ ] **5.7** 最终测试
  - 回归测试
  - 兼容性测试
  - 性能测试
- [ ] **5.8** 部署准备
  - 构建优化
  - 环境变量检查
  - 部署脚本

**交付物**:

- ✅ 生产就绪的代码
- ✅ 完整的技术文档
- ✅ 测试报告
- ✅ 部署指南

***

## 9. 代码示例与最佳实践

### 9.1 完整的API调用示例

```typescript
// 社区模块API调用示例
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { communityApi } from '@/api/modules/community.api'
import type { Post, Comment, PostCreate } from '@/api/types/community.types'

export const useCommunityStore = defineStore('community', () => {
  const posts = ref<Post[]>([])
  const currentPost = ref<Post | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref({
    page: 1,
    pageSize: 10,
    total: 0
  })

  // 计算属性
  const hasMore = computed(() => 
    posts.value.length < pagination.value.total
  )

  /**
   * 获取帖子流
   */
  async function fetchPosts(params?: { keyword?: string; page?: number }): Promise<void> {
    loading.value = true
    error.value = null

    try {
      const response = await communityApi.getPosts({
        skip: ((params?.page || 1) - 1) * pagination.value.pageSize,
        limit: pagination.value.pageSize,
        keyword: params?.keyword
      })

      // 注意：这里假设返回的是数组（Mock模式可能包装不同）
      posts.value = Array.isArray(response) ? response : response.data || []
      
      // 更新分页信息（如果后端返回了）
      if (response.total !== undefined) {
        pagination.value.total = response.total
      } else {
        pagination.value.total = posts.value.length
      }
    } catch (err: any) {
      error.value = err.message || '获取帖子失败'
      console.error('[Community] fetchPosts error:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * 创建帖子
   */
  async function createPost(data: PostCreate): Promise<boolean> {
    loading.value = true

    try {
      const newPost = await communityApi.createPost(data)
      posts.value.unshift(newPost)  // 添加到列表头部
      return true
    } catch (err: any) {
      error.value = err.message || '发布失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 点赞帖子
   */
  async function toggleLike(postId: number): Promise<boolean> {
    try {
      const result = await communityApi.toggleLike(postId)
      
      // 更新本地状态
      const post = posts.value.find(p => p.id === postId)
      if (post) {
        post.is_liked = !post.is_liked
        post.likes_count += post.is_liked ? 1 : -1
      }

      return result
    } catch (err) {
      console.error('[Community] toggleLike error:', err)
      return false
    }
  }

  /**
   * 加载更多
   */
  async function loadMore(): Promise<void> {
    if (!hasMore.value || loading.value) return

    pagination.value.page++
    await fetchPosts({ page: pagination.value.page })
  }

  return {
    posts,
    currentPost,
    loading,
    error,
    hasMore,
    fetchPosts,
    createPost,
    toggleLike,
    loadMore
  }
})
```

### 9.2 View层使用示例

```vue
<template>
  <div class="community-page">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-spinner">
      <span>加载中...</span>
    </div>

    <!-- 错误提示 -->
    <div v-else-if="error" class="error-message">
      {{ error }}
      <button @click="fetchPosts">重试</button>
    </div>

    <!-- 帖子列表 -->
    <div v-else class="posts-list">
      <article v-for="post in posts" :key="post.id" class="post-card">
        <h3>{{ post.title }}</h3>
        <p>{{ post.content }}</p>
        
        <div class="post-meta">
          <span>{{ post.author_name }}</span>
          <span>{{ formatTime(post.created_at) }}</span>
          
          <!-- 点赞按钮 -->
          <button 
            :class="{ liked: post.is_liked }"
            @click="handleToggleLike(post.id)"
          >
            ❤️ {{ post.likes_count }}
          </button>
        </div>
      </article>
    </div>

    <!-- 加载更多 -->
    <button 
      v-if="hasMore && !loading" 
      @click="loadMore"
      class="load-more-btn"
    >
      加载更多
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useCommunityStore } from '@/stores/community'
import { formatRelativeTime } from '@/utils/date'

const communityStore = useCommunityStore()

const { posts, loading, error, hasMore } = storeToRefs(communityStore)

onMounted(() => {
  communityStore.fetchPosts()
})

async function handleToggleLike(postId: number) {
  await communityStore.toggleLike(postId)
}

function formatTime(timeStr: string): string {
  return formatRelativeTime(new Date(timeStr))
}
</script>
```

### 9.3 最佳实践清单

#### ✅ DO - 推荐做法

1. **使用TypeScript类型**
   ```typescript
   // 好：明确类型
   async function fetchUser(id: number): Promise<UserInfo> { ... }

   // 差：使用any
   async function fetchUser(id: any): Promise<any> { ... }
   ```
2. **错误处理要完整**
   ```typescript
   try {
     const data = await api.call()
   } catch (error) {
     // 1. 记录错误
     console.error('[Module] action error:', error)
     
     // 2. 设置错误状态
     error.value = error.message
     
     // 3. 可以选择向上抛出或静默处理
     // throw error  或  return
   } finally {
     // 4. 重置loading状态
     loading.value = false
   }
   ```
3. **Loading状态管理**
   ```typescript
   // 在请求前设置
   loading.value = true

   // 在finally中重置
   finally { loading.value = false }
   ```
4. **使用composables复用逻辑**
   ```typescript
   // composable: useRequest.ts
   export function useRequest() {
     const loading = ref(false)
     const error = ref(null)
     
     async function execute<T>(fn: () => Promise<T>): Promise<T> {
       loading.value = true
       error.value = null
       try {
         return await fn()
       } catch (e) {
         error.value = e
         throw e
       } finally {
         loading.value = false
       }
     }
     
     return { loading, error, execute }
   }
   ```

#### ❌ DON'T - 避免的做法

1. **不要在View中直接调用axios**
   ```vue
   <!-- 差 -->
   <script setup>
   import axios from 'axios'

   onMounted(() => {
     axios.get('/api/posts')  // ❌ 不要这样做
   })
   </script>
   ```
2. **不要忽略错误**
   ```typescript
   // 差
   const data = await api.call()  // 可能抛异常

   // 好
   try {
     const data = await api.call()
   } catch (e) {
     handleError(e)
   }
   ```
3. **不要硬编码API路径**
   ```typescript
   // 差
   axios.get('/api/v1/community/posts')  // ❌ 硬编码

   // 好
   import { communityApi } from '@/api/modules/community.api'
   communityApi.getPosts()  // ✅ 封装好的方法
   ```
4. **不要在Store中进行大量数据处理**
   ```typescript
   // 差：Store中有复杂的业务逻辑
   async function calculateScore() {
     const data = await api.getData()
     let score = 0
     for (let i = 0; i < data.items.length; i++) {
       // ... 100行计算逻辑
     }
   }

   // 好：复杂逻辑抽取到utils或services
   import { calculateAssessmentScore } from '@/utils/assessment'
   const score = calculateAssessmentScore(data)
   ```

***

## 10. 迁移指南

### 10.1 从硬编码到API调用的迁移步骤

#### Step 1: 识别硬编码数据

在Views中搜索以下模式：

```typescript
// 硬编码数组
const xxxList = [ { ... }, { ... } ]

// 硬编码对象
const xxxData = { ... }

// setTimeout模拟异步
setTimeout(() => { ... }, 1000)
```

#### Step 2: 提取数据到Mock文件

将识别出的数据移动到对应的 `mock/data/*.mock.ts` 文件。

#### Step 3: 创建API服务方法

在 `api/modules/*.api.ts` 中创建对应的方法。

#### Step 4: 创建或重构Store

创建Pinia Store来管理状态和API调用。

#### Step 5: 更新View组件

替换硬编码数据为Store中的响应式数据。

### 10.2 迁移示例：Profile.vue

**Before（硬编码）**:

```typescript
// 第199行
const interviewHistory = [
  { id: 1, company: '字节跳动', ... },
  // ... 12条记录
]
```

**After（API调用）**:

```typescript
import { useUserStore } from '@/stores/user'
import { useLearningStore } from '@/stores/learning'

const userStore = useUserStore()
const learningStore = useLearningStore()

const interviewHistory = computed(() => userStore.interviewHistory)
const savedBanks = computed(() => learningStore.savedBanks)
const wrongQuestions = computed(() => learningStore.wrongQuestions)

onMounted(async () => {
  await Promise.all([
    userStore.fetchInterviewHistory(),
    learningStore.fetchCollections(),
    learningStore.fetchWrongQuestions()
  ])
})
```

### 10.3 迁移检查清单

- [ ] 所有硬编码数组已提取到Mock文件
- [ ] 所有setTimeout模拟已替换为真实API
- [ ] 所有Store都使用API调用
- [ ] 所有View都通过Store获取数据
- [ ] Loading状态正确显示
- [ ] 错误状态正确处理
- [ ] 空状态正确显示
- [ ] Mock模式下数据正常
- [ ] 关闭Mock后连接真实API正常

***

## 11. 测试策略

### 11.1 单元测试

#### 测试HTTP基础设施

```typescript
// tests/unit/http.test.ts
import { describe, it, expect } from 'vitest'
import http from '@/utils/http'

describe('HTTP Client', () => {
  it('should have correct baseURL', () => {
    expect(http.defaults.baseURL).toBe('/api/v1')
  })

  it('should have timeout configured', () => {
    expect(http.defaults.timeout).toBe(15000)
  })

  it('should set Content-Type header', () => {
    expect(http.defaults.headers['Content-Type']).toContain('application/json')
  })
})
```

#### 测试Token管理

```typescript
// tests/unit/auth.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { setToken, getToken, removeToken, isLoggedIn } from '@/utils/auth'

describe('Token Management', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should set and get token', () => {
    setToken('test-token')
    expect(getToken()).toBe('test-token')
  })

  it('should remove token', () => {
    setToken('test-token')
    removeToken()
    expect(getToken()).toBeNull()
  })

  it('should check logged in status', () => {
    expect(isLoggedIn()).toBe(false)
    setToken('token')
    expect(isLoggedIn()).toBe(true)
  })
})
```

### 11.2 集成测试

#### 测试Mock适配器

```typescript
// tests/integration/mock.test.ts
import { describe, it, expect } from 'vitest'
import { initMockAdapter } from '@/mock/adapter'
import axios from 'axios'
import { authApi } from '@/api/modules/auth.api'

describe('Mock Adapter', () => {
  beforeAll(() => {
    initMockAdapter(axios)
  })

  it('should return mock user data on login', async () => {
    const result = await authApi.login({
      email: 'test@example.com',
      password: 'password123'
    })

    expect(result).toHaveProperty('access_token')
    expect(result).toHaveProperty('user')
  })
})
```

### 11.3 E2E测试场景

```typescript
// tests/e2e/auth-flow.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('should login successfully', async ({ page }) => {
    await page.goto('/login')
    
    // 填写表单
    await page.fill('[data-testid="email"]', 'test@example.com')
    await page.fill('[data-testid="password"]', 'password123')
    
    // 点击登录
    await page.click('[data-testid="login-button"]')
    
    // 验证跳转到首页
    await expect(page).toHaveURL('/')
    
    // 验证显示用户名
    await expect(page.locator('[data-testid="user-name"]')).toHaveText('Test User')
  })

  test('should redirect to login when accessing protected route', async ({ page }) => {
    // 未登录状态下访问个人中心
    await page.goto('/profile')
    
    // 应该重定向到登录页
    await expect(page).toHaveURL('/login')
  })
})
```

***

## 12. 风险与缓解措施

### 12.1 技术风险

| 风险              | 概率 | 影响 | 缓解措施            |
| --------------- | -- | -- | --------------- |
| Axios版本兼容性问题    | 低  | 中  | 锁定版本号，充分测试      |
| Mock数据与真实API不一致 | 高  | 高  | 严格的类型约束，自动化对比测试 |
| Token过期处理不当     | 中  | 高  | 完善的错误处理和刷新机制    |
| 并发请求竞态条件        | 低  | 中  | 请求锁、防抖节流        |
| 大文件上传内存溢出       | 低  | 高  | 分片上传、进度监控       |

### 12.2 进度风险

| 风险     | 概率 | 影响 | 缓解措施        |
| ------ | -- | -- | ----------- |
| 估算不准确  | 中  | 中  | 预留20%缓冲时间   |
| 需求变更   | 中  | 高  | 模块化设计，降低耦合  |
| 技术难点卡住 | 低  | 高  | 提前调研，准备备选方案 |
| 团队成员变动 | 低  | 中  | 完善的文档和代码注释  |

### 12.3 应急预案

#### 场景1: Mock数据无法覆盖所有场景

**预案**:

- 临时混合使用：部分接口用Mock，部分用真实API
- 使用Mock.js动态生成随机数据
- 手动补充边界case

#### 场景2: 后端API不稳定

**预案**:

- 增加重试机制
- 降级到Mock模式
- 增加本地缓存层

#### 场景3: 性能不达标

**预案**:

- 虚拟滚动（长列表）
- 数据分页
- 图片懒加载
- CDN加速

***

## 附录A: 快速参考卡片

### A.1 常用命令

```bash
# 安装依赖
pnpm add axios axios-mock-adapter

# 开发模式（启用Mock）
pnpm dev  # 默认读取 .env.development

# 生产构建
pnpm build  # 读取 .env.production

# 运行测试
pnpm test

# 代码检查
pnpm lint
pnpm typecheck
```

### A.2 文件速查表

| 需求      | 文件位置                                    |
| ------- | --------------------------------------- |
| Axios配置 | `src/utils/http.ts`                     |
| 请求方法    | `src/utils/request.ts`                  |
| Token管理 | `src/utils/auth.ts`                     |
| 错误处理    | `src/utils/error.ts`                    |
| 认证API   | `src/api/modules/auth.api.ts`           |
| 用户API   | `src/api/modules/user.api.ts`           |
| 社区API   | `src/api/modules/community.api.ts`      |
| 类型定义    | `src/api/types/*.types.ts`              |
| Mock适配器 | `src/mock/adapter.ts`                   |
| Mock数据  | `src/mock/data/*.mock.ts`               |
| Mock处理器 | `src/mock/handlers/*.handler.ts`        |
| 用户Store | `src/stores/user.ts`                    |
| 社区Store | `src/stores/community.ts`               |
| 环境变量    | `.env.development/.production/.staging` |

### A.3 环境变量一览

```bash
# 应用配置
VITE_APP_TITLE=面面俱到
VITE_APP_VERSION=1.0.0

# API配置
VITE_API_BASE_URL=/api/v1  # 或完整URL
VITE_PROXY_TARGET=http://localhost:8081  # Vite代理目标

# Mock配置
VITE_USE_MOCK=true  # 是否启用Mock
VITE_MOCK_DELAY=300  # Mock延迟(ms)

# 其他
VITE_ENABLE_DEVTOOLS=true  # 开发工具
```

***

## 附录B: 相关资源

### B.1 参考项目

- [Vue Element Admin](https://github.com/PanJiaChen/vue-element-admin)
- [Ant Design Pro Vue](https://github.com/vueComponent/ant-design-vue-pro)
- [Vben Admin](https://github.com/vbenjs/vue-vben-admin)

### B.2 官方文档

- [Axios文档](https://axios-http.com/)
- [Pinia文档](https://pinia.vuejs.org/)
- [Vue Router文档](https://router.vuejs.org/)
- [Mock.js文档](http://mockjs.com/)
- [axios-mock-adapter](https://github.com/ctimmerm/axios-mock-adapter)

### B.3 推荐阅读

- 《Vue.js设计与实现》
- 《TypeScript编程》
- 《前端工程化：体系设计与实践》

***

## 结语

本文档提供了完整的前端API联调实施方案，涵盖了从基础设施建设到Mock数据迁移的全过程。按照此方案执行，可以在10-12个工作日内完成核心功能的联调工作。

**关键成功因素**:

1. ✅ 严格按照阶段推进，每个Phase结束进行验收
2. ✅ 保持Mock数据与真实API的一致性
3. ✅ 及时编写测试，确保重构不引入回归Bug
4. ✅ 保持代码质量和文档同步更新

如有疑问或需要调整方案，请及时沟通！

***

**文档版本历史**

| 版本   | 日期         | 作者           | 变更说明 |
| ---- | ---------- | ------------ | ---- |
| v1.0 | 2026-05-09 | AI Assistant | 初稿   |
| v1.1 | 2026-05-10 | AI Assistant | 更新实施进度，补充 Phase 1-4 完成状态和剩余工作 |

---

## 附录C: 实施进度追踪（v1.1 新增）

> 本章节追踪实际实施进度与原计划的偏差，以及剩余工作项。

### Phase 1-4 完成状态

| Phase | 原计划 | 实际状态 | 偏差说明 |
|-------|--------|----------|----------|
| Phase 1: 基础设施搭建 | Day 1-2 | ✅ 已完成 | 基本按计划执行，额外修复了 tsconfig paths 配置和类型导入路径错误 |
| Phase 2: 认证系统对接 | Day 3-4 | ✅ 已完成 | LoginRequest 字段从 email 改为 username（与后端对齐）；额外创建了 useErrorBoundary composable |
| Phase 3: Mock数据迁移 | Day 5-6 | ✅ 已完成 | 额外创建了 assessment.mock.ts 和 assessment.handler.ts（原计划未明确列出） |
| Phase 4: Store层重构 | Day 7-8 | ✅ 已完成 | 仅完成了 Profile.vue 和 Community.vue 的 View 层重构，其他 12 个页面未对接 Store |
| Phase 5: 优化与收尾 | Day 9-10 | ❌ 未开始 | — |

### 原计划 vs 实际交付对比

| 原计划交付项 | 实际交付 | 状态 |
|-------------|---------|------|
| 完整的HTTP基础设施 | `http.ts` + `request.ts` + `auth.ts` + `error.ts` + `storage.ts` | ✅ 完成 |
| 类型定义文件 | 7个 types 文件（含 index.ts） | ✅ 完成 |
| API服务层（8个模块） | 6个模块（auth/user/community/learning/assessment/job） | ⚠️ 缺少 notification 和 system 模块 |
| 认证系统对接 | User Store 重构 + 路由守卫 + LoginForm + useAuth | ✅ 完成 |
| Mock数据层 | 5个 mock data + 5个 handler + adapter | ⚠️ 缺少 job/notification/system 模块 |
| Store层重构（所有Store） | 5个 Store（user/community/learning/assessment/interview） | ⚠️ interview Store 无 API 调用 |
| View层重构（所有Views） | 仅 Profile.vue 和 Community.vue | ❌ 12个页面未对接 |
| 单元测试 | 未编写 | ❌ 未完成 |
| 集成测试 | 未编写 | ❌ 未完成 |

### 剩余工作清单（按优先级排序）

#### 🔴 P0: View层Store对接（核心阻塞项）

12个页面仍使用硬编码数据，需要对接 Store：

| 页面 | 硬编码数据量 | 需要的 Store | 优先级 | 说明 |
|------|------------|-------------|--------|------|
| Growth.vue | 大（stats/skills/growthData/radarData 等） | 需新建 growth Store | 🔴 高 | 数据量大，ECharts 已正确实现 |
| Matching.vue | 大（5个岗位匹配结果） | useAssessmentStore（已有） | 🔴 高 | Store 和 API 层已就绪，仅需对接 |
| Interview.vue | 大（题库/评分/详情） | useInterviewStore（需完善） | 🔴 高 | Store 存在但无 API 调用 |
| GameInterview.vue | 大（5关卡/统计/排行） | useInterviewStore（需完善） | 🟡 中 | 与 Interview 共用 Store |
| Knowledge.vue | 中（岗位分类/题库） | 需新建 knowledge Store | 🟡 中 | 静态导航数据 |
| Practice.vue | 中（题库数据） | 需新建 practice Store | 🟡 中 | 题库数据 |
| LevelChallenge.vue | 中（5关卡/面试问题） | useInterviewStore（需完善） | 🟡 中 | 摄像头验证已实现 |
| LevelDetail.vue | 小（关卡详情） | useInterviewStore（需完善） | 🟢 低 | — |
| JobSpecificQuestionBank.vue | 小（模拟题目） | 需新建或复用 Store | 🟢 低 | — |
| PathPractice.vue | 小（路径详情） | 需新建或复用 Store | 🟢 低 | — |
| Report.vue | 小（报告数据） | 需新建或复用 Store | 🟢 低 | — |
| Home.vue | 中（功能/服务/新闻/评价/FAQ） | 需新建 home Store | 🟢 低 | 展示型页面 |

#### 🟡 P1: 缺失模块补充

| 缺失项 | 说明 | 优先级 |
|--------|------|--------|
| `api/modules/notification.api.ts` | 后端有 `/notifications` 端点，前端未创建 API 模块 | 🟡 中 |
| `api/modules/system.api.ts` | 后端有 `/system` 端点，前端未创建 API 模块 | 🟢 低 |
| `mock/data/job.mock.ts` + `mock/handlers/job.handler.ts` | API 层有 job 模块但 Mock 层缺失 | 🟡 中 |
| `stores/interview.ts` API 调用层 | Store 仅含本地状态管理，无 API 调用 | 🔴 高 |
| `src/config/` 目录 | 规约要求存在，当前缺失 | 🟢 低 |

#### 🟢 P2: 质量保障

| 待办项 | 说明 | 优先级 |
|--------|------|--------|
| 单元测试 | HTTP/Token/Error/Storage 工具函数测试 | 🟡 中 |
| 集成测试 | Mock 适配器 + Store + API 集成测试 | 🟡 中 |
| E2E 测试 | 登录/注册/核心流程端到端测试 | 🟢 低 |
| Token 刷新机制 | 后端目前未提供 refresh 端点 | 🟢 低 |
| 多标签页登录状态同步 | 监听 storage 事件 | 🟢 低 |
| Vite 构建产物代码分割优化 | 当前单 chunk 超 2MB（已有 manualChunks 但需优化） | 🟡 中 |
| axios-mock-adapter 生产打包 | 生产构建时不应打包 mock-adapter | 🟢 低 |

### 建议的下一阶段实施路径

#### Phase 4.5: 核心 View 对接（预计 4-5 天）

1. **Day 1**: 完善 `interview.ts` Store（添加 API 调用），对接 Interview.vue
2. **Day 2**: 对接 Matching.vue（使用已有 assessmentStore），对接 Growth.vue（新建 growth Store）
3. **Day 3**: 对接 GameInterview.vue + LevelChallenge.vue（使用 interviewStore）
4. **Day 4**: 对接 Knowledge.vue + Practice.vue（新建 knowledge/practice Store）
5. **Day 5**: 对接剩余页面（Home/Report/PathPractice 等）

#### Phase 5: 优化与收尾（预计 2-3 天）

按原计划 Phase 5 执行，补充测试和文档。

