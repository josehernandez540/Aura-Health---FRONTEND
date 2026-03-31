import { useNavigate } from 'react-router-dom';
import { loginRequest } from '../services/auth.service';
import { useAuthStore } from '../store/auth.store';
import { useUIStore } from "../../../store/ui.store";
import type { UseFormSetError } from 'react-hook-form';
import type { LoginInput } from '../schemas/login.schema';

export const useAuth = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const showToast = useUIStore((state) => state.showToast);

  const handleLogin = async (data: LoginInput, setError: UseFormSetError<LoginInput>) => {
    try {
      const res = await loginRequest(data);
      
      const {
        token,
        mustChangePassword,
        user
      } = res.data;
      
      if (!token) {
        throw new Error('No se recibió el token de autenticación');
      }
      
      login({ 
        token, 
        userId: user.id, 
        role: user.role, 
        mustChangePassword 
      });
      
      showToast("Bienvenido al sistema", "success");

      if (mustChangePassword) {
        showToast("Por seguridad, debes cambiar tu contraseña", "warning");
        navigate('/change-password');
        return;
      }
      
      navigate('/dashboard');

    } catch (error: any) {
      const message = error.response?.data?.message || "Error al iniciar sesión";
      showToast(message, "error");
      
      setError("root", { message });
    }
  };

  return {
    handleLogin,
    logout,
  };
};