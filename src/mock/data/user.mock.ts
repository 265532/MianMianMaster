import type {
  UserResponse,
  UserProfileResponse,
  RoleResponse,
  InterviewHistoryItem,
  AbilityDataResponse,
  GameInterviewDataResponse,
  ResumeData,
  ResumeDiagnoseResult,
} from "@/api/types/user.types";

export const mockUser: UserResponse = {
  id: 1,
  username: "王同学",
  email: "wang@example.com",
  phone: "138****8000",
  is_active: true,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-05-09T00:00:00Z",
  roles: [
    {
      id: 1,
      name: "user",
      description: "普通用户",
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z",
    },
  ] as RoleResponse[],
  profile: {
    id: 1,
    user_id: 1,
    avatar_url: "",
    education: "北京大学计算机科学与技术专业",
    target_position: "前端开发工程师",
    work_years: 2,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-05-09T00:00:00Z",
  } as UserProfileResponse,
};

/** 对齐 GET /user/interview-history 契约 */
export const mockInterviewHistory: InterviewHistoryItem[] = [
  {
    id: 1,
    status: "completed",
    score: 88,
    current_round: 2,
    job_position_title: "前端开发工程师",
    start_time: "2026-03-15T10:00:00Z",
    end_time: "2026-03-15T11:00:00Z",
    created_at: "2026-03-15T10:00:00Z",
  },
  {
    id: 2,
    status: "completed",
    score: 82,
    current_round: 1,
    job_position_title: "Java 开发工程师",
    start_time: "2026-02-28T14:00:00Z",
    end_time: "2026-02-28T15:00:00Z",
    created_at: "2026-02-28T14:00:00Z",
  },
  {
    id: 3,
    status: "completed",
    score: 91,
    current_round: 3,
    job_position_title: "UI 设计师",
    start_time: "2025-11-15T09:00:00Z",
    end_time: "2025-11-15T10:30:00Z",
    created_at: "2025-11-15T09:00:00Z",
  },
  {
    id: 4,
    status: "failed",
    score: 78,
    current_round: 1,
    job_position_title: "产品经理",
    start_time: "2025-10-20T16:00:00Z",
    end_time: "2025-10-20T17:00:00Z",
    created_at: "2025-10-20T16:00:00Z",
  },
  {
    id: 5,
    status: "completed",
    score: 85,
    current_round: 2,
    job_position_title: "数据分析师",
    start_time: "2025-09-10T11:00:00Z",
    end_time: "2025-09-10T12:00:00Z",
    created_at: "2025-09-10T11:00:00Z",
  },
  {
    id: 6,
    status: "completed",
    score: 80,
    current_round: 1,
    job_position_title: "后端开发工程师",
    start_time: "2025-08-05T10:00:00Z",
    end_time: "2025-08-05T11:00:00Z",
    created_at: "2025-08-05T10:00:00Z",
  },
  {
    id: 7,
    status: "completed",
    score: 92,
    current_round: 3,
    job_position_title: "前端开发工程师",
    start_time: "2025-06-20T14:00:00Z",
    end_time: "2025-06-20T15:30:00Z",
    created_at: "2025-06-20T14:00:00Z",
  },
  {
    id: 8,
    status: "failed",
    score: 76,
    current_round: 1,
    job_position_title: "测试工程师",
    start_time: "2025-05-15T09:00:00Z",
    end_time: "2025-05-15T10:00:00Z",
    created_at: "2025-05-15T09:00:00Z",
  },
  {
    id: 9,
    status: "completed",
    score: 86,
    current_round: 2,
    job_position_title: "前端开发工程师",
    start_time: "2025-04-10T15:00:00Z",
    end_time: "2025-04-10T16:00:00Z",
    created_at: "2025-04-10T15:00:00Z",
  },
  {
    id: 10,
    status: "completed",
    score: 79,
    current_round: 1,
    job_position_title: "后端开发工程师",
    start_time: "2025-03-05T11:00:00Z",
    end_time: "2025-03-05T12:00:00Z",
    created_at: "2025-03-05T11:00:00Z",
  },
  {
    id: 11,
    status: "completed",
    score: 83,
    current_round: 1,
    job_position_title: "前端开发工程师",
    start_time: "2024-12-20T10:00:00Z",
    end_time: "2024-12-20T11:00:00Z",
    created_at: "2024-12-20T10:00:00Z",
  },
  {
    id: 12,
    status: "failed",
    score: 81,
    current_round: 2,
    job_position_title: "产品经理",
    start_time: "2024-11-10T14:00:00Z",
    end_time: "2024-11-10T15:00:00Z",
    created_at: "2024-11-10T14:00:00Z",
  },
];

