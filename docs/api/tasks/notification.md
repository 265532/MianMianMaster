# Notification 模块联调任务清单

> **优先级**: P1 — 提升用户体验  
> **后端前缀**: `/api/v1/notifications`  
> **后端接口数量**: 4 个端点  
> **现有文件**: [notification.api.ts](file:///d:/code/MianMianMaster/src/api/modules/notification.api.ts) | [notification.types.ts](file:///d:/code/MianMianMaster/src/api/types/notification.types.ts) | [notification.handler.ts](file:///d:/code/MianMianMaster/src/mock/handlers/notification.handler.ts) | [notification Store](file:///d:/code/MianMianMaster/src/stores/notification.ts)

---

## 前置条件

- [ ] Auth + User 联调完成（需要 JWT 认证）

---

## 差异分析

> ⚠️ **前端多出 3 个端点**（`/preferences` GET/PUT + `/device-token` POST），不在后端规范中。
> 联调时需降级处理，`preferences` 可降级为前端 localStorage 存储。

---

## Task 1: 标准端点签名对齐

| # | 端点 | 方法 | 前端方法 | 状态 |
|---|------|------|----------|------|
| 1.1 | `/notifications` | GET | `notificationApi.getNotifications()` | [ ] |
| 1.2 | `/notifications/unread-count` | GET | `notificationApi.getUnreadCount()` | [ ] |
| 1.3 | `/notifications/{id}/read` | PUT | `notificationApi.markAsRead()` | [ ] |
| 1.4 | `/notifications/read-all` | PUT | `notificationApi.markAllAsRead()` | [ ] |

---

## Task 2: 类型定义对齐

- [ ] 2.1 `Notification` 类型包含 `id`/`title`/`content`/`is_read`/`created_at`/`type`
- [ ] 2.2 确认 `NotificationPreferences` 类型字段

---

## Task 3: 通知列表与状态验证

- [ ] 3.1 **通知列表**: `GET /notifications` → 分页参数（`skip`/`limit`）正常
- [ ] 3.2 **未读数量**: `GET /notifications/unread-count` → 返回数字，红点逻辑 > 0 展示
- [ ] 3.3 **单条已读**: `PUT /notifications/{id}/read` → 成功后 `is_read=true`
- [ ] 3.4 **全部已读**: `PUT /notifications/read-all` → 所有 `is_read=true`，红点消失

---

## Task 4: 轮询策略验证

- [ ] 4.1 前端 30 秒轮询 `/unread-count` 是否已实现
- [ ] 4.2 轮询组件销毁时清理 `setInterval`
- [ ] 4.3 页面不可见时（`visibilitychange`）暂停轮询

---

## Task 5: NotificationStore 审查

- [ ] 5.1 [notificationStore](file:///d:/code/MianMianMaster/src/stores/notification.ts) 是否覆盖全部 4 个端点
- [ ] 5.2 `unreadCount` 计算属性正确驱动红点/角标

---

## Task 6: 已读/未读状态验证

- [ ] 6.1 新消息未读 → 红点 + 加粗标题
- [ ] 6.2 标记已读 → 红点消失 + 标题正常字重
- [ ] 6.3 全部已读 → 所有标记更新，红点消失

---

## Task 7: 超范围端点降级

- [ ] 7.1 `getPreferences()` → 改为从 localStorage 读取
- [ ] 7.2 `updatePreferences()` → 改为写入 localStorage
- [ ] 7.3 `registerDeviceToken()` → 降级为空操作

---

## 依赖关系

```
Auth + User → Notification
Notification → 无后续依赖（独立使用）
```