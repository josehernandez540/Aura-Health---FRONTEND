import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { appointmentsService } from '../appointments/appointments.service';
import type { Appointment } from '../appointments/appointments.service';
import { useAuthStore } from '../auth/authStore';

const statusConfig = {
  SCHEDULED: { label: 'Pendiente', color: '#f97316', bg: '#fff7ed', border: '#fed7aa' },
  COMPLETED: { label: 'Completada', color: '#0d9488', bg: '#f0fdfa', border: '#99f6e4' },
  CANCELLED: { label: 'Cancelada', color: '#dc2626', bg: '#fef2f2', border: '#fca5a5' },
  NO_SHOW: { label: 'No asistió', color: '#6b7280', bg: '#f9fafb', border: '#e5e7eb' },
};

const riskConfig = [
  { label: 'Bajo', color: '#0d9488', bg: '#f0fdfa', border: '#99f6e4' },
  { label: 'Medio', color: '#f97316', bg: '#fff7ed', border: '#fed7aa' },
  { label: 'Alto', color: '#dc2626', bg: '#fef2f2', border: '#fca5a5' },
];

const avatarColors = ['#0d9488', '#6366f1', '#f97316', '#8b5cf6'];

const DAY_LABELS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

const DoctorAgendaPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const { userId } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const aptsRes = await appointmentsService.getAll();
        if (aptsRes.success) {
          setAppointments(aptsRes.data.items);
          const firstApt = aptsRes.data.items[0];
          if (firstApt?.doctor?.name) {
            localStorage.setItem('aura_doctorName', firstApt.doctor.name);
            localStorage.setItem('aura_doctorSpecialization', firstApt.doctor.specialization);
            window.dispatchEvent(new CustomEvent('aura:doctorLoaded'));
          }
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  // 5-day selector starting today
  const today = new Date();
  const days = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return { label: DAY_LABELS[d.getDay()], num: d.getDate() };
  });

  const todayFormatted = today.toLocaleDateString('es-CO', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  const total = appointments.length;
  const completed = appointments.filter(a => a.status === 'COMPLETED').length;
  const pending = appointments.filter(a => a.status === 'SCHEDULED').length;
  const patients = new Set(appointments.map(a => a.patientId)).size;

  const currentAppointment = appointments.find(a => a.status === 'SCHEDULED') ?? null;

  // Last 4 unique patients (preserve encounter order)
  const seenIds = new Set<string>();
  const recentPatients = appointments.filter(a => {
    if (seenIds.has(a.patient.id)) return false;
    seenIds.add(a.patient.id);
    return true;
  }).slice(0, 4);

  return (
    <div style={{ padding: '32px', background: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', margin: 0, marginBottom: '4px' }}>
            Mi Agenda
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', textTransform: 'capitalize', margin: 0 }}>
            {todayFormatted}
          </p>
        </div>

        {/* Day selector */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {days.map((day, i) => (
            <button
              key={i}
              onClick={() => setSelectedDayIndex(i)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: selectedDayIndex === i ? 'none' : '1px solid #e2e8f0',
                background: selectedDayIndex === i ? '#0d9488' : '#fff',
                color: selectedDayIndex === i ? '#fff' : '#64748b',
                cursor: 'pointer',
                fontFamily: 'sans-serif',
                fontSize: '0.8rem',
                fontWeight: selectedDayIndex === i ? '600' : '400',
                textAlign: 'center',
                lineHeight: '1.4',
              }}
            >
              <div>{day.label}</div>
              <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>{day.num}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Stats cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Citas Hoy', value: total, color: '#0d9488' },
          { label: 'Completadas', value: completed, color: '#0d9488' },
          { label: 'Pendientes', value: pending, color: '#f97316' },
          { label: 'Mis Pacientes', value: patients, color: '#6b7280' },
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

      {/* Two-column layout */}
      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>

        {/* Left column — Citas del día */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: '600', color: '#0f172a', margin: 0, marginBottom: '2px' }}>
                Citas del día
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>{total} citas programadas</p>
            </div>

            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Cargando agenda...</div>
            ) : appointments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>No hay citas programadas</div>
            ) : (
              appointments.map((apt, index) => {
                const status = statusConfig[apt.status];
                return (
                  <div key={apt.id} style={{
                    display: 'flex', alignItems: 'center',
                    padding: '16px 24px',
                    background: index % 2 === 0 ? '#fff' : '#f8fafc',
                    borderBottom: '1px solid #f1f5f9',
                  }}>
                    {/* Hora */}
                    <div style={{
                      width: '60px', flexShrink: 0,
                      fontSize: '0.875rem', fontWeight: '600', color: '#0f172a',
                      marginRight: '16px',
                    }}>
                      {apt.startTime}
                    </div>

                    {/* Borde de color por estado */}
                    <div style={{
                      width: '3px', height: '40px', borderRadius: '2px',
                      background: status.color, marginRight: '16px', flexShrink: 0,
                    }} />

                    {/* Info paciente */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '0.9rem' }}>
                        {apt.patient.name}
                      </div>
                      <div style={{ color: '#94a3b8', fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {apt.notes}
                      </div>
                    </div>

                    {/* Badge estado */}
                    <span style={{
                      padding: '4px 12px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: '500',
                      background: status.bg, color: status.color, border: `1px solid ${status.border}`,
                      flexShrink: 0, marginLeft: '12px',
                    }}>
                      {status.label}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right column */}
        <div style={{ width: '320px', flexShrink: 0 }}>

          {/* EN CURSO AHORA */}
          <div style={{ background: '#0d2137', borderRadius: '12px', padding: '24px' }}>
            <div style={{
              fontSize: '0.7rem', fontWeight: '700', color: '#0d9488',
              letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px',
            }}>
              EN CURSO AHORA
            </div>

            {currentAppointment ? (
              <>
                <div style={{ color: '#fff', fontSize: '1.3rem', fontWeight: '700', marginBottom: '4px' }}>
                  {currentAppointment.patient.name}
                </div>
                <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '10px' }}>
                  {currentAppointment.notes}
                </div>
                <div style={{ color: '#fff', fontSize: '0.85rem', marginBottom: '20px' }}>
                  {currentAppointment.startTime} · 30 min
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button style={{
                    flex: 1, padding: '10px 16px', borderRadius: '8px', border: 'none',
                    background: '#0d9488', color: '#fff', fontWeight: '600', fontSize: '0.85rem',
                    cursor: 'pointer', fontFamily: 'sans-serif',
                  }}>
                    Ver historial
                  </button>
                  <button style={{
                    flex: 1, padding: '10px 16px', borderRadius: '8px', border: 'none',
                    background: 'rgba(255,255,255,0.1)', color: '#fff', fontWeight: '600', fontSize: '0.85rem',
                    cursor: 'pointer', fontFamily: 'sans-serif',
                  }}>
                    Agregar nota
                  </button>
                </div>
              </>
            ) : (
              <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Sin citas en curso</div>
            )}
          </div>

          {/* Pacientes Recientes */}
          <div style={{
            background: '#fff', borderRadius: '12px',
            boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
            padding: '24px', marginTop: '16px',
          }}>
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a', margin: 0, marginBottom: '2px' }}>
                Pacientes Recientes
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>Últimas consultas</p>
            </div>

            {recentPatients.map((apt, i) => {
              const risk = riskConfig[i % riskConfig.length];
              const avatarColor = avatarColors[i % avatarColors.length];
              return (
                <div key={apt.patient.id} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  paddingBottom: i < recentPatients.length - 1 ? '12px' : '0',
                  marginBottom: i < recentPatients.length - 1 ? '12px' : '0',
                  borderBottom: i < recentPatients.length - 1 ? '1px solid #f1f5f9' : 'none',
                }}>
                  <div style={{
                    width: '38px', height: '38px', borderRadius: '50%',
                    background: avatarColor, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: '700', fontSize: '0.9rem',
                  }}>
                    {apt.patient.name.charAt(0)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontWeight: '600', color: '#0f172a', fontSize: '0.875rem',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {apt.patient.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{apt.startTime}</div>
                  </div>
                  <span style={{
                    padding: '3px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '500',
                    background: risk.bg, color: risk.color, border: `1px solid ${risk.border}`,
                    flexShrink: 0,
                  }}>
                    {risk.label}
                  </span>
                </div>
              );
            })}

            <div
              onClick={() => navigate('/pacientes')}
              style={{
                color: '#0d9488', fontSize: '0.85rem', fontWeight: '600',
                cursor: 'pointer', marginTop: '16px',
              }}
            >
              Ver todos los pacientes →
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DoctorAgendaPage;
