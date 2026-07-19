import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { changePasswordSchema, type ChangePasswordInput } from './changePassword.schema';
import { changePassword } from '../services/auth.service';
import { useAuthStore } from '../store/auth.store';
import Input from '../../../components/ui/Inputs/Input';
import Button from '../../../components/ui/Button/Button';
import './changePassword.css'; 
import { useUIStore } from "../../../store/ui.store";

interface ChangePasswordFormProps {
  // "standalone" is the full-page forced-change screen (default, unchanged behavior).
  // "embedded" fits inside another page's card (e.g. Mi Perfil): no outer full-height
  // wrapper, no heading, no cancel button.
  variant?: "standalone" | "embedded";
  onSuccess?: () => void;
}

export default function ChangePasswordForm({ variant = "standalone", onSuccess }: ChangePasswordFormProps) {
  const navigate = useNavigate();
  const showToast = useUIStore((state) => state.showToast);
  const setMustChangePassword = useAuthStore((state) => state.setMustChangePassword);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }
  });

  const onSubmit = async (data: ChangePasswordInput) => {
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      setMustChangePassword(false);
      showToast("Contraseña actualizada correctamente", "success");

      if (onSuccess) {
        reset();
        onSuccess();
      } else {
        navigate("/dashboard");
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        "Error al cambiar la contraseña";
      showToast(message, "error");
      setError("root", { message });
    }
  };

  const form = (
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
        <p className="form-error text-center" style={{ color: 'var(--danger)', marginBottom: '1rem' }}>
          {errors.root.message}
        </p>
      )}

      <div className="form-actions">
        <Button
          type="submit"
          isLoading={isSubmitting}
          style={variant === "embedded" ? { width: "auto" } : undefined}
        >
          Actualizar Contraseña
        </Button>

        {variant === "standalone" && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );

  if (variant === "embedded") {
    return form;
  }

  return (
    <div className="change-password-container">
      <div className="change-password-box">
        <h2>Seguridad de la Cuenta</h2>
        <p className="subtitle">Actualiza tu contraseña para mantener tu cuenta segura</p>
        {form}
      </div>
    </div>
  );
}