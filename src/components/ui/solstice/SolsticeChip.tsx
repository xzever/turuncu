import type { ButtonHTMLAttributes, ReactNode } from "react";

export type SolsticeChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  count?: number | string;
  leadingIcon?: ReactNode;
};

export function SolsticeChip({
  active = false,
  count,
  leadingIcon,
  className,
  children,
  type = "button",
  ...rest
}: SolsticeChipProps) {
  const cls = `sol-chip${active ? " is-active" : ""}${className ? ` ${className}` : ""}`;
  return (
    <button type={type} className={cls} aria-pressed={active} {...rest}>
      {leadingIcon}
      <span>{children}</span>
      {count != null ? <span className="sol-chip__count">{count}</span> : null}
    </button>
  );
}
