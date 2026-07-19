import { z } from "zod";

export const reportFiltersSchema = z
  .object({
    doctorId: z.string().optional().or(z.literal("")),
    patientId: z.string().optional().or(z.literal("")),
    startDate: z.string().optional().or(z.literal("")),
    endDate: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) => !data.startDate || !data.endDate || data.startDate <= data.endDate,
    {
      message: "La fecha de fin no puede ser anterior a la fecha de inicio",
      path: ["endDate"],
    }
  );

export type ReportFiltersInput = z.infer<typeof reportFiltersSchema>;
