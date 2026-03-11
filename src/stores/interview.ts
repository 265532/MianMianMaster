import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface Question {
  id: string
  content: string
  type: 'technical' | 'behavioral' | 'case'
  difficulty: 'easy' | 'medium' | 'hard'
  answered: boolean
  answer?: string
  score?: number
}

interface InterviewSession {
  id: string
  jobTitle: string
  company: string
  questions: Question[]
  startTime: Date
  endTime?: Date
  totalScore?: number
  status: 'pending' | 'in_progress' | 'completed'
}

export const useInterviewStore = defineStore('interview', () => {
  // 状态
  const sessions = ref<InterviewSession[]>([])
  const currentSession = ref<InterviewSession | null>(null)
  const loading = ref(false)
  
  // 计算属性
  const activeSessions = computed(() => 
    sessions.value.filter(session => 
      session.status === 'in_progress' || session.status === 'pending'
    )
  )
  
  const completedSessions = computed(() => 
    sessions.value.filter(session => session.status === 'completed')
  )
  
  // 方法
  function startInterview(jobTitle: string, company: string, questions: Question[]) {
    const newSession: InterviewSession = {
      id: Date.now().toString(),
      jobTitle,
      company,
      questions,
      startTime: new Date(),
      status: 'in_progress'
    }
    
    sessions.value.push(newSession)
    currentSession.value = newSession
    return newSession
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
  
  function completeInterview() {
    if (!currentSession.value) return
    
    currentSession.value.status = 'completed'
    currentSession.value.endTime = new Date()
    
    // 计算总分
    const totalScore = currentSession.value.questions
      .reduce((sum, q) => sum + (q.score || 0), 0)
    
    currentSession.value.totalScore = totalScore
  }
  
  function getSessionById(id: string) {
    return sessions.value.find(session => session.id === id)
  }
  
  return {
    sessions,
    currentSession,
    loading,
    activeSessions,
    completedSessions,
    startInterview,
    answerQuestion,
    completeInterview,
    getSessionById
  }
})
