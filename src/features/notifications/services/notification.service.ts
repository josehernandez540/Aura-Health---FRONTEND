import api from "../../../services/api";
import { useAuthStore } from "../../auth/store/auth.store";

export type NotificationType = "APPOINTMENT_REMINDER" | "DAILY_AGENDA";
export type NotificationStatus = "PENDING" | "SENT" | "FAILED";

export interface NotificationItem {
  id: string;
  type: NotificationType | null;
  message: string | null;
  status: NotificationStatus | null;
  entityType: string | null;
  entityId: string | null;
  isRead: boolean;
  sentAt: string | null;
  createdAt: string;
}

export interface NotificationsResponse {
  items: NotificationItem[];
  total: number;
  page: number;
  totalPages: number;
}

export interface GetNotificationsParams {
  page?: number;
  limit?: number;
}

export const getNotifications = async (
  params?: GetNotificationsParams
): Promise<NotificationsResponse> => {
  const { data } = await api.get("/notifications", { params });
  return data.data;
};

export const getUnreadCount = async (): Promise<number> => {
  const { data } = await api.get("/notifications/unread-count");
  return data.data.count;
};

export const markNotificationAsRead = async (id: string) => {
  const { data } = await api.patch<{ message: string }>(`/notifications/${id}/read`);
  return data;
};

export const markAllNotificationsAsRead = async () => {
  const { data } = await api.patch<{ message: string }>("/notifications/read-all");
  return data;
};

export const openNotificationStream = (
  onNotification: (notification: NotificationItem) => void
): EventSource | null => {
  const token = useAuthStore.getState().token;
  if (!token) return null;

  const baseURL = api.defaults.baseURL ?? "http://localhost:3000/api";
  const url = `${baseURL}/notifications/stream?token=${encodeURIComponent(token)}`;

  const eventSource = new EventSource(url);

  eventSource.addEventListener("notification", (event: MessageEvent) => {
    try {
      onNotification(JSON.parse(event.data));
    } catch {
      // ignore malformed payloads
    }
  });

  return eventSource;
};
