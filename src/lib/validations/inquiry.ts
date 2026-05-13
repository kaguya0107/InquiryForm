import { z } from "zod";

type ValidationMessages = {
  company_required: string;
  company_max: string;
  client_required: string;
  client_max: string;
  email_required: string;
  email_invalid: string;
  phone_required: string;
  phone_invalid: string;
  inquiry_min: string;
  inquiry_max: string;
};

/** Trim, full-width digits / common punctuation → half-width (phone field only). */
export function normalizePhoneNumberInput(raw: string): string {
  return raw
    .trim()
    .replace(/\u3000/g, " ")
    .replace(/[０-９]/g, (ch) =>
      String.fromCharCode(ch.charCodeAt(0) - 0xfee0),
    )
    .replace(/\uFF0D/g, "-") // fullwidth hyphen-minus －
    .replace(/\u2212/g, "-") // minus sign −
    .replace(/\uFF08/g, "(")
    .replace(/\uFF09/g, ")")
    .replace(/\uFEFF/g, "");
}

export function createInquirySchema(messages: ValidationMessages) {
  return z.object({
    company_name: z
      .string()
      .transform((s) => s.trim())
      .pipe(
        z.string().min(1, messages.company_required).max(200, messages.company_max),
      ),
    client_name: z
      .string()
      .transform((s) => s.trim())
      .pipe(
        z.string().min(1, messages.client_required).max(120, messages.client_max),
      ),
    email: z
      .string()
      .transform((s) => s.trim().toLowerCase())
      .pipe(
        z
          .string()
          .min(1, messages.email_required)
          .max(254, messages.email_invalid)
          .email(messages.email_invalid),
      ),
    phone_number: z
      .string()
      .transform((s) => normalizePhoneNumberInput(s))
      .pipe(
        z.string().superRefine((val, ctx) => {
          if (!val.length) {
            ctx.addIssue({ code: "custom", message: messages.phone_required });
            return;
          }
          if (val.length > 40) {
            ctx.addIssue({
              code: "custom",
              message: messages.phone_invalid,
            });
            return;
          }
          const digits = val.replace(/\D/g, "");
          if (digits.length < 10 || digits.length > 15) {
            ctx.addIssue({
              code: "custom",
              message: messages.phone_invalid,
            });
          }
        }),
      ),
    inquiry_content: z
      .string()
      .transform((s) => s.trim())
      .pipe(z.string().min(10, messages.inquiry_min).max(5000, messages.inquiry_max)),
  });
}
