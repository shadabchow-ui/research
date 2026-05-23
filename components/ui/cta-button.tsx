import clsx from "clsx";
import Link from "next/link";
import { ReactNode } from "react";

interface CTAButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}

const variantStyles = {
  primary:
    "bg-upcube-primary text-upcube-primary-foreground hover:bg-upcube-primary-hover",
  secondary:
    "bg-upcube-surface border border-upcube-border text-upcube-text hover:bg-upcube-surface-hover hover:border-upcube-primary/30",
  ghost:
    "text-upcube-text-muted hover:text-upcube-text hover:bg-upcube-surface-hover",
};

const sizeStyles = {
  sm: "px-4 py-2 text-sm rounded-lg",
  md: "px-6 py-3 text-base rounded-xl",
  lg: "px-8 py-4 text-lg rounded-xl",
};

export function CTAButton({
  children,
  href,
  onClick,
  variant = "primary",
  size = "md",
  className,
  type = "button",
  disabled = false,
}: CTAButtonProps) {
  const base = clsx(
    "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-upcube-primary focus-visible:ring-offset-2",
    variantStyles[variant],
    sizeStyles[size],
    disabled && "pointer-events-none opacity-50",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={base}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={base}>
      {children}
    </button>
  );
}
