"use client";

import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Globe2, Home, Menu, X } from "lucide-react";
import LogoMarkIcon from "@/icons/LogoMarkIcon";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  buildLocaleAwareHref,
  getLucideNavIcon,
  getMobileSheetNavEntries,
  getNavEntryHref,
  resolveLocaleFromPathname,
  stripLocalePrefix,
  type SiteNavId,
} from "@/components/layout/headerConfig";
import { useMenu } from "@/components/layout/MenuContext";
import "./mobile-topbar.css";

type MobileTopbarProps = {
  homeHref?: string;
  fixed?: boolean;
};

type MenuItem = {
  id: SiteNavId;
  label: string;
  href: string;
  matchPaths: string[];
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
};

export default function MobileTopbar({ homeHref, fixed = false }: MobileTopbarProps) {
  const pathname = usePathname();
  const activeLocale = resolveLocaleFromPathname(pathname, "tr");
  const currentPath = stripLocalePrefix(pathname ?? "/").replace(/\/+$/, "") || "/";
  const brandHref = homeHref ?? buildLocaleAwareHref("/", activeLocale);
  const isTurkish = activeLocale === "tr";

  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const { isMenuOpen, setIsMenuOpen } = useMenu();
  const [isScrollHidden, setIsScrollHidden] = useState(false);

  // SSR guard - portal only renders after hydration
  const [mounted, setMounted] = useState(false);

  const languageRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  // Ref for the portaled panel so outside-click detection still works
  const panelRef = useRef<HTMLDivElement | null>(null);
  const scrollStopTimerRef = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const isBlogReading = currentPath.startsWith("/blog/") && currentPath !== "/blog";
    if (!isBlogReading) {
      setIsScrollHidden(false);
      return undefined;
    }

    const scheduleShow = () => {
      if (scrollStopTimerRef.current !== null) {
        window.clearTimeout(scrollStopTimerRef.current);
      }
      scrollStopTimerRef.current = window.setTimeout(() => {
        setIsScrollHidden(false);
        scrollStopTimerRef.current = null;
      }, 700);
    };

    const hideWhileReading = () => {
      const currentY = Math.max(0, window.scrollY);

      if (currentY < 64 || isMenuOpen || isLanguageOpen) {
        setIsScrollHidden(false);
        return;
      }

      setIsScrollHidden(true);
      scheduleShow();
    };

    const handleScroll = () => {
      hideWhileReading();
    };

    const handleTouchMove = () => {
      hideWhileReading();
    };

    const handleTouchEnd = () => {
      scheduleShow();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      if (scrollStopTimerRef.current !== null) {
        window.clearTimeout(scrollStopTimerRef.current);
      }
    };
  }, [currentPath, isLanguageOpen, isMenuOpen]);

  const languageItems = useMemo(
    () => [
      { id: "tr", label: "TR", href: buildLocaleAwareHref(currentPath, "tr"), active: activeLocale === "tr" },
      { id: "en", label: "EN", href: buildLocaleAwareHref(currentPath, "en"), active: activeLocale === "en" },
    ],
    [activeLocale, currentPath],
  );

  const menuItems = useMemo<MenuItem[]>(() => {
    return getMobileSheetNavEntries().map((entry) => ({
      id: entry.id,
      label: isTurkish ? entry.labelTr : entry.labelEn,
      href: getNavEntryHref(entry, activeLocale),
      matchPaths: entry.matchPaths,
      icon: getLucideNavIcon(entry.id, Home),
    }));
  }, [activeLocale, isTurkish]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (languageRef.current && !languageRef.current.contains(target)) {
        setIsLanguageOpen(false);
      }
      const insideMenuTrigger = menuRef.current?.contains(target) ?? false;
      const insideMenuPanel = panelRef.current?.contains(target) ?? false;
      if (!insideMenuTrigger && !insideMenuPanel) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [setIsMenuOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setIsLanguageOpen(false);
      setIsMenuOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [setIsMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) return undefined;
    const previousBodyPosition = document.body.style.position;
    const previousBodyTop = document.body.style.top;
    const previousBodyWidth = document.body.style.width;
    const scrollY = window.scrollY;

    document.body.style.position = "fixed";
    document.body.style.top = "-" + scrollY + "px";
    document.body.style.width = "100%";

    return () => {
      document.body.style.position = previousBodyPosition;
      document.body.style.top = previousBodyTop;
      document.body.style.width = previousBodyWidth;
      window.scrollTo(0, scrollY);
    };
  }, [isMenuOpen]);

  const menuOverlay = (
    <>
      {isMenuOpen ? (
        <button
          type="button"
          className="mobile-topbar__menu-backdrop"
          aria-label={isTurkish ? "Menuyu kapat" : "Close menu"}
          onClick={() => setIsMenuOpen(false)}
        />
      ) : null}

      <div
        ref={panelRef}
        className={"mobile-topbar__panel mobile-topbar__panel--menu" + (isMenuOpen ? " is-open" : "")}
        role="dialog"
        aria-modal="true"
        aria-hidden={!isMenuOpen}
        inert={!isMenuOpen}
        aria-label={isTurkish ? "Mobil menu" : "Mobile menu"}
      >
        <div className="mobile-topbar__menu-surface">
          <div className="mobile-topbar__menu-head">
            <Link
              href={brandHref}
              aria-label="Turuncu Solar anasayfa"
              className="mobile-topbar__menu-brand"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="mobile-topbar__brand-frame">
                <LogoMarkIcon className="mobile-topbar__brand-mark" aria-hidden />
              </span>
            </Link>

            <div className="mobile-topbar__menu-langs" aria-label={isTurkish ? "Dil secenekleri" : "Language options"}>
              {languageItems.map((item) => (
                <Link
                  key={"menu-lang-" + item.id}
                  href={item.href}
                  className={"mobile-topbar__menu-lang" + (item.active ? " is-active" : "")}
                  onClick={() => {
                    setIsLanguageOpen(false);
                    setIsMenuOpen(false);
                  }}
                >
                  {item.label}
                </Link>
              ))}
              <button
                type="button"
                className="mobile-topbar__menu-close"
                aria-label={isTurkish ? "Menuyu kapat" : "Close menu"}
                onClick={() => setIsMenuOpen(false)}
              >
                <X size={18} strokeWidth={2.2} />
              </button>
            </div>
          </div>

          <nav className="mobile-topbar__menu-nav" aria-label={isTurkish ? "Menu baglantilari" : "Menu links"}>
            {menuItems.map((item) => {
              const isActive = item.matchPaths.some((matchPath) =>
                matchPath === "/" ? currentPath === "/" : currentPath.startsWith(matchPath),
              );
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={"mobile-topbar__panel-link" + (isActive ? " is-active" : "")}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="mobile-topbar__panel-link-main">
                    <span className="mobile-topbar__panel-icon">
                      <Icon size={18} strokeWidth={1.9} />
                    </span>
                    <span className="mobile-topbar__panel-link-label">{item.label}</span>
                  </span>
                  <span className="mobile-topbar__panel-link-glow" aria-hidden="true" />
                </Link>
              );
            })}
          </nav>

          <div className="mobile-topbar__partners" aria-label={isTurkish ? "Diger markalar" : "Other brands"}>
            <span className="mobile-topbar__partners-label">
              {isTurkish ? "Diger Markalar" : "Other Brands"}
            </span>
            <a
              href="https://renevoenergy.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="mobile-topbar__partner-link"
              onClick={() => setIsMenuOpen(false)}
              aria-label={isTurkish ? "Renevo Energy - Is ortaginiz" : "Renevo Energy - Our partner"}
            >
              <span className="mobile-topbar__partner-glow" aria-hidden="true" />
              <span className="mobile-topbar__partner-mark" aria-hidden="true">
                <Image
                  src="/renevologo.svg"
                  alt=""
                  width={90}
                  height={28}
                  className="mobile-topbar__partner-logo"
                />
              </span>
              <span className="mobile-topbar__partner-text">
                <span className="mobile-topbar__partner-name">Renevo</span>
                <span className="mobile-topbar__partner-sub">
                  {isTurkish ? "Ruzgar Olcum Istasyonu" : "Wind Measurement Station"}
                </span>
              </span>
              <ArrowUpRight size={14} strokeWidth={2} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <header
        className={`mobile-topbar${fixed ? " mobile-topbar--fixed" : ""} mobile-topbar--orange${
          isScrollHidden ? " mobile-topbar--scroll-hidden" : ""
        }`}
      >
        <div className="mobile-topbar__row">
          <Link href={brandHref} aria-label="Turuncu Solar anasayfa" className="mobile-topbar__brand">
            <span className="mobile-topbar__brand-frame">
              <LogoMarkIcon className="mobile-topbar__brand-mark" aria-hidden />
            </span>
            <span className="mobile-topbar__brand-text">TURUNCU SOLAR</span>
          </Link>

          <div className="mobile-topbar__actions">
            <div className="mobile-topbar__popover" ref={languageRef}>
              <button
                type="button"
                className={"mobile-topbar__icon-btn" + (isLanguageOpen ? " active" : "")}
                aria-label={isTurkish ? "Dil secimi" : "Language selection"}
                aria-expanded={isLanguageOpen}
                onClick={() => {
                  setIsLanguageOpen((prev) => !prev);
                  setIsMenuOpen(false);
                }}
              >
                <Globe2 className="mobile-topbar__lang-icon" size={18} strokeWidth={2} aria-hidden />
              </button>

              <div className={"mobile-topbar__panel mobile-topbar__panel--lang" + (isLanguageOpen ? " is-open" : "")}>
                <div className="mobile-topbar__lang-switch" aria-label={isTurkish ? "Dil secenekleri" : "Language options"}>
                  {languageItems.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={"mobile-topbar__lang-link" + (item.active ? " is-active" : "")}
                      onClick={() => setIsLanguageOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="mobile-topbar__popover" ref={menuRef}>
              <button
                type="button"
                className={"mobile-topbar__icon-btn" + (isMenuOpen ? " active" : "")}
                aria-label={isTurkish ? "Menuyu ac" : "Open menu"}
                aria-expanded={isMenuOpen}
                onClick={() => {
                  setIsMenuOpen((prev) => !prev);
                  setIsLanguageOpen(false);
                }}
              >
                {isMenuOpen ? <X size={18} strokeWidth={2} /> : <Menu size={18} strokeWidth={2} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {mounted && createPortal(menuOverlay, document.body)}
    </>
  );
}
