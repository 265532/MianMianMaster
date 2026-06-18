/**
 * Mock 数据导出脚本
 * 将 src/mock/data/*.mock.ts 中的所有数据导出为标准 JSON 文件
 * 输出目录: docs/seed-data/
 *
 * 运行方式: npx tsx scripts/export-mock-data.ts
 */

import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// ESM 兼容的 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ---- 导入所有 mock 数据 ----

// user.mock.ts
import {
  mockUser,
  mockInterviewHistory,
  mockAbilityData,
  mockGameInterviewData,
  mockResumeData,
  mockResumeDiagnosisResult,
} from "../src/mock/data/user.mock";

// interview.mock.ts
import {
  mockInterviewSessions,
  mockInterviewReport,
  mockGameLevels,
  mockGameStats,
  mockGameAchievements,
  mockLeaderboard,
} from "../src/mock/data/interview.mock";

// community.mock.ts
import {
  mockPosts,
  mockComments,
  mockHotTopics,
  mockActiveUsers,
} from "../src/mock/data/community.mock";

// learning.mock.ts
import {
  mockCourses,
  mockCollections,
  mockWrongQuestions,
  mockBadges,
  mockUserBadges,
} from "../src/mock/data/learning.mock";

// assessment.mock.ts
import {
  mockAssessments,
  mockAssessmentResults,
} from "../src/mock/data/assessment.mock";

// auth.mock.ts
import { mockRegisterUser } from "../src/mock/data/auth.mock";

// notification.mock.ts
import {
  mockNotifications,
  mockNotificationPreferences,
} from "../src/mock/data/notification.mock";

// job.mock.ts
import {
  mockJobPositions,
  mockSkillTree,
  mockJobMatchResults,
} from "../src/mock/data/job.mock";

// system.mock.ts
import {
  mockSystemConfigs,
  mockSystemAnnouncements,
} from "../src/mock/data/system.mock";

// ---- 工具函数 ----

const outputDir = join(__dirname, "../docs/seed-data");

function ensureDir(dir: string) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

function save(subDir: string, filename: string, data: unknown) {
  const dir = join(outputDir, subDir);
  ensureDir(dir);
  const filePath = join(dir, filename);
  const json = JSON.stringify(data, null, 2);
  writeFileSync(filePath, json, "utf-8");
  const size = Buffer.byteLength(json, "utf-8");
  const sizeStr =
    size > 1024 ? `${(size / 1024).toFixed(1)} KB` : `${size} B`;
  console.log(`  ✅ ${subDir}/${filename} (${sizeStr})`);
}

// ---- 导出开始 ----

console.log("🚀 开始导出 Mock 数据...\n");

// === Auth 模块 (仅用户数据，token 不入库) ===
console.log("📦 Auth 模块");
save("auth", "users.json", [mockUser, mockRegisterUser]);

// === User 模块 ===
console.log("\n📦 User 模块");
save("user", "interview_history.json", mockInterviewHistory);
save("user", "ability_data.json", mockAbilityData);
save("user", "resume_data.json", mockResumeData);
save("user", "resume_diagnosis.json", mockResumeDiagnosisResult);

// === Interview 模块 ===
console.log("\n📦 Interview 模块");
save("interview", "sessions.json", mockInterviewSessions);
save("interview", "reports.json", [mockInterviewReport]);
save("interview", "game_levels.json", mockGameLevels);
save("interview", "game_stats.json", [mockGameStats]);
save("interview", "game_achievements.json", mockGameAchievements);
save("interview", "leaderboard.json", mockLeaderboard);
save("interview", "game_interview_data.json", mockGameInterviewData);

// === Community 模块 ===
console.log("\n📦 Community 模块");
save("community", "posts.json", mockPosts);
save("community", "comments.json", mockComments);
save("community", "hot_topics.json", mockHotTopics);
save("community", "active_users.json", mockActiveUsers);

// === Learning 模块 ===
console.log("\n📦 Learning 模块");
save("learning", "courses.json", mockCourses);
save("learning", "collections.json", mockCollections);
save("learning", "wrong_questions.json", mockWrongQuestions);
save("learning", "badges.json", mockBadges);
save("learning", "user_badges.json", mockUserBadges);

// === Assessment 模块 ===
console.log("\n📦 Assessment 模块");
save("assessment", "assessments.json", mockAssessments);
save("assessment", "results.json", mockAssessmentResults);

// === Notification 模块 ===
console.log("\n📦 Notification 模块");
save("notification", "notifications.json", mockNotifications);
save("notification", "preferences.json", [mockNotificationPreferences]);

// === Job 模块 ===
console.log("\n📦 Job 模块");
save("job", "positions.json", mockJobPositions);
save("job", "skill_tree.json", [mockSkillTree]);
save("job", "match_results.json", mockJobMatchResults);

// === System 模块 ===
console.log("\n📦 System 模块");
save("system", "configs.json", mockSystemConfigs);
save("system", "announcements.json", mockSystemAnnouncements);

// ---- 汇总 ----
console.log("\n" + "=".repeat(50));
console.log("🎉 Mock 数据导出完成！");
console.log(`📁 输出目录: ${outputDir}`);
console.log("=".repeat(50));