/** 对齐 GET /user/ability-data 契约 */
export const mockAbilityData: AbilityDataResponse = {
  abilities: [
    {
      current: [85, 78, 92, 70, 88, 75, 82],
      required: [90, 85, 80, 90, 85, 95, 90],
      indicators: [
        { name: "技术深度", max: 100 },
        { name: "逻辑思维", max: 100 },
        { name: "表达能力", max: 100 },
        { name: "项目经验", max: 100 },
        { name: "学习潜力", max: 100 },
        { name: "工程化能力", max: 100 },
        { name: "团队协作", max: 100 },
      ],
      gap_skills: [
        { name: "Vue3 源码深度", gap: 15, level: "high" },
        { name: "工程化架构能力", gap: 20, level: "high" },
        { name: "项目经验", gap: 20, level: "high" },
        { name: "团队协作", gap: 8, level: "medium" },
      ],
      strengths: [
        { name: "表达能力", score: 92 },
        { name: "学习潜力", score: 88 },
        { name: "技术深度", score: 85 },
      ],
    },
  ],
  overall_level: 3,
};

/** 对齐 GET /user/game-interview-data 契约 */
export const mockGameInterviewData: GameInterviewDataResponse = {
  total_sessions: 12,
  completed_sessions: 8,
  average_score: 83.5,
  current_streak: 5,
  best_streak: 12,
};

/** 对齐 GET /user/resume 契约 */
export const mockResumeData: ResumeData = {
  id: 1,
  user_id: 1,
  name: "王同学",
  phone: "138****8000",
  email: "wang@example.com",
  summary: "计算机专业大三学生，有字节跳动和阿里巴巴前端实习经验，熟悉 Vue3/React/TypeScript 技术栈。",
  skills: ["Vue3", "React", "TypeScript", "Java", "Python", "SQL"],
  experience: [
    {
      company: "字节跳动",
      position: "前端开发实习生",
      period: "2025-07 至 2025-09",
      description:
        "参与公司内部管理系统的前端开发，使用Vue3 + TypeScript技术栈，负责页面组件的开发和优化。",
    },
    {
      company: "阿里巴巴",
      position: "前端开发实习生",
      period: "2024-07 至 2024-09",
      description:
        "参与电商平台的前端开发，使用React + TypeScript技术栈，负责商品详情页的开发和性能优化。",
    },
  ],
  education: [
    {
      school: "北京大学",
      degree: "本科",
      major: "计算机科学与技术",
      period: "2022-09 至 2026-06",
    },
  ],
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-05-09T00:00:00Z",
};

/** 对齐 POST /user/resume/diagnose 契约 */
export const mockResumeDiagnosisResult: ResumeDiagnoseResult = {
  resume_id: 1,
  overall_score: 85,
  scores: [
    { category: "技术栈", score: 90, suggestion: "技能覆盖全面，可增加深度项目实践" },
    { category: "项目经验", score: 85, suggestion: "项目描述可量化更多成果指标" },
    { category: "实习经历", score: 95, suggestion: "实习经历优质，建议突出核心贡献" },
    { category: "技能描述", score: 65, suggestion: "将技能水平具体化，例如：Vue3 (精通)" },
    { category: "项目成果", score: 70, suggestion: "量化项目成果，例如：优化页面加载速度提升30%" },
  ],
  summary: "简历整体质量良好，技术栈全面且实习经历优质。建议量化项目成果、具体化技能描述，并根据目标岗位调整简历内容。",
  created_at: new Date().toISOString(),
};
