import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { appointmentsService } from './appointments.service';
import type { Appointment } from './appointments.service';
import CancelAppointmentModal from './CancelAppointmentModal';

const ITEMS_PER_PAGE = 9;

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const day   = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year  = String(date.getFullYear()).slice(2);
  return `${day}/${month}/${year}`;
};

const statusConfig = {
  SCHEDULED: { label: 'Pendiente',   color: '#f97316', bg: '#fff7ed', border: '#fed7aa' },
  COMPLETED: { label: 'Completada',  color: '#0d9488', bg: '#f0fdfa', border: '#99f6e4' },
  CANCELLED: { label: 'Cancelada',   color: '#dc2626', bg: '#fef2f2', border: '#fca5a5' },
  NO_SHOW:   { label: 'No asistió',  color: '#6b7280', bg: '#f9fafb', border: '#e5e7eb' },
};

const AppointmentsPage = () => {
  const navigate = useNavigate();

  const [appointments, setAppointments]       = useState<Appointment[]>([]);
  const [isLoading, setIsLoading]             = useState(false);
  const [actionError, setActionError]         = useState<string | null>(null);
  const [isActioning, setIsActioning]         = useState<string | null>(null);
  const [page, setPage]                       = useState(1);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancellingAppointment, setCancellingAppointment] = useState<{ id: string; patientName: string } | null>(null);

  const loadAppointments = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await appointmentsService.getAll();
      if (response.success) setAppointments(response.data.items);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadAppointments(); }, [loadAppointments]);

  // ── Action handlers ─────────────────────────────────────────────────────

  const openCancelModal = (id: string, patientName: string) => {
    setCancellingAppointment({ id, patientName });
    setCancelModalOpen(true);
  };

  const handleNoShow = async (id: string) => {
    if (!window.confirm('¿Marcar al paciente como no asistido?')) return;
    setIsActioning(id);
    setActionError(null);
    try {
      await appointmentsService.markNoShow(id);
      await loadAppointments();
    } catch {
      setActionError('No se pudo registrar la inasistencia. Inténtelo nuevamente.');
    } finally {
      setIsActioning(null);
    }
  };

  // ── Derived ─────────────────────────────────────────────────────────────

  const total     = appointments.length;
  const completed = appointments.filter(a => a.status === 'COMPLETED').length;
  const pending   = appointments.filter(a => a.status === 'SCHEDULED').length;
  const cancelled = appointments.filter(a => a.status === 'CANCELLED').length;

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  const paginated  = appointments.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const today = new Date().toLocaleDateString('es-CO', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  // ── Shared style for action buttons ─────────────────────────────────────

  const actionBtn = (bg: string, color: string, border: string, disabled: boolean): React.CSSProperties => ({
    padding: '5px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '500',
    background: disabled ? '#f1f5f9' : bg,
    color: disabled ? '#94a3b8' : color,
    border: `1px solid ${disabled ? '#e2e8f0' : border}`,
    cursor: disabled ? 'not-allowed' : 'pointer',
    whiteSpace: 'nowrap',
  });

  return (
    <div style={{ padding: '32px', fontFamily: 'sans-serif', background: '#f8fafc', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>
          Agenda / Citas
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem', textTransform: 'capitalize' }}>{today}</p>
      </div>

      {/* Action error banner */}
      {actionError && (
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '12px 16px', borderRadius: '8px', background: '#fef2f2',
          border: '1px solid #fca5a5', color: '#dc2626', fontSize: '0.875rem', marginBottom: '20px',
        }}>
          <span>{actionError}</span>
          <button
            onClick={() => setActionError(null)}
            style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '1rem', lineHeight: 1 }}
          >
            ×
          </button>
        </div>
      )}

      {/* Stats cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Total citas',  value: total,     color: '#0d9488' },
          { label: 'Completadas', value: completed,  color: '#0d9488' },
          { label: 'Pendientes',  value: pending,    color: '#f97316' },
          { label: 'Canceladas',  value: cancelled,  color: '#6b7280' },
        ].map((stat) => (
          <div key={stat.label} style={{
            background: '#fff', borderRadius: '12px', padding: '20px 24px',
            boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
            borderLeft: `3px solid ${stat.color}`,
          }}>
            <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>

        {/* Table title */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: '600', color: '#0f172a', marginBottom: '2px' }}>Citas</h2>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{pending} citas pendientes</p>
        </div>

        {/* Column headers */}
        <div style={{
          display: 'flex', alignItems: 'center',
          padding: '10px 24px', background: '#f8fafc', borderBottom: '1px solid #f1f5f9',
        }}>
          {[
            { label: 'FECHA',    style: { width: '96px', flexShrink: 0 } },
            { label: 'PACIENTE', style: { flex: 1 } },
            { label: 'HORA',     style: { width: '60px', flexShrink: 0 } },
            { label: 'MÉDICO',   style: { width: '156px', flexShrink: 0 } },
            { label: 'ESTADO',   style: { width: '100px', flexShrink: 0 } },
            { label: 'ACCIONES', style: { width: '220px', flexShrink: 0 } },
          ].map(({ label, style }) => (
            <div key={label} style={{
              ...style,
              fontSize: '0.7rem', fontWeight: '600', color: '#94a3b8',
              letterSpacing: '0.05em', textTransform: 'uppercase',
            }}>
              {label}
            </div>
          ))}
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Cargando citas...</div>
        ) : paginated.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>No hay citas disponibles</div>
        ) : (
          paginated.map((apt, index) => {
            const status    = statusConfig[apt.status];
            const actioning = isActioning === apt.id;

            return (
              <div key={apt.id} style={{
                display: 'flex', alignItems: 'center',
                padding: '14px 24px',
                background: index % 2 === 0 ? '#fff' : '#f8fafc',
                borderBottom: '1px solid #f1f5f9',
              }}>
                {/* FECHA */}
                <div style={{
                  width: '96px', flexShrink: 0,
                  fontSize: '0.875rem', fontWeight: '600', color: '#64748b',
                  borderRight: '2px solid #0d9488', paddingRight: '16px',
                }}>
                  {formatDate(apt.date)}
                </div>

                {/* PACIENTE */}
                <div style={{ flex: 1, paddingLeft: '16px' }}>
                  <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '0.9rem' }}>
                    {apt.patient.name}
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{apt.notes}</div>
                </div>

                {/* HORA */}
                <div style={{ width: '60px', flexShrink: 0, color: '#64748b', fontSize: '0.8rem' }}>
                  {apt.startTime}
                </div>

                {/* MÉDICO */}
                <div style={{ width: '156px', flexShrink: 0, color: '#64748b', fontSize: '0.8rem', paddingRight: '12px' }}>
                  {apt.doctor.name}
                </div>

                {/* ESTADO */}
                <div style={{ width: '100px', flexShrink: 0 }}>
                  <span style={{
                    padding: '4px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '500',
                    background: status.bg, color: status.color, border: `1px solid ${status.border}`,
                    whiteSpace: 'nowrap',
                  }}>
                    {status.label}
                  </span>
                </div>

                {/* ACCIONES */}
                <div style={{ width: '220px', flexShrink: 0, display: 'flex', gap: '6px' }}>
                  {apt.status === 'SCHEDULED' ? (
                    <>
                      <button
                        onClick={() => openCancelModal(apt.id, apt.patient.name)}
                        disabled={actioning}
                        style={actionBtn('#fef2f2', '#dc2626', '#fca5a5', actioning)}
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => navigate('/appointments/create')}
                        disabled={actioning}
                        style={actionBtn('#f0fdfa', '#0d9488', '#99f6e4', actioning)}
                      >
                        Reprogramar
                      </button>
                      <button
                        onClick={() => handleNoShow(apt.id)}
                        disabled={actioning}
                        style={actionBtn('#fff7ed', '#f97316', '#fed7aa', actioning)}
                      >
                        {actioning ? '...' : 'No asistió'}
                      </button>
                    </>
                  ) : (
                    <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>—</span>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* Pagination footer */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '16px 24px', borderTop: '1px solid #f1f5f9',
        }}>
          <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
            Mostrando {total === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, total)} de {total} citas
          </span>
          <div style={{ display: 'flex', gap: '6px' }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)} style={{
                width: '32px', height: '32px', borderRadius: '6px', fontSize: '0.875rem',
                fontWeight: p === page ? '700' : '400',
                background: p === page ? '#0d9488' : '#fff',
                color: p === page ? '#fff' : '#64748b',
                border: p === page ? 'none' : '1px solid #e2e8f0',
                cursor: 'pointer',
              }}>{p}</button>
            ))}
          </div>
        </div>
      </div>

      {cancelModalOpen && cancellingAppointment && (
        <CancelAppointmentModal
          isOpen={cancelModalOpen}
          patientName={cancellingAppointment.patientName}
          appointmentId={cancellingAppointment.id}
          onClose={() => {
            setCancelModalOpen(false);
            setCancellingAppointment(null);
          }}
          onSuccess={() => {
            setCancelModalOpen(false);
            setCancellingAppointment(null);
            loadAppointments();
          }}
        />
      )}
    </div>
  );
};

export default AppointmentsPage;
