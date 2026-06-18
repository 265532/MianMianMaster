/**
 * merge-openapi.mjs
 *
 * 合并 docs/api/schemas/ 下的模块级 OpenAPI 文件，
 * 产出单一的 docs/api/openapi.json 供 openapi-typescript 使用。
 *
 * 用法: node scripts/merge-openapi.mjs
 *
 * 合并规则:
 *  - _openapi.base.json 作为骨架，提供 info、servers、securitySchemes 和共享 schemas
 *  - 各模块文件 (.openapi.json) 的 paths 和 components.schemas 被深度合并到骨架中
 *  - 同名 path 或 schema 会报错退出，防止意外覆盖
 *  - 忽略 _openapi.base.json 自身
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCHEMAS_DIR = join(__dirname, "..", "docs", "api", "schemas");
const OUTPUT_PATH = join(__dirname, "..", "docs", "api", "openapi.json");
const BASE_FILE = "_openapi.base.json";

function deepMerge(target, source, context) {
  for (const key of Object.keys(source)) {
    if (key in target) {
      if (
        typeof target[key] === "object" &&
        target[key] !== null &&
        !Array.isArray(target[key]) &&
        typeof source[key] === "object" &&
        source[key] !== null &&
        !Array.isArray(source[key])
      ) {
        deepMerge(target[key], source[key], `${context}.${key}`);
      } else {
        // 相同值 = 重复但等价，允许通过（多模块共享同一 $ref / schema）
        if (JSON.stringify(target[key]) !== JSON.stringify(source[key])) {
          throw new Error(
            `合并冲突: ${context}.${key} 已在另一个模块中定义了不同内容。` +
              `请检查 schema 名称或 path 是否重复定义且内容不一致。`
          );
        }
        // 否则值相同，静默跳过
      }
    } else {
      target[key] = source[key];
    }
  }
}

function main() {
  if (!existsSync(SCHEMAS_DIR)) {
    console.error(`错误: schema 目录不存在: ${SCHEMAS_DIR}`);
    process.exit(1);
  }

  const files = readdirSync(SCHEMAS_DIR).filter(
    (f) => f.endsWith(".openapi.json") && f !== BASE_FILE
  );

  if (files.length === 0) {
    console.warn("警告: 没有找到模块 schema 文件");
  }

  console.log(`找到 ${files.length} 个模块 schema 文件:`);
  files.forEach((f) => console.log(`  - ${f}`));

  // 读取骨架
  const basePath = join(SCHEMAS_DIR, BASE_FILE);
  if (!existsSync(basePath)) {
    console.error(`错误: 基础文件不存在: ${basePath}`);
    process.exit(1);
  }
  const merged = JSON.parse(readFileSync(basePath, "utf-8"));

  // 确保 paths 和 components.schemas 存在
  merged.paths = merged.paths || {};
  if (!merged.components) merged.components = {};
  merged.components.schemas = merged.components.schemas || {};

  // 合并各模块
  for (const file of files) {
    const filePath = join(SCHEMAS_DIR, file);
    console.log(`\n处理: ${file}`);
    const moduleData = JSON.parse(readFileSync(filePath, "utf-8"));

    // 合并 paths
    if (moduleData.paths && Object.keys(moduleData.paths).length > 0) {
      try {
        deepMerge(merged.paths, moduleData.paths, `paths`);
        console.log(`  合并了 ${Object.keys(moduleData.paths).length} 个 paths`);
      } catch (e) {
        console.error(`  错误: ${e.message}`);
        process.exit(1);
      }
    }

    // 合并 schemas
    if (
      moduleData.components?.schemas &&
      Object.keys(moduleData.components.schemas).length > 0
    ) {
      try {
        deepMerge(
          merged.components.schemas,
          moduleData.components.schemas,
          `components.schemas`
        );
        console.log(
          `  合并了 ${Object.keys(moduleData.components.schemas).length} 个 schemas`
        );
      } catch (e) {
        console.error(`  错误: ${e.message}`);
        process.exit(1);
      }
    }
  }

  // 确保输出目录存在
  const outputDir = dirname(OUTPUT_PATH);
  if (!existsSync(outputDir)) {
    throw new Error(`输出目录不存在: ${outputDir}`);
  }

  // 写入
  writeFileSync(OUTPUT_PATH, JSON.stringify(merged, null, 2), "utf-8");
  console.log(
    `\n✓ 合并完成: ${OUTPUT_PATH} (${Object.keys(merged.paths).length} paths, ${Object.keys(merged.components.schemas).length} schemas)`
  );
}

main();
