import { z } from "zod";

export const uploadRecordSchema = z.object({
  patientId: z.string().min(1, "El paciente es requerido"),
  documentType: z.enum(["HISTORIA_CLINICA", "EXAMEN", "DIAGNOSTICO"], {
    message: "El tipo de documento es requerido",
  }),
});

export type UploadRecordFormInput = z.infer<typeof uploadRecordSchema>;

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

export const validatePdfFile = (file: File): string | null => {
  if (file.type !== "application/pdf") {
    return "Solo se permiten archivos PDF";
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return "El archivo no puede superar los 10 MB";
  }
  return null;
};
