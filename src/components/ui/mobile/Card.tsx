"use client";

import React from "react";
import Link from "next/link";

export type CardProps = {
  variant?: "flat" | "elevated" | "interactive";
  padding?: "sm" | "md" | "lg";
  href?: string;
  onClick?: () => void;
  as?: "div" | "article" | "section";
  children: React.ReactNode;
  className?: string;
};

/**
 * Mobile UI Kit - Card Component
 * 
 * @example
 * <Card variant="elevated" padding="md">
 *   <h3>Card Title</h3>
 *   <p>Card content goes here.</p>
 * </Card>
 */
export const Card = ({
  variant = "flat",
  padding = "md",
  href,
  onClick,
  as: Component = "div",
  children,
  className = "",
}: CardProps) => {
  const isInteractive = variant === "interactive" || !!href || !!onClick;
  const actualVariant = isInteractive ? "interactive" : variant;
  
  const baseClassName = [
    "ui-card",
    `ui-card--${actualVariant}`,
    `ui-card--p-${padding}`,
    className
  ].filter(Boolean).join(" ");

  if (href) {
    const isExternal = href.startsWith("http");
    if (isExternal) {
      return (
        <a href={href} className={baseClassName} onClick={onClick}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={baseClassName} onClick={onClick}>
        {children}
      </Link>
    );
  }

  if (onClick || isInteractive) {
    return (
      <button type="button" className={baseClassName} onClick={onClick}>
        {children}
      </button>
    );
  }

  return (
    <Component className={baseClassName}>
      {children}
    </Component>
  );
};
