import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { adminUserService } from './adminUser.service';
import type { CreateAdminUserPayload } from './adminUser.service';
import Toast from '../../components/ui/Toast';
import { useToast } from '../../hooks/useToast';

const createAdminSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  email: z.string().min(1, 'El correo es requerido').email('Correo electrónico inválido'),
  password: z.string()
    .min(8, 'La contraseña debe tener mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número'),
});

type FormValues = z.infer<typeof createAdminSchema>;

const inputBase: React.CSSProperties = {
  width: '100%',
  borderRadius: '8px',
  padding: '12px 16px',
  border: '1px solid #e2e8f0',
  background: '#f8fafc',
  fontSize: '0.9rem',
  fontFamily: 'sans-serif',
  color: '#0f172a',
  boxSizing: 'border-box',
  outline: 'none',
};

const inputError: React.CSSProperties = {
  ...inputBase,
  border: '1.5px solid #f87171',
};

const CreateAdminUserPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(createAdminSchema),
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    const payload: CreateAdminUserPayload = {
      name: data.name,
      email: data.email,
      password: data.password,
    };

    try {
      await adminUserService.createAdminUser(payload);
      showToast('Administrador creado exitosamente.', 'success');
      reset();
      setTimeout(() => navigate('/admin-users'), 2000);
    } catch (err: unknown) {
      const axiosError = err as { response?: { status?: number; data?: { message?: string } } };
      const status = axiosError?.response?.status;
      const message = axiosError?.response?.data?.message ?? '';

      if (status === 409 || message.toLowerCase().includes('email') || message.toLowerCase().includes('duplicate')) {
        showToast('El correo electrónico ya está registrado.', 'error');
      } else {
        showToast('Error al crear el administrador. Intente nuevamente.', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '32px', background: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>
            Nuevo Administrador
          </h1>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#94a3b8' }}>
            Registrar administrador en el sistema
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => navigate('/admin-users')}
            style={{
              padding: '10px 20px', borderRadius: '8px',
              background: '#fff', color: '#374151',
              border: '1px solid #d1d5db', fontSize: '0.875rem',
              fontWeight: '500', cursor: 'pointer', fontFamily: 'sans-serif',
            }}
          >
            Cancelar
          </button>
          <button
            form="create-admin-form"
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: '10px 20px', borderRadius: '8px',
              background: isSubmitting ? '#5eead4' : '#0d9488',
              color: '#fff', border: 'none',
              fontSize: '0.875rem', fontWeight: '600',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              fontFamily: 'sans-serif',
            }}
          >
            {isSubmitting ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>

      {/* Card */}
      <div style={{
        background: '#fff', borderRadius: '12px',
        boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
        padding: '32px', maxWidth: '600px', margin: '0 auto',
      }}>
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>
            Información del administrador
          </h2>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>
            Complete todos los campos requeridos
          </p>
        </div>

        <form id="create-admin-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Nombre completo */}
            <div>
              <label style={{ display: 'block', color: '#374151', fontSize: '0.875rem', fontWeight: '500', marginBottom: '6px' }}>
                Nombre completo
              </label>
              <input
                type="text"
                placeholder="Juan Pérez"
                {...register('name')}
                style={errors.name ? inputError : inputBase}
              />
              {errors.name && (
                <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: '#dc2626' }}>
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Correo electrónico */}
            <div>
              <label style={{ display: 'block', color: '#374151', fontSize: '0.875rem', fontWeight: '500', marginBottom: '6px' }}>
                Correo electrónico
              </label>
              <input
                type="email"
                placeholder="admin@aura.com"
                {...register('email')}
                style={errors.email ? inputError : inputBase}
              />
              {errors.email && (
                <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: '#dc2626' }}>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Contraseña temporal */}
            <div>
              <label style={{ display: 'block', color: '#374151', fontSize: '0.875rem', fontWeight: '500', marginBottom: '6px' }}>
                Contraseña temporal
              </label>
              <input
                type="password"
                placeholder="Mínimo 8 caracteres"
                {...register('password')}
                style={errors.password ? inputError : inputBase}
              />
              {errors.password ? (
                <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: '#dc2626' }}>
                  {errors.password.message}
                </p>
              ) : (
                <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>
                  El administrador deberá cambiar esta contraseña en su primer acceso
                </p>
              )}
            </div>

          </div>
        </form>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
        duration={3000}
      />
    </div>
  );
};

export default CreateAdminUserPage;
