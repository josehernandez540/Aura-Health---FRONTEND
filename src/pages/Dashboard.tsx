import React from "react";
import PageHeader from "../components/common/PageHeader";
import { useDashboard } from "../features/dashboard/hooks/useDashboard";
import type {
  AuditActivityEntry,
  NotificationActivityEntry,
  TodayAppointment,
} from "../features/dashboard/services/dashboard.service";
import "./Dashboard.css";

const STATUS_LABEL: Record<string, string> = {
  SCHEDULED: "Programada",
  COMPLETED: "Completada",
  CANCELLED: "Cancelada",
  NO_SHOW: "No asistió",
};

const STATUS_CLASS: Record<string, string> = {
  SCHEDULED: "status-scheduled",
  COMPLETED: "status-completed",
  CANCELLED: "status-cancelled",
  NO_SHOW: "status-pending",
};

const formatDateTime = (iso: string): string =>
  new Date(iso).toLocaleString("es-CO", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });

interface ActivityMeta {
  icon: string;
  tone: "tone-info" | "tone-success" | "tone-warning" | "tone-danger";
}

const ACTIVITY_META: Record<string, ActivityMeta> = {
  USER_LOGIN: { icon: "user.svg", tone: "tone-info" },
  USER_CREATED: { icon: "user.svg", tone: "tone-success" },
  UPDATE_MY_PROFILE: { icon: "edit.svg", tone: "tone-info" },
  APPOINTMENT_CREATED: { icon: "date.svg", tone: "tone-success" },
  APPOINTMENT_RESCHEDULED: { icon: "date.svg", tone: "tone-warning" },
  APPOINTMENT_CANCELLED: { icon: "danger.svg", tone: "tone-danger" },
  APPOINTMENT_CANCELLED_BY_ADMIN: { icon: "danger.svg", tone: "tone-danger" },
  APPOINTMENT_NO_SHOW: { icon: "warning.svg", tone: "tone-warning" },
  DOCTOR_STATUS_CHANGED: { icon: "user-group.svg", tone: "tone-info" },
  ADMIN_USER_UPDATED: { icon: "edit.svg", tone: "tone-info" },
  ADMIN_USER_STATUS_CHANGED: { icon: "user-group.svg", tone: "tone-info" },
  GENERATE_CLINICAL_REPORT: { icon: "document-chart.svg", tone: "tone-info" },
  GENERATE_CONSOLIDATED_REPORT: { icon: "document-chart.svg", tone: "tone-info" },
  MEDICAL_RECORD_UPLOADED: { icon: "documents.svg", tone: "tone-success" },
  MEDICAL_RECORD_VALIDATED: { icon: "document-search.svg", tone: "tone-success" },
  APPOINTMENT_REMINDER: { icon: "bell.svg", tone: "tone-info" },
  DAILY_AGENDA: { icon: "date.svg", tone: "tone-info" },
};
const DEFAULT_ACTIVITY_META: ActivityMeta = { icon: "info.svg", tone: "tone-info" };

const ACTIVITY_LABEL: Record<string, string> = {
  USER_LOGIN: "Inicio de sesión",
  USER_CREATED: "Cuenta creada",
  UPDATE_MY_PROFILE: "Actualizó su perfil",
  APPOINTMENT_CREATED: "Cita creada",
  APPOINTMENT_RESCHEDULED: "Cita reprogramada",
  APPOINTMENT_CANCELLED: "Cita cancelada",
  APPOINTMENT_CANCELLED_BY_ADMIN: "Cita cancelada por administrador",
  APPOINTMENT_NO_SHOW: "Inasistencia registrada",
  DOCTOR_STATUS_CHANGED: "Estado de médico actualizado",
  ADMIN_USER_UPDATED: "Administrador actualizado",
  ADMIN_USER_STATUS_CHANGED: "Estado de administrador actualizado",
  GENERATE_CLINICAL_REPORT: "Reporte clínico generado",
  GENERATE_CONSOLIDATED_REPORT: "Reporte consolidado generado",
  MEDICAL_RECORD_UPLOADED: "Expediente subido",
  MEDICAL_RECORD_VALIDATED: "Expediente validado",
};

const humanizeAction = (action: string): string =>
  ACTIVITY_LABEL[action] ??
  action
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase());

const StatCard: React.FC<{ icon: string; value: number | string; label: string; accent?: string }> = ({
  icon,
  value,
  label,
  accent,
}) => (
  <div className={`dash-stat-card ${accent ?? ""}`}>
    <img src={`/icons/${icon}`} width={22} alt="" className="icon-img-color" />
    <span className="dash-stat-value">{value}</span>
    <span className="dash-stat-label">{label}</span>
  </div>
);

