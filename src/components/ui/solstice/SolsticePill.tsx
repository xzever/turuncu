import type { ButtonHTMLAttributes, ReactNode } from "react";

export type SolsticePillProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "gold";
  size?: "sm" | "md" | "lg";
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
};

export function SolsticePill({
  variant = "primary",
  size = "md",
  leadingIcon,
  trailingIcon,
  className,
  children,
  type = "button",
  ...rest
}: SolsticePillProps) {
  const v = variant === "primary" ? "" : ` sol-pill--${variant}`;
  const s = size === "md" ? "" : ` sol-pill--${size}`;
  const cls = `sol-pill${v}${s}${className ? ` ${className}` : ""}`;
  return (
    <button type={type} className={cls} {...rest}>
      {leadingIcon}
      {children ? <span>{children}</span> : null}
      {trailingIcon}
    </button>
  );
}
