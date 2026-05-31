import type { UserResponse, UserProfileResponse, RoleResponse } from '@/api/types/user.types'

export const mockUser: UserResponse = {
  id: 1,
  username: '王同学',
  email: 'wang@example.com',
  phone: '138****8000',
  is_active: true,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-05-09T00:00:00Z',
  roles: [
    {
      id: 1,
      name: 'user',
      description: '普通用户',
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z',
      permissions: []
    }
  ] as RoleResponse[],
  profile: {
    id: 1,
    user_id: 1,
    avatar_url: '',
    education: '北京大学计算机科学与技术专业',
    target_position: '前端开发工程师',
    work_years: 2,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-05-09T00:00:00Z'
  } as UserProfileResponse
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
  {
    id: 2,
    date: '2026-02-28',
    company: '阿里巴巴',
    position: 'Java 开发工程师',
    round: '一面',
    type: '技术面',
    score: 82,
    status: 'passed',
    tags: ['Java', 'Spring Boot', '数据库'],
    feedback: '后端知识体系完整，项目经验丰富',
    details: {
      technical: 85,
      communication: 78,
      logic: 88,
      problem_solving: 82
    }
  },
  {
    id: 3,
    date: '2025-11-15',
    company: '腾讯',
    position: 'UI 设计师',
    round: '三面',
    type: '设计面',
    score: 91,
    status: 'passed',
    tags: ['UI/UX', 'Figma', '交互设计'],
    feedback: '设计理念新颖，作品集质量高',
    details: {
      technical: 92,
      communication: 90,
      logic: 85,
      problem_solving: 88
    }
  },
  {
    id: 4,
    date: '2025-10-20',
    company: '美团',
    position: '产品经理',
    round: '一面',
    type: '产品面',
    score: 78,
    status: 'failed',
    tags: ['产品设计', '用户研究', '数据分析'],
    feedback: '产品思维清晰，但行业理解深度不足',
    details: {
      technical: 75,
      communication: 82,
      logic: 78,
      problem_solving: 75
    }
  },
  {
    id: 5,
    date: '2025-09-10',
    company: '百度',
    position: '数据分析师',
    round: '二面',
    type: '技术面',
    score: 85,
    status: 'passed',
    tags: ['数据分析', 'SQL', 'Python'],
    feedback: '数据处理能力强，分析思路清晰',
    details: {
      technical: 88,
      communication: 82,
      logic: 90,
      problem_solving: 85
    }
  },
  {
    id: 6,
    date: '2025-08-05',
    company: '京东',
    position: '后端开发工程师',
    round: '一面',
    type: '技术面',
    score: 80,
    status: 'passed',
    tags: ['Java', '微服务', '分布式'],
    feedback: '后端技术掌握全面，编码能力强',
    details: {
      technical: 82,
      communication: 78,
      logic: 85,
      problem_solving: 80
    }
  },
  {
    id: 7,
    date: '2025-06-20',
    company: '拼多多',
    position: '前端开发工程师',
    round: '三面',
    type: '技术面',
    score: 92,
    status: 'passed',
    tags: ['React', 'Node.js', '性能优化'],
    feedback: '前端技术栈全面，性能优化经验丰富',
    details: {
      technical: 95,
      communication: 90,
      logic: 92,
      problem_solving: 90
    }
  },
  {
    id: 8,
    date: '2025-05-15',
    company: '小米',
    position: '测试工程师',
    round: '一面',
    type: '技术面',
    score: 76,
    status: 'failed',
    tags: ['测试', '自动化', '质量保证'],
    feedback: '测试基础扎实，但自动化测试经验不足',
    details: {
      technical: 78,
      communication: 75,
      logic: 72,
      problem_solving: 76
    }
  },
  {
    id: 9,
    date: '2025-04-10',
    company: '网易',
    position: '前端开发工程师',
    round: '二面',
    type: '技术面',
    score: 86,
    status: 'passed',
    tags: ['Vue3', 'Webpack', '响应式设计'],
    feedback: '前端技术能力强，项目经验丰富',
    details: {
      technical: 88,
      communication: 85,
      logic: 86,
      problem_solving: 84
    }
  },
  {
    id: 10,
    date: '2025-03-05',
    company: '新浪',
    position: '后端开发工程师',
    round: '一面',
    type: '技术面',
    score: 79,
    status: 'passed',
    tags: ['Java', 'Spring Cloud', '缓存'],
    feedback: '后端技术掌握良好，有一定项目经验',
    details: {
      technical: 82,
      communication: 75,
      logic: 80,
      problem_solving: 78
    }
  },
  {
    id: 11,
    date: '2024-12-20',
    company: '搜狐',
    position: '前端开发工程师',
    round: '一面',
    type: '技术面',
    score: 83,
    status: 'passed',
    tags: ['JavaScript', 'HTML/CSS', '浏览器原理'],
    feedback: '前端基础扎实，学习能力强',
    details: {
      technical: 85,
      communication: 80,
      logic: 82,
      problem_solving: 83
    }
  },
  {
    id: 12,
    date: '2024-11-10',
    company: '优酷',
    position: '产品经理',
    round: '二面',
    type: '产品面',
    score: 81,
    status: 'failed',
    tags: ['产品规划', '用户体验', '市场分析'],
    feedback: '产品思路清晰，但缺乏创新点',
    details: {
      technical: 78,
      communication: 85,
      logic: 80,
      problem_solving: 79
    }
  }
]

