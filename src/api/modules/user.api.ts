import { get, put, post } from "@/utils/request";
import type {
  UserResponse,
  UserProfileResponse,
  UserProfileUpdateRequest,
  InterviewHistoryItem,
  AbilityDataResponse,
  GameInterviewDataResponse,
  ResumeData,
  ResumeDiagnoseRequest,
  ResumeDiagnoseResult,
} from "../types/user.types";
import type {
  ChangePasswordRequest,
  ChangePhoneRequest,
} from "../types/auth.types";
import type { ResponseModel, PaginationParams } from "../types/response.types";

const BASE_URL = "/user";

export const userApi = {
  getProfile(): Promise<ResponseModel<UserResponse>> {
    return get<ResponseModel<UserResponse>>(`${BASE_URL}/profile`);
  },

  updateProfile(
    data: UserProfileUpdateRequest,
  ): Promise<ResponseModel<UserProfileResponse>> {
    return put<ResponseModel<UserProfileResponse>>(`${BASE_URL}/profile`, data);
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

  getInterviewHistory(
    params?: PaginationParams,
  ): Promise<ResponseModel<InterviewHistoryItem[]>> {
    return get<ResponseModel<InterviewHistoryItem[]>>(
      `${BASE_URL}/interview-history`,
      params as Record<string, unknown>,
    );
  },

  getAbilityData(): Promise<ResponseModel<AbilityDataResponse>> {
    return get<ResponseModel<AbilityDataResponse>>(
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

  diagnoseResume(
    data: ResumeDiagnoseRequest,
  ): Promise<ResponseModel<ResumeDiagnoseResult>> {
    return post<ResponseModel<ResumeDiagnoseResult>>(
      `${BASE_URL}/resume/diagnose`,
      data,
    );
  },
};
