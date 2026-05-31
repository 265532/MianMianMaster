import { get, put, post } from '@/utils/request'
import type {
  UserResponse,
  UserProfileUpdateRequest
} from '../types/user.types'
import type { ChangePasswordRequest, ChangePhoneRequest } from '../types/auth.types'
import type { ResponseModel } from '../types/response.types'

const BASE_URL = '/user'

export const userApi = {
  getProfile(): Promise<ResponseModel<UserResponse>> {
    return get<ResponseModel<UserResponse>>(`${BASE_URL}/profile`)
  },

  updateProfile(data: UserProfileUpdateRequest): Promise<ResponseModel<UserResponse>> {
    return put<ResponseModel<UserResponse>>(`${BASE_URL}/profile`, data)
  },

  changePassword(data: ChangePasswordRequest): Promise<ResponseModel<string>> {
    return post<ResponseModel<string>>(`${BASE_URL}/security/change-password`, data)
  },

  changePhone(data: ChangePhoneRequest): Promise<ResponseModel<string>> {
    return post<ResponseModel<string>>(`${BASE_URL}/security/change-phone`, data)
  },

  getInterviewHistory(): Promise<ResponseModel<any>> {
    return get<ResponseModel<any>>(`${BASE_URL}/interview-history`)
  },

  getAbilityData(): Promise<ResponseModel<any>> {
    return get<ResponseModel<any>>(`${BASE_URL}/ability-data`)
  },

  getGameInterviewData(): Promise<ResponseModel<any>> {
    return get<ResponseModel<any>>(`${BASE_URL}/game-interview-data`)
  },

  getResume(): Promise<ResponseModel<any>> {
    return get<ResponseModel<any>>(`${BASE_URL}/resume`)
  },

  diagnoseResume(): Promise<ResponseModel<any>> {
    return post<ResponseModel<any>>(`${BASE_URL}/resume/diagnose`, {})
  }
}