export const mockAbilityData: Record<string, {
  current: number[]
  required: number[]
  indicators: { name: string; max: number }[]
  gapSkills: { name: string; gap: number; level: string }[]
  strengths: { name: string; score: number }[]
}> = {
  '前端开发工程师': {
    current: [85, 78, 92, 70, 88, 75, 82],
    required: [90, 85, 80, 90, 85, 95, 90],
    indicators: [
      { name: '技术深度', max: 100 },
      { name: '逻辑思维', max: 100 },
      { name: '表达能力', max: 100 },
      { name: '项目经验', max: 100 },
      { name: '学习潜力', max: 100 },
      { name: '工程化能力', max: 100 },
      { name: '团队协作', max: 100 }
    ],
    gapSkills: [
      { name: 'Vue3 源码深度', gap: 15, level: 'high' },
      { name: '工程化架构能力', gap: 20, level: 'high' },
      { name: '项目经验', gap: 20, level: 'high' },
      { name: '团队协作', gap: 8, level: 'medium' }
    ],
    strengths: [
      { name: '表达能力', score: 92 },
      { name: '学习潜力', score: 88 },
      { name: '技术深度', score: 85 }
    ]
  },
  'Java 开发工程师': {
    current: [70, 85, 75, 65, 80, 60, 75],
    required: [90, 85, 80, 90, 85, 85, 85],
    indicators: [
      { name: '技术深度', max: 100 },
      { name: '逻辑思维', max: 100 },
      { name: '表达能力', max: 100 },
      { name: '项目经验', max: 100 },
      { name: '学习潜力', max: 100 },
      { name: '系统设计', max: 100 },
      { name: '团队协作', max: 100 }
    ],
    gapSkills: [
      { name: '系统设计', gap: 25, level: 'high' },
      { name: '技术深度', gap: 20, level: 'high' },
      { name: '项目经验', gap: 25, level: 'high' },
      { name: '工程化能力', gap: 15, level: 'medium' }
    ],
    strengths: [
      { name: '逻辑思维', score: 85 },
      { name: '学习潜力', score: 80 },
      { name: '团队协作', score: 75 }
    ]
  },
  '产品经理': {
    current: [65, 80, 90, 75, 85, 82, 95],
    required: [70, 85, 90, 85, 85, 90, 90],
    indicators: [
      { name: '业务理解', max: 100 },
      { name: '逻辑思维', max: 100 },
      { name: '表达能力', max: 100 },
      { name: '项目经验', max: 100 },
      { name: '学习潜力', max: 100 },
      { name: '用户研究', max: 100 },
      { name: '团队协作', max: 100 }
    ],
    gapSkills: [
      { name: '用户研究', gap: 8, level: 'medium' },
      { name: '项目经验', gap: 10, level: 'medium' },
      { name: '业务理解', gap: 5, level: 'low' }
    ],
    strengths: [
      { name: '团队协作', score: 95 },
      { name: '表达能力', score: 90 },
      { name: '学习潜力', score: 85 }
    ]
  },
  'UI 设计师': {
    current: [80, 75, 85, 70, 90, 88, 82],
    required: [90, 85, 85, 85, 85, 95, 85],
    indicators: [
      { name: '设计能力', max: 100 },
      { name: '创意思维', max: 100 },
      { name: '表达能力', max: 100 },
      { name: '项目经验', max: 100 },
      { name: '学习潜力', max: 100 },
      { name: '工具熟练度', max: 100 },
      { name: '团队协作', max: 100 }
    ],
    gapSkills: [
      { name: '工具熟练度', gap: 7, level: 'medium' },
      { name: '项目经验', gap: 15, level: 'high' },
      { name: '创意思维', gap: 10, level: 'medium' }
    ],
    strengths: [
      { name: '学习潜力', score: 90 },
      { name: '工具熟练度', score: 88 },
      { name: '表达能力', score: 85 }
    ]
  }
}

