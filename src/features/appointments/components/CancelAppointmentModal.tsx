import React, { useEffect } from "react";
import Modal from "../../../components/ui/Modal/Modal";
import Button from "../../../components/ui/Button/Button";
import { useCancelAppointment } from "../hooks/useAppointments";

interface CancelAppointmentModalProps {
  isOpen: boolean;
  appointmentId: string | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const CancelAppointmentModal: React.FC<CancelAppointmentModalProps> = ({
  isOpen,
  appointmentId,
  onClose,
  onSuccess,
}) => {
  const { register, handleSubmit, errors, isSubmitting, reset } =
    useCancelAppointment(appointmentId, () => {
      onClose();
      if (onSuccess) onSuccess();
    });

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cancelar cita"
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Volver
          </Button>
          <Button
            type="submit"
            form="cancel-appointment-form"
            variant="danger"
            isLoading={isSubmitting}
          >
            Confirmar cancelación
          </Button>
        </>
      }
    >
      <form
        id="cancel-appointment-form"
        onSubmit={handleSubmit}
        className="form-container"
      >
        <div className="form-group">
          <label className="form-label">Motivo de cancelación</label>
          <textarea
            className={`form-control ${errors.reason ? "is-invalid" : ""}`}
            rows={4}
            placeholder="Explica por qué se cancela esta cita (mínimo 10 caracteres)..."
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

export default CancelAppointmentModal;
