import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTreatments } from './useTreatments';
import { appointmentsService } from '../appointments/appointments.service';
import { useAuthStore } from '../auth/authStore';
import Toast from '../../components/ui/Toast';
import { useToast } from '../../hooks/useToast';

const PRESENTATIONS = ['Tableta', 'Cápsula', 'Jarabe', 'Inyectable', 'Crema', 'Gotas', 'Otro'];
const FREQUENCIES = [
  'Cada 4 horas',
  'Cada 6 horas',
  'Cada 8 horas',
  'Cada 12 horas',
  'Cada 24 horas',
  'Una vez al día',
  'Dos veces al día',
  'Tres veces al día',
  'Según necesidad',
];

const medicationSchema = z.object({
  name: z.string().min(1, 'Nombre del medicamento obligatorio'),
  presentation: z.string().min(1, 'Presentación obligatoria'),
  dose: z.string().min(1, 'Dosis obligatoria'),
  frequency: z.string().min(1, 'Frecuencia obligatoria'),
  duration: z.string().optional().default(''),
});

const treatmentSchema = z.object({
  patientId: z.string().min(1, 'Paciente obligatorio'),
  medications: z.array(medicationSchema).min(1, 'Agrega al menos un medicamento'),
  notes: z.string().optional().default(''),
});

type TreatmentFormValues = z.infer<typeof treatmentSchema>;

const inputBase: React.CSSProperties = {
  width: '100%',
  borderRadius: '8px',
  padding: '10px 14px',
  border: '1px solid #e2e8f0',
  background: '#f8fafc',
  fontSize: '0.875rem',
  fontFamily: 'sans-serif',
  color: '#0f172a',
  boxSizing: 'border-box',
  outline: 'none',
};

const inputErr: React.CSSProperties = { ...inputBase, border: '1.5px solid #f87171' };

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.8rem',
  fontWeight: '600',
  color: '#374151',
  marginBottom: '6px',
};

const sectionCard: React.CSSProperties = {
  background: '#fff',
  borderRadius: '12px',
  boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
  padding: '24px',
  marginBottom: '20px',
};

interface Patient {
  id: string;
  name: string;
  document_number?: string;
}

