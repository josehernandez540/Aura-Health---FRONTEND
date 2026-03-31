import { create } from "zustand";

export type ToastType = "success" | "danger" | "info" | "warning" | "error";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface UIState {
  toasts: Toast[];
  showToast: (message: string, type?: ToastType) => void;
  closeToast: (id: number) => void;
}

export const useUIStore = create<UIState>((set) => ({
  toasts: [],

  showToast: (message, type = "success") => {
    const id = Date.now();
    
    set((state) => ({
      toasts: [{ id, message, type }, ...state.toasts].slice(0, 3),
    }));

    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, 6000);
  },

  closeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));