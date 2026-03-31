import React from "react";
import Modal from "../../../components/ui/Modal/Modal";
import Input from "../../../components/ui/Inputs/Input";
import DateInput from "../../../components/ui/Inputs/DateInput";
import Button from "../../../components/ui/Button/Button";
import { usePatient } from "../hooks/usePatient";

interface CreatePatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CreatePatientModal: React.FC<CreatePatientModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess 
}) => {
  const { register, handleSubmit, errors, isSubmitting } = usePatient(() => {
    onClose();
    if (onSuccess) onSuccess();
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Crear Paciente"
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            type="submit" 
            form="patient-form" 
            isLoading={isSubmitting}
          >
            Crear Paciente
          </Button>
        </>
      }
    >
      <form id="patient-form" onSubmit={handleSubmit} className="form-container">
        <div className="form-grid">
          <Input
            label="Nombre Completo"
            placeholder="Juan Pérez"
            {...register("name")}
            error={errors.name?.message}
          />

          <Input
            label="Identificación"
            placeholder="123456789"
            {...register("documentNumber")}
            error={errors.documentNumber?.message}
          />
        </div>

        <div className="form-grid">
          <DateInput
            label="Fecha de nacimiento"
            {...register("birthDate")}
            error={errors.birthDate?.message}
          />
          
          <Input
            label="Teléfono"
            placeholder="+57 300 000 0000"
            {...register("phone")}
            error={errors.phone?.message}
          />
        </div>

        <Input
          label="Email"
          placeholder="paciente@email.com"
          {...register("email")}
          error={errors.email?.message}
        />
      </form>
    </Modal>
  );
};

export default CreatePatientModal;