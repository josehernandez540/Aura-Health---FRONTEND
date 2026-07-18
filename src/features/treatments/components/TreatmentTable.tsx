import React from "react";
import DataTable from "../../../components/common/Datatable/Datatable";
import Button from "../../../components/ui/Button/Button";
import type { Treatment } from "../services/treatment.service";
import { TREATMENT_STATUS_LABEL, TREATMENT_STATUS_BADGE_CLASS } from "./treatmentStatus";

interface TreatmentTableProps {
  treatments: Treatment[];
  loading: boolean;
  onViewDetail: (treatment: Treatment) => void;
}

const TreatmentTable: React.FC<TreatmentTableProps> = ({
  treatments,
  loading,
  onViewDetail,
}) => {
  const columns = [
    {
      header: "Paciente",
      key: "patient.name",
      sortable: true,
      render: (treatment: Treatment) => treatment.patient?.name ?? "-",
    },
    {
      header: "Fecha",
      key: "createdAt",
      sortable: true,
      render: (treatment: Treatment) => treatment.createdAt?.slice(0, 10) ?? "-",
    },
    {
      header: "Médico responsable",
      key: "doctor.name",
      render: (treatment: Treatment) =>
        treatment.doctor ? `Dr. ${treatment.doctor.name}` : "-",
    },
    {
      header: "Estado",
      key: "status",
      render: (treatment: Treatment) => (
        <span className={TREATMENT_STATUS_BADGE_CLASS[treatment.status]}>
          {TREATMENT_STATUS_LABEL[treatment.status]}
        </span>
      ),
    },
    {
      header: "Acciones",
      key: "actions",
      render: (treatment: Treatment) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            style={{ width: "auto" }}
            title="Ver detalle"
            onClick={() => onViewDetail(treatment)}
          >
            <img src="icons/document-search.svg" width={16} alt="ver detalle" className="icon-img-color" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      title="Tratamientos registrados"
      columns={columns}
      data={treatments}
      isLoading={loading}
    />
  );
};

export default TreatmentTable;
