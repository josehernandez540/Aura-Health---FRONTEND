import { useNavigate } from 'react-router-dom';
import { loginRequest } from '../services/auth.service';
import { useAuthStore } from '../store/auth.store';

export const useAuth = () => {
  const navigate = useNavigate();
  const { login, logout } = useAuthStore();

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

      if (mustChangePassword) {
        navigate('/change-password');
        return;
      }
      
      login({ token, userId: user.id, role: user.role, mustChangePassword });
      navigate('/dashboard');

    } catch (error) {
      console.error(error)
      setError('root', {
        message: error.response?.data?.message || 'Error al iniciar sesión',
      });
    }
  };

  return {
    handleLogin,
    logout,
  };
};