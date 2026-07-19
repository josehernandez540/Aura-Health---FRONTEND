import React from "react";
import DataTable from "../../../components/common/Datatable/Datatable";
import Button from "../../../components/ui/Button/Button";
import HoverMenu from "../../../components/ui/HoverMenu/HoverMenu";
import AppointmentFilterBar from "./AppointmentFilterBar";
import { type Appointment } from "../services/appointment.service";
import { type AppointmentListFilters } from "../hooks/useAppointments";
import { hasRole } from "../../../utils/hasRole";

interface AppointmentTableProps {
  appointments: Appointment[];
  loading: boolean;
  onCancel: (appointment: Appointment) => void;
  onReschedule: (appointment: Appointment) => void;
  onNoShow: (appointment: Appointment) => void;
  onComplete: (appointment: Appointment) => void;
  onHistory: (appointment: Appointment) => void;
  filters: AppointmentListFilters;
  onFilterChange: (name: keyof AppointmentListFilters, value: string) => void;
  limit: number;
  onLimitChange: (value: number) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const STATUS_INFO: Record<string, { label: string; className: string }> = {
  SCHEDULED: { label: "Programada", className: "badge status-scheduled" },
  COMPLETED: { label: "Completada", className: "badge status-completed" },
  CANCELLED: { label: "Cancelada", className: "badge status-cancelled" },
  NO_SHOW: { label: "No asistió", className: "badge status-pending" },
};

const AppointmentTable: React.FC<AppointmentTableProps> = ({
  appointments,
  loading,
  onCancel,
  onReschedule,
  onNoShow,
  onComplete,
  onHistory,
  filters,
  onFilterChange,
  limit,
  onLimitChange,
  page,
  totalPages,
  onPageChange,
}) => {
  const canModify = hasRole(["ADMIN", "DOCTOR"]);

  const columns = [
    {
      header: "Paciente",
      key: "patient.name",
    },
    {
      header: "Médico",
      key: "doctor.name",
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
        canModify ? (
          <HoverMenu
            trigger={
              <Button variant="ghost" style={{ width: "auto" }} aria-label="Más acciones">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="5" r="2" />
                  <circle cx="12" cy="12" r="2" />
                  <circle cx="12" cy="19" r="2" />
                </svg>
              </Button>
            }
          >
            <Button
              variant="ghost"
              style={{ width: "auto" }}
              onClick={() => onHistory(appointment)}
            >
              <img src="icons/info.svg" width={16} alt="historial" className="icon-img-color" />
            </Button>

            {appointment.status === "SCHEDULED" && (
              <>
                <Button
                  variant="ghost"
                  style={{ width: "auto" }}
                  onClick={() => onReschedule(appointment)}
                >
                  <img src="icons/date.svg" width={16} alt="reprogramar" className="icon-img-color" />
                </Button>
                <Button
                  variant="ghost"
                  style={{ width: "auto" }}
                  onClick={() => onNoShow(appointment)}
                >
                  <img src="icons/warning.svg" width={16} alt="marcar inasistencia" className="icon-img-color" />
                </Button>
                <Button
                  variant="success"
                  style={{ width: "auto" }}
                  onClick={() => onComplete(appointment)}
                >
                  <img
                    src="icons/success.svg"
                    width={16}
                    alt="marcar como completada"
                    style={{ filter: "brightness(0) invert(1)" }}
                  />
                </Button>
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
              </>
            )}
          </HoverMenu>
        ) : null,
    },
  ];

  return (
    <>
      <AppointmentFilterBar
        filters={filters}
        onChange={onFilterChange}
        limit={limit}
        onLimitChange={onLimitChange}
      />

      <DataTable
        title="Listado de Citas"
        columns={columns}
        data={appointments}
        isLoading={loading}
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </>
  );
};

export default AppointmentTable;
