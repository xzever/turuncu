import type { ReactNode } from "react";

export type SolsticeCardProps = {
  variant?: "default" | "warm" | "feat" | "gold";
  className?: string;
  children: ReactNode;
};

export function SolsticeCard({ variant = "default", className, children }: SolsticeCardProps) {
  const v = variant === "default" ? "" : ` sol-card--${variant}`;
  const cls = `sol-card${v}${className ? ` ${className}` : ""}`;
  return <div className={cls}>{children}</div>;
}
