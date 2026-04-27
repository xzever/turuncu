"use client";

import React from "react";
import Link from "next/link";

export type PillProps = {
  variant?: "primary" | "secondary" | "ghost" | "filter-chip" | "size-pill";
  size?: "sm" | "md";
  active?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  disabled?: boolean;
  as?: "button" | "a";
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  ariaLabel?: string;
  className?: string;
};

/**
 * Mobile UI Kit - Pill Component
 * 
 * @example
 * <Pill variant="primary" size="md" onClick={() => console.log('clicked')}>
 *   Tümünü Gör
 * </Pill>
 */
export const Pill = ({
  variant = "primary",
  size = "md",
  active = false,
  icon,
  iconPosition = "left",
  disabled = false,
  as = "button",
  href,
  onClick,
  children,
  ariaLabel,
  className = "",
}: PillProps) => {
  const baseClassName = [
    "ui-pill",
    `ui-pill--${variant}`,
    `ui-pill--${size}`,
    active ? "ui-pill--active" : "",
    disabled ? "ui-pill--disabled" : "",
    className
  ].filter(Boolean).join(" ");

  const content = (
    <>
      {icon && iconPosition === "left" && <span className="ui-pill__icon">{icon}</span>}
      <span className="ui-pill__label">{children}</span>
      {icon && iconPosition === "right" && <span className="ui-pill__icon">{icon}</span>}
    </>
  );

  if (as === "a" && href) {
    const isExternal = href.startsWith("http");
    if (isExternal) {
      return (
        <a 
          href={href} 
          className={baseClassName} 
          aria-label={ariaLabel}
          {...(active ? { "aria-pressed": true } : {})}
        >
          {content}
        </a>
      );
    }
    return (
      <Link 
        href={href} 
        className={baseClassName}
        aria-label={ariaLabel}
        {...(active ? { "aria-pressed": true } : {})}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={baseClassName}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={active}
    >
      {content}
    </button>
  );
};
