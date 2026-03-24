import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      userId: null,
      role: null,
      isAuthenticated: false,
      mustChangePassword: false,

      login: ({ token, userId, role, mustChangePassword }) => {
        set({
          token,
          userId,
          role,
          mustChangePassword,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          token: null,
          userId: null,
          role: null,
          mustChangePassword: false,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);