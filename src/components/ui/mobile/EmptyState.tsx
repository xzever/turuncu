"use client";

import React from "react";
import { Pill } from "./Pill";

export type EmptyStateProps = {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  cta?: { label: string; href?: string; onClick?: () => void };
};

/**
 * Mobile UI Kit - EmptyState Component
 * 
 * @example
 * <EmptyState 
 *   icon={<Search size={48} />}
 *   title="Sonuç bulunamadı" 
 *   description="Lütfen farklı bir arama terimi deneyin."
 *   cta={{ label: "Aramayı Temizle", onClick: handleClear }}
 * />
 */
export const EmptyState = ({
  icon,
  title,
  description,
  cta,
}: EmptyStateProps) => {
  return (
    <div className="ui-empty-state">
      {icon && <div className="ui-empty-state__icon">{icon}</div>}
      <h3 className="ui-empty-state__title">{title}</h3>
      {description && <p className="ui-empty-state__description">{description}</p>}
      {cta && (
        <div className="ui-empty-state__cta">
          <Pill 
            variant="primary" 
            size="md" 
            href={cta.href} 
            onClick={cta.onClick}
            as={cta.href ? "a" : "button"}
          >
            {cta.label}
          </Pill>
        </div>
      )}
    </div>
  );
};
