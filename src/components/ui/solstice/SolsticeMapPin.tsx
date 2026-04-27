export type SolsticeMapPinProps = {
  className?: string;
  ariaLabel?: string;
};

export function SolsticeMapPin({ className, ariaLabel }: SolsticeMapPinProps) {
  const cls = `sol-map-pin${className ? ` ${className}` : ""}`;
  return <div className={cls} role="img" aria-label={ariaLabel ?? "Konum haritası"} />;
}
