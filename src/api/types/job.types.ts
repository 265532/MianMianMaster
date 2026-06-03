/** 知识图谱节点（来自 Business 模块，Job 响应中引用） */
export interface KnowledgeGraph {
  concept_name: string;
  description?: string;
  parent_id?: number;
  tags?: string[];
  id: number;
  created_at: string;
  updated_at: string;
  children?: KnowledgeGraph[];
}

/** 岗位信息（对齐 GET/POST /jobs 契约） */
export interface JobPosition {
  id: number;
  title: string;
  description?: string;
  level?: string;
  industry?: string;
  company?: string;
  location?: string;
  salary_range?: string;
  requirements?: string;
  created_at: string;
  updated_at: string;
  required_skills?: KnowledgeGraph[];
}

/** 创建岗位请求（对齐 POST /jobs 契约） */
export interface JobPositionCreate {
  title: string;
  description?: string;
  level?: string;
  industry?: string;
  company?: string;
  location?: string;
  salary_range?: string;
  requirements?: string;
  skill_ids?: number[];
}

/** 技能树节点（前端渲染用，后端 GET /jobs/{job_id}/skill-tree 暂返回空对象） */
export interface SkillTreeNode {
  id: number;
  name: string;
  category?: string;
  level?: number;
  is_required: boolean;
  has_required_child: boolean;
  children?: SkillTreeNode[];
}

/** 岗位匹配结果（前端展示用，后端 GET /jobs/{job_id}/match 直接返回 number） */
export interface JobMatchResult {
  job_id: number;
  match_score: number;
  matched_skills?: string[];
  missing_skills?: string[];
}
