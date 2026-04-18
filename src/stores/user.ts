import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface User {
  id: string
  name: string
  email: string
  avatar: string
  isAuthenticated: boolean
  role: 'user' | 'admin'
  skills: string[]
}

export const useUserStore = defineStore('user', () => {
  // 状态
  const user = ref<User>({
    id: '',
    name: '',
    email: '',
    avatar: '',
    isAuthenticated: false,
    role: 'user',
    skills: []
  })
  
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // 计算属性
  const isLoggedIn = computed(() => user.value.isAuthenticated)
  const hasSkills = computed(() => user.value.skills.length > 0)
  
  // 方法
  function login(email: string, _password: string) {
    loading.value = true
    error.value = null
    
    // 模拟登录请求
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        user.value = {
          id: '1',
          name: '王同学',
          email: email,
          avatar: '',
          isAuthenticated: true,
          role: 'user',
          skills: ['前端开发', 'React', 'Vue']
        }
        loading.value = false
        resolve()
      }, 1000)
    })
  }
  
  function logout() {
    user.value = {
      id: '',
      name: '',
      email: '',
      avatar: '',
      isAuthenticated: false,
      role: 'user',
      skills: []
    }
  }
  
  function updateProfile(name: string, skills: string[]) {
    user.value.name = name
    user.value.skills = skills
  }
  
  return {
    user,
    loading,
    error,
    isLoggedIn,
    hasSkills,
    login,
    logout,
    updateProfile
  }
})
