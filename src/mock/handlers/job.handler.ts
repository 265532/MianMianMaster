import type MockAdapter from "axios-mock-adapter";
import {
  mockJobPositions,
  mockSkillTree,
  mockJobMatchResults,
} from "../data/job.mock";

function success<T>(
  data: T,
): [number, { code: number; message: string; data: T }] {
  return [200, { code: 200, message: "success", data }];
}

export function registerJobHandlers(mock: MockAdapter): void {
  mock.onPost("/jobs").reply((config) => {
    const data = JSON.parse(config.data);
    const newJob = {
      id: Date.now(),
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return success(newJob);
  });

  mock.onGet("/jobs").reply(() => {
    return success(mockJobPositions);
  });

  mock.onGet(/\/jobs\/\d+\/skill-tree$/).reply((config) => {
    return success(mockSkillTree);
  });

  mock.onGet(/\/jobs\/\d+\/match$/).reply((config) => {
    const jobId = parseInt(config.url?.split("/")[2] || "0");
    const result = mockJobMatchResults[jobId] || {
      job_id: jobId,
      match_score: 0,
      matched_skills: [],
      missing_skills: [],
    };
    return success(result);
  });
}
