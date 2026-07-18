import React, { useEffect, useState } from "react";
import Modal from "../../../components/ui/Modal/Modal";
import { getAuditLogs, type AuditLog } from "../../audit/service/audit.service";
import { useUIStore } from "../../../store/ui.store";
import "./appointmentHistory.css";

interface AppointmentHistoryModalProps {
  appointmentId: string | null;
  onClose: () => void;
}

const ACTION_INFO: Record<string, { title: string; icon: string; colorClass: string }> = {
  APPOINTMENT_CREATED: { title: "Creación", icon: "icons/document-plus.svg", colorClass: "created" },
  APPOINTMENT_RESCHEDULED: { title: "Reprogramación", icon: "icons/date.svg", colorClass: "rescheduled" },
  APPOINTMENT_CANCELLED_BY_ADMIN: { title: "Cancelación", icon: "icons/close.svg", colorClass: "cancelled" },
  APPOINTMENT_CANCELLED: { title: "Cancelación", icon: "icons/close.svg", colorClass: "cancelled" },
  APPOINTMENT_NO_SHOW: { title: "Inasistencia", icon: "icons/warning.svg", colorClass: "no-show" },
};

const describeLog = (log: AuditLog): string => {
  const metadata = log.metadata ?? {};

  switch (log.action) {
    case "APPOINTMENT_CREATED":
      return `Cita creada para el ${metadata.date ?? "?"} de ${metadata.startTime ?? "?"} a ${metadata.endTime ?? "?"}.`;
    case "APPOINTMENT_RESCHEDULED":
      return (
        `Reprogramada para el ${metadata.newDate ?? "?"} de ${metadata.newStartTime ?? "?"} a ${metadata.newEndTime ?? "?"}.` +
        (metadata.reason ? ` Motivo: ${metadata.reason}` : "")
      );
    case "APPOINTMENT_CANCELLED_BY_ADMIN":
    case "APPOINTMENT_CANCELLED":
      return `Cita cancelada.${metadata.reason ? ` Motivo: ${metadata.reason}` : ""}`;
    case "APPOINTMENT_NO_SHOW":
      return `Paciente no asistió.${metadata.reason ? ` Motivo: ${metadata.reason}` : ""}`;
    default:
      return log.action;
  }
};

const AppointmentHistoryModal: React.FC<AppointmentHistoryModalProps> = ({
  appointmentId,
  onClose,
}) => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const showToast = useUIStore((state) => state.showToast);

  useEffect(() => {
    if (!appointmentId) return;

    let cancelled = false;

    const fetchHistory = async () => {
      try {
        setLoading(true);
        const data = await getAuditLogs({
          entityType: "APPOINTMENT",
          entityId: appointmentId,
        });
        if (!cancelled) setLogs(data.items);
      } catch (error) {
        if (!cancelled) showToast("Error al cargar el historial de la cita", "error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchHistory();

    return () => {
      cancelled = true;
    };
  }, [appointmentId, showToast]);

  return (
    <Modal
      isOpen={!!appointmentId}
      onClose={onClose}
      title="Historial de la cita"
      size="md"
    >
      {loading ? (
        <p className="history-empty">Cargando...</p>
      ) : logs.length === 0 ? (
        <p className="history-empty">Sin cambios registrados.</p>
      ) : (
        <div className="history-timeline">
          {logs.map((log) => {
            const info = ACTION_INFO[log.action] ?? {
              title: log.action,
              icon: "icons/info.svg",
              colorClass: "",
            };

            return (
              <div key={log.id} className="history-item">
                <span className={`history-icon ${info.colorClass}`}>
                  <img src={info.icon} alt="" />
                </span>
                <div>
                  <p className="history-title">{info.title}</p>
                  <p className="history-meta">
                    {new Date(log.createdAt).toLocaleString("es-CO")}
                    {log.user?.email && ` — por ${log.user.email}`}
                  </p>
                  <p className="history-description">{describeLog(log)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Modal>
  );
};

export default AppointmentHistoryModal;
