"use client";

import type { ReactNode } from "react";

export type AnimatedIconVariant = "nav" | "system" | "live" | "action" | "info";

interface AnimatedIconProps {
  icon?: ReactNode;
  children?: ReactNode;
  variant: AnimatedIconVariant;
  isActive?: boolean;
  isLiveUpdating?: boolean;
  pulseKey?: string | number;
  className?: string;
  ariaHidden?: boolean;
}

function createClassName(className?: string): string {
  return ["relative inline-flex items-center justify-center", className].filter(Boolean).join(" ");
}

export default function AnimatedIcon({
  icon,
  children,
  className,
  ariaHidden = true,
}: AnimatedIconProps) {
  return (
    <span className={createClassName(className)} aria-hidden={ariaHidden}>
      {children ?? icon}
    </span>
  );
}
