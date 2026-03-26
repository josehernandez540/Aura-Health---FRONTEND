import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { changePasswordSchema } from './changePassword.schema';
import { changePassword } from '../services/auth.service';
import { useAuthStore } from '../store/auth.store';
import Input from '../../../components/ui/Inputs/Input';
import Button from '../../../components/ui/Button/Button';
import './changePassword.css'; 

export default function ChangePasswordForm() {
  const navigate = useNavigate();
  const { completePasswordChange } = useAuthStore();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }
  });

  const onSubmit = async (data) => {
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      completePasswordChange(); 

      navigate("/dashboard");
    } catch (err) {
      setError("root", { 
        message: err.response?.data?.message || "Error al cambiar la contraseña. Verifica tus datos." 
      });
    }
  };

  return (
    <div className="change-password-container">
      <div className="change-password-box">
        <h2>Seguridad de la Cuenta</h2>
        <p className="subtitle">Actualiza tu contraseña para mantener tu cuenta segura</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Contraseña Actual"
            type="password"
            placeholder="••••••••"
            error={errors.currentPassword?.message}
            {...register('currentPassword')}
          />

          <Input
            label="Nueva Contraseña"
            type="password"
            placeholder="••••••••"
            error={errors.newPassword?.message}
            {...register('newPassword')}
          />

          <Input
            label="Confirmar Nueva Contraseña"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          {errors.root && (
            <p className="form-error text-center">{errors.root.message}</p>
          )}

          <div className="form-actions">
            <Button 
              type="submit" 
              isLoading={isSubmitting}
              className="btn-primary"
            >
              Actualizar Contraseña
            </Button>
            
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => navigate('/dashboard')}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}