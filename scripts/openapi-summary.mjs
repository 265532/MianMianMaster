/**
 * OpenAPI JSON → 精简契约摘要 + TypeScript 类型骨架 转换脚本
 *
 * 用法:
 *   node scripts/openapi-summary.mjs <模块名>
 *   示例: node scripts/openapi-summary.mjs user
 *
 *   不传参则处理全部模块:
 *   node scripts/openapi-summary.mjs
 *
 * 输出:
 *   docs/api/contracts/<module>.md          — 精简契约摘要（给 AI Agent 读）
 *   src/api/types/__generated__/<module>.ts — TypeScript 类型骨架（可参考）
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const SCHEMAS_DIR = resolve(ROOT, "docs/api/schemas");
const CONTRACTS_DIR = resolve(ROOT, "docs/api/contracts");
const GENERATED_DIR = resolve(ROOT, "src/api/types/__generated__");

// ============================================================
//  1. 解析工具
// ============================================================

/** 解析 $ref 路径，返回 components/schemas 中的定义 */
function resolveRef(ref, schemas) {
  if (!ref || !ref.startsWith("#/")) return null;
  const parts = ref.replace("#/", "").split("/");
  let current = { components: { schemas } };
  for (const part of parts) {
    if (current == null) return null;
    current = current[part];
  }
  return current || null;
}

/** 展平 anyOf: [{type}, {type: 'null'}] → 取非 null 的那个 */
function flattenType(schema, schemas) {
  if (!schema) return { type: "unknown", nullable: false };

  // anyOf: Pick non-null variant
  if (schema.anyOf) {
    const nonNull = schema.anyOf.find((s) => s.type !== "null" && s.type !== null);
    const hasNull = schema.anyOf.some((s) => s.type === "null");
    if (nonNull) {
      const result = flattenType(nonNull, schemas);
      result.nullable = hasNull || result.nullable;
      return result;
    }
    return { type: "unknown", nullable: hasNull };
  }

  // $ref
  if (schema.$ref) {
    const resolved = resolveRef(schema.$ref, schemas);
    if (!resolved) return { type: "ref[unknown]", nullable: false };
    const name = schema.$ref.split("/").pop();
    return { type: name, nullable: false, refName: name, refSchema: resolved };
  }

  // array
  if (schema.type === "array" && schema.items) {
    const itemType = flattenType(schema.items, schemas);
    return { type: `${itemType.type}[]`, nullable: false, inner: itemType };
  }

  // primitive
  const typeMap = {
    string: "string",
    integer: "number",
    number: "number",
    boolean: "boolean",
    object: "Record<string, unknown>",
  };

  // additionalProperties map
  if (schema.type === "object" && schema.additionalProperties) {
    const valueType = flattenType(schema.additionalProperties, schemas);
    return { type: `Record<string, ${valueType.type}>`, nullable: false };
  }

  return {
    type: typeMap[schema.type] || schema.type || "unknown",
    nullable: false,
  };
}

/** 解析 schema 的属性列表 */
function extractFields(schema, schemas, depth = 0, maxDepth = 3) {
  if (!schema || !schema.properties || depth >= maxDepth) return [];
  const required = new Set(schema.required || []);

  const fields = [];
  for (const [name, prop] of Object.entries(schema.properties)) {
    const info = flattenType(prop, schemas);
    const field = {
      name,
      type: info.type,
      required: required.has(name),
      nullable: info.nullable,
      description: prop.description || "",
      nested: [],
    };

    // If it's a ref to another schema, recursively extract nested fields
    if (info.refName && info.refSchema && depth < maxDepth - 1) {
      field.nested = extractFields(info.refSchema, schemas, depth + 1, maxDepth);
    }
    if (info.inner?.refName && info.inner?.refSchema && depth < maxDepth - 1) {
      field.nested = extractFields(info.inner.refSchema, schemas, depth + 1, maxDepth);
    }

    fields.push(field);
  }
  return fields;
}

/** 提取内层 data 类型名（从 ResponseModel_X_ 中） */
function extractDataTypeName(schemaRef, schemas) {
  const resolved = resolveRef(schemaRef, schemas);
  if (!resolved || !resolved.properties?.data) return null;
  const dataSchema = resolved.properties.data;
  return flattenType(dataSchema, schemas);
}

// ============================================================
//  2. 生成 Markdown 契约摘要
// ============================================================

