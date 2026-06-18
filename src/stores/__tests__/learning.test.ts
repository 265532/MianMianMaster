import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";

vi.mock("@/api/modules/learning.api", () => ({
  learningApi: {
    getCourses: vi.fn(),
    getCollections: vi.fn(),
    createCollection: vi.fn(),
    getWrongQuestions: vi.fn(),
    recordWrongQuestion: vi.fn(),
    markWrongQuestionMastered: vi.fn(),
    getBadges: vi.fn(),
    getMyBadges: vi.fn(),
    getProgress: vi.fn(),
    updateProgress: vi.fn(),
  },
}));

describe("useLearningStore integration", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  describe("fetchCollections", () => {
    it("should fetch collections and update state", async () => {
      const { learningApi } = await import("@/api/modules/learning.api");
      const mockedGetCollections = vi.mocked(learningApi.getCollections);

      mockedGetCollections.mockResolvedValue({
        code: 200,
        message: "success",
        data: [
          {
            id: 1,
            user_id: 1,
            title: "高频算法50题",
            category: "算法",
            difficulty: "medium",
            created_at: "2026-03-20T00:00:00Z",
          },
          {
            id: 2,
            user_id: 1,
            title: "Vue3核心知识",
            category: "前端",
            difficulty: "easy",
            created_at: "2026-03-15T00:00:00Z",
          },
        ],
      });

      const { useLearningStore } = await import("@/stores/learning");
      const store = useLearningStore();

      await store.fetchCollections();

      expect(mockedGetCollections).toHaveBeenCalled();
      expect(store.collections.length).toBe(2);
      expect(store.collections[0].title).toBe("高频算法50题");
      expect(store.loading).toBe(false);
    });
  });

  describe("fetchWrongQuestions", () => {
    it("should fetch wrong questions and update state", async () => {
      const { learningApi } = await import("@/api/modules/learning.api");
      const mockedGetWrongQuestions = vi.mocked(learningApi.getWrongQuestions);

      mockedGetWrongQuestions.mockResolvedValue({
        code: 200,
        message: "success",
        data: [
          {
            id: 1,
            user_id: 1,
            question_id: 101,
            wrong_answer: "props",
            answer_count: 1,
            is_mastered: false,
            last_answered_at: "2026-03-24T00:00:00Z",
          },
          {
            id: 2,
            user_id: 1,
            question_id: 102,
            wrong_answer: "不确定",
            answer_count: 1,
            is_mastered: false,
            last_answered_at: "2026-03-20T00:00:00Z",
          },
        ],
      });

      const { useLearningStore } = await import("@/stores/learning");
      const store = useLearningStore();

      await store.fetchWrongQuestions();

      expect(mockedGetWrongQuestions).toHaveBeenCalled();
      expect(store.wrongQuestions.length).toBe(2);
    });
  });

  describe("addToCollection", () => {
    it("should add to collection successfully", async () => {
      const { learningApi } = await import("@/api/modules/learning.api");
      const mockedCreateCollection = vi.mocked(learningApi.createCollection);

      mockedCreateCollection.mockResolvedValue({
        code: 200,
        message: "success",
        data: {
          id: 100,
          user_id: 1,
          title: "新收藏",
          created_at: "2026-06-04T00:00:00Z",
        },
      });

      const { useLearningStore } = await import("@/stores/learning");
      const store = useLearningStore();

      const result = await store.addToCollection({ title: "新收藏" });

      expect(result).toBe(true);
      expect(mockedCreateCollection).toHaveBeenCalledWith({ title: "新收藏" });
    });
  });

  describe("markWrongQuestionMastered", () => {
    it("should mark wrong question as mastered", async () => {
      const { learningApi } = await import("@/api/modules/learning.api");
      const mockedMarkMastered = vi.mocked(
        learningApi.markWrongQuestionMastered,
      );

      mockedMarkMastered.mockResolvedValue({
        code: 200,
        message: "success",
        data: {
          id: 1,
          user_id: 1,
          question_id: 1,
          wrong_answer: "test",
          answer_count: 1,
          is_mastered: true,
          last_answered_at: "2026-06-04T00:00:00Z",
        },
      });

      const { useLearningStore } = await import("@/stores/learning");
      const store = useLearningStore();

      const result = await store.markWrongQuestionMastered(1);

      expect(result).toBe(true);
      expect(mockedMarkMastered).toHaveBeenCalledWith(1);
    });
  });

  describe("fetchBadges", () => {
    it("should fetch badges and update state", async () => {
      const { learningApi } = await import("@/api/modules/learning.api");
      const mockedGetBadges = vi.mocked(learningApi.getBadges);

      mockedGetBadges.mockResolvedValue({
        code: 200,
        message: "success",
        data: [
          { id: 1, name: "初学者", description: "完成首次练习", icon_url: "sparkles", condition_type: "first_practice", created_at: "2026-01-01T00:00:00Z" },
          { id: 2, name: "坚持者", description: "连续7天学习", icon_url: "calendar", condition_type: "streak_days", condition_value: "7", created_at: "2026-01-01T00:00:00Z" },
        ],
      });

      const { useLearningStore } = await import("@/stores/learning");
      const store = useLearningStore();

      await store.fetchBadges();

      expect(mockedGetBadges).toHaveBeenCalled();
      expect(store.badges.length).toBe(2);
    });
  });
});
