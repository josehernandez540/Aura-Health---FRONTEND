import React, { useState, useMemo } from "react";
import PageHeader from "../components/common/PageHeader";
import PatientTable from "../features/patients/components/PatientTable";
import EditPatientModal from "../features/patients/components/EditPatientModal";
import CreatePatientModal from "../features/patients/components/CreatePatientModal";
import PatientFilterBar, { type PatientFilters } from "../features/patients/components/PatientFilterBar";
import { usePatientsList } from "../features/patients/hooks/usePatientsList";
import { type Patient } from "../features/patients/services/patient.services";
import { getPatientById } from "../features/patients/services/patient.services";

const PatientsPage: React.FC = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const [filters, setFilters] = useState<PatientFilters>({
    search: "",
    status: "",
  });

  const { patients, loading, handleToggleStatus, fetchPatients } = usePatientsList();


  const handleFilterChange = (name: keyof PatientFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      const searchTerm = filters.search.toLowerCase();

      const name = (p.name || "").toLowerCase();
      const document = (p.document_number || "").toLowerCase();
      const email = (p.email || "").toLowerCase();

      const matchesSearch =
        name.includes(searchTerm) ||
        document.includes(searchTerm) ||
        email.includes(searchTerm);

      const matchesStatus =
        filters.status === "" ? true :
          filters.status === "active" ? p.is_active : !p.is_active;

      return matchesSearch && matchesStatus;
    });
  }, [patients, filters]);

  const handleOpenEdit = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsEditOpen(true);
  };

  return (
    <>
      <PageHeader
        title="Gestión de Pacientes"
        subtitle="Administra la información y el estado de los pacientes"
        onClick={() => setIsCreateOpen(true)}
        textButton="Nuevo Paciente"
      />

      <PatientFilterBar filters={filters} onChange={handleFilterChange} />

      <PatientTable
        patients={filteredPatients}
        loading={loading}
        onToggleStatus={handleToggleStatus}
        onEdit={handleOpenEdit}
      />

      <CreatePatientModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={fetchPatients}
      />

      <EditPatientModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        patient={selectedPatient}
        onSuccess={fetchPatients}
      />
    </>
  );
};

export default PatientsPage;