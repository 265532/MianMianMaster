import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { learningApi } from "@/api/modules/learning.api";
import type {
  Course,
  Collection,
  WrongQuestion,
  Badge,
  UserBadge,
  LearningProgress,
} from "@/api/types/learning.types";

export const useLearningStore = defineStore("learning", () => {
  const courses = ref<Course[]>([]);
  const collections = ref<Collection[]>([]);
  const wrongQuestions = ref<WrongQuestion[]>([]);
  const badges = ref<Badge[]>([]);
  const myBadges = ref<UserBadge[]>([]);
  const progressMap = ref<Record<number, LearningProgress>>({});
  const loading = ref(false);
  const error = ref<string | null>(null);

  const unreviewedWrongQuestions = computed(() =>
    wrongQuestions.value.filter((q) => q.status === "unreviewed"),
  );

  const reviewedWrongQuestions = computed(() =>
    wrongQuestions.value.filter((q) => q.status === "reviewed"),
  );

  async function fetchCourses(): Promise<void> {
    loading.value = true;
    error.value = null;

    try {
      const response = await learningApi.getCourses();
      courses.value = response.data;
    } catch (err: any) {
      error.value =
        err?.response?.data?.message || err?.message || "获取课程失败";
      console.error("[Learning] fetchCourses error:", err);
    } finally {
      loading.value = false;
    }
  }

  async function fetchCollections(): Promise<void> {
    loading.value = true;
    error.value = null;

    try {
      const response = await learningApi.getCollections();
      collections.value = response.data;
    } catch (err: any) {
      console.warn("[Learning] fetchCollections failed, using mock data:", err?.message);
      const { mockCollections } = await import("@/mock/data/learning.mock");
      collections.value = mockCollections;
    } finally {
      loading.value = false;
    }
  }

  async function addToCollection(data: Record<string, any>): Promise<boolean> {
    try {
      const response = await learningApi.addToCollection(data);
      collections.value.unshift(response.data);
      return true;
    } catch (err: any) {
      error.value = err?.response?.data?.message || err?.message || "收藏失败";
      throw err;
    }
  }

  async function fetchWrongQuestions(): Promise<void> {
    loading.value = true;
    error.value = null;

    try {
      const response = await learningApi.getWrongQuestions();
      wrongQuestions.value = response.data;
    } catch (err: any) {
      console.warn("[Learning] fetchWrongQuestions failed, using mock data:", err?.message);
      const { mockWrongQuestions } = await import("@/mock/data/learning.mock");
      wrongQuestions.value = mockWrongQuestions;
    } finally {
      loading.value = false;
    }
  }

  async function recordWrongQuestion(
    data: Record<string, any>,
  ): Promise<boolean> {
    try {
      const response = await learningApi.recordWrongQuestion(data);
      wrongQuestions.value.unshift(response.data);
      return true;
    } catch (err: any) {
      error.value =
        err?.response?.data?.message || err?.message || "记录错题失败";
      throw err;
    }
  }

  async function markWrongQuestionMastered(
    questionId: number,
  ): Promise<boolean> {
    try {
      await learningApi.markWrongQuestionMastered(questionId);
      const question = wrongQuestions.value.find((q) => q.id === questionId);
      if (question) {
        question.status = "mastered";
      }
      return true;
    } catch (err: any) {
      error.value = err?.response?.data?.message || err?.message || "标记失败";
      throw err;
    }
  }

  async function fetchBadges(): Promise<void> {
    try {
      const response = await learningApi.getBadges();
      badges.value = response.data;
    } catch (err: any) {
      console.error("[Learning] fetchBadges error:", err);
    }
  }

  async function fetchMyBadges(): Promise<void> {
    try {
      const response = await learningApi.getMyBadges();
      myBadges.value = response.data;
    } catch (err: any) {
      console.error("[Learning] fetchMyBadges error:", err);
    }
  }

  async function fetchProgress(courseId: number): Promise<void> {
    try {
      const response = await learningApi.getProgress(courseId);
      progressMap.value[courseId] = response.data;
    } catch (err: any) {
      console.error("[Learning] fetchProgress error:", err);
    }
  }

  async function updateProgress(
    courseId: number,
    progress: number,
  ): Promise<void> {
    try {
      const response = await learningApi.updateProgress(courseId, progress);
      progressMap.value[courseId] = response.data;
    } catch (err: any) {
      console.error("[Learning] updateProgress error:", err);
    }
  }

  async function fetchAllLearningData(): Promise<void> {
    loading.value = true;
    try {
      await Promise.all([
        fetchCourses(),
        fetchCollections(),
        fetchWrongQuestions(),
        fetchMyBadges(),
      ]);
    } finally {
      loading.value = false;
    }
  }

  return {
    courses,
    collections,
    wrongQuestions,
    badges,
    myBadges,
    progressMap,
    loading,
    error,
    unreviewedWrongQuestions,
    reviewedWrongQuestions,
    fetchCourses,
    fetchCollections,
    addToCollection,
    fetchWrongQuestions,
    recordWrongQuestion,
    markWrongQuestionMastered,
    fetchBadges,
    fetchMyBadges,
    fetchProgress,
    updateProgress,
    fetchAllLearningData,
  };
});
