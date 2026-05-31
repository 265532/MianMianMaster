import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { communityApi } from '@/api/modules/community.api'
import type {
  Post,
  Comment,
  LikeResult,
  FollowResult,
  AiReviewResult
} from '@/api/types/community.types'

export interface HotTopic {
  id: number
  title: string
  posts: number
  participants: number
}

export interface ActiveUser {
  id: number
  name: string
  avatar: string
  posts: number
  followers: number
  bio: string
}

export const useCommunityStore = defineStore('community', () => {
  const posts = ref<Post[]>([])
  const currentPost = ref<Post | null>(null)
  const comments = ref<Record<number, Comment[]>>({})
  const hotTopics = ref<HotTopic[]>([])
  const activeUsers = ref<ActiveUser[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref({
    page: 1,
    pageSize: 10,
    total: 0
  })

  const hasMore = computed(() =>
    posts.value.length < pagination.value.total
  )

  async function fetchPosts(params?: { keyword?: string; page?: number }): Promise<void> {
    loading.value = true
    error.value = null

    try {
      const response = await communityApi.getPosts({
        skip: ((params?.page || 1) - 1) * pagination.value.pageSize,
        limit: pagination.value.pageSize,
        keyword: params?.keyword
      })
      const data = response.data
      posts.value = Array.isArray(data) ? data : []

      if (!Array.isArray(data) && data.total !== undefined) {
        pagination.value.total = data.total
      } else {
        pagination.value.total = posts.value.length
      }
    } catch (err: any) {
      error.value = err?.response?.data?.message || err?.message || '获取帖子失败'
      console.error('[Community] fetchPosts error:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchPost(postId: number): Promise<void> {
    loading.value = true
    error.value = null

    try {
      const response = await communityApi.getPost(postId)
      currentPost.value = response.data
    } catch (err: any) {
      error.value = err?.response?.data?.message || err?.message || '获取帖子详情失败'
      console.error('[Community] fetchPost error:', err)
    } finally {
      loading.value = false
    }
  }

  async function createPost(data: { title: string; content: string }): Promise<boolean> {
    loading.value = true
    error.value = null

    try {
      const response = await communityApi.createPost(data)
      const newPost = response.data
      posts.value.unshift(newPost)
      return true
    } catch (err: any) {
      error.value = err?.response?.data?.message || err?.message || '发布失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchComments(postId: number): Promise<void> {
    try {
      const response = await communityApi.getPostComments(postId)
      comments.value[postId] = response.data
    } catch (err: any) {
      console.error('[Community] fetchComments error:', err)
    }
  }

  async function createComment(postId: number, content: string): Promise<boolean> {
    try {
      const response = await communityApi.createComment(postId, { content })
      const newComment = response.data
      if (!comments.value[postId]) {
        comments.value[postId] = []
      }
      comments.value[postId].push(newComment)

      const post = posts.value.find(p => p.id === postId)
      if (post) {
        post.comments_count++
      }
      if (currentPost.value?.id === postId) {
        currentPost.value.comments_count++
      }
      return true
    } catch (err: any) {
      error.value = err?.response?.data?.message || err?.message || '评论失败'
      throw err
    }
  }

  async function toggleLike(postId: number): Promise<LikeResult | null> {
    try {
      const response = await communityApi.toggleLike(postId)
      const result = response.data

      const post = posts.value.find(p => p.id === postId)
      if (post) {
        post.is_liked = result.liked
        post.likes_count = result.likes_count
      }
      if (currentPost.value?.id === postId) {
        currentPost.value.is_liked = result.liked
        currentPost.value.likes_count = result.likes_count
      }
      return result
    } catch (err: any) {
      console.error('[Community] toggleLike error:', err)
      return null
    }
  }

  async function toggleFollow(userId: number): Promise<FollowResult | null> {
    try {
      const response = await communityApi.toggleFollow(userId)
      return response.data
    } catch (err: any) {
      console.error('[Community] toggleFollow error:', err)
      return null
    }
  }

  async function triggerAiReview(postId: number): Promise<AiReviewResult | null> {
    try {
      const response = await communityApi.triggerAiReview(postId)
      return response.data
    } catch (err: any) {
      console.error('[Community] triggerAiReview error:', err)
      return null
    }
  }

  async function fetchHotTopics(): Promise<void> {
    try {
      const response = await communityApi.getHotTopics()
      hotTopics.value = response.data
    } catch (err: any) {
      console.error('[Community] fetchHotTopics error:', err)
    }
  }

  async function fetchActiveUsers(): Promise<void> {
    try {
      const response = await communityApi.getActiveUsers()
      activeUsers.value = response.data
    } catch (err: any) {
      console.error('[Community] fetchActiveUsers error:', err)
    }
  }

  async function loadMore(): Promise<void> {
    if (!hasMore.value || loading.value) return
    pagination.value.page++
    await fetchPosts({ page: pagination.value.page })
  }

  return {
    posts,
    currentPost,
    comments,
    hotTopics,
    activeUsers,
    loading,
    error,
    pagination,
    hasMore,
    fetchPosts,
    fetchPost,
    createPost,
    fetchComments,
    createComment,
    toggleLike,
    toggleFollow,
    triggerAiReview,
    fetchHotTopics,
    fetchActiveUsers,
    loadMore
  }
})
