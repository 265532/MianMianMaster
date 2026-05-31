export async function initMockAdapter(axiosInstance: import('axios').AxiosInstance): Promise<void> {
  const isDev = import.meta.env.DEV
  const useMock = import.meta.env.VITE_USE_MOCK === 'true'

  if (!isDev || !useMock) {
    console.log('[Mock] Mock mode disabled, using real API')
    return
  }

  const [{ default: MockAdapter }, { registerAuthHandlers }, { registerUserHandlers }, { registerCommunityHandlers }, { registerLearningHandlers }, { registerAssessmentHandlers }, { registerInterviewHandlers }, { registerJobHandlers }] = await Promise.all([
    import('axios-mock-adapter'),
    import('./handlers/auth.handler'),
    import('./handlers/user.handler'),
    import('./handlers/community.handler'),
    import('./handlers/learning.handler'),
    import('./handlers/assessment.handler'),
    import('./handlers/interview.handler'),
    import('./handlers/job.handler')
  ])

  const delay = Number(import.meta.env.VITE_MOCK_DELAY) || 300
  console.log(`[Mock] Mock mode enabled (delay: ${delay}ms)`)

  const mock = new MockAdapter(axiosInstance, {
    delayResponse: delay,
    onNoMatch: 'passthrough'
  })

  registerAuthHandlers(mock)
  registerUserHandlers(mock)
  registerCommunityHandlers(mock)
  registerLearningHandlers(mock)
  registerAssessmentHandlers(mock)
  registerInterviewHandlers(mock)
  registerJobHandlers(mock)

  console.log('[Mock] All handlers registered')
}
