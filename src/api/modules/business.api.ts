import { get, post } from "@/utils/request";
import type {
  KnowledgeGraph,
  KnowledgeGraphCreate,
  AiStrategy,
  AiStrategyCreate,
  InterviewConfig,
  InterviewConfigCreate,
  InterviewSession,
  InterviewSessionCreate,
  AgentState,
} from "../types/business.types";
import type { ResponseModel } from "../types/response.types";

const BASE_URL = "/business";

export const businessApi = {
  getKnowledgeGraphs(): Promise<ResponseModel<KnowledgeGraph[]>> {
    return get<ResponseModel<KnowledgeGraph[]>>(`${BASE_URL}/knowledge-graph`);
  },

  createKnowledgeGraph(
    data: KnowledgeGraphCreate,
  ): Promise<ResponseModel<KnowledgeGraph>> {
    return post<ResponseModel<KnowledgeGraph>>(
      `${BASE_URL}/knowledge-graph`,
      data,
    );
  },

  getAiStrategies(): Promise<ResponseModel<AiStrategy[]>> {
    return get<ResponseModel<AiStrategy[]>>(`${BASE_URL}/ai-strategy`);
  },

  createAiStrategy(data: AiStrategyCreate): Promise<ResponseModel<AiStrategy>> {
    return post<ResponseModel<AiStrategy>>(`${BASE_URL}/ai-strategy`, data);
  },

  getInterviewConfigs(): Promise<ResponseModel<InterviewConfig[]>> {
    return get<ResponseModel<InterviewConfig[]>>(`${BASE_URL}/interview-config`);
  },

  createInterviewConfig(
    data: InterviewConfigCreate,
  ): Promise<ResponseModel<InterviewConfig>> {
    return post<ResponseModel<InterviewConfig>>(
      `${BASE_URL}/interview-config`,
      data,
    );
  },

  getInterviewSessions(): Promise<ResponseModel<InterviewSession[]>> {
    return get<ResponseModel<InterviewSession[]>>(
      `${BASE_URL}/interview-session`,
    );
  },

  createInterviewSession(
    data: InterviewSessionCreate,
  ): Promise<ResponseModel<InterviewSession>> {
    return post<ResponseModel<InterviewSession>>(
      `${BASE_URL}/interview-session`,
      data,
    );
  },

  getAgentStates(): Promise<ResponseModel<AgentState[]>> {
    return get<ResponseModel<AgentState[]>>(`${BASE_URL}/agent-state`);
  },
};
