"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";
import { useEffect } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  body: string;
  closeLabel: string;
};

export function SuccessModal({ open, onClose, title, body, closeLabel }: Props) {
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[900] grid place-items-center px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.button
            type="button"
            aria-label="Close"
            className="absolute inset-0 bg-[color:color-mix(in_srgb,var(--foreground-strong)_32%,transparent)] backdrop-blur-[2px]"
            onClick={onClose}
          />

          <motion.article
            role="dialog"
            aria-modal="true"
            aria-labelledby="success-heading"
            className="relative z-[910] max-w-[min(400px,92vw)] overflow-hidden rounded-2xl border border-[color:var(--cyber-card-border-solid)] bg-white p-8 text-center shadow-lg dark:border-[color:var(--cyber-border-soft)] dark:bg-[color:var(--cyber-card)]"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-3 inline-flex size-9 items-center justify-center rounded-lg border border-[color:var(--cyber-card-border-solid)] text-[color:var(--foreground)] opacity-75 transition hover:bg-[color:var(--background-subtle)] hover:opacity-100 dark:border-[color:var(--cyber-border-soft)] dark:hover:bg-white/10"
              aria-label={closeLabel}
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mb-6 inline-flex rounded-full border border-emerald-200/80 bg-emerald-50 p-3 dark:border-emerald-900/50 dark:bg-emerald-950/40">
              <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" aria-hidden />
            </div>

            <h2 id="success-heading" className="text-xl font-semibold tracking-tight text-[color:var(--foreground-strong)]">
              {title}
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-[color:var(--foreground)] opacity-90">{body}</p>

            <button
              type="button"
              onClick={onClose}
              className="mt-8 w-full rounded-xl border border-[color:var(--cyber-card-border-solid)] bg-[color:var(--background-subtle)] px-5 py-2.5 text-sm font-semibold text-[color:var(--foreground-strong)] transition hover:bg-[color:color-mix(in_srgb,var(--cyber-accent-cyan)_12%,var(--background-subtle))] dark:border-[color:var(--cyber-border-soft)] dark:bg-[color:rgba(230,237,242,0.07)] dark:hover:bg-[color:rgba(230,237,242,0.11)]"
            >
              {closeLabel}
            </button>
          </motion.article>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
