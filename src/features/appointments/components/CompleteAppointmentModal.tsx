import React, { useEffect } from "react";
import Modal from "../../../components/ui/Modal/Modal";
import Button from "../../../components/ui/Button/Button";
import { useCompleteAppointment } from "../hooks/useAppointments";

interface CompleteAppointmentModalProps {
  isOpen: boolean;
  appointmentId: string | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const CompleteAppointmentModal: React.FC<CompleteAppointmentModalProps> = ({
  isOpen,
  appointmentId,
  onClose,
  onSuccess,
}) => {
  const { register, handleSubmit, errors, isSubmitting, reset } = useCompleteAppointment(
    appointmentId,
    () => {
      onClose();
      if (onSuccess) onSuccess();
    }
  );

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Marcar cita como completada"
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Volver
          </Button>
          <Button
            type="submit"
            form="complete-appointment-form"
            isLoading={isSubmitting}
          >
            Confirmar
          </Button>
        </>
      }
    >
      <form
        id="complete-appointment-form"
        onSubmit={handleSubmit}
        className="form-container"
      >
        <div className="form-group">
          <label className="form-label">Notas de cierre (opcional)</label>
          <textarea
            className="form-control"
            rows={4}
            placeholder="Observaciones sobre la consulta..."
            {...register("notes")}
          />
          {errors.notes && (
            <span className="form-error">{errors.notes.message}</span>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default CompleteAppointmentModal;
