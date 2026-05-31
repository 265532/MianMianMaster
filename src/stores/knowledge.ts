import { defineStore } from 'pinia'
import { ref } from 'vue'
import { learningApi } from '@/api/modules/learning.api'
import { jobApi } from '@/api/modules/job.api'
import type { Course } from '@/api/types/learning.types'
import type { JobPosition, SkillTreeNode } from '@/api/types/job.types'

export interface CategoryDetail {
  subcategories: { id: number; name: string; count: number }[]
  hotTopics: string[]
}

export const useKnowledgeStore = defineStore('knowledge', () => {
  const categories = ref<any[]>([])
  const categoryDetails = ref<Record<number, CategoryDetail>>({})
  const courses = ref<Course[]>([])
  const jobPositions = ref<JobPosition[]>([])
  const skillTrees = ref<Record<number, SkillTreeNode>>({})
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchCourses(): Promise<void> {
    try {
      const response = await learningApi.getCourses()
      courses.value = response.data
    } catch (err: any) {
      console.error('[Knowledge] fetchCourses error:', err)
    }
  }

  async function fetchJobPositions(): Promise<void> {
    try {
      const response = await jobApi.listJobPositions()
      jobPositions.value = response.data
    } catch (err: any) {
      console.error('[Knowledge] fetchJobPositions error:', err)
    }
  }

  async function fetchSkillTree(jobId: number): Promise<void> {
    try {
      const response = await jobApi.getSkillTree(jobId)
      skillTrees.value[jobId] = response.data
    } catch (err: any) {
      console.error('[Knowledge] fetchSkillTree error:', err)
    }
  }

  async function fetchAllData(): Promise<void> {
    loading.value = true
    try {
      await Promise.all([
        fetchCourses(),
        fetchJobPositions()
      ])
    } finally {
      loading.value = false
    }
  }

  return {
    categories,
    categoryDetails,
    courses,
    jobPositions,
    skillTrees,
    loading,
    error,
    fetchCourses,
    fetchJobPositions,
    fetchSkillTree,
    fetchAllData
  }
})
