import React from "react";
import DataTable from "../../../components/common/Datatable/Datatable";
import Button from "../../../components/ui/Button/Button";
import { type Appointment } from "../services/appointment.service";
import { hasRole } from "../../../utils/hasRole";

interface AppointmentTableProps {
  appointments: Appointment[];
  loading: boolean;
  onCancel: (appointment: Appointment) => void;
}

const STATUS_INFO: Record<string, { label: string; className: string }> = {
  SCHEDULED: { label: "Programada", className: "badge status-scheduled" },
  COMPLETED: { label: "Completada", className: "badge status-completed" },
  CANCELLED: { label: "Cancelada", className: "badge status-cancelled" },
  NO_SHOW: { label: "No asistió", className: "badge status-pending" },
};

const AppointmentTable: React.FC<AppointmentTableProps> = ({ appointments, loading, onCancel }) => {
  const canCancel = hasRole(["ADMIN"]);

  const columns = [
    {
      header: "Paciente",
      key: "patient.name",
      sortable: true,
    },
    {
      header: "Médico",
      key: "doctor.name",
      sortable: true,
      render: (appointment: Appointment) => (
        <span>
          {appointment.doctor?.name}
          {appointment.doctor?.specialization && (
            <span className="txt-muted"> · {appointment.doctor.specialization}</span>
          )}
        </span>
      ),
    },
    {
      header: "Fecha",
      key: "date",
      sortable: true,
      render: (appointment: Appointment) => appointment.date.slice(0, 10),
    },
    {
      header: "Hora",
      key: "startTime",
      render: (appointment: Appointment) =>
        `${appointment.startTime} - ${appointment.endTime}`,
    },
    {
      header: "Estado",
      key: "status",
      render: (appointment: Appointment) => {
        const info = STATUS_INFO[appointment.status] ?? {
          label: appointment.status,
          className: "badge",
        };
        return <span className={info.className}>{info.label}</span>;
      },
    },
    {
      header: "Acciones",
      key: "actions",
      render: (appointment: Appointment) =>
        canCancel && appointment.status === "SCHEDULED" ? (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="danger"
              style={{ width: "auto" }}
              onClick={() => onCancel(appointment)}
            >
              <img
                src="icons/close.svg"
                width={16}
                alt="cancelar"
                style={{ filter: "brightness(0) invert(1)" }}
              />
            </Button>
          </div>
        ) : null,
    },
  ];

  return (
    <DataTable
      title="Listado de Citas"
      columns={columns}
      data={appointments}
      isLoading={loading}
    />
  );
};

export default AppointmentTable;
