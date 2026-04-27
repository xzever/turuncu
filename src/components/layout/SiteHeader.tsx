"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Globe2 } from "lucide-react";
import AnimatedIcon from "@/components/ui/AnimatedIcon";
import { PartnerSidePill } from "@/components/layout/PartnerSidePill";
import {
  getDesktopHeaderNavEntries,
  getHeaderNavIcon,
  getNavEntry,
  getNavEntryHref,
  SITE_NAV,
  stripLocalePrefix,
  type SiteHeaderNavId,
} from "@/components/layout/headerConfig";
import "@/styles/components/site-header-a5.css";

export type { SiteHeaderNavId };

const _PARTNER_FIRM = {
  name: "Renevo Energy",
  href: "https://renevoenergy.com/",
  logo: "/renevologo.svg",
};

type NavItem = {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
};

type SocialLink = {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
};

interface SiteHeaderProps {
  activeNavId?: SiteHeaderNavId | string;
  className?: string;
  showInlineSearch?: boolean;
  inlineSearchPlaceholder?: string;
  showStories?: boolean;
  onNavChange?: (id: string) => void;
}

const CATALOG_NAV_PATTERN = /(katalog|catalog)/i;

function isCatalogNavCandidate(value: string | undefined): boolean {
  if (!value) return false;
  return CATALOG_NAV_PATTERN.test(value);
}

function isCatalogNavItem(item: { id?: string; label?: string; href?: string }): boolean {
  return (
    isCatalogNavCandidate(item.id) ||
    isCatalogNavCandidate(item.label) ||
    isCatalogNavCandidate(item.href)
  );
}

const SOCIAL_LINKS: ReadonlyArray<SocialLink> = [
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/turuncusolar",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
        <rect x="4.2" y="4.2" width="15.6" height="15.6" rx="4.2" />
        <circle cx="12" cy="12" r="3.6" />
        <circle cx="17.2" cy="6.8" r=".6" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    id: "x",
    label: "X (Twitter)",
    href: "https://x.com/turuncusolar",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    id: "youtube",
    label: "YouTube",
    href: "https://www.youtube.com/@turuncusolar",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12s0-3.3-.4-4.9a2.8 2.8 0 0 0-2-2C17.9 4.6 12 4.6 12 4.6s-5.9 0-7.6.5a2.8 2.8 0 0 0-2 2C2 8.7 2 12 2 12s0 3.3.4 4.9a2.8 2.8 0 0 0 2 2c1.7.5 7.6.5 7.6.5s5.9 0 7.6-.5a2.8 2.8 0 0 0 2-2C22 15.3 22 12 22 12z" />
        <path d="m10 15 5-3-5-3v6z" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/turuncusolar",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    id: "tiktok",
    label: "TikTok",
    href: "https://www.tiktok.com/@turuncusolar",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78 2.92 2.92 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.57 6.33 6.33 0 0 0 9.37 22a6.33 6.33 0 0 0 6.37-6.22V9.4a8.16 8.16 0 0 0 3.85.96V7.09a4.11 4.11 0 0 1-1.83-.42z" />
      </svg>
    ),
  },
];

const HEADER_STORIES: ReadonlyArray<{ id: string; image: string; alt: string }> = [
  {
    id: "story-reference",
    image: "/referanslar.webp",
    alt: "Referanslar",
  },
  {
    id: "story-systems",
    image: "/sistemlerimiz.webp",
    alt: "Sistemler",
  },
  {
    id: "story-about",
    image: "/hakkimizda.webp",
    alt: "Hakkımızda",
  },
  {
    id: "story-panels",
    image: "/faaliyet-alanlari.webp",
    alt: "Paneller",
  },
  {
    id: "story-tech",
    image: "/center-villa-dark.webp",
    alt: "Teknoloji",
  },
  {
    id: "story-team",
    image: "/about-hero.webp",
    alt: "Ekip",
  },
];

