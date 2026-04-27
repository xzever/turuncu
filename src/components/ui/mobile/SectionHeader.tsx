"use client";

import React from "react";

export type SectionHeaderProps = {
  overline?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  as?: "h2" | "h3" | "h4";
};

/**
 * Mobile UI Kit - SectionHeader Component
 * 
 * @example
 * <SectionHeader 
 *   overline="Öne Çıkanlar" 
 *   title="Yeni Ürünler" 
 *   action={<button>Tümü</button>} 
 * />
 */
export const SectionHeader = ({
  overline,
  title,
  subtitle,
  action,
  as: Component = "h2",
}: SectionHeaderProps) => {
  return (
    <header className="ui-section-header">
      <div className="ui-section-header__content">
        {overline && <span className="ui-section-header__overline">{overline}</span>}
        <Component className="ui-section-header__title">{title}</Component>
        {subtitle && <p className="ui-section-header__subtitle">{subtitle}</p>}
      </div>
      {action && <div className="ui-section-header__action">{action}</div>}
    </header>
  );
};
