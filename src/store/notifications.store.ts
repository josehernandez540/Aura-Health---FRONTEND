import { create } from "zustand";
import {
  getUnreadCount,
  openNotificationStream,
  type NotificationItem,
} from "../features/notifications/services/notification.service";
import { useUIStore } from "./ui.store";

interface NotificationsState {
  unreadCount: number;
  eventSource: EventSource | null;
  fetchUnreadCount: () => Promise<void>;
  incrementUnread: () => void;
  setUnreadCount: (count: number) => void;
  connect: () => void;
  disconnect: () => void;
}

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  unreadCount: 0,
  eventSource: null,

  fetchUnreadCount: async () => {
    try {
      const count = await getUnreadCount();
      set({ unreadCount: count });
    } catch {
      // silent — the badge just won't update this cycle
    }
  },

  incrementUnread: () => set((state) => ({ unreadCount: state.unreadCount + 1 })),

  setUnreadCount: (count) => set({ unreadCount: count }),

  connect: () => {
    if (get().eventSource) return;

    const eventSource = openNotificationStream((notification: NotificationItem) => {
      get().incrementUnread();
      useUIStore.getState().showToast(
        notification.message ?? "Tienes una nueva notificación",
        "info"
      );
    });

    if (eventSource) {
      set({ eventSource });
    }
  },

  disconnect: () => {
    get().eventSource?.close();
    set({ eventSource: null });
  },
}));
