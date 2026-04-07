import { useState, useEffect } from 'react';
import { appointmentsService } from './appointments.service';
import type { Appointment } from './appointments.service';

const ITEMS_PER_PAGE = 9;

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(2);
  return `${day}/${month}/${year}`;
};

const statusConfig = {
  SCHEDULED: { label: 'Pendiente', color: '#f97316', bg: '#fff7ed', border: '#fed7aa' },
  COMPLETED: { label: 'Completada', color: '#0d9488', bg: '#f0fdfa', border: '#99f6e4' },
  CANCELLED: { label: 'Cancelada', color: '#dc2626', bg: '#fef2f2', border: '#fca5a5' },
  NO_SHOW: { label: 'No asistió', color: '#6b7280', bg: '#f9fafb', border: '#e5e7eb' },
};

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      try {
        const response = await appointmentsService.getAll();
        if (response.success) setAppointments(response.data.items);
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);

  const total = appointments.length;
  const completed = appointments.filter(a => a.status === 'COMPLETED').length;
  const pending = appointments.filter(a => a.status === 'SCHEDULED').length;
  const cancelled = appointments.filter(a => a.status === 'CANCELLED').length;

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  const paginated = appointments.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const today = new Date().toLocaleDateString('es-CO', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div style={{ padding: '32px', fontFamily: 'sans-serif', background: '#f8fafc', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>
          Mis citas
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem', textTransform: 'capitalize' }}>{today}</p>
      </div>

      {/* Stats cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Total citas', value: total, color: '#0d9488' },
          { label: 'Completadas', value: completed, color: '#0d9488' },
          { label: 'Pendientes', value: pending, color: '#f97316' },
          { label: 'Canceladas', value: cancelled, color: '#6b7280' },
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

      {/* Tabla */}
      <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: '600', color: '#0f172a', marginBottom: '2px' }}>Citas</h2>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{pending} citas pendientes</p>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Cargando citas...</div>
        ) : (
          <>
            {paginated.map((apt, index) => {
              const status = statusConfig[apt.status];
              return (
                <div key={apt.id} style={{
                  display: 'flex', alignItems: 'center',
                  padding: '16px 24px',
                  background: index % 2 === 0 ? '#fff' : '#f8fafc',
                  borderBottom: '1px solid #f1f5f9',
                }}>
                  {/* Fecha */}
                  <div style={{
                    width: '80px', flexShrink: 0,
                    fontSize: '0.875rem', fontWeight: '600', color: '#64748b',
                    borderRight: '2px solid #0d9488', paddingRight: '16px', marginRight: '16px',
                  }}>
                    {formatDate(apt.date)}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '0.9rem' }}>
                      {apt.patient.name}
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{apt.notes}</div>
                  </div>

                  {/* Hora */}
                  <div style={{ color: '#64748b', fontSize: '0.8rem', marginRight: '24px' }}>
                    {apt.startTime}
                  </div>

                  {/* Doctor */}
                  <div style={{ color: '#64748b', fontSize: '0.8rem', marginRight: '24px', minWidth: '140px' }}>
                    {apt.doctor.name}
                  </div>

                  {/* Estado */}
                  <span style={{
                    padding: '4px 12px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: '500',
                    background: status.bg, color: status.color, border: `1px solid ${status.border}`,
                  }}>
                    {status.label}
                  </span>
                </div>
              );
            })}
          </>
        )}

        {/* Footer paginación */}
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
    </div>
  );
};

export default AppointmentsPage;