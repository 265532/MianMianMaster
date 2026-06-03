# MianMianMaster 前后端 API 契约摘要

> 从 `openapi.json` 自动提取，共 94 个端点。
> 响应字段已解包 `ResponseModel` 包装，仅展示 `data` 内实际返回字段。

## Auth 认证 模块契约摘要

### POST /api/v1/auth/login (认证: 否)
> Login Access Token

**请求字段:**
- username             string                 
- password             string                 

**响应字段:**
- access_token         string                 
- refresh_token        string                 
- token_type           string                 ?

### POST /api/v1/auth/register (认证: 否)
> Register User

**请求字段:**
- username             string                 
- email                string(email)          
- phone                string                 ?
- is_active            boolean                ?
- password             string                 
- role_ids             integer[]              ?

**响应字段:**
- username             string                 
- email                string(email)          
- phone                string                 ?
- is_active            boolean                ?
- id                   integer                
- created_at           string(date-time)      
- updated_at           string(date-time)      
- roles                Role[]                 ?
- profile              UserProfile            ?

### GET /api/v1/auth/me (认证: 是)
> Read Users Me

**响应字段:**
- username             string                 
- email                string(email)          
- phone                string                 ?
- is_active            boolean                ?
- id                   integer                
- created_at           string(date-time)      
- updated_at           string(date-time)      
- roles                Role[]                 ?
- profile              UserProfile            ?

### POST /api/v1/auth/refresh (认证: 否)
> Refresh Token

**请求字段:**
- refresh_token        string                 

**响应字段:**
- access_token         string                 
- refresh_token        string                 
- token_type           string                 ?

### POST /api/v1/auth/logout (认证: 是)
> Logout

**响应:** string → 前端: string (如 "ok")

### POST /api/v1/auth/unlock/{username} (认证: 是)
> Unlock User

**查询参数:**
- username             string                 

**响应:** string → 前端: string (如 "ok")

### POST /api/v1/auth/sms/send (认证: 否)
> Send Sms Code

**请求字段:**
- phone                string                 

**响应:** string → 前端: string (如 "ok")

### POST /api/v1/auth/sms/login (认证: 否)
> Sms Login

**请求字段:**
- phone                string                 
- code                 string                 

**响应字段:**
- access_token         string                 
- refresh_token        string                 
- token_type           string                 ?

### POST /api/v1/auth/password/reset-token (认证: 否)
> Generate Password Reset Token

**请求字段:**
- email                string(email)          

**响应:** string → 前端: string (如 "ok")

### POST /api/v1/auth/password/reset (认证: 否)
> Reset Password

**请求字段:**
- token                string                 
- new_password         string                 

**响应:** string → 前端: string (如 "ok")

## User 用户 模块契约摘要

### GET /api/v1/user/profile (认证: 是)
> Get Profile

**响应字段:**
- username             string                 
- email                string(email)          
- phone                string                 ?
- is_active            boolean                ?
- id                   integer                
- created_at           string(date-time)      
- updated_at           string(date-time)      
- roles                Role[]                 ?
- profile              UserProfile            ?

### PUT /api/v1/user/profile (认证: 是)
> Update Profile

**请求字段:**
- avatar_url           string                 ?
- education            string                 ?
- target_position      string                 ?
- work_years           integer                ?

**响应字段:**
- avatar_url           string                 ?
- education            string                 ?
- target_position      string                 ?
- work_years           integer                ?
- id                   integer                
- user_id              integer                
- created_at           string(date-time)      
- updated_at           string(date-time)      

### POST /api/v1/user/security/change-password (认证: 是)
> Change Password

**请求字段:**
- old_password         string                 
- new_password         string                 

**响应:** string → 前端: string (如 "ok")

### POST /api/v1/user/security/change-phone (认证: 是)
> Change Phone

**请求字段:**
- new_phone            string                 
- code                 string                 

**响应:** string → 前端: string (如 "ok")

### GET /api/v1/user/interview-history (认证: 是)
> Get Interview History

**查询参数:**
- skip                 integer                ?
- limit                integer                ?

