import clsx from "clsx";
import { ReactNode } from "react";

interface SectionShellProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  headingClassName?: string;
  as?: "section" | "div";
  id?: string;
}

export function SectionShell({
  children,
  title,
  subtitle,
  className,
  headingClassName,
  id,
  as: Tag = "section",
}: SectionShellProps) {
  return (
    <Tag id={id} className={clsx("py-16 md:py-24", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {title && (
          <div className="mb-12 text-center">
            <h2
              className={clsx(
                "text-3xl font-bold tracking-tight text-avatar-text md:text-4xl",
                headingClassName,
              )}
            >
              {title}
            </h2>
            {subtitle && (
              <p className="mx-auto mt-4 max-w-2xl text-lg text-avatar-text-muted">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </Tag>
  );
}
