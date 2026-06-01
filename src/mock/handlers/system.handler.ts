import type MockAdapter from "axios-mock-adapter";
import {
  mockSystemConfigs,
  mockSystemHealth,
  mockSystemAnnouncements,
} from "../data/system.mock";

function success<T>(
  data: T,
): [number, { code: number; message: string; data: T }] {
  return [200, { code: 200, message: "success", data }];
}

export function registerSystemHandlers(mock: MockAdapter): void {
  mock.onGet("/system/config").reply(() => {
    return success(mockSystemConfigs);
  });

  mock.onGet("/system/health").reply(() => {
    return success(mockSystemHealth);
  });

  mock.onGet("/system/announcements").reply(() => {
    return success(mockSystemAnnouncements);
  });

  console.log("[Mock] System handlers registered");
}