**响应:** 数组
元素字段:
- id                   integer                
- status               string                 
- score                number                 ?
- current_round        integer                ?
- job_position_title   string                 ?
- start_time           string(date-time)      ?
- end_time             string(date-time)      ?
- created_at           string(date-time)      

### GET /api/v1/user/ability-data (认证: 是)
> Get Ability Data

**响应字段:**
- abilities            AbilityDataItem[]      ?
- overall_level        number                 ?

### GET /api/v1/user/resume (认证: 是)
> Get Resume

**响应字段:**
- id                   integer                
- user_id              integer                
- name                 string                 
- phone                string                 ?
- email                string                 ?
- summary              string                 ?
- skills               string[]               ?
- experience           ResumeExperience[]     ?
- education            ResumeEducation[]      ?
- created_at           string(date-time)      
- updated_at           string(date-time)      

### GET /api/v1/user/game-interview-data (认证: 是)
> Get Game Interview Data

**响应字段:**
- total_sessions       integer                ?
- completed_sessions   integer                ?
- average_score        number                 ?
- current_streak       integer                ?
- best_streak          integer                ?

### POST /api/v1/user/resume/diagnose (认证: 是)
> Diagnose Resume

**请求字段:**
- resume_id            integer                
- target_position      string                 ?

**响应字段:**
- resume_id            integer                
- overall_score        number                 
- scores               ResumeDiagnoseScoreItem[] ?
- summary              string                 
- created_at           string(date-time)      

## Notification 通知 模块契约摘要

### GET /api/v1/notifications (认证: 是)
> Get Notifications

**查询参数:**
- skip                 integer                ?
- limit                integer                ?

**响应:** 数组
元素字段:
- title                string                 
- content              string                 
- type                 NotificationType       
- id                   integer                
- user_id              integer                
- is_read              boolean                
- link                 string                 ?
- created_at           string(date-time)      

### POST /api/v1/notifications (认证: 是)
> Create Notification

**请求字段:**
- title                string                 
- content              string                 
- type                 NotificationType       
- user_id              integer                
- link                 string                 ?

**响应字段:**
- title                string                 
- content              string                 
- type                 NotificationType       
- id                   integer                
- user_id              integer                
- is_read              boolean                
- link                 string                 ?
- created_at           string(date-time)      

### GET /api/v1/notifications/unread-count (认证: 是)
> Get Unread Count

**响应:** integer → 前端: number (整数)

### PUT /api/v1/notifications/{notification_id}/read (认证: 是)
> Mark Notification As Read

**查询参数:**
- notification_id      integer                

**响应字段:**
- title                string                 
- content              string                 
- type                 NotificationType       
- id                   integer                
- user_id              integer                
- is_read              boolean                
- link                 string                 ?
- created_at           string(date-time)      

### PUT /api/v1/notifications/read-all (认证: 是)
> Mark All Notifications As Read

**响应:** string → 前端: string (如 "ok")

### GET /api/v1/notifications/preferences (认证: 是)
> Get Notification Preferences

**响应字段:**
- interview_reminder   boolean                ?
- community_interaction boolean                ?
- learning_reminder    boolean                ?
- system_announcement  boolean                ?

### PUT /api/v1/notifications/preferences (认证: 是)
> Update Notification Preferences

**请求字段:**
- interview_reminder   boolean                ?
- community_interaction boolean                ?
- learning_reminder    boolean                ?
- system_announcement  boolean                ?

**响应字段:**
- interview_reminder   boolean                ?
- community_interaction boolean                ?
- learning_reminder    boolean                ?
- system_announcement  boolean                ?

### POST /api/v1/notifications/device-token (认证: 是)
> Register Device Token

**请求字段:**
- device_token         string                 
- platform             string                 

**响应:** string → 前端: string (如 "ok")

## Business 业务配置 模块契约摘要

### GET /api/v1/business/knowledge-graph (认证: 是)
> List Knowledge Graph

**响应:** 数组
元素字段:
- concept_name         string                 
- description          string                 ?
- parent_id            integer                ?
- tags                 string[]               ?
- id                   integer                
- created_at           string(date-time)      
- updated_at           string(date-time)      
- children             KnowledgeGraph[]       ?

### POST /api/v1/business/knowledge-graph (认证: 是)
> Create Knowledge Graph

