/**
 * split-openapi.mjs
 *
 * 从原始 OpenAPI 单体文件自动拆分为 11 个模块 Schema 文件。
 * 按 path 前缀自动归类到对应模块。
 *
 * 用法: node scripts/split-openapi.mjs
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ORIGINAL_PATH = join(__dirname, "..", "docs", "api", "original_openapi.json");
const SCHEMAS_DIR = join(__dirname, "..", "docs", "api", "schemas");

// 模块定义：{ name: 输出文件名, prefixes: [path 前缀列表] }
const MODULES = [
  { name: "auth", prefixes: ["/api/v1/auth/"] },
  { name: "user", prefixes: ["/api/v1/user/"] },
  { name: "notification", prefixes: ["/api/v1/notifications/"] },
  { name: "job", prefixes: ["/api/v1/jobs/"] },
  { name: "assessment", prefixes: ["/api/v1/assessments/"] },
  { name: "learning", prefixes: ["/api/v1/learning/"] },
  { name: "community", prefixes: ["/api/v1/community/"] },
  { name: "interview", prefixes: ["/api/v1/interview/"] },
  { name: "business", prefixes: ["/api/v1/business/"] },
  { name: "role", prefixes: ["/api/v1/roles/", "/api/v1/users/", "/api/v1/permissions"] },
  { name: "system", prefixes: ["/api/v1/system/"] },
];

function findModule(pathKey) {
  for (const mod of MODULES) {
    for (const prefix of mod.prefixes) {
      if (pathKey.startsWith(prefix)) return mod.name;
    }
  }
  return null;
}

/**
 * 递归收集某一对象中所有 $ref 引用的 schema 名称，
 * 同时收集 $ref 链上所有中间 schema。
 * 返回 schema 名称数组（无重复，保持发现顺序）。
 */
function collectAllRefs(obj, allSchemas, seen = new Set()) {
  const result = [];
  const toProcess = [obj];

  while (toProcess.length > 0) {
    const current = toProcess.shift();
    if (typeof current !== "object" || current === null) continue;

    for (const key of Object.keys(current)) {
      if (key === "$ref" && typeof current[key] === "string") {
        const refPath = current[key];
        const match = refPath.match(/#\/components\/schemas\/(.+)$/);
        if (match) {
          const name = match[1];
          if (!seen.has(name)) {
            seen.add(name);
            result.push(name);
            // 追踪引用的 schema 定义
            if (allSchemas[name]) {
              toProcess.push(allSchemas[name]);
            }
          }
        }
      } else if (typeof current[key] === "object") {
        toProcess.push(current[key]);
      }
    }
  }
  return result;
}

function stripApiV1Prefix(path) {
  return path.replace(/^\/api\/v1/, "");
}

function cleanOperationId(id) {
  if (!id) return id;
  // 将后端自动生成的长 ID 缩短
  return id
    .replace(/_api_v1_[a-z]+_/g, "_")
    .replace(/^_+|_+$/g, "")
    .replace(/_+/g, "_");
}

function main() {
  if (!existsSync(ORIGINAL_PATH)) {
    console.error(`错误: 找不到原始 OpenAPI 文件: ${ORIGINAL_PATH}`);
    process.exit(1);
  }

  const data = JSON.parse(readFileSync(ORIGINAL_PATH, "utf-8"));

  // 归类 paths
  const modulePaths = {};
  for (const mod of MODULES) {
    modulePaths[mod.name] = {};
  }

  for (const [pathKey, pathObj] of Object.entries(data.paths)) {
    const modName = findModule(pathKey);
    if (modName) {
      // Strip /api/v1 prefix from paths
      const newPath = stripApiV1Prefix(pathKey);
      const newPathObj = JSON.parse(JSON.stringify(pathObj)); // deep clone

      // Clean operationIds
      for (const method of Object.keys(newPathObj)) {
        if (newPathObj[method].operationId) {
          newPathObj[method].operationId = cleanOperationId(newPathObj[method].operationId);
        }
      }

      modulePaths[modName][newPath] = newPathObj;
    }
  }

  // 为每个模块收集需要的 schemas
  const allSchemas = data.components?.schemas || {};

  for (const mod of MODULES) {
    const paths = modulePaths[mod.name];
    if (Object.keys(paths).length === 0) {
      console.log(`  ${mod.name}: 无端点，跳过`);
      continue;
    }

    // 收集本模块所有引用的 schema（含传递引用）
    const neededSchemas = collectAllRefs(paths, allSchemas);

    // 获取 schema 定义
    const schemas = {};
    for (const name of neededSchemas) {
      if (allSchemas[name]) {
        schemas[name] = allSchemas[name];
      }
    }

    // 构建模块文件
    const moduleDoc = { paths };
    if (Object.keys(schemas).length > 0) {
      moduleDoc.components = { schemas };
    }

    const outPath = join(SCHEMAS_DIR, `${mod.name}.openapi.json`);
    writeFileSync(outPath, JSON.stringify(moduleDoc, null, 2), "utf-8");
    console.log(
      `  ✓ ${mod.name}.openapi.json: ${Object.keys(paths).length} paths, ${Object.keys(schemas).length} schemas`
    );
  }

  console.log(`\n全部完成! 共 ${MODULES.length} 个模块`);
}

main();
