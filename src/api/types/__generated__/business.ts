// ============================================================
// business 模块 — 自动生成类型骨架
// 来源: docs/api/schemas/business.openapi.json
// 用途: 作为 src/api/types/ 下手动类型的参考基准，对齐后端 Schema
// ============================================================

export interface KnowledgeGraphCreate {
  /** Concept Name */
  concept_name: string;

  /** Description */
  description?: string | null;

  /** Parent Id */
  parent_id?: number | null;

  /** Tags */
  tags?: string[];

}

export interface AIStrategyCreate {
  /** Name */
  name: string;

  /** Model Name */
  model_name: string;

  /** Temperature */
  temperature?: number;

  /** Max Tokens */
  max_tokens?: number;

  /** System Prompt */
  system_prompt: string;

  /** Is Active */
  is_active?: boolean;

}

export interface InterviewConfigCreate {
  /** Name */
  name: string;

  /** Video Resolution */
  video_resolution?: string;

  /** Audio Codec */
  audio_codec?: string;

  /** Enable Recording */
  enable_recording?: boolean;

  /** Max Duration Minutes */
  max_duration_minutes?: number;

  /** Job Position Id */
  job_position_id?: number | null;

  /** Strategy Id */
  strategy_id?: number | null;

  /** Max Rounds */
  max_rounds?: number;

}

export interface InterviewSessionCreate {
  /** Candidate Id */
  candidate_id: number;

  /** Config Id */
  config_id: number;

  /** Strategy Id */
  strategy_id?: number | null;

  /** Status */
  status?: string;

  /** Current Round */
  current_round?: number;

  /** Summary */
  summary?: string | null;

}

export interface KnowledgeGraph {
  /** Concept Name */
  concept_name: string;

  /** Description */
  description?: string | null;

  /** Parent Id */
  parent_id?: number | null;

  /** Tags */
  tags?: string[];

  /** Id */
  id: number;

  /** Created At */
  created_at: string;

  /** Updated At */
  updated_at: string;

  /** Children */
  children?: KnowledgeGraph[];

}

export interface AIStrategy {
  /** Name */
  name: string;

  /** Model Name */
  model_name: string;

  /** Temperature */
  temperature?: number;

  /** Max Tokens */
  max_tokens?: number;

  /** System Prompt */
  system_prompt: string;

  /** Is Active */
  is_active?: boolean;

  /** Id */
  id: number;

  /** Created At */
  created_at: string;

  /** Updated At */
  updated_at: string;

}

export interface InterviewConfig {
  /** Name */
  name: string;

  /** Video Resolution */
  video_resolution?: string;

  /** Audio Codec */
  audio_codec?: string;

  /** Enable Recording */
  enable_recording?: boolean;

  /** Max Duration Minutes */
  max_duration_minutes?: number;

  /** Job Position Id */
  job_position_id?: number | null;

  /** Strategy Id */
  strategy_id?: number | null;

  /** Max Rounds */
  max_rounds?: number;

  /** Id */
  id: number;

  /** Created At */
  created_at: string;

  /** Updated At */
  updated_at: string;

}

export interface InterviewSession {
  /** Candidate Id */
  candidate_id: number;

  /** Config Id */
  config_id: number;

  /** Strategy Id */
  strategy_id?: number | null;

  /** Status */
  status?: string;

  /** Current Round */
  current_round?: number;

  /** Summary */
  summary?: string | null;

  /** Id */
  id: number;

  /** Score */
  score?: number | null;

  /** Feedback */
  feedback?: string | null;

  /** Start Time */
  start_time?: string | null;

  /** End Time */
  end_time?: string | null;

  /** Created At */
  created_at: string;

}

export interface AgentState {
  /** Status */
  status: string;

  /** Current Session Id */
  current_session_id?: string | null;

  /** Metadata Info */
  metadata_info?: Record<string, unknown>;

  /** Id */
  id: number;

  /** Agent Id */
  agent_id: string;

  /** Agent Type */
  agent_type: string;

  /** Last Heartbeat */
  last_heartbeat: string;

}
