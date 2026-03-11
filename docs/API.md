# API接口文档

## 接口基础信息

### 基础URL

```
http://localhost:3000/api
```

### 请求方法

- GET：获取资源
- POST：创建资源
- PUT：更新资源
- DELETE：删除资源

### 响应格式

所有API响应均采用JSON格式，包含以下字段：

```json
{
  "code": 200,              // 状态码
  "message": "success",     // 状态消息
  "data": {}                // 响应数据
}
```

### 状态码说明

| 状态码 | 描述 |
|-------|------|
| 200 | 请求成功 |
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

## 认证接口

### 1. 用户注册

**接口路径**：`/auth/register`

**请求方法**：POST

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| username | string | 是 | 用户名 |
| email | string | 是 | 邮箱地址 |
| password | string | 是 | 密码 |
| phone | string | 否 | 手机号 |

**响应示例**：

```json
{
  "code": 200,
  "message": "注册成功",
  "data": {
    "userId": "123456",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. 用户登录

**接口路径**：`/auth/login`

**请求方法**：POST

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| email | string | 是 | 邮箱地址 |
| password | string | 是 | 密码 |

**响应示例**：

```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "userId": "123456",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userInfo": {
      "username": "张三",
      "email": "zhangsan@example.com",
      "avatar": "https://example.com/avatar.jpg"
    }
  }
}
```

### 3. 刷新Token

**接口路径**：`/auth/refresh`

**请求方法**：POST

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| token | string | 是 | 旧的token |

**响应示例**：

```json
{
  "code": 200,
  "message": "刷新成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## 用户接口

### 1. 获取用户信息

**接口路径**：`/user/info`

**请求方法**：GET

**请求头**：

| 头部名称 | 值 | 描述 |
|---------|-----|------|
| Authorization | Bearer {token} | 认证令牌 |

**响应示例**：

```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "userId": "123456",
    "username": "张三",
    "email": "zhangsan@example.com",
    "phone": "13800138000",
    "avatar": "https://example.com/avatar.jpg",
    "bio": "Java开发者",
    "skills": ["Java", "Spring Boot", "MySQL"]
  }
}
```

### 2. 更新用户信息

**接口路径**：`/user/update`

**请求方法**：PUT

**请求头**：

| 头部名称 | 值 | 描述 |
|---------|-----|------|
| Authorization | Bearer {token} | 认证令牌 |

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| username | string | 否 | 用户名 |
| phone | string | 否 | 手机号 |
| bio | string | 否 | 个人简介 |
| skills | array | 否 | 技能列表 |

**响应示例**：

```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "userId": "123456",
    "username": "张三",
    "email": "zhangsan@example.com",
    "phone": "13800138000",
    "bio": "Java高级开发者",
    "skills": ["Java", "Spring Boot", "MySQL", "Redis"]
  }
}
```

### 3. 上传头像

**接口路径**：`/user/avatar`

**请求方法**：POST

**请求头**：

| 头部名称 | 值 | 描述 |
|---------|-----|------|
| Authorization | Bearer {token} | 认证令牌 |
| Content-Type | multipart/form-data | 表单数据 |

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| avatar | file | 是 | 头像文件 |

**响应示例**：

```json
{
  "code": 200,
  "message": "上传成功",
  "data": {
    "avatar": "https://example.com/avatar.jpg"
  }
}
```

## 面试接口

### 1. 创建面试

**接口路径**：`/interview/create`

**请求方法**：POST

**请求头**：

| 头部名称 | 值 | 描述 |
|---------|-----|------|
| Authorization | Bearer {token} | 认证令牌 |

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| position | string | 是 | 岗位类型 |
| difficulty | string | 是 | 难度级别 |
| mode | string | 是 | 面试模式 |
| duration | number | 否 | 面试时长（分钟） |

**响应示例**：

```json
{
  "code": 200,
  "message": "创建成功",
  "data": {
    "interviewId": "789012",
    "startTime": "2024-05-01T10:00:00Z",
    "questions": [
      {
        "id": "q1",
        "content": "请介绍一下你自己"
      },
      {
        "id": "q2",
        "content": "你为什么选择我们公司"
      }
    ]
  }
}
```

### 2. 获取面试问题

**接口路径**：`/interview/questions/{interviewId}`

**请求方法**：GET

**请求头**：

| 头部名称 | 值 | 描述 |
|---------|-----|------|
| Authorization | Bearer {token} | 认证令牌 |

**响应示例**：

```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "interviewId": "789012",
    "questions": [
      {
        "id": "q1",
        "content": "请介绍一下你自己",
        "type": "self_introduction"
      },
      {
        "id": "q2",
        "content": "你为什么选择我们公司",
        "type": "company_knowledge"
      },
      {
        "id": "q3",
        "content": "请解释一下Java中的多线程",
        "type": "technical"
      }
    ]
  }
}
```

### 3. 提交面试回答

**接口路径**：`/interview/answer`

**请求方法**：POST

**请求头**：

| 头部名称 | 值 | 描述 |
|---------|-----|------|
| Authorization | Bearer {token} | 认证令牌 |

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| interviewId | string | 是 | 面试ID |
| questionId | string | 是 | 问题ID |
| answer | string | 是 | 回答内容 |
| audioUrl | string | 否 | 音频回答URL |
| videoUrl | string | 否 | 视频回答URL |

**响应示例**：

```json
{
  "code": 200,
  "message": "提交成功",
  "data": {
    "feedback": {
      "score": 85,
      "comments": "回答逻辑清晰，内容全面",
      "suggestions": "可以更具体地举例说明"
    }
  }
}
```

### 4. 获取面试报告

**接口路径**：`/interview/report/{interviewId}`

**请求方法**：GET

**请求头**：

| 头部名称 | 值 | 描述 |
|---------|-----|------|
| Authorization | Bearer {token} | 认证令牌 |

**响应示例**：

```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "interviewId": "789012",
    "position": "Java开发",
    "difficulty": "中级",
    "score": 88,
    "radarChart": {
      "technical": 90,
      "communication": 85,
      "logic": 80,
      "problemSolving": 95
    },
    "answers": [
      {
        "questionId": "q1",
        "question": "请介绍一下你自己",
        "answer": "我是张三，毕业于XX大学计算机专业...",
        "score": 90,
        "comments": "自我介绍清晰，重点突出"
      }
    ],
    "suggestions": "建议加强技术深度，提高问题分析能力"
  }
}
```

### 5. 获取面试历史

**接口路径**：`/interview/history`

**请求方法**：GET

**请求头**：

| 头部名称 | 值 | 描述 |
|---------|-----|------|
| Authorization | Bearer {token} | 认证令牌 |

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| page | number | 否 | 页码，默认1 |
| limit | number | 否 | 每页数量，默认10 |

**响应示例**：

```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "interviews": [
      {
        "interviewId": "789012",
        "position": "Java开发",
        "difficulty": "中级",
        "score": 88,
        "date": "2024-05-01T10:00:00Z",
        "duration": 30
      }
    ]
  }
}
```

## 岗位匹配接口

### 1. 职业测评

**接口路径**：`/matching/assessment`

**请求方法**：POST

**请求头**：

| 头部名称 | 值 | 描述 |
|---------|-----|------|
| Authorization | Bearer {token} | 认证令牌 |

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| type | string | 是 | 测评类型（MBTI或Holland） |
| answers | array | 是 | 测评答案 |

**响应示例**：

```json
{
  "code": 200,
  "message": "测评成功",
  "data": {
    "assessmentId": "345678",
    "type": "MBTI",
    "result": "INTJ",
    "description": "INTJ是建筑师型人格，具有创新思维和战略眼光...",
    "suggestedCareers": ["软件工程师", "数据分析师", "系统架构师"]
  }
}
```

### 2. 岗位匹配分析

**接口路径**：`/matching/analyze`

**请求方法**：POST

**请求头**：

| 头部名称 | 值 | 描述 |
|---------|-----|------|
| Authorization | Bearer {token} | 认证令牌 |

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| position | string | 是 | 岗位名称 |
| skills | array | 否 | 技能列表 |
| experience | number | 否 | 工作经验（年） |

**响应示例**：

```json
{
  "code": 200,
  "message": "分析成功",
  "data": {
    "position": "前端开发工程师",
    "matchScore": 85,
    "requirements": {
      "skills": ["HTML5", "CSS3", "JavaScript", "React"],
      "education": "本科及以上",
      "experience": "1-3年"
    },
    "yourSkills": ["HTML5", "CSS3", "JavaScript", "Vue"],
    "gaps": ["React"],
    "suggestions": "建议学习React框架，提升前端开发技能"
  }
}
```

## 能力提升接口

### 1. 知识缺口诊断

**接口路径**：`/growth/diagnosis`

**请求方法**：POST

**请求头**：

| 头部名称 | 值 | 描述 |
|---------|-----|------|
| Authorization | Bearer {token} | 认证令牌 |

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| domain | string | 是 | 技术领域 |
| answers | array | 是 | 测试答案 |

**响应示例**：

```json
{
  "code": 200,
  "message": "诊断成功",
  "data": {
    "diagnosisId": "567890",
    "domain": "前端开发",
    "score": 75,
    "gaps": [
      {
        "topic": "React",
        "mastery": 40,
        "suggestions": "学习React组件生命周期和hooks"
      },
      {
        "topic": "TypeScript",
        "mastery": 30,
        "suggestions": "掌握TypeScript基础语法和类型系统"
      }
    ]
  }
}
```

### 2. 获取学习路径

**接口路径**：`/growth/path`

**请求方法**：GET

**请求头**：

| 头部名称 | 值 | 描述 |
|---------|-----|------|
| Authorization | Bearer {token} | 认证令牌 |

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| domain | string | 是 | 技术领域 |
| level | string | 否 | 级别（beginner, intermediate, advanced） |

**响应示例**：

```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "pathId": "678901",
    "domain": "前端开发",
    "level": "intermediate",
    "modules": [
      {
        "id": "m1",
        "title": "React基础",
        "duration": "10小时",
        "topics": ["组件基础", "props和state", "生命周期"],
        "resources": [
          {
            "type": "video",
            "title": "React入门教程",
            "url": "https://example.com/video1"
          }
        ]
      }
    ]
  }
}
```

### 3. 学习进度更新

**接口路径**：`/growth/progress`

**请求方法**：PUT

**请求头**：

| 头部名称 | 值 | 描述 |
|---------|-----|------|
| Authorization | Bearer {token} | 认证令牌 |

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| moduleId | string | 是 | 模块ID |
| progress | number | 是 | 进度（0-100） |
| completed | boolean | 否 | 是否完成 |

**响应示例**：

```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "moduleId": "m1",
    "progress": 75,
    "completed": false,
    "totalProgress": 30
  }
}
```

## 社区接口

### 1. 获取帖子列表

**接口路径**：`/community/posts`

**请求方法**：GET

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| page | number | 否 | 页码，默认1 |
| limit | number | 否 | 每页数量，默认10 |
| category | string | 否 | 分类 |
| keyword | string | 否 | 关键词 |

**响应示例**：

```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "posts": [
      {
        "postId": "890123",
        "title": "如何准备前端面试",
        "content": "分享一下我的前端面试准备经验...",
        "author": "李四",
        "category": "经验分享",
        "likes": 50,
        "comments": 20,
        "date": "2024-04-20T10:00:00Z"
      }
    ]
  }
}
```

### 2. 发布帖子

**接口路径**：`/community/posts`

**请求方法**：POST

**请求头**：

| 头部名称 | 值 | 描述 |
|---------|-----|------|
| Authorization | Bearer {token} | 认证令牌 |

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| title | string | 是 | 帖子标题 |
| content | string | 是 | 帖子内容 |
| category | string | 是 | 分类 |
| tags | array | 否 | 标签 |

**响应示例**：

```json
{
  "code": 200,
  "message": "发布成功",
  "data": {
    "postId": "890123",
    "title": "如何准备前端面试",
    "content": "分享一下我的前端面试准备经验...",
    "author": "李四",
    "category": "经验分享",
    "date": "2024-04-20T10:00:00Z"
  }
}
```

### 3. 获取帖子详情

**接口路径**：`/community/posts/{postId}`

**请求方法**：GET

**响应示例**：

```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "postId": "890123",
    "title": "如何准备前端面试",
    "content": "分享一下我的前端面试准备经验...",
    "author": "李四",
    "authorAvatar": "https://example.com/avatar.jpg",
    "category": "经验分享",
    "tags": ["前端", "面试", "准备"],
    "likes": 50,
    "comments": 20,
    "date": "2024-04-20T10:00:00Z",
    "commentList": [
      {
        "commentId": "c1",
        "content": "非常有用的分享",
        "author": "王五",
        "date": "2024-04-21T10:00:00Z"
      }
    ]
  }
}
```

### 4. 评论帖子

**接口路径**：`/community/comments`

**请求方法**：POST

**请求头**：

| 头部名称 | 值 | 描述 |
|---------|-----|------|
| Authorization | Bearer {token} | 认证令牌 |

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| postId | string | 是 | 帖子ID |
| content | string | 是 | 评论内容 |
| parentId | string | 否 | 父评论ID |

**响应示例**：

```json
{
  "code": 200,
  "message": "评论成功",
  "data": {
    "commentId": "c2",
    "content": "谢谢分享",
    "author": "赵六",
    "date": "2024-04-22T10:00:00Z"
  }
}
```

## 知识库接口

### 1. 获取知识分类

**接口路径**：`/knowledge/categories`

**请求方法**：GET

**响应示例**：

```json
{
  "code": 200,
  "message": "获取成功",
  "data": [
    {
      "id": "cat1",
      "name": "面试技巧",
      "count": 50
    },
    {
      "id": "cat2",
      "name": "技术知识",
      "count": 100
    },
    {
      "id": "cat3",
      "name": "行业动态",
      "count": 30
    }
  ]
}
```

### 2. 获取知识列表

**接口路径**：`/knowledge/articles`

**请求方法**：GET

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| page | number | 否 | 页码，默认1 |
| limit | number | 否 | 每页数量，默认10 |
| category | string | 否 | 分类ID |
| keyword | string | 否 | 关键词 |

**响应示例**：

```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "articles": [
      {
        "id": "art1",
        "title": "前端面试常见问题汇总",
        "summary": "总结了前端面试中常见的问题和答案...",
        "category": "面试技巧",
        "author": "技术专家",
        "views": 1000,
        "date": "2024-04-15T10:00:00Z"
      }
    ]
  }
}
```

### 3. 获取知识详情

**接口路径**：`/knowledge/articles/{articleId}`

**请求方法**：GET

**响应示例**：

```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "id": "art1",
    "title": "前端面试常见问题汇总",
    "content": "# 前端面试常见问题汇总\n\n## 1. HTML/CSS部分...",
    "category": "面试技巧",
    "author": "技术专家",
    "views": 1000,
    "likes": 50,
    "date": "2024-04-15T10:00:00Z",
    "tags": ["前端", "面试", "HTML", "CSS"]
  }
}
```

## 错误处理

当API请求失败时，响应会包含错误信息：

```json
{
  "code": 400,
  "message": "请求参数错误",
  "data": null,
  "error": "邮箱格式不正确"
}
```

## 注意事项

1. 所有需要认证的接口都需要在请求头中携带有效的Authorization令牌
2. 上传文件时请使用multipart/form-data格式
3. 接口返回的token需要在后续请求中使用，请妥善保存
4. 对于分页接口，建议使用page和limit参数控制返回数据量
5. 接口调用频率限制为每分钟60次，超过限制会返回429错误