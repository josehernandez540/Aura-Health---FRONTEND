import { z } from "zod";

export const createPatientSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),

  documentNumber: z
    .string()
    .min(1, "La identificación es obligatoria"),

  birthDate: z
    .string()
    .min(1, "La fecha de nacimiento es obligatoria"),

  email: z
    .string()
    .min(1, "El email es obligatorio")
    .email("Email inválido"),

  phone: z
    .string()
    .min(10, "El teléfono debe tener al menos 10 dígitos"),
});

export type PatientFormInput = z.infer<typeof createPatientSchema>;