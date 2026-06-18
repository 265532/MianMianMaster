<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import SkeletonLoader from "@/components/SkeletonLoader.vue";
import EmptyState from "@/components/EmptyState.vue";
import LoadMore from "@/components/LoadMore.vue";
import {
  MessageSquare,
  UserCircle,
  Bot,
  Award,
  ChevronRight,
  Mic,
  FileText,
  Sparkles,
  Zap,
  Heart,
  Share2,
  Bookmark,
  Clock,
  Users,
  X,
  GraduationCap,
  BookOpen,
} from "lucide-vue-next";
import { useCommunityStore } from "@/stores/community";
import { useLearningStore } from "@/stores/learning";
import type { Post } from "@/api/types/community.types";
import type { Course } from "@/api/types/learning.types";

interface Topic {
  id: number;
  title: string;
  posts: number;
  participants: number;
}

interface User {
  name: string;
  posts: number;
  avatar: string;
  followers: number;
  joined: string;
  bio: string;
}

const communityStore = useCommunityStore();
const learningStore = useLearningStore();
const {
  posts: communityPosts,
  comments,
  hotTopics,
  activeUsers,
  loading,
} = storeToRefs(communityStore);
const { courses } = storeToRefs(learningStore);

const showAllPosts = ref(false);
const isPostDetailOpen = ref(false);
const selectedPost = ref<Post | null>(null);
const isTopicDetailOpen = ref(false);
const selectedTopic = ref<Topic | null>(null);
const isUserDetailOpen = ref(false);
const selectedUser = ref<User | null>(null);
const isWisdomCourseOpen = ref(false);
const selectedCategory = ref("全部课程");
const isCourseDetailOpen = ref(false);
const selectedCourse = ref<Course | null>(null);
const isLearningOpen = ref(false);
const currentModuleIndex = ref(0);
const isHistoryArchiveOpen = ref(false);
const isAllTopicsOpen = ref(false);
const isShareReportOpen = ref(false);
const isArchiveDetailOpen = ref(false);
const selectedArchive = ref<Record<string, unknown> | null>(null);
const bookmarkedPosts = ref<Set<number>>(new Set());
const followedUsers = ref<Set<string>>(new Set());
const selectedFile = ref<File | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);

const displayedPosts = computed(() => {
  return showAllPosts.value
    ? communityPosts.value
    : communityPosts.value.slice(0, 3);
});

