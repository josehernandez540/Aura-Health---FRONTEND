import React, { useEffect } from "react";
import Modal from "../../../components/ui/Modal/Modal";
import Input from "../../../components/ui/Inputs/Input";
import Button from "../../../components/ui/Button/Button";
import { useForm } from "react-hook-form";
import { type Patient, updatePatient } from "../services/patient.services";
import { useUIStore } from "../../../store/ui.store";

interface EditPatientProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient | null;
  onSuccess: () => void;
}

const EditPatientModal: React.FC<EditPatientProps> = ({ isOpen, onClose, patient, onSuccess }) => {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();
  const addToast = useUIStore((state) => state.addToast);

  useEffect(() => {
    if (patient) {
      reset({
        name: patient.name,
        email: patient.email,
        phone: patient.phone,
        birthDate: patient.birth_date?.split('T')[0] || "",
      });
    }
  }, [patient, reset]);

  const onSubmit = async (data: any) => {
    if (!patient) return;
    try {
      await updatePatient(patient.id, data);
      addToast("Paciente actualizado con éxito", "success");
      onSuccess();
      onClose();
    } catch (error) {
      addToast("Error al actualizar el paciente", "error");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Paciente"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit(onSubmit)} isLoading={isSubmitting}>Guardar Cambios</Button>
        </>
      }
    >
      <form className="form-container">
        <Input label="Nombre Completo" {...register("name")} />
        <Input label="Email" {...register("email")} />
        <Input label="Teléfono" {...register("phone")} />
        <Input label="Fecha de Nacimiento" type="date" {...register("birthDate")} />
      </form>
    </Modal>
  );
};

export default EditPatientModal;