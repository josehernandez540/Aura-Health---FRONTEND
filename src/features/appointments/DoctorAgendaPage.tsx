import { useState, useEffect } from 'react';
import { appointmentsService } from '../appointments/appointments.service';
import type { Appointment } from '../appointments/appointments.service';
import { useAuthStore } from '../auth/authStore';
 
const statusConfig = {
  SCHEDULED: { label: 'Pendiente', color: '#f97316', bg: '#fff7ed', border: '#fed7aa' },
  COMPLETED: { label: 'Completada', color: '#0d9488', bg: '#f0fdfa', border: '#99f6e4' },
  CANCELLED: { label: 'Cancelada', color: '#dc2626', bg: '#fef2f2', border: '#fca5a5' },
  NO_SHOW: { label: 'No asistió', color: '#6b7280', bg: '#f9fafb', border: '#e5e7eb' },
};
 
const DoctorAgendaPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { userId } = useAuthStore();
 
  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
      try {
        const response = await appointmentsService.getAll();
        if (response.success) {
          // Filtrar citas del médico logueado por userId
          const myAppointments = response.data.items.filter(
            (apt) => apt.doctor.id === userId || true // muestra todas hasta tener ID del doctor
          );
          setAppointments(response.data.items);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchAppointments();
  }, [userId]);
 
  const today = new Date().toLocaleDateString('es-CO', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
 
  const total = appointments.length;
  const completed = appointments.filter(a => a.status === 'COMPLETED').length;
  const pending = appointments.filter(a => a.status === 'SCHEDULED').length;
  const patients = new Set(appointments.map(a => a.patientId)).size;
 
  const doctorName = appointments[0]?.doctor.name || 'Médico';
  const doctorSpecialization = appointments[0]?.doctor.specialization || '';
 
  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' }}>
 
      {/* Panel izquierdo médico */}
      <div style={{
        width: '200px', minWidth: '200px',
        background: 'linear-gradient(160deg, #0d2137 0%, #0d3351 100%)',
        display: 'flex', flexDirection: 'column', padding: '24px 0',
      }}>
        {/* Info médico */}
        <div style={{ padding: '0 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '50%',
            background: '#0d9488', display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: '#fff', fontWeight: '700',
            fontSize: '1rem', marginBottom: '8px',
          }}>
            {doctorName.charAt(0)}
          </div>
          <div style={{ color: '#ffffff', fontWeight: '600', fontSize: '0.875rem' }}>{doctorName}</div>
          <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{doctorSpecialization}</div>
        </div>
 
        {/* Menú */}
        <nav style={{ flex: 1, padding: '12px 0' }}>
          {[
            { label: 'Mi Agenda', active: true },
            { label: 'Mis Pacientes', active: false },
            { label: 'Historial Clínico', active: false },
            { label: 'Tratamientos', active: false },
            { label: 'Notificaciones', active: false },
          ].map((item) => (
            <div key={item.label} style={{
              padding: '10px 20px', fontSize: '0.875rem',
              color: item.active ? '#ffffff' : '#94a3b8',
              fontWeight: item.active ? '600' : '400',
              background: item.active ? 'rgba(13,148,136,0.25)' : 'transparent',
              borderLeft: item.active ? '3px solid #0d9488' : '3px solid transparent',
              cursor: 'pointer',
            }}>
              {item.label}
            </div>
          ))}
        </nav>
      </div>
 
      {/* Contenido principal */}
      <div style={{ flex: 1, background: '#f8fafc', padding: '32px' }}>
 
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>
              Mi Agenda
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', textTransform: 'capitalize' }}>{today}</p>
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
 
        {/* Lista de citas */}
        <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: '600', color: '#0f172a', marginBottom: '2px' }}>
              Citas del día
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{total} citas programadas</p>
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
 
                  {/* Borde colored */}
                  <div style={{
                    width: '3px', height: '40px', borderRadius: '2px',
                    background: status.color, marginRight: '16px', flexShrink: 0,
                  }} />
 
                  {/* Info paciente */}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '0.9rem' }}>
                      {apt.patient.name}
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{apt.notes}</div>
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
        </div>
      </div>
    </div>
  );
};
 
export default DoctorAgendaPage;