import { z } from "zod";

export const adminUserSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  email: z.string().email("Email inválido"),
});

export type AdminUserFormData = z.infer<typeof adminUserSchema>;