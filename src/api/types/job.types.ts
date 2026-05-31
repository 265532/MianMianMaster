export interface JobPosition {
  id: number
  title: string
  description?: string
  company?: string
  location?: string
  salary_range?: string
  requirements?: string[]
  created_at: string
  updated_at: string
}

export interface JobPositionCreate {
  title: string
  description?: string
  company?: string
  location?: string
  salary_range?: string
  requirements?: string[]
}

export interface SkillTreeNode {
  id: number
  name: string
  category?: string
  level?: number
  children?: SkillTreeNode[]
}

export interface JobMatchResult {
  job_id: number
  match_score: number
  matched_skills?: string[]
  missing_skills?: string[]
}