const TodayAppointmentsCard: React.FC<{ appointments: TodayAppointment[] }> = ({ appointments }) => (
  <div className="dash-card">
    <h3 className="dash-card-title">Citas de hoy</h3>

    {!appointments.length ? (
      <p className="dash-empty">No tienes citas programadas para hoy.</p>
    ) : (
      <ul className="dash-appointment-list">
        {appointments.map((apt) => (
          <li key={apt.id} className="dash-appointment-item">
            <span className="dash-appointment-time">{apt.startTime}</span>
            <span className="dash-appointment-patient">{apt.patient?.name ?? "Paciente"}</span>
            <span className={`dash-appointment-status ${STATUS_CLASS[apt.status] ?? ""}`}>
              {STATUS_LABEL[apt.status] ?? apt.status}
            </span>
          </li>
        ))}
      </ul>
    )}
  </div>
);

const AuditActivityCard: React.FC<{ items: AuditActivityEntry[] }> = ({ items }) => (
  <div className="dash-card">
    <h3 className="dash-card-title">Actividad reciente del sistema</h3>

    {!items.length ? (
      <p className="dash-empty">Aún no hay actividad registrada.</p>
    ) : (
      <ul className="dash-activity-list">
        {items.map((entry) => {
          const meta = ACTIVITY_META[entry.action] ?? DEFAULT_ACTIVITY_META;
          return (
            <li key={entry.id} className="dash-activity-item">
              <span className={`dash-activity-icon ${meta.tone}`}>
                <img src={`/icons/${meta.icon}`} width={14} alt="" />
              </span>
              <div className="dash-activity-body">
                <span className="dash-activity-action">{humanizeAction(entry.action)}</span>
                <span className="dash-activity-meta">
                  {entry.user?.email ?? "Sistema"} · {formatDateTime(entry.createdAt)}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    )}
  </div>
);

const NotificationActivityCard: React.FC<{ items: NotificationActivityEntry[] }> = ({ items }) => (
  <div className="dash-card">
    <h3 className="dash-card-title">Actividad reciente</h3>

    {!items.length ? (
      <p className="dash-empty">No tienes notificaciones recientes.</p>
    ) : (
      <ul className="dash-activity-list">
        {items.map((entry) => {
          const meta = ACTIVITY_META[entry.type] ?? DEFAULT_ACTIVITY_META;
          return (
            <li key={entry.id} className={`dash-activity-item ${entry.isRead ? "" : "is-unread"}`}>
              <span className={`dash-activity-icon ${meta.tone}`}>
                <img src={`/icons/${meta.icon}`} width={14} alt="" />
              </span>
              <div className="dash-activity-body">
                <span className="dash-activity-action">{entry.message}</span>
                <span className="dash-activity-meta">{formatDateTime(entry.createdAt)}</span>
              </div>
              {!entry.isRead && <span className="dash-activity-unread-dot" />}
            </li>
          );
        })}
      </ul>
    )}
  </div>
);

const Dashboard: React.FC = () => {
  const { data, loading } = useDashboard();

  return (
    <div className="dashboard-page">
      <PageHeader title="Panel de Control" subtitle="Resumen general de Aura Health" />

      {loading || !data ? (
        <p className="dash-empty">Cargando panel...</p>
      ) : data.role === "ADMIN" ? (
        <>
          <div className="dash-stats-grid" data-tour="dashboard-stats">
            <StatCard icon="user-group.svg" value={data.stats.totalPatients} label="Pacientes activos" />
            <StatCard icon="identification.svg" value={data.stats.totalDoctors} label="Médicos activos" />
            <StatCard icon="date.svg" value={data.stats.appointmentsToday} label="Citas hoy" />
            <StatCard icon="chart-bar.svg" value={data.stats.appointmentsThisMonth} label="Citas este mes" />
            <StatCard icon="document-search.svg" value={data.stats.completedThisMonth} label="Completadas este mes" accent="accent-green" />
            <StatCard icon="danger.svg" value={data.stats.cancelledThisMonth} label="Canceladas este mes" accent="accent-danger" />
          </div>

          <div className="dash-grid-single">
            <AuditActivityCard items={data.recentActivity} />
          </div>
        </>
      ) : (
        <>
          {data.stats && (
            <div className="dash-stats-grid" data-tour="dashboard-stats">
              <StatCard icon="date.svg" value={data.stats.appointmentsToday} label="Citas hoy" />
              <StatCard icon="chart-bar.svg" value={data.stats.appointmentsThisWeek} label="Citas esta semana" />
              <StatCard icon="document-search.svg" value={data.stats.completedThisMonth} label="Completadas este mes" accent="accent-green" />
              <StatCard icon="warning.svg" value={data.stats.noShowThisMonth} label="Inasistencias este mes" accent="accent-warning" />
              <StatCard icon="chart-pie.svg" value={`${data.stats.attendanceRate}%`} label="Tasa de asistencia" />
            </div>
          )}

          <div className="dash-grid-2">
            <TodayAppointmentsCard appointments={data.todayAppointments} />
            <NotificationActivityCard items={data.recentActivity} />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
