import { get, post } from "@/utils/request";
import type {
  JobPosition,
  JobPositionCreate,
  SkillTreeNode,
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
      params as Record<string, unknown>,
    );
  },

  /** GET /jobs/{job_id}/skill-tree — 后端暂返回空对象，前端用 SkillTreeNode 渲染 */
  getSkillTree(jobId: number): Promise<ResponseModel<Record<string, unknown>>> {
    return get<ResponseModel<Record<string, unknown>>>(`${BASE_URL}/${jobId}/skill-tree`);
  },

  /** GET /jobs/{job_id}/match — 后端返回 number (匹配度分数) */
  getJobMatch(jobId: number): Promise<ResponseModel<number>> {
    return get<ResponseModel<number>>(`${BASE_URL}/${jobId}/match`);
  },
};
