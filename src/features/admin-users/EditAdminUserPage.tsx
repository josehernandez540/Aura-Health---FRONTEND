import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { adminUserService } from './adminUser.service';
import { useAdminUser } from '../../hooks/useAdminUser';
import Toast from '../../components/ui/Toast';
import { useToast } from '../../hooks/useToast';

const editAdminSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  email: z.string().min(1, 'El correo es requerido').email('Correo electrónico inválido'),
});

type FormValues = z.infer<typeof editAdminSchema>;

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

const inputDisabled: React.CSSProperties = {
  ...inputBase,
  background: '#f1f5f9',
  color: '#94a3b8',
  cursor: 'not-allowed',
};

const EditAdminUserPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast, showToast, hideToast } = useToast();
  const { adminUser, isLoading } = useAdminUser(id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(editAdminSchema),
  });

  useEffect(() => {
    if (adminUser) {
      reset({
        name: adminUser.name ?? '',
        email: adminUser.email,
      });
    }
  }, [adminUser, reset]);

  const onSubmit = async (data: FormValues) => {
    if (!id) return;
    setIsSubmitting(true);

    try {
      await adminUserService.updateAdminUser(id, { name: data.name, email: data.email });
      showToast('Administrador actualizado exitosamente.', 'success');
      setTimeout(() => navigate('/admin-users'), 2000);
    } catch (err: unknown) {
      const axiosError = err as { response?: { status?: number; data?: { message?: string } } };
      const status = axiosError?.response?.status;

      if (status === 409) {
        showToast('El correo ya está registrado.', 'error');
      } else {
        showToast('Error al actualizar. Intente nuevamente.', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{
        padding: '32px', background: '#f8fafc', minHeight: '100vh',
        fontFamily: 'sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Cargando información del administrador...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px', background: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>
            Editar Administrador
          </h1>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#94a3b8' }}>
            Actualizar información del administrador
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
            form="edit-admin-form"
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
            {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
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

        <form id="edit-admin-form" onSubmit={handleSubmit(onSubmit)} noValidate>
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

            {/* Rol — deshabilitado */}
            <div>
              <label style={{ display: 'block', color: '#374151', fontSize: '0.875rem', fontWeight: '500', marginBottom: '6px' }}>
                Rol
              </label>
              <input
                type="text"
                value="ADMIN"
                disabled
                style={inputDisabled}
              />
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

export default EditAdminUserPage;
