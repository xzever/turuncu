import type { ReactNode } from "react";

export type SolsticeIconChipProps = {
  icon: ReactNode;
  size?: "md" | "lg";
  variant?: "accent" | "gold";
  className?: string;
  ariaLabel?: string;
};

export function SolsticeIconChip({
  icon,
  size = "md",
  variant = "accent",
  className,
  ariaLabel,
}: SolsticeIconChipProps) {
  const s = size === "md" ? "" : ` sol-icon-chip--${size}`;
  const v = variant === "accent" ? "" : ` sol-icon-chip--${variant}`;
  const cls = `sol-icon-chip${s}${v}${className ? ` ${className}` : ""}`;
  return (
    <span className={cls} aria-label={ariaLabel} aria-hidden={ariaLabel ? undefined : true}>
      {icon}
    </span>
  );
}
