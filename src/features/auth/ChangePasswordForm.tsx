import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { changePasswordSchema } from './changePasswordSchema';
import type { ChangePasswordFormValues } from './changePasswordSchema';
import { authService } from './auth.service';
import { useAuthStore } from './authStore';

const ChangePasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { setAuth, userId, role } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (formData: ChangePasswordFormValues) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await authService.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      if (response.success) {
        // Actualizar token con mustChangePassword = false
        setAuth(response.data.token, userId!, role!, false);
        navigate('/dashboard');
      }
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      setErrorMessage(
        axiosError?.response?.data?.message ||
        'Error al cambiar la contraseña. Verifica tu contraseña actual.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a1a6e 0%, #2d2d9b 50%, #1a1a6e 100%)',
      fontFamily: 'sans-serif',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        borderRadius: '16px',
        padding: '48px 40px',
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      }}>
        <h1 style={{
          textAlign: 'center',
          fontSize: '1.8rem',
          fontWeight: 'bold',
          color: '#ffffff',
          marginBottom: '8px',
        }}>
          Cambio de contraseña
        </h1>
        <p style={{
          textAlign: 'center',
          color: '#cbd5e1',
          fontSize: '0.875rem',
          marginBottom: '32px',
        }}>
          Debes cambiar tu contraseña antes de continuar
        </p>

        {/* Error banner */}
        {errorMessage && (
          <div style={{
            marginBottom: '20px',
            padding: '12px 16px',
            borderRadius: '8px',
            background: 'rgba(220, 38, 38, 0.25)',
            border: '1px solid rgba(220, 38, 38, 0.4)',
            color: '#fca5a5',
            fontSize: '0.875rem',
          }}>
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Contraseña actual */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#e2e8f0', fontSize: '0.9rem', marginBottom: '8px' }}>
              Contraseña actual
            </label>
            <input
              type="password"
              {...register('currentPassword')}
              style={{
                width: '100%',
                borderRadius: '999px',
                padding: '10px 20px',
                fontSize: '0.9rem',
                color: '#1a1a6e',
                background: 'rgba(220, 220, 235, 0.85)',
                border: errors.currentPassword ? '2px solid #f87171' : '2px solid transparent',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            {errors.currentPassword && (
              <p style={{ color: '#fca5a5', fontSize: '0.75rem', marginTop: '6px', paddingLeft: '8px' }}>
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          {/* Nueva contraseña */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#e2e8f0', fontSize: '0.9rem', marginBottom: '8px' }}>
              Nueva contraseña
            </label>
            <input
              type="password"
              {...register('newPassword')}
              style={{
                width: '100%',
                borderRadius: '999px',
                padding: '10px 20px',
                fontSize: '0.9rem',
                color: '#1a1a6e',
                background: 'rgba(220, 220, 235, 0.85)',
                border: errors.newPassword ? '2px solid #f87171' : '2px solid transparent',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            {errors.newPassword && (
              <p style={{ color: '#fca5a5', fontSize: '0.75rem', marginTop: '6px', paddingLeft: '8px' }}>
                {errors.newPassword.message}
              </p>
            )}
            <p style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '6px', paddingLeft: '8px' }}>
              Mínimo 8 caracteres, una mayúscula, una minúscula y un número
            </p>
          </div>

          {/* Confirmar contraseña */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', color: '#e2e8f0', fontSize: '0.9rem', marginBottom: '8px' }}>
              Confirmar nueva contraseña
            </label>
            <input
              type="password"
              {...register('confirmPassword')}
              style={{
                width: '100%',
                borderRadius: '999px',
                padding: '10px 20px',
                fontSize: '0.9rem',
                color: '#1a1a6e',
                background: 'rgba(220, 220, 235, 0.85)',
                border: errors.confirmPassword ? '2px solid #f87171' : '2px solid transparent',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            {errors.confirmPassword && (
              <p style={{ color: '#fca5a5', fontSize: '0.75rem', marginTop: '6px', paddingLeft: '8px' }}>
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                borderRadius: '999px',
                padding: '10px 48px',
                fontSize: '0.9rem',
                fontWeight: '600',
                background: 'rgba(220, 220, 235, 0.85)',
                color: '#1a1a6e',
                border: 'none',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.6 : 1,
              }}
            >
              {isLoading ? 'Guardando...' : 'Cambiar contraseña'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordForm;