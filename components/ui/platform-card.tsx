import clsx from "clsx";
import { ReactNode } from "react";

interface PlatformCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  gradientBorder?: boolean;
}

export function PlatformCard({
  children,
  className,
  hover = true,
  glow = false,
  gradientBorder = false,
}: PlatformCardProps) {
  return (
    <div
      className={clsx(
        "avatar-panel p-6",
        hover && "avatar-panel-hover cursor-pointer",
        glow && "avatar-glow",
        gradientBorder && "avatar-gradient-border",
        className,
      )}
    >
      {children}
    </div>
  );
}
