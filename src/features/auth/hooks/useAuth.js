import { useNavigate } from 'react-router-dom';
import { loginRequest } from '../services/auth.service';
import { useAuthStore } from '../store/auth.store';
import { useUIStore } from "../../../store/ui.store";

export const useAuth = () => {
  const navigate = useNavigate();
  const { login, logout } = useAuthStore();
  const showToast = useUIStore((state) => state.showToast);

  const handleLogin = async (data, setError) => {
    try {
      const res = await loginRequest(data);
      
      const {
        token,
        mustChangePassword,
        user
      } = res.data;
      
      if (!token) {
        throw new Error('No token received');
      }
      
      login({ token, userId: user.id, role: user.role, mustChangePassword });
      
      showToast("Bienvenido..", "success");

      if (mustChangePassword) {
        showToast("Debes cambiar tu contraseña", "warning");
        navigate('/change-password');
        return;
      }
      
      navigate('/dashboard');

    } catch (error) {
      const message =
        error.response?.data?.message || "Error al iniciar sesión";
      showToast(message, "error");
      setError("root", { message });
    }
  };

  return {
    handleLogin,
    logout,
  };
};