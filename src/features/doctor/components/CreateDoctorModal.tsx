import React from "react";
import Input from "../../../components/ui/Inputs/Input";
import SelectInput from "../../../components/ui/Inputs/SelectInput";
import Button from "../../../components/ui/Button/Button";
import Modal from "../../../components/ui/Modal/Modal";
import Alert from "../../../components/ui/Alert/Alert";
import { useDoctor } from "../hooks/useDoctor";

interface CreateDoctorProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  onSuccess?: () => void;
}

const CreateDoctorForm: React.FC<CreateDoctorProps> = ({ isModalOpen, setIsModalOpen, onSuccess }) => {
  const { register, handleSubmit, errors, isSubmitting } = useDoctor(() => {
    setIsModalOpen(false);
    if (onSuccess) onSuccess(); 
  });

  return (
    <Modal 
      isOpen={isModalOpen} 
      onClose={() => setIsModalOpen(false)}
      title="Crear Médico"
      size="md"
      footer={
        <>
          <Button onClick={() => setIsModalOpen(false)} variant="ghost">Cancelar</Button>
          <Button type="submit" form="doctor-form" isLoading={isSubmitting}>
            Crear Médico
          </Button>
        </>
      }
    >
      <form id="doctor-form" onSubmit={handleSubmit} className="form-container">
        <Alert>
          Se generará una contraseña temporal que el médico deberá cambiar en su primer acceso.
        </Alert>
        
        <div className="form-grid">
          <Input
            label="Nombre"
            placeholder="Ej: Carolina Cano"
            {...register("name")}
            error={errors.name?.message}
          />

          <Input
            label="Identificación"
            placeholder="10000000"
            {...register("documentNumber")}
            error={errors.documentNumber?.message}
          />
        </div>

        <Input
          label="Email"
          placeholder="doctor@aurahealth.com"
          {...register("email")}
          error={errors.email?.message}
        />

        <div className="form-grid">
          <SelectInput
            label="Especialidad"
            options={[
              { value: "", label: "Seleccione..." },
              { value: "Cardiología", label: "Cardiología" },
              { value: "Dermatología", label: "Dermatología" },
              { value: "Pediatría", label: "Pediatría" },
            ]}
            {...register("specialization")}
            error={errors.specialization?.message}
          />

          <Input
            label="Número de licencia"
            placeholder="MED-XXXXX"
            {...register("licenseNumber")}
            error={errors.licenseNumber?.message}
          />
        </div>

        <Input
          label="Teléfono"
          placeholder="+57 300 000 0000"
          {...register("phone")}
          error={errors.phone?.message}
        />
      </form>
    </Modal>
  );
};

export default CreateDoctorForm;