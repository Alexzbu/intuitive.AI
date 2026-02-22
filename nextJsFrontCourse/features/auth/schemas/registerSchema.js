import { z } from "zod";

export const registerSchema = z.object({
  salutation: z.enum(["mr", "ms", "dr", "prof"], {
    errorMap: () => ({ message: "Please select a title." }),
  }),
  firstName: z
    .string()
    .min(1, "First name is required.")
    .min(2, "At least 2 characters."),
  lastName: z
    .string()
    .min(1, "Last name is required.")
    .min(2, "At least 2 characters."),
  organization: z.string().min(1, "Organization is required."),
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Enter a valid email address."),
  position: z.enum(["student", "employee", "manager", "director", "other"], {
    errorMap: () => ({ message: "Please select a position." }),
  }),
  agreePrivacy: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the Privacy Policy." }),
  }),
  agreeTerms: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the Terms & Conditions." }),
  }),
});
