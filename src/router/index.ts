import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import LoginForm from '../components/LoginForm.vue'
import { useUserStore } from '../stores/user'
import { isLoggedIn as checkTokenExists } from '../utils/auth'

const Interview = () => import('../views/Interview.vue')
const Profile = () => import('../views/Profile.vue')
const Matching = () => import('../views/Matching.vue')
const Growth = () => import('../views/Growth.vue')
const Community = () => import('../views/Community.vue')
const Knowledge = () => import('../views/Knowledge.vue')
const GameInterview = () => import('../views/GameInterview.vue')
const LevelDetail = () => import('../views/LevelDetail.vue')
const LevelChallenge = () => import('../views/LevelChallenge.vue')
const Report = () => import('../views/Report.vue')
const JobSpecificQuestionBank = () => import('../views/JobSpecificQuestionBank.vue')
const Practice = () => import('../views/Practice.vue')
const PathPractice = () => import('../views/PathPractice.vue')

const WHITE_LIST = ['/', '/login', '/matching']

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: '首页', hideSidebar: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginForm,
    meta: { title: '登录', hideSidebar: true, requiresAuth: false }
  },
  {
    path: '/interview',
    name: 'Interview',
    component: Interview,
    meta: { title: '面试实战', requiresAuth: true }
  },
  {
    path: '/job-specific-question-bank',
    name: 'JobSpecificQuestionBank',
    component: JobSpecificQuestionBank,
    meta: { title: '岗位专属题库', requiresAuth: true }
  },
  {
    path: '/game-interview',
    name: 'GameInterview',
    component: GameInterview,
    meta: { title: '游戏式面试', requiresAuth: true }
  },
  {
    path: '/game-interview/level/:id/detail',
    name: 'LevelDetail',
    component: LevelDetail,
    meta: { title: '关卡详情', requiresAuth: true }
  },
  {
    path: '/game-interview/level/:id',
    name: 'LevelChallenge',
    component: LevelChallenge,
    meta: { title: '关卡挑战', requiresAuth: true }
  },
  {
    path: '/matching',
    name: 'Matching',
    component: Matching,
    meta: { title: '岗位匹配' }
  },
  {
    path: '/growth',
    name: 'Growth',
    component: Growth,
    meta: { title: '能力提升', requiresAuth: true }
  },
  {
    path: '/community',
    name: 'Community',
    component: Community,
    meta: { title: '面试社区' }
  },
  {
    path: '/knowledge',
    name: 'Knowledge',
    component: Knowledge,
    meta: { title: '知识库' }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { title: '个人中心', requiresAuth: true }
  },
  {
    path: '/report',
    name: 'Report',
    component: Report,
    meta: { title: '面试报告', requiresAuth: true }
  },
  {
    path: '/practice/:id',
    name: 'Practice',
    component: Practice,
    meta: { title: '练习', requiresAuth: true }
  },
  {
    path: '/path-practice',
    name: 'PathPractice',
    component: PathPractice,
    meta: { title: '专项通关路径', requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, _from, next) => {
  document.title = `${to.meta.title || ''} | 面面俱到`

  const hasToken = checkTokenExists()

  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
      return
    }

    const userStore = useUserStore()
    if (!userStore.user.isAuthenticated) {
      try {
        await userStore.initialize()
      } catch {
        userStore.logout()
        next({ path: '/login', query: { redirect: to.fullPath } })
        return
      }
    }

    next()
  } else {
    const requiresAuth = to.meta.requiresAuth !== false && !WHITE_LIST.includes(to.path)

    if (requiresAuth) {
      next({ path: '/login', query: { redirect: to.fullPath } })
    } else {
      next()
    }
  }
})

export default router
