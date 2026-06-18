import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { learningApi } from "@/api/modules/learning.api";
import type {
  Course,
  Collection,
  CollectionCreate,
  WrongQuestion,
  WrongQuestionCreate,
  Badge,
  UserBadge,
  LearningProgress,
  ProgressUpdateBody,
} from "@/api/types/learning.types";

export const useLearningStore = defineStore("learning", () => {
  const courses = ref<Course[]>([]);
  const collections = ref<Collection[]>([]);
  const wrongQuestions = ref<WrongQuestion[]>([]);
  const badges = ref<Badge[]>([]);
  const myBadges = ref<UserBadge[]>([]);
  const progressMap = ref<Record<number, LearningProgress[]>>({});
  const loading = ref(false);
  const error = ref<string | null>(null);

  const unreviewedWrongQuestions = computed(() =>
    wrongQuestions.value.filter((q) => !q.is_mastered),
  );

  const reviewedWrongQuestions = computed(() =>
    wrongQuestions.value.filter((q) => q.is_mastered),
  );

  async function fetchCourses(): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      const response = await learningApi.getCourses();
      courses.value = response.data;
    } catch (err: any) {
      error.value = err?.response?.data?.message || err?.message || "获取课程失败";
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
      error.value = err?.response?.data?.message || err?.message || "获取收藏集失败";
      console.error("[Learning] fetchCollections error:", err);
    } finally {
      loading.value = false;
    }
  }

  async function addToCollection(data: CollectionCreate): Promise<boolean> {
    try {
      const response = await learningApi.createCollection(data);
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
      error.value = err?.response?.data?.message || err?.message || "获取错题失败";
      console.error("[Learning] fetchWrongQuestions error:", err);
    } finally {
      loading.value = false;
    }
  }

  async function recordWrongQuestion(data: WrongQuestionCreate): Promise<boolean> {
    try {
      const response = await learningApi.recordWrongQuestion(data);
      wrongQuestions.value.unshift(response.data);
      return true;
    } catch (err: any) {
      error.value = err?.response?.data?.message || err?.message || "记录错题失败";
      throw err;
    }
  }

  async function markWrongQuestionMastered(questionId: number): Promise<boolean> {
    try {
      const response = await learningApi.markWrongQuestionMastered(questionId);
      const idx = wrongQuestions.value.findIndex((q) => q.question_id === questionId);
      if (idx !== -1) {
        wrongQuestions.value[idx] = response.data;
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
    materialId: number,
    body: ProgressUpdateBody,
  ): Promise<void> {
    try {
      const response = await learningApi.updateProgress(courseId, materialId, body);
      // Update progress map
      if (!progressMap.value[courseId]) {
        progressMap.value[courseId] = [];
      }
      const idx = progressMap.value[courseId].findIndex((p) => p.material_id === materialId);
      if (idx !== -1) {
        progressMap.value[courseId][idx] = response.data;
      } else {
        progressMap.value[courseId].push(response.data);
      }
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
