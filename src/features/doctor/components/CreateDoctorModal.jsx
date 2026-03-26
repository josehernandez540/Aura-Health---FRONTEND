import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createDoctorSchema } from "../schemas/doctor.schema";
import { createDoctor } from "../services/doctor.service";
import Input from "../../../components/ui/Inputs/Input";
import SelectInput from "../../../components/ui/Inputs/SelectInput";
import Button from "../../../components/ui/Button/Button";
import Modal from "../../../components/ui/Modal/Modal"
import Alert from "../../../components/ui/Alert/Alert"
import { useDoctor } from "../hooks/useDoctor";

const CreateDoctorForm = ({ isModalOpen, setIsModalOpen }) => {

  const { register, handleSubmit, errors, isSubmitting } = useDoctor(() => {
    setIsModalOpen(false);
  });

  return (
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Crear Medico"
        size="md"
        footer={
          <>
            <Button onClick={() => setIsModalOpen(false)} variant="ghost">Cancelar</Button>
            <Button type="submit" form="doctor-form" disabled={isSubmitting}>
              {isSubmitting ? "Creando..." : "Crear Médico"}
            </Button>
          </>
        }
      >
        <form id="doctor-form" onSubmit={handleSubmit} className="form-container">
        <Alert children="Se generará una contraseña temporal que el médico deberá cambiar en su primer acceso."/>
        <div className="form-grid">
          <Input
            label="Nombre"
            placeholder="Pepito Perez"
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