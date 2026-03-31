import React, { useEffect } from "react";
import Modal from "../../../components/ui/Modal/Modal";
import Input from "../../../components/ui/Inputs/Input";
import SelectInput from "../../../components/ui/Inputs/SelectInput";
import Button from "../../../components/ui/Button/Button";
import { useForm } from "react-hook-form";
import { type DoctorDetail } from "../services/doctor.service";
import { type DoctorFormInput } from "../schemas/doctor.schema";

interface EditDoctorProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: DoctorDetail | null;
  onSubmit: (data: DoctorFormInput) => void;
}

const EditDoctorModal: React.FC<EditDoctorProps> = ({ isOpen, onClose, doctor, onSubmit }) => {
  const { register, handleSubmit, reset } = useForm<DoctorFormInput>();

  useEffect(() => {
    if (doctor) {
      reset({
        name: doctor.name,
        specialization: doctor.specialization,
        licenseNumber: doctor.license_number,
        email: doctor.users?.email,
        documentNumber: doctor.documentNumber || "",
      });
    }
  }, [doctor, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Médico"
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit(onSubmit)}>Guardar Cambios</Button>
        </>
      }
    >
      <form className="form-container" onSubmit={(e) => e.preventDefault()}>
        <Input label="Nombre Completo" {...register("name")} />

        <SelectInput
          label="Especialidad"
          {...register("specialization")}
          options={[
            { value: "Cardiología", label: "Cardiología" },
            { value: "Dermatología", label: "Dermatología" },
            { value: "Pediatría", label: "Pediatría" },
          ]}
        />

        <Input label="Número de Licencia" {...register("licenseNumber")} />
      </form>
    </Modal>
  );
};

export default EditDoctorModal;