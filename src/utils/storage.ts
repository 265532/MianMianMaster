type StorageType = "local" | "session";

class StorageHelper {
  private storage: Storage;

  constructor(type: StorageType = "local") {
    this.storage = type === "local" ? localStorage : sessionStorage;
  }

  set(key: string, value: any, expireInMinutes?: number): void {
    const item = {
      value,
      expire: expireInMinutes ? Date.now() + expireInMinutes * 60 * 1000 : null,
    };
    this.storage.setItem(key, JSON.stringify(item));
  }

  get(key: string): any {
    const itemStr = this.storage.getItem(key);

    if (!itemStr) return null;

    try {
      const item = JSON.parse(itemStr);

      if (item.expire && Date.now() > item.expire) {
        this.remove(key);
        return null;
      }

      return item.value;
    } catch {
      return null;
    }
  }

  remove(key: string): void {
    this.storage.removeItem(key);
  }

  clear(): void {
    this.storage.clear();
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }
}

export const localCache = new StorageHelper("local");
export const sessionCache = new StorageHelper("session");
