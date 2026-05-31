import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { interviewApi } from '@/api/modules/interview.api'
import type {
  InterviewQuestion,
  InterviewSession,
  GameLevel,
  GameStats,
  GameAchievement,
  LeaderboardEntry
} from '@/api/types/interview.types'

export const useInterviewStore = defineStore('interview', () => {
  const sessions = ref<InterviewSession[]>([])
  const currentSession = ref<InterviewSession | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const gameLevels = ref<GameLevel[]>([])
  const gameStats = ref<GameStats | null>(null)
  const gameAchievements = ref<GameAchievement[]>([])
  const leaderboard = ref<LeaderboardEntry[]>([])

  const activeSessions = computed(() =>
    sessions.value.filter(s => s.status === 'in_progress' || s.status === 'pending')
  )

  const completedSessions = computed(() =>
    sessions.value.filter(s => s.status === 'completed')
  )

  async function fetchSessions(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const response = await interviewApi.getSessions()
      sessions.value = response.data
    } catch (err: any) {
      error.value = err?.response?.data?.message || err?.message || '获取面试记录失败'
      console.error('[Interview] fetchSessions error:', err)
    } finally {
      loading.value = false
    }
  }

  async function startInterview(jobTitle: string, company: string, type?: string): Promise<InterviewSession | null> {
    loading.value = true
    error.value = null
    try {
      const response = await interviewApi.startSession({ jobTitle, company, type })
      const session = response.data
      sessions.value.unshift(session)
      currentSession.value = session
      return session
    } catch (err: any) {
      error.value = err?.response?.data?.message || err?.message || '开始面试失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function submitAnswer(sessionId: string, questionId: string, answer: string): Promise<number> {
    try {
      const response = await interviewApi.submitAnswer(sessionId, questionId, answer)
      return response.data.score
    } catch (err: any) {
      console.error('[Interview] submitAnswer error:', err)
      return 0
    }
  }

  async function completeInterview(sessionId: string): Promise<void> {
    try {
      const response = await interviewApi.completeSession(sessionId)
      const completed = response.data
      if (currentSession.value?.id === sessionId) {
        currentSession.value = completed
      }
      const idx = sessions.value.findIndex(s => s.id === sessionId)
      if (idx !== -1) {
        sessions.value[idx] = completed
      }
    } catch (err: any) {
      console.error('[Interview] completeInterview error:', err)
    }
  }

  function answerQuestion(questionId: string, answer: string, score: number) {
    if (!currentSession.value) return
    const question = currentSession.value.questions.find(q => q.id === questionId)
    if (question) {
      question.answered = true
      question.answer = answer
      question.score = score
    }
  }

  function completeLocalInterview() {
    if (!currentSession.value) return
    currentSession.value.status = 'completed'
    currentSession.value.endTime = new Date().toISOString()
    currentSession.value.totalScore = currentSession.value.questions
      .reduce((sum, q) => sum + (q.score || 0), 0)
  }

  function getSessionById(id: string) {
    return sessions.value.find(s => s.id === id)
  }

  async function fetchGameLevels(): Promise<void> {
    try {
      const response = await interviewApi.getGameLevels()
      gameLevels.value = response.data
    } catch (err: any) {
      console.error('[Interview] fetchGameLevels error:', err)
    }
  }

  async function fetchGameStats(): Promise<void> {
    try {
      const response = await interviewApi.getGameStats()
      gameStats.value = response.data
    } catch (err: any) {
      console.error('[Interview] fetchGameStats error:', err)
    }
  }

  async function fetchGameAchievements(): Promise<void> {
    try {
      const response = await interviewApi.getGameAchievements()
      gameAchievements.value = response.data
    } catch (err: any) {
      console.error('[Interview] fetchGameAchievements error:', err)
    }
  }

  async function fetchLeaderboard(): Promise<void> {
    try {
      const response = await interviewApi.getLeaderboard()
      leaderboard.value = response.data
    } catch (err: any) {
      console.error('[Interview] fetchLeaderboard error:', err)
    }
  }

  async function fetchAllGameData(): Promise<void> {
    loading.value = true
    try {
      await Promise.all([
        fetchGameLevels(),
        fetchGameStats(),
        fetchGameAchievements(),
        fetchLeaderboard()
      ])
    } finally {
      loading.value = false
    }
  }

  return {
    sessions,
    currentSession,
    loading,
    error,
    gameLevels,
    gameStats,
    gameAchievements,
    leaderboard,
    activeSessions,
    completedSessions,
    fetchSessions,
    startInterview,
    submitAnswer,
    completeInterview,
    answerQuestion,
    completeLocalInterview,
    getSessionById,
    fetchGameLevels,
    fetchGameStats,
    fetchGameAchievements,
    fetchLeaderboard,
    fetchAllGameData
  }
})
