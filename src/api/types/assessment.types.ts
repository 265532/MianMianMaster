export interface Assessment {
  id: number;
  title?: string;
  type?: string;
  created_at: string;
}

export interface AssessmentQuestion {
  id: number;
  type: 'single_choice' | 'multiple_choice' | 'text';
  content: string;
  options?: string[];
  correct_answer?: string | string[];
  points: number;
}

export interface AssessmentCreate {
  type?: string;
  questions: AssessmentQuestion[];
}

export interface AssessmentSubmit {
  assessment_id: number;
  answers: Array<{
    question_id: number;
    answer: string | string[];
  }>;
}

export interface AssessmentResult {
  id: number;
  assessment_id: number;
  score?: number;
  details?: Record<string, any>;
  created_at: string;
}
