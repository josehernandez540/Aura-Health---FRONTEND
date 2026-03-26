import { useState } from 'react';
import PageHeader from "../components/common/PageHeader";
import CreateDoctorModal from "../features/doctor/components/CreateDoctorModal";
import MedicoTable from "../features/doctor/components/MedicoTable";
import MedicoCardsGrid from "../features/doctor/components/MedicoCardsGrid";
import MedicoFilterBar from "../features/doctor/components/MedicoFilterBar";
import { useMedicos } from "../features/doctor/hooks/useDoctorsList";

const DoctorPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { medicos, loading, handleToggleStatus, fetchMedicos } = useMedicos();
  
  const [filters, setFilters] = useState({
    search: "",
    specialization: "",
    status: ""
  });

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div style={{ padding: "0 1rem 2rem 1rem" }}>
      <PageHeader
        title="Gestión de Medicos"
        subtitle="Panel de administración y monitoreo"
        onClick={() => setIsModalOpen(true)}
        textButton="Nuevo Medico"
      />

      <MedicoFilterBar filters={filters} onChange={handleFilterChange} />

      <MedicoCardsGrid 
        medicos={medicos} 
        filters={filters} 
        loading={loading}
        onToggleStatus={handleToggleStatus}
      />

      <MedicoTable 
        medicos={medicos} 
        loading={loading} 
        onToggleStatus={handleToggleStatus} 
      />

      <CreateDoctorModal 
        isModalOpen={isModalOpen} 
        setIsModalOpen={setIsModalOpen} 
        onSuccess={fetchMedicos} 
      />
    </div>
  );
};

export default DoctorPage;