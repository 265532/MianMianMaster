import { get, post } from "@/utils/request";
import type {
  Course,
  CourseCreate,
  CourseMaterial,
  MaterialCreate,
  LearningProgress,
  ProgressUpdateBody,
  Collection,
  CollectionCreate,
  WrongQuestion,
  WrongQuestionCreate,
  Badge,
  BadgeCreate,
  UserBadge,
} from "../types/learning.types";
import type { ResponseModel, PaginationParams } from "../types/response.types";

const BASE_URL = "/learning";

export const learningApi = {
  createCourse(data: CourseCreate): Promise<ResponseModel<Course>> {
    return post<ResponseModel<Course>>(`${BASE_URL}/courses`, data);
  },

  getCourses(params?: PaginationParams): Promise<ResponseModel<Course[]>> {
    return get<ResponseModel<Course[]>>(
      `${BASE_URL}/courses`,
      params as Record<string, unknown>,
    );
  },

  addMaterial(data: MaterialCreate): Promise<ResponseModel<CourseMaterial>> {
    return post<ResponseModel<CourseMaterial>>(`${BASE_URL}/materials`, data);
  },

  updateProgress(
    courseId: number,
    materialId: number,
    body: ProgressUpdateBody,
  ): Promise<ResponseModel<LearningProgress>> {
    return post<ResponseModel<LearningProgress>>(
      `${BASE_URL}/progress/update`,
      body,
      { params: { course_id: courseId, material_id: materialId } },
    );
  },

  getProgress(courseId: number): Promise<ResponseModel<LearningProgress[]>> {
    return get<ResponseModel<LearningProgress[]>>(
      `${BASE_URL}/progress/${courseId}`,
    );
  },

  createCollection(data: CollectionCreate): Promise<ResponseModel<Collection>> {
    return post<ResponseModel<Collection>>(`${BASE_URL}/collections`, data);
  },

  getCollections(params?: PaginationParams): Promise<ResponseModel<Collection[]>> {
    return get<ResponseModel<Collection[]>>(
      `${BASE_URL}/collections`,
      params as Record<string, unknown>,
    );
  },

  recordWrongQuestion(data: WrongQuestionCreate): Promise<ResponseModel<WrongQuestion>> {
    return post<ResponseModel<WrongQuestion>>(`${BASE_URL}/wrong-questions`, data);
  },

  getWrongQuestions(params?: PaginationParams): Promise<ResponseModel<WrongQuestion[]>> {
    return get<ResponseModel<WrongQuestion[]>>(
      `${BASE_URL}/wrong-questions`,
      params as Record<string, unknown>,
    );
  },

  markWrongQuestionMastered(questionId: number): Promise<ResponseModel<WrongQuestion>> {
    return post<ResponseModel<WrongQuestion>>(
      `${BASE_URL}/wrong-questions/${questionId}/master`,
    );
  },

  createBadge(data: BadgeCreate): Promise<ResponseModel<Badge>> {
    return post<ResponseModel<Badge>>(`${BASE_URL}/badges`, data);
  },

  getBadges(params?: PaginationParams): Promise<ResponseModel<Badge[]>> {
    return get<ResponseModel<Badge[]>>(`${BASE_URL}/badges`, params as Record<string, unknown>);
  },

  awardBadge(badgeId: number): Promise<ResponseModel<UserBadge>> {
    return post<ResponseModel<UserBadge>>(`${BASE_URL}/badges/award/${badgeId}`);
  },

  getMyBadges(): Promise<ResponseModel<UserBadge[]>> {
    return get<ResponseModel<UserBadge[]>>(`${BASE_URL}/my-badges`);
  },

  getPracticeBanks(params?: PaginationParams): Promise<ResponseModel<Course[]>> {
    return get<ResponseModel<Course[]>>(
      `${BASE_URL}/courses`,
      { ...params, type: "practice" } as Record<string, unknown>,
    );
  },
};
