export type SolsticeStatProps = {
  value: string;
  label: string;
  className?: string;
};

export function SolsticeStat({ value, label, className }: SolsticeStatProps) {
  const cls = `sol-stat${className ? ` ${className}` : ""}`;
  return (
    <div className={cls}>
      <span className="sol-stat__num">{value}</span>
      <span className="sol-stat__lbl">{label}</span>
    </div>
  );
}
