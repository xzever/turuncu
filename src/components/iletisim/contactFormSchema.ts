import { z } from "zod";

const phonePattern = /^$|^[+]?[\d\s()/-]{10,20}$/;

export const contactFormSchema = z.object({
  fullName: z.string().trim().min(2, "Ad soyad en az 2 karakter olmalidir."),
  email: z.string().trim().email("Lutfen gecerli bir e-posta girin."),
  phone: z.string().trim().regex(phonePattern, "Lutfen gecerli bir telefon girin.").optional().or(z.literal("")),
  systemType: z.string().optional(),
  message: z.string().trim().min(10, "Mesajiniz en az 10 karakter olmalidir."),
  kvkkAccepted: z.boolean().refine((value) => value, "KVKK aydinlatma metnini onaylamalisiniz."),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export function getContactFormDefaults(systemType = ""): ContactFormValues {
  return {
    fullName: "",
    email: "",
    phone: "",
    systemType,
    message: "",
    kvkkAccepted: false,
  };
}
