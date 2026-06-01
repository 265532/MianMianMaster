import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";

vi.mock("@/api/modules/learning.api", () => ({
  learningApi: {
    getCourses: vi.fn(),
    getCollections: vi.fn(),
    addToCollection: vi.fn(),
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
            title: "高频算法50题",
            question_count: 50,
            category: "算法",
            difficulty: "medium",
          },
          {
            id: 2,
            title: "Vue3核心知识",
            question_count: 30,
            category: "前端",
            difficulty: "easy",
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
            question: "Vue3组件通信方式？",
            user_answer: "props",
            correct_answer: "props/events/provide/pinia",
            category: "前端",
            status: "unreviewed",
          },
          {
            id: 2,
            question: "React Hooks规则？",
            user_answer: "不确定",
            correct_answer: "只在顶层调用",
            category: "前端",
            status: "unreviewed",
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
      const mockedAddToCollection = vi.mocked(learningApi.addToCollection);

      mockedAddToCollection.mockResolvedValue({
        code: 200,
        message: "success",
        data: { id: 100, status: "success" },
      });

      const { useLearningStore } = await import("@/stores/learning");
      const store = useLearningStore();

      const result = await store.addToCollection({ question_bank_id: 1 });

      expect(result).toBe(true);
      expect(mockedAddToCollection).toHaveBeenCalledWith({
        question_bank_id: 1,
      });
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
        data: "mastered",
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
          { id: 1, name: "初学者", description: "完成首次练习", icon: "🏅" },
          { id: 2, name: "坚持者", description: "连续7天学习", icon: "🔥" },
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
