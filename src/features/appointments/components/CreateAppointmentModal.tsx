import React, { useEffect } from "react";
import Modal from "../../../components/ui/Modal/Modal";
import SelectInput from "../../../components/ui/Inputs/SelectInput";
import DateInput from "../../../components/ui/Inputs/DateInput";
import Button from "../../../components/ui/Button/Button";
import { useCreateAppointment, useAvailableSlots } from "../hooks/useAppointments";
import { useMedicos } from "../../doctor/hooks/useDoctorsList";
import { usePatientsList } from "../../patients/hooks/usePatientsList";
import "./appointmentModal.css";

interface CreateAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CreateAppointmentModal: React.FC<CreateAppointmentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { register, handleSubmit, errors, isSubmitting, setValue, watch, reset } =
    useCreateAppointment(() => {
      onClose();
      if (onSuccess) onSuccess();
    });

  const { medicos } = useMedicos();
  const { patients } = usePatientsList();

  const doctorId = watch("doctorId");
  const date = watch("date");
  const startTime = watch("startTime");

  const { slots, loading: loadingSlots } = useAvailableSlots(doctorId, date);

  useEffect(() => {
    setValue("startTime", "");
    setValue("endTime", "");
  }, [doctorId, date, setValue]);

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  const handleSlotClick = (slotTime: string, slotEnd: string) => {
    setValue("startTime", slotTime, { shouldValidate: true });
    setValue("endTime", slotEnd, { shouldValidate: true });
  };

  const doctorOptions = [
    { value: "", label: "Seleccionar médico..." },
    ...medicos
      .filter((m) => m.is_active)
      .map((m) => ({ value: m.id, label: m.name })),
  ];

  const patientOptions = [
    { value: "", label: "Seleccionar paciente..." },
    ...patients
      .filter((p) => p.is_active !== false)
      .map((p) => ({ value: p.id, label: p.name })),
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Agenda una cita"
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            form="appointment-form"
            isLoading={isSubmitting}
            disabled={!startTime}
          >
            Crear Cita
          </Button>
        </>
      }
    >
      <form
        id="appointment-form"
        onSubmit={handleSubmit}
        className="form-container"
      >
        

        <div className="form-grid">
          <SelectInput
            label="Paciente *"
            options={patientOptions}
            {...register("patientId")}
            error={errors.patientId?.message}
          />

          <SelectInput
            label="Médico *"
            options={doctorOptions}
            {...register("doctorId")}
            error={errors.doctorId?.message}
          />
        </div>

        <DateInput
          label="Fecha *"
          {...register("date")}
          error={errors.date?.message}
        />

        <div>
          <span className="slot-section-label">Horario disponible</span>

          {!doctorId || !date ? (
            <div className="slot-placeholder">
              Selecciona el médico y el dia primero 
            </div>
          ) : (
            <>
              <div className="slot-grid">
                {slots.map((slot) => (
                  <button
                    key={slot.time}
                    type="button"
                    disabled={slot.status === "occupied" || loadingSlots}
                    className={`slot-btn ${
                      slot.status === "occupied"
                        ? "occupied"
                        : startTime === slot.time
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => handleSlotClick(slot.time, slot.endTime)}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>

              <div className="slot-legend">
                <span>
                  <span className="slot-legend-dot occupied" />
                  Ocupado
                </span>
                <span>
                  <span className="slot-legend-dot selected" />
                  Seleccionado
                </span>
                <span>Blanco = Disponible</span>
              </div>
            </>
          )}

          {errors.endTime && (
            <span className="form-error">{errors.endTime.message}</span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Motivo de la cita</label>
          <textarea
            className="form-control"
            rows={3}
            placeholder="Descripción breve del motivo..."
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

export default CreateAppointmentModal;
