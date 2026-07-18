import React from "react";
import Modal from "../../../components/ui/Modal/Modal";
import Button from "../../../components/ui/Button/Button";
import { type Appointment } from "../services/appointment.service";
import { hasRole } from "../../../utils/hasRole";

interface AppointmentQuickViewModalProps {
  appointment: Appointment | null;
  onClose: () => void;
  onReschedule: (appointment: Appointment) => void;
  onNoShow: (appointment: Appointment) => void;
  onCancel: (appointment: Appointment) => void;
  onHistory: (appointment: Appointment) => void;
}

const STATUS_INFO: Record<string, { label: string; className: string }> = {
  SCHEDULED: { label: "Programada", className: "badge status-scheduled" },
  COMPLETED: { label: "Completada", className: "badge status-completed" },
  CANCELLED: { label: "Cancelada", className: "badge status-cancelled" },
  NO_SHOW: { label: "No asistió", className: "badge status-pending" },
};

const AppointmentQuickViewModal: React.FC<AppointmentQuickViewModalProps> = ({
  appointment,
  onClose,
  onReschedule,
  onNoShow,
  onCancel,
  onHistory,
}) => {
  if (!appointment) return null;

  const canModify = hasRole(["ADMIN", "DOCTOR"]);
  const info = STATUS_INFO[appointment.status] ?? {
    label: appointment.status,
    className: "badge",
  };

  return (
    <Modal isOpen={!!appointment} onClose={onClose} title="Detalle de la cita" size="sm">
      <div className="form-container">
        <p>
          <strong>Paciente:</strong> {appointment.patient?.name}
        </p>
        <p>
          <strong>Médico:</strong> {appointment.doctor?.name}
          {appointment.doctor?.specialization && ` · ${appointment.doctor.specialization}`}
        </p>
        <p>
          <strong>Fecha:</strong> {appointment.date.slice(0, 10)}
        </p>
        <p>
          <strong>Hora:</strong> {appointment.startTime} - {appointment.endTime}
        </p>
        <p>
          <strong>Estado:</strong> <span className={info.className}>{info.label}</span>
        </p>

        {canModify && (
          <div className="flex items-center gap-2" style={{ marginTop: "var(--gap)", flexWrap: "wrap" }}>
            <Button variant="ghost" onClick={() => onHistory(appointment)}>
              Ver historial
            </Button>

            {appointment.status === "SCHEDULED" && (
              <>
                <Button variant="ghost" onClick={() => onReschedule(appointment)}>
                  Reprogramar
                </Button>
                <Button variant="ghost" onClick={() => onNoShow(appointment)}>
                  Marcar inasistencia
                </Button>
                <Button variant="danger" onClick={() => onCancel(appointment)}>
                  Cancelar
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AppointmentQuickViewModal;