function generateMarkdown(moduleName, openapi) {
  const { paths, components } = openapi;
  const schemas = components?.schemas || {};
  let lines = [];

  lines.push(`# ${capitalize(moduleName)} 模块 — 接口契约摘要`);
  lines.push("");
  lines.push(`> 自动生成自 \`docs/api/schemas/${moduleName}.openapi.json\``);
  lines.push(`> 用途: 给 AI Agent 提供精简接口契约上下文，替代原始 OpenAPI JSON`);
  lines.push("");

  // --- 端点列表 ---
  for (const [path, methods] of Object.entries(paths)) {
    for (const [method, detail] of Object.entries(methods)) {
      const auth = detail.security ? "✓" : "✗";
      const tags = (detail.tags || []).join(", ");
      lines.push(`## ${method.toUpperCase()} \`${path}\``);
      lines.push("");
      if (detail.summary) lines.push(`> ${detail.summary}`);
      lines.push("");
      lines.push(`- **认证**: ${auth}`);
      if (tags) lines.push(`- **标签**: ${tags}`);
      lines.push("");

      // --- 请求体 ---
      const reqBody = detail.requestBody;
      if (reqBody) {
        const ref = reqBody.content?.["application/json"]?.schema?.$ref;
        if (ref) {
          const schemaName = ref.split("/").pop();
          const schema = schemas[schemaName];
          if (schema) {
            const fields = extractFields(schema, schemas);
            lines.push(`### 请求体: \`${schemaName}\``);
            lines.push("");
            lines.push("| 字段 | 类型 | 必填 | 说明 |");
            lines.push("|------|------|------|------|");
            for (const f of fields) {
              const req = f.required ? "✓" : "";
              const desc = f.description || "";
              lines.push(`| \`${f.name}\` | \`${f.type}\` | ${req} | ${desc} |`);
            }
            lines.push("");
          }
        }
      }

      // --- 路径/查询参数 ---
      const params = detail.parameters || [];
      if (params.length > 0) {
        lines.push("### 参数");
        lines.push("");
        lines.push("| 字段 | 位置 | 类型 | 必填 | 说明 |");
        lines.push("|------|------|------|------|------|");
        for (const p of params) {
          const { in: location, name, required, schema, description } = p;
          const type = flattenType(schema || {}, schemas);
          const req = required ? "✓" : "";
          lines.push(`| \`${name}\` | ${location} | \`${type.type}\` | ${req} | ${description || ""} |`);
        }
        lines.push("");
      }

      // --- 响应 ---
      const resp200 = detail.responses?.["200"];
      if (resp200) {
        const ref = resp200.content?.["application/json"]?.schema?.$ref;
        if (ref) {
          const schemaName = ref.split("/").pop();
          const dataType = extractDataTypeName(ref, schemas);
          lines.push(`### 响应: \`${schemaName}\``);
          lines.push("");
          if (dataType) {
            // data 字段展开
            if (dataType.refName && dataType.refSchema) {
              const fields = extractFields(dataType.refSchema, schemas);
              lines.push(`数据载体: \`${dataType.type}\``);
              lines.push("");
              lines.push("| 字段 | 类型 | 必填 | 说明 |");
              lines.push("|------|------|------|------|");
              for (const f of fields) {
                const req = f.required ? "✓" : "";
                const desc = f.description || "";
                lines.push(`| \`${f.name}\` | \`${f.type}\` | ${req} | ${desc} |`);
                // 嵌套字段缩进展示
                for (const nf of f.nested.slice(0, 5)) {
                  lines.push(`| ↳ \`${nf.name}\` | \`${nf.type}\` | ${nf.required ? "✓" : ""} | ${nf.description || ""} |`);
                }
                if (f.nested.length > 5) {
                  lines.push(`| ↳ ... 还有 ${f.nested.length - 5} 个嵌套字段 | | | |`);
                }
              }
            } else {
              lines.push(`数据载体: \`${dataType.type}\``);
            }
          }
          lines.push("");
        }
      }
    }
  }

  return lines.join("\n");
}

// ============================================================
//  3. 生成 TypeScript 类型骨架
// ============================================================

function generateTypeScript(moduleName, openapi) {
  const { components } = openapi;
  const schemas = components?.schemas || {};
  let lines = [];

  lines.push("// ============================================================");
  lines.push(`// ${moduleName} 模块 — 自动生成类型骨架`);
  lines.push(`// 来源: docs/api/schemas/${moduleName}.openapi.json`);
  lines.push("// 用途: 作为 src/api/types/ 下手动类型的参考基准，对齐后端 Schema");
  lines.push("// ============================================================");
  lines.push("");

  // Collect all non-ResponseModel schemas
  const schemaEntries = Object.entries(schemas).filter(
    ([name]) => !name.startsWith("ResponseModel") && name !== "HTTPValidationError" && name !== "ValidationError"
  );

  for (const [name, schema] of schemaEntries) {
    if (!schema.properties) {
      // Simple type alias
      const info = flattenType(schema, schemas);
      lines.push(`export type ${name} = ${mapTSType(info.type)};`);
      lines.push("");
      continue;
    }

    lines.push(`export interface ${name} {`);
    const required = new Set(schema.required || []);
    for (const [propName, prop] of Object.entries(schema.properties)) {
      const info = flattenType(prop, schemas);
      const tsType = mapTSType(info.type, info.nullable);
      const opt = info.nullable || !required.has(propName) ? "?" : "";
      lines.push(`  /** ${prop.description || prop.title || propName} */`);
      lines.push(`  ${propName}${opt}: ${tsType};`);
      lines.push("");
    }
    lines.push("}");
    lines.push("");
  }

  return lines.join("\n");
}

