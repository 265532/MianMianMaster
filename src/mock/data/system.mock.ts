import type { SystemConfig, SystemHealth, SystemAnnouncement } from "@/api/types/system.types";

export const mockSystemConfigs: SystemConfig[] = [
  { key: "max_interview_sessions", value: "10", description: "用户最大同时进行面试会话数" },
  { key: "ai_review_enabled", value: "true", description: "是否启用 AI 评审功能" },
  { key: "daily_question_limit", value: "50", description: "每日刷题上限" },
];

export const mockSystemHealth: SystemHealth = {
  status: "healthy",
  version: "0.1.0",
  uptime: 86400,
  database: "connected",
  redis: "connected",
};

export const mockSystemAnnouncements: SystemAnnouncement[] = [
  {
    id: 1,
    title: "新功能上线：AI 简历诊断",
    content: "我们推出了全新的 AI 简历诊断功能，帮助您快速发现简历中的不足并提供优化建议。",
    type: "info",
    start_time: "2026-05-25T00:00:00Z",
    end_time: "2026-06-25T00:00:00Z",
    is_active: true,
  },
  {
    id: 2,
    title: "系统升级维护通知",
    content: "系统将于 2026-06-01 02:00-04:00 进行升级维护，届时部分功能可能暂时不可用。",
    type: "maintenance",
    start_time: "2026-05-28T00:00:00Z",
    is_active: true,
  },
];
