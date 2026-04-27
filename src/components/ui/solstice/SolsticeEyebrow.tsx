import type { ReactNode } from "react";

export type SolsticeEyebrowProps = {
  children: ReactNode;
  className?: string;
};

export function SolsticeEyebrow({ children, className }: SolsticeEyebrowProps) {
  const cls = `sol-eyebrow${className ? ` ${className}` : ""}`;
  return <p className={cls}>{children}</p>;
}
