import React, { useEffect, useMemo, useState } from "react";
import SelectInput from "../../../components/ui/Inputs/SelectInput";
import { useMedicos } from "../../doctor/hooks/useDoctorsList";
import { type Appointment } from "../services/appointment.service";
import { hasRole } from "../../../utils/hasRole";
import { buildMonthGrid, toISODate } from "../utils/calendarGrid";
import "./appointmentCalendar.css";

interface AppointmentCalendarProps {
  appointments: Appointment[];
  loading: boolean;
  onCreateOnDate: (date: string) => void;
  onQuickView: (appointment: Appointment) => void;
  onDropReschedule: (appointment: Appointment, newDate: string) => void;
  onMonthChange: (monthDate: Date) => void;
}

const WEEKDAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const MAX_PILLS_PER_DAY = 3;

const STATUS_CLASS: Record<string, string> = {
  SCHEDULED: "status-scheduled",
  COMPLETED: "status-completed",
  CANCELLED: "status-cancelled",
  NO_SHOW: "status-pending",
};

interface DoctorFilterSelectProps {
  value: string;
  onChange: (doctorId: string) => void;
}

const DoctorFilterSelect: React.FC<DoctorFilterSelectProps> = ({ value, onChange }) => {
  const { medicos } = useMedicos();

  const doctorOptions = [
    { value: "", label: "Todos los médicos" },
    ...medicos.map((m) => ({ value: m.id, label: m.name })),
  ];

  return (
    <div className="calendar-doctor-filter">
      <SelectInput
        value={value}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
        options={doctorOptions}
      />
    </div>
  );
};

const STATUS_LABEL: Record<string, string> = {
  SCHEDULED: "Programada",
  COMPLETED: "Completada",
  CANCELLED: "Cancelada",
  NO_SHOW: "No asistió",
};

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
  appointments,
  loading,
  onCreateOnDate,
  onQuickView,
  onDropReschedule,
  onMonthChange,
}) => {
  const isAdmin = hasRole(["ADMIN"]);
  const canModify = hasRole(["ADMIN", "DOCTOR"]);
  const today = useMemo(() => toISODate(new Date()), []);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [doctorFilter, setDoctorFilter] = useState("");
  const [dragOverDate, setDragOverDate] = useState<string | null>(null);

  useEffect(() => {
    onMonthChange(currentMonth);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMonth]);

  const days = useMemo(() => buildMonthGrid(currentMonth), [currentMonth]);

  const appointmentsByDate = useMemo(() => {
    const map = new Map<string, Appointment[]>();
    appointments
      .filter((a) => !doctorFilter || a.doctorId === doctorFilter)
      .forEach((a) => {
        const key = a.date.slice(0, 10);
        const list = map.get(key) ?? [];
        list.push(a);
        map.set(key, list);
      });
    map.forEach((list) => list.sort((a, b) => a.startTime.localeCompare(b.startTime)));
    return map;
  }, [appointments, doctorFilter]);

  const monthLabel = currentMonth.toLocaleDateString("es-CO", {
    month: "long",
    year: "numeric",
  });

  const goToMonth = (delta: number) => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  };

  const handleDragStart = (e: React.DragEvent, appointment: Appointment) => {
    e.dataTransfer.setData("text/plain", appointment.id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (e: React.DragEvent, dateKey: string, isOutside: boolean) => {
    e.preventDefault();
    setDragOverDate(null);
    if (isOutside || !canModify) return;

    const id = e.dataTransfer.getData("text/plain");
    const appointment = appointments.find((a) => a.id === id);
    if (appointment && appointment.date.slice(0, 10) !== dateKey) {
      onDropReschedule(appointment, dateKey);
    }
  };

  return (
    <div className="custom-card">
      <div className="calendar-header">
        <div className="calendar-nav">
          <button className="calendar-nav-btn" onClick={() => goToMonth(-1)} aria-label="Mes anterior">
            ‹
          </button>
          <span className="calendar-month-label">
            {monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1)}
          </span>
          <button className="calendar-nav-btn" onClick={() => goToMonth(1)} aria-label="Mes siguiente">
            ›
          </button>
        </div>

        {isAdmin && <DoctorFilterSelect value={doctorFilter} onChange={setDoctorFilter} />}
      </div>

      <div className="calendar-scroll">
        <div className="calendar-weekdays">
          {WEEKDAYS.map((wd) => (
            <span key={wd}>{wd}</span>
          ))}
        </div>

        <div className="calendar-grid">
          {days.map((day) => {
            const dateKey = toISODate(day);
            const isOutside = day.getMonth() !== currentMonth.getMonth();
            const isToday = dateKey === today;
            const dayAppointments = appointmentsByDate.get(dateKey) ?? [];
            const visible = dayAppointments.slice(0, MAX_PILLS_PER_DAY);
            const overflow = dayAppointments.length - visible.length;

            return (
              <div
                key={dateKey}
                className={`calendar-cell ${isOutside ? "outside" : ""} ${isToday ? "today" : ""} ${
                  dragOverDate === dateKey ? "drag-over" : ""
                } ${overflow > 0 ? "has-overflow" : ""}`}
                onClick={() => isAdmin && !isOutside && onCreateOnDate(dateKey)}
                onDragOver={(e) => {
                  if (!canModify || isOutside) return;
                  e.preventDefault();
                  setDragOverDate(dateKey);
                }}
                onDragLeave={() => setDragOverDate(null)}
                onDrop={(e) => handleDrop(e, dateKey, isOutside)}
              >
                <span className="calendar-day-number">
                  {isToday && <span className="calendar-today-dot" />}
                  {day.getDate()}
                </span>

                {!loading &&
                  visible.map((appointment) => (
                    <div
                      key={appointment.id}
                      className={`calendar-pill ${STATUS_CLASS[appointment.status] ?? ""}`}
                      draggable={canModify && appointment.status === "SCHEDULED"}
                      onDragStart={(e) => {
                        e.stopPropagation();
                        handleDragStart(e, appointment);
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuickView(appointment);
                      }}
                    >
                      {appointment.startTime} {appointment.patient?.name}
                    </div>
                  ))}

                {overflow > 0 && (
                  <>
                    <span className="calendar-pill-more">+{overflow} más</span>

                    <div className="calendar-day-popover" onClick={(e) => e.stopPropagation()}>
                      <div className="calendar-day-popover-header">
                        {day.toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" })}
                        <span className="count-pill">{dayAppointments.length}</span>
                      </div>
                      <div className="calendar-day-popover-list">
                        {dayAppointments.map((appointment) => (
                          <div
                            key={appointment.id}
                            className={`calendar-pill ${STATUS_CLASS[appointment.status] ?? ""}`}
                            onClick={() => onQuickView(appointment)}
                          >
                            <span>{appointment.startTime} {appointment.patient?.name}</span>
                            <span className="calendar-day-popover-status">
                              {STATUS_LABEL[appointment.status] ?? appointment.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {canModify && (
        <p className="calendar-hint">
          💡 Arrastra las citas entre días para reprogramar
          {isAdmin && " · Click en un día vacío para crear cita"}
        </p>
      )}
    </div>
  );
};

export default AppointmentCalendar;
