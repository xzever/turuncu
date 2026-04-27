import type { ReactNode } from "react";

export type SolsticeFeatArtProps = {
  cat: string;
  title: string;
  meta?: string;
  children?: ReactNode;
  imgClassName?: string;
  className?: string;
};

export function SolsticeFeatArt({
  cat,
  title,
  meta,
  children,
  imgClassName,
  className,
}: SolsticeFeatArtProps) {
  const cls = `sol-feat-art${className ? ` ${className}` : ""}`;
  const imgCls = `sol-feat-art__img${imgClassName ? ` ${imgClassName}` : ""}`;
  return (
    <article className={cls}>
      <div className={imgCls} aria-hidden="true" />
      <div className="sol-feat-art__body">
        <p className="sol-feat-art__cat">{cat}</p>
        <h3 className="sol-feat-art__title">{title}</h3>
        {meta ? <p className="sol-feat-art__meta">{meta}</p> : null}
        {children}
      </div>
    </article>
  );
}
