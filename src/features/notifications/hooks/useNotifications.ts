import { useState, useEffect, useCallback } from "react";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  type NotificationItem,
} from "../services/notification.service";
import { useNotificationsStore } from "../../../store/notifications.store";
import { useUIStore } from "../../../store/ui.store";

export const useNotificationsList = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const showToast = useUIStore((state) => state.showToast);
  const fetchUnreadCount = useNotificationsStore((state) => state.fetchUnreadCount);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getNotifications({ limit: 50 });
      setNotifications(data.items);
    } catch {
      showToast("Error al cargar las notificaciones", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      fetchUnreadCount();
    } catch {
      showToast("Error al marcar la notificación como leída", "error");
    }
  };

  const markAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      fetchUnreadCount();
      showToast("Notificaciones marcadas como leídas", "success");
    } catch {
      showToast("Error al marcar las notificaciones como leídas", "error");
    }
  };

  return { notifications, loading, fetchNotifications, markAsRead, markAllAsRead };
};
