import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

vi.mock('@/api/modules/community.api', () => ({
  communityApi: {
    getPosts: vi.fn(),
    getPost: vi.fn(),
    createPost: vi.fn(),
    getPostComments: vi.fn(),
    createComment: vi.fn(),
    toggleLike: vi.fn(),
    toggleFollow: vi.fn(),
    triggerAiReview: vi.fn(),
    getHotTopics: vi.fn(),
    getActiveUsers: vi.fn()
  }
}))

describe('useCommunityStore integration', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('fetchPosts', () => {
    it('should fetch posts and update state', async () => {
      const { communityApi } = await import('@/api/modules/community.api')
      const mockedGetPosts = vi.mocked(communityApi.getPosts)

      mockedGetPosts.mockResolvedValue({
        code: 200,
        message: 'success',
        data: [
          { id: 1, title: '测试帖子', content: '内容', author_name: '张三', likes_count: 5, comments_count: 2, is_liked: false, created_at: '2026-05-10T00:00:00Z' },
          { id: 2, title: '另一帖子', content: '内容2', author_name: '李四', likes_count: 10, comments_count: 3, is_liked: true, created_at: '2026-05-10T00:00:00Z' }
        ]
      })

      const { useCommunityStore } = await import('@/stores/community')
      const store = useCommunityStore()

      await store.fetchPosts()

      expect(mockedGetPosts).toHaveBeenCalled()
      expect(store.posts.length).toBe(2)
      expect(store.posts[0].title).toBe('测试帖子')
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })

    it('should handle fetch error', async () => {
      const { communityApi } = await import('@/api/modules/community.api')
      const mockedGetPosts = vi.mocked(communityApi.getPosts)

      mockedGetPosts.mockRejectedValue(new Error('Network Error'))

      const { useCommunityStore } = await import('@/stores/community')
      const store = useCommunityStore()

      await store.fetchPosts()

      expect(store.error).toBeTruthy()
      expect(store.loading).toBe(false)
    })
  })

  describe('createPost', () => {
    it('should create post and add to posts list', async () => {
      const { communityApi } = await import('@/api/modules/community.api')
      const mockedCreatePost = vi.mocked(communityApi.createPost)

      mockedCreatePost.mockResolvedValue({
        code: 200,
        message: 'success',
        data: {
          id: 100,
          title: '新帖子',
          content: '新内容',
          author_name: '王同学',
          likes_count: 0,
          comments_count: 0,
          is_liked: false,
          created_at: '2026-05-10T00:00:00Z'
        }
      })

      const { useCommunityStore } = await import('@/stores/community')
      const store = useCommunityStore()

      const result = await store.createPost({ title: '新帖子', content: '新内容' })

      expect(result).toBe(true)
      expect(mockedCreatePost).toHaveBeenCalledWith({ title: '新帖子', content: '新内容' })
    })
  })

  describe('toggleLike', () => {
    it('should toggle like and update post state', async () => {
      const { communityApi } = await import('@/api/modules/community.api')
      const mockedGetPosts = vi.mocked(communityApi.getPosts)
      const mockedToggleLike = vi.mocked(communityApi.toggleLike)

      mockedGetPosts.mockResolvedValue({
        code: 200,
        message: 'success',
        data: [
          { id: 1, title: '帖子', content: '内容', author_name: '张三', likes_count: 5, comments_count: 2, is_liked: false, created_at: '2026-05-10T00:00:00Z' }
        ]
      })

      mockedToggleLike.mockResolvedValue({
        code: 200,
        message: 'success',
        data: { liked: true, likes_count: 6 }
      })

      const { useCommunityStore } = await import('@/stores/community')
      const store = useCommunityStore()

      await store.fetchPosts()
      const result = await store.toggleLike(1)

      expect(result).toBeTruthy()
      expect(mockedToggleLike).toHaveBeenCalledWith(1)
    })
  })

  describe('fetchHotTopics', () => {
    it('should fetch hot topics', async () => {
      const { communityApi } = await import('@/api/modules/community.api')
      const mockedGetHotTopics = vi.mocked(communityApi.getHotTopics)

      mockedGetHotTopics.mockResolvedValue({
        code: 200,
        message: 'success',
        data: [
          { id: 1, name: 'Vue3', post_count: 50 },
          { id: 2, name: '面试技巧', post_count: 30 }
        ]
      })

      const { useCommunityStore } = await import('@/stores/community')
      const store = useCommunityStore()

      await store.fetchHotTopics()

      expect(mockedGetHotTopics).toHaveBeenCalled()
      expect(store.hotTopics.length).toBe(2)
    })
  })
})
