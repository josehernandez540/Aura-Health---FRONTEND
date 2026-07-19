import { z } from "zod";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const createAppointmentSchema = z
  .object({
    doctorId: z.string().min(1, "El médico es requerido"),

    patientId: z.string().min(1, "El paciente es requerido"),

    date: z
      .string()
      .min(1, "La fecha es requerida")
      .refine((v) => !Number.isNaN(Date.parse(v)), "La fecha no es válida")
      .refine((v) => {
        const d = new Date(v);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return d >= today;
      }, "No se pueden programar citas en fechas pasadas"),

    startTime: z
      .string()
      .min(1, "Selecciona un horario disponible")
      .regex(timeRegex, "La hora de inicio debe tener formato HH:MM"),

    endTime: z
      .string()
      .min(1, "Selecciona un horario disponible")
      .regex(timeRegex, "La hora de fin debe tener formato HH:MM"),

    notes: z
      .string()
      .max(500, "El motivo no puede superar los 500 caracteres")
      .optional()
      .or(z.literal("")),
  })
  .refine(({ startTime, endTime }) => startTime < endTime, {
    message: "La hora de fin debe ser posterior a la hora de inicio",
    path: ["endTime"],
  });

export type AppointmentFormInput = z.infer<typeof createAppointmentSchema>;

export const cancelAppointmentSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(10, "El motivo debe tener al menos 10 caracteres")
    .max(500, "El motivo no puede superar los 500 caracteres"),
});

export type CancelAppointmentFormInput = z.infer<typeof cancelAppointmentSchema>;

export const rescheduleAppointmentSchema = z
  .object({
    newDate: z
      .string()
      .min(1, "La nueva fecha es requerida")
      .refine((v) => !Number.isNaN(Date.parse(v)), "La fecha no es válida")
      .refine((v) => {
        const d = new Date(v);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return d >= today;
      }, "No se pueden programar citas en fechas pasadas"),

    newStartTime: z
      .string()
      .min(1, "Selecciona un horario disponible")
      .regex(timeRegex, "La hora de inicio debe tener formato HH:MM"),

    newEndTime: z
      .string()
      .min(1, "Selecciona un horario disponible")
      .regex(timeRegex, "La hora de fin debe tener formato HH:MM"),

    reason: z
      .string()
      .max(500, "El motivo no puede superar los 500 caracteres")
      .optional()
      .or(z.literal("")),
  })
  .refine(({ newStartTime, newEndTime }) => newStartTime < newEndTime, {
    message: "La hora de fin debe ser posterior a la hora de inicio",
    path: ["newEndTime"],
  });

export type RescheduleAppointmentFormInput = z.infer<
  typeof rescheduleAppointmentSchema
>;

export const noShowAppointmentSchema = z.object({
  reason: z
    .string()
    .trim()
    .max(500, "El motivo no puede superar los 500 caracteres")
    .optional()
    .or(z.literal("")),
});

export type NoShowAppointmentFormInput = z.infer<typeof noShowAppointmentSchema>;

export const completeAppointmentSchema = z.object({
  notes: z
    .string()
    .trim()
    .max(500, "Las notas no pueden superar los 500 caracteres")
    .optional()
    .or(z.literal("")),
});

export type CompleteAppointmentFormInput = z.infer<typeof completeAppointmentSchema>;
