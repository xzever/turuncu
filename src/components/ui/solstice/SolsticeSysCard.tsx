import type { ReactNode } from "react";

export type SolsticeSysCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
  features?: string[];
  feat?: boolean;
  badge?: ReactNode;
  cta?: ReactNode;
  className?: string;
};

export function SolsticeSysCard({
  icon,
  title,
  description,
  features,
  feat = false,
  badge,
  cta,
  className,
}: SolsticeSysCardProps) {
  const cls = `sol-sys-card${feat ? " sol-sys-card--feat" : ""}${className ? ` ${className}` : ""}`;
  return (
    <article className={cls}>
      <div className="sol-sys-card__head">
        <span className="sol-icon-chip sol-icon-chip--lg" aria-hidden="true">{icon}</span>
        {badge}
      </div>
      <h3 className="sol-sys-card__title">{title}</h3>
      <p className="sol-sys-card__desc">{description}</p>
      {features && features.length > 0 ? (
        <ul className="sol-sys-card__features">
          {features.map((f) => (<li key={f}>{f}</li>))}
        </ul>
      ) : null}
      {cta}
    </article>
  );
}
