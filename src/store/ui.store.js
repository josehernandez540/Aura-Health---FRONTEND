import { create } from "zustand";

export const useUIStore = create((set) => ({
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