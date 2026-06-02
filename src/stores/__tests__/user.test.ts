import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";

vi.mock("@/api/modules/auth.api", () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn(),
    getUserInfo: vi.fn(),
    logout: vi.fn(),
  },
}));

vi.mock("@/api/modules/user.api", () => ({
  userApi: {
    getProfile: vi.fn(),
    getInterviewHistory: vi.fn(),
    getAbilityData: vi.fn(),
    getGameInterviewData: vi.fn(),
    getResume: vi.fn(),
    diagnoseResume: vi.fn(),
  },
}));

vi.mock("@/utils/auth", () => ({
  getToken: vi.fn(),
  setToken: vi.fn(),
  setRefreshToken: vi.fn(),
  removeToken: vi.fn(),
  isLoggedIn: vi.fn(() => false),
  getCachedUserInfo: vi.fn(() => null),
  cacheUserInfo: vi.fn(),
}));

describe("useUserStore integration", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe("login", () => {
    it("should login successfully and set user state", async () => {
      const { authApi } = await import("@/api/modules/auth.api");
      const mockedLogin = vi.mocked(authApi.login);
      const mockedGetUserInfo = vi.mocked(authApi.getUserInfo);

      mockedLogin.mockResolvedValue({
        code: 200,
        message: "success",
        data: {
          access_token: "mock-jwt-token",
          token_type: "bearer",
          refresh_token: "mock-refresh-token",
        },
      });

      mockedGetUserInfo.mockResolvedValue({
        code: 200,
        message: "success",
        data: {
          id: 1,
          email: "wang@example.com",
          username: "王同学",
          is_active: true,
          created_at: "2026-01-01T00:00:00Z",
          updated_at: "2026-05-09T00:00:00Z",
          roles: [{ id: 1, name: "user", description: "普通用户", created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z", permissions: [] }],
          profile: null,
        },
      });

      const { useUserStore } = await import("@/stores/user");
      const store = useUserStore();

      const result = await store.login("wang@example.com", "password123");

      expect(result).toBe(true);
      expect(mockedLogin).toHaveBeenCalledWith({
        username: "wang@example.com",
        password: "password123",
      });
      expect(mockedGetUserInfo).toHaveBeenCalled();
    });

    it("should handle login failure", async () => {
      const { authApi } = await import("@/api/modules/auth.api");
      const mockedLogin = vi.mocked(authApi.login);

      mockedLogin.mockRejectedValue(new Error("Invalid credentials"));

      const { useUserStore } = await import("@/stores/user");
      const store = useUserStore();

      await expect(store.login("wrong@example.com", "wrong")).rejects.toThrow(
        "Invalid credentials",
      );
      expect(store.user.isAuthenticated).toBe(false);
    });
  });

  describe("register", () => {
    it("should register successfully", async () => {
      const { authApi } = await import("@/api/modules/auth.api");
      const mockedRegister = vi.mocked(authApi.register);

      mockedRegister.mockResolvedValue({
        code: 200,
        message: "success",
        data: {
          id: 2,
          email: "new@example.com",
          username: "新用户",
          is_active: true,
          created_at: "2026-05-10T00:00:00Z",
          updated_at: "2026-05-10T00:00:00Z",
          roles: [],
          profile: null,
        },
      });

      const { useUserStore } = await import("@/stores/user");
      const store = useUserStore();

      const result = await store.register(
        "newuser",
        "new@example.com",
        "password123",
      );

      expect(result).toBe(true);
      expect(mockedRegister).toHaveBeenCalled();
    });
  });

  describe("logout", () => {
    it("should clear user state on logout", async () => {
      const { useUserStore } = await import("@/stores/user");
      const { removeToken } = await import("@/utils/auth");
      const store = useUserStore();

      await store.logout();

      expect(store.user.isAuthenticated).toBe(false);
      expect(store.user.name).toBe("");
      expect(removeToken).toHaveBeenCalled();
    });
  });

  describe("fetchInterviewHistory", () => {
    it("should fetch and store interview history", async () => {
      const { userApi } = await import("@/api/modules/user.api");
      const mockedGetInterviewHistory = vi.mocked(userApi.getInterviewHistory);

      mockedGetInterviewHistory.mockResolvedValue({
        code: 200,
        message: "success",
        data: {
          items: [
            {
              id: 1,
              company: "字节跳动",
              position: "前端",
              score: 88,
              status: "passed",
            },
          ],
          total: 1,
          page: 1,
          page_size: 10,
        },
      });

      const { useUserStore } = await import("@/stores/user");
      const store = useUserStore();

      await store.fetchInterviewHistory();

      expect(mockedGetInterviewHistory).toHaveBeenCalled();
    });
  });
});
