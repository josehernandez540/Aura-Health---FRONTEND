import { useEffect } from "react";
import Modal from "../../../components/ui/Modal/Modal";
import Input from "../../../components/ui/Inputs/Input";
import SelectInput from "../../../components/ui/Inputs/SelectInput";
import Button from "../../../components/ui/Button/Button";
import { useForm } from "react-hook-form";

const EditDoctorModal = ({ isOpen, onClose, doctor, onSubmit }) => {
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (doctor) {
      reset({
        name: doctor.name,
        specialization: doctor.specialization,
        licenseNumber: doctor.licenseNumber,
      });
    }
  }, [doctor]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Médico"
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit(onSubmit)}>Guardar</Button>
        </>
      }
    >
      <form className="form-container">
        <Input label="Nombre" {...register("name")} />

        <SelectInput
          {...register("specialization")}
          options={[
            { value: "Cardiología", label: "Cardiología" },
            { value: "Dermatología", label: "Dermatología" },
            { value: "Pediatría", label: "Pediatría" },
          ]}
        />

        <Input label="Licencia" {...register("licenseNumber")} />
      </form>
    </Modal>
  );
};

export default EditDoctorModal;