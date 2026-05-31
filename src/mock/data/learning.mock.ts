import type { Course, Collection, WrongQuestion, Badge, UserBadge } from '@/api/types/learning.types'

export const mockCourses: Course[] = [
  {
    id: 1,
    title: '逻辑思维提升',
    description: '通过系统训练提升逻辑思维能力，掌握结构化思考方法，提高面试中的问题分析和解决能力。',
    category: '逻辑思维',
    difficulty: 'easy',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-05-09T00:00:00Z'
  },
  {
    id: 2,
    title: '表达结构优化',
    description: '学习STAR法则等表达技巧，掌握清晰、有条理的表达方法，提高面试中的沟通效果。',
    category: '表达结构',
    difficulty: 'medium',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-05-09T00:00:00Z'
  },
  {
    id: 3,
    title: '专业深度强化',
    description: '深入探讨技术领域的核心概念和前沿趋势，提升专业知识深度，应对技术面试中的 challenging questions。',
    category: '专业深度',
    difficulty: 'hard',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-05-09T00:00:00Z'
  },
  {
    id: 4,
    title: '面试技巧全攻略',
    description: '全面覆盖面试各个环节的技巧，包括简历准备、自我介绍、行为问题回答、薪资谈判等。',
    category: '面试技巧',
    difficulty: 'easy',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-05-09T00:00:00Z'
  }
]

export const mockCollections: Collection[] = [
  {
    id: 1,
    title: '高频算法 50 题',
    description: '涵盖面试中常见的算法题，包括排序、查找、动态规划等',
    question_count: 24,
    category: '算法',
    difficulty: 'medium',
    saved_at: '2026-03-20',
    last_practiced: '2026-03-25'
  },
  {
    id: 2,
    title: '前端框架高频题',
    description: 'Vue、React、Angular 等前端框架的常见面试题',
    question_count: 32,
    category: '前端',
    difficulty: 'medium',
    saved_at: '2026-03-15',
    last_practiced: '2026-03-22'
  },
  {
    id: 3,
    title: '系统设计基础',
    description: '分布式系统、微服务、缓存等系统设计相关问题',
    question_count: 18,
    category: '后端',
    difficulty: 'hard',
    saved_at: '2026-03-10',
    last_practiced: '2026-03-18'
  }
]

export const mockWrongQuestions: WrongQuestion[] = [
  {
    id: 1,
    question: '在 Vue3 中，如何实现组件间的通信？',
    user_answer: '使用 props 和 events',
    correct_answer: '使用 props、events、provide/inject、pinia 等多种方式',
    explanation:
      'Vue3 提供了多种组件间通信方式，包括传统的 props 和 events，以及 provide/inject API，还有状态管理库如 pinia',
    category: '前端',
    difficulty: 'medium',
    mistake_count: 2,
    last_mistake_at: '2026-03-24',
    status: 'unreviewed'
  },
  {
    id: 2,
    question: '什么是闭包？',
    user_answer: '闭包是一个函数',
    correct_answer: '闭包是指有权访问另一个函数作用域中变量的函数',
    explanation:
      '闭包的核心特点是能够访问其词法作用域之外的变量，即使创建它的函数已经执行完毕',
    category: 'JavaScript',
    difficulty: 'medium',
    mistake_count: 1,
    last_mistake_at: '2026-03-20',
    status: 'reviewed'
  },
  {
    id: 3,
    question: '如何优化 React 应用的性能？',
    user_answer: '使用 memo 和 useCallback',
    correct_answer: '使用 memo、useCallback、useMemo、虚拟列表、代码分割等多种方式',
    explanation:
      'React 性能优化是一个综合工程，需要从多个方面入手，包括组件渲染优化、状态管理优化、资源加载优化等',
    category: '前端',
    difficulty: 'hard',
    mistake_count: 3,
    last_mistake_at: '2026-03-18',
    status: 'unreviewed'
  },
  {
    id: 4,
    question: '什么是事件冒泡和事件捕获？',
    user_answer: '事件冒泡是从子元素向父元素传播，事件捕获是从父元素向子元素传播',
    correct_answer:
      '事件冒泡是从触发事件的元素开始，向上传播到根元素；事件捕获是从根元素开始，向下传播到触发事件的元素',
    explanation: 'DOM 事件流包括三个阶段：事件捕获阶段、目标阶段和事件冒泡阶段',
    category: 'JavaScript',
    difficulty: 'easy',
    mistake_count: 1,
    last_mistake_at: '2026-03-15',
    status: 'reviewed'
  },
  {
    id: 5,
    question: '如何实现一个深度克隆函数？',
    user_answer: '使用 JSON.parse(JSON.stringify(obj))',
    correct_answer:
      'JSON 方法有局限性，对于函数、Symbol、循环引用等无法正确处理，需要使用递归实现',
    explanation:
      'JSON 序列化方法无法处理函数、Symbol、undefined、循环引用等情况，需要使用递归并处理这些特殊情况',
    category: 'JavaScript',
    difficulty: 'medium',
    mistake_count: 2,
    last_mistake_at: '2026-03-12',
    status: 'unreviewed'
  }
]

export const mockBadges: Badge[] = [
  {
    id: 1,
    name: '初次尝试',
    description: '完成第一次游戏式面试',
    icon_url: 'sparkles',
    created_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: '连续打卡',
    description: '连续10天进行面试练习',
    icon_url: 'calendar',
    created_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 3,
    name: '正确率达人',
    description: '单次关卡正确率达到90%以上',
    icon_url: 'check-circle',
    created_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 4,
    name: '挑战大师',
    description: '完成所有困难级别关卡',
    icon_url: 'trophy',
    created_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 5,
    name: '知识渊博',
    description: '完成所有技能类别的题目',
    icon_url: 'book-open',
    created_at: '2026-01-01T00:00:00Z'
  }
]

export const mockUserBadges: UserBadge[] = [
  { id: 1, badge_id: 1, badge: mockBadges[0], awarded_at: '2026-03-01T00:00:00Z' },
  { id: 2, badge_id: 2, badge: mockBadges[1], awarded_at: '2026-03-12T00:00:00Z' },
  { id: 3, badge_id: 3, badge: mockBadges[2], awarded_at: '2026-03-18T00:00:00Z' }
]
