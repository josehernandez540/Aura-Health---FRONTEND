import React, { useState } from "react";
import PageHeader from "../components/common/PageHeader";
import RecordTable from "../features/records/components/RecordTable";
import RecordFilterBar, {
  type RecordFilters,
} from "../features/records/components/RecordFilterBar";
import UploadRecordModal from "../features/records/components/UploadRecordModal";
import { useRecordsList } from "../features/records/hooks/useRecords";
import { hasRole } from "../utils/hasRole";

const RecordsPage: React.FC = () => {
  const isAdmin = hasRole(["ADMIN"]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [filters, setFilters] = useState<RecordFilters>({
    search: "",
    documentType: "",
  });

  const { records, loading, fetchRecords } = useRecordsList(filters);

  const handleFilterChange = (key: keyof RecordFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <PageHeader
        title="Historial Clínico"
        subtitle="REQ-09 Almacenamiento PDF · REQ-10 Consulta"
        onClick={isAdmin ? () => setIsUploadOpen(true) : undefined}
        textButton="Subir PDF"
      />

      <RecordFilterBar filters={filters} onChange={handleFilterChange} />

      <RecordTable records={records} loading={loading} onValidated={fetchRecords} />

      {isAdmin && (
        <UploadRecordModal
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          onSuccess={fetchRecords}
        />
      )}
    </>
  );
};

export default RecordsPage;
