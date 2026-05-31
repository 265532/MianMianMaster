import type { JobPosition, SkillTreeNode, JobMatchResult } from '../../api/types/job.types'

export const mockJobPositions: JobPosition[] = [
  { id: 1, title: '前端开发工程师', description: '负责Web前端开发', company: '字节跳动', location: '北京', salary_range: '25k-45k', requirements: ['Vue3', 'TypeScript', 'CSS3'], created_at: '2026-04-01', updated_at: '2026-04-01' },
  { id: 2, title: 'Java开发工程师', description: '负责后端服务开发', company: '阿里巴巴', location: '杭州', salary_range: '30k-50k', requirements: ['Java', 'Spring Boot', 'MySQL'], created_at: '2026-04-02', updated_at: '2026-04-02' },
  { id: 3, title: '产品经理', description: '负责产品规划和设计', company: '腾讯', location: '深圳', salary_range: '25k-40k', requirements: ['产品规划', '用户研究', '数据分析'], created_at: '2026-04-03', updated_at: '2026-04-03' },
  { id: 4, title: 'UI设计师', description: '负责产品UI设计', company: '网易', location: '广州', salary_range: '20k-35k', requirements: ['Figma', '交互设计', '视觉设计'], created_at: '2026-04-04', updated_at: '2026-04-04' },
  { id: 5, title: '数据分析师', description: '负责数据分析和挖掘', company: '美团', location: '北京', salary_range: '25k-40k', requirements: ['Python', 'SQL', '数据可视化'], created_at: '2026-04-05', updated_at: '2026-04-05' }
]

export const mockSkillTree: SkillTreeNode = {
  id: 1, name: '前端开发', category: '技术', level: 1,
  children: [
    { id: 11, name: 'HTML/CSS', category: '基础', level: 2, children: [
      { id: 111, name: 'HTML5', level: 3 },
      { id: 112, name: 'CSS3', level: 3 },
      { id: 113, name: '响应式设计', level: 3 }
    ]},
    { id: 12, name: 'JavaScript', category: '核心', level: 2, children: [
      { id: 121, name: 'ES6+', level: 3 },
      { id: 122, name: 'TypeScript', level: 3 },
      { id: 123, name: '异步编程', level: 3 }
    ]},
    { id: 13, name: '框架', category: '应用', level: 2, children: [
      { id: 131, name: 'Vue3', level: 3 },
      { id: 132, name: 'React', level: 3 },
      { id: 133, name: 'Angular', level: 3 }
    ]}
  ]
}

export const mockJobMatchResults: Record<number, JobMatchResult> = {
  1: { job_id: 1, match_score: 85, matched_skills: ['Vue3', 'TypeScript', 'CSS3'], missing_skills: ['Webpack', '性能优化'] },
  2: { job_id: 2, match_score: 65, matched_skills: ['Java'], missing_skills: ['Spring Boot', 'MySQL', '微服务'] },
  3: { job_id: 3, match_score: 70, matched_skills: ['数据分析'], missing_skills: ['产品规划', '用户研究'] },
  4: { job_id: 4, match_score: 55, matched_skills: [], missing_skills: ['Figma', '交互设计', '视觉设计'] },
  5: { job_id: 5, match_score: 60, matched_skills: ['Python', 'SQL'], missing_skills: ['数据可视化', '机器学习'] }
}
