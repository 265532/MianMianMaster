export interface InterviewQuestion {
  id: string;
  content: string;
  type: "technical" | "behavioral" | "case";
  difficulty: "easy" | "medium" | "hard";
  category: string;
  answered: boolean;
  answer?: string;
  score?: number;
  starAnswer?: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
  alternativeAnswers?: {
    situation: string;
    task: string;
    action: string;
    result: string;
  }[];
  commonMistakes?: string[];
}

export interface InterviewSession {
  id: string;
  job_title: string;
  company?: string;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  type?: string;
  max_rounds?: number;
  current_round?: number;
  created_at: string;
  started_at?: string;
  ended_at?: string;
  total_score?: number;
  feedback?: string;
  details?: {
    technical: number;
    communication: number;
    logic: number;
    problem_solving: number;
  };
}

export interface InterviewSessionCreate {
  job_title: string;
  company?: string;
  type?: string;
  max_rounds?: number;
}

export interface InterviewReport {
  session_id: string;
  status: "pending" | "generating" | "completed" | "failed";
  overall_score?: number;
  dimensions?: {
    technical: number;
    communication: number;
    logic: number;
    problem_solving: number;
  };
  strengths?: string[];
  weaknesses?: string[];
  suggestions?: string[];
  generated_at?: string;
}

export type SseEventType = "token" | "done" | "error" | "round_limit";

export interface SseEvent {
  type: SseEventType;
  data: string;
}

export interface GameLevel {
  id: number;
  name: string;
  title: string;
  status: string;
  progress: number;
  description: string;
  interviews: number;
  completed: number;
  timeSpent: string;
  successRate: string;
  skills: string[];
  unlockRequirements: string | null;
  icon: string;
  background: string;
  difficulty: string;
  reward: string;
  questionCount: number;
  timeLimit: number;
}

export interface GameStats {
  completedLevels: number;
  totalQuestions: number;
  correctRate: string;
  certifications: number;
  streak: string;
  totalScore: string;
}

export interface GameAchievement {
  id: number;
  name: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  icon?: string;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  avatar: string;
  isCurrentUser?: boolean;
}
