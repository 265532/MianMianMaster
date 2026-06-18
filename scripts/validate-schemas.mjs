/**
 * validate-schemas.mjs
 *
 * 验证合并后的 OpenAPI Schema 文件的完整性和命名一致性。
 *
 * 检查项:
 *  1. 所有 $ref 可解析
 *  2. 所有 schema 的 properties 键名均为 snake_case
 *  3. 所有 schema 名称均为 PascalCase
 *
 * 用法: node scripts/validate-schemas.mjs [schema-path]
 *       默认验证 docs/api/openapi.json
 */

import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DEFAULT_PATH = join(__dirname, "..", "docs", "api", "openapi.json");

const schemaPath = process.argv[2] || DEFAULT_PATH;

if (!existsSync(schemaPath)) {
  console.error(`错误: Schema 文件不存在: ${schemaPath}`);
  console.error("请先运行: npm run schema:merge");
  process.exit(1);
}

const data = JSON.parse(readFileSync(schemaPath, "utf-8"));
const schemas = data.components?.schemas || {};

let errorCount = 0;
let warnCount = 0;

function err(msg) {
  console.error(`  ❌ ${msg}`);
  errorCount++;
}

function warn(msg) {
  console.warn(`  ⚠️  ${msg}`);
  warnCount++;
}

// ─── 检查 1: 所有 $ref 可解析 ──────────────────────────
console.log("\n🔍 检查 1/3: $ref 可解析性");

function checkRefs(obj, context) {
  if (typeof obj !== "object" || obj === null) return;
  for (const key of Object.keys(obj)) {
    if (key === "$ref" && typeof obj[key] === "string") {
      const refPath = obj[key];
      const match = refPath.match(/#\/components\/schemas\/(.+)$/);
      if (match) {
        const name = match[1];
        if (!schemas[name]) {
          err(`${context}: $ref 引用未定义的 schema "${name}"`);
        }
      }
    } else if (typeof obj[key] === "object") {
      checkRefs(obj[key], `${context}.${key}`);
    }
  }
}

checkRefs(data.paths, "paths");
checkRefs(data.components, "components");

// ─── 检查 2: snake_case 属性名 ─────────────────────────
console.log("\n🔍 检查 2/3: snake_case 属性名");

const snakeCaseRe = /^[a-z][a-z0-9]*(_[a-z0-9]+)*$/;

// 允许的特殊字段名（如 operationId 等非 schema property 的 key）
const SKIP_TOP_KEYS = new Set([
  "operationId", "description", "summary", "title",
  "content", "schema", "requestBody", "responses",
  "parameters", "security", "tags", "type", "format",
  "required", "properties", "items", "default", "enum",
  "anyOf", "allOf", "oneOf", "not", "additionalProperties",
  "minimum", "maximum", "minLength", "maxLength", "pattern",
  "$ref", "in", "name", "example", "examples", "deprecated",
  "servers", "securitySchemes", "flows", "tokenUrl", "scopes",
  "OAuth2PasswordBearer", "password", "code", "message", "data",
  "detail", "loc", "msg", "input", "ctx",
  // x- extensions
]);

for (const [schemaName, schemaDef] of Object.entries(schemas)) {
  if (schemaDef.properties) {
    for (const propName of Object.keys(schemaDef.properties)) {
      if (!snakeCaseRe.test(propName)) {
        err(
          `Schema "${schemaName}" 的属性 "${propName}" 不符合 snake_case 规范`
        );
      }
    }
  }
}

// ─── 检查 3: PascalCase schema 名称 ────────────────────
console.log("\n🔍 检查 3/3: PascalCase schema 名称");

const pascalCaseRe = /^[A-Z][a-zA-Z0-9]*$/;

for (const schemaName of Object.keys(schemas)) {
  // 泛型参数如 ResponseModel[T] 不在传统 PascalCase 范围内，跳过
  if (schemaName.includes("[") || schemaName.includes("_")) {
    // FastAPI 自动生成的 schema 名含下划线，如 ResponseModel_Token_
    // 这是已知的命名约定，不报错
    continue;
  }
  if (!pascalCaseRe.test(schemaName)) {
    warn(`Schema 名称 "${schemaName}" 可能不符合 PascalCase 规范`);
  }
}

// ─── 检查 4: paths 统计 ────────────────────────────────
console.log("\n📊 Schema 统计:");
const pathCount = Object.keys(data.paths || {}).length;
const schemaCount = Object.keys(schemas).length;
console.log(`  Paths: ${pathCount}`);
console.log(`  Schemas: ${schemaCount}`);

// ─── 汇总 ──────────────────────────────────────────────
console.log(`\n${"─".repeat(40)}`);
if (errorCount > 0) {
  console.error(`❌ 发现 ${errorCount} 个错误, ${warnCount} 个警告`);
  process.exit(1);
} else if (warnCount > 0) {
  console.log(`✅ 验证通过 (${warnCount} 个警告)`);
} else {
  console.log(`✅ 全部验证通过`);
}
