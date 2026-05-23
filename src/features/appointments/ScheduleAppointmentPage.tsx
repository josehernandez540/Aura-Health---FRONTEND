import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { appointmentsService } from './appointments.service';
import useAvailability from '../../hooks/useAvailability';
import { useAppointments } from '../../hooks/useAppointments';

// ─── Constants ────────────────────────────────────────────────────────────────

const MONTHS_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];
const DAYS_SHORT = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const DAYS_LONG = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00',
];

// ─── Validation schema ────────────────────────────────────────────────────────

const appointmentSchema = z.object({
  doctorId:  z.string().min(1, 'Debe seleccionar un médico'),
  patientId: z.string().min(1, 'Debe seleccionar un paciente'),
  date:      z.string().min(1, 'Debe seleccionar una fecha'),
  startTime: z.string().min(1, 'Debe seleccionar un horario'),
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

const addMinutes = (time: string, mins: number): string => {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + mins;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
};

const toYMD = (year: number, month: number, day: number): string =>
  `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

const dayOfWeekMon = (date: Date): number =>
  date.getDay() === 0 ? 6 : date.getDay() - 1;

const formatLongDate = (year: number, month: number, day: number): string => {
  const d = new Date(year, month, day);
  return `${DAYS_LONG[dayOfWeekMon(d)]}, ${day} de ${MONTHS_ES[month]} ${year}`;
};

const formatSummaryDate = (year: number, month: number, day: number): string => {
  const d = new Date(year, month, day);
  return `${DAYS_SHORT[dayOfWeekMon(d)]} ${day} ${MONTHS_ES[month].slice(0, 3)}`;
};

const to12h = (time: string): string => {
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
};

interface CalendarCell {
  day: number;
  currentMonth: boolean;
  isWeekend: boolean;
}

const buildCalendarCells = (year: number, month: number): CalendarCell[] => {
  const firstDow = new Date(year, month, 1).getDay();
  const offset = firstDow === 0 ? 6 : firstDow - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells: CalendarCell[] = [];

  for (let i = offset - 1; i >= 0; i--) {
    const col = cells.length % 7;
    cells.push({ day: daysInPrevMonth - i, currentMonth: false, isWeekend: col >= 5 });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const col = cells.length % 7;
    cells.push({ day: d, currentMonth: true, isWeekend: col >= 5 });
  }
  let next = 1;
  while (cells.length < 42) {
    const col = cells.length % 7;
    cells.push({ day: next++, currentMonth: false, isWeekend: col >= 5 });
  }
  return cells;
};

// ─── Card wrapper ─────────────────────────────────────────────────────────────

const Card = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{
    background: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
    padding: '24px',
    ...style,
  }}>
    {children}
  </div>
);

// ─── Component ────────────────────────────────────────────────────────────────

const ScheduleAppointmentPage = () => {
  const navigate = useNavigate();

  // ── Data + async state from hook ─────────────────────────────────────────
  const {
    doctors,
    patients,
    appointments,
    isLoading,
    error,
    success,
    setError,
    setSuccess,
    loadData,
    refreshAppointments,
  } = useAppointments();

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ── UI-only state ─────────────────────────────────────────────────────────
  const [isSaving, setIsSaving] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const now = new Date();
  const [calYear, setCalYear] = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth());

  // ── Derived state ─────────────────────────────────────────────────────────

  const selectedDateStr = selectedDay !== null
    ? toYMD(calYear, calMonth, selectedDay)
    : null;

  const { occupiedDates, isSlotAvailable } = useAvailability({
    appointments,
    doctorId: selectedDoctorId,
    selectedDate: selectedDateStr,
  });

  const selectedDoctor  = doctors.find((d) => d.id === selectedDoctorId)  ?? null;
  const selectedPatient = patients.find((p) => p.id === selectedPatientId) ?? null;

  const calendarCells = buildCalendarCells(calYear, calMonth);
  const canConfirm = !!selectedDoctorId && !!selectedPatientId && !!selectedDateStr && !!selectedSlot;

  // ── Handlers ──────────────────────────────────────────────────────────────

  const prevMonth = () => {
    if (calMonth === 0) { setCalYear((y) => y - 1); setCalMonth(11); }
    else setCalMonth((m) => m - 1);
    setSelectedDay(null);
    setSelectedSlot(null);
  };

  const nextMonth = () => {
    if (calMonth === 11) { setCalYear((y) => y + 1); setCalMonth(0); }
    else setCalMonth((m) => m + 1);
    setSelectedDay(null);
    setSelectedSlot(null);
  };

  const selectDay = (day: number) => {
    setSelectedDay(day);
    setSelectedSlot(null);
  };

  const selectSlot = (slot: string) => {
    if (isSlotAvailable(slot)) setSelectedSlot(slot);
  };

  const handleDoctorChange = (id: string) => {
    setSelectedDoctorId(id);
    setSelectedSlot(null);
  };

  const handleConfirm = async () => {
    // Zod validation
    const result = appointmentSchema.safeParse({
      doctorId:  selectedDoctorId,
      patientId: selectedPatientId,
      date:      selectedDateStr,
      startTime: selectedSlot,
    });

    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    setError(null);
    setSuccess(null);
    setIsSaving(true);

    try {
      await appointmentsService.createAppointment({
        doctorId:  selectedDoctorId,
        patientId: selectedPatientId,
        date:      selectedDateStr!,
        startTime: selectedSlot!,
        endTime:   addMinutes(selectedSlot!, 30),
        notes:     '',
      });

      setSuccess('Cita programada exitosamente.');
      setSelectedDoctorId('');
      setSelectedPatientId('');
      setSelectedDay(null);
      setSelectedSlot(null);
      await refreshAppointments();
      setTimeout(() => { navigate('/agenda'); }, 1500);
    } catch (error: unknown) {
      const axiosError = error as {
        response?: {
          status?: number;
          data?: { message?: string; errorCode?: string };
        };
      };

      const status       = axiosError?.response?.status;
      const errorCode    = axiosError?.response?.data?.errorCode;
      const backendMessage = axiosError?.response?.data?.message;

      if (status === 409 || errorCode === 'CONFLICT' || errorCode === 'SCHEDULE_CONFLICT') {
        setError('El horario ya fue reservado. Por favor seleccione otro horario disponible.');
        await refreshAppointments();
        setSelectedSlot(null);
      } else if (status === 400) {
        setError(backendMessage || 'Los datos ingresados no son válidos. Verifique el formulario.');
      } else {
        setError('No se pudo crear la cita. Inténtelo nuevamente.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  // ── Styles ────────────────────────────────────────────────────────────────

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '0.8rem', fontWeight: '600',
    color: '#64748b', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em',
  };

  const selectStyle: React.CSSProperties = {
    width: '100%', padding: '12px', borderRadius: '8px',
    border: '1px solid #e2e8f0', background: '#fff',
    fontSize: '0.875rem', color: '#0f172a', outline: 'none',
    appearance: 'auto',
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div style={{ padding: '32px', background: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700', color: '#0f172a' }}>
            Programar Cita
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '0.875rem', color: '#94a3b8' }}>
            Nueva cita médica
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => navigate('/agenda')}
            style={{
              padding: '10px 20px', borderRadius: '8px', fontSize: '0.875rem', fontWeight: '500',
              background: '#fff', color: '#64748b', border: '1px solid #e2e8f0', cursor: 'pointer',
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!canConfirm || isSaving}
            style={{
              padding: '10px 20px', borderRadius: '8px', fontSize: '0.875rem', fontWeight: '600',
              background: canConfirm && !isSaving ? '#0d9488' : '#94a3b8',
              color: '#fff', border: 'none',
              cursor: canConfirm && !isSaving ? 'pointer' : 'not-allowed',
            }}
          >
            {isSaving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>

      {/* ── Banners ── */}
      {error && (
        <div style={{
          padding: '12px 16px', borderRadius: '8px', background: '#fef2f2',
          border: '1px solid #fca5a5', color: '#dc2626', fontSize: '0.875rem', marginBottom: '20px',
        }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{
          padding: '12px 16px', borderRadius: '8px', background: '#f0fdf4',
          border: '1px solid #bbf7d0', color: '#16a34a', fontSize: '0.875rem', marginBottom: '20px',
        }}>
          {success}
        </div>
      )}

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8', fontSize: '0.875rem' }}>
          Cargando datos...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px', alignItems: 'start' }}>

          {/* ══ LEFT COLUMN ══════════════════════════════════════════════════ */}
          <div>
            <Card>
              {/* Card header */}
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: '#0f172a' }}>
                  Información de la cita
                </h2>
                <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
                  Complete los campos para programar la cita
                </p>
              </div>

              {/* Doctor */}
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Médico</label>
                <select
                  value={selectedDoctorId}
                  onChange={(e) => handleDoctorChange(e.target.value)}
                  style={selectStyle}
                >
                  <option value="">Seleccionar médico...</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} — {d.specialization}
                    </option>
                  ))}
                </select>
              </div>

              {/* Patient */}
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Paciente</label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  style={selectStyle}
                >
                  <option value="">Seleccionar paciente...</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date display */}
              <div style={{ marginBottom: '28px' }}>
                <label style={labelStyle}>Fecha de la cita</label>
                <input
                  type="text"
                  readOnly
                  value={selectedDay !== null ? formatLongDate(calYear, calMonth, selectedDay) : ''}
                  placeholder="Seleccione un día en el calendario..."
                  style={{
                    ...selectStyle,
                    border: selectedDay !== null ? '1px solid #0d9488' : '1px solid #e2e8f0',
                    cursor: 'default',
                    color: selectedDay !== null ? '#0f172a' : '#94a3b8',
                  }}
                />
              </div>

              {/* ── Calendar ── */}
              <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>

                {/* Calendar header */}
                <div style={{
                  background: '#0d2137', display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', padding: '14px 20px',
                }}>
                  <button
                    onClick={prevMonth}
                    style={{
                      background: 'transparent', border: 'none', color: '#fff',
                      fontSize: '1.2rem', cursor: 'pointer', padding: '0 8px', lineHeight: 1,
                    }}
                  >
                    ‹
                  </button>
                  <span style={{ color: '#fff', fontWeight: '600', fontSize: '0.9rem' }}>
                    {MONTHS_ES[calMonth]} {calYear}
                  </span>
                  <button
                    onClick={nextMonth}
                    style={{
                      background: 'transparent', border: 'none', color: '#fff',
                      fontSize: '1.2rem', cursor: 'pointer', padding: '0 8px', lineHeight: 1,
                    }}
                  >
                    ›
                  </button>
                </div>

                {/* Day headers */}
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
                  background: '#f8fafc', borderBottom: '1px solid #e2e8f0',
                }}>
                  {DAYS_SHORT.map((d) => (
                    <div
                      key={d}
                      style={{
                        textAlign: 'center', padding: '10px 0',
                        fontSize: '0.75rem', fontWeight: '600', color: '#94a3b8',
                      }}
                    >
                      {d}
                    </div>
                  ))}
                </div>

                {/* Day cells */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', background: '#fff' }}>
                  {calendarCells.map((cell, idx) => {
                    const dateStr = cell.currentMonth
                      ? toYMD(calYear, calMonth, cell.day)
                      : null;
                    const isSelected   = cell.currentMonth && selectedDay === cell.day;
                    const hasOccupied  = !!dateStr && occupiedDates.has(dateStr) && !!selectedDoctorId;

                    let dayColor = '#0f172a';
                    if (!cell.currentMonth) dayColor = '#cbd5e1';
                    else if (cell.isWeekend) dayColor = '#94a3b8';
                    if (isSelected) dayColor = '#fff';

                    return (
                      <div
                        key={idx}
                        onClick={() => cell.currentMonth && selectDay(cell.day)}
                        style={{
                          padding: '6px 4px',
                          display: 'flex', flexDirection: 'column', alignItems: 'center',
                          cursor: cell.currentMonth ? 'pointer' : 'default',
                          borderBottom: Math.floor(idx / 7) < 5 ? '1px solid #f1f5f9' : 'none',
                        }}
                      >
                        <div style={{
                          width: '32px', height: '32px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          borderRadius: '50%',
                          background: isSelected ? '#0d9488' : 'transparent',
                          color: dayColor,
                          fontSize: '0.875rem',
                          fontWeight: isSelected ? '700' : '400',
                        }}>
                          {cell.day}
                        </div>
                        {hasOccupied && (
                          <div style={{
                            width: '4px', height: '4px', borderRadius: '50%',
                            background: '#dc2626', marginTop: '2px',
                          }} />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Legend */}
                <div style={{
                  display: 'flex', gap: '20px', padding: '12px 20px',
                  borderTop: '1px solid #f1f5f9', background: '#fff',
                }}>
                  {[
                    { color: '#16a34a', label: 'Disponible' },
                    { color: '#dc2626', label: 'Ocupado' },
                    { color: '#0d9488', label: 'Seleccionado' },
                  ].map((item) => (
                    <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{
                        width: '8px', height: '8px', borderRadius: '50%', background: item.color,
                      }} />
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* ══ RIGHT COLUMN ═════════════════════════════════════════════════ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* ── Time slots ── */}
            <Card>
              <h2 style={{ margin: '0 0 4px', fontSize: '1rem', fontWeight: '700', color: '#0f172a' }}>
                Horarios disponibles
              </h2>
              {selectedDateStr ? (
                <p style={{ margin: '0 0 16px', fontSize: '0.8rem', color: '#0d9488', fontWeight: '600' }}>
                  {formatLongDate(calYear, calMonth, selectedDay!)}
                </p>
              ) : (
                <p style={{ margin: '0 0 16px', fontSize: '0.8rem', color: '#94a3b8' }}>
                  Seleccione una fecha en el calendario
                </p>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {TIME_SLOTS.map((slot) => {
                  const isOccupied = !isSlotAvailable(slot);
                  const isChosen   = selectedSlot === slot;

                  let bg = '#fff';
                  let color = '#0f172a';
                  let border = '1px solid #e2e8f0';
                  let badgeBg = '#f0fdf4';
                  let badgeColor = '#16a34a';
                  let badgeLabel = 'Libre';

                  if (isChosen) {
                    bg = '#0d9488'; color = '#fff'; border = 'none';
                    badgeBg = 'rgba(255,255,255,0.2)'; badgeColor = '#fff'; badgeLabel = 'Seleccionado';
                  } else if (isOccupied) {
                    bg = '#fef2f2'; color = '#dc2626'; border = '1px solid #fca5a5';
                    badgeBg = '#fee2e2'; badgeColor = '#dc2626'; badgeLabel = 'Ocupado';
                  }

                  return (
                    <div
                      key={slot}
                      onClick={() => !isOccupied && !!selectedDateStr && selectSlot(slot)}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '10px 14px', borderRadius: '8px',
                        background: bg, border, color,
                        cursor: isOccupied || !selectedDateStr ? 'not-allowed' : 'pointer',
                        opacity: !selectedDateStr ? 0.5 : 1,
                      }}
                    >
                      <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                        {to12h(slot)}
                      </span>
                      <span style={{
                        fontSize: '0.7rem', fontWeight: '600', padding: '2px 8px',
                        borderRadius: '999px', background: badgeBg, color: badgeColor,
                      }}>
                        {badgeLabel}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* ── Summary ── */}
            <div style={{ background: '#0d2137', borderRadius: '12px', padding: '24px', color: '#fff' }}>
              <p style={{
                margin: '0 0 20px', fontSize: '0.7rem', fontWeight: '700',
                color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase',
              }}>
                Resumen de cita
              </p>

              {/* Doctor */}
              <div style={{ marginBottom: '16px' }}>
                <p style={{ margin: '0 0 2px', fontSize: '0.75rem', color: '#94a3b8' }}>Médico</p>
                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '700', color: '#fff' }}>
                  {selectedDoctor ? selectedDoctor.name : '—'}
                </p>
                {selectedDoctor && (
                  <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>
                    {selectedDoctor.specialization}
                  </p>
                )}
              </div>

              {/* Patient */}
              <div style={{ marginBottom: '16px' }}>
                <p style={{ margin: '0 0 2px', fontSize: '0.75rem', color: '#94a3b8' }}>Paciente</p>
                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '700', color: '#fff' }}>
                  {selectedPatient ? selectedPatient.name : 'Sin asignar'}
                </p>
              </div>

              {/* Date & time */}
              <div style={{ marginBottom: '20px' }}>
                <p style={{ margin: '0 0 2px', fontSize: '0.75rem', color: '#94a3b8' }}>Fecha y hora</p>
                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '700', color: '#fff' }}>
                  {selectedDateStr && selectedSlot
                    ? `${formatSummaryDate(calYear, calMonth, selectedDay!)} · ${to12h(selectedSlot)}`
                    : '—'}
                </p>
              </div>

              {/* Duration badge */}
              <div style={{ marginBottom: '20px' }}>
                <span style={{
                  display: 'inline-block', padding: '4px 14px', borderRadius: '999px',
                  background: '#0d9488', color: '#fff', fontSize: '0.75rem', fontWeight: '600',
                }}>
                  30 minutos
                </span>
              </div>

              {/* Confirm button */}
              <button
                onClick={handleConfirm}
                disabled={!canConfirm || isSaving}
                style={{
                  width: '100%', padding: '14px', borderRadius: '8px', border: 'none',
                  background: canConfirm && !isSaving ? '#0d9488' : '#1e3a4a',
                  color: canConfirm && !isSaving ? '#fff' : '#94a3b8',
                  fontSize: '0.9rem', fontWeight: '600',
                  cursor: canConfirm && !isSaving ? 'pointer' : 'not-allowed',
                }}
              >
                {isSaving ? 'Confirmando...' : 'Confirmar Cita'}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleAppointmentPage;
