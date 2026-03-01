import { z } from "zod";

export const listingSchema = z.object({
  title: z
    .string()
    .min(5, "Titel muss mindestens 5 Zeichen lang sein")
    .max(120, "Titel darf maximal 120 Zeichen lang sein"),
  description: z
    .string()
    .min(20, "Beschreibung muss mindestens 20 Zeichen lang sein")
    .max(2000, "Beschreibung darf maximal 2000 Zeichen lang sein"),
  categoryId: z.string().min(1, "Bitte wähle eine Kategorie"),
  district: z.string().optional(),
  priceType: z.enum(["free", "hourly", "fixed", "negotiable"]),
  priceAmount: z.number().min(0).optional().nullable(),
  tags: z.string().optional(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
});

export type ListingFormValues = z.infer<typeof listingSchema>;
