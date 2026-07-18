import React from "react";
import DataTable from "../../../components/common/Datatable/Datatable";
import Button from "../../../components/ui/Button/Button";
import { hasRole } from "../../../utils/hasRole";
import { useUIStore } from "../../../store/ui.store";
import { useValidateRecord } from "../hooks/useRecords";
import {
  downloadMedicalRecordFile,
  type MedicalRecord,
} from "../services/record.service";

interface RecordTableProps {
  records: MedicalRecord[];
  loading: boolean;
  onValidated: () => void;
}

const DOCUMENT_TYPE_LABEL: Record<string, string> = {
  HISTORIA_CLINICA: "Historia clínica",
  EXAMEN: "Examen",
  DIAGNOSTICO: "Diagnóstico",
};

const RecordTable: React.FC<RecordTableProps> = ({ records, loading, onValidated }) => {
  const isAdmin = hasRole(["ADMIN"]);
  const showToast = useUIStore((state) => state.showToast);
  const { validate, validatingId } = useValidateRecord(onValidated);

  const openFile = async (record: MedicalRecord, mode: "view" | "download") => {
    try {
      const blob = await downloadMedicalRecordFile(record.id);
      const url = URL.createObjectURL(blob);

      if (mode === "view") {
        window.open(url, "_blank");
      } else {
        const link = document.createElement("a");
        link.href = url;
        link.download = record.fileName ?? "documento.pdf";
        link.click();
      }

      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (error) {
      showToast("Error al abrir el archivo", "error");
    }
  };

  const columns = [
    { header: "Paciente", key: "patientName", sortable: true },
    {
      header: "Tipo",
      key: "documentType",
      render: (record: MedicalRecord) => (
        <span className="badge badge-gray">
          {record.documentType ? DOCUMENT_TYPE_LABEL[record.documentType] : "-"}
        </span>
      ),
    },
    {
      header: "Archivo",
      key: "fileName",
      render: (record: MedicalRecord) => (
        <span className="flex items-center gap-2">
          <img src="icons/documents.svg" width={16} alt="" className="icon-img-color" />
          {record.fileName ?? "-"}
        </span>
      ),
    },
    {
      header: "Subido por",
      key: "uploadedBy.name",
      render: (record: MedicalRecord) => record.uploadedBy?.name ?? "-",
    },
    {
      header: "Fecha",
      key: "createdAt",
      sortable: true,
      render: (record: MedicalRecord) => record.createdAt.slice(0, 10),
    },
    {
      header: "Integridad",
      key: "isValidated",
      render: (record: MedicalRecord) =>
        record.isValidated ? (
          <span className="badge status-completed">✓ Válido</span>
        ) : (
          <span className="badge status-pending">⚠ Pendiente validar</span>
        ),
    },
    {
      header: "Acciones",
      key: "actions",
      render: (record: MedicalRecord) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            style={{ width: "auto" }}
            title="Ver"
            onClick={() => openFile(record, "view")}
          >
            <img src="icons/document-search.svg" width={16} alt="ver" className="icon-img-color" />
          </Button>
          <Button
            variant="ghost"
            style={{ width: "auto" }}
            title="Descargar"
            onClick={() => openFile(record, "download")}
          >
            <img src="icons/arrow-down.svg" width={16} alt="descargar" className="icon-img-color" />
          </Button>
          {isAdmin && !record.isValidated && (
            <Button
              variant="success"
              style={{ width: "auto" }}
              title="Validar"
              isLoading={validatingId === record.id}
              onClick={() => validate(record.id)}
            >
              {validatingId !== record.id && (
                <img
                  src="icons/success.svg"
                  width={16}
                  alt="validar"
                  style={{ filter: "brightness(0) invert(1)" }}
                />
              )}
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <DataTable
      title="Registros clínicos"
      columns={columns}
      data={records}
      isLoading={loading}
    />
  );
};

export default RecordTable;
