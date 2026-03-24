import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      userId: null,
      role: null,
      isAuthenticated: false,

      login: ({ token, userId, role }) => {
        set({
          token,
          userId,
          role,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          token: null,
          userId: null,
          role: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);