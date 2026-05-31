import type { Post, Comment } from '@/api/types/community.types'

export const mockPosts: Post[] = [
  {
    id: 1,
    title: '前端面试经验分享',
    content:
      '刚刚结束了某大厂的二面，AI 点评说我的逻辑非常清晰，分享给大家我的面试经验和准备方法。首先，我在面试前做了充分的准备，包括公司背景、技术栈和常见面试题。其次，我在面试过程中保持冷静，有条理地回答问题。最后，我主动询问了公司的技术栈和团队文化。希望这些经验对大家有所帮助！',
    author_id: 2,
    author_name: '匿名同学',
    author_avatar: '👨‍💻',
    likes_count: 128,
    comments_count: 24,
    is_liked: false,
    created_at: '2026-05-09T08:00:00Z',
    updated_at: '2026-05-09T08:00:00Z'
  },
  {
    id: 2,
    title: 'Java 线程池深度分析',
    content:
      '关于 Java 线程池的深度分析报告已出具，内含 AI 针对性的优化建议。线程池是 Java 并发编程中的重要概念，合理使用线程池可以提高系统的性能和稳定性。在面试中，线程池也是高频考点，包括线程池的参数、工作原理和最佳实践等。我整理了一份详细的分析报告，希望对大家的面试有所帮助。',
    author_id: 3,
    author_name: '面霸',
    author_avatar: '💻',
    likes_count: 256,
    comments_count: 48,
    is_liked: false,
    created_at: '2026-05-09T06:00:00Z',
    updated_at: '2026-05-09T06:00:00Z'
  },
  {
    id: 3,
    title: '产品经理面试心得',
    content:
      '第一次面试产品经理岗位，紧张到说话结巴，AI 给了我很多表达技巧的建议。AI 建议我在面试前多练习自我介绍和常见问题的回答，保持语速适中，逻辑清晰。同时，AI 还帮我分析了产品经理面试的重点，包括产品思维、沟通能力和用户体验意识等。现在我已经掌握了一些面试技巧，希望下次面试能够表现更好。',
    author_id: 4,
    author_name: '求职小白',
    author_avatar: '👩‍💼',
    likes_count: 96,
    comments_count: 18,
    is_liked: false,
    created_at: '2026-05-09T04:00:00Z',
    updated_at: '2026-05-09T04:00:00Z'
  },
  {
    id: 4,
    title: '字节跳动算法题分享',
    content:
      '分享一道字节跳动的算法题，AI 提供了三种解法，从时间复杂度和空间复杂度分析。这道题是关于数组操作的，要求在 O(n) 的时间复杂度内解决。AI 提供的三种解法分别是暴力法、哈希表法和双指针法，其中双指针法是最优解。通过这道题，我对数组操作和时间复杂度分析有了更深入的理解。',
    author_id: 5,
    author_name: '技术大牛',
    author_avatar: '🧠',
    likes_count: 320,
    comments_count: 56,
    is_liked: false,
    created_at: '2026-05-09T02:00:00Z',
    updated_at: '2026-05-09T02:00:00Z'
  },
  {
    id: 5,
    title: 'HR 视角：面试官最看重的点',
    content:
      '作为 HR，我来分享一下面试官最看重的几个点，希望对大家有帮助。首先，面试官看重候选人的专业能力和技术水平，这是基础。其次，面试官关注候选人的沟通能力和团队协作能力，因为这些能力在工作中非常重要。最后，面试官会考察候选人的学习能力和适应能力，因为技术在不断发展，需要持续学习。',
    author_id: 6,
    author_name: 'HR 视角',
    author_avatar: '👥',
    likes_count: 180,
    comments_count: 32,
    is_liked: false,
    created_at: '2026-05-08T08:00:00Z',
    updated_at: '2026-05-08T08:00:00Z'
  },
  {
    id: 6,
    title: 'Vue3 和 React 深度对比',
    content:
      'Vue3 和 React 的深度对比，包括响应式原理、组件化和性能优化等方面。Vue3 采用了 Proxy 实现响应式，而 React 采用了虚拟 DOM 和 setState。在组件化方面，Vue3 提供了 Composition API，而 React 提供了 Hooks。在性能优化方面，两者都有各自的优势和最佳实践。希望这份对比能够帮助大家选择适合自己的前端框架。',
    author_id: 7,
    author_name: '前端专家',
    author_avatar: '🎨',
    likes_count: 210,
    comments_count: 42,
    is_liked: false,
    created_at: '2026-05-08T06:00:00Z',
    updated_at: '2026-05-08T06:00:00Z'
  },
  {
    id: 7,
    title: '系统设计面试准备指南',
    content:
      '如何准备系统设计面试，包括架构设计、数据库设计和性能优化等方面。系统设计面试是大厂面试的重要环节，需要候选人具备全局视野和系统思维。我整理了一份系统设计面试的准备指南，包括常见的设计模式、分布式系统原理和最佳实践等。希望对大家的面试有所帮助。',
    author_id: 8,
    author_name: '后端工程师',
    author_avatar: '⚙️',
    likes_count: 175,
    comments_count: 38,
    is_liked: false,
    created_at: '2026-05-07T08:00:00Z',
    updated_at: '2026-05-07T08:00:00Z'
  }
]

export const mockComments: Record<number, Comment[]> = {
  1: [
    {
      id: 1,
      post_id: 1,
      author_id: 10,
      author_name: '面试新手',
      content: '谢谢分享，很有帮助！',
      created_at: '2026-05-09T09:00:00Z'
    },
    {
      id: 2,
      post_id: 1,
      author_id: 11,
      author_name: '技术爱好者',
      content: '请问你是如何准备技术面试的？',
      created_at: '2026-05-09T08:30:00Z'
    }
  ],
  2: [
    {
      id: 3,
      post_id: 2,
      author_id: 12,
      author_name: 'Java 开发者',
      content: '线程池的分析很详细，学习了！',
      created_at: '2026-05-09T07:00:00Z'
    },
    {
      id: 4,
      post_id: 2,
      author_id: 13,
      author_name: '后端工程师',
      content: '请问线程池的核心参数如何设置？',
      created_at: '2026-05-09T06:30:00Z'
    }
  ]
}

export const mockHotTopics = [
  { id: 1, title: '如何准备大厂面试', posts: 128, participants: 356 },
  { id: 2, title: '前端框架对比', posts: 96, participants: 289 },
  { id: 3, title: '系统设计面试指南', posts: 84, participants: 245 },
  { id: 4, title: '简历优化技巧', posts: 72, participants: 210 }
]

export const mockActiveUsers = [
  {
    id: 3,
    name: '面霸',
    avatar: '💻',
    posts: 128,
    followers: 520,
    bio: '专注于技术面试辅导，已帮助 100+ 人成功拿到大厂 offer'
  },
  {
    id: 5,
    name: '技术大牛',
    avatar: '🧠',
    posts: 96,
    followers: 480,
    bio: '资深后端工程师，擅长 Java、Spring 生态和系统设计'
  },
  {
    id: 7,
    name: '前端专家',
    avatar: '🎨',
    posts: 84,
    followers: 420,
    bio: '前端架构师，专注于 React、Vue 和性能优化'
  },
  {
    id: 6,
    name: 'HR 视角',
    avatar: '👥',
    posts: 72,
    followers: 380,
    bio: '资深 HR，10 年招聘经验，专注于技术人才招聘'
  }
]
