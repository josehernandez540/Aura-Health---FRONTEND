import React, { useEffect } from "react";
import Modal from "../../../components/ui/Modal/Modal";
import SelectInput from "../../../components/ui/Inputs/SelectInput";
import Button from "../../../components/ui/Button/Button";
import Alert from "../../../components/ui/Alert/Alert";
import { useCreateTreatment } from "../hooks/useTreatments";
import { usePatientsList } from "../../patients/hooks/usePatientsList";
import "./treatmentModal.css";

interface CreateTreatmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CreateTreatmentModal: React.FC<CreateTreatmentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    reset,
    watch,
    medicationFields,
    addMedication,
    removeMedication,
  } = useCreateTreatment(() => {
    onClose();
    if (onSuccess) onSuccess();
  });

  const { patients } = usePatientsList();
  const requiresApproval = watch("requiresApproval");

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  const patientOptions = [
    { value: "", label: "Seleccionar paciente..." },
    ...patients
      .filter((p) => p.is_active !== false)
      .map((p) => ({ value: p.id, label: `${p.name} — ${p.documentNumber}` })),
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nuevo Tratamiento"
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" form="treatment-form" isLoading={isSubmitting}>
            Crear Tratamiento
          </Button>
        </>
      }
    >
      <form id="treatment-form" onSubmit={handleSubmit} className="form-container">
        <SelectInput
          label="Paciente *"
          options={patientOptions}
          {...register("patientId")}
          error={errors.patientId?.message}
        />

        <div className="form-group">
          <label className="form-label">Descripción del tratamiento *</label>
          <textarea
            className="form-control"
            rows={3}
            placeholder="Ej: Tratamiento para infección respiratoria leve"
            {...register("description")}
          />
          {errors.description && (
            <span className="form-error">{errors.description.message}</span>
          )}
        </div>

        <div className="medications-section">
          <div className="medications-section-header">
            <span className="slot-section-label">Medicamentos *</span>
            <Button
              type="button"
              variant="ghost"
              style={{ width: "auto" }}
              onClick={addMedication}
            >
              + Agregar medicamento
            </Button>
          </div>

          {medicationFields.map((field, index) => (
            <div key={field.id} className="medication-row">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Nombre *</label>
                  <input
                    className="form-control"
                    placeholder="Ej: Amoxicilina"
                    {...register(`medications.${index}.name` as const)}
                  />
                  {errors.medications?.[index]?.name && (
                    <span className="form-error">
                      {errors.medications[index]?.name?.message}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Dosis *</label>
                  <input
                    className="form-control"
                    placeholder="Ej: 500mg"
                    {...register(`medications.${index}.dose` as const)}
                  />
                  {errors.medications?.[index]?.dose && (
                    <span className="form-error">
                      {errors.medications[index]?.dose?.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Frecuencia</label>
                  <input
                    className="form-control"
                    placeholder="Ej: Cada 8 horas"
                    {...register(`medications.${index}.frequency` as const)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Duración</label>
                  <input
                    className="form-control"
                    placeholder="Ej: 7 días"
                    {...register(`medications.${index}.duration` as const)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Instrucciones</label>
                <input
                  className="form-control"
                  placeholder="Ej: Tomar con alimentos"
                  {...register(`medications.${index}.instructions` as const)}
                />
              </div>

              {medicationFields.length > 1 && (
                <button
                  type="button"
                  className="back-link medication-remove-btn"
                  onClick={() => removeMedication(index)}
                >
                  Eliminar medicamento
                </button>
              )}
            </div>
          ))}

          {errors.medications?.message && (
            <span className="form-error">{errors.medications.message}</span>
          )}
        </div>

        <div className="form-group requires-approval-group">
          <label className="requires-approval-check">
            <input type="checkbox" {...register("requiresApproval")} />
            ¿Requiere aprobación? (tratamiento especial)
          </label>

          {requiresApproval && (
            <Alert variant="warning">
              Este tratamiento quedará en estado <strong>PENDIENTE_APROBACION</strong> hasta que un
              administrador lo valide.
            </Alert>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default CreateTreatmentModal;
