import type MockAdapter from 'axios-mock-adapter'
import { mockUser, mockInterviewHistory, mockAbilityData, mockGameInterviewData, mockResumeData, mockResumeDiagnosisResult } from '../data/user.mock'

function success<T>(data: T): [number, { code: number; message: string; data: T }] {
  return [200, { code: 200, message: 'success', data }]
}

export function registerUserHandlers(mock: MockAdapter): void {
  mock.onGet('/user/profile').reply(() => {
    return success(mockUser)
  })

  mock.onPut('/user/profile').reply((config) => {
    const data = JSON.parse(config.data)
    return success({
      ...mockUser,
      profile: { ...mockUser.profile, ...data }
    })
  })

  mock.onPost('/user/security/change-password').reply(() => {
    return success('PASSWORD_CHANGED')
  })

  mock.onPost('/user/security/change-phone').reply(() => {
    return success('PHONE_CHANGED')
  })

  mock.onGet('/user/interview-history').reply(() => {
    return success({
      items: mockInterviewHistory,
      total: mockInterviewHistory.length,
      page: 1,
      page_size: 10
    })
  })

  mock.onGet('/user/ability-data').reply(() => {
    return success(mockAbilityData)
  })

  mock.onGet('/user/game-interview-data').reply(() => {
    return success(mockGameInterviewData)
  })

  mock.onGet('/user/resume').reply(() => {
    return success(mockResumeData)
  })

  mock.onPost('/user/resume/diagnose').reply(() => {
    return success(mockResumeDiagnosisResult)
  })

  console.log('[Mock] User handlers registered')
}
