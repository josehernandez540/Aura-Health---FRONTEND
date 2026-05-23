import { create } from 'zustand';

interface AuthState {
  token: string | null;
  userId: string | null;
  role: string | null;
  mustChangePassword: boolean;
  isAuthenticated: boolean;
  setAuth: (token: string, userId: string, role: string, mustChangePassword: boolean) => void;
  clearAuth: () => void;
}

const TOKEN_KEY = 'aura_token';
const USER_ID_KEY = 'aura_userId';
const ROLE_KEY = 'aura_role';
const MUST_CHANGE_KEY = 'aura_mustChangePassword';

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem(TOKEN_KEY),
  userId: localStorage.getItem(USER_ID_KEY),
  role: localStorage.getItem(ROLE_KEY),
  mustChangePassword: localStorage.getItem(MUST_CHANGE_KEY) === 'true',
  isAuthenticated: !!localStorage.getItem(TOKEN_KEY),

  setAuth: (token, userId, role, mustChangePassword) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_ID_KEY, userId);
    localStorage.setItem(ROLE_KEY, role);
    localStorage.setItem(MUST_CHANGE_KEY, String(mustChangePassword));
    set({ token, userId, role, mustChangePassword, isAuthenticated: true });
  },

  clearAuth: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_ID_KEY);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(MUST_CHANGE_KEY);
    set({ token: null, userId: null, role: null, mustChangePassword: false, isAuthenticated: false });
  },
}));