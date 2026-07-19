import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SidebarState {
  collapsed: boolean;
  mobileOpen: boolean;
  toggleCollapsed: () => void;
  setCollapsed: (collapsed: boolean) => void;
  toggleMobileOpen: () => void;
  closeMobile: () => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set, get) => ({
      collapsed: false,
      mobileOpen: false,

      toggleCollapsed: () => set({ collapsed: !get().collapsed }),

      setCollapsed: (collapsed) => set({ collapsed }),

      toggleMobileOpen: () => set({ mobileOpen: !get().mobileOpen }),

      closeMobile: () => set({ mobileOpen: false }),
    }),
    {
      name: "sidebar-storage",
      // Only persist `collapsed` (the desktop icon-only preference).
      // mobileOpen must NOT survive a reload — the drawer should always
      // start closed on a fresh page load.
      partialize: (state) => ({ collapsed: state.collapsed }),
    }
  )
);
