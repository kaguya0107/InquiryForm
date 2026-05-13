"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  BriefcaseBusiness,
  FileText,
  Mail,
  Phone,
  ShieldCheck,
  UserRoundPen,
} from "lucide-react";
import type { FocusEvent } from "react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import type { FieldPath } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { SuccessModal } from "@/components/modals/success-modal";
import { useLanguage } from "@/contexts/language-context";
import type { InquiryPayload } from "@/lib/types/inquiry";
import { createInquirySchema, normalizePhoneNumberInput } from "@/lib/validations/inquiry";
import { cn } from "@/lib/utils/cn";

type InquiryFormSectionProps = {
  className?: string;
};

const inputBase =
  "w-full rounded-xl border border-[color:var(--cyber-field-border)] bg-[color:var(--background-subtle)] px-3.5 py-2.5 text-[15px] text-[color:var(--foreground-strong)] outline-none transition placeholder:text-slate-400/95 focus:border-[color:var(--cyber-accent-cyan)] focus:bg-white focus:ring-2 focus:ring-[color:var(--cyber-ring)] dark:border-[color:var(--cyber-field-border)] dark:focus:bg-[color:var(--cyber-card)] dark:placeholder:text-slate-500";

function InquiryFormSection({ className }: InquiryFormSectionProps) {
  const { t, locale } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);

  const formHeading = locale === "ja" ? "お問い合わせフォーム" : "Inquiry form";

  const schema = useMemo(
    () => createInquirySchema(t.validation),
    [t.validation],
  );
  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      company_name: "",
      client_name: "",
      email: "",
      phone_number: "",
      inquiry_content: "",
    },
  });

  const webhook =
    typeof process.env.NEXT_PUBLIC_MAKE_WEBHOOK_URL === "string"
      ? process.env.NEXT_PUBLIC_MAKE_WEBHOOK_URL.trim()
      : "";

  async function focusFirstError(paths: FieldPath<FormValues>[]) {
    const id = paths[0];
    if (!id || typeof window === "undefined") return;

    queueMicrotask(() => {
      const el = document.getElementById(String(id));
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.focus({ preventScroll: false });
    });
  }

  async function submit(values: FormValues) {
    if (!webhook) {
      toast.error(t.toastWebhookMissing);
      return;
    }

    const payload: InquiryPayload = {
      company_name: values.company_name.trim(),
      client_name: values.client_name.trim(),
      email: values.email.trim(),
      phone_number: values.phone_number.trim(),
      inquiry_content: values.inquiry_content.trim(),
    };

    try {
      const response = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(String(response.status));

      form.reset();
      setModalOpen(true);
    } catch {
      toast.error(t.toastError);
    }
  }

  const registerEmail = form.register("email");
  const registerPhone = form.register("phone_number");

  return (
    <section id="contact" className={cn("relative z-[22] px-6 pb-28 sm:pb-32", className)}>
      <div className="mx-auto mt-[-20px] max-w-5xl sm:mt-[-28px]">
        <div
          className={cn(
            "rounded-3xl border border-[color:var(--cyber-card-border-solid)] bg-[color:var(--cyber-card)] p-[clamp(1.25rem,3vw,2rem)] shadow-[0_2px_28px_var(--surface-shadow)] dark:border-[color:var(--cyber-border-soft)] dark:bg-[color:var(--cyber-card)] dark:shadow-none",
          )}
        >
          <div className="mb-10 flex items-center gap-2 text-sm font-semibold text-[color:var(--foreground-strong)] dark:text-[color:var(--foreground-strong)]">
            <ShieldCheck className="h-4 w-4 shrink-0 text-[color:var(--cyber-accent-cyan)]" aria-hidden />
            {formHeading}
          </div>

          <form
            onSubmit={form.handleSubmit(
              async (values) => {
                await submit(values);
              },
              async (errs) => {
                const paths = Object.keys(errs) as FieldPath<FormValues>[];
                await focusFirstError(paths);
              },
            )}
            className="relative space-y-6 sm:space-y-7"
            noValidate
          >
            <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
              <GlassField icon={BriefcaseBusiness} label={t.labels.company} fieldId="company_name">
                <input
                  {...form.register("company_name")}
                  id="company_name"
                  autoComplete="organization"
                  placeholder={t.placeholders.company}
                  className={inputBase}
                  aria-invalid={Boolean(form.formState.errors.company_name)}
                />
                <InlineError message={form.formState.errors.company_name?.message} />
              </GlassField>

              <GlassField icon={UserRoundPen} label={t.labels.client} fieldId="client_name">
                <input
                  {...form.register("client_name")}
                  id="client_name"
                  autoComplete="name"
                  placeholder={t.placeholders.client}
                  className={inputBase}
                  aria-invalid={Boolean(form.formState.errors.client_name)}
                />
                <InlineError message={form.formState.errors.client_name?.message} />
              </GlassField>

              <GlassField icon={Mail} label={t.labels.email} fieldId="email">
                <input
                  {...registerEmail}
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder={t.placeholders.email}
                  inputMode="email"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                  maxLength={254}
                  className={inputBase}
                  aria-invalid={Boolean(form.formState.errors.email)}
                  onBlur={(e: FocusEvent<HTMLInputElement>) => {
                    registerEmail.onBlur(e);
                    const next = e.target.value.trim().toLowerCase();
                    if (next !== e.target.value) {
                      form.setValue("email", next, { shouldValidate: true });
                    }
                  }}
                />
                <InlineError message={form.formState.errors.email?.message} />
              </GlassField>

              <GlassField icon={Phone} label={t.labels.phone} fieldId="phone_number">
                <input
                  {...registerPhone}
                  id="phone_number"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder={t.placeholders.phone}
                  maxLength={40}
                  className={inputBase}
                  aria-invalid={Boolean(form.formState.errors.phone_number)}
                  onBlur={(e: FocusEvent<HTMLInputElement>) => {
                    registerPhone.onBlur(e);
                    const next = normalizePhoneNumberInput(e.target.value);
                    if (next !== e.target.value) {
                      form.setValue("phone_number", next, { shouldValidate: true });
                    }
                  }}
                />
                <InlineError message={form.formState.errors.phone_number?.message} />
              </GlassField>
            </div>

            <GlassField icon={FileText} label={t.labels.inquiry} fieldId="inquiry_content">
              <textarea
                {...form.register("inquiry_content")}
                id="inquiry_content"
                rows={6}
                placeholder={t.placeholders.inquiry}
                className={cn(inputBase, "min-h-[168px] resize-y")}
                aria-invalid={Boolean(form.formState.errors.inquiry_content)}
              />
              <InlineError message={form.formState.errors.inquiry_content?.message} />
            </GlassField>

            <div className="pt-4">
              <button
                type="submit"
                disabled={form.formState.isSubmitting}
                aria-busy={form.formState.isSubmitting}
                className={cn(
                  "flex w-full items-center justify-center gap-3 rounded-xl bg-[color:var(--btn-primary)] px-6 py-3.5 text-base font-semibold text-white shadow-[0_2px_12px_var(--surface-shadow)] transition hover:bg-[color:var(--btn-primary-hover)] disabled:opacity-65 dark:text-white dark:shadow-none",
                )}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <span
                      aria-hidden
                      className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-white/35 border-t-white"
                    />
                    {t.submitLoading}
                  </>
                ) : (
                  t.submit
                )}
              </button>
            </div>
          </form>
        </div>

        <SuccessModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          message={t.modalSuccess}
          closeLabel={t.modalClose}
        />
      </div>
    </section>
  );
}

