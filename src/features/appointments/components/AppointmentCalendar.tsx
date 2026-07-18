import React, { useMemo, useState } from "react";
import SelectInput from "../../../components/ui/Inputs/SelectInput";
import { useMedicos } from "../../doctor/hooks/useDoctorsList";
import { type Appointment } from "../services/appointment.service";
import { hasRole } from "../../../utils/hasRole";
import "./appointmentCalendar.css";

interface AppointmentCalendarProps {
  appointments: Appointment[];
  loading: boolean;
  onCreateOnDate: (date: string) => void;
  onQuickView: (appointment: Appointment) => void;
  onDropReschedule: (appointment: Appointment, newDate: string) => void;
}

const WEEKDAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const MAX_PILLS_PER_DAY = 3;

const STATUS_CLASS: Record<string, string> = {
  SCHEDULED: "status-scheduled",
  COMPLETED: "status-completed",
  CANCELLED: "status-cancelled",
  NO_SHOW: "status-pending",
};

const pad = (n: number) => String(n).padStart(2, "0");
const toISODate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const buildMonthGrid = (monthDate: Date): Date[] => {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const startOffset = (firstOfMonth.getDay() + 6) % 7; // Monday = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;

  const gridStart = new Date(year, month, 1 - startOffset);
  return Array.from({ length: totalCells }, (_, i) => {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    return d;
  });
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

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
  appointments,
  loading,
  onCreateOnDate,
  onQuickView,
  onDropReschedule,
}) => {
  const isAdmin = hasRole(["ADMIN"]);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [doctorFilter, setDoctorFilter] = useState("");
  const [dragOverDate, setDragOverDate] = useState<string | null>(null);

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
    if (isOutside) return;

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

      <div className="calendar-weekdays">
        {WEEKDAYS.map((wd) => (
          <span key={wd}>{wd}</span>
        ))}
      </div>

      <div className="calendar-grid">
        {days.map((day) => {
          const dateKey = toISODate(day);
          const isOutside = day.getMonth() !== currentMonth.getMonth();
          const dayAppointments = appointmentsByDate.get(dateKey) ?? [];
          const visible = dayAppointments.slice(0, MAX_PILLS_PER_DAY);
          const overflow = dayAppointments.length - visible.length;

          return (
            <div
              key={dateKey}
              className={`calendar-cell ${isOutside ? "outside" : ""} ${
                dragOverDate === dateKey ? "drag-over" : ""
              }`}
              onClick={() => isAdmin && !isOutside && onCreateOnDate(dateKey)}
              onDragOver={(e) => {
                if (!isAdmin || isOutside) return;
                e.preventDefault();
                setDragOverDate(dateKey);
              }}
              onDragLeave={() => setDragOverDate(null)}
              onDrop={(e) => isAdmin && handleDrop(e, dateKey, isOutside)}
            >
              <span className="calendar-day-number">{day.getDate()}</span>

              {!loading &&
                visible.map((appointment) => (
                  <div
                    key={appointment.id}
                    className={`calendar-pill ${STATUS_CLASS[appointment.status] ?? ""}`}
                    draggable={isAdmin && appointment.status === "SCHEDULED"}
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

              {overflow > 0 && <span className="calendar-pill-more">+{overflow} más</span>}
            </div>
          );
        })}
      </div>

      {isAdmin && (
        <p className="calendar-hint">
          💡 Arrastra las citas entre días para reprogramar · Click en un día vacío para crear cita
        </p>
      )}
    </div>
  );
};

export default AppointmentCalendar;
