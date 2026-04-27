"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { Home } from "lucide-react";
import {
  getActiveNavIdFromPathname,
  getBottomNavHandheldEntries,
  getLucideNavIcon,
  getNavEntryHref,
} from "@/components/layout/headerConfig";
import { useMenu } from "@/components/layout/MenuContext";
import "@/styles/components/bottom-nav.css";

export default function BottomNav() {
  const { isMenuOpen } = useMenu();
  const pathname = usePathname() ?? "/";
  const pathSegments = pathname.split("/").filter(Boolean);
  const pathLocale = pathSegments[0];
  const activeLocale: "tr" | "en" = pathLocale === "en" ? "en" : "tr";

  const activeId = useMemo(() => getActiveNavIdFromPathname(pathname), [pathname]);

  const capsuleItems = useMemo(() => {
    return getBottomNavHandheldEntries().map((entry) => {
      const id = entry.id;
      return {
        id,
        label: activeLocale === "en" ? entry.labelEn : entry.labelTr,
        href: getNavEntryHref(entry, activeLocale),
        Icon: getLucideNavIcon(id, Home),
      };
    });
  }, [activeLocale]);

  return (
    <nav
      className="handheld-dock"
      aria-label="Alt menü"
      aria-hidden={isMenuOpen || undefined}
      style={isMenuOpen ? { display: "none" } : undefined}
    >
      <div className="handheld-dock__track">
        <div className="handheld-dock__halo" aria-hidden />
        <div className="handheld-dock__blob">
          {capsuleItems.map(({ id, label, href, Icon }) => {
            const isActive = activeId === id;
            const isFab = id === "hesapla";
            return (
              <Link
                key={id}
                href={href}
                title={label}
                aria-label={label}
                aria-current={isActive ? "page" : undefined}
                className={`handheld-dock__cell${isFab ? " handheld-dock__cell--fab" : ""} ${isActive ? "is-active" : ""}`.trim()}
              >
                <span className="handheld-dock__icon-slot">
                  <Icon className={`handheld-dock__icon shrink-0${isFab ? " handheld-dock__icon--fab" : ""}`.trim()} strokeWidth={2} aria-hidden />
                </span>
                <span className="handheld-dock__label">{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
