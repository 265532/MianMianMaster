import { defineStore } from "pinia";
import { ref } from "vue";
import { assessmentApi } from "@/api/modules/assessment.api";
import type {
  Assessment,
  AssessmentCreate,
  AssessmentSubmit,
  AssessmentResult,
} from "@/api/types/assessment.types";

export const useAssessmentStore = defineStore("assessment", () => {
  const assessments = ref<Assessment[]>([]);
  const currentResult = ref<AssessmentResult | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchAssessments(params?: { skip?: number; limit?: number }): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      const response = await assessmentApi.getAssessments(params);
      assessments.value = response.data;
    } catch (err: any) {
      error.value = err?.response?.data?.message || err?.message || "获取测评列表失败";
      console.error("[Assessment] fetchAssessments error:", err);
    } finally {
      loading.value = false;
    }
  }

  async function createAssessment(data: AssessmentCreate): Promise<Assessment | null> {
    loading.value = true;
    error.value = null;
    try {
      const response = await assessmentApi.createAssessment(data);
      const newAssessment = response.data;
      assessments.value.unshift(newAssessment);
      return newAssessment;
    } catch (err: any) {
      error.value = err?.response?.data?.message || err?.message || "创建测评失败";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function submitAssessment(data: AssessmentSubmit): Promise<AssessmentResult | null> {
    loading.value = true;
    error.value = null;
    try {
      const response = await assessmentApi.submitAssessment(data);
      currentResult.value = response.data;
      return response.data;
    } catch (err: any) {
      error.value = err?.response?.data?.message || err?.message || "提交测评失败";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchResult(assessmentId: number): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      const response = await assessmentApi.getResult(assessmentId);
      currentResult.value = response.data;
    } catch (err: any) {
      error.value = err?.response?.data?.message || err?.message || "获取测评结果失败";
      console.error("[Assessment] fetchResult error:", err);
    } finally {
      loading.value = false;
    }
  }

  return {
    assessments,
    currentResult,
    loading,
    error,
    fetchAssessments,
    createAssessment,
    submitAssessment,
    fetchResult,
  };
});
