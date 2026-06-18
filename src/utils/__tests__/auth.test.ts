import { describe, it, expect, beforeEach } from "vitest";
import {
  setToken,
  getToken,
  removeToken,
  isLoggedIn,
  cacheUserInfo,
  getCachedUserInfo,
} from "../auth";

describe("auth utils", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("token management", () => {
    it("should set and get access token", () => {
      setToken("test-access-token");
      expect(getToken()).toBe("test-access-token");
    });

    it("should remove token", () => {
      setToken("test-token");
      removeToken();
      expect(getToken()).toBeNull();
    });

    it("should check if logged in", () => {
      expect(isLoggedIn()).toBe(false);
      setToken("test-token");
      expect(isLoggedIn()).toBe(true);
      removeToken();
      expect(isLoggedIn()).toBe(false);
    });
  });

  describe("user info cache", () => {
    it("should cache and retrieve user info", () => {
      const userInfo = {
        id: "1",
        name: "test",
        email: "test@test.com",
        avatar: "",
        isAuthenticated: true,
        role: "user" as const,
        skills: [],
      };
      cacheUserInfo(userInfo);
      const cached = getCachedUserInfo();
      expect(cached).toEqual(userInfo);
    });

    it("should return null when no cached info", () => {
      expect(getCachedUserInfo()).toBeNull();
    });
  });
});
