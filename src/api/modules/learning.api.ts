import { get, post } from '@/utils/request'
import type {
  Course,
  CourseCreate,
  Material,
  MaterialCreate,
  LearningProgress,
  Collection,
  WrongQuestion,
  Badge,
  UserBadge
} from '../types/learning.types'
import type { ResponseModel, PaginationParams } from '../types/response.types'

const BASE_URL = '/learning'

export const learningApi = {
  createCourse(data: CourseCreate): Promise<ResponseModel<Course>> {
    return post<ResponseModel<Course>>(`${BASE_URL}/courses`, data)
  },

  getCourses(params?: PaginationParams): Promise<ResponseModel<Course[]>> {
    return get<ResponseModel<Course[]>>(`${BASE_URL}/courses`, params as Record<string, any>)
  },

  addMaterial(data: MaterialCreate): Promise<ResponseModel<Material>> {
    return post<ResponseModel<Material>>(`${BASE_URL}/materials`, data)
  },

  updateProgress(
    courseId: number,
    progress: number
  ): Promise<ResponseModel<LearningProgress>> {
    return post<ResponseModel<LearningProgress>>(`${BASE_URL}/progress/update`, {
      course_id: courseId,
      progress
    })
  },

  getProgress(courseId: number): Promise<ResponseModel<LearningProgress>> {
    return get<ResponseModel<LearningProgress>>(`${BASE_URL}/progress/${courseId}`)
  },

  addToCollection(data: Record<string, any>): Promise<ResponseModel<Collection>> {
    return post<ResponseModel<Collection>>(`${BASE_URL}/collections`, data)
  },

  getCollections(params?: PaginationParams): Promise<ResponseModel<Collection[]>> {
    return get<ResponseModel<Collection[]>>(`${BASE_URL}/collections`, params as Record<string, any>)
  },

  recordWrongQuestion(data: Record<string, any>): Promise<ResponseModel<WrongQuestion>> {
    return post<ResponseModel<WrongQuestion>>(`${BASE_URL}/wrong-questions`, data)
  },

  getWrongQuestions(params?: PaginationParams): Promise<ResponseModel<WrongQuestion[]>> {
    return get<ResponseModel<WrongQuestion[]>>(
      `${BASE_URL}/wrong-questions`,
      params as Record<string, any>
    )
  },

  markWrongQuestionMastered(questionId: number): Promise<ResponseModel<string>> {
    return post<ResponseModel<string>>(`${BASE_URL}/wrong-questions/${questionId}/master`)
  },

  createBadge(data: Record<string, any>): Promise<ResponseModel<Badge>> {
    return post<ResponseModel<Badge>>(`${BASE_URL}/badges`, data)
  },

  getBadges(): Promise<ResponseModel<Badge[]>> {
    return get<ResponseModel<Badge[]>>(`${BASE_URL}/badges`)
  },

  awardBadge(badgeId: number): Promise<ResponseModel<UserBadge>> {
    return post<ResponseModel<UserBadge>>(`${BASE_URL}/badges/award/${badgeId}`)
  },

  getMyBadges(): Promise<ResponseModel<UserBadge[]>> {
    return get<ResponseModel<UserBadge[]>>(`${BASE_URL}/my-badges`)
  }
}