function mapTSType(type, nullable = false) {
  const map = {
    string: "string",
    number: "number",
    boolean: "boolean",
    integer: "number",
    object: "Record<string, unknown>",
  };
  let result = map[type] || type || "unknown";
  if (nullable) result = `${result} | null`;
  return result;
}

// ============================================================
//  4. 辅助
// ============================================================

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ============================================================
//  5. 主流程
// ============================================================

function processModule(moduleName) {
  const inputPath = resolve(SCHEMAS_DIR, `${moduleName}.openapi.json`);
  if (!existsSync(inputPath)) {
    console.error(`  ✗ 未找到: ${inputPath}`);
    return false;
  }

  let raw, openapi;
  try {
    raw = readFileSync(inputPath, "utf-8");
    openapi = JSON.parse(raw);
  } catch (err) {
    console.error(`  ✗ 处理 ${moduleName} 失败:`, err.message);
    return false;
  }

  // 验证 OpenAPI 结构
  if (!openapi?.paths || !openapi?.components?.schemas) {
    console.warn(`  ⚠ ${moduleName}: OpenAPI 结构不完整，跳过`);
    return false;
  }

  // 输出目录
  if (!existsSync(CONTRACTS_DIR)) mkdirSync(CONTRACTS_DIR, { recursive: true });
  if (!existsSync(GENERATED_DIR)) mkdirSync(GENERATED_DIR, { recursive: true });

  // Markdown 契约摘要
  const md = generateMarkdown(moduleName, openapi);
  const mdPath = resolve(CONTRACTS_DIR, `${moduleName}.md`);
  writeFileSync(mdPath, md, "utf-8");
  const mdSize = (Buffer.byteLength(md, "utf-8") / 1024).toFixed(1);

  // TypeScript 类型骨架
  const ts = generateTypeScript(moduleName, openapi);
  const tsPath = resolve(GENERATED_DIR, `${moduleName}.ts`);
  writeFileSync(tsPath, ts, "utf-8");
  const tsSize = (Buffer.byteLength(ts, "utf-8") / 1024).toFixed(1);

  // 对比压缩比
  const rawSize = (Buffer.byteLength(raw, "utf-8") / 1024).toFixed(1);

  console.log(
    `  ✓ ${moduleName}: ${rawSize}KB → (md: ${mdSize}KB, ts: ${tsSize}KB)`
  );
  return { mdPath, tsPath };
}

// --- CLI ---

// 自动发现模块：扫描 docs/api/schemas/ 下的 .openapi.json 文件
function discoverModules() {
  if (!existsSync(SCHEMAS_DIR)) {
    console.error(`✗ 未找到 schemas 目录: ${SCHEMAS_DIR}`);
    process.exit(1);
  }
  return readdirSync(SCHEMAS_DIR)
    .filter((f) => f.endsWith(".openapi.json"))
    .map((f) => f.replace(".openapi.json", ""));
}

const args = process.argv.slice(2);
const target = args[0];

console.log("── OpenAPI → 精简契约摘要 + TypeScript 骨架 ──");
console.log("");

if (target) {
  // 单模块模式：直接处理指定模块
  if (!processModule(target)) {
    console.error(`\n处理失败: ${target}`);
    process.exit(1);
  }
} else {
  // 全量模式：自动发现并处理所有模块
  const modules = discoverModules();
  if (modules.length === 0) {
    console.warn("⚠ 未发现任何 OpenAPI 模块文件");
    process.exit(0);
  }
  console.log(`发现 ${modules.length} 个模块: ${modules.join(", ")}`);
  console.log("");
  let success = 0;
  let failed = 0;
  for (const mod of modules) {
    if (processModule(mod)) {
      success++;
    } else {
      failed++;
    }
  }
  console.log("");
  console.log(`处理完成: ${success} 成功, ${failed} 失败`);
}

console.log("");
console.log(`- 契约摘要: ${CONTRACTS_DIR}/`);
console.log(`- 类型骨架: ${GENERATED_DIR}/`);