**请求字段:**
- concept_name         string                 
- description          string                 ?
- parent_id            integer                ?
- tags                 string[]               ?

**响应字段:**
- concept_name         string                 
- description          string                 ?
- parent_id            integer                ?
- tags                 string[]               ?
- id                   integer                
- created_at           string(date-time)      
- updated_at           string(date-time)      
- children             KnowledgeGraph[]       ?

### GET /api/v1/business/ai-strategy (认证: 是)
> List Ai Strategy

**响应:** 数组
元素字段:
- name                 string                 
- model_name           string                 
- temperature          number                 ?
- max_tokens           integer                ?
- system_prompt        string                 
- is_active            boolean                ?
- id                   integer                
- created_at           string(date-time)      
- updated_at           string(date-time)      

### POST /api/v1/business/ai-strategy (认证: 是)
> Create Ai Strategy

**请求字段:**
- name                 string                 
- model_name           string                 
- temperature          number                 ?
- max_tokens           integer                ?
- system_prompt        string                 
- is_active            boolean                ?

**响应字段:**
- name                 string                 
- model_name           string                 
- temperature          number                 ?
- max_tokens           integer                ?
- system_prompt        string                 
- is_active            boolean                ?
- id                   integer                
- created_at           string(date-time)      
- updated_at           string(date-time)      

### GET /api/v1/business/interview-config (认证: 是)
> List Interview Config

**响应:** 数组
元素字段:
- name                 string                 
- video_resolution     string                 ?
- audio_codec          string                 ?
- enable_recording     boolean                ?
- max_duration_minutes integer                ?
- job_position_id      integer                ?
- strategy_id          integer                ?
- max_rounds           integer                ?
- id                   integer                
- created_at           string(date-time)      
- updated_at           string(date-time)      

### POST /api/v1/business/interview-config (认证: 是)
> Create Interview Config

**请求字段:**
- name                 string                 
- video_resolution     string                 ?
- audio_codec          string                 ?
- enable_recording     boolean                ?
- max_duration_minutes integer                ?
- job_position_id      integer                ?
- strategy_id          integer                ?
- max_rounds           integer                ?

**响应字段:**
- name                 string                 
- video_resolution     string                 ?
- audio_codec          string                 ?
- enable_recording     boolean                ?
- max_duration_minutes integer                ?
- job_position_id      integer                ?
- strategy_id          integer                ?
- max_rounds           integer                ?
- id                   integer                
- created_at           string(date-time)      
- updated_at           string(date-time)      

### GET /api/v1/business/interview-session (认证: 是)
> List Interview Session

**响应:** 数组
元素字段:
- candidate_id         integer                
- config_id            integer                
- strategy_id          integer                ?
- status               string                 ?
- current_round        integer                ?
- summary              string                 ?
- id                   integer                
- score                number                 ?
- feedback             string                 ?
- start_time           string(date-time)      ?
- end_time             string(date-time)      ?
- created_at           string(date-time)      

### POST /api/v1/business/interview-session (认证: 是)
> Create Interview Session

**请求字段:**
- candidate_id         integer                
- config_id            integer                
- strategy_id          integer                ?
- status               string                 ?
- current_round        integer                ?
- summary              string                 ?

**响应字段:**
- candidate_id         integer                
- config_id            integer                
- strategy_id          integer                ?
- status               string                 ?
- current_round        integer                ?
- summary              string                 ?
- id                   integer                
- score                number                 ?
- feedback             string                 ?
- start_time           string(date-time)      ?
- end_time             string(date-time)      ?
- created_at           string(date-time)      

### GET /api/v1/business/agent-state (认证: 是)
> List Agent State

**响应:** 数组
元素字段:
- status               string                 
- current_session_id   string                 ?
- metadata_info        object                 ?
- id                   integer                
- agent_id             string                 
- agent_type           string                 
- last_heartbeat       string(date-time)      

## System 系统 模块契约摘要

### GET /api/v1/system/config (认证: 是)
> List System Configs

**响应:** 数组
元素字段:
- key                  string                 
- value                object                 
- description          string                 ?
- id                   integer                
- updated_at           string(date-time)      

### POST /api/v1/system/config (认证: 是)
> Create System Config

