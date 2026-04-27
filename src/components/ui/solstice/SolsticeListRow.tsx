export type SolsticeListRowProps = {
  cat: string;
  title: string;
  meta?: string;
  thumbClassName?: string;
  className?: string;
};

export function SolsticeListRow({
  cat,
  title,
  meta,
  thumbClassName,
  className,
}: SolsticeListRowProps) {
  const cls = `sol-list-row${className ? ` ${className}` : ""}`;
  const thumbCls = `sol-list-row__thumb${thumbClassName ? ` ${thumbClassName}` : ""}`;
  return (
    <div className={cls}>
      <div className={thumbCls} aria-hidden="true" />
      <div className="sol-list-row__body">
        <p className="sol-list-row__cat">{cat}</p>
        <h3 className="sol-list-row__title">{title}</h3>
        {meta ? <p className="sol-list-row__meta">{meta}</p> : null}
      </div>
    </div>
  );
}
