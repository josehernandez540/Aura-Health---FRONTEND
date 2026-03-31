import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from '../schemas/login.schema.ts';
import { useAuth } from '../hooks/useAuth.ts';
import Input from '../../../components/ui/Inputs/Input';
import Button from '../../../components/ui/Button/Button';
import './login.css';

export default function LoginForm() {
  const { handleLogin } = useAuth();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginInput) => {
    handleLogin(data, setError);
  };

  return (
    <div id="login-screen">
      <div className="login-left">
        <div className="login-brand">
          <div className="login-brand-icon">
            <img src="assets/logo.png" alt="Logo" height="50px" />
          </div>
          <h1>Aura Health</h1>
          <p>
            Sistema de gestión clínica inteligente para el manejo de médicos,
            pacientes y tratamientos.
          </p>
        </div>
      </div>

      <div className="login-right">
        <div className="login-box">
          <h2>Bienvenido</h2>
          <p>Inicia sesión en tu cuenta para continuar</p>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Correo electrónico"
              type="email"
              placeholder="example@aurahealth.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />

            {errors.root && (
              <p className="form-error text-center" style={{ color: 'var(--danger)', marginBottom: '1rem' }}>
                {errors.root.message}
              </p>
            )}

            <Button 
              type="submit" 
              isLoading={isSubmitting}
              className="w-full"
            >
              Iniciar Sesión
            </Button>
          </form>

          <p style={{ fontSize: '.75rem', color: 'var(--txt3)', textAlign: 'center', marginTop: '20px' }}>
            Aura Health v1.0 — Sistema de Gestión Clínica © 2026
          </p>
        </div>
      </div>
    </div>
  );
}