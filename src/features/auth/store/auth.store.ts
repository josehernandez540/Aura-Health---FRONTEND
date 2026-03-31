import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { decodeJWT } from '../../../utils/jwt';
import { useUIStore } from '../../../store/ui.store';

interface AuthState {
  token: string | null;
  userId: string | null;
  role: string | null;
  isAuthenticated: boolean;
  mustChangePassword: boolean;
  hasHydrated: boolean;
  tokenExpiration: number | null;
  logoutTimer: ReturnType<typeof setTimeout> | null;

  setMustChangePassword: (value: boolean) => void;
  login: (data: { token: string; userId: string; role: string; mustChangePassword: boolean }) => void;
  logout: (reason?: "manual" | "expired" | string) => void;
  startLogoutTimer: () => void;
}

export const useAuthStore = create<AuthState>()(
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
        let expiration: number | null = null;

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
        if (logoutTimer) clearTimeout(logoutTimer);
        
        set({
          token: null,
          userId: null,
          role: null,
          mustChangePassword: false,
          isAuthenticated: false,
          tokenExpiration: null,
          logoutTimer: null
        });

        const showToast = useUIStore.getState().showToast;

        if (reason === "expired") {
          showToast("Tu sesión ha expirado por inactividad", "error");
        } else if (reason === "manual") {
          showToast("Sesión cerrada correctamente", "info");
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

        const currentTimer = get().logoutTimer;
        if (currentTimer) clearTimeout(currentTimer);

        const timer = setTimeout(() => {
          logout("expired");
          window.location.href = '/login';
        }, timeLeft);

        set({ logoutTimer: timer });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => {
        const { logoutTimer, hasHydrated, ...rest } = state;
        return rest;
      },
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hasHydrated = true;
          if (state.token) {
            state.startLogoutTimer();
          }
        }
      },
    }
  )
);