**请求字段:**
- key                  string                 
- value                object                 
- description          string                 ?

**响应字段:**
- key                  string                 
- value                object                 
- description          string                 ?
- id                   integer                
- updated_at           string(date-time)      

### GET /api/v1/system/audit-log (认证: 是)
> List Audit Logs

**响应:** 数组
元素字段:
- user_id              integer                ?
- action               string                 
- resource             string                 
- ip_address           string                 ?
- details              object                 ?
- id                   integer                
- created_at           string(date-time)      

### GET /api/v1/system/health (认证: 否)
> Health Check

**响应字段:**
- status               string                 
- version              string                 
- checks               object                 
- timestamp            string(date-time)      

### GET /api/v1/system/announcements (认证: 否)
> List Announcements

**响应:** 数组
元素字段:
- id                   integer                
- title                string                 
- content              string                 
- is_active            boolean                ?
- priority             integer                ?
- published_at         string(date-time)      ?
- expires_at           string(date-time)      ?
- created_at           string(date-time)      

## RBAC 权限 模块契约摘要

### GET /api/v1/rbac/roles (认证: 是)
> List Roles

**响应:** 数组
元素字段:
- name                 string                 
- description          string                 ?
- parent_id            integer                ?
- id                   integer                
- created_at           string(date-time)      
- updated_at           string(date-time)      
- permissions          Permission[]           ?

### POST /api/v1/rbac/roles (认证: 是)
> Create Role

**请求字段:**
- name                 string                 
- description          string                 ?
- parent_id            integer                ?
- permission_ids       integer[]              ?

**响应字段:**
- name                 string                 
- description          string                 ?
- parent_id            integer                ?
- id                   integer                
- created_at           string(date-time)      
- updated_at           string(date-time)      
- permissions          Permission[]           ?

### POST /api/v1/rbac/roles/{role_id}/permissions (认证: 是)
> Assign Permissions To Role

**查询参数:**
- role_id              integer                

**请求字段:**

**响应字段:**
- name                 string                 
- description          string                 ?
- parent_id            integer                ?
- id                   integer                
- created_at           string(date-time)      
- updated_at           string(date-time)      
- permissions          Permission[]           ?

### POST /api/v1/rbac/users/{user_id}/roles (认证: 是)
> Assign Role To User

**查询参数:**
- user_id              integer                

**请求字段:**

**响应:** string → 前端: string (如 "ok")

### GET /api/v1/rbac/permissions (认证: 是)
> List Permissions

**响应:** 数组
元素字段:
- name                 string                 
- description          string                 ?
- resource             string                 
- action               string                 
- id                   integer                
- created_at           string(date-time)      
- updated_at           string(date-time)      

## Job 岗位 模块契约摘要

### POST /api/v1/jobs (认证: 是)
> Create Job Position

**请求字段:**
- title                string                 
- description          string                 ?
- level                string                 ?
- industry             string                 ?
- company              string                 ?
- location             string                 ?
- salary_range         string                 ?
- requirements         string                 ?
- skill_ids            integer[]              ?

**响应字段:**
- title                string                 
- description          string                 ?
- level                string                 ?
- industry             string                 ?
- company              string                 ?
- location             string                 ?
- salary_range         string                 ?
- requirements         string                 ?
- id                   integer                
- created_at           string(date-time)      
- updated_at           string(date-time)      
- required_skills      KnowledgeGraph[]       ?

### GET /api/v1/jobs (认证: 否)
> List Job Positions

**查询参数:**
- skip                 integer                ?
- limit                integer                ?

**响应:** 数组
元素字段:
- title                string                 
- description          string                 ?
- level                string                 ?
- industry             string                 ?
- company              string                 ?
- location             string                 ?
- salary_range         string                 ?
- requirements         string                 ?
- id                   integer                
- created_at           string(date-time)      
- updated_at           string(date-time)      
- required_skills      KnowledgeGraph[]       ?

### GET /api/v1/jobs/{job_id}/skill-tree (认证: 否)
> Get Skill Tree

**查询参数:**
- job_id               integer                

**响应:** 空对象 `{}`

### GET /api/v1/jobs/{job_id}/match (认证: 是)
> Get Job Match

