"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";

export function ThemeAwareToaster() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  if (!mounted) {
    return null;
  }

  const theme = resolvedTheme === "dark" ? "dark" : "light";

  return (
    <Toaster
      theme={theme}
      richColors
      position="top-center"
      toastOptions={{
        className:
          theme === "light"
            ? "!border-[color:var(--cyber-card-border-solid)] !bg-[color:var(--cyber-card)] !text-[color:var(--foreground-strong)] !shadow-md"
            : "!border-[color:var(--cyber-border-soft)] !bg-[color:var(--cyber-card)] !text-[color:var(--foreground-strong)] !shadow-lg",
      }}
    />
  );
}