export const mockGameInterviewData = {
  stats: [
    { label: '已完成关卡', value: '5' },
    { label: '总答题数', value: '128' },
    { label: '正确率', value: '85%' },
    { label: '技能认证', value: '8' },
    { label: '连续打卡', value: '12天' },
    { label: '总得分', value: '2,850' }
  ],
  levels: [
    {
      id: 1,
      name: '基础入门',
      difficulty: 'easy',
      progress: 100,
      completed: true,
      questions: 20,
      correct: 18,
      time_spent: '2h 30m',
      badge: 'bronze',
      skills: ['HTML/CSS', 'JavaScript基础', '网络基础']
    },
    {
      id: 2,
      name: '前端进阶',
      difficulty: 'medium',
      progress: 100,
      completed: true,
      questions: 30,
      correct: 25,
      time_spent: '4h 15m',
      badge: 'silver',
      skills: ['Vue3', 'React', 'TypeScript']
    },
    {
      id: 3,
      name: '后端基础',
      difficulty: 'medium',
      progress: 100,
      completed: true,
      questions: 25,
      correct: 22,
      time_spent: '3h 45m',
      badge: 'silver',
      skills: ['Java基础', 'Spring Boot', 'SQL']
    },
    {
      id: 4,
      name: '系统设计',
      difficulty: 'hard',
      progress: 100,
      completed: true,
      questions: 20,
      correct: 16,
      time_spent: '5h 20m',
      badge: 'gold',
      skills: ['分布式系统', '微服务', '缓存设计']
    },
    {
      id: 5,
      name: '高级算法',
      difficulty: 'hard',
      progress: 60,
      completed: false,
      questions: 33,
      correct: 20,
      time_spent: '3h 10m',
      badge: null,
      skills: ['动态规划', '图算法', '贪心算法']
    },
    {
      id: 6,
      name: '架构实战',
      difficulty: 'expert',
      progress: 0,
      completed: false,
      questions: 0,
      correct: 0,
      time_spent: '0h 0m',
      badge: null,
      skills: ['高可用架构', '性能优化', 'DevOps']
    }
  ],
  achievements: [
    {
      id: 1,
      name: '初次尝试',
      description: '完成第一次游戏式面试',
      icon: 'sparkles',
      unlocked: true,
      unlocked_at: '2026-03-01'
    },
    {
      id: 2,
      name: '连续打卡',
      description: '连续10天进行面试练习',
      icon: 'calendar',
      unlocked: true,
      unlocked_at: '2026-03-12'
    },
    {
      id: 3,
      name: '正确率达人',
      description: '单次关卡正确率达到90%以上',
      icon: 'check-circle',
      unlocked: true,
      unlocked_at: '2026-03-18'
    },
    {
      id: 4,
      name: '挑战大师',
      description: '完成所有困难级别关卡',
      icon: 'trophy',
      unlocked: false,
      progress: 75
    },
    {
      id: 5,
      name: '知识渊博',
      description: '完成所有技能类别的题目',
      icon: 'book-open',
      unlocked: false,
      progress: 60
    }
  ],
  leaderboard: [
    { rank: 1, name: '张三', score: 3250, avatar: '👨‍💻' },
    { rank: 2, name: '李四', score: 3120, avatar: '👩‍💻' },
    { rank: 3, name: '王五', score: 2980, avatar: '👨‍💻' },
    { rank: 4, name: '赵六', score: 2950, avatar: '👩‍💻' },
    { rank: 5, name: '王同学', score: 2850, avatar: '🧑‍💻', is_current_user: true }
  ]
}

