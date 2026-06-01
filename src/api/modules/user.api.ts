import { get, put, post } from "@/utils/request";
import type {
  UserResponse,
  UserProfileUpdateRequest,
  InterviewHistoryResponse,
  AbilityDataItem,
  GameInterviewDataResponse,
  ResumeData,
  ResumeDiagnosisResult,
} from "../types/user.types";
import type {
  ChangePasswordRequest,
  ChangePhoneRequest,
} from "../types/auth.types";
import type { ResponseModel } from "../types/response.types";

const BASE_URL = "/user";

export const userApi = {
  getProfile(): Promise<ResponseModel<UserResponse>> {
    return get<ResponseModel<UserResponse>>(`${BASE_URL}/profile`);
  },

  updateProfile(
    data: UserProfileUpdateRequest,
  ): Promise<ResponseModel<UserResponse>> {
    return put<ResponseModel<UserResponse>>(`${BASE_URL}/profile`, data);
  },

  changePassword(data: ChangePasswordRequest): Promise<ResponseModel<string>> {
    return post<ResponseModel<string>>(
      `${BASE_URL}/security/change-password`,
      data,
    );
  },

  changePhone(data: ChangePhoneRequest): Promise<ResponseModel<string>> {
    return post<ResponseModel<string>>(
      `${BASE_URL}/security/change-phone`,
      data,
    );
  },

  getInterviewHistory(): Promise<ResponseModel<InterviewHistoryResponse>> {
    return get<ResponseModel<InterviewHistoryResponse>>(
      `${BASE_URL}/interview-history`,
    );
  },

  getAbilityData(): Promise<ResponseModel<Record<string, AbilityDataItem>>> {
    return get<ResponseModel<Record<string, AbilityDataItem>>>(
      `${BASE_URL}/ability-data`,
    );
  },

  getGameInterviewData(): Promise<ResponseModel<GameInterviewDataResponse>> {
    return get<ResponseModel<GameInterviewDataResponse>>(
      `${BASE_URL}/game-interview-data`,
    );
  },

  getResume(): Promise<ResponseModel<ResumeData>> {
    return get<ResponseModel<ResumeData>>(`${BASE_URL}/resume`);
  },

  diagnoseResume(): Promise<ResponseModel<ResumeDiagnosisResult>> {
    return post<ResponseModel<ResumeDiagnosisResult>>(
      `${BASE_URL}/resume/diagnose`,
      {},
    );
  },
};
