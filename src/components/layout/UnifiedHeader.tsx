"use client";

/**
 * UnifiedHeader â€” HEADER_RULES.md'ye %100 uyumlu header bileÅŸeni.
 *
 * â‰¥1080px  â†’ Desktop sticky header (64px / 72px @2xl)
 * â‰¤1079px  â†’ Mobile fixed bottom bar (56px + safe-area)
 *
 * Font Awesome tree-shaking ile sadece kullanÄ±lan ikonlar import edilir.
 * TÃ¼m z-index, breakpoint, tipografi ve eriÅŸilebilirlik kurallarÄ±
 * HEADER_RULES.md ile birebir uyumludur.
 */

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";

/* â”€â”€ Font Awesome: tree-shaking uyumlu import â”€â”€ */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { config as faConfig } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

// Solid ikonlar â€” sadece kullanÄ±lanlar
import {
  faHome,
  faBuilding,
  faThLarge,
  faCalculator,
  faPenNib,
  faLink,
  faEnvelope,
  faEllipsisH,
  faGlobe,
  faCircleQuestion,
} from "@fortawesome/free-solid-svg-icons";

// Brand ikonlar â€” sosyal medya
import {
  faInstagram,
  faXTwitter,
  faYoutube,
  faLinkedinIn,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";

import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

// Font Awesome CSS auto-insert'Ã¼ kapat (Next.js SSR uyumu iÃ§in)
faConfig.autoAddCss = false;

import {
  getDesktopHeaderNavEntries,
  getBottomNavHandheldEntries,
  getActiveNavIdFromPathname,
  getNavEntry,
  getNavEntryHref,
  SITE_NAV,
  type SiteHeaderNavId,
  type SiteNavId,
} from "@/components/layout/headerConfig";

/* â”€â”€ Stil dosyasÄ± â”€â”€ */
import "@/styles/components/unified-header.css";

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   Tip TanÄ±mlarÄ±
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

interface NavItemData {
  id: string;
  label: string;
  href: string;
  icon: IconDefinition;
}

interface SocialLinkData {
  id: string;
  label: string;
  href: string;
  icon: IconDefinition;
}

interface UnifiedHeaderProps {
  activeNavId?: SiteHeaderNavId | string;
  className?: string;
  onNavChange?: (id: string) => void;
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   Sabit Veriler
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

/** Nav ikonlarÄ± â€” Font Awesome solid, tree-shaken */
const NAV_FA_ICONS: Record<string, IconDefinition> = {
  anasayfa: faHome,
  kurumsal: faBuilding,
  sistemlerimiz: faThLarge,
  hesapla: faCalculator,
  blog: faPenNib,
  referanslar: faLink,
  sss: faCircleQuestion,
  iletisim: faEnvelope,
};

/** Sosyal medya linkleri â€” HEADER_RULES sÄ±rasÄ±: Instagram â†’ X â†’ YouTube â†’ LinkedIn â†’ TikTok */
const SOCIAL_LINKS: readonly SocialLinkData[] = [
  { id: "instagram", label: "Instagram", href: "https://www.instagram.com/turuncusolar", icon: faInstagram },
  { id: "x", label: "X (Twitter)", href: "https://x.com/turuncusolar", icon: faXTwitter },
  { id: "youtube", label: "YouTube", href: "https://www.youtube.com/@turuncusolar", icon: faYoutube },
  { id: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/company/turuncusolar", icon: faLinkedinIn },
  { id: "tiktok", label: "TikTok", href: "https://www.tiktok.com/@turuncusolar", icon: faTiktok },
];


function getFaIcon(id: string): IconDefinition {
  return NAV_FA_ICONS[id] ?? faHome;
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   Ana BileÅŸen
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

export default function UnifiedHeader({
  activeNavId,
  className = "",
  onNavChange,
}: UnifiedHeaderProps) {
  const pathname = usePathname();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  // Locale Ã§Ã¶zÃ¼mleme
  const pathSegments = (pathname ?? "/").split("/").filter(Boolean);
  const pathLocale = pathSegments[0];
  const activeLocale: "tr" | "en" = pathLocale === "en" ? "en" : "tr";

  // Aktif nav id
  const computedActiveId = useMemo(
    () => activeNavId ?? getActiveNavIdFromPathname(pathname),
    [activeNavId, pathname],
  );

  // Desktop nav Ã¶ÄŸeleri
  const desktopNavItems = useMemo((): NavItemData[] => {
    return getDesktopHeaderNavEntries().map((entry) => ({
      id: entry.id,
      label: activeLocale === "en" ? entry.labelEn : entry.labelTr,
      href: getNavEntryHref(entry, activeLocale),
      icon: getFaIcon(entry.id),
    }));
  }, [activeLocale]);

  // Bottom bar nav Ã¶ÄŸeleri
  const bottomNavEntries = useMemo(() => getBottomNavHandheldEntries(), []);
  const bottomNavIds = useMemo(() => new Set(bottomNavEntries.map((entry) => entry.id)), [bottomNavEntries]);
  const bottomNavItems = useMemo((): NavItemData[] => {
    return bottomNavEntries.map((entry) => ({
      id: entry.id,
      label: activeLocale === "en" ? entry.labelEn : entry.labelTr,
      href: getNavEntryHref(entry, activeLocale),
      icon: getFaIcon(entry.id),
    }));
  }, [activeLocale, bottomNavEntries]);

  // DÄ±ÅŸarÄ± tÄ±klamayÄ± kapat
  const handleOutsideClick = useCallback((e: MouseEvent) => {
    if (langRef.current && !langRef.current.contains(e.target as Node)) {
      setIsLangOpen(false);
    }
    if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
      setShowMore(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [handleOutsideClick]);

  // Locale path builder
  const localeAgnosticSegments =
    pathLocale === "tr" || pathLocale === "en" ? pathSegments.slice(1) : pathSegments;

  const localePath = (locale: "tr" | "en"): string => {
    if (locale === "tr") {
      return localeAgnosticSegments.length ? `/${localeAgnosticSegments.join("/")}` : "/";
    }
    return localeAgnosticSegments.length ? `/en/${localeAgnosticSegments.join("/")}` : "/en";
  };

  // Aktif kontrol
  const isActive = (itemId: string): boolean => {
    if (!computedActiveId) return false;
    if (itemId === computedActiveId) return true;
    return false;
  };

  return (
    <>
      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          DESKTOP STICKY HEADER (â‰¥1080px)
          â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <header
        className={`uh-header ${className}`.trim()}
        role="banner"
      >
        <div className="uh-header__wrapper">
          {/* Sol: Logo + Nav */}
          <div className="uh-header__left">
            {/* Logo */}
            <Link href="/" className="uh-header__brand" aria-label="Turuncu Solar anasayfa">
              <Image
                src="/logomasaustu.svg"
                alt="Turuncu Solar"
                width={376}
                height={47}
                priority
                className="uh-header__logo"
              />
            </Link>

            {/* Ana navigasyon */}
            <nav className="uh-header__nav" aria-label="Ana menÃ¼">
              <ul className="uh-header__menu" role="menubar">
                {desktopNavItems.map((item) => {
                  const active = isActive(item.id);
                  return (
                    <li key={item.id} role="none">
                      <Link
                        href={item.href}
                        role="menuitem"
                        data-nav={item.id}
                        aria-label={item.label}
                        aria-current={active ? "page" : undefined}
                        onClick={(e) => {
                          if (!onNavChange) return;
                          const entry = getNavEntry(item.id as SiteNavId);
                          if (entry?.path !== "/") return;
                          e.preventDefault();
                          onNavChange(item.id);
                        }}
                        className={`uh-header__menu-link ${active ? "is-active" : ""}`.trim()}
                      >
                        <FontAwesomeIcon
                          icon={item.icon}
                          className="uh-header__menu-icon"
                          aria-hidden="true"
                        />
                        <span className="uh-header__menu-label">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          {/* SaÄŸ: Sosyal medya + Dil */}
          <div className="uh-header__right">
            {/* Sosyal Medya Ä°konlarÄ± */}
            <div className="uh-header__social" aria-label="Sosyal medya">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.id}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="uh-header__social-link"
                >
                  <FontAwesomeIcon
                    icon={social.icon}
                    className="uh-header__social-icon"
                    aria-hidden="true"
                  />
                </a>
              ))}
            </div>

            {/* Dil SeÃ§ici */}
            <div className="uh-header__lang" ref={langRef}>
              <button
                type="button"
                className={`uh-header__lang-btn ${isLangOpen ? "is-open" : ""}`.trim()}
                aria-label="Dil seÃ§imi"
                aria-expanded={isLangOpen}
                aria-haspopup="true"
                onClick={() => setIsLangOpen((p) => !p)}
              >
                <FontAwesomeIcon icon={faGlobe} aria-hidden="true" />
                <span className="uh-header__lang-code">
                  {activeLocale.toUpperCase()}
                </span>
              </button>
              {isLangOpen && (
                <div className="uh-header__lang-panel" role="menu">
                  <Link
                    href={localePath("tr")}
                    className={`uh-header__lang-opt ${activeLocale === "tr" ? "is-active" : ""}`.trim()}
                    role="menuitem"
                    onClick={() => setIsLangOpen(false)}
                  >
                    TR
                  </Link>
                  <Link
                    href={localePath("en")}
                    className={`uh-header__lang-opt ${activeLocale === "en" ? "is-active" : ""}`.trim()}
                    role="menuitem"
                    onClick={() => setIsLangOpen(false)}
                  >
                    EN
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          MOBILE BOTTOM BAR (â‰¤1079px)
          â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <nav
        className="uh-bottom"
        aria-label="Mobil alt menÃ¼"
        role="navigation"
      >
        <div className="uh-bottom__bar">
          {bottomNavItems.map((item) => {
            const active = isActive(item.id);
            return (
              <Link
                key={item.id}
                href={item.href}
                aria-label={item.label}
                aria-current={active ? "page" : undefined}
                className={`uh-bottom__item ${active ? "is-active" : ""}`.trim()}
              >
                <span className="uh-bottom__icon-wrap">
                  <FontAwesomeIcon
                    icon={item.icon}
                    className="uh-bottom__icon"
                    aria-hidden="true"
                  />
                </span>
                <span className="uh-bottom__label">{item.label}</span>
              </Link>
            );
          })}

          {/* "Daha Fazla" butonu â€” 5. slot */}
          <div className="uh-bottom__more-wrap" ref={moreRef}>
            <button
              type="button"
              className={`uh-bottom__item uh-bottom__item--more ${showMore ? "is-open" : ""}`.trim()}
              aria-label="Daha fazla"
              aria-expanded={showMore}
              aria-haspopup="true"
              onClick={() => setShowMore((p) => !p)}
            >
              <span className="uh-bottom__icon-wrap">
                <FontAwesomeIcon
                  icon={faEllipsisH}
                  className="uh-bottom__icon"
                  aria-hidden="true"
                />
              </span>
              <span className="uh-bottom__label">
                {activeLocale === "en" ? "More" : "Daha Fazla"}
              </span>
            </button>

            {showMore && (
              <div className="uh-bottom__more-panel" role="menu">
                {SITE_NAV.filter(
                  (entry) =>
                    !bottomNavIds.has(entry.id) && entry.showInMobileSheet,
                ).map((entry) => {
                  const href = getNavEntryHref(entry, activeLocale);
                  const label = activeLocale === "en" ? entry.labelEn : entry.labelTr;
                  return (
                    <Link
                      key={entry.id}
                      href={href}
                      role="menuitem"
                      aria-label={label}
                      className="uh-bottom__more-link"
                      onClick={() => setShowMore(false)}
                    >
                      <FontAwesomeIcon
                        icon={getFaIcon(entry.id)}
                        className="uh-bottom__more-icon"
                        aria-hidden="true"
                      />
                      <span>{label}</span>
                    </Link>
                  );
                })}

                {/* Sosyal medya â€” bottom bar more panel */}
                <div className="uh-bottom__more-social">
                  {SOCIAL_LINKS.map((social) => (
                    <a
                      key={social.id}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="uh-bottom__more-social-link"
                    >
                      <FontAwesomeIcon icon={social.icon} aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

