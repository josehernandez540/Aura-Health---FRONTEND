import PageHeader from "../components/common/PageHeader";
import CreateDoctorForm from "../features/doctor/components/CreateDoctorModal";
import {  useState } from 'react';

const DoctorPage = () => {
 const [isModalOpen, setIsModalOpen] = useState(false);


  return (
    <div style={{ paddingBottom: "2rem" }}>
      <PageHeader
        title="Registro de Doctores"
        subtitle="Monitoreo de doctores"
        onClick={() => setIsModalOpen(true)}
        textButton="Crear Medico"
      />

      <CreateDoctorForm 
        isModalOpen={isModalOpen} 
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  );
};

export default DoctorPage;