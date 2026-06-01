import { describe, it, expect, beforeEach } from "vitest";
import { localCache, sessionCache } from "../storage";

describe("StorageHelper", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  describe("localCache", () => {
    it("should set and get a value", () => {
      localCache.set("key", "value");
      expect(localCache.get("key")).toBe("value");
    });

    it("should return null for non-existent key", () => {
      expect(localCache.get("nonexistent")).toBeNull();
    });

    it("should remove a value", () => {
      localCache.set("key", "value");
      localCache.remove("key");
      expect(localCache.get("key")).toBeNull();
    });

    it("should check if key exists", () => {
      localCache.set("key", "value");
      expect(localCache.has("key")).toBe(true);
      expect(localCache.has("nonexistent")).toBe(false);
    });

    it("should clear all values", () => {
      localCache.set("key1", "value1");
      localCache.set("key2", "value2");
      localCache.clear();
      expect(localCache.get("key1")).toBeNull();
      expect(localCache.get("key2")).toBeNull();
    });

    it("should handle expired items", () => {
      localCache.set("key", "value", 0.001);
      const raw = localStorage.getItem("key");
      if (raw) {
        const parsed = JSON.parse(raw);
        parsed.expire = Date.now() - 1;
        localStorage.setItem("key", JSON.stringify(parsed));
      }
      expect(localCache.get("key")).toBeNull();
    });

    it("should handle objects", () => {
      const obj = { name: "test", age: 25 };
      localCache.set("user", obj);
      expect(localCache.get("user")).toEqual(obj);
    });

    it("should handle arrays", () => {
      const arr = [1, 2, 3];
      localCache.set("list", arr);
      expect(localCache.get("list")).toEqual(arr);
    });
  });

  describe("sessionCache", () => {
    it("should set and get values", () => {
      sessionCache.set("key", "value");
      expect(sessionCache.get("key")).toBe("value");
    });
  });
});
