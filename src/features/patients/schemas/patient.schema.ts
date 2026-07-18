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

  diseaseCount: z.coerce
    .number()
    .int("Debe ser un número entero")
    .min(0, "No puede ser negativo"),
});

export type PatientFormInput = z.infer<typeof createPatientSchema>;