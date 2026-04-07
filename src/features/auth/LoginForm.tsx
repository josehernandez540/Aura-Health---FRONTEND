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
      fontFamily: 'sans-serif',
    }}>
      {/* Panel izquierdo */}
      <div style={{
        width: '40%',
        background: 'linear-gradient(160deg, #0d2137 0%, #0d3351 60%, #0a4a5e 100%)',
        padding: '40px 48px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Círculos decorativos */}
        <div style={{
          position: 'absolute', top: '-60px', right: '-40px',
          width: '220px', height: '220px', borderRadius: '50%',
          background: 'rgba(20, 120, 140, 0.25)',
        }} />
        <div style={{
          position: 'absolute', bottom: '80px', right: '-80px',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'rgba(20, 120, 140, 0.15)',
        }} />

        {/* Logo */}
        <img 
  src="/logo.png" 
  alt="Aura Health Logo"
  style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'contain' }}
/>

        {/* Título */}
        <div style={{ zIndex: 1, flex: 1 }}>
          <h1 style={{
            color: '#ffffff', fontSize: '2.4rem', fontWeight: '800',
            lineHeight: '1.2', marginBottom: '20px',
          }}>
            Sistema de<br />Gestión Clínica
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '60px' }}>
            Centraliza la información médica,<br />controla agendas y garantiza seguridad.
          </p>

          {/* Features */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {['Control de tratamientos', 'Historial clínico digital'].map((feature) => (
              <div key={feature} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                background: 'rgba(255,255,255,0.07)',
                borderRadius: '8px', padding: '12px 16px',
              }}>
                <div style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: '#14b8a6', flexShrink: 0,
                }} />
                <span style={{ color: '#e2e8f0', fontSize: '0.875rem' }}>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Panel derecho */}
      <div style={{
        flex: 1,
        background: '#f1f5f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
      }}>
        {/* Card */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '48px 40px',
          width: '100%',
          maxWidth: '420px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>
            Bienvenido
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '32px' }}>
            Inicia sesión en tu cuenta clínica
          </p>

          {/* Error */}
          {errorMessage && (
            <div role="alert" style={{
              marginBottom: '20px', padding: '12px 16px', borderRadius: '8px',
              background: '#fef2f2', border: '1px solid #fca5a5',
              color: '#dc2626', fontSize: '0.875rem',
            }}>
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Email */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#374151', fontSize: '0.875rem', fontWeight: '500', marginBottom: '8px' }}>
                Correo electrónico
              </label>
              <input
                type="email"
                autoComplete="email"
                placeholder="medico@aurahealth.co"
                {...register('email')}
                style={{
                  width: '100%', borderRadius: '8px', padding: '12px 16px',
                  fontSize: '0.9rem', color: '#0f172a',
                  background: '#f8fafc',
                  border: errors.email ? '1.5px solid #f87171' : '1.5px solid #e2e8f0',
                  outline: 'none', boxSizing: 'border-box',
                }}
              />
              {errors.email && (
                <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '4px' }}>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div style={{ marginBottom: '28px' }}>
              <label style={{ display: 'block', color: '#374151', fontSize: '0.875rem', fontWeight: '500', marginBottom: '8px' }}>
                Contraseña
              </label>
              <input
                type="password"
                autoComplete="current-password"
                placeholder="••••••••••••"
                {...register('password')}
                style={{
                  width: '100%', borderRadius: '8px', padding: '12px 16px',
                  fontSize: '0.9rem', color: '#0f172a',
                  background: '#f8fafc',
                  border: errors.password ? '1.5px solid #f87171' : '1.5px solid #e2e8f0',
                  outline: 'none', boxSizing: 'border-box',
                }}
              />
              {errors.password && (
                <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '4px' }}>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%', borderRadius: '8px', padding: '14px',
                fontSize: '0.95rem', fontWeight: '600',
                background: isLoading ? '#5eead4' : '#14b8a6',
                color: '#ffffff', border: 'none',
                cursor: isLoading ? 'not-allowed' : 'pointer',
              }}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;