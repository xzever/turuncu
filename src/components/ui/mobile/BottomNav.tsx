"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type BottomNavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
};

export type BottomNavProps = {
  items: BottomNavItem[];
  current?: string;
};

/**
 * Mobile UI Kit - BottomNav Component
 * 
 * @example
 * <BottomNav 
 *   items={[
 *     { href: "/", label: "Ana Sayfa", icon: <HomeIcon /> }
 *   ]} 
 * />
 */
export const BottomNav = ({ items, current }: BottomNavProps) => {
  const pathname = usePathname();
  const activePath = current ?? pathname;

  return (
    <nav className="handheld-dock ui-bottom-nav" aria-label="Mobil Alt Menü">
      <div className="handheld-dock__track">
        <div className="handheld-dock__blob">
          {items.map((item) => {
            const isActive = activePath === item.href;

            return (
              <Link 
                key={item.href}
                href={item.href}
                className={`handheld-dock__cell ${isActive ? "is-active" : ""}`}
                aria-current={isActive ? "page" : undefined}
                aria-label={item.label}
              >
                <span className="handheld-dock__icon-slot">
                  {isActive && item.activeIcon ? item.activeIcon : item.icon}
                </span>
                <span className="handheld-dock__label">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
