export interface UserResponse {
  id: number
  username: string
  email: string
  phone?: string
  is_active: boolean
  created_at: string
  updated_at: string
  roles: RoleResponse[]
  profile?: UserProfileResponse
}

export interface UserProfileResponse {
  id: number
  user_id: number
  avatar_url?: string
  education?: string
  target_position?: string
  work_years?: number
  created_at: string
  updated_at: string
}

export interface UserProfileUpdateRequest {
  avatar_url?: string
  education?: string
  target_position?: string
  work_years?: number
}

export interface RoleResponse {
  id: number
  name: string
  description?: string
  parent_id?: number
  created_at: string
  updated_at: string
  permissions: PermissionResponse[]
}

export interface PermissionResponse {
  id: number
  name: string
  description?: string
  resource: string
  action: string
  created_at: string
  updated_at: string
}
