import { defineStore } from "pinia";
import { ref } from "vue";
import { learningApi } from "@/api/modules/learning.api";
import type { PracticeBank, PracticeQuestion } from "@/api/types/practice.types";

export const usePracticeStore = defineStore("practice", () => {
  const banks = ref<PracticeBank[]>([]);
  const currentBank = ref<PracticeBank | null>(null);
  const currentQuestionIndex = ref(0);
  const selectedAnswers = ref<Record<number, string>>({});
  const showResult = ref(false);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchBanks(): Promise<void> {
    loading.value = true;
    try {
      const response = await learningApi.getPracticeBanks();
      banks.value = response.data.map((course) => ({
        id: course.id,
        title: course.title,
        description: course.description || "",
        level: course.level || "通用",
        question_count: 0,
        estimated_time: "30分钟",
        pass_rate: 70,
        questions: [] as PracticeQuestion[],
      }));
    } catch (err: any) {
      console.error("[Practice] fetchBanks error:", err);
    } finally {
      loading.value = false;
    }
  }

  function selectBank(bank: PracticeBank): void {
    currentBank.value = bank;
    currentQuestionIndex.value = 0;
    selectedAnswers.value = {};
    showResult.value = false;
  }

  function selectAnswer(questionId: number, answer: string): void {
    selectedAnswers.value[questionId] = answer;
  }

  function nextQuestion(): void {
    if (
      currentBank.value &&
      currentQuestionIndex.value < currentBank.value.questions.length - 1
    ) {
      currentQuestionIndex.value++;
    }
  }

  function prevQuestion(): void {
    if (currentQuestionIndex.value > 0) {
      currentQuestionIndex.value--;
    }
  }

  function submitPractice(): void {
    showResult.value = true;
  }

  function resetPractice(): void {
    currentQuestionIndex.value = 0;
    selectedAnswers.value = {};
    showResult.value = false;
  }

  return {
    banks,
    currentBank,
    currentQuestionIndex,
    selectedAnswers,
    showResult,
    loading,
    error,
    fetchBanks,
    selectBank,
    selectAnswer,
    nextQuestion,
    prevQuestion,
    submitPractice,
    resetPractice,
  };
});
