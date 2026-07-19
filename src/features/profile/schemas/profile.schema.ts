import { z } from "zod";

export const profileFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(150, "El nombre no puede superar los 150 caracteres"),
  email: z
    .string()
    .trim()
    .email("El correo no es válido")
    .max(150, "El correo no puede superar los 150 caracteres"),
});

export type ProfileFormInput = z.infer<typeof profileFormSchema>;
