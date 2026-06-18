import type {
  Assessment,
  AssessmentResult,
} from "@/api/types/assessment.types";

export const mockAssessments: Assessment[] = [
  {
    id: 1,
    title: "前端开发能力测评",
    description: "全面评估前端开发技能，包括HTML/CSS/JavaScript核心能力",
    job_position_id: 1,
    created_at: "2026-05-09T00:00:00Z",
    updated_at: "2026-05-09T00:00:00Z",
    questions_count: 10,
  },
  {
    id: 2,
    title: "逻辑思维测评",
    description: "评估逻辑推理和分析思维能力",
    job_position_id: null,
    created_at: "2026-05-08T00:00:00Z",
    updated_at: "2026-05-08T00:00:00Z",
    questions_count: 8,
  },
  {
    id: 3,
    title: "表达能力测评",
    description: "评估沟通表达和逻辑阐述能力",
    job_position_id: null,
    created_at: "2026-05-07T00:00:00Z",
    updated_at: "2026-05-07T00:00:00Z",
    questions_count: 6,
  },
];

export const mockAssessmentResults: AssessmentResult[] = [
  {
    id: 1,
    user_id: 1,
    assessment_id: 1,
    total_score: 85,
    details: {
      technical: 90,
      communication: 85,
      logic: 92,
      problem_solving: 88,
    },
    created_at: "2026-05-09T01:00:00Z",
  },
  {
    id: 2,
    user_id: 1,
    assessment_id: 2,
    total_score: 78,
    details: {
      logical_reasoning: 82,
      analytical_thinking: 75,
      pattern_recognition: 80,
      critical_thinking: 76,
    },
    created_at: "2026-05-08T01:00:00Z",
  },
];
