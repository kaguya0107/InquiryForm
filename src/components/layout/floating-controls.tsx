"use client";

import { Languages, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils/cn";

export function FloatingControls() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { t, locale, toggleLocale } = useLanguage();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  const palette: "light" | "dark" =
    !mounted ? "light" : (resolvedTheme ?? theme) === "dark" ? "dark" : "light";

  const flipTheme = () => {
    setTheme(palette === "dark" ? "light" : "dark");
  };

  const themeIcon =
    palette === "dark" ? (
      <Sun aria-hidden className="h-[18px] w-[18px]" />
    ) : (
      <Moon aria-hidden className="h-[18px] w-[18px]" />
    );

  const ja = locale === "ja";

  const themeTitle =
    palette === "dark"
      ? ja
        ? "ライトモード"
        : "Light mode"
      : ja
        ? "ダークモード"
        : "Dark mode";

  const languageTitle = ja ? "English" : "日本語";

  return (
    <>
      <div className="pointer-events-none fixed bottom-[calc(env(safe-area-inset-bottom)+112px)] left-6 right-6 z-[560] grid grid-cols-2 gap-[11px] sm:hidden">
        <ControlButtonMobile
          ariaLabel={mounted ? `${t.ariaTheme} (${palette})` : t.ariaTheme}
          onClick={flipTheme}
          title={themeTitle}
        >
          {themeIcon}
        </ControlButtonMobile>
        <ControlButtonMobile ariaLabel={t.ariaLang} onClick={() => toggleLocale()} title={languageTitle}>
          <Languages aria-hidden className="h-[18px] w-[18px]" />
        </ControlButtonMobile>
      </div>

      <div className="pointer-events-none fixed right-9 top-[calc(env(safe-area-inset-top)+22px)] z-[560] hidden sm:block xl:right-[max(72px,(100vw-1240px)/2)]">
        <div
          className={cn(
            "pointer-events-auto flex gap-2 rounded-2xl border border-[color:var(--cyber-card-border-solid)] bg-[color:color-mix(in_srgb,var(--cyber-card)_96%,transparent)] px-2.5 py-2.5 shadow-md backdrop-blur-sm dark:border-[color:var(--cyber-border-soft)] dark:bg-[color:color-mix(in_srgb,var(--cyber-card)_94%,transparent)] md:flex-col-reverse",
          )}
          aria-label="Site controls"
        >
          <ControlButtonDesk ariaLabel={mounted ? `${t.ariaTheme} (${palette})` : t.ariaTheme} onClick={flipTheme} title={themeTitle}>
            {themeIcon}
          </ControlButtonDesk>
          <ControlButtonDesk ariaLabel={t.ariaLang} onClick={() => toggleLocale()} title={languageTitle}>
            <Languages aria-hidden className="h-[18px] w-[18px]" />
          </ControlButtonDesk>
        </div>
      </div>
    </>
  );
}

function ControlButtonMobile(props: ControlProps) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      aria-label={props.ariaLabel}
      title={props.title}
      className={cn(
        "pointer-events-auto inline-flex h-[48px] items-center justify-center rounded-2xl border border-[color:var(--cyber-field-border)] bg-[color:var(--cyber-card)] text-[color:var(--foreground-strong)] shadow-sm transition hover:bg-[color:var(--background-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cyber-ring)] dark:border-[color:var(--cyber-border-soft)] dark:bg-[color:var(--background-subtle)] dark:hover:bg-[color:rgba(230,237,242,0.08)]",
      )}
    >
      {props.children}
    </button>
  );
}

function ControlButtonDesk(props: ControlProps) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      aria-label={props.ariaLabel}
      title={props.title}
      className={cn(
        "inline-grid size-[44px] place-items-center rounded-xl border border-[color:var(--cyber-field-border)] bg-[color:var(--background-subtle)] text-[color:var(--foreground-strong)] transition hover:bg-[color:var(--cyber-card)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cyber-ring)] dark:border-[color:var(--cyber-border-soft)] dark:bg-[color:rgba(230,237,242,0.06)] dark:hover:bg-[color:rgba(230,237,242,0.1)]",
      )}
    >
      {props.children}
    </button>
  );
}

type ControlProps = {
  children: React.ReactNode;
  onClick: () => void;
  ariaLabel: string;
  title: string;
};
