import React, { useState } from "react";
import PageHeader from "../components/common/PageHeader";
import CreatePatientModal from "../features/patients/components/CreatePatientModal";

const Patients: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);


  const handleSuccess = () => {
    console.log("Paciente creado con éxito");
  };

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
        onSuccess={handleSuccess}
      />
    </>
  );
};

export default Patients;