export interface InterviewQuestion {
  id: string
  content: string
  type: 'technical' | 'behavioral' | 'case'
  difficulty: 'easy' | 'medium' | 'hard'
  category: string
  answered: boolean
  answer?: string
  score?: number
  starAnswer?: {
    situation: string
    task: string
    action: string
    result: string
  }
  alternativeAnswers?: {
    situation: string
    task: string
    action: string
    result: string
  }[]
  commonMistakes?: string[]
}

export interface InterviewSession {
  id: string
  jobTitle: string
  company: string
  questions: InterviewQuestion[]
  startTime: string
  endTime?: string
  totalScore?: number
  status: 'pending' | 'in_progress' | 'completed'
  type?: string
  round?: string
  tags?: string[]
  feedback?: string
  details?: {
    technical: number
    communication: number
    logic: number
    problem_solving: number
  }
}

export interface GameLevel {
  id: number
  name: string
  title: string
  status: string
  progress: number
  description: string
  interviews: number
  completed: number
  timeSpent: string
  successRate: string
  skills: string[]
  unlockRequirements: string | null
  icon: string
  background: string
  difficulty: string
  reward: string
  questionCount: number
  timeLimit: number
}

export interface GameStats {
  completedLevels: number
  totalQuestions: number
  correctRate: string
  certifications: number
  streak: string
  totalScore: string
}

export interface GameAchievement {
  id: number
  name: string
  description: string
  unlocked: boolean
  unlockedAt?: string
  progress?: number
  icon?: string
}

export interface LeaderboardEntry {
  rank: number
  name: string
  score: number
  avatar: string
  isCurrentUser?: boolean
}
