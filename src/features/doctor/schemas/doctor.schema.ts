import { z } from "zod";

export const createDoctorSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  documentNumber: z.string().min(1, "La identificación es obligatoria"),
  specialization: z.string().min(1, "Debe seleccionar una especialidad"),
  email: z.string().min(1, "El email es obligatorio").email("Email inválido"),
  licenseNumber: z.string().min(1, "El número de licencia es obligatorio"),
  phone: z.string().min(10, "El teléfono debe tener al menos 10 dígitos"),
});

export type DoctorFormInput = z.infer<typeof createDoctorSchema>;