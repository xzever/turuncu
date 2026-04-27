export type SolsticeHeroImgProps = {
  className?: string;
  ariaLabel?: string;
};

export function SolsticeHeroImg({ className, ariaLabel }: SolsticeHeroImgProps) {
  const cls = `sol-hero-img${className ? ` ${className}` : ""}`;
  return <div className={cls} role="img" aria-label={ariaLabel ?? "Hero görsel"} />;
}
