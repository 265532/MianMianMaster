import { get, post } from "@/utils/request";
import type {
  Assessment,
  AssessmentCreate,
  AssessmentSubmit,
  AssessmentResult,
} from "../types/assessment.types";
import type { ResponseModel, PaginationParams } from "../types/response.types";

const BASE_URL = "/assessments";

export const assessmentApi = {
  getAssessments(params?: PaginationParams): Promise<ResponseModel<Assessment[]>> {
    return get<ResponseModel<Assessment[]>>(`${BASE_URL}`, params as Record<string, unknown>);
  },

  createAssessment(data: AssessmentCreate): Promise<ResponseModel<Assessment>> {
    return post<ResponseModel<Assessment>>(`${BASE_URL}`, data);
  },

  submitAssessment(data: AssessmentSubmit): Promise<ResponseModel<AssessmentResult>> {
    return post<ResponseModel<AssessmentResult>>(`${BASE_URL}/submit`, data);
  },

  getResult(assessmentId: number): Promise<ResponseModel<AssessmentResult>> {
    return get<ResponseModel<AssessmentResult>>(`${BASE_URL}/${assessmentId}/result`);
  },
};
