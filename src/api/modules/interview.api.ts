import { get, post } from '@/utils/request'
import type { InterviewSession, InterviewQuestion, GameLevel, GameStats, GameAchievement, LeaderboardEntry } from '../types/interview.types'
import type { ResponseModel } from '../types/response.types'

const BASE_URL = '/interview'

export const interviewApi = {
  getSessions(): Promise<ResponseModel<InterviewSession[]>> {
    return get<ResponseModel<InterviewSession[]>>(`${BASE_URL}/sessions`)
  },

  getSession(id: string): Promise<ResponseModel<InterviewSession>> {
    return get<ResponseModel<InterviewSession>>(`${BASE_URL}/sessions/${id}`)
  },

  startSession(data: { jobTitle: string; company: string; type?: string }): Promise<ResponseModel<InterviewSession>> {
    return post<ResponseModel<InterviewSession>>(`${BASE_URL}/sessions/start`, data)
  },

  submitAnswer(sessionId: string, questionId: string, answer: string): Promise<ResponseModel<{ score: number }>> {
    return post<ResponseModel<{ score: number }>>(`${BASE_URL}/sessions/${sessionId}/answer`, { questionId, answer })
  },

  completeSession(sessionId: string): Promise<ResponseModel<InterviewSession>> {
    return post<ResponseModel<InterviewSession>>(`${BASE_URL}/sessions/${sessionId}/complete`, {})
  },

  getQuestions(params?: { category?: string; difficulty?: string; type?: string }): Promise<ResponseModel<InterviewQuestion[]>> {
    return get<ResponseModel<InterviewQuestion[]>>(`${BASE_URL}/questions`, params as any)
  },

  getGameLevels(): Promise<ResponseModel<GameLevel[]>> {
    return get<ResponseModel<GameLevel[]>>(`${BASE_URL}/game/levels`)
  },

  getGameStats(): Promise<ResponseModel<GameStats>> {
    return get<ResponseModel<GameStats>>(`${BASE_URL}/game/stats`)
  },

  getGameAchievements(): Promise<ResponseModel<GameAchievement[]>> {
    return get<ResponseModel<GameAchievement[]>>(`${BASE_URL}/game/achievements`)
  },

  getLeaderboard(): Promise<ResponseModel<LeaderboardEntry[]>> {
    return get<ResponseModel<LeaderboardEntry[]>>(`${BASE_URL}/game/leaderboard`)
  }
}
