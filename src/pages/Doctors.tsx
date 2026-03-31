import React, { useState } from "react";
import DoctorDetailModal from "../features/doctor/components/DoctorDetailModal";
import CreateDoctorModal from "../features/doctor/components/CreateDoctorModal";
import MedicoCardsGrid from "../features/doctor/components/MedicoCardsGrid";
import MedicoFilterBar, { type MedicoFilters } from "../features/doctor/components/MedicoFilterBar";
import EditDoctorModal from "../features/doctor/components/EditDoctorModal";
import { useDoctorDetail } from "../features/doctor/hooks/useDoctorDetail";
import { useMedicos } from "../features/doctor/hooks/useDoctorsList";
import MedicoTable from "../features/doctor/components/MedicoTable";
import PageHeader from "../components/common/PageHeader";

const DoctorPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);

  const { medicos, loading, handleToggleStatus, fetchMedicos } = useMedicos();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [filters, setFilters] = useState<MedicoFilters>({
    search: "",
    specialization: "",
    status: "",
  });

  const handleFilterChange = (name: keyof MedicoFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const {
    doctor,
    loading: detailLoading,
    fetchDoctor,
    handleUpdateDoctor,
  } = useDoctorDetail();

  const handleOpenDetail = async (id: string) => {
    setSelectedId(id);
    setIsDetailOpen(true);
    await fetchDoctor(id);
  };

  const handleOpenEdit = async (id: string) => {
    setSelectedId(id);
    setIsEditOpen(true);
    await fetchDoctor(id);
  };

  return (
    <>
      <PageHeader
        title="Gestión de Médicos"
        subtitle="Panel de administración y monitoreo de personal de salud"
        onClick={() => setIsModalOpen(true)}
        textButton="Nuevo Médico"
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
        onSubmit={(data) => {
          if (selectedId) {
            handleUpdateDoctor(selectedId, data, () => {
              setIsEditOpen(false);
              fetchMedicos();
            });
          }
        }}
      />
    </>
  );
};

export default DoctorPage;