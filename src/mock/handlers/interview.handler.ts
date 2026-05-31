import type MockAdapter from 'axios-mock-adapter'
import { mockGameLevels, mockGameStats, mockGameAchievements, mockLeaderboard } from '../data/interview.mock'

function success<T>(data: T): [number, { code: number; message: string; data: T }] {
  return [200, { code: 200, message: 'success', data }]
}

export function registerInterviewHandlers(mock: MockAdapter): void {
  mock.onGet('/interview/sessions').reply(() => {
    return success([])
  })

  mock.onGet(/\/interview\/sessions\/[\w-]+$/).reply((config) => {
    return success({ id: config.url?.split('/').pop(), jobTitle: '前端开发', company: '字节跳动', questions: [], startTime: new Date().toISOString(), status: 'in_progress' })
  })

  mock.onPost('/interview/sessions/start').reply((config) => {
    const data = JSON.parse(config.data)
    return success({
      id: Date.now().toString(),
      jobTitle: data.jobTitle,
      company: data.company,
      questions: [],
      startTime: new Date().toISOString(),
      status: 'in_progress'
    })
  })

  mock.onPost(/\/interview\/sessions\/[\w-]+\/answer$/).reply(() => {
    return success({ score: 85 })
  })

  mock.onPost(/\/interview\/sessions\/[\w-]+\/complete$/).reply(() => {
    return success({ id: '1', status: 'completed', totalScore: 85 })
  })

  mock.onGet('/interview/questions').reply(() => {
    return success([])
  })

  mock.onGet('/interview/game/levels').reply(() => {
    return success(mockGameLevels)
  })

  mock.onGet('/interview/game/stats').reply(() => {
    return success(mockGameStats)
  })

  mock.onGet('/interview/game/achievements').reply(() => {
    return success(mockGameAchievements)
  })

  mock.onGet('/interview/game/leaderboard').reply(() => {
    return success(mockLeaderboard)
  })
}
