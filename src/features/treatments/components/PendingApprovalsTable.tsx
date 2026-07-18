import React from "react";
import DataTable from "../../../components/common/Datatable/Datatable";
import Button from "../../../components/ui/Button/Button";
import { useApproveTreatment } from "../hooks/useTreatments";
import type { Treatment } from "../services/treatment.service";

interface PendingApprovalsTableProps {
  treatments: Treatment[];
  loading: boolean;
  onApproved: () => void;
  onViewDetail: (treatment: Treatment) => void;
}

const PendingApprovalsTable: React.FC<PendingApprovalsTableProps> = ({
  treatments,
  loading,
  onApproved,
  onViewDetail,
}) => {
  const { approve, approvingId } = useApproveTreatment(onApproved);

  const columns = [
    {
      header: "Paciente",
      key: "patient.name",
      sortable: true,
      render: (treatment: Treatment) => treatment.patient?.name ?? "-",
    },
    {
      header: "Médico",
      key: "doctor.name",
      render: (treatment: Treatment) =>
        treatment.doctor ? `Dr. ${treatment.doctor.name}` : "-",
    },
    {
      header: "Fecha",
      key: "createdAt",
      sortable: true,
      render: (treatment: Treatment) => treatment.createdAt?.slice(0, 10) ?? "-",
    },
    {
      header: "Motivo / Descripción",
      key: "description",
      render: (treatment: Treatment) => (
        <span className="truncate">{treatment.description}</span>
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
          <Button
            variant="success"
            style={{ width: "auto" }}
            title="Aprobar"
            isLoading={approvingId === treatment.id}
            onClick={() => approve(treatment.id)}
          >
            {approvingId !== treatment.id && (
              <img
                src="icons/success.svg"
                width={16}
                alt="aprobar"
                style={{ filter: "brightness(0) invert(1)" }}
              />
            )}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      title="Solicitudes pendientes de aprobación"
      columns={columns}
      data={treatments}
      isLoading={loading}
    />
  );
};

export default PendingApprovalsTable;
