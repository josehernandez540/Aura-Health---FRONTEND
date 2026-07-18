import React, { useEffect } from "react";
import Modal from "../../../components/ui/Modal/Modal";
import Button from "../../../components/ui/Button/Button";
import { useMarkNoShow } from "../hooks/useAppointments";

interface NoShowAppointmentModalProps {
  isOpen: boolean;
  appointmentId: string | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const NoShowAppointmentModal: React.FC<NoShowAppointmentModalProps> = ({
  isOpen,
  appointmentId,
  onClose,
  onSuccess,
}) => {
  const { register, handleSubmit, errors, isSubmitting, reset } = useMarkNoShow(
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
      title="Marcar inasistencia"
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Volver
          </Button>
          <Button
            type="submit"
            form="no-show-appointment-form"
            isLoading={isSubmitting}
          >
            Confirmar inasistencia
          </Button>
        </>
      }
    >
      <form
        id="no-show-appointment-form"
        onSubmit={handleSubmit}
        className="form-container"
      >
        <div className="form-group">
          <label className="form-label">Motivo (opcional)</label>
          <textarea
            className="form-control"
            rows={4}
            placeholder="Observaciones sobre la inasistencia..."
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

export default NoShowAppointmentModal;
