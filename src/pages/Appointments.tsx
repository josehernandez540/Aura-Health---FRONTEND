import React, { useState } from "react";
import PageHeader from "../components/common/PageHeader";
import AppointmentTable from "../features/appointments/components/AppointmentTable";
import AppointmentCalendar from "../features/appointments/components/AppointmentCalendar";
import AppointmentQuickViewModal from "../features/appointments/components/AppointmentQuickViewModal";
import AppointmentHistoryModal from "../features/appointments/components/AppointmentHistoryModal";
import CreateAppointmentModal from "../features/appointments/components/CreateAppointmentModal";
import CancelAppointmentModal from "../features/appointments/components/CancelAppointmentModal";
import RescheduleAppointmentModal from "../features/appointments/components/RescheduleAppointmentModal";
import NoShowAppointmentModal from "../features/appointments/components/NoShowAppointmentModal";
import { useAppointmentsList } from "../features/appointments/hooks/useAppointments";
import {
  rescheduleAppointment,
  type Appointment,
} from "../features/appointments/services/appointment.service";
import { useUIStore } from "../store/ui.store";
import { hasRole } from "../utils/hasRole";

const AppointmentsPage: React.FC = () => {
  const isAdmin = hasRole(["ADMIN"]);
  const canModify = hasRole(["ADMIN", "DOCTOR"]);
  const [view, setView] = useState<"list" | "calendar">("list");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createDate, setCreateDate] = useState<string | undefined>(undefined);
  const [cancelTarget, setCancelTarget] = useState<Appointment | null>(null);
  const [rescheduleTarget, setRescheduleTarget] = useState<Appointment | null>(null);
  const [noShowTarget, setNoShowTarget] = useState<Appointment | null>(null);
  const [quickViewTarget, setQuickViewTarget] = useState<Appointment | null>(null);
  const [historyTargetId, setHistoryTargetId] = useState<string | null>(null);
  const { appointments, loading, fetchAppointments } = useAppointmentsList();
  const showToast = useUIStore((state) => state.showToast);

  const openCreateOnDate = (date: string) => {
    setCreateDate(date);
    setIsCreateOpen(true);
  };

  const handleDropReschedule = async (appointment: Appointment, newDate: string) => {
    try {
      await rescheduleAppointment(appointment.id, {
        newDate,
        newStartTime: appointment.startTime,
        newEndTime: appointment.endTime,
      });
      showToast("Cita reprogramada correctamente", "success");
      fetchAppointments();
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Error al reprogramar la cita";
      showToast(message, "error");
    }
  };

  return (
    <>
      <PageHeader
        title="Gestión de Citas"
        subtitle="Programa citas asignando pacientes a médicos sin conflictos de horario"
        onClick={
          isAdmin
            ? () => {
                setCreateDate(undefined);
                setIsCreateOpen(true);
              }
            : undefined
        }
        textButton="Nueva Cita"
      />

      <div className="appointments-tabs">
        <button
          className={`appointments-tab ${view === "list" ? "active" : ""}`}
          onClick={() => setView("list")}
        >
          Lista
        </button>
        <button
          className={`appointments-tab ${view === "calendar" ? "active" : ""}`}
          onClick={() => setView("calendar")}
        >
          Calendario
        </button>
      </div>

      {view === "list" ? (
        <AppointmentTable
          appointments={appointments}
          loading={loading}
          onCancel={setCancelTarget}
          onReschedule={setRescheduleTarget}
          onNoShow={setNoShowTarget}
          onHistory={(appointment) => setHistoryTargetId(appointment.id)}
        />
      ) : (
        <AppointmentCalendar
          appointments={appointments}
          loading={loading}
          onCreateOnDate={openCreateOnDate}
          onQuickView={setQuickViewTarget}
          onDropReschedule={handleDropReschedule}
        />
      )}

      {isAdmin && (
        <CreateAppointmentModal
          isOpen={isCreateOpen}
          initialDate={createDate}
          onClose={() => setIsCreateOpen(false)}
          onSuccess={fetchAppointments}
        />
      )}

      {canModify && (
        <>
          <CancelAppointmentModal
            isOpen={!!cancelTarget}
            appointmentId={cancelTarget?.id ?? null}
            onClose={() => setCancelTarget(null)}
            onSuccess={fetchAppointments}
          />

          <RescheduleAppointmentModal
            isOpen={!!rescheduleTarget}
            appointment={rescheduleTarget}
            onClose={() => setRescheduleTarget(null)}
            onSuccess={fetchAppointments}
          />

          <NoShowAppointmentModal
            isOpen={!!noShowTarget}
            appointmentId={noShowTarget?.id ?? null}
            onClose={() => setNoShowTarget(null)}
            onSuccess={fetchAppointments}
          />

          <AppointmentHistoryModal
            appointmentId={historyTargetId}
            onClose={() => setHistoryTargetId(null)}
          />
        </>
      )}

      <AppointmentQuickViewModal
        appointment={quickViewTarget}
        onClose={() => setQuickViewTarget(null)}
        onReschedule={(appointment) => {
          setQuickViewTarget(null);
          setRescheduleTarget(appointment);
        }}
        onNoShow={(appointment) => {
          setQuickViewTarget(null);
          setNoShowTarget(appointment);
        }}
        onCancel={(appointment) => {
          setQuickViewTarget(null);
          setCancelTarget(appointment);
        }}
        onHistory={(appointment) => {
          setQuickViewTarget(null);
          setHistoryTargetId(appointment.id);
        }}
      />
    </>
  );
};

export default AppointmentsPage;
