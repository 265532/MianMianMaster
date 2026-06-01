export interface KnowledgeGraph {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface KnowledgeGraphCreate {
  name: string;
  description?: string;
}

export interface AiStrategy {
  id: number;
  name: string;
  description?: string;
  config?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface AiStrategyCreate {
  name: string;
  description?: string;
  config?: Record<string, unknown>;
}

export interface InterviewConfig {
  id: number;
  name: string;
  description?: string;
  config?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface InterviewConfigCreate {
  name: string;
  description?: string;
  config?: Record<string, unknown>;
}

export interface InterviewSession {
  id: number;
  config_id: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface InterviewSessionCreate {
  config_id: number;
}

export interface AgentState {
  id: number;
  agent_name: string;
  status: string;
  last_active?: string;
  metadata?: Record<string, unknown>;
}
