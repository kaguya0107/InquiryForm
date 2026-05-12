"use client";

import type { ReactNode } from "react";
import { ThemeAwareToaster } from "@/components/providers/theme-aware-toaster";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { LanguageProvider } from "@/contexts/language-context";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        {children}
        <ThemeAwareToaster />
      </LanguageProvider>
    </ThemeProvider>
  );
}
