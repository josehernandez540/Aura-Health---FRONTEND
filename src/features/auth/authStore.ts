import { create } from 'zustand';

interface AuthState {
  token: string | null;
  userId: string | null;
  role: string | null;
  isAuthenticated: boolean;
  setAuth: (token: string, userId: string, role: string) => void;
  clearAuth: () => void;
}

const TOKEN_KEY = 'aura_token';
const USER_ID_KEY = 'aura_userId';
const ROLE_KEY = 'aura_role';

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem(TOKEN_KEY),
  userId: localStorage.getItem(USER_ID_KEY),
  role: localStorage.getItem(ROLE_KEY),
  isAuthenticated: !!localStorage.getItem(TOKEN_KEY),

  setAuth: (token, userId, role) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_ID_KEY, userId);
    localStorage.setItem(ROLE_KEY, role);
    set({ token, userId, role, isAuthenticated: true });
  },

  clearAuth: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_ID_KEY);
    localStorage.removeItem(ROLE_KEY);
    set({ token: null, userId: null, role: null, isAuthenticated: false });
  },
}));