**查询参数:**
- job_id               integer                

**响应:** number

## Assessment 测评 模块契约摘要

### POST /api/v1/assessments (认证: 是)
> Create Assessment

**请求字段:**
- title                string                 
- description          string                 ?
- job_position_id      integer                ?
- questions            QuestionCreate[]       ?

**响应字段:**
- title                string                 
- description          string                 ?
- job_position_id      integer                ?
- id                   integer                
- created_at           string(date-time)      
- updated_at           string(date-time)      
- questions            Question[]             ?

### GET /api/v1/assessments (认证: 否)
> List Assessments

**查询参数:**
- skip                 integer                ?
- limit                integer                ?

**响应:** 数组
元素字段:
- title                string                 
- description          string                 ?
- job_position_id      integer                ?
- id                   integer                
- created_at           string(date-time)      
- updated_at           string(date-time)      
- questions_count      integer                ?

### POST /api/v1/assessments/submit (认证: 是)
> Submit Assessment

**请求字段:**
- assessment_id        integer                
- answers              AssessmentSubmitItem[] 

**响应字段:**
- id                   integer                
- user_id              integer                
- assessment_id        integer                
- total_score          number                 
- details              object                 
- created_at           string(date-time)      

### GET /api/v1/assessments/{assessment_id}/result (认证: 是)
> Get Assessment Result

**查询参数:**
- assessment_id        integer                

**响应字段:**
- id                   integer                
- user_id              integer                
- assessment_id        integer                
- total_score          number                 
- details              object                 
- created_at           string(date-time)      

## Learning 学习 模块契约摘要

### POST /api/v1/learning/courses (认证: 否)
> Create Course

**请求字段:**
- title                string                 
- description          string                 ?
- level                string                 ?
- cover_url            string                 ?

**响应字段:**
- title                string                 
- description          string                 ?
- level                string                 ?
- cover_url            string                 ?
- id                   integer                
- created_at           string(date-time)      
- updated_at           string(date-time)      
- materials            CourseMaterialResponse[] ?

### GET /api/v1/learning/courses (认证: 否)
> Get Courses

**查询参数:**
- skip                 integer                ?
- limit                integer                ?

**响应:** 数组
元素字段:
- title                string                 
- description          string                 ?
- level                string                 ?
- cover_url            string                 ?
- id                   integer                
- created_at           string(date-time)      
- updated_at           string(date-time)      
- materials            CourseMaterialResponse[] ?

### POST /api/v1/learning/materials (认证: 否)
> Add Material

**请求字段:**
- title                string                 
- material_type        MaterialType           
- url                  string                 
- duration             integer                ?
- order_num            integer                ?
- knowledge_graph_id   integer                ?
- course_id            integer                

**响应字段:**
- title                string                 
- material_type        MaterialType           
- url                  string                 
- duration             integer                ?
- order_num            integer                ?
- knowledge_graph_id   integer                ?
- id                   integer                
- course_id            integer                
- created_at           string(date-time)      

### POST /api/v1/learning/progress/update (认证: 是)
> Update Progress

**查询参数:**
- course_id            integer                
- material_id          integer                

**请求字段:**
- progress_percent     number                 
- is_completed         boolean                ?

**响应字段:**
- progress_percent     number                 
- is_completed         boolean                ?
- id                   integer                
- user_id              integer                
- course_id            integer                
- material_id          integer                
- last_accessed_at     string(date-time)      

### GET /api/v1/learning/progress/{course_id} (认证: 是)
> Get Progress

**查询参数:**
- course_id            integer                

**响应:** 数组
元素字段:
- progress_percent     number                 
- is_completed         boolean                ?
- id                   integer                
- user_id              integer                
- course_id            integer                
- material_id          integer                
- last_accessed_at     string(date-time)      

### POST /api/v1/learning/collections (认证: 是)
> Add To Collection

**请求字段:**
- title                string                 
- description          string                 ?
- category             string                 ?
- difficulty           string                 ?
- question_ids         integer[]              ?

**响应字段:**
- id                   integer                
- user_id              integer                
- title                string                 
- description          string                 ?
- category             string                 ?
- difficulty           string                 ?
- questions            CollectionQuestionResponse[] ?
- created_at           string(date-time)      

