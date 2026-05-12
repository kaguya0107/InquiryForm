"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/language-context";

export function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative z-[12] px-6 pb-12 pt-[calc(88px+env(safe-area-inset-top))] sm:pb-16 sm:pt-[calc(104px+env(safe-area-inset-top))]">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h1 className="max-w-2xl text-[clamp(1.875rem,5vw,2.75rem)] font-semibold leading-tight tracking-tight text-[color:var(--foreground-strong)]">
            {t.heroTitle}
          </h1>
        </motion.div>
      </div>
    </section>
  );
}
