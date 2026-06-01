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
      category: data.category,
      difficulty: data.difficulty,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  });

  mock.onPost("/learning/materials").reply((config) => {
    const data = JSON.parse(config.data);
    return success({
      id: Date.now(),
      course_id: data.course_id,
      title: data.title,
      type: data.type,
      url: data.url,
      created_at: new Date().toISOString(),
    });
  });

  mock.onPost("/learning/progress/update").reply((config) => {
    const data = JSON.parse(config.data);
    return success({
      id: Date.now(),
      user_id: 1,
      course_id: data.course_id,
      progress: data.progress,
      updated_at: new Date().toISOString(),
    });
  });

  mock.onGet(/\/learning\/progress\/\d+$/).reply((config) => {
    const courseId = parseInt(config.url!.split("/").pop()!);
    return success({
      id: Date.now(),
      user_id: 1,
      course_id: courseId,
      progress: 50,
      updated_at: new Date().toISOString(),
    });
  });

  mock.onGet("/learning/collections").reply(() => {
    return success(mockCollections);
  });

  mock.onPost("/learning/collections").reply((config) => {
    const data = JSON.parse(config.data);
    return success({
      id: Date.now(),
      title: data.title || "",
      description: data.description,
      question_count: 0,
      category: data.category,
      difficulty: data.difficulty,
      saved_at: new Date().toISOString().split("T")[0],
      last_practiced: null,
    });
  });

  mock.onGet("/learning/wrong-questions").reply(() => {
    return success(mockWrongQuestions);
  });

  mock.onPost("/learning/wrong-questions").reply((config) => {
    const data = JSON.parse(config.data);
    return success({
      id: Date.now(),
      question: data.question || "",
      user_answer: data.user_answer,
      correct_answer: data.correct_answer,
      explanation: data.explanation,
      category: data.category,
      difficulty: data.difficulty,
      mistake_count: 1,
      last_mistake_at: new Date().toISOString().split("T")[0],
      status: "unreviewed",
    });
  });

  mock.onPost(/\/learning\/wrong-questions\/\d+\/master$/).reply(() => {
    return success("MARKED_AS_MASTERED");
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
      created_at: new Date().toISOString(),
    });
  });

  mock.onPost(/\/learning\/badges\/award\/\d+$/).reply(() => {
    return success({
      id: Date.now(),
      badge_id: 1,
      awarded_at: new Date().toISOString(),
    });
  });

  mock.onGet("/learning/my-badges").reply(() => {
    return success(mockUserBadges);
  });

  console.log("[Mock] Learning handlers registered");
}
