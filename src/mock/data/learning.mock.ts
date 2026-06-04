import type {
  Course,
  Collection,
  WrongQuestion,
  Badge,
  UserBadge,
} from "@/api/types/learning.types";

export const mockCourses: Course[] = [
  {
    id: 1,
    title: "逻辑思维提升",
    description: "通过系统训练提升逻辑思维能力，掌握结构化思考方法",
    level: "beginner",
    cover_url: null,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-05-09T00:00:00Z",
    materials: [],
  },
  {
    id: 2,
    title: "表达结构优化",
    description: "学习STAR法则等表达技巧，掌握清晰、有条理的表达方法",
    level: "intermediate",
    cover_url: null,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-05-09T00:00:00Z",
    materials: [],
  },
  {
    id: 3,
    title: "专业深度强化",
    description: "深入探讨技术领域的核心概念和前沿趋势",
    level: "advanced",
    cover_url: null,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-05-09T00:00:00Z",
    materials: [],
  },
];

export const mockCollections: Collection[] = [
  {
    id: 1,
    user_id: 1,
    title: "高频算法 50 题",
    description: "涵盖面试中常见的算法题",
    category: "算法",
    difficulty: "medium",
    created_at: "2026-03-20T00:00:00Z",
  },
  {
    id: 2,
    user_id: 1,
    title: "前端框架高频题",
    description: "Vue、React等前端框架常见面试题",
    category: "前端",
    difficulty: "medium",
    created_at: "2026-03-15T00:00:00Z",
  },
];

export const mockWrongQuestions: WrongQuestion[] = [
  {
    id: 1,
    user_id: 1,
    question_id: 101,
    wrong_answer: "使用 props 和 events",
    answer_count: 2,
    is_mastered: false,
    last_answered_at: "2026-03-24T00:00:00Z",
  },
  {
    id: 2,
    user_id: 1,
    question_id: 102,
    wrong_answer: "闭包是一个函数",
    answer_count: 1,
    is_mastered: true,
    last_answered_at: "2026-03-20T00:00:00Z",
  },
];

export const mockBadges: Badge[] = [
  {
    id: 1,
    name: "初次尝试",
    description: "完成第一次游戏式面试",
    icon_url: "sparkles",
    condition_type: "game_interview_1",
    condition_value: "1",
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: 2,
    name: "连续打卡",
    description: "连续10天进行面试练习",
    icon_url: "calendar",
    condition_type: "streak_days",
    condition_value: "10",
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: 3,
    name: "正确率达人",
    description: "单次关卡正确率达到90%以上",
    icon_url: "check-circle",
    condition_type: "accuracy_rate",
    condition_value: "90",
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: 4,
    name: "挑战大师",
    description: "完成所有困难级别关卡",
    icon_url: "trophy",
    condition_type: "levels_completed",
    condition_value: "5",
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: 5,
    name: "知识渊博",
    description: "完成所有技能类别的题目",
    icon_url: "book-open",
    condition_type: "skill_categories",
    condition_value: "all",
    created_at: "2026-01-01T00:00:00Z",
  },
];

export const mockUserBadges: UserBadge[] = [
  {
    id: 1,
    user_id: 1,
    badge_id: 1,
    awarded_at: "2026-03-01T00:00:00Z",
  },
  {
    id: 2,
    user_id: 1,
    badge_id: 2,
    awarded_at: "2026-03-12T00:00:00Z",
  },
];