### GET /api/v1/learning/collections (认证: 是)
> Get Collections

**查询参数:**
- skip                 integer                ?
- limit                integer                ?

**响应:** 数组
元素字段:
- id                   integer                
- user_id              integer                
- title                string                 
- description          string                 ?
- category             string                 ?
- difficulty           string                 ?
- questions            CollectionQuestionResponse[] ?
- created_at           string(date-time)      

### POST /api/v1/learning/wrong-questions (认证: 是)
> Record Wrong Question

**请求字段:**
- question_id          integer                
- wrong_answer         any                    

**响应字段:**
- id                   integer                
- user_id              integer                
- question_id          integer                
- wrong_answer         any                    
- answer_count         integer                
- is_mastered          boolean                
- last_answered_at     string(date-time)      

### GET /api/v1/learning/wrong-questions (认证: 是)
> Get Wrong Questions

**查询参数:**
- skip                 integer                ?
- limit                integer                ?

**响应:** 数组
元素字段:
- id                   integer                
- user_id              integer                
- question_id          integer                
- wrong_answer         any                    
- answer_count         integer                
- is_mastered          boolean                
- last_answered_at     string(date-time)      

### POST /api/v1/learning/wrong-questions/{question_id}/master (认证: 是)
> Mark Wrong Question Mastered

**查询参数:**
- question_id          integer                

**响应字段:**
- id                   integer                
- user_id              integer                
- question_id          integer                
- wrong_answer         any                    
- answer_count         integer                
- is_mastered          boolean                
- last_answered_at     string(date-time)      

### POST /api/v1/learning/badges (认证: 否)
> Create Badge

**请求字段:**
- name                 string                 
- description          string                 ?
- icon_url             string                 ?
- condition_type       string                 
- condition_value      string                 ?

**响应字段:**
- name                 string                 
- description          string                 ?
- icon_url             string                 ?
- condition_type       string                 
- condition_value      string                 ?
- id                   integer                
- created_at           string(date-time)      

### GET /api/v1/learning/badges (认证: 否)
> Get Badges

**查询参数:**
- skip                 integer                ?
- limit                integer                ?

**响应:** 数组
元素字段:
- name                 string                 
- description          string                 ?
- icon_url             string                 ?
- condition_type       string                 
- condition_value      string                 ?
- id                   integer                
- created_at           string(date-time)      

### POST /api/v1/learning/badges/award/{badge_id} (认证: 是)
> Award Badge

**查询参数:**
- badge_id             integer                

**响应字段:**
- id                   integer                
- user_id              integer                
- badge_id             integer                
- awarded_at           string(date-time)      
- tx_hash              string                 ?

### GET /api/v1/learning/my-badges (认证: 是)
> Get My Badges

**响应:** 数组
元素字段:
- id                   integer                
- user_id              integer                
- badge_id             integer                
- awarded_at           string(date-time)      
- tx_hash              string                 ?

## Community 社区 模块契约摘要

### POST /api/v1/community/posts (认证: 是)
> Create Post

**请求字段:**
- title                string                 
- content              string                 
- category             string                 
- status               string                 ?

**响应字段:**
- title                string                 
- content              string                 
- category             string                 
- status               string                 ?
- id                   integer                
- user_id              integer                
- ai_analysis_status   string                 
- ai_review_content    string                 ?
- created_at           string(date-time)      
- updated_at           string(date-time)      
- likes_count          integer                ?
- comments_count       integer                ?

### GET /api/v1/community/posts/feed (认证: 否)
> Get Feed

**查询参数:**
- skip                 integer                ?
- limit                integer                ?
- keyword              string                 ?

**响应:** 数组
元素字段:
- title                string                 
- content              string                 
- category             string                 
- status               string                 ?
- id                   integer                
- user_id              integer                
- ai_analysis_status   string                 
- ai_review_content    string                 ?
- created_at           string(date-time)      
- updated_at           string(date-time)      
- likes_count          integer                ?
- comments_count       integer                ?

### GET /api/v1/community/posts/{post_id} (认证: 否)
> Get Post

**查询参数:**
- post_id              integer                

