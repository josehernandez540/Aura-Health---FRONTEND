import { useState } from "react";
import PageHeader from "../components/common/PageHeader";
import CreatePatientModal from "../features/patients/components/CreatePatientModal";

const Patients = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <PageHeader
        title="Gestión de Pacientes"
        subtitle="Registro y administración de pacientes"
        onClick={() => setIsOpen(true)}
        textButton="Nuevo Paciente"
      />

      <CreatePatientModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};

export default Patients;