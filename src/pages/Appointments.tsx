import React, { useState } from "react";
import PageHeader from "../components/common/PageHeader";
import AppointmentTable from "../features/appointments/components/AppointmentTable";
import CreateAppointmentModal from "../features/appointments/components/CreateAppointmentModal";
import { useAppointmentsList } from "../features/appointments/hooks/useAppointments";

const AppointmentsPage: React.FC = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { appointments, loading, fetchAppointments } = useAppointmentsList();

  return (
    <>
      <PageHeader
        title="Gestión de Citas"
        subtitle="Programa citas asignando pacientes a médicos sin conflictos de horario"
        onClick={() => setIsCreateOpen(true)}
        textButton="Nueva Cita"
      />

      <AppointmentTable appointments={appointments} loading={loading} />

      <CreateAppointmentModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={fetchAppointments}
      />
    </>
  );
};

export default AppointmentsPage;
