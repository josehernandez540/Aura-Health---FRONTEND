import React from "react";
import Modal from "../../../components/ui/Modal/Modal";
import Button from "../../../components/ui/Button/Button";
import { useUpdateTreatment } from "../hooks/useTreatments";
import type { Treatment } from "../services/treatment.service";
import "./treatmentModal.css";

interface EditTreatmentModalProps {
  treatment: Treatment | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const EditTreatmentModal: React.FC<EditTreatmentModalProps> = ({
  treatment,
  onClose,
  onSuccess,
}) => {
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    medicationFields,
    addMedication,
    removeMedication,
  } = useUpdateTreatment(treatment, () => {
    onClose();
    if (onSuccess) onSuccess();
  });

  return (
    <Modal
      isOpen={!!treatment}
      onClose={onClose}
      title="Editar Tratamiento"
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" form="edit-treatment-form" isLoading={isSubmitting}>
            Guardar Cambios
          </Button>
        </>
      }
    >
      <form id="edit-treatment-form" onSubmit={handleSubmit} className="form-container">
        <div className="info-slot">
          <label>Paciente</label>
          <p>{treatment?.patient?.name ?? "-"}</p>
        </div>

        <div className="form-group">
          <label className="form-label">Descripción del tratamiento *</label>
          <textarea
            className="form-control"
            rows={3}
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
          <label className="form-label">Motivo del cambio *</label>
          <textarea
            className="form-control"
            rows={2}
            placeholder="Ej: Presión arterial no controlada con dosis anterior"
            {...register("reason")}
          />
          {errors.reason && (
            <span className="form-error">{errors.reason.message}</span>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default EditTreatmentModal;
