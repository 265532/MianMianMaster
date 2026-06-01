import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";

vi.mock("../auth", () => ({
  getToken: vi.fn(),
  removeToken: vi.fn(),
}));

vi.mock("../error", () => ({
  handleApiError: vi.fn(),
  formatErrorMessage: vi.fn(() => "formatted error"),
}));

describe("http client", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("should create axios instance with default config", async () => {
    const { default: http } = await import("../http");
    expect(http.defaults.timeout).toBe(15000);
    expect(http.defaults.headers["Content-Type"]).toBe(
      "application/json;charset=UTF-8",
    );
  });

  it("should have request interceptor configured", async () => {
    const { default: http } = await import("../http");
    expect(http.interceptors.request.handlers.length).toBeGreaterThan(0);
  });

  it("should have response interceptor configured", async () => {
    const { default: http } = await import("../http");
    expect(http.interceptors.response.handlers.length).toBeGreaterThan(0);
  });

  it("should inject Bearer token when token exists", async () => {
    const { getToken } = await import("../auth");
    const mockedGetToken = vi.mocked(getToken);
    mockedGetToken.mockReturnValue("test-jwt-token");

    const { default: http } = await import("../http");
    const config = { headers: {} as Record<string, string> };
    const handler = http.interceptors.request.handlers[0];
    if (handler?.fulfilled) {
      const result = await handler.fulfilled({
        ...config,
        method: "get",
      } as any);
      expect(result.headers.Authorization).toBe("Bearer test-jwt-token");
    }
  });

  it("should not inject Authorization header when no token", async () => {
    const { getToken } = await import("../auth");
    const mockedGetToken = vi.mocked(getToken);
    mockedGetToken.mockReturnValue(null);

    const { default: http } = await import("../http");
    const config = { headers: {} as Record<string, string> };
    const handler = http.interceptors.request.handlers[0];
    if (handler?.fulfilled) {
      const result = await handler.fulfilled({
        ...config,
        method: "get",
      } as any);
      expect(result.headers.Authorization).toBeUndefined();
    }
  });

  it("should add timestamp to GET requests", async () => {
    const { getToken } = await import("../auth");
    vi.mocked(getToken).mockReturnValue(null);

    const { default: http } = await import("../http");
    const config = { headers: {} as Record<string, string>, params: {} };
    const handler = http.interceptors.request.handlers[0];
    if (handler?.fulfilled) {
      const result = await handler.fulfilled({
        ...config,
        method: "get",
      } as any);
      expect(result.params._t).toBeDefined();
      expect(typeof result.params._t).toBe("number");
    }
  });

  it("should not add timestamp to POST requests", async () => {
    const { getToken } = await import("../auth");
    vi.mocked(getToken).mockReturnValue(null);

    const { default: http } = await import("../http");
    const config = { headers: {} as Record<string, string> };
    const handler = http.interceptors.request.handlers[0];
    if (handler?.fulfilled) {
      const result = await handler.fulfilled({
        ...config,
        method: "post",
      } as any);
      expect(result.params?._t).toBeUndefined();
    }
  });

  describe("getApiMetrics", () => {
    it("should return metrics with default values", async () => {
      const { getApiMetrics } = await import("../http");
      const metrics = getApiMetrics();
      expect(metrics).toHaveProperty("requests");
      expect(metrics).toHaveProperty("errors");
      expect(metrics).toHaveProperty("totalTime");
      expect(metrics).toHaveProperty("avgTime");
      expect(metrics).toHaveProperty("errorRate");
      expect(metrics).toHaveProperty("slowRequests");
    });
  });
});
