import type {
  GameLevel,
  GameStats,
  GameAchievement,
  LeaderboardEntry,
  InterviewSession,
  InterviewReport,
} from "../../api/types/interview.types";

export const mockInterviewSessions: InterviewSession[] = [
  {
    id: 1,
    candidate_id: 1,
    strategy_id: null,
    status: "completed",
    current_round: 10,
    score: 85,
    summary: "技术基础扎实，沟通表达清晰",
    start_time: "2026-05-28T10:01:00Z",
    end_time: "2026-05-28T10:30:00Z",
    created_at: "2026-05-28T10:00:00Z",
  },
  {
    id: 2,
    candidate_id: 1,
    status: "in_progress",
    current_round: 3,
    start_time: "2026-05-30T14:01:00Z",
    created_at: "2026-05-30T14:00:00Z",
  },
  {
    id: 3,
    candidate_id: 1,
    status: "scheduled",
    created_at: "2026-05-31T09:00:00Z",
  },
];

export const mockInterviewReport: InterviewReport = {
  id: 1,
  session_id: 1,
  content_score: 88,
  depth_score: 82,
  logic_score: 85,
  match_score: 80,
  overall_score: 85,
  clarity_score: 82,
  confidence_score: 78,
  strength_areas: [
    "Vue 3 Composition API 理解深入",
    "对前端性能优化有实际经验",
    "代码组织能力较强",
  ],
  weakness_areas: [
    "系统设计思维需要加强",
    "对微前端架构了解不够深入",
  ],
  improvement_plan: "建议学习系统设计方法论，尝试实践微前端架构",
  offer_recommendation: "建议录用",
  status: "completed",
  created_at: "2026-05-28T10:31:00Z",
  updated_at: "2026-05-28T10:31:00Z",
};

export const mockGameLevels: GameLevel[] = [
  {
    id: 1,
    name: "初级：校招面试",
    description: "模拟校招面试场景，适合刚毕业的学生",
    difficulty: "easy",
    is_unlocked: true,
    questions_count: 8,
  },
  {
    id: 2,
    name: "中级：社招面试",
    description: "模拟社招面试场景，适合有1-3年工作经验的开发者",
    difficulty: "medium",
    is_unlocked: true,
    questions_count: 12,
  },
  {
    id: 3,
    name: "高级：架构师面试",
    description: "模拟架构师面试场景，适合资深开发者",
    difficulty: "hard",
    is_unlocked: false,
    questions_count: 15,
  },
];

export const mockGameStats: GameStats = {
  total_xp: 1250,
  current_level: 2,
  completed_challenges: 5,
  accuracy_rate: 0.8,
};

export const mockGameAchievements: GameAchievement[] = [
  {
    id: 1,
    name: "初次尝试",
    description: "完成第一次游戏式面试",
    icon_url: "sparkles",
    is_unlocked: true,
    unlocked_at: "2026-03-01T00:00:00Z",
  },
  {
    id: 2,
    name: "连续打卡",
    description: "连续10天进行面试练习",
    icon_url: "calendar",
    is_unlocked: true,
    unlocked_at: "2026-03-12T00:00:00Z",
  },
  {
    id: 3,
    name: "正确率达人",
    description: "单次关卡正确率达到90%以上",
    icon_url: "check-circle",
    is_unlocked: true,
    unlocked_at: "2026-03-18T00:00:00Z",
  },
  {
    id: 4,
    name: "挑战大师",
    description: "完成所有困难级别关卡",
    icon_url: "trophy",
    is_unlocked: false,
    unlocked_at: null,
  },
  {
    id: 5,
    name: "知识渊博",
    description: "完成所有技能类别的题目",
    icon_url: "book-open",
    is_unlocked: false,
    unlocked_at: null,
  },
];

export const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, user_id: 101, username: "张三", avatar_url: "", score: 3250 },
  { rank: 2, user_id: 102, username: "李四", avatar_url: "", score: 3120 },
  { rank: 3, user_id: 103, username: "王五", avatar_url: "", score: 2980 },
  { rank: 4, user_id: 104, username: "赵六", avatar_url: "", score: 2950 },
  { rank: 5, user_id: 1, username: "王同学", avatar_url: "", score: 2850 },
];
