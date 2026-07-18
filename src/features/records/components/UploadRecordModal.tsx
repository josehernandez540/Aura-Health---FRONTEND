import React, { useEffect, useRef, useState } from "react";
import Modal from "../../../components/ui/Modal/Modal";
import SelectInput from "../../../components/ui/Inputs/SelectInput";
import Button from "../../../components/ui/Button/Button";
import { usePatientsList } from "../../patients/hooks/usePatientsList";
import { useUploadRecord } from "../hooks/useRecords";
import "./uploadRecordModal.css";

interface UploadRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const DOCUMENT_TYPE_OPTIONS = [
  { value: "", label: "Seleccionar tipo..." },
  { value: "HISTORIA_CLINICA", label: "Historia clínica" },
  { value: "EXAMEN", label: "Examen" },
  { value: "DIAGNOSTICO", label: "Diagnóstico" },
];

const UploadRecordModal: React.FC<UploadRecordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { register, handleSubmit, errors, isSubmitting, file, fileError, selectFile, reset } =
    useUploadRecord(() => {
      onClose();
      if (onSuccess) onSuccess();
    });

  const { patients } = usePatientsList();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  const patientOptions = [
    { value: "", label: "Seleccionar paciente..." },
    ...patients
      .filter((p) => p.is_active !== false)
      .map((p) => ({ value: p.id, label: p.name })),
  ];

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) selectFile(dropped);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="📤 Subir PDF Clínico — REQ-09"
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            form="upload-record-form"
            isLoading={isSubmitting}
            disabled={!file}
          >
            Subir PDF
          </Button>
        </>
      }
    >
      <form id="upload-record-form" onSubmit={handleSubmit} className="form-container">
        <SelectInput
          label="Paciente *"
          options={patientOptions}
          {...register("patientId")}
          error={errors.patientId?.message}
        />

        <SelectInput
          label="Tipo de documento"
          options={DOCUMENT_TYPE_OPTIONS}
          {...register("documentType")}
          error={errors.documentType?.message}
        />

        <div className="form-group">
          <label className="form-label">Archivo PDF *</label>

          <div
            className={`file-drop-zone ${isDragOver ? "drag-over" : ""} ${file ? "has-file" : ""}`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
          >
            <img src="icons/documents.svg" alt="" className="file-drop-icon icon-img-color" />
            <p className="file-drop-label">
              {file ? file.name : "Arrastra el PDF aquí o haz clic"}
            </p>
            <p className="file-drop-hint">Solo archivos PDF · Máximo 10 MB</p>

            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              hidden
              onChange={(e) => {
                const selected = e.target.files?.[0];
                if (selected) selectFile(selected);
              }}
            />
          </div>

          {fileError && <span className="form-error">{fileError}</span>}
        </div>
      </form>
    </Modal>
  );
};

export default UploadRecordModal;
