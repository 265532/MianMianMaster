export interface Assessment {
  id: number
  title?: string
  type?: string
  created_at: string
}

export interface AssessmentCreate {
  type?: string
  answers?: Record<string, any>
}

export interface AssessmentResult {
  id: number
  assessment_id: number
  score?: number
  details?: Record<string, any>
  created_at: string
}