export const mockResumeData = {
  basic_info: {
    name: '王同学',
    major: '计算机专业',
    grade: '大三',
    school: '北京大学'
  },
  education: [
    {
      school: '北京大学',
      major: '计算机科学与技术',
      start_date: '2022-09',
      end_date: '2026-06',
      degree: '本科'
    }
  ],
  experience: [
    {
      company: '字节跳动',
      position: '前端开发实习生',
      start_date: '2025-07',
      end_date: '2025-09',
      description:
        '参与公司内部管理系统的前端开发，使用Vue3 + TypeScript技术栈，负责页面组件的开发和优化。'
    },
    {
      company: '阿里巴巴',
      position: '前端开发实习生',
      start_date: '2024-07',
      end_date: '2024-09',
      description:
        '参与电商平台的前端开发，使用React + TypeScript技术栈，负责商品详情页的开发和性能优化。'
    }
  ],
  skills: [
    { name: 'Vue3', level: 'expert' },
    { name: 'React', level: 'advanced' },
    { name: 'TypeScript', level: 'advanced' },
    { name: 'Java', level: 'intermediate' },
    { name: 'Python', level: 'intermediate' },
    { name: 'SQL', level: 'intermediate' }
  ],
  projects: [
    {
      name: 'AI面试模拟平台',
      role: '前端开发',
      description:
        '使用Vue3 + TypeScript + Tailwind CSS开发的AI面试模拟平台，包含面试练习、能力评估、简历诊断等功能。',
      technologies: 'Vue3, TypeScript, Tailwind CSS, ECharts'
    },
    {
      name: '在线学习平台',
      role: '全栈开发',
      description:
        '使用React + Node.js + MongoDB开发的在线学习平台，包含课程管理、用户管理、学习进度跟踪等功能。',
      technologies: 'React, Node.js, MongoDB, Express'
    }
  ]
}

export const mockResumeDiagnosisResult = {
  overall_score: 85,
  strengths: [
    { name: '技术栈全面', score: 90 },
    { name: '项目经验丰富', score: 85 },
    { name: '实习经历优质', score: 95 }
  ],
  weaknesses: [
    { name: '技能描述不够具体', score: 65 },
    { name: '项目成果量化不足', score: 70 },
    { name: '教育背景描述简单', score: 75 }
  ],
  suggestions: [
    '将技能水平具体化，例如：Vue3 (精通)、React (熟练)',
    '量化项目成果，例如：优化页面加载速度提升30%',
    '添加教育背景中的相关课程和成绩',
    '突出个人优势和独特性，避免模板化',
    '根据目标岗位调整简历内容，突出相关技能和经验'
  ],
  match_rate: {
    '前端开发工程师': 90,
    'Java开发工程师': 75,
    '全栈开发工程师': 85,
    '产品经理': 60
  }
}
