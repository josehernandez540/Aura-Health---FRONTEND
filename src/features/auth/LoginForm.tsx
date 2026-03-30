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
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #1a1a6e 0%, #2d2d9b 50%, #1a1a6e 100%)' }}
    >
      {/* Card glassmorphism */}
      <div
        className="w-full max-w-md rounded-2xl px-10 py-10"
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* Título */}
        <h1 className="text-center text-4xl font-bold text-white mb-8 tracking-wide">
          Iniciar sesion
        </h1>

        {/* Error banner */}
        {errorMessage && (
          <div
            role="alert"
            className="mb-5 flex items-start gap-3 rounded-lg px-4 py-3 text-sm text-red-200"
            style={{ background: 'rgba(220, 38, 38, 0.25)', border: '1px solid rgba(220, 38, 38, 0.4)' }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mt-0.5 h-4 w-4 shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Correo electronico
            </label>
            <input
              type="email"
              autoComplete="email"
              {...register('email')}
              className="w-full rounded-full px-5 py-3 text-sm text-gray-700 outline-none transition"
              style={{
                background: 'rgba(220, 220, 235, 0.85)',
                border: errors.email ? '2px solid #f87171' : '2px solid transparent',
              }}
            />
            {errors.email && (
              <p className="mt-1.5 text-xs text-red-300 pl-2">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              autoComplete="current-password"
              {...register('password')}
              className="w-full rounded-full px-5 py-3 text-sm text-gray-700 outline-none transition"
              style={{
                background: 'rgba(220, 220, 235, 0.85)',
                border: errors.password ? '2px solid #f87171' : '2px solid transparent',
              }}
            />
            {errors.password && (
              <p className="mt-1.5 text-xs text-red-300 pl-2">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-center pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-full px-12 py-2.5 text-sm font-semibold transition focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
              style={{
                background: 'rgba(220, 220, 235, 0.85)',
                color: '#1a1a6e',
              }}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Ingresando...
                </span>
              ) : (
                'Ingresar'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;