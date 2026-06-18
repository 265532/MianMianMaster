/**
 * Auth 模块自动化联调测试脚本
 *
 * 用途：直接对后端 API 进行自动化端到端测试，验证 Auth 模块全部 10 个端点
 * 运行：npx tsx scripts/test-auth-integration.ts
 *
 * 测试流程：
 *   1. 注册新用户
 *   2. 登录获取 Token
 *   3. 获取当前用户信息
 *   4. Token 刷新
 *   5. 登出
 *   6. 密码重置
 *   7. 错误处理（错误凭证、重复注册等）
 */

import axios, { AxiosInstance, AxiosError } from "axios";

// ─── 配置 ───────────────────────────────────────────────────────────

const CONFIG = {
  baseURL: process.env.API_BASE_URL || "http://localhost:8081/api/v1",
  timeout: 15000,
  verbose: process.env.VERBOSE === "true",
};

// ─── 类型定义 ────────────────────────────────────────────────────────

interface ResponseModel<T> {
  code: number;
  message: string;
  data: T;
}

interface Token {
  access_token: string;
  token_type: string;
  refresh_token: string;
}

interface UserResponse {
  id: number;
  username: string;
  email: string;
  phone?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  roles: Array<{ id: number; name: string; description?: string }>;
  profile?: Record<string, unknown> | null;
}

// ─── 测试报告 ────────────────────────────────────────────────────────

interface TestCase {
  id: string;
  name: string;
  endpoint: string;
  method: string;
  status: "PASS" | "FAIL" | "SKIP";
  duration: number;
  error?: string;
  details?: string;
}

const testResults: TestCase[] = [];

function log(message: string, level: "info" | "pass" | "fail" | "skip" = "info") {
  const icons: Record<string, string> = {
    info: "ℹ",
    pass: "✅",
    fail: "❌",
    skip: "⏭",
  };
  const colors: Record<string, string> = {
    info: "\x1b[36m",
    pass: "\x1b[32m",
    fail: "\x1b[31m",
    skip: "\x1b[33m",
  };
  const reset = "\x1b[0m";
  console.log(`  ${colors[level]}${icons[level]} ${message}${reset}`);
}

function report(test: TestCase) {
  testResults.push(test);
  if (test.status === "PASS") {
    log(`${test.id} ${test.name} (${test.duration}ms)`, "pass");
  } else if (test.status === "FAIL") {
    log(`${test.id} ${test.name} — ${test.error}`, "fail");
  } else {
    log(`${test.id} ${test.name} — ${test.details}`, "skip");
  }
}

// ─── 测试工具 ────────────────────────────────────────────────────────

/**
 * 检查是否为业务错误（后端统一返回 HTTP 200，错误码在 body.code 中）
 * 或者 HTTP 4xx/5xx 错误
 */
function isBusinessError(error: unknown): boolean {
  // 检查自定义业务错误标记（拦截器设置）
  if ((error as any)?.isBusinessError === true) return true;
  // 检查 HTTP 4xx/5xx 错误（包括 429 限流）
  if (error instanceof AxiosError && error.response && error.response.status >= 400) return true;
  return false;
}

/**
 * 检查是否为后端限流错误
 */
function isRateLimitError(error: unknown): boolean {
  if (error instanceof AxiosError && error.response) {
    const status = error.response.status;
    if (status === 429) return true;
  }
  const msg = error instanceof Error ? error.message : "";
  return msg.includes("Rate limit exceeded");
}

/**
 * 遇到限流时自动等待并重试（最多重试 3 次，指数退避）
 */
