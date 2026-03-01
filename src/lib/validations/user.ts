import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name muss mindestens 2 Zeichen lang sein"),
    email: z.string().email("Ungültige E-Mail-Adresse"),
    password: z
      .string()
      .min(8, "Passwort muss mindestens 8 Zeichen lang sein"),
    confirmPassword: z.string(),
    district: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwörter stimmen nicht überein",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("Ungültige E-Mail-Adresse"),
  password: z.string().min(1, "Passwort ist erforderlich"),
});

export const profileSchema = z.object({
  name: z.string().min(2).optional(),
  bio: z.string().max(500).optional(),
  phone: z.string().optional(),
  district: z.string().optional(),
  skillTags: z.array(z.string()).optional(),
  preferredLocale: z.enum(["de", "en"]).optional(),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
export type ProfileFormValues = z.infer<typeof profileSchema>;
