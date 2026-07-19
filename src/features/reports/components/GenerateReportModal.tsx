import React from "react";
import Modal from "../../../components/ui/Modal/Modal";
import Button from "../../../components/ui/Button/Button";
import Alert from "../../../components/ui/Alert/Alert";
import ReportFiltersForm from "./ReportFiltersForm";
import ReportSummaryPreview from "./ReportSummaryPreview";
import type { useReportGenerator } from "../hooks/useReportGenerator";

interface GenerateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  generator: ReturnType<typeof useReportGenerator>;
}

const GenerateReportModal: React.FC<GenerateReportModalProps> = ({ isOpen, onClose, generator }) => {
  const {
    register,
    errors,
    doctorOptions,
    patientOptions,
    loadingOptions,
    summary,
    previewLoading,
    generating,
    generateError,
    dismissGenerateError,
    runPreview,
    runGenerate,
  } = generator;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Generar Reporte — Resumen de Citas" size="lg">
      <ReportFiltersForm
        register={register}
        errors={errors}
        doctorOptions={doctorOptions}
        patientOptions={patientOptions}
        loadingOptions={loadingOptions}
      />

      <div className="reports-actions">
        <Button
          type="button"
          variant="secondary"
          isLoading={previewLoading}
          disabled={generating}
          onClick={runPreview}
        >
          Generar vista previa
        </Button>

        <Button
          type="button"
          variant="primary"
          disabled={generating || previewLoading}
          onClick={runGenerate}
        >
          {generating ? "Generando reporte..." : "Generar reporte PDF"}
        </Button>
      </div>

      {generating && (
        <div className="reports-progress" role="status" aria-live="polite">
          <div className="reports-progress-bar">
            <div className="reports-progress-bar-fill" />
          </div>
          <span className="reports-progress-label">
            Consolidando la información y generando el PDF, esto puede tardar unos segundos...
          </span>
        </div>
      )}

      {generateError && (
        <Alert variant="danger">
          <div className="reports-error-content">
            <span>{generateError}</span>
            <button type="button" className="reports-error-dismiss" onClick={dismissGenerateError}>
              Cerrar
            </button>
          </div>
        </Alert>
      )}

      {summary && <ReportSummaryPreview summary={summary} />}
    </Modal>
  );
};

export default GenerateReportModal;