async function withRateLimitRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: unknown) {
      lastError = error;
      if (isRateLimitError(error)) {
        const waitMs = 3000 * Math.pow(2, i);
        if (CONFIG.verbose) console.log(`  ⏳ 触发限流，等待 ${waitMs}ms 后重试 (${i + 1}/${maxRetries})...`);
        await new Promise((r) => setTimeout(r, waitMs));
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

function getBusinessErrorMessage(error: unknown): string {
  if (error instanceof AxiosError && error.response) {
    const body = error.response.data as ResponseModel<unknown>;
    return body.message || `HTTP ${error.response.status}`;
  }
  return String(error);
}

function generateTestUser() {
  const timestamp = Date.now().toString(36);
  return {
    username: `testuser_${timestamp}`,
    email: `test_${timestamp}@example.com`,
    password: "TestPass123!",
    phone: `138${String(Math.floor(Math.random() * 100000000)).padStart(8, "0")}`,
  };
}

async function runTest(
  id: string,
  name: string,
  endpoint: string,
  method: string,
  fn: () => Promise<void>,
  skipCondition = false,
  skipReason = "",
) {
  if (skipCondition) {
    report({ id, name, endpoint, method, status: "SKIP", duration: 0, details: skipReason });
    return;
  }

  const start = Date.now();
  try {
    await fn();
    const duration = Date.now() - start;
    report({ id, name, endpoint, method, status: "PASS", duration });
  } catch (error: unknown) {
    const duration = Date.now() - start;
    const message = error instanceof Error ? error.message : String(error);
    report({ id, name, endpoint, method, status: "FAIL", duration, error: message });
  }
}

// ─── 主测试流程 ──────────────────────────────────────────────────────

async function main() {
  console.log("\n" + "=".repeat(60));
  console.log("  Auth 模块自动化联调测试");
  console.log("=".repeat(60));
  console.log(`  后端地址: ${CONFIG.baseURL}`);
  console.log(`  超时设置: ${CONFIG.timeout}ms`);
  console.log(`  开始时间: ${new Date().toLocaleString("zh-CN")}`);
  console.log("=".repeat(60) + "\n");

  // 步骤 0: 健康检查
  console.log("📋 步骤 0: 后端健康检查\n");
  await runTest("HEALTH-001", "后端服务可达", "/health", "GET", async () => {
    const response = await axios.get(`${CONFIG.baseURL}/health`, { timeout: 5000 });
    if (response.status !== 200) throw new Error(`Expected 200, got ${response.status}`);
  });

  // 创建全局 axios 实例（带业务错误自动拦截，与项目 http.ts 行为一致）
  const api: AxiosInstance = axios.create({
    baseURL: CONFIG.baseURL,
    timeout: CONFIG.timeout,
    headers: { "Content-Type": "application/json;charset=UTF-8" },
  });

  // 注册拦截器：业务错误码（code !== 200）自动 reject
  api.interceptors.response.use(
    (res) => {
      const data = res.data as ResponseModel<unknown>;
      if (data.code !== undefined && data.code !== 200) {
        const error = new Error(data.message || "请求失败") as AxiosError;
        (error as any).response = res;
        (error as any).isBusinessError = true;
        return Promise.reject(error);
      }
      return res;
    },
    (error: AxiosError) => {
      if (CONFIG.verbose) {
        console.error("  [DEBUG] API Error:", error.response?.status, error.response?.data);
      }
      return Promise.reject(error);
    },
  );

  let testUser: ReturnType<typeof generateTestUser>;
  let accessToken = "";
  let refreshToken = "";
  let userId: number | undefined;

  // ─── 步骤 1: 注册 ────────────────────────────────────────────────
  console.log("📋 步骤 1: 用户注册\n");

  testUser = generateTestUser();

  await runTest("AUTH-001", "注册新用户", "/auth/register", "POST", async () => {
    const response = await api.post<ResponseModel<UserResponse>>("/auth/register", {
      username: testUser.username,
      email: testUser.email,
      password: testUser.password,
    });
    const data = response.data;
    if (data.code !== 200) throw new Error(`Expected code 200, got ${data.code}: ${data.message}`);
    if (!data.data.id) throw new Error("Response missing user id");
    userId = data.data.id;
    if (CONFIG.verbose) console.log(`  注册用户: ${testUser.username} (id: ${userId})`);
  });

  await runTest("AUTH-002", "重复用户名注册失败", "/auth/register", "POST", async () => {
    try {
      await api.post("/auth/register", {
        username: testUser.username,
        email: `duplicate_${Date.now()}@example.com`,
        password: "DifferentPass123!",
      });
      throw new Error("Expected registration to fail with duplicate username");
    } catch (error: unknown) {
      if (!isBusinessError(error)) {
        throw new Error(`Expected business error, got: ${error instanceof Error ? error.message : String(error)}`);
      }
      if (CONFIG.verbose) console.log(`  业务错误: ${getBusinessErrorMessage(error)}`);
    }
  });

  // ─── 步骤 2: 登录 ────────────────────────────────────────────────
  console.log("\n📋 步骤 2: 用户登录\n");

  await runTest("AUTH-003", "账号密码登录", "/auth/login", "POST", async () => {
    const response = await api.post<ResponseModel<Token>>("/auth/login", {
      username: testUser.username,
      password: testUser.password,
    });
    const data = response.data;
    if (data.code !== 200) throw new Error(`Expected code 200, got ${data.code}: ${data.message}`);
    if (!data.data.access_token) throw new Error("Response missing access_token");
    if (!data.data.refresh_token) throw new Error("Response missing refresh_token");
    if (!data.data.token_type) throw new Error("Response missing token_type");
    accessToken = data.data.access_token;
    refreshToken = data.data.refresh_token;
    if (CONFIG.verbose) {
      console.log(`  Token 类型: ${data.data.token_type}`);
      console.log(`  Access Token 长度: ${accessToken.length}`);
    }
  });

  await runTest("AUTH-004", "错误密码登录失败", "/auth/login", "POST", async () => {
    try {
      await api.post("/auth/login", {
        username: testUser.username,
        password: "WrongPassword123!",
      });
      throw new Error("Expected login to fail with wrong password");
    } catch (error: unknown) {
      if (!isBusinessError(error)) {
        throw new Error(`Expected business error, got: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  });

  await runTest("AUTH-005", "不存在用户登录失败", "/auth/login", "POST", async () => {
    try {
      await api.post("/auth/login", {
        username: "nonexistent_user_12345",
        password: "SomePassword123!",
      });
      throw new Error("Expected login to fail with nonexistent user");
    } catch (error: unknown) {
      if (!isBusinessError(error)) {
        throw new Error(`Expected business error, got: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  });

  // ─── 步骤 3: 获取当前用户信息 ────────────────────────────────────
  console.log("\n📋 步骤 3: 获取当前用户信息\n");

  await runTest("AUTH-006", "获取当前用户信息", "/auth/me", "GET", async () => {
    const response = await api.get<ResponseModel<UserResponse>>("/auth/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = response.data;
    if (data.code !== 200) throw new Error(`Expected code 200, got ${data.code}: ${data.message}`);
    if (!data.data.username) throw new Error("Response missing username");
    if (data.data.username !== testUser.username) {
      throw new Error(`Expected username "${testUser.username}", got "${data.data.username}"`);
    }
    if (CONFIG.verbose) {
      console.log(`  用户名: ${data.data.username}`);
      console.log(`  邮箱: ${data.data.email}`);
      console.log(`  角色: ${data.data.roles.map((r) => r.name).join(", ") || "无"}`);
    }
  });

  await runTest("AUTH-007", "无 Token 访问 /auth/me", "/auth/me", "GET", async () => {
    try {
      await api.get("/auth/me");
      throw new Error("Expected 401/business error for unauthenticated request");
    } catch (error: unknown) {
      if (!isBusinessError(error)) {
        throw new Error(`Expected 401/business error, got: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  });

  // ─── 步骤 4: Token 刷新 ──────────────────────────────────────────
  console.log("\n📋 步骤 4: Token 刷新\n");

  await runTest("AUTH-008", "刷新 Access Token", "/auth/refresh", "POST", async () => {
    const response = await api.post<ResponseModel<Token>>("/auth/refresh", {
      refresh_token: refreshToken,
    });
    const data = response.data;
    if (data.code !== 200) throw new Error(`Expected code 200, got ${data.code}: ${data.message}`);
    if (!data.data.access_token) throw new Error("Response missing new access_token");
    if (!data.data.refresh_token) throw new Error("Response missing new refresh_token");
    const oldAccessToken = accessToken;
    accessToken = data.data.access_token;
    refreshToken = data.data.refresh_token;
    if (accessToken === oldAccessToken) {
      log("  ⚠️ 新旧 access_token 相同（可能是后端复用）", "skip");
    }
    if (CONFIG.verbose) {
      console.log(`  新 Access Token 长度: ${accessToken.length}`);
    }
  });

  await runTest("AUTH-009", "使用新 Token 访问 /auth/me", "/auth/me", "GET", async () => {
    const response = await api.get<ResponseModel<UserResponse>>("/auth/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = response.data;
    if (data.code !== 200) throw new Error(`Expected code 200, got ${data.code}: ${data.message}`);
    if (data.data.username !== testUser.username) {
      throw new Error("Username mismatch after token refresh");
    }
  });

  await runTest("AUTH-010", "过期 refresh_token 刷新失败", "/auth/refresh", "POST", async () => {
    try {
      await api.post("/auth/refresh", {
        refresh_token: "invalid_refresh_token_12345",
      });
      throw new Error("Expected refresh to fail with invalid token");
    } catch (error: unknown) {
      if (error instanceof AxiosError && (error as any).isBusinessError) return;
      if (error instanceof AxiosError && error.response) {
        const status = error.response.status;
        if (status >= 400 && status < 500) return;
      }
      throw new Error("Expected business error or 4xx for invalid refresh token");
    }
  });

  // ─── 步骤 5: 登出 ────────────────────────────────────────────────
  console.log("\n📋 步骤 5: 登出\n");

  await runTest("AUTH-011", "登出（吊销 Token）", "/auth/logout", "POST", async () => {
    const response = await api.post<ResponseModel<string>>("/auth/logout", undefined, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = response.data;
    if (data.code !== 200) throw new Error(`Expected code 200, got ${data.code}: ${data.message}`);
    if (CONFIG.verbose) console.log(`  登出响应: ${data.data || "成功"}`);
  });

  await runTest("AUTH-012", "登出后 Token 失效", "/auth/me", "GET", async () => {
    try {
      await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      throw new Error("Expected business error or 401 after logout");
    } catch (error: unknown) {
      if (error instanceof AxiosError && (error as any).isBusinessError) return;
      if (error instanceof AxiosError && error.response) {
        const status = error.response.status;
        if (status === 401) return;
      }
      throw new Error("Expected business error or 401 after logout");
    }
  });

  // ─── 步骤 6: 密码重置 ────────────────────────────────────────────
  console.log("\n📋 步骤 6: 密码重置\n");

  await runTest("AUTH-013", "请求密码重置 Token", "/auth/password/reset-token", "POST", async () => {
    const response = await api.post<ResponseModel<string>>("/auth/password/reset-token", {
      email: testUser.email,
    });
    const data = response.data;
    if (data.code !== 200) throw new Error(`Expected code 200, got ${data.code}: ${data.message}`);
    if (!data.data) throw new Error("Response missing reset token");
    if (CONFIG.verbose) console.log(`  重置 Token 长度: ${data.data.length}`);
  });

  // 注意：密码重置需要真实的 token（通常从邮件获取），这里仅验证 API 可调用
  await runTest(
    "AUTH-014",
    "无效 Token 重置密码失败",
    "/auth/password/reset",
    "POST",
    async () => {
      try {
        await api.post("/auth/password/reset", {
          token: "invalid_reset_token_12345",
          new_password: "NewPass123!",
        });
        throw new Error("Expected password reset to fail with invalid token");
      } catch (error: unknown) {
        if (error instanceof AxiosError && (error as any).isBusinessError) return;
        if (error instanceof AxiosError && error.response) {
          const status = error.response.status;
          if (status >= 400 && status < 500) return;
        }
        throw new Error("Expected business error or 4xx for invalid reset token");
      }
    },
  );

  // ─── 步骤 7: 新密码登录验证 ──────────────────────────────────────
  console.log("\n📋 步骤 7: 新密码登录验证\n");

  // 先用旧密码登录确保可用
  await runTest("AUTH-015", "旧密码登录验证（密码重置前）", "/auth/login", "POST", async () => {
    const response = await api.post<ResponseModel<Token>>("/auth/login", {
      username: testUser.username,
      password: testUser.password,
    });
    const data = response.data;
    if (data.code !== 200) throw new Error(`Expected code 200, got ${data.code}: ${data.message}`);
    accessToken = data.data.access_token;
    refreshToken = data.data.refresh_token;
  });

  // 请求真实的密码重置 Token
  let resetToken = "";
  await runTest("AUTH-016", "获取密码重置 Token", "/auth/password/reset-token", "POST", async () => {
    const response = await api.post<ResponseModel<string>>("/auth/password/reset-token", {
      email: testUser.email,
    });
    const data = response.data;
    if (data.code !== 200) throw new Error(`Expected code 200, got ${data.code}: ${data.message}`);
    resetToken = data.data;
  });

  // 使用真实 Token 重置密码
  const newPassword = "NewTestPass456!";
  await runTest("AUTH-017", "使用 Token 重置密码", "/auth/password/reset", "POST", async () => {
    if (!resetToken) throw new Error("No reset token available");
    const response = await api.post<ResponseModel<string>>("/auth/password/reset", {
      token: resetToken,
      new_password: newPassword,
    });
    const data = response.data;
    if (data.code !== 200) throw new Error(`Expected code 200, got ${data.code}: ${data.message}`);
  });

  // 用新密码登录
  await runTest("AUTH-018", "新密码登录成功", "/auth/login", "POST", async () => {
    const response = await api.post<ResponseModel<Token>>("/auth/login", {
      username: testUser.username,
      password: newPassword,
    });
    const data = response.data;
    if (data.code !== 200) throw new Error(`Expected code 200, got ${data.code}: ${data.message}`);
    accessToken = data.data.access_token;
    refreshToken = data.data.refresh_token;
  });

  // 用新 Token 访问 /auth/me
  await runTest("AUTH-019", "新密码登录后获取用户信息", "/auth/me", "GET", async () => {
    const response = await api.get<ResponseModel<UserResponse>>("/auth/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = response.data;
    if (data.code !== 200) throw new Error(`Expected code 200, got ${data.code}: ${data.message}`);
    if (data.data.username !== testUser.username) {
      throw new Error("Username mismatch after password reset login");
    }
  });

  // 最终登出
  await runTest("AUTH-020", "最终登出清理", "/auth/logout", "POST", async () => {
    await api.post("/auth/logout", undefined, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  });

  // ─── 步骤 8: 短信登录（验证 API 存在性） ─────────────────────────
  console.log("\n📋 步骤 8: 短信登录 API 验证（非 SMS 服务环境仅验证端点存在）\n");

  await runTest(
    "AUTH-021",
    "发送短信验证码 API 存在",
    "/auth/sms/send",
    "POST",
    async () => {
      try {
        await api.post("/auth/sms/send", { phone: "13800138000" });
      } catch (error: unknown) {
        // 只要不是 404 就说明端点存在
        if (error instanceof AxiosError && error.response?.status === 404) {
          throw new Error("Endpoint not found (404)");
        }
        // 其他错误（400/500）说明端点存在
      }
    },
  );

  await runTest(
    "AUTH-022",
    "短信登录 API 存在",
    "/auth/sms/login",
    "POST",
    async () => {
      try {
        await api.post("/auth/sms/login", { phone: "13800138000", code: "123456" });
      } catch (error: unknown) {
        if (error instanceof AxiosError && error.response?.status === 404) {
          throw new Error("Endpoint not found (404)");
        }
      }
    },
  );

  // ─── 步骤 9: 管理员解锁用户（验证 API 存在性） ───────────────────
  console.log("\n📋 步骤 9: 管理员解锁用户 API 验证\n");

  await runTest(
    "AUTH-023",
    "解锁用户 API 存在（无需管理员权限验证）",
    "/auth/unlock/{username}",
    "POST",
    async () => {
      try {
        await api.post(`/auth/unlock/${testUser.username}`);
      } catch (error: unknown) {
        if (error instanceof AxiosError && error.response?.status === 404) {
          throw new Error("Endpoint not found (404)");
        }
        // 403 说明端点存在但需要权限
        if (error instanceof AxiosError && error.response?.status === 403) {
          return; // 端点存在，权限不足是预期行为
        }
      }
    },
  );

  // ─── 打印报告 ────────────────────────────────────────────────────
  printReport();
}

function printReport() {
  const total = testResults.length;
  const passed = testResults.filter((t) => t.status === "PASS").length;
  const failed = testResults.filter((t) => t.status === "FAIL").length;
  const skipped = testResults.filter((t) => t.status === "SKIP").length;

  console.log("\n" + "=".repeat(60));
  console.log("  测试报告");
  console.log("=".repeat(60));
  console.log(`  总用例数:  ${total}`);
  console.log(`  ✅ 通过:    ${passed}`);
  console.log(`  ❌ 失败:    ${failed}`);
  console.log(`  ⏭ 跳过:    ${skipped}`);
  console.log(`  通过率:    ${((passed / (total - skipped)) * 100).toFixed(1)}%`);
  console.log("=".repeat(60));

  if (failed > 0) {
    console.log("\n  失败用例详情:");
    console.log("─".repeat(60));
    testResults
      .filter((t) => t.status === "FAIL")
      .forEach((t) => {
        console.log(`  ❌ ${t.id}: ${t.name}`);
        console.log(`     端点: ${t.method} ${t.endpoint}`);
        console.log(`     耗时: ${t.duration}ms`);
        console.log(`     错误: ${t.error}`);
        console.log("");
      });
  }

  console.log(`  结束时间: ${new Date().toLocaleString("zh-CN")}`);
  console.log("=".repeat(60) + "\n");

  // 退出码
  process.exit(failed > 0 ? 1 : 0);
}

// ─── 启动 ────────────────────────────────────────────────────────────

main().catch((error: unknown) => {
  console.error("\n❌ 测试脚本执行失败:", error);
  process.exit(2);
});
