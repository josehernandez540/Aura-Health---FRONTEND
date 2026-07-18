import React, { useState } from "react";
import PageHeader from "../components/common/PageHeader";
import AppointmentTable from "../features/appointments/components/AppointmentTable";
import CreateAppointmentModal from "../features/appointments/components/CreateAppointmentModal";
import CancelAppointmentModal from "../features/appointments/components/CancelAppointmentModal";
import RescheduleAppointmentModal from "../features/appointments/components/RescheduleAppointmentModal";
import NoShowAppointmentModal from "../features/appointments/components/NoShowAppointmentModal";
import { useAppointmentsList } from "../features/appointments/hooks/useAppointments";
import { type Appointment } from "../features/appointments/services/appointment.service";

const AppointmentsPage: React.FC = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<Appointment | null>(null);
  const [rescheduleTarget, setRescheduleTarget] = useState<Appointment | null>(null);
  const [noShowTarget, setNoShowTarget] = useState<Appointment | null>(null);
  const { appointments, loading, fetchAppointments } = useAppointmentsList();

  return (
    <>
      <PageHeader
        title="Gestión de Citas"
        subtitle="Programa citas asignando pacientes a médicos sin conflictos de horario"
        onClick={() => setIsCreateOpen(true)}
        textButton="Nueva Cita"
      />

      <AppointmentTable
        appointments={appointments}
        loading={loading}
        onCancel={setCancelTarget}
        onReschedule={setRescheduleTarget}
        onNoShow={setNoShowTarget}
      />

      <CreateAppointmentModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={fetchAppointments}
      />

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
    </>
  );
};

export default AppointmentsPage;
