import type { ButtonHTMLAttributes } from "react";

export type SolsticeAccRowProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  num: string;
  title: string;
  category?: string;
  open?: boolean;
};

export function SolsticeAccRow({
  num,
  title,
  category,
  open = false,
  className,
  type = "button",
  ...rest
}: SolsticeAccRowProps) {
  const cls = `sol-acc-row${open ? " is-open" : ""}${className ? ` ${className}` : ""}`;
  return (
    <button type={type} className={cls} aria-expanded={open} {...rest}>
      <span className="sol-acc-row__num">{num}</span>
      <span className="sol-acc-row__title">{title}</span>
      {category ? <span className="sol-acc-row__cat">{category}</span> : null}
    </button>
  );
}
