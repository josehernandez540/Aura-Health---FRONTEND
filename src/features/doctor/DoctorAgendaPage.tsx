import { useState, useEffect } from 'react';
import { doctorService } from './doctor.service';
import type { Appointment, RecentPatient } from './doctor.service';

// --- CONFIGURACIÓN DE ESTILOS Y COLORES ---
const avatarColors: Record<string, string> = {
  A: '#0d9488', B: '#1d4ed8', C: '#7c3aed', D: '#059669',
  E: '#0891b2', F: '#dc2626', G: '#0d9488', H: '#1e293b',
  I: '#7c3aed', J: '#0d9488', K: '#1d4ed8', L: '#059669',
  M: '#1e293b', N: '#0891b2', O: '#dc2626', P: '#7c3aed',
  Q: '#0d9488', R: '#1d4ed8', S: '#0d9488', T: '#059669',
  U: '#0891b2', V: '#0891b2', W: '#dc2626', X: '#7c3aed',
  Y: '#0d9488', Z: '#1e293b',
};

const getInitial = (name: string) => name.charAt(0).toUpperCase();

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
  completed:   { bg: '#f0fdf4', text: '#16a34a', label: 'Completada' },
  in_progress: { bg: '#f0fdfa', text: '#0d9488', label: 'En curso'   },
  pending:     { bg: '#fffbeb', text: '#d97706', label: 'Pendiente'  },
  cancelled:   { bg: '#fef2f2', text: '#dc2626', label: 'Cancelada'  },
};

const dias = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'];

const formatHour = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false });
};

const formatDate = () => {
  return new Date().toLocaleDateString('es-CO', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
};

const DoctorAgendaPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [recentPatients, setRecentPatients] = useState<RecentPatient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [diaActivo, setDiaActivo] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const [apptRes, patientsRes] = await Promise.all([
          doctorService.getTodayAppointments(),
          doctorService.getRecentPatients(),
        ]);
        if (apptRes.success) setAppointments(apptRes.data.items);
        if (patientsRes.success) setRecentPatients(patientsRes.data.items);
      } catch (err) {
        setErrorMessage('No se pudo cargar la información. Intenta de nuevo.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const completed  = appointments.filter(a => a.status === 'completed').length;
  const pending    = appointments.filter(a => a.status === 'pending').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', fontFamily: 'sans-serif', background: '#f8fafc' }}>

      {/* --- TOPBAR --- */}
      <header style={{ 
        background: '#fff', 
        borderBottom: '1px solid #e2e8f0', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '0 32px', 
        height: '72px', 
        flexShrink: 0 
      }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 600, color: '#0f172a', margin: 0 }}>Mi Agenda</h1>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0 0', textTransform: 'capitalize' }}>{formatDate()}</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {dias.map((dia, i) => (
            <button key={dia} onClick={() => setDiaActivo(i)} style={{
              padding: '8px 16px', borderRadius: '10px', fontSize: '13px', border: 'none', cursor: 'pointer',
              background: diaActivo === i ? '#0d9488' : '#f1f5f9',
              color: diaActivo === i ? '#fff' : '#94a3b8',
              fontWeight: diaActivo === i ? 600 : 400,
              transition: 'all 0.2s'
            }}>{dia}</button>
          ))}
        </div>
      </header>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <div style={{ padding: '32px', flex: 1 }}>
        
        {errorMessage && (
          <div style={{ padding: '12px 16px', borderRadius: '8px', background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626', fontSize: '0.875rem', marginBottom: '24px' }}>
            {errorMessage}
          </div>
        )}

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          {[
            { label: 'Citas Hoy',     value: appointments.length, color: '#0d9488' },
            { label: 'Completadas',   value: completed,            color: '#16a34a' },
            { label: 'Pendientes',    value: pending,              color: '#f59e0b' },
            { label: 'Pacientes Totales', value: recentPatients.length, color: '#7c3aed' },
          ].map((stat) => (
            <div key={stat.label} style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '4px', height: '40px', borderRadius: '2px', background: stat.color }} />
              <div>
                <p style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', margin: 0 }}>{isLoading ? '...' : stat.value}</p>
                <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' }}>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Layout de Dos Columnas */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          
          {/* Listado de Citas */}
          <section style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', marginBottom: '20px' }}>Próximas Citas</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {appointments.length > 0 ? (
                appointments.map((appt) => (
                  <div key={appt.id} style={{ display: 'flex', alignItems: 'center', padding: '16px', border: '1px solid #f1f5f9', borderRadius: '12px', gap: '16px' }}>
                    <div style={{ background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', textAlign: 'center', minWidth: '65px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: '#0d9488' }}>{formatHour(appt.start_time)}</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: '14px', color: '#1e293b' }}>{appt.patient_name}</p>
                      <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>{appt.reason}</p>
                    </div>
                    <span style={{ 
                      padding: '6px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase',
                      background: statusConfig[appt.status]?.bg || '#f1f5f9', 
                      color: statusConfig[appt.status]?.text || '#64748b' 
                    }}>
                      {statusConfig[appt.status]?.label || appt.status}
                    </span>
                  </div>
                ))
              ) : (
                <p style={{ color: '#94a3b8', fontSize: '14px', textAlign: 'center', padding: '20px' }}>No hay citas para mostrar.</p>
              )}
            </div>
          </section>

          {/* Pacientes Recientes */}
          <section style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', marginBottom: '20px' }}>Pacientes Recientes</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {recentPatients.map((patient) => (
                <div key={patient.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ 
                    width: '40px', height: '40px', borderRadius: '50%', 
                    background: avatarColors[getInitial(patient.full_name)] || '#0d9488',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600, fontSize: '14px'
                  }}>
                    {getInitial(patient.full_name)}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>{patient.full_name}</p>
                    <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#94a3b8' }}>Última visita: {new Date(patient.last_visit).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default DoctorAgendaPage;
