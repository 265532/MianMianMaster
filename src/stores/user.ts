import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api/modules/auth.api'
import { userApi } from '@/api/modules/user.api'
import { setToken, removeToken, isLoggedIn as checkTokenExists, getCachedUserInfo, cacheUserInfo } from '@/utils/auth'

export interface UserInfo {
  id: string
  name: string
  email: string
  avatar: string
  isAuthenticated: boolean
  role: 'user' | 'admin'
  skills: string[]
  profile?: any
}

export interface InterviewRecord {
  id: number
  date: string
  company: string
  position: string
  round: string
  type: string
  score: number
  status: string
  tags: string[]
  feedback: string
  details: {
    technical: number
    communication: number
    logic: number
    problem_solving: number
  }
}

export interface AbilityDataItem {
  current: number[]
  required: number[]
  indicators: { name: string; max: number }[]
  gapSkills: { name: string; gap: number; level: string }[]
  strengths: { name: string; score: number }[]
}

const defaultUser: UserInfo = {
  id: '',
  name: '',
  email: '',
  avatar: '',
  isAuthenticated: false,
  role: 'user',
  skills: []
}

export const useUserStore = defineStore('user', () => {
  const user = ref<UserInfo>({ ...defaultUser })
  const loading = ref(false)
  const error = ref<string | null>(null)

  const interviewHistory = ref<InterviewRecord[]>([])
  const abilityData = ref<Record<string, AbilityDataItem>>({})
  const gameInterviewData = ref<any>(null)
  const resumeData = ref<any>(null)
  const resumeDiagnosisResult = ref<any>(null)
  const dataLoading = ref(false)

  const isLoggedIn = computed(() => checkTokenExists() || user.value.isAuthenticated)
  const hasSkills = computed(() => user.value.skills.length > 0)

  const passedInterviews = computed(() =>
    interviewHistory.value.filter(i => i.status === 'passed')
  )

  const failedInterviews = computed(() =>
    interviewHistory.value.filter(i => i.status === 'failed')
  )

  async function login(username: string, password: string): Promise<boolean> {
    loading.value = true
    error.value = null

    try {
      const response = await authApi.login({ username, password })
      const tokenData = response.data

      setToken(tokenData.access_token)

      await fetchUserInfo()

      return true
    } catch (err: any) {
      error.value = err?.response?.data?.message || err?.message || '登录失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function register(
    username: string,
    email: string,
    password: string,
    phone?: string
  ): Promise<boolean> {
    loading.value = true
    error.value = null

    try {
      await authApi.register({ username, email, password, phone })
      return true
    } catch (err: any) {
      error.value = err?.response?.data?.message || err?.message || '注册失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchUserInfo(): Promise<void> {
    try {
      const response = await authApi.getUserInfo()
      const apiUser = response.data
      mapUserData(apiUser)
      user.value.isAuthenticated = true
      cacheUserInfo(user.value)
    } catch (err) {
      console.error('[UserStore] fetchUserInfo error:', err)
      logout()
    }
  }

  function mapUserData(apiUser: any): void {
    user.value = {
      id: apiUser.id?.toString() || '',
      name: apiUser.username || apiUser.email?.split('@')[0] || '',
      email: apiUser.email || '',
      avatar: apiUser.profile?.avatar_url || apiUser.avatar_url || '',
      isAuthenticated: true,
      role: apiUser.roles?.some((r: any) => r.name === 'admin') ? 'admin' : 'user',
      skills: apiUser.profile?.skills || [],
      profile: apiUser.profile
    }
  }

  function logout(): void {
    removeToken()
    user.value = { ...defaultUser }
    interviewHistory.value = []
    abilityData.value = {}
    gameInterviewData.value = null
    resumeData.value = null
    resumeDiagnosisResult.value = null
  }

  async function updateProfile(profileData: Partial<UserInfo>): Promise<void> {
    Object.assign(user.value, profileData)
    cacheUserInfo(user.value)
  }

  async function initialize(): Promise<void> {
    if (checkTokenExists()) {
      const cachedUser = getCachedUserInfo()
      if (cachedUser) {
        user.value = { ...cachedUser, isAuthenticated: true }
      } else {
        await fetchUserInfo()
      }
    }
  }

  async function fetchInterviewHistory(): Promise<void> {
    dataLoading.value = true
    try {
      const response = await userApi.getInterviewHistory()
      const data = response.data
      interviewHistory.value = data.items || data
    } catch (err: any) {
      console.error('[UserStore] fetchInterviewHistory error:', err)
    } finally {
      dataLoading.value = false
    }
  }

  async function fetchAbilityData(): Promise<void> {
    dataLoading.value = true
    try {
      const response = await userApi.getAbilityData()
      abilityData.value = response.data
    } catch (err: any) {
      console.error('[UserStore] fetchAbilityData error:', err)
    } finally {
      dataLoading.value = false
    }
  }

  async function fetchGameInterviewData(): Promise<void> {
    dataLoading.value = true
    try {
      const response = await userApi.getGameInterviewData()
      gameInterviewData.value = response.data
    } catch (err: any) {
      console.error('[UserStore] fetchGameInterviewData error:', err)
    } finally {
      dataLoading.value = false
    }
  }

  async function fetchResume(): Promise<void> {
    dataLoading.value = true
    try {
      const response = await userApi.getResume()
      resumeData.value = response.data
    } catch (err: any) {
      console.error('[UserStore] fetchResume error:', err)
    } finally {
      dataLoading.value = false
    }
  }

  async function diagnoseResume(): Promise<void> {
    dataLoading.value = true
    try {
      const response = await userApi.diagnoseResume()
      resumeDiagnosisResult.value = response.data
    } catch (err: any) {
      console.error('[UserStore] diagnoseResume error:', err)
    } finally {
      dataLoading.value = false
    }
  }

  async function fetchAllUserData(): Promise<void> {
    dataLoading.value = true
    try {
      await Promise.all([
        fetchInterviewHistory(),
        fetchAbilityData(),
        fetchGameInterviewData()
      ])
    } finally {
      dataLoading.value = false
    }
  }

  return {
    user,
    loading,
    error,
    isLoggedIn,
    hasSkills,
    interviewHistory,
    abilityData,
    gameInterviewData,
    resumeData,
    resumeDiagnosisResult,
    dataLoading,
    passedInterviews,
    failedInterviews,
    login,
    register,
    logout,
    updateProfile,
    fetchUserInfo,
    initialize,
    fetchInterviewHistory,
    fetchAbilityData,
    fetchGameInterviewData,
    fetchResume,
    diagnoseResume,
    fetchAllUserData
  }
})
