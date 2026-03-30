import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from './loginSchema';
import type { LoginFormValues } from './loginSchema';
import { useAuth } from './useAuth';

const LoginForm = () => {
  const { login, isLoading, errorMessage } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (formData: LoginFormValues) => {
    await login(formData);
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
      {/* Card */}
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
        {/* Título */}
        <h1 style={{
          textAlign: 'center',
          fontSize: '2.2rem',
          fontWeight: 'bold',
          color: '#ffffff',
          marginBottom: '36px',
          letterSpacing: '0.02em',
        }}>
          Iniciar sesion
        </h1>

        {/* Error banner */}
        {errorMessage && (
          <div role="alert" style={{
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
          {/* Email */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              color: '#e2e8f0',
              fontSize: '0.9rem',
              marginBottom: '8px',
            }}>
              Correo electronico
            </label>
            <input
              type="email"
              autoComplete="email"
              {...register('email')}
              style={{
                width: '100%',
                borderRadius: '999px',
                padding: '10px 20px',
                fontSize: '0.9rem',
                color: '#1a1a6e',
                background: 'rgba(220, 220, 235, 0.85)',
                border: errors.email ? '2px solid #f87171' : '2px solid transparent',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            {errors.email && (
              <p style={{ color: '#fca5a5', fontSize: '0.75rem', marginTop: '6px', paddingLeft: '8px' }}>
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{
              display: 'block',
              color: '#e2e8f0',
              fontSize: '0.9rem',
              marginBottom: '8px',
            }}>
              Contraseña
            </label>
            <input
              type="password"
              autoComplete="current-password"
              {...register('password')}
              style={{
                width: '100%',
                borderRadius: '999px',
                padding: '10px 20px',
                fontSize: '0.9rem',
                color: '#1a1a6e',
                background: 'rgba(220, 220, 235, 0.85)',
                border: errors.password ? '2px solid #f87171' : '2px solid transparent',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            {errors.password && (
              <p style={{ color: '#fca5a5', fontSize: '0.75rem', marginTop: '6px', paddingLeft: '8px' }}>
                {errors.password.message}
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
              {isLoading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;