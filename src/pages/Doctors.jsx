import DoctorDetailModal from "../features/doctor/components/DoctorDetailModal";
import CreateDoctorModal from "../features/doctor/components/CreateDoctorModal";
import MedicoCardsGrid from "../features/doctor/components/MedicoCardsGrid";
import MedicoFilterBar from "../features/doctor/components/MedicoFilterBar";
import EditDoctorModal from "../features/doctor/components/EditDoctorModal";
import { useDoctorDetail } from "../features/doctor/hooks/useDoctorDetail";
import { useMedicos } from "../features/doctor/hooks/useDoctorsList";
import MedicoTable from "../features/doctor/components/MedicoTable";
import PageHeader from "../components/common/PageHeader";
import { useState } from "react";

const DoctorPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { medicos, loading, handleToggleStatus, fetchMedicos } = useMedicos();
  const [selectedId, setSelectedId] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    specialization: "",
    status: "",
  });

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const {
    doctor,
    loading: detailLoading,
    fetchDoctor,
    handleUpdateDoctor,
  } = useDoctorDetail();

  const handleOpenDetail = async (id) => {
    setSelectedId(id);
    await fetchDoctor(id);
    setIsDetailOpen(true);
  };

  const handleOpenEdit = async (id) => {
    setSelectedId(id);
    await fetchDoctor(id);
    setIsEditOpen(true);
  };

  return (
    <>
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
        onView={handleOpenDetail}
        onEdit={handleOpenEdit}
      />

      <MedicoTable
        medicos={medicos}
        loading={loading}
        onToggleStatus={handleToggleStatus}
        onView={handleOpenDetail}
        onEdit={handleOpenEdit}
      />

      <CreateDoctorModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        onSuccess={fetchMedicos}
      />
      <DoctorDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        doctor={doctor}
        loading={detailLoading}
      />

      <EditDoctorModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        doctor={doctor}
        onSubmit={(data) =>
          handleUpdateDoctor(selectedId, data, () => {
            setIsEditOpen(false);
            fetchMedicos();
          })
        }
      />
    </>
  );
};

export default DoctorPage;
