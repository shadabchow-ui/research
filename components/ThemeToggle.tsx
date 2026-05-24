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
      className={`rounded-lg border border-[#333] p-2 text-[#a3a3a3] transition-colors hover:border-[#fafafa] hover:text-[#fafafa] ${className ?? ""}`}
    >
      {theme === "dark" ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="h-4 w-4"
        >
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="h-4 w-4"
        >
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      )}
    </button>
  );
}