const filteredCourses = computed(() => {
  if (selectedCategory.value === "全部课程") {
    return courses.value;
  }
  return courses.value.filter(
    (course) => course.category === selectedCategory.value,
  );
});

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "刚刚";
  if (hours < 24) return `${hours}小时前`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}天前`;
  return date.toLocaleDateString("zh-CN");
}

const unlockWisdomCourse = () => {
  isWisdomCourseOpen.value = true;
};

const selectCategory = (category: string) => {
  selectedCategory.value = category;
};

const viewCourseDetail = (course: Course) => {
  selectedCourse.value = course;
  isCourseDetailOpen.value = true;
};

const startLearning = (course: Course) => {
  selectedCourse.value = course;
  currentModuleIndex.value = 0;
  isLearningOpen.value = true;
};

const shareReport = () => {
  isShareReportOpen.value = true;
};

const viewHistoryArchive = () => {
  isHistoryArchiveOpen.value = true;
};

const handleToggleLike = async (postId: number) => {
  await communityStore.toggleLike(postId);
};

const bookmarkPost = (postId: number) => {
  if (bookmarkedPosts.value.has(postId)) {
    bookmarkedPosts.value.delete(postId);
  } else {
    bookmarkedPosts.value.add(postId);
  }
};

const sharePost = (_postId: number) => {
  alert("帖子已分享到剪贴板");
};

const viewAllTopics = () => {
  isAllTopicsOpen.value = true;
};

const handleToggleFollow = async (userName: string) => {
  if (followedUsers.value.has(userName)) {
    followedUsers.value.delete(userName);
  } else {
    followedUsers.value.add(userName);
  }
};

const viewArchiveDetail = (archive: Record<string, unknown>) => {
  selectedArchive.value = archive;
  isArchiveDetailOpen.value = true;
};

const deleteArchive = (_archiveId: number) => {
  if (confirm("确定要删除这个存档吗？")) {
    alert("删除成功！");
  }
};

const loadMoreArchives = () => {
  alert("已加载全部存档！");
};

const triggerFileInput = () => {
  fileInputRef.value?.click();
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0] as File;
    if (selectedFile.value) {
      alert(`已选择文件：${selectedFile.value.name}`);
    }
  }
};

onMounted(async () => {
  await Promise.all([
    communityStore.fetchPosts(),
    communityStore.fetchHotTopics(),
    communityStore.fetchActiveUsers(),
    learningStore.fetchCourses(),
  ]);
});
</script>

<template>
  <div class="flex flex-col gap-8 max-w-7xl mx-auto">
    <!-- Header: Community Section -->
    <div
      class="gradient-primary p-10 rounded-[40px] text-white relative overflow-hidden shadow-xl"
    >
      <div class="relative z-10 max-w-2xl">
        <h1 class="text-4xl font-black mb-4 tracking-tight">面试复盘社区</h1>
        <p class="text-white/80 mb-8 text-lg leading-relaxed">
          匿名分享面试录音与文本报告，获取 AI
          和资深面试官点评，共同在“面试智慧树”下成长。
        </p>
        <div class="flex flex-wrap gap-4">
          <button
            class="px-8 py-4 bg-white text-primary font-bold rounded-2xl shadow-lg hover:scale-105 transition-all flex items-center gap-2"
            @click="shareReport"
          >
            <Mic :size="20" />
            匿名分享复盘报告
          </button>
          <button
            class="px-8 py-4 bg-white/20 backdrop-blur-md text-white font-bold rounded-2xl hover:bg-white/30 transition-all"
            @click="viewHistoryArchive"
          >
            我的历史存档
          </button>
        </div>
      </div>
      <div class="absolute -right-20 -top-20 opacity-10">
        <MessageSquare :size="320" />
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      <!-- Left: Community Posts -->
      <div class="lg:col-span-8 space-y-8">
        <!-- 社群优质动态 -->
        <div
          class="bg-white rounded-[32px] p-8 shadow-sm border border-neutral-border"
        >
          <div class="flex items-center justify-between mb-8">
            <h2
              class="text-xl font-bold text-neutral-title flex items-center gap-3"
            >
              <div class="w-2 h-6 gradient-primary rounded-full"></div>
              社群优质动态
            </h2>
            <div class="flex bg-neutral-bg p-1 rounded-xl">
              <button
                class="px-4 py-2 bg-white text-primary font-bold rounded-lg text-xs shadow-sm"
              >
                热门复盘
              </button>
              <button
                class="px-4 py-2 text-neutral-helper text-xs font-bold hover:text-neutral-body"
              >
                最新发布
              </button>
            </div>
          </div>

          <div class="space-y-8">
            <template v-if="loading">
              <SkeletonLoader v-for="i in 3" :key="'sk-' + i" type="post" />
            </template>
            <EmptyState
              v-else-if="communityPosts.length === 0"
              icon="📝"
              title="暂无帖子"
              description="社区里还没有帖子，来发布第一篇吧！"
              action-text="发布帖子"
              @action="isPostDetailOpen = true"
            />
            <template v-else>
              <div
                v-for="post in displayedPosts"
                :key="post.id"
                class="p-8 bg-neutral-bg rounded-[32px] hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-neutral-border group cursor-pointer relative overflow-hidden"
                @click="
                  selectedPost = post;
                  isPostDetailOpen = true;
                "
              >
                <div class="flex items-center gap-4 mb-4 relative z-10">
                  <div class="text-2xl">{{ post.author_avatar }}</div>
                  <div>
                    <h4 class="text-sm font-bold text-neutral-title">
                      {{ post.author_name }}
                    </h4>
                    <div class="flex items-center gap-4">
                      <span
                        class="text-[10px] text-neutral-helper uppercase font-bold"
                        >{{ post.title }}</span
                      >
                      <span
                        class="text-[10px] text-neutral-helper flex items-center gap-1"
                        ><Clock :size="12" />
                        {{ formatTime(post.created_at) }}</span
                      >
                    </div>
                  </div>
                </div>
                <p
                  class="text-sm text-neutral-body leading-relaxed mb-6 relative z-10"
                >
                  {{ post.content }}
                </p>

                <!-- 评论展示 -->
                <div v-if="comments[post.id]" class="mb-6 relative z-10">
                  <div class="space-y-3">
                    <div
                      v-for="comment in comments[post.id]"
                      :key="comment.id"
                      class="p-3 bg-white rounded-xl border border-neutral-border"
                    >
                      <div class="flex items-center justify-between mb-1">
                        <h5 class="text-xs font-bold text-neutral-title">
                          {{ comment.author_name }}
                        </h5>
                        <span class="text-[10px] text-neutral-helper">{{
                          formatTime(comment.created_at)
                        }}</span>
                      </div>
                      <p class="text-xs text-neutral-body">
                        {{ comment.content }}
                      </p>
                    </div>
                  </div>
                  <button
                    class="text-xs text-primary font-bold hover:underline mt-2"
                  >
                    查看全部 {{ post.comments_count }} 条评论
                  </button>
                </div>

                <div
                  class="flex items-center gap-4 relative z-10 pt-4 border-t border-neutral-border"
                >
                  <button
                    class="flex items-center gap-2 text-xs transition-colors"
                    :class="
                      post.is_liked
                        ? 'text-auxiliary-orange'
                        : 'text-neutral-helper hover:text-primary'
                    "
                    @click.stop="handleToggleLike(post.id)"
                  >
                    <Heart
                      :size="16"
                      :class="post.is_liked ? 'fill-auxiliary-orange' : ''"
                    />
                    <span class="font-bold">{{ post.likes_count }}</span>
                  </button>
                  <button
                    class="flex items-center gap-2 text-xs text-neutral-helper hover:text-primary transition-colors"
                  >
                    <MessageSquare :size="16" />
                    <span class="font-bold">{{ post.comments_count }}</span>
                  </button>
                  <button
                    class="flex items-center gap-2 text-xs text-neutral-helper hover:text-primary transition-colors"
                    @click.stop="sharePost(post.id)"
                  >
                    <Share2 :size="16" />
                    <span class="font-bold">分享</span>
                  </button>
                  <button
                    class="flex items-center gap-2 text-xs transition-colors"
                    :class="
                      bookmarkedPosts.has(post.id)
                        ? 'text-auxiliary-orange'
                        : 'text-neutral-helper hover:text-primary'
                    "
                    @click.stop="bookmarkPost(post.id)"
                  >
                    <Bookmark
                      :size="16"
                      :class="
                        bookmarkedPosts.has(post.id)
                          ? 'fill-auxiliary-orange'
                          : ''
                      "
                    />
                    <span class="font-bold">收藏</span>
                  </button>
                </div>
                <div
                  class="absolute -right-6 -bottom-6 opacity-5 rotate-12 group-hover:scale-110 transition-transform"
                >
                  <Bot :size="140" />
                </div>
              </div>

              <!-- 查看更多按钮 -->
              <div class="flex justify-center mt-4">
                <LoadMore
                  v-if="showAllPosts"
                  :loading="loading"
                  :has-more="hasMore"
                  @load-more="communityStore.loadMore()"
                />
                <button
                  v-else
                  class="px-8 py-3 bg-neutral-bg text-neutral-title font-bold rounded-xl hover:bg-primary hover:text-white transition-all flex items-center gap-2"
                  @click="showAllPosts = !showAllPosts"
                >
                  {{ showAllPosts ? "收起" : "查看更多" }}
                  <ChevronRight
                    :size="16"
                    :class="{ 'rotate-180': showAllPosts }"
                  />
                </button>
              </div>
            </template>
          </div>
        </div>

        <!-- 分享复盘表单 -->
        <div
          class="bg-white rounded-[32px] p-8 shadow-sm border border-neutral-border"
        >
          <h2
            class="text-xl font-bold text-neutral-title mb-6 flex items-center gap-3"
          >
            <Mic :size="24" class="text-primary" />
            分享你的面试复盘
          </h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-bold text-neutral-title mb-2"
                >面试类型</label
              >
              <select
                class="w-full p-4 border border-neutral-border rounded-xl focus:outline-none focus:border-primary transition-colors"
              >
                <option value="">请选择面试类型</option>
                <option value="frontend">前端面试</option>
                <option value="backend">后端面试</option>
                <option value="fullstack">全栈面试</option>
                <option value="product">产品经理</option>
                <option value="other">其他</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-bold text-neutral-title mb-2"
                >复盘内容</label
              >
              <textarea
                class="w-full p-4 border border-neutral-border rounded-xl focus:outline-none focus:border-primary transition-colors"
                rows="5"
                placeholder="分享你的面试经验、问题和感受..."
              ></textarea>
            </div>
            <div class="flex items-center gap-4">
              <button
                class="px-4 py-2 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all"
              >
                <Mic :size="16" class="inline mr-2" />
                语音输入
              </button>
              <button
                class="px-4 py-2 bg-neutral-bg text-neutral-title font-bold rounded-xl hover:bg-neutral-border/50 transition-all"
              >
                <FileText :size="16" class="inline mr-2" />
                上传文件
              </button>
            </div>
            <div class="flex justify-end">
              <button
                class="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all"
              >
                发布复盘
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 帖子详情模态框 -->
      <div
        v-if="isPostDetailOpen && selectedPost"
        class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      >
        <div
          class="bg-white rounded-[32px] w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <div
            class="p-8 border-b border-neutral-border flex justify-between items-center"
          >
            <h3
              class="text-xl font-bold text-neutral-title flex items-center gap-2"
            >
              <MessageSquare :size="24" class="text-primary" />
              帖子详情
            </h3>
            <button
              class="p-2 text-neutral-helper hover:text-neutral-title"
              @click="isPostDetailOpen = false"
            >
              <X :size="24" />
            </button>
          </div>
          <div class="p-8">
            <div class="flex items-center gap-4 mb-6">
              <div class="text-3xl">{{ selectedPost.author_avatar }}</div>
              <div>
                <h4 class="text-lg font-bold text-neutral-title">
                  {{ selectedPost.author_name }}
                </h4>
                <div class="flex items-center gap-4">
                  <span class="text-xs text-primary font-bold">{{
                    selectedPost.title
                  }}</span>
                  <span
                    class="text-xs text-neutral-helper flex items-center gap-1"
                    ><Clock :size="12" />
                    {{ formatTime(selectedPost.created_at) }}</span
                  >
                </div>
              </div>
            </div>
            <p class="text-sm text-neutral-body leading-relaxed mb-8">
              {{ selectedPost.content }}
            </p>

            <!-- 评论展示 -->
            <div v-if="comments[selectedPost.id]" class="mb-8">
              <h5 class="font-bold text-neutral-title mb-4">
                评论 ({{ selectedPost.comments_count }})
              </h5>
              <div class="space-y-4">
                <div
                  v-for="comment in comments[selectedPost.id]"
                  :key="comment.id"
                  class="p-4 bg-neutral-bg rounded-xl border border-neutral-border"
                >
                  <div class="flex items-center justify-between mb-2">
                    <h6 class="text-sm font-bold text-neutral-title">
                      {{ comment.author_name }}
                    </h6>
                    <span class="text-xs text-neutral-helper">{{
                      formatTime(comment.created_at)
                    }}</span>
                  </div>
                  <p class="text-sm text-neutral-body">{{ comment.content }}</p>
                </div>
              </div>
              <button
                class="text-sm text-primary font-bold hover:underline mt-4"
              >
                查看全部评论
              </button>
            </div>

            <!-- 互动按钮 -->
            <div
              class="flex items-center gap-6 pt-4 border-t border-neutral-border"
            >
              <button
                class="flex items-center gap-2 text-sm transition-colors"
                :class="
                  selectedPost.is_liked
                    ? 'text-auxiliary-orange'
                    : 'text-neutral-helper hover:text-primary'
                "
                @click="handleToggleLike(selectedPost.id)"
              >
                <Heart
                  :size="18"
                  :class="selectedPost.is_liked ? 'fill-auxiliary-orange' : ''"
                />
                <span class="font-bold">{{ selectedPost.likes_count }}</span>
              </button>
              <button
                class="flex items-center gap-2 text-sm text-neutral-helper hover:text-primary transition-colors"
              >
                <MessageSquare :size="18" />
                <span class="font-bold">{{ selectedPost.comments_count }}</span>
              </button>
              <button
                class="flex items-center gap-2 text-sm text-neutral-helper hover:text-primary transition-colors"
                @click="sharePost(selectedPost.id)"
              >
                <Share2 :size="18" />
                <span class="font-bold">分享</span>
              </button>
              <button
                class="flex items-center gap-2 text-sm transition-colors"
                :class="
                  bookmarkedPosts.has(selectedPost.id)
                    ? 'text-auxiliary-orange'
                    : 'text-neutral-helper hover:text-primary'
                "
                @click="bookmarkPost(selectedPost.id)"
              >
                <Bookmark
                  :size="18"
                  :class="
                    bookmarkedPosts.has(selectedPost.id)
                      ? 'fill-auxiliary-orange'
                      : ''
                  "
                />
                <span class="font-bold">收藏</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 热门话题详情模态框 -->
      <div
        v-if="isTopicDetailOpen && selectedTopic"
        class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      >
        <div
          class="bg-white rounded-[32px] w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <div
            class="p-8 border-b border-neutral-border flex justify-between items-center"
          >
            <h3
              class="text-xl font-bold text-neutral-title flex items-center gap-2"
            >
              <Zap :size="24" class="text-auxiliary-orange" />
              话题详情
            </h3>
            <button
              class="p-2 text-neutral-helper hover:text-neutral-title"
              @click="isTopicDetailOpen = false"
            >
              <X :size="24" />
            </button>
          </div>
          <div class="p-8">
            <h4 class="text-xl font-bold text-neutral-title mb-4">
              {{ selectedTopic.title }}
            </h4>
            <div class="flex items-center gap-6 mb-8">
              <span
                class="px-4 py-2 bg-neutral-bg rounded-full text-sm font-bold text-neutral-title flex items-center gap-2"
              >
                <MessageSquare :size="16" />
                {{ selectedTopic.posts }} 帖子
              </span>
              <span
                class="px-4 py-2 bg-neutral-bg rounded-full text-sm font-bold text-neutral-title flex items-center gap-2"
              >
                <Users :size="16" />
                {{ selectedTopic.participants }} 参与者
              </span>
            </div>

            <!-- 相关帖子 -->
            <h5 class="font-bold text-neutral-title mb-4">相关帖子</h5>
            <div class="space-y-4">
              <div
                v-for="(post, index) in communityPosts.filter(
                  (p) =>
                    selectedTopic &&
                    selectedTopic.title &&
                    p.content.includes(selectedTopic.title.split(' ')[1] || ''),
                )"
                :key="index"
                class="p-4 bg-neutral-bg rounded-xl border border-neutral-border"
              >
                <div class="flex items-center gap-3 mb-2">
                  <div class="text-2xl">{{ post.author_avatar }}</div>
                  <div>
                    <h6 class="text-sm font-bold text-neutral-title">
                      {{ post.author_name }}
                    </h6>
                    <span class="text-xs text-neutral-helper">{{
                      formatTime(post.created_at)
                    }}</span>
                  </div>
                </div>
                <p class="text-sm text-neutral-body">
                  {{ post.content.substring(0, 100) }}...
                </p>
                <div class="flex items-center gap-4 mt-3">
                  <span
                    class="text-xs text-neutral-helper flex items-center gap-1"
                    ><Heart :size="12" /> {{ post.likes_count }}</span
                  >
                  <span
                    class="text-xs text-neutral-helper flex items-center gap-1"
                    ><MessageSquare :size="12" />
                    {{ post.comments_count }}</span
                  >
                </div>
              </div>
            </div>

            <!-- 加入话题按钮 -->
            <div class="mt-8">
              <button
                class="w-full py-3 bg-auxiliary-orange text-white font-bold rounded-xl hover:bg-auxiliary-orange/90 transition-all"
              >
                加入话题讨论
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 活跃用户详情模态框 -->
      <div
        v-if="isUserDetailOpen && selectedUser"
        class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      >
        <div
          class="bg-white rounded-[32px] w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <div
            class="p-8 border-b border-neutral-border flex justify-between items-center"
          >
            <h3
              class="text-xl font-bold text-neutral-title flex items-center gap-2"
            >
              <UserCircle :size="24" class="text-primary" />
              用户详情
            </h3>
            <button
              class="p-2 text-neutral-helper hover:text-neutral-title"
              @click="isUserDetailOpen = false"
            >
              <X :size="24" />
            </button>
          </div>
          <div class="p-8">
            <div class="flex flex-col items-center mb-8">
              <div class="text-5xl mb-4">{{ selectedUser.avatar }}</div>
              <h4 class="text-2xl font-bold text-neutral-title mb-2">
                {{ selectedUser.name }}
              </h4>
              <p class="text-sm text-neutral-helper mb-4">
                {{ selectedUser.bio }}
              </p>
              <div class="flex items-center gap-6 mb-4">
                <span class="text-center">
                  <div class="font-bold text-neutral-title">
                    {{ selectedUser.posts }}
                  </div>
                  <div class="text-xs text-neutral-helper">帖子</div>
                </span>
                <span class="text-center">
                  <div class="font-bold text-neutral-title">
                    {{ selectedUser.followers }}
                  </div>
                  <div class="text-xs text-neutral-helper">关注者</div>
                </span>
                <span class="text-center">
                  <div class="font-bold text-neutral-title">24</div>
                  <div class="text-xs text-neutral-helper">关注</div>
                </span>
              </div>
              <button
                class="px-8 py-2 font-bold rounded-xl transition-all"
                :class="
                  followedUsers.has(selectedUser.name)
                    ? 'bg-neutral-bg text-neutral-title hover:bg-neutral-border/50'
                    : 'bg-primary text-white hover:bg-primary/90'
                "
                @click="handleToggleFollow(selectedUser.name)"
              >
                {{ followedUsers.has(selectedUser.name) ? "已关注" : "关注" }}
              </button>
            </div>

            <!-- 用户帖子 -->
            <h5 class="font-bold text-neutral-title mb-4">最新帖子</h5>
            <div class="space-y-4">
              <div
                v-for="(post, index) in communityPosts.filter(
                  (p) => selectedUser && p.author === selectedUser.name,
                )"
                :key="index"
                class="p-4 bg-neutral-bg rounded-xl border border-neutral-border"
              >
                <div class="flex items-center gap-4 mb-2">
                  <span
                    class="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full"
                    >{{ post.type }}</span
                  >
                  <span class="text-xs text-neutral-helper">{{
                    post.time
                  }}</span>
                </div>
                <p class="text-sm text-neutral-body mb-3">{{ post.content }}</p>
                <div class="flex items-center gap-4">
                  <span
                    class="text-xs text-neutral-helper flex items-center gap-1"
                    ><Heart :size="12" /> {{ post.likes }}</span
                  >
                  <span
                    class="text-xs text-neutral-helper flex items-center gap-1"
                    ><MessageSquare :size="12" /> {{ post.comments }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 智慧课程模态框 -->
      <div
        v-if="isWisdomCourseOpen"
        class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      >
        <div
          class="bg-white rounded-[32px] w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        >
          <div
            class="p-8 border-b border-neutral-border flex justify-between items-center"
          >
            <h3
              class="text-2xl font-black text-neutral-title flex items-center gap-3"
            >
              <Sparkles :size="28" class="text-auxiliary-orange" />
              智慧课程
            </h3>
            <button
              class="w-10 h-10 rounded-full bg-neutral-bg flex items-center justify-center text-neutral-helper hover:bg-primary/10 hover:text-primary transition-all"
              @click="isWisdomCourseOpen = false"
            >
              <X :size="20" />
            </button>
          </div>
          <div class="p-8">
            <div
              class="p-6 bg-neutral-title rounded-2xl text-white relative overflow-hidden mb-8"
            >
              <div class="absolute -right-20 -bottom-20 opacity-10">
                <Sparkles :size="200" />
              </div>
              <div class="relative z-10">
                <h4
                  class="text-2xl font-bold mb-4 text-white"
                  style="color: #ffffff !important"
                >
                  智慧树课程体系
                </h4>
                <p class="text-white/80 text-sm mb-6">
                  基于社群优质点评，通过算法聚合生成的个性化课程体系，帮助您快速提升面试能力。
                </p>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div
                    class="p-4 bg-white/5 rounded-2xl border border-white/10"
                  >
                    <div class="text-2xl font-bold text-primary mb-1">12</div>
                    <div class="text-sm text-white/60">精品课程</div>
                  </div>
                  <div
                    class="p-4 bg-white/5 rounded-2xl border border-white/10"
                  >
                    <div class="text-2xl font-bold text-primary mb-1">36</div>
                    <div class="text-sm text-white/60">实战练习</div>
                  </div>
                  <div
                    class="p-4 bg-white/5 rounded-2xl border border-white/10"
                  >
                    <div class="text-2xl font-bold text-primary mb-1">98%</div>
                    <div class="text-sm text-white/60">学员满意度</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 课程分类 -->
            <div class="mb-8">
              <h4 class="text-xl font-bold text-white mb-6">课程分类</h4>
              <div class="flex flex-wrap gap-3 mb-6">
                <button
                  class="px-4 py-2 font-bold rounded-full text-sm transition-all"
                  :class="
                    selectedCategory === '全部课程'
                      ? 'bg-primary text-white'
                      : 'bg-neutral-bg text-neutral-title hover:bg-primary hover:text-white'
                  "
                  @click="selectCategory('全部课程')"
                >
                  全部课程
                </button>
                <button
                  class="px-4 py-2 font-bold rounded-full text-sm transition-all"
                  :class="
                    selectedCategory === '逻辑思维'
                      ? 'bg-primary text-white'
                      : 'bg-neutral-bg text-neutral-title hover:bg-primary hover:text-white'
                  "
                  @click="selectCategory('逻辑思维')"
                >
                  逻辑思维
                </button>
                <button
                  class="px-4 py-2 font-bold rounded-full text-sm transition-all"
                  :class="
                    selectedCategory === '表达结构'
                      ? 'bg-primary text-white'
                      : 'bg-neutral-bg text-neutral-title hover:bg-primary hover:text-white'
                  "
                  @click="selectCategory('表达结构')"
                >
                  表达结构
                </button>
                <button
                  class="px-4 py-2 font-bold rounded-full text-sm transition-all"
                  :class="
                    selectedCategory === '专业深度'
                      ? 'bg-primary text-white'
                      : 'bg-neutral-bg text-neutral-title hover:bg-primary hover:text-white'
                  "
                  @click="selectCategory('专业深度')"
                >
                  专业深度
                </button>
                <button
                  class="px-4 py-2 font-bold rounded-full text-sm transition-all"
                  :class="
                    selectedCategory === '面试技巧'
                      ? 'bg-primary text-white'
                      : 'bg-neutral-bg text-neutral-title hover:bg-primary hover:text-white'
                  "
                  @click="selectCategory('面试技巧')"
                >
                  面试技巧
                </button>
              </div>
            </div>

            <!-- 课程列表 -->
            <div class="space-y-6">
              <div
                v-for="course in filteredCourses"
                :key="course.id"
                class="p-6 bg-neutral-bg rounded-2xl border border-neutral-border hover:bg-white hover:shadow-lg transition-all"
              >
                <div
                  class="flex flex-col md:flex-row md:items-start justify-between gap-6"
                >
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-4">
                      <span
                        class="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full"
                        >{{ course.category }}</span
                      >
                      <span
                        class="px-3 py-1 bg-auxiliary-orange/10 text-auxiliary-orange text-xs font-bold rounded-full"
                        >{{ course.level }}</span
                      >
                    </div>
                    <h5 class="text-lg font-bold text-neutral-title mb-2">
                      {{ course.title }}
                    </h5>
                    <p class="text-sm text-neutral-body mb-4">
                      {{ course.description }}
                    </p>
                    <div class="flex items-center gap-6 mb-4">
                      <span
                        class="text-xs text-neutral-helper flex items-center gap-1"
                        ><Clock :size="12" /> {{ course.duration }}</span
                      >
                      <span
                        class="text-xs text-neutral-helper flex items-center gap-1"
                        ><Award :size="12" /> {{ course.rating }} ({{
                          course.students
                        }}
                        人学习)</span
                      >
                    </div>
                    <div class="flex flex-wrap gap-2 mb-4">
                      <span
                        v-for="(module, idx) in course.modules"
                        :key="idx"
                        class="px-3 py-1 bg-white rounded-full text-xs font-bold text-neutral-title border border-neutral-border"
                        >{{ module }}</span
                      >
                    </div>
                  </div>
                  <div class="flex flex-col gap-3">
                    <button
                      class="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all text-sm w-full"
                      @click="startLearning(course)"
                    >
                      开始学习
                    </button>
                    <button
                      class="px-6 py-3 bg-white text-primary font-bold rounded-xl hover:bg-primary/10 transition-all text-sm border border-primary/20 w-full"
                      @click="viewCourseDetail(course)"
                    >
                      查看详情
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 推荐课程 -->
            <div class="mt-12">
              <h4 class="text-xl font-bold text-white mb-6">为您推荐</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div
                  class="p-6 bg-primary/5 rounded-2xl border border-primary/20 hover:shadow-md transition-all"
                >
                  <h5 class="text-lg font-bold text-primary mb-3">
                    面试实战模拟
                  </h5>
                  <p class="text-sm text-neutral-body mb-4">
                    基于真实面试场景的实战模拟，提供AI点评和改进建议。
                  </p>
                  <button
                    class="px-4 py-2 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all text-sm"
                  >
                    立即体验
                  </button>
                </div>
                <div
                  class="p-6 bg-auxiliary-orange/5 rounded-2xl border border-auxiliary-orange/20 hover:shadow-md transition-all"
                >
                  <h5 class="text-lg font-bold text-auxiliary-orange mb-3">
                    个性化学习计划
                  </h5>
                  <p class="text-sm text-neutral-body mb-4">
                    根据您的测评结果，生成个性化的学习计划和提升路径。
                  </p>
                  <button
                    class="px-4 py-2 bg-auxiliary-orange text-white font-bold rounded-xl hover:bg-auxiliary-orange/90 transition-all text-sm"
                  >
                    生成计划
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 课程详情模态框 -->
      <div
        v-if="isCourseDetailOpen && selectedCourse"
        class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      >
        <div
          class="bg-white rounded-[32px] w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        >
          <div
            class="p-8 border-b border-neutral-border flex justify-between items-center"
          >
            <h3
              class="text-2xl font-black text-neutral-title flex items-center gap-3"
            >
              <BookOpen :size="28" class="text-primary" />
              课程详情
            </h3>
            <button
              class="w-10 h-10 rounded-full bg-neutral-bg flex items-center justify-center text-neutral-helper hover:bg-primary/10 hover:text-primary transition-all"
              @click="isCourseDetailOpen = false"
            >
              <X :size="20" />
            </button>
          </div>
          <div class="p-8">
            <div class="flex flex-col md:flex-row gap-6 mb-8">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-4">
                  <span
                    class="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full"
                    >{{ selectedCourse.category }}</span
                  >
                  <span
                    class="px-3 py-1 bg-auxiliary-orange/10 text-auxiliary-orange text-xs font-bold rounded-full"
                    >{{ selectedCourse.level }}</span
                  >
                </div>
                <h4 class="text-2xl font-bold text-neutral-title mb-4">
                  {{ selectedCourse.title }}
                </h4>
                <p class="text-sm text-neutral-body mb-6">
                  {{ selectedCourse.description }}
                </p>
                <div class="grid grid-cols-2 gap-4 mb-6">
                  <div
                    class="p-4 bg-neutral-bg rounded-xl border border-neutral-border"
                  >
                    <div class="text-sm text-neutral-helper mb-1">课程时长</div>
                    <div class="text-lg font-bold text-neutral-title">
                      {{ selectedCourse.duration }}
                    </div>
                  </div>
                  <div
                    class="p-4 bg-neutral-bg rounded-xl border border-neutral-border"
                  >
                    <div class="text-sm text-neutral-helper mb-1">课程评分</div>
                    <div class="text-lg font-bold text-neutral-title">
                      {{ selectedCourse.rating }} ⭐
                    </div>
                  </div>
                  <div
                    class="p-4 bg-neutral-bg rounded-xl border border-neutral-border"
                  >
                    <div class="text-sm text-neutral-helper mb-1">学习人数</div>
                    <div class="text-lg font-bold text-neutral-title">
                      {{ selectedCourse.students }} 人
                    </div>
                  </div>
                  <div
                    class="p-4 bg-neutral-bg rounded-xl border border-neutral-border"
                  >
                    <div class="text-sm text-neutral-helper mb-1">课程模块</div>
                    <div class="text-lg font-bold text-neutral-title">
                      {{ selectedCourse.modules.length }} 个
                    </div>
                  </div>
                </div>
                <button
                  class="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all flex items-center justify-center gap-2"
                  @click="startLearning(selectedCourse)"
                >
                  开始学习
                  <ChevronRight :size="20" />
                </button>
              </div>
            </div>

            <!-- 课程模块 -->
            <div class="mb-8">
              <h5 class="text-xl font-bold text-neutral-title mb-6">
                课程模块
              </h5>
              <div class="space-y-4">
                <div
                  v-for="(module, idx) in selectedCourse.modules"
                  :key="idx"
                  class="p-4 bg-neutral-bg rounded-xl border border-neutral-border hover:bg-white hover:shadow-md transition-all"
                >
                  <div class="flex items-center gap-4">
                    <div
                      class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold"
                    >
                      {{ Number(idx) + 1 }}
                    </div>
                    <h6 class="text-lg font-bold text-neutral-title">
                      {{ module }}
                    </h6>
                  </div>
                </div>
              </div>
            </div>

            <!-- 课程评价 -->
            <div>
              <h5 class="text-xl font-bold text-neutral-title mb-6">
                学员评价
              </h5>
              <div class="space-y-4">
                <div
                  v-for="(review, idx) in [
                    {
                      name: '学员A',
                      rating: 5,
                      content:
                        '课程内容非常实用，老师讲解清晰，对我的面试帮助很大。',
                    },
                    {
                      name: '学员B',
                      rating: 4,
                      content:
                        '课程结构合理，练习题目丰富，推荐给准备面试的同学。',
                    },
                    {
                      name: '学员C',
                      rating: 5,
                      content: '老师的教学方法很独特，让我对面试有了新的认识。',
                    },
                  ]"
                  :key="idx"
                  class="p-4 bg-neutral-bg rounded-xl border border-neutral-border"
                >
                  <div class="flex items-center justify-between mb-2">
                    <h6 class="font-bold text-neutral-title">
                      {{ review.name }}
                    </h6>
                    <div class="flex">
                      <span
                        v-for="i in 5"
                        :key="i"
                        class="text-auxiliary-orange"
                      >
                        {{ i <= review.rating ? "★" : "☆" }}
                      </span>
                    </div>
                  </div>
                  <p class="text-sm text-neutral-body">{{ review.content }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 学习模态框 -->
      <div
        v-if="isLearningOpen && selectedCourse"
        class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      >
        <div
          class="bg-white rounded-[32px] w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        >
          <div
            class="p-8 border-b border-neutral-border flex justify-between items-center"
          >
            <h3
              class="text-2xl font-black text-neutral-title flex items-center gap-3"
            >
              <GraduationCap :size="28" class="text-primary" />
              {{ selectedCourse.title }}
            </h3>
            <button
              class="w-10 h-10 rounded-full bg-neutral-bg flex items-center justify-center text-neutral-helper hover:bg-primary/10 hover:text-primary transition-all"
              @click="isLearningOpen = false"
            >
              <X :size="20" />
            </button>
          </div>
          <div class="p-8">
            <!-- 学习进度 -->
            <div class="mb-8">
              <div class="flex justify-between text-sm mb-2">
                <span class="font-bold text-neutral-title">学习进度</span>
                <span class="text-auxiliary-green font-bold"
                  >{{
                    Math.round(
                      ((currentModuleIndex + 1) /
                        selectedCourse.modules.length) *
                        100,
                    )
                  }}% 完成</span
                >
              </div>
              <div class="h-2 bg-neutral-border rounded-full overflow-hidden">
                <div
                  class="h-full bg-primary transition-all"
                  :style="{
                    width:
                      ((currentModuleIndex + 1) /
                        selectedCourse.modules.length) *
                        100 +
                      '%',
                  }"
                ></div>
              </div>
            </div>

            <!-- 当前模块 -->
            <div class="mb-8">
              <div
                class="px-4 py-2 bg-primary/10 text-primary text-sm font-bold rounded-full inline-block mb-4"
              >
                模块 {{ currentModuleIndex + 1 }} /
                {{ selectedCourse.modules.length }}
              </div>
              <h4 class="text-xl font-bold text-neutral-title mb-6">
                {{ selectedCourse.modules[currentModuleIndex] }}
              </h4>
              <div
                class="p-6 bg-neutral-bg rounded-2xl border border-neutral-border mb-6"
              >
                <p class="text-sm text-neutral-body leading-relaxed">
                  {{
                    currentModuleIndex === 0
                      ? "逻辑思维是面试中非常重要的能力，它帮助你清晰地分析问题、有条理地表达思路。在本模块中，我们将学习逻辑思维的基本原理和训练方法。"
                      : currentModuleIndex === 1
                        ? "表达结构是面试中另一个关键能力，良好的表达结构能让你的回答更加清晰、有条理。在本模块中，我们将学习STAR法则等表达技巧。"
                        : currentModuleIndex === 2
                          ? "专业深度是面试中展示你技术能力的重要方面，在本模块中，我们将深入探讨技术领域的核心概念和前沿趋势。"
                          : "面试技巧是帮助你在面试中脱颖而出的关键，在本模块中，我们将学习面试各个环节的技巧，包括简历准备、自我介绍、行为问题回答、薪资谈判等。"
                  }}
                </p>
              </div>

              <!-- 学习内容 -->
              <div class="space-y-4 mb-6">
                <div
                  class="p-4 bg-white rounded-xl border border-neutral-border shadow-sm"
                >
                  <h5 class="font-bold text-neutral-title mb-2">核心概念</h5>
                  <p class="text-sm text-neutral-body">
                    {{
                      currentModuleIndex === 0
                        ? "逻辑思维的核心是结构化思考，它包括分析、推理、判断等能力。"
                        : currentModuleIndex === 1
                          ? "STAR法则是一种结构化的表达方法，包括情境(Situation)、任务(Task)、行动(Action)、结果(Result)。"
                          : currentModuleIndex === 2
                            ? "专业深度要求你对技术领域有深入的理解，包括核心概念、前沿技术和最佳实践。"
                            : "面试技巧包括简历优化、自我介绍、行为问题回答、薪资谈判等方面。"
                    }}
                  </p>
                </div>
                <div
                  class="p-4 bg-white rounded-xl border border-neutral-border shadow-sm"
                >
                  <h5 class="font-bold text-neutral-title mb-2">实战练习</h5>
                  <p class="text-sm text-neutral-body">
                    {{
                      currentModuleIndex === 0
                        ? "练习分析问题的能力，将复杂问题分解为简单的部分，然后逐步解决。"
                        : currentModuleIndex === 1
                          ? "练习使用STAR法则回答行为问题，确保回答结构清晰、内容丰富。"
                          : currentModuleIndex === 2
                            ? "练习解决技术问题，包括算法题、系统设计题等。"
                            : "练习面试各个环节，包括自我介绍、行为问题回答、技术问题回答等。"
                    }}
                  </p>
                </div>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="flex flex-col sm:flex-row gap-4">
              <button
                v-if="currentModuleIndex > 0"
                class="flex-1 py-3 bg-white text-primary font-bold rounded-xl hover:bg-primary/10 transition-all text-sm border border-primary/20"
                @click="currentModuleIndex--"
              >
                上一模块
              </button>
              <button
                v-if="currentModuleIndex < selectedCourse.modules.length - 1"
                class="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all text-sm"
                @click="currentModuleIndex++"
              >
                下一模块
              </button>
              <button
                v-else
                class="flex-1 py-3 bg-auxiliary-green text-white font-bold rounded-xl hover:bg-auxiliary-green/90 transition-all text-sm"
                @click="isLearningOpen = false"
              >
                完成学习
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 匿名分享复盘报告模态框 -->
      <div
        v-if="isShareReportOpen"
        class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      >
        <div
          class="bg-white rounded-[32px] w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <div
            class="p-8 border-b border-neutral-border flex justify-between items-center"
          >
            <h3
              class="text-xl font-bold text-neutral-title flex items-center gap-2"
            >
              <Mic :size="24" class="text-primary" />
              匿名分享复盘报告
            </h3>
            <button
              class="p-2 text-neutral-helper hover:text-neutral-title"
              @click="isShareReportOpen = false"
            >
              <X :size="24" />
            </button>
          </div>
          <div class="p-8">
            <div class="space-y-6">
              <div>
                <label class="block text-sm font-bold text-neutral-title mb-2"
                  >面试类型</label
                >
                <select
                  class="w-full p-4 border border-neutral-border rounded-xl focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="">请选择面试类型</option>
                  <option value="frontend">前端面试</option>
                  <option value="backend">后端面试</option>
                  <option value="fullstack">全栈面试</option>
                  <option value="product">产品经理</option>
                  <option value="other">其他</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-bold text-neutral-title mb-2"
                  >面试公司</label
                >
                <input
                  type="text"
                  class="w-full p-4 border border-neutral-border rounded-xl focus:outline-none focus:border-primary transition-colors"
                  placeholder="请输入公司名称（可选）"
                />
              </div>
              <div>
                <label class="block text-sm font-bold text-neutral-title mb-2"
                  >面试岗位</label
                >
                <input
                  type="text"
                  class="w-full p-4 border border-neutral-border rounded-xl focus:outline-none focus:border-primary transition-colors"
                  placeholder="请输入岗位名称（可选）"
                />
              </div>
              <div>
                <label class="block text-sm font-bold text-neutral-title mb-2"
                  >复盘内容</label
                >
                <textarea
                  class="w-full p-4 border border-neutral-border rounded-xl focus:outline-none focus:border-primary transition-colors"
                  rows="8"
                  placeholder="分享你的面试经验、问题和感受..."
                ></textarea>
              </div>
              <div>
                <label class="block text-sm font-bold text-neutral-title mb-2"
                  >上传文件</label
                >
                <div
                  class="border border-dashed border-neutral-border rounded-xl p-8 text-center cursor-pointer"
                  @click="triggerFileInput"
                >
                  <p class="text-sm text-neutral-helper mb-4">
                    点击或拖拽文件到此处上传
                  </p>
                  <p class="text-xs text-neutral-helper">
                    支持 PDF、Word、音频文件
                  </p>
                  <input
                    ref="fileInputRef"
                    type="file"
                    class="hidden"
                    accept=".pdf,.doc,.docx,.mp3,.wav"
                    multiple
                    @change="handleFileUpload"
                  />
                </div>
                <div
                  v-if="selectedFile"
                  class="mt-3 p-3 bg-neutral-bg rounded-xl"
                >
                  <p class="text-sm font-bold text-neutral-title">
                    已选择文件：{{ selectedFile.name }}
                  </p>
                </div>
              </div>
              <div class="flex items-center">
                <input id="anonymous" type="checkbox" class="mr-2" />
                <label for="anonymous" class="text-sm text-neutral-body"
                  >匿名分享</label
                >
              </div>
              <div class="flex justify-end">
                <button
                  class="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all"
                >
                  发布复盘
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 我的历史存档模态框 -->
      <div
        v-if="isHistoryArchiveOpen"
        class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      >
        <div
          class="bg-white rounded-[32px] w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <div
            class="p-8 border-b border-neutral-border flex justify-between items-center"
          >
            <h3
              class="text-xl font-bold text-neutral-title flex items-center gap-2"
            >
              <FileText :size="24" class="text-primary" />
              我的历史存档
            </h3>
            <button
              class="p-2 text-neutral-helper hover:text-neutral-title"
              @click="isHistoryArchiveOpen = false"
            >
              <X :size="24" />
            </button>
          </div>
          <div class="p-8">
            <div class="space-y-6">
              <div
                v-for="(archive, index) in [
                  {
                    id: 1,
                    title: '前端面试复盘',
                    company: '某大厂',
                    date: '2024-01-15',
                    type: '前端面试',
                    status: '已完成',
                  },
                  {
                    id: 2,
                    title: '后端面试复盘',
                    company: '某互联网公司',
                    date: '2024-01-10',
                    type: '后端面试',
                    status: '已完成',
                  },
                  {
                    id: 3,
                    title: '全栈面试复盘',
                    company: '某科技公司',
                    date: '2024-01-05',
                    type: '全栈面试',
                    status: '已完成',
                  },
                ]"
                :key="index"
                class="p-4 bg-neutral-bg rounded-xl border border-neutral-border hover:bg-white hover:shadow-md transition-all"
              >
                <div class="flex justify-between items-start mb-3">
                  <h4 class="text-sm font-bold text-neutral-title">
                    {{ archive.title }}
                  </h4>
                  <span
                    class="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full"
                    >{{ archive.status }}</span
                  >
                </div>
                <div class="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <p class="text-xs text-neutral-helper mb-1">公司</p>
                    <p class="text-sm font-bold text-neutral-title">
                      {{ archive.company }}
                    </p>
                  </div>
                  <div>
                    <p class="text-xs text-neutral-helper mb-1">面试类型</p>
                    <p class="text-sm font-bold text-neutral-title">
                      {{ archive.type }}
                    </p>
                  </div>
                  <div>
                    <p class="text-xs text-neutral-helper mb-1">日期</p>
                    <p class="text-sm font-bold text-neutral-title">
                      {{ archive.date }}
                    </p>
                  </div>
                </div>
                <div class="flex gap-2">
                  <button
                    class="flex-1 py-2 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all text-xs"
                    @click="viewArchiveDetail(archive)"
                  >
                    查看详情
                  </button>
                  <button
                    class="px-4 py-2 bg-neutral-bg text-neutral-title font-bold rounded-xl hover:bg-neutral-border/50 transition-all text-xs"
                    @click="deleteArchive(archive.id)"
                  >
                    删除
                  </button>
                </div>
              </div>
              <div class="flex justify-center">
                <button
                  class="px-6 py-2 bg-neutral-bg text-neutral-title font-bold rounded-xl hover:bg-neutral-border/50 transition-all text-sm"
                  @click="loadMoreArchives"
                >
                  加载更多
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 全部话题模态框 -->
      <div
        v-if="isAllTopicsOpen"
        class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      >
        <div
          class="bg-white rounded-[32px] w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <div
            class="p-8 border-b border-neutral-border flex justify-between items-center"
          >
            <h3
              class="text-xl font-bold text-neutral-title flex items-center gap-2"
            >
              <Zap :size="24" class="text-auxiliary-orange" />
              全部话题
            </h3>
            <button
              class="p-2 text-neutral-helper hover:text-neutral-title"
              @click="isAllTopicsOpen = false"
            >
              <X :size="24" />
            </button>
          </div>
          <div class="p-8">
            <div class="space-y-4">
              <div
                v-for="(topic, index) in [
                  {
                    id: 1,
                    title: '如何准备大厂面试',
                    posts: 128,
                    participants: 356,
                  },
                  {
                    id: 2,
                    title: '前端框架对比',
                    posts: 96,
                    participants: 289,
                  },
                  {
                    id: 3,
                    title: '系统设计面试指南',
                    posts: 84,
                    participants: 245,
                  },
                  {
                    id: 4,
                    title: '简历优化技巧',
                    posts: 72,
                    participants: 210,
                  },
                  {
                    id: 5,
                    title: '行为问题回答技巧',
                    posts: 68,
                    participants: 195,
                  },
                  {
                    id: 6,
                    title: '技术面试常见问题',
                    posts: 64,
                    participants: 180,
                  },
                  {
                    id: 7,
                    title: '薪资谈判策略',
                    posts: 56,
                    participants: 165,
                  },
                  {
                    id: 8,
                    title: '远程面试技巧',
                    posts: 48,
                    participants: 145,
                  },
                ]"
                :key="index"
                class="p-4 bg-neutral-bg rounded-[20px] hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-neutral-border cursor-pointer"
                @click="
                  selectedTopic = topic;
                  isTopicDetailOpen = true;
                  isAllTopicsOpen = false;
                "
              >
                <h3 class="text-sm font-bold text-neutral-title mb-2">
                  {{ topic.title }}
                </h3>
                <div class="flex items-center gap-4">
                  <span
                    class="text-xs text-neutral-helper flex items-center gap-1"
                    ><MessageSquare :size="12" /> {{ topic.posts }} 帖子</span
                  >
                  <span
                    class="text-xs text-neutral-helper flex items-center gap-1"
                    ><Users :size="12" /> {{ topic.participants }} 参与者</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Sidebar -->
      <div class="lg:col-span-4 space-y-8">
        <!-- 面经 -->
        <div
          class="bg-neutral-title p-8 rounded-[32px] text-white shadow-xl relative overflow-hidden h-[875px] flex flex-col"
        >
          <div class="relative z-10 flex-1">
            <div class="flex items-center gap-3 mb-8">
              <Award :size="32" class="text-auxiliary-orange" />
              <h2 class="text-2xl font-black italic text-white">面经</h2>
            </div>
            <p class="text-white/60 text-sm mb-8 leading-relaxed">
              系统整合社群优质点评，通过算法聚合生成“智慧树”优化课程。为您的个人人格与能力进行精准对标参考。
            </p>

            <div class="space-y-4">
              <div
                v-for="node in [
                  { n: '逻辑层分析', v: 92 },
                  { n: '表达结构', v: 85 },
                  { n: '专业深度', v: 78 },
                ]"
                :key="node.n"
                class="space-y-2"
              >
                <div
                  class="flex justify-between text-[10px] font-bold uppercase text-white/40 tracking-widest"
                >
                  <span>{{ node.n }}</span>
                  <span>{{ node.v }}%</span>
                </div>
                <div class="h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    class="h-full bg-primary"
                    :style="{ width: node.v + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <button
            class="w-full mt-8 py-4 bg-white text-neutral-title font-bold rounded-2xl shadow-lg hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 group relative z-10"
            @click="unlockWisdomCourse"
          >
            解锁智慧课程
            <ChevronRight
              :size="20"
              class="group-hover:translate-x-1 transition-transform"
            />
          </button>

          <div
            class="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform"
          >
            <Sparkles :size="240" />
          </div>
        </div>

        <!-- 热门话题 -->
        <div
          class="bg-white rounded-[32px] p-8 shadow-sm border border-neutral-border"
        >
          <h2
            class="text-xl font-bold text-neutral-title mb-6 flex items-center gap-3"
          >
            <Zap :size="24" class="text-auxiliary-orange" />
            热门话题
          </h2>
          <div class="space-y-4">
            <div
              v-for="topic in hotTopics"
              :key="topic.id"
              class="p-4 bg-neutral-bg rounded-[20px] hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-neutral-border cursor-pointer"
              @click="
                selectedTopic = topic;
                isTopicDetailOpen = true;
              "
            >
              <h3 class="text-sm font-bold text-neutral-title mb-2">
                {{ topic.title }}
              </h3>
              <div class="flex items-center gap-4">
                <span
                  class="text-xs text-neutral-helper flex items-center gap-1"
                  ><MessageSquare :size="12" /> {{ topic.posts }} 帖子</span
                >
                <span
                  class="text-xs text-neutral-helper flex items-center gap-1"
                  ><Users :size="12" /> {{ topic.participants }} 参与者</span
                >
              </div>
            </div>
          </div>
          <div class="mt-6 flex justify-center">
            <button
              class="px-6 py-2 bg-neutral-bg text-neutral-title font-bold rounded-xl hover:bg-neutral-border/50 transition-all text-sm"
              @click="viewAllTopics"
            >
              查看全部话题
            </button>
          </div>
        </div>

        <!-- 活跃用户 -->
        <div
          class="bg-white rounded-[32px] p-8 shadow-sm border border-neutral-border"
        >
          <h2
            class="text-xl font-bold text-neutral-title mb-6 flex items-center gap-3"
          >
            <UserCircle :size="24" class="text-primary" />
            活跃用户
          </h2>
          <div class="space-y-4">
            <div
              v-for="(user, index) in activeUsers"
              :key="index"
              class="flex items-center gap-4 p-3 bg-neutral-bg rounded-[20px] hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-neutral-border cursor-pointer"
              @click="
                selectedUser = user;
                isUserDetailOpen = true;
              "
            >
              <div class="text-2xl">{{ user.avatar }}</div>
              <div class="flex-1">
                <h3 class="text-sm font-bold text-neutral-title">
                  {{ user.name }}
                </h3>
                <p class="text-xs text-neutral-helper">
                  {{ user.posts }} 篇帖子
                </p>
              </div>
              <button
                class="px-3 py-1 font-bold rounded-full text-xs transition-all"
                :class="
                  followedUsers.has(user.name)
                    ? 'bg-neutral-bg text-neutral-title hover:bg-neutral-border/50'
                    : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
                "
                @click.stop="handleToggleFollow(user.name)"
              >
                {{ followedUsers.has(user.name) ? "已关注" : "关注" }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 存档详情模态框 -->
      <div
        v-if="isArchiveDetailOpen"
        class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      >
        <div
          class="bg-white rounded-[32px] w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <div
            class="p-8 border-b border-neutral-border flex justify-between items-center"
          >
            <h3
              class="text-xl font-bold text-neutral-title flex items-center gap-2"
            >
              <FileText :size="24" class="text-primary" />
              存档详情
            </h3>
            <button
              class="p-2 text-neutral-helper hover:text-neutral-title"
              @click="isArchiveDetailOpen = false"
            >
              <X :size="24" />
            </button>
          </div>
          <div class="p-8">
            <div v-if="selectedArchive" class="space-y-6">
              <div>
                <h4 class="text-lg font-bold text-neutral-title mb-2">
                  {{ selectedArchive.title }}
                </h4>
                <div class="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p class="text-xs text-neutral-helper mb-1">公司</p>
                    <p class="text-sm font-bold text-neutral-title">
                      {{ selectedArchive.company }}
                    </p>
                  </div>
                  <div>
                    <p class="text-xs text-neutral-helper mb-1">面试类型</p>
                    <p class="text-sm font-bold text-neutral-title">
                      {{ selectedArchive.type }}
                    </p>
                  </div>
                  <div>
                    <p class="text-xs text-neutral-helper mb-1">日期</p>
                    <p class="text-sm font-bold text-neutral-title">
                      {{ selectedArchive.date }}
                    </p>
                  </div>
                  <div>
                    <p class="text-xs text-neutral-helper mb-1">状态</p>
                    <p class="text-sm font-bold text-primary">
                      {{ selectedArchive.status }}
                    </p>
                  </div>
                </div>
                <div class="p-4 bg-neutral-bg rounded-xl">
                  <h5 class="text-sm font-bold text-neutral-title mb-2">
                    复盘内容
                  </h5>
                  <p class="text-sm text-neutral-body leading-relaxed">
                    这是一份详细的面试复盘报告，包含了面试过程中遇到的问题、回答思路以及面试官的反馈。通过这份复盘，我总结了自己的优势和不足，为未来的面试做好了准备。
                  </p>
                </div>
              </div>
              <div class="flex justify-end">
                <button
                  class="px-6 py-2 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all text-sm"
                >
                  导出报告
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