**响应字段:**
- title                string                 
- content              string                 
- category             string                 
- status               string                 ?
- id                   integer                
- user_id              integer                
- ai_analysis_status   string                 
- ai_review_content    string                 ?
- created_at           string(date-time)      
- updated_at           string(date-time)      
- likes_count          integer                ?
- comments_count       integer                ?

### PUT /api/v1/community/posts/{post_id} (认证: 是)
> Update Post

**查询参数:**
- post_id              integer                

**请求字段:**
- title                string                 ?
- content              string                 ?
- category             string                 ?
- status               string                 ?

**响应字段:**
- title                string                 
- content              string                 
- category             string                 
- status               string                 ?
- id                   integer                
- user_id              integer                
- ai_analysis_status   string                 
- ai_review_content    string                 ?
- created_at           string(date-time)      
- updated_at           string(date-time)      
- likes_count          integer                ?
- comments_count       integer                ?

### DELETE /api/v1/community/posts/{post_id} (认证: 是)
> Delete Post

**查询参数:**
- post_id              integer                

**响应:** boolean → 前端: boolean

### POST /api/v1/community/posts/{post_id}/comments (认证: 是)
> Create Comment

**查询参数:**
- post_id              integer                

**请求字段:**
- content              string                 
- parent_id            integer                ?
- post_id              integer                

**响应字段:**
- content              string                 
- parent_id            integer                ?
- id                   integer                
- post_id              integer                
- user_id              integer                
- created_at           string(date-time)      
- updated_at           string(date-time)      

### GET /api/v1/community/posts/{post_id}/comments (认证: 否)
> Get Post Comments

**查询参数:**
- post_id              integer                
- skip                 integer                ?
- limit                integer                ?

**响应:** 数组
元素字段:
- content              string                 
- parent_id            integer                ?
- id                   integer                
- post_id              integer                
- user_id              integer                
- created_at           string(date-time)      
- updated_at           string(date-time)      

### POST /api/v1/community/posts/{post_id}/like (认证: 是)
> Toggle Like

**查询参数:**
- post_id              integer                

**响应:** boolean → 前端: boolean

### POST /api/v1/community/users/{user_id}/follow (认证: 是)
> Toggle Follow

**查询参数:**
- user_id              integer                

**响应:** boolean → 前端: boolean

### POST /api/v1/community/posts/{post_id}/ai-review (认证: 是)
> Trigger Ai Review

**查询参数:**
- post_id              integer                

**响应:** string → 前端: string (如 "ok")

### GET /api/v1/community/hot-topics (认证: 否)
> Get Hot Topics

**查询参数:**
- skip                 integer                ?
- limit                integer                ?

**响应:** 数组
元素字段:
- id                   integer                
- title                string                 
- posts_count          integer                ?
- category             string                 

### GET /api/v1/community/active-users (认证: 否)
> Get Active Users

**查询参数:**
- skip                 integer                ?
- limit                integer                ?

**响应:** 数组
元素字段:
- id                   integer                
- username             string                 
- avatar_url           string                 ?
- posts_count          integer                ?
- followers_count      integer                ?

## Interview 面试 模块契约摘要

### POST /api/v1/interview/sessions (认证: 是)
> Create Session

**请求字段:**
- job_position_id      integer                ?
- strategy_id          integer                ?
- max_rounds           integer                ?

**响应字段:**
- id                   integer                
- candidate_id         integer                
- config_id            integer                ?
- strategy_id          integer                ?
- status               string                 
- current_round        integer                ?
- score                number                 ?
- summary              string                 ?
- start_time           string(date-time)      ?
- end_time             string(date-time)      ?
- created_at           string(date-time)      
- conversation_turns   ConversationTurnResponse[] ?

### GET /api/v1/interview/sessions (认证: 是)
> List Sessions

**查询参数:**
- status               string                 ?
- offset               integer                ?
- limit                integer                ?

**响应:** 数组
元素字段:
- id                   integer                
- candidate_id         integer                
- status               string                 
- current_round        integer                ?
- score                number                 ?
- start_time           string(date-time)      ?
- end_time             string(date-time)      ?
- created_at           string(date-time)      

### GET /api/v1/interview/sessions/{session_id} (认证: 是)
> Get Session

