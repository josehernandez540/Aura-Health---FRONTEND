import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { decodeJWT } from '../../../utils/jwt'
import { useUIStore } from '../../../store/ui.store';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      userId: null,
      role: null,
      isAuthenticated: false,
      mustChangePassword: false,
      hasHydrated: false,
      tokenExpiration: null,
      logoutTimer: null,

      setMustChangePassword: (value) => set({ mustChangePassword: value }),

      login: ({ token, userId, role, mustChangePassword }) => {
        const decoded = decodeJWT(token);

        let expiration = null;

        if (decoded?.exp) {
          expiration = decoded.exp * 1000;
        }

        set({
          token,
          userId,
          role,
          mustChangePassword,
          isAuthenticated: true,
          tokenExpiration: expiration,
        });

        get().startLogoutTimer();
      },

      logout: (reason = "manual") => {
        const { logoutTimer } = get();

        if (logoutTimer) {
          clearTimeout(logoutTimer);
        }
        
        const actualReason = typeof reason === "string" ? reason : "manual";

        set({
          token: null,
          userId: null,
          role: null,
          mustChangePassword: false,
          isAuthenticated: false,
        });

        const ui = useUIStore.getState();

      if (reason === "expired") {
        ui.showToast("Tu sesión ha expirado", "danger");
      }

      if (reason === "manual") {
        console.log("manual")
        ui.showToast("Sesión cerrada correctamente", "info");
      }
      },

      startLogoutTimer: () => {
        const { tokenExpiration, logout } = get();

        if (!tokenExpiration) return;

        const timeLeft = tokenExpiration - Date.now();

        if (timeLeft <= 0) {
          logout("expired");
          window.location.href = '/login';
          return;
        }

        const timer = setTimeout(() => {
          logout("expired");
          window.location.href = '/login';
        }, timeLeft);

        set({ logoutTimer: timer });
      },

    }),
    {
      name: 'auth-storage',

      onRehydrateStorage: () => (state) => {
        state.hasHydrated = true;

        if (state.token) {
          state.startLogoutTimer();
        }
      },
    }
  )
);