const TreatmentForm = () => {
  const navigate = useNavigate();
  const { userId } = useAuthStore();
  const { isSaving, error, success, createTreatment } = useTreatments();
  const { toast, showToast, hideToast } = useToast();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctorName, setDoctorName] = useState('');
  const [doctorSpecialization, setDoctorSpecialization] = useState('');
  const [doctorId] = useState(() => localStorage.getItem('aura_doctorId') || '');

  useEffect(() => {
    setDoctorName(localStorage.getItem('aura_doctorName') || 'Médico');
    setDoctorSpecialization(localStorage.getItem('aura_doctorSpecialization') || 'Especialidad');

    appointmentsService.getPatients().then((res) => {
      if (res.success) {
        setPatients(res.data.items.filter((p: { is_active: boolean }) => p.is_active));
      }
    });
  }, [userId]);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TreatmentFormValues>({
    resolver: zodResolver(treatmentSchema),
    defaultValues: {
      patientId: '',
      medications: [{ name: '', presentation: '', dose: '', frequency: '', duration: '' }],
      notes: '',
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'medications' });

  const validations = [
    { label: 'Paciente obligatorio', ok: !errors.patientId },
    { label: 'Medicamento obligatorio', ok: !errors.medications },
    { label: 'Dosis obligatoria', ok: !errors.medications?.some?.((m) => m?.dose) },
    { label: 'Presentación', ok: !errors.medications?.some?.((m) => m?.presentation) },
    { label: 'POST /tratamientos', ok: false },
  ];

  const onSubmit = async (data: TreatmentFormValues) => {
    const ok = await createTreatment({
      patientId: data.patientId,
      medications: data.medications.map((m) => ({
        name: m.name,
        presentation: m.presentation,
        dose: m.dose,
        frequency: m.frequency,
        duration: m.duration || '',
      })),
      notes: data.notes,
    });

    if (ok) {
      showToast('Tratamiento guardado exitosamente.', 'success');
      setTimeout(() => navigate('/treatments'), 1800);
    } else {
      showToast(error || 'Error al guardar el tratamiento.', 'error');
    }
  };

  const initial = doctorName.charAt(0).toUpperCase();

  return (
    <div
      style={{
        padding: '32px',
        background: '#f8fafc',
        minHeight: '100vh',
        fontFamily: 'sans-serif',
      }}
    >
      {/* Breadcrumb */}
      <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px' }}>
        Tratamientos / Nuevo Tratamiento
      </p>

      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '28px',
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#0f172a',
              marginBottom: '4px',
            }}
          >
            Nuevo Tratamiento
          </h1>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#94a3b8' }}>
            Prescribe medicamentos e indicaciones clínicas para el paciente
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="button"
            onClick={() => navigate('/treatments')}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              background: '#fff',
              color: '#374151',
              border: '1px solid #d1d5db',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              fontFamily: 'sans-serif',
            }}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={isSaving}
            style={{
              padding: '10px 24px',
              borderRadius: '8px',
              background: isSaving ? '#5eead4' : '#0d9488',
              color: '#fff',
              border: 'none',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: isSaving ? 'not-allowed' : 'pointer',
              fontFamily: 'sans-serif',
            }}
          >
            {isSaving ? 'Guardando...' : 'Guardar Tratamiento'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Doctor responsable */}
        <div style={sectionCard}>
          <p
            style={{
              fontSize: '0.8rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '14px',
            }}
          >
            Médico responsable
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#f8fafc',
              borderRadius: '10px',
              padding: '14px 18px',
              border: '1px solid #e2e8f0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: '#0d9488',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: '700',
                  fontSize: '1rem',
                  flexShrink: 0,
                }}
              >
                {initial}
              </div>
              <div>
                <p
                  style={{
                    margin: 0,
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    color: '#0f172a',
                  }}
                >
                  {doctorName}
                </p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                  {doctorSpecialization}
                </p>
              </div>
            </div>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: '600',
                padding: '4px 12px',
                borderRadius: '999px',
                background: '#f0fdfa',
                color: '#0d9488',
                border: '1px solid #99f6e4',
              }}
            >
              • Auto-asignado
            </span>
          </div>
        </div>

        {/* Información del paciente */}
        <div style={sectionCard}>
          <p
            style={{
              fontSize: '0.8rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '14px',
            }}
          >
            Información del paciente
          </p>
          <div>
            <label style={labelStyle}>
              Paciente <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <select
              {...register('patientId')}
              style={errors.patientId ? { ...inputErr, appearance: 'auto' } : { ...inputBase, appearance: 'auto' }}
            >
              <option value="">Seleccionar paciente...</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            {errors.patientId && (
              <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: '#dc2626' }}>
                {errors.patientId.message}
              </p>
            )}
          </div>
        </div>

        {/* Medicamentos */}
        <div style={sectionCard}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}
          >
            <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: '600', color: '#374151' }}>
              Medicamentos
            </p>
            <span style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: '500' }}>
              Mín. 1 requerido
            </span>
          </div>

          {fields.map((field, index) => (
            <div
              key={field.id}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '18px',
                marginBottom: '14px',
                background: '#fafafa',
              }}
            >
              {/* Badge + remove */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '14px',
                }}
              >
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: '700',
                    padding: '3px 10px',
                    borderRadius: '999px',
                    background: '#e0f2fe',
                    color: '#0369a1',
                    letterSpacing: '0.05em',
                  }}
                >
                  MEDICAMENTO {index + 1}
                </span>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#94a3b8',
                      fontSize: '1rem',
                      lineHeight: 1,
                      padding: '2px 4px',
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Nombre + Presentación */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '14px',
                  marginBottom: '14px',
                }}
              >
                <div>
                  <label style={labelStyle}>
                    Nombre del medicamento <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Enalapril, Metformina..."
                    {...register(`medications.${index}.name`)}
                    style={errors.medications?.[index]?.name ? inputErr : inputBase}
                  />
                  {errors.medications?.[index]?.name && (
                    <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: '#dc2626' }}>
                      {errors.medications[index]?.name?.message}
                    </p>
                  )}
                </div>
                <div>
                  <label style={labelStyle}>Presentación</label>
                  <Controller
                    control={control}
                    name={`medications.${index}.presentation`}
                    render={({ field: f }) => (
                      <select
                        {...f}
                        style={
                          errors.medications?.[index]?.presentation
                            ? { ...inputErr, appearance: 'auto' }
                            : { ...inputBase, appearance: 'auto' }
                        }
                      >
                        <option value="">Seleccionar...</option>
                        {PRESENTATIONS.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                </div>
              </div>

              {/* Dosis + Frecuencia + Duración */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '14px',
                }}
              >
                <div>
                  <label style={labelStyle}>
                    Dosis <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. 10 mg"
                    {...register(`medications.${index}.dose`)}
                    style={errors.medications?.[index]?.dose ? inputErr : inputBase}
                  />
                  {errors.medications?.[index]?.dose && (
                    <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: '#dc2626' }}>
                      {errors.medications[index]?.dose?.message}
                    </p>
                  )}
                </div>
                <div>
                  <label style={labelStyle}>Frecuencia</label>
                  <Controller
                    control={control}
                    name={`medications.${index}.frequency`}
                    render={({ field: f }) => (
                      <select
                        {...f}
                        style={{ ...inputBase, appearance: 'auto' }}
                      >
                        <option value="">Seleccionar...</option>
                        {FREQUENCIES.map((freq) => (
                          <option key={freq} value={freq}>
                            {freq}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Duración</label>
                  <input
                    type="text"
                    placeholder="Ej. 7 días"
                    {...register(`medications.${index}.duration`)}
                    style={inputBase}
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Agregar medicamento */}
          <button
            type="button"
            onClick={() =>
              append({ name: '', presentation: '', dose: '', frequency: '', duration: '' })
            }
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1.5px dashed #0d9488',
              background: 'transparent',
              color: '#0d9488',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: 'sans-serif',
            }}
          >
            + Agregar medicamento
          </button>
        </div>

        {/* Indicaciones adicionales */}
        <div style={sectionCard}>
          <label style={{ ...labelStyle, marginBottom: '4px' }}>
            Indicaciones adicionales{' '}
            <span style={{ fontWeight: '400', color: '#94a3b8' }}>(opcional)</span>
          </label>
          <textarea
            {...register('notes')}
            rows={4}
            placeholder="Escribe indicaciones clínicas, restricciones dietéticas, recomendaciones de estilo de vida o notas para el paciente..."
            style={{
              ...inputBase,
              resize: 'vertical',
              minHeight: '100px',
            }}
          />
        </div>

        {/* Validaciones activas */}
        <div
          style={{
            background: '#f1f5f9',
            borderRadius: '8px',
            padding: '10px 16px',
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            alignItems: 'center',
            fontSize: '0.75rem',
          }}
        >
          <span
            style={{
              fontWeight: '600',
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Validaciones activas (ZOD)
          </span>
          {validations.map((v) => (
            <span
              key={v.label}
              style={{
                padding: '3px 10px',
                borderRadius: '999px',
                background: v.ok ? '#f0fdf4' : '#f1f5f9',
                color: v.ok ? '#16a34a' : '#94a3b8',
                border: `1px solid ${v.ok ? '#bbf7d0' : '#e2e8f0'}`,
                fontWeight: '500',
              }}
            >
              {v.ok ? '✓' : '○'} {v.label}
            </span>
          ))}
        </div>
      </form>

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

export default TreatmentForm;