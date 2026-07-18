import { z } from "zod";

export const medicationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "El nombre del medicamento es requerido")
    .max(200, "El nombre no puede superar los 200 caracteres"),

  dose: z
    .string()
    .trim()
    .min(1, "La dosis es requerida")
    .max(100, "La dosis no puede superar los 100 caracteres"),

  frequency: z
    .string()
    .trim()
    .max(100, "La frecuencia no puede superar los 100 caracteres")
    .optional()
    .or(z.literal("")),

  duration: z
    .string()
    .trim()
    .max(100, "La duración no puede superar los 100 caracteres")
    .optional()
    .or(z.literal("")),

  instructions: z
    .string()
    .trim()
    .max(500, "Las instrucciones no pueden superar los 500 caracteres")
    .optional()
    .or(z.literal("")),
});

export const createTreatmentSchema = z.object({
  patientId: z.string().min(1, "Selecciona un paciente de la lista"),

  description: z
    .string()
    .trim()
    .min(5, "La descripción debe tener al menos 5 caracteres")
    .max(1000, "La descripción no puede superar los 1000 caracteres"),

  medications: z
    .array(medicationSchema)
    .min(1, "Debe incluir al menos un medicamento")
    .max(20, "No se pueden registrar más de 20 medicamentos"),

  requiresApproval: z.boolean(),
});

export type CreateTreatmentFormInput = z.infer<typeof createTreatmentSchema>;

export const updateTreatmentSchema = z.object({
  description: z
    .string()
    .trim()
    .min(5, "La descripción debe tener al menos 5 caracteres")
    .max(1000, "La descripción no puede superar los 1000 caracteres"),

  medications: z
    .array(medicationSchema)
    .min(1, "Debe incluir al menos un medicamento")
    .max(20, "No se pueden registrar más de 20 medicamentos"),

  reason: z
    .string()
    .trim()
    .min(10, "El motivo debe tener al menos 10 caracteres")
    .max(500, "El motivo no puede superar los 500 caracteres"),
});

export type UpdateTreatmentFormInput = z.infer<typeof updateTreatmentSchema>;
