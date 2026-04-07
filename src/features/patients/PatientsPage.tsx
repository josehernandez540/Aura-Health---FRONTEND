import { useState, useEffect } from 'react';
import { appointmentsService } from '../appointments/appointments.service';
import type { Appointment } from '../appointments/appointments.service';

const ITEMS_PER_PAGE = 9;

const statusConfig = {
  SCHEDULED: { label: 'Pendiente', color: '#f97316', bg: '#fff7ed', border: '#fed7aa' },
  COMPLETED: { label: 'Completada', color: '#0d9488', bg: '#f0fdfa', border: '#99f6e4' },
  CANCELLED: { label: 'Cancelada', color: '#dc2626', bg: '#fef2f2', border: '#fca5a5' },
  NO_SHOW: { label: 'No asistió', color: '#6b7280', bg: '#f9fafb', border: '#e5e7eb' },
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(2);
  return `${day}/${month}/${year}`;
};

const getInitial = (name: string) => name.charAt(0).toUpperCase();

const avatarColors: Record<string, string> = {
  A: '#0d9488', B: '#1d4ed8', C: '#7c3aed', D: '#059669',
  E: '#0891b2', F: '#dc2626', G: '#0d9488', H: '#1e293b',
  I: '#7c3aed', J: '#0d9488', K: '#1d4ed8', L: '#059669',
  M: '#1e293b', N: '#0891b2', O: '#dc2626', P: '#7c3aed',
  Q: '#0d9488', R: '#1d4ed8', S: '#0d9488', T: '#059669',
  U: '#0891b2', V: '#0891b2', W: '#dc2626', X: '#7c3aed',
  Y: '#0d9488', Z: '#1e293b',
};

const PatientsPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await appointmentsService.getAll();
        if (response.success) {
          setAppointments(response.data.items);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Obtener lista única de pacientes
  const patients = Array.from(
    new Map(appointments.map(a => [a.patientId, a.patient])).values()
  );

  // Filtrar citas por paciente seleccionado
  const filteredAppointments = selectedPatient
    ? appointments.filter(a => a.patientId === selectedPatient)
    : appointments;

  const total = filteredAppointments.length;
  const completed = filteredAppointments.filter(a => a.status === 'COMPLETED').length;
  const pending = filteredAppointments.filter(a => a.status === 'SCHEDULED').length;
  const cancelled = filteredAppointments.filter(a => a.status === 'CANCELLED').length;

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  const paginated = filteredAppointments.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const today = new Date().toLocaleDateString('es-CO', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  const selectedPatientData = selectedPatient
    ? patients.find(p => p.id === selectedPatient)
    : null;

  return (
    <div style={{ padding: '32px', fontFamily: 'sans-serif', background: '#f8fafc', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>
          {selectedPatientData ? selectedPatientData.name : 'Pacientes'}
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem', textTransform: 'capitalize' }}>{today}</p>
      </div>

      {/* Lista de pacientes */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <button
          onClick={() => { setSelectedPatient(null); setPage(1); }}
          style={{
            padding: '8px 16px', borderRadius: '8px', fontSize: '0.875rem',
            fontWeight: !selectedPatient ? '600' : '400',
            background: !selectedPatient ? '#0d9488' : '#fff',
            color: !selectedPatient ? '#fff' : '#64748b',
            border: !selectedPatient ? 'none' : '1px solid #e2e8f0',
            cursor: 'pointer',
          }}
        >
          Todos
        </button>
        {patients.map((patient) => (
          <button
            key={patient.id}
            onClick={() => { setSelectedPatient(patient.id); setPage(1); }}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '8px 16px', borderRadius: '8px', fontSize: '0.875rem',
              fontWeight: selectedPatient === patient.id ? '600' : '400',
              background: selectedPatient === patient.id ? '#0d9488' : '#fff',
              color: selectedPatient === patient.id ? '#fff' : '#64748b',
              border: selectedPatient === patient.id ? 'none' : '1px solid #e2e8f0',
              cursor: 'pointer',
            }}
          >
            <div style={{
              width: '24px', height: '24px', borderRadius: '50%',
              background: avatarColors[getInitial(patient.name)] || '#0d9488',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: '700', fontSize: '0.7rem', flexShrink: 0,
            }}>
              {getInitial(patient.name)}
            </div>
            {patient.name}
          </button>
        ))}
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

      {/* Tabla de citas */}
      <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: '600', color: '#0f172a', marginBottom: '2px' }}>Citas</h2>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{pending} citas pendientes</p>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Cargando...</div>
        ) : paginated.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>No hay citas disponibles</div>
        ) : (
          paginated.map((apt, index) => {
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
                  borderRight: `2px solid ${status.color}`,
                  paddingRight: '16px', marginRight: '16px',
                }}>
                  {formatDate(apt.date)}
                </div>

                {/* Info paciente */}
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
                <div style={{ color: '#64748b', fontSize: '0.8rem', marginRight: '24px', minWidth: '160px' }}>
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
          })
        )}

        {/* Footer */}
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

export default PatientsPage;