import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from './auth.service';
import type { LoginCredentials } from './auth.service';
import { useAuthStore } from './authStore';

interface UseAuthReturn {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  errorMessage: string | null;
}

export const useAuth = (): UseAuthReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { setAuth, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await authService.login(credentials);

      if (!response.success) {
        setErrorMessage(response.message || 'Error al iniciar sesión');
        return;
      }

      const { token, userId, role, mustChangePassword } = response.data;
      setAuth(token, userId, role);

      if (mustChangePassword) {
        navigate('/change-password');
      } else {
        navigate('/dashboard');
      }
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      const message =
        axiosError?.response?.data?.message ||
        'Credenciales inválidas. Verifica tu correo y contraseña.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearAuth();
    navigate('/login');
  };

  return { login, logout, isLoading, errorMessage };
};