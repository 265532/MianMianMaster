import type MockAdapter from "axios-mock-adapter";
import {
  mockNotifications,
  mockNotificationPreferences,
} from "../data/notification.mock";

function success<T>(
  data: T,
): [number, { code: number; message: string; data: T }] {
  return [200, { code: 200, message: "success", data }];
}

export function registerNotificationHandlers(mock: MockAdapter): void {
  mock.onGet("/notifications").reply(() => {
    return success(mockNotifications);
  });

  mock.onGet("/notifications/unread-count").reply(() => {
    const count = mockNotifications.filter((n) => !n.is_read).length;
    return success(count);
  });

  mock.onPut(/\/notifications\/\d+\/read$/).reply((config) => {
    const id = parseInt(config.url?.split("/")[2] ?? "0");
    const notification = mockNotifications.find((n) => n.id === id);
    if (notification) {
      notification.is_read = true;
    }
    return success("MARKED_AS_READ");
  });

  mock.onPut("/notifications/read-all").reply(() => {
    mockNotifications.forEach((n) => {
      n.is_read = true;
    });
    return success("ALL_MARKED_AS_READ");
  });

  mock.onGet("/notifications/preferences").reply(() => {
    return success(mockNotificationPreferences);
  });

  mock.onPut("/notifications/preferences").reply((config) => {
    const data = JSON.parse(config.data);
    Object.assign(mockNotificationPreferences, data);
    return success({ ...mockNotificationPreferences });
  });

  mock.onPost("/notifications/device-token").reply(() => {
    return success("DEVICE_TOKEN_REGISTERED");
  });

  console.log("[Mock] Notification handlers registered");
}