type GlassFieldProps = {
  icon: React.ComponentType<React.ComponentPropsWithoutRef<"svg">>;
  label: string;
  fieldId: string;
  children: React.ReactNode;
};

function GlassField({ icon: Icon, label, fieldId, children }: GlassFieldProps) {
  return (
    <div className="group rounded-2xl border border-[color:var(--cyber-card-border-solid)] bg-[color:var(--background-subtle)] p-4 transition-colors focus-within:border-[color:var(--cyber-accent-cyan)] focus-within:bg-[color:var(--cyber-card)] focus-within:ring-2 focus-within:ring-[color:var(--cyber-ring)] dark:border-[color:var(--cyber-border-soft)] dark:bg-[color:rgba(230,237,242,0.06)] dark:focus-within:bg-[color:var(--cyber-card)]">
      <label
        htmlFor={fieldId}
        className="mb-2 flex items-center gap-2 text-sm font-medium text-[color:var(--foreground-strong)]"
      >
        <Icon className="h-4 w-4 shrink-0 text-[color:var(--foreground)] opacity-70" aria-hidden />
        {label}
      </label>
      {children}
    </div>
  );
}

function InlineError({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <p role="alert" aria-live="polite" className="mt-2 pl-0.5 text-[13px] text-rose-600 dark:text-rose-300">
      {message}
    </p>
  );
}

export default InquiryFormSection;
