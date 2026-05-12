import { z } from "zod";

type ValidationMessages = {
  company_required: string;
  company_max: string;
  client_required: string;
  client_max: string;
  email_invalid: string;
  phone_required: string;
  inquiry_min: string;
  inquiry_max: string;
};

export function createInquirySchema(messages: ValidationMessages) {
  return z.object({
    company_name: z
      .string()
      .trim()
      .min(1, messages.company_required)
      .max(200, messages.company_max),
    client_name: z
      .string()
      .trim()
      .min(1, messages.client_required)
      .max(120, messages.client_max),
    email: z.string().trim().email(messages.email_invalid),
    phone_number: z
      .string()
      .trim()
      .min(5, messages.phone_required)
      .max(40, messages.phone_required),
    inquiry_content: z
      .string()
      .trim()
      .min(10, messages.inquiry_min)
      .max(5000, messages.inquiry_max),
  });
}
