import { get, post } from "@/utils/request";
import type {
  JobPosition,
  JobPositionCreate,
  SkillTreeNode,
  JobMatchResult,
} from "../types/job.types";
import type { ResponseModel, PaginationParams } from "../types/response.types";

const BASE_URL = "/jobs";

export const jobApi = {
  createJobPosition(
    data: JobPositionCreate,
  ): Promise<ResponseModel<JobPosition>> {
    return post<ResponseModel<JobPosition>>(`${BASE_URL}`, data);
  },

  listJobPositions(
    params?: PaginationParams,
  ): Promise<ResponseModel<JobPosition[]>> {
    return get<ResponseModel<JobPosition[]>>(
      `${BASE_URL}`,
      params as Record<string, any>,
    );
  },

  getSkillTree(jobId: number): Promise<ResponseModel<SkillTreeNode>> {
    return get<ResponseModel<SkillTreeNode>>(`${BASE_URL}/${jobId}/skill-tree`);
  },

  getJobMatch(jobId: number): Promise<ResponseModel<JobMatchResult>> {
    return get<ResponseModel<JobMatchResult>>(`${BASE_URL}/${jobId}/match`);
  },
};
