import React from "react";
import DataTable from "../../../components/common/Datatable/Datatable";
import { type Appointment } from "../services/appointment.service";

interface AppointmentTableProps {
  appointments: Appointment[];
  loading: boolean;
}

const STATUS_INFO: Record<string, { label: string; className: string }> = {
  SCHEDULED: { label: "Programada", className: "badge status-scheduled" },
  COMPLETED: { label: "Completada", className: "badge status-completed" },
  CANCELLED: { label: "Cancelada", className: "badge status-cancelled" },
  NO_SHOW: { label: "No asistió", className: "badge status-pending" },
};

const AppointmentTable: React.FC<AppointmentTableProps> = ({ appointments, loading }) => {
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
