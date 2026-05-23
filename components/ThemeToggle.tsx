"use client";

import { useTheme } from "./theme-provider";

export function ThemeToggle({ className }: { className?: string }) {
  const themeCtx = useTheme();

  if (!themeCtx) return null;

  const { theme, toggle } = themeCtx;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle theme"
      className={`rounded-lg border border-[#333] px-2.5 py-1.5 text-xs font-medium text-[#a3a3a3] transition-colors hover:border-[#fafafa] hover:text-[#fafafa] ${className ?? ""}`}
    >
      {theme === "dark" ? "Light" : "Dark"}
    </button>
  );
}