**查询参数:**
- session_id           integer                

**响应字段:**
- id                   integer                
- candidate_id         integer                
- config_id            integer                ?
- strategy_id          integer                ?
- status               string                 
- current_round        integer                ?
- score                number                 ?
- summary              string                 ?
- start_time           string(date-time)      ?
- end_time             string(date-time)      ?
- created_at           string(date-time)      
- conversation_turns   ConversationTurnResponse[] ?

### POST /api/v1/interview/sessions/{session_id}/start (认证: 是)
> Start Interview

**查询参数:**
- session_id           integer                

**响应字段:**
- session_id           integer                
- opening_message      string                 
- status               string                 

### POST /api/v1/interview/sessions/{session_id}/chat (认证: 是)
> Interview Chat

**查询参数:**
- session_id           integer                

**请求字段:**
- message              string                 

**响应:** SSE 流式传输 (text/event-stream)

### POST /api/v1/interview/sessions/{session_id}/end (认证: 是)
> End Interview

**查询参数:**
- session_id           integer                

**响应字段:**
- id                   integer                
- candidate_id         integer                
- config_id            integer                ?
- strategy_id          integer                ?
- status               string                 
- current_round        integer                ?
- score                number                 ?
- summary              string                 ?
- start_time           string(date-time)      ?
- end_time             string(date-time)      ?
- created_at           string(date-time)      
- conversation_turns   ConversationTurnResponse[] ?

### POST /api/v1/interview/sessions/{session_id}/cancel (认证: 是)
> Cancel Interview

**查询参数:**
- session_id           integer                

**响应字段:**
- id                   integer                
- candidate_id         integer                
- config_id            integer                ?
- strategy_id          integer                ?
- status               string                 
- current_round        integer                ?
- score                number                 ?
- summary              string                 ?
- start_time           string(date-time)      ?
- end_time             string(date-time)      ?
- created_at           string(date-time)      
- conversation_turns   ConversationTurnResponse[] ?

### GET /api/v1/interview/sessions/{session_id}/report (认证: 是)
> Get Interview Report

**查询参数:**
- session_id           integer                

**响应字段:**
- id                   integer                
- session_id           integer                
- content_score        number                 ?
- depth_score          number                 ?
- logic_score          number                 ?
- match_score          number                 ?
- overall_score        number                 ?
- clarity_score        number                 ?
- confidence_score     number                 ?
- strength_areas       any[]                  ?
- weakness_areas       any[]                  ?
- improvement_plan     any[]                  ?
- offer_recommendation boolean                ?
- full_report_text     string                 ?
- status               string                 ?
- created_at           string(date-time)      ?
- updated_at           string(date-time)      ?

### GET /api/v1/interview/questions (认证: 是)
> Get Question Bank

**查询参数:**
- skip                 integer                ?
- limit                integer                ?

**响应:** 数组
元素字段:
- id                   integer                
- content              string                 
- question_type        string                 
- difficulty           string                 ?

### GET /api/v1/interview/game/levels (认证: 是)
> Get Game Levels

**响应:** 数组
元素字段:
- id                   integer                
- name                 string                 
- description          string                 ?
- difficulty           string                 
- is_unlocked          boolean                ?
- questions_count      integer                ?

### GET /api/v1/interview/game/stats (认证: 是)
> Get Game Stats

**响应字段:**
- total_xp             integer                ?
- current_level        integer                ?
- completed_challenges integer                ?
- accuracy_rate        number                 ?

### GET /api/v1/interview/game/achievements (认证: 是)
> Get Game Achievements

**响应:** 数组
元素字段:
- id                   integer                
- name                 string                 
- description          string                 ?
- icon_url             string                 ?
- is_unlocked          boolean                ?
- unlocked_at          string(date-time)      ?

### GET /api/v1/interview/game/leaderboard (认证: 否)
> Get Leaderboard

**查询参数:**
- skip                 integer                ?
- limit                integer                ?

**响应:** 数组
元素字段:
- rank                 integer                
- user_id              integer                
- username             string                 
- avatar_url           string                 ?
- score                number                 

## untagged 模块契约摘要

### GET /health (认证: 否)
> Health Check

