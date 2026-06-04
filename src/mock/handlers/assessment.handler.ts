import type MockAdapter from "axios-mock-adapter";
import {
  mockAssessments,
  mockAssessmentResults,
} from "../data/assessment.mock";

function success<T>(
  data: T,
): [number, { code: number; message: string; data: T }] {
  return [200, { code: 200, message: "success", data }];
}

export function registerAssessmentHandlers(mock: MockAdapter): void {
  mock.onGet("/assessments").reply(() => {
    return success(mockAssessments);
  });

  mock.onPost("/assessments").reply((config) => {
    const data = JSON.parse(config.data);
    return success({
      id: Date.now(),
      title: data.title || "新测评",
      description: data.description,
      job_position_id: data.job_position_id ?? null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      questions_count: data.questions?.length ?? 0,
    });
  });

  mock.onPost("/assessments/submit").reply((config) => {
    const data = JSON.parse(config.data);
    const assessmentId = data.assessment_id || 1;
    const existingResult = mockAssessmentResults.find(
      (r) => r.assessment_id === assessmentId,
    );
    if (existingResult) {
      return success(existingResult);
    }
    return success({
      id: Date.now(),
      user_id: 1,
      assessment_id: assessmentId,
      total_score: Math.floor(Math.random() * 30) + 70,
      details: {
        overall: Math.floor(Math.random() * 30) + 70,
        technical: Math.floor(Math.random() * 30) + 70,
        communication: Math.floor(Math.random() * 30) + 70,
        logic: Math.floor(Math.random() * 30) + 70,
      },
      created_at: new Date().toISOString(),
    });
  });

  mock.onGet(/\/assessments\/\d+\/result$/).reply((config) => {
    const assessmentId = parseInt(config.url?.split("/")[2] ?? "0");
    const result = mockAssessmentResults.find(
      (r) => r.assessment_id === assessmentId,
    );
    if (result) {
      return success(result);
    }
    return [404, { code: 404, message: "RESULT_NOT_FOUND", data: null }];
  });

  console.log("[Mock] Assessment handlers registered");
}
