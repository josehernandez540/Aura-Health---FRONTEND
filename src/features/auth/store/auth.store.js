import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

      logout: () => {
        const { logoutTimer } = get();

        if (logoutTimer) {
          clearTimeout(logoutTimer);
        }
        set({
          token: null,
          userId: null,
          role: null,
          mustChangePassword: false,
          isAuthenticated: false,
        });
      },

      startLogoutTimer: () => {
        const { tokenExpiration, logout } = get();

        if (!tokenExpiration) return;

        const timeLeft = tokenExpiration - Date.now();

        if (timeLeft <= 0) {
          logout();
          setTimeout(() => {
            alert('Tu sesión ha expirado');
          }, timeLeft - 5000);
          window.location.href = '/login';
          return;
        }

        const timer = setTimeout(() => {
          logout();
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