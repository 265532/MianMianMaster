export interface Course {
  id: number
  title: string
  description?: string
  category?: string
  difficulty?: string
  created_at: string
  updated_at: string
}

export interface CourseCreate {
  title: string
  description?: string
  category?: string
  difficulty?: string
}

export interface Material {
  id: number
  course_id: number
  title: string
  type?: string
  url?: string
  created_at: string
}

export interface MaterialCreate {
  course_id: number
  title: string
  type?: string
  url?: string
}

export interface LearningProgress {
  id: number
  user_id: number
  course_id: number
  progress: number
  updated_at: string
}

export interface Collection {
  id: number
  title: string
  description?: string
  question_count?: number
  category?: string
  difficulty?: string
  saved_at?: string
  last_practiced?: string
}

export interface WrongQuestion {
  id: number
  question: string
  user_answer?: string
  correct_answer?: string
  explanation?: string
  category?: string
  difficulty?: string
  mistake_count?: number
  last_mistake_at?: string
  status?: string
}

export interface Badge {
  id: number
  name: string
  description?: string
  icon_url?: string
  created_at: string
}

export interface UserBadge {
  id: number
  badge_id: number
  badge?: Badge
  awarded_at: string
}