export default function SiteHeader({
  activeNavId,
  className = "",
  showStories = false,
  onNavChange,
}: SiteHeaderProps) {
  const pathname = usePathname();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setIsLangOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  const pathSegments = (pathname ?? "/").split("/").filter(Boolean);
  const pathLocale = pathSegments[0];
  const activeLocale: "tr" | "en" = pathLocale === "en" ? "en" : "tr";

  const navItems = useMemo((): NavItem[] => {
    return getDesktopHeaderNavEntries()
      .filter((entry) => !isCatalogNavItem({ id: entry.id, label: entry.labelTr, href: entry.path }))
      .map((entry) => ({
        id: entry.id,
        label: activeLocale === "en" ? entry.labelEn : entry.labelTr,
        href: getNavEntryHref(entry, activeLocale),
        icon: getHeaderNavIcon(entry.id),
      }));
  }, [activeLocale]);

  const headerClassName = ["solar-header", className].filter(Boolean).join(" ");
  const localeAgnosticSegments = pathLocale === "tr" || pathLocale === "en" ? pathSegments.slice(1) : pathSegments;
  const localePath = (locale: "tr" | "en"): string => {
    if (locale === "tr") {
      return localeAgnosticSegments.length ? `/${localeAgnosticSegments.join("/")}` : "/";
    }
    return localeAgnosticSegments.length ? `/en/${localeAgnosticSegments.join("/")}` : "/en";
  };

  const isNavItemActive = (item: NavItem): boolean => {
    if (!activeNavId) return false;
    if (item.id === activeNavId) return true;
    const strippedItem = stripLocalePrefix(item.href.split("?")[0] ?? "/").replace(/\/+$/, "") || "/";
    const activeEntry = SITE_NAV.find((e) => e.id === activeNavId);
    if (!activeEntry) return false;
    return activeEntry.matchPaths.some((p) =>
      p === "/" ? strippedItem === "/" : strippedItem === p || strippedItem.startsWith(`${p}/`),
    );
  };

  return (
    <header
      className={`${headerClassName} solar-header--layout fixed top-0 left-1/2 z-[var(--z-nav)] w-full max-w-[1920px] -translate-x-1/2 px-3 md:px-6 transition-none pointer-events-none flex items-center justify-between gap-3 md:gap-4`}
      style={{ top: "calc(max(var(--safe-top), var(--space-2)) + var(--space-4))" }}
    >
      <div className="solar-header__left pointer-events-auto">
        <div className="solar-header__brand pointer-events-auto flex-shrink-0">
          <Link href="/" aria-label="Turuncu Solar anasayfa">
            <Image
              src="/logomasaustu.svg"
              alt="Turuncu Solar"
              width={376}
              height={47}
              priority
              className="solar-header__logo w-[clamp(180px,14vw,260px)] h-auto max-h-9 md:max-h-10 object-contain object-left"
            />
          </Link>
          {showStories ? (
            <>
              <div className="solar-header__separator mx-4 h-8 w-px bg-white/20" />
              <div className="solar-header__stories flex items-center gap-2" aria-label="Hikayeler">
                {HEADER_STORIES.map((story) => (
                  <button type="button" key={story.id} className="solar-header__story group" aria-label={`Hikaye: ${story.alt}`}>
                    <div className="solar-header__story-ring p-0.5 rounded-full border border-orange-500/50 group-hover:border-orange-500 transition-colors">
                      <Image src={story.image} alt={story.alt} width={36} height={36} className="solar-header__story-image rounded-full" />
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : null}
        </div>

        <nav className="solar-header__nav pointer-events-auto flex items-center justify-start px-2 sm:px-3" aria-label="Ana menü">
          <ul className="solar-header__menu flex items-center gap-2 overflow-x-auto no-scrollbar max-w-full">
            {navItems.map((item) => {
              const isItemActive = isNavItemActive(item);
              return (
                <li key={item.id} className="flex-shrink-0">
                  {item.href.startsWith("/") ? (
                    <Link
                      href={item.href}
                      data-nav={item.id}
                      aria-label={item.label}
                      onClick={(e) => {
                        if (!onNavChange) return;
                        const entry = getNavEntry(item.id as SiteHeaderNavId);
                        if (entry?.path !== "/") return;
                        e.preventDefault();
                        onNavChange(item.id);
                      }}
                      className={`solar-header__menu-link sh5__nav-link no-underline whitespace-nowrap flex items-center ${isItemActive ? "is-active" : ""}`.trim()}
                    >
                      <AnimatedIcon
                        variant="nav"
                        isActive={isItemActive}
                        className="solar-header__menu-icon w-4 h-4 shrink-0 [&_svg]:block [&_svg]:w-4 [&_svg]:h-4"
                      >
                        {item.icon}
                      </AnimatedIcon>
                      <span className="solar-header__menu-label">{item.label}</span>
                    </Link>
                  ) : (
                    <a
                      href={item.href}
                      aria-label={item.label}
                      className={`solar-header__menu-link sh5__nav-link no-underline whitespace-nowrap flex items-center ${isItemActive ? "is-active" : ""}`.trim()}
                    >
                      <AnimatedIcon
                        variant="nav"
                        isActive={isItemActive}
                        className="solar-header__menu-icon w-4 h-4 shrink-0 [&_svg]:block [&_svg]:w-4 [&_svg]:h-4"
                      >
                        {item.icon}
                      </AnimatedIcon>
                      <span className="solar-header__menu-label">{item.label}</span>
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

      </div>

      <div className="solar-header__actions pointer-events-auto flex items-center gap-2 flex-shrink-0">
        <PartnerSidePill />
        <div className="solar-header__socials flex items-center gap-2" aria-label="Sosyal medya bağlantıları">
          {SOCIAL_LINKS.map((item) => (
            <a
              key={item.id}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="solar-header__social-link no-underline w-9 h-9 rounded-[10px] border border-white/20 bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/80 hover:text-white transition-all"
              aria-label={item.label}
            >
              <AnimatedIcon variant="nav" className="w-4 h-4 shrink-0 [&_svg]:block [&_svg]:w-4 [&_svg]:h-4">
                {item.icon}
              </AnimatedIcon>
            </a>
          ))}
        </div>
        <div className="sh5__lang" ref={langRef}>
          <button
            type="button"
            className={`sh5__lang-btn ${isLangOpen ? "is-open" : ""}`.trim()}
            aria-label="Dil seçimi"
            aria-expanded={isLangOpen}
            onClick={() => setIsLangOpen((p) => !p)}
          >
            <Globe2 size={18} strokeWidth={2} />
          </button>
          {isLangOpen ? (
            <div className="sh5__lang-panel">
              <Link
                href={localePath("tr")}
                className={`sh5__lang-opt ${activeLocale === "tr" ? "is-active" : ""}`.trim()}
                onClick={() => setIsLangOpen(false)}
              >
                TR
              </Link>
              <Link
                href={localePath("en")}
                className={`sh5__lang-opt ${activeLocale === "en" ? "is-active" : ""}`.trim()}
                onClick={() => setIsLangOpen(false)}
              >
                EN
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
