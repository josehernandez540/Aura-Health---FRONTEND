import React, { useEffect } from "react";
import Modal from "../../../components/ui/Modal/Modal";
import DateInput from "../../../components/ui/Inputs/DateInput";
import Button from "../../../components/ui/Button/Button";
import SlotGrid from "./SlotGrid";
import {
  useRescheduleAppointment,
  useAvailableSlots,
} from "../hooks/useAppointments";
import { type Appointment } from "../services/appointment.service";

interface RescheduleAppointmentModalProps {
  isOpen: boolean;
  appointment: Appointment | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const RescheduleAppointmentModal: React.FC<RescheduleAppointmentModalProps> = ({
  isOpen,
  appointment,
  onClose,
  onSuccess,
}) => {
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    setValue,
    watch,
    reset,
  } = useRescheduleAppointment(appointment, () => {
    onClose();
    if (onSuccess) onSuccess();
  });

  const newDate = watch("newDate");
  const newStartTime = watch("newStartTime");

  const { slots, loading: loadingSlots } = useAvailableSlots(
    appointment?.doctorId ?? "",
    newDate,
    appointment?.id
  );

  useEffect(() => {
    setValue("newStartTime", "");
    setValue("newEndTime", "");
  }, [newDate, setValue]);

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  const handleSlotClick = (slotTime: string, slotEnd: string) => {
    setValue("newStartTime", slotTime, { shouldValidate: true });
    setValue("newEndTime", slotEnd, { shouldValidate: true });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reprogramar cita"
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            form="reschedule-appointment-form"
            isLoading={isSubmitting}
            disabled={!newStartTime}
          >
            Confirmar reprogramación
          </Button>
        </>
      }
    >
      <form
        id="reschedule-appointment-form"
        onSubmit={handleSubmit}
        className="form-container"
      >
        {appointment && (
          <p className="txt-muted">
            Cita actual: {appointment.date.slice(0, 10)} ·{" "}
            {appointment.startTime} - {appointment.endTime}
          </p>
        )}

        <DateInput
          label="Nueva fecha *"
          {...register("newDate")}
          error={errors.newDate?.message}
        />

        <div>
          <span className="slot-section-label">Horario disponible</span>

          {!newDate ? (
            <div className="slot-placeholder">Selecciona una fecha primero</div>
          ) : (
            <SlotGrid
              slots={slots}
              selectedTime={newStartTime}
              onSelect={handleSlotClick}
              loading={loadingSlots}
            />
          )}

          {errors.newEndTime && (
            <span className="form-error">{errors.newEndTime.message}</span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Motivo de la reprogramación</label>
          <textarea
            className="form-control"
            rows={3}
            placeholder="Descripción breve del motivo (opcional)..."
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

export default RescheduleAppointmentModal;
