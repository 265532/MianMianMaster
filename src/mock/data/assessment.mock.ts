import type {
  Assessment,
  AssessmentResult,
} from "@/api/types/assessment.types";

export const mockAssessments: Assessment[] = [
  {
    id: 1,
    title: "前端开发能力测评",
    type: "technical",
    created_at: "2026-05-09T00:00:00Z",
  },
  {
    id: 2,
    title: "逻辑思维测评",
    type: "logic",
    created_at: "2026-05-08T00:00:00Z",
  },
  {
    id: 3,
    title: "表达能力测评",
    type: "communication",
    created_at: "2026-05-07T00:00:00Z",
  },
];

export const mockAssessmentResults: AssessmentResult[] = [
  {
    id: 1,
    assessment_id: 1,
    score: 85,
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
    assessment_id: 2,
    score: 78,
    details: {
      logical_reasoning: 82,
      analytical_thinking: 75,
      pattern_recognition: 80,
      critical_thinking: 76,
    },
    created_at: "2026-05-08T01:00:00Z",
  },
  {
    id: 3,
    assessment_id: 3,
    score: 92,
    details: {
      clarity: 95,
      structure: 90,
      persuasion: 88,
      listening: 94,
    },
    created_at: "2026-05-07T01:00:00Z",
  },
];
