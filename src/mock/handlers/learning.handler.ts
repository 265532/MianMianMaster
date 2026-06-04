import type MockAdapter from "axios-mock-adapter";
import {
  mockCourses,
  mockCollections,
  mockWrongQuestions,
  mockBadges,
  mockUserBadges,
} from "../data/learning.mock";

function success<T>(
  data: T,
): [number, { code: number; message: string; data: T }] {
  return [200, { code: 200, message: "success", data }];
}

export function registerLearningHandlers(mock: MockAdapter): void {
  mock.onGet("/learning/courses").reply(() => {
    return success(mockCourses);
  });

  mock.onPost("/learning/courses").reply((config) => {
    const data = JSON.parse(config.data);
    return success({
      id: Date.now(),
      title: data.title || "",
      description: data.description,
      level: data.level,
      cover_url: data.cover_url ?? null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      materials: [],
    });
  });

  mock.onPost("/learning/materials").reply((config) => {
    const data = JSON.parse(config.data);
    return success({
      id: Date.now(),
      course_id: data.course_id,
      title: data.title,
      material_type: data.material_type,
      url: data.url,
      duration: data.duration,
      order_num: data.order_num,
      knowledge_graph_id: data.knowledge_graph_id,
      created_at: new Date().toISOString(),
    });
  });

  mock.onPost("/learning/progress/update").reply((config) => {
    const data = JSON.parse(config.data);
    return success({
      id: Date.now(),
      user_id: 1,
      course_id: 1,
      material_id: 1,
      progress_percent: data.progress_percent ?? 0,
      is_completed: data.is_completed ?? false,
      last_accessed_at: new Date().toISOString(),
    });
  });

  mock.onGet(/\/learning\/progress\/\d+$/).reply(() => {
    return success([]);
  });

  mock.onGet("/learning/collections").reply(() => {
    return success(mockCollections);
  });

  mock.onPost("/learning/collections").reply((config) => {
    const data = JSON.parse(config.data);
    const newCollection = {
      id: Date.now(),
      user_id: 1,
      title: data.title || "",
      description: data.description,
      category: data.category,
      difficulty: data.difficulty,
      created_at: new Date().toISOString(),
    };
    mockCollections.unshift(newCollection);
    return success(newCollection);
  });

  mock.onGet("/learning/wrong-questions").reply(() => {
    return success(mockWrongQuestions);
  });

  mock.onPost("/learning/wrong-questions").reply((config) => {
    const data = JSON.parse(config.data);
    const newWrongQuestion = {
      id: Date.now(),
      user_id: 1,
      question_id: data.question_id,
      wrong_answer: data.wrong_answer,
      answer_count: 1,
      is_mastered: false,
      last_answered_at: new Date().toISOString(),
    };
    mockWrongQuestions.unshift(newWrongQuestion);
    return success(newWrongQuestion);
  });

  mock.onPost(/\/learning\/wrong-questions\/\d+\/master$/).reply((config) => {
    const questionId = parseInt(config.url?.split("/")[3] ?? "0");
    const question = mockWrongQuestions.find((q) => q.question_id === questionId);
    if (question) {
      question.is_mastered = true;
      return success(question);
    }
    return success({
      id: Date.now(),
      user_id: 1,
      question_id: questionId,
      wrong_answer: null,
      answer_count: 0,
      is_mastered: true,
      last_answered_at: new Date().toISOString(),
    });
  });

  mock.onGet("/learning/badges").reply(() => {
    return success(mockBadges);
  });

  mock.onPost("/learning/badges").reply((config) => {
    const data = JSON.parse(config.data);
    return success({
      id: Date.now(),
      name: data.name || "",
      description: data.description,
      icon_url: data.icon_url,
      condition_type: data.condition_type || "",
      condition_value: data.condition_value,
      created_at: new Date().toISOString(),
    });
  });

  mock.onPost(/\/learning\/badges\/award\/\d+$/).reply((config) => {
    const badgeId = parseInt(config.url?.split("/").pop() ?? "0");
    const newBadge = {
      id: Date.now(),
      user_id: 1,
      badge_id: badgeId,
      awarded_at: new Date().toISOString(),
    };
    mockUserBadges.unshift(newBadge);
    return success(newBadge);
  });

  mock.onGet("/learning/my-badges").reply(() => {
    return success(mockUserBadges);
  });

  console.log("[Mock] Learning handlers registered");
}
