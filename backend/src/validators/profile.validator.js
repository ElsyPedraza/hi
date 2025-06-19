
import { z } from "zod";

export const updateProfileValidator = z.object({
  body: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
    location: z.string().optional(),
    bio: z.string().optional(),
    birthdate: z.string().optional(), // validato nel controller come data
  }),
});

export const changePasswordValidator = z.object({
  body: z.object({
    currentPassword: z.string().min(1, "La password attuale è obbligatoria"),
    newPassword: z.string().min(6, "La nuova password deve avere almeno 6 caratteri"),
  }),
});
