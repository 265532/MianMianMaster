import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../http", () => ({
  default: {
    request: vi.fn((config) => Promise.resolve({ data: {}, ...config })),
    get: vi.fn((url, config) => Promise.resolve({ data: {}, url, ...config })),
    post: vi.fn((url, data, config) =>
      Promise.resolve({ data: {}, url, body: data, ...config }),
    ),
    put: vi.fn((url, data, config) =>
      Promise.resolve({ data: {}, url, body: data, ...config }),
    ),
    delete: vi.fn((url, config) =>
      Promise.resolve({ data: {}, url, ...config }),
    ),
  },
}));

describe("request utils", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("request", () => {
    it("should call http.request with config", async () => {
      const { request } = await import("../request");
      const { default: http } = await import("../http");
      const config = { method: "get", url: "/test" };
      await request(config);
      expect(http.request).toHaveBeenCalledWith(config);
    });
  });

  describe("get", () => {
    it("should call http.get with url and params", async () => {
      const { get } = await import("../request");
      const { default: http } = await import("../http");
      await get("/users", { page: 1 });
      expect(http.get).toHaveBeenCalledWith("/users", { params: { page: 1 } });
    });

    it("should call http.get without params", async () => {
      const { get } = await import("../request");
      const { default: http } = await import("../http");
      await get("/users");
      expect(http.get).toHaveBeenCalledWith("/users", { params: undefined });
    });
  });

  describe("post", () => {
    it("should call http.post with url and data", async () => {
      const { post } = await import("../request");
      const { default: http } = await import("../http");
      const data = { name: "test" };
      await post("/users", data);
      expect(http.post).toHaveBeenCalledWith("/users", data, undefined);
    });

    it("should call http.post with URLSearchParams", async () => {
      const { post } = await import("../request");
      const { default: http } = await import("../http");
      const params = new URLSearchParams();
      params.append("username", "test");
      await post("/auth/login", params);
      expect(http.post).toHaveBeenCalledWith("/auth/login", params, undefined);
    });
  });

  describe("put", () => {
    it("should call http.put with url and data", async () => {
      const { put } = await import("../request");
      const { default: http } = await import("../http");
      const data = { name: "updated" };
      await put("/users/1", data);
      expect(http.put).toHaveBeenCalledWith("/users/1", data, undefined);
    });
  });

  describe("del", () => {
    it("should call http.delete with url and params", async () => {
      const { del } = await import("../request");
      const { default: http } = await import("../http");
      await del("/users/1", { reason: "test" });
      expect(http.delete).toHaveBeenCalledWith("/users/1", {
        params: { reason: "test" },
      });
    });
  });

  describe("upload", () => {
    it("should create FormData from File object", async () => {
      const { upload } = await import("../request");
      const { default: http } = await import("../http");
      const file = new File(["content"], "test.txt", { type: "text/plain" });
      await upload("/upload", file);
      expect(http.post).toHaveBeenCalledWith(
        "/upload",
        expect.any(FormData),
        expect.objectContaining({
          headers: { "Content-Type": "multipart/form-data" },
        }),
      );
    });

    it("should use FormData directly when passed", async () => {
      const { upload } = await import("../request");
      const { default: http } = await import("../http");
      const formData = new FormData();
      formData.append("key", "value");
      await upload("/upload", formData);
      expect(http.post).toHaveBeenCalledWith(
        "/upload",
        formData,
        expect.objectContaining({
          headers: { "Content-Type": "multipart/form-data" },
        }),
      );
    });
  });
});
