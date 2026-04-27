"use client";

import {
  Building2,
  Calculator,
  Grid2x2,
  HelpCircle,
  Home,
  Link2,
  Mail,
  PenLine,
  type LucideIcon,
} from "lucide-react";

/** Aligns with header / routing ids used across the app */
export type SiteNavId =
  | "anasayfa"
  | "kurumsal"
  | "sistemlerimiz"
  | "hesapla"
  | "referanslar"
  | "blog"
  | "sss"
  | "iletisim";

export type SiteHeaderNavId = SiteNavId;

export type SiteNavEntry = {
  id: SiteNavId;
  path: string;
  labelTr: string;
  labelEn: string;
  matchPaths: string[];
  showInDesktopHeader: boolean;
  showInMobileSheet: boolean;
  showInBottomNav: boolean;
};

export const LOCALES = ["tr", "en", "de", "ru", "fr"] as const;
export type Locale = (typeof LOCALES)[number];

const LOCALE_SEGMENT_PATTERN = new RegExp(`^(${LOCALES.join("|")})$`, "i");

export function resolveLocaleFromPathname(pathname: string | null | undefined, fallback: Locale = "tr"): Locale {
  const firstSegment = pathname?.split("/").filter(Boolean)[0]?.toLowerCase();
  if (firstSegment && LOCALES.includes(firstSegment as Locale)) {
    return firstSegment as Locale;
  }
  return fallback;
}

export function stripLocalePrefix(pathname: string): string {
  const normalized = pathname.split("#")[0].split("?")[0] || "/";
  const segments = normalized.split("/").filter(Boolean);
  const firstSegment = segments[0]?.toLowerCase();
  if (firstSegment && LOCALE_SEGMENT_PATTERN.test(firstSegment)) {
    return segments.length > 1 ? `/${segments.slice(1).join("/")}` : "/";
  }
  return normalized === "" ? "/" : normalized;
}

export function buildLocaleAwareHref(href: string, locale: Locale): string {
  if (!href || href.startsWith("#")) return href || "#";
  if (/^(https?:|mailto:|tel:)/i.test(href)) return href;

  const normalized = href.startsWith("/") ? href : `/${href}`;
  const strippedPath = stripLocalePrefix(normalized);

  if (locale === "tr") {
    return strippedPath;
  }

  return strippedPath === "/" ? `/${locale}` : `/${locale}${strippedPath}`;
}

export function getNavEntryHref(entry: SiteNavEntry, locale: Locale): string {
  if (entry.id === "hesapla") {
    return `${buildLocaleAwareHref("/", locale)}?hesapla=1`;
  }
  return buildLocaleAwareHref(entry.path, locale);
}

export const SITE_NAV: readonly SiteNavEntry[] = [
  {
    id: "anasayfa",
    path: "/",
    labelTr: "Ana Sayfa",
    labelEn: "Home",
    matchPaths: ["/"],
    showInDesktopHeader: true,
    showInMobileSheet: true,
    showInBottomNav: true,
  },
  {
    id: "kurumsal",
    path: "/hakkimizda",
    labelTr: "Kurumsal",
    labelEn: "About",
    matchPaths: ["/hakkimizda"],
    showInDesktopHeader: true,
    showInMobileSheet: true,
    showInBottomNav: false,
  },
  {
    id: "sistemlerimiz",
    path: "/sistemlerimiz",
    labelTr: "Sistemlerimiz",
    labelEn: "Systems",
    matchPaths: ["/sistemlerimiz", "/simulasyon"],
    showInDesktopHeader: true,
    showInMobileSheet: true,
    showInBottomNav: false,
  },
  {
    id: "hesapla",
    path: "/hesapla",
    labelTr: "Hesapla",
    labelEn: "Calculate",
    matchPaths: ["/hesapla"],
    showInDesktopHeader: false,
    showInMobileSheet: true,
    showInBottomNav: true,
  },
  {
    id: "referanslar",
    path: "/referanslar",
    labelTr: "Referanslar",
    labelEn: "References",
    matchPaths: ["/referanslar", "/references"],
    showInDesktopHeader: true,
    showInMobileSheet: true,
    showInBottomNav: true,
  },
  {
    id: "blog",
    path: "/blog",
    labelTr: "Blog",
    labelEn: "Blog",
    matchPaths: ["/blog"],
    showInDesktopHeader: true,
    showInMobileSheet: true,
    showInBottomNav: false,
  },
  {
    id: "sss",
    path: "/sss",
    labelTr: "SSS",
    labelEn: "FAQ",
    matchPaths: ["/sss"],
    showInDesktopHeader: true,
    showInMobileSheet: true,
    showInBottomNav: false,
  },
  {
    id: "iletisim",
    path: "/iletisim",
    labelTr: "İletişim",
    labelEn: "Contact",
    matchPaths: ["/iletisim"],
    showInDesktopHeader: true,
    showInMobileSheet: true,
    showInBottomNav: false,
  },
] as const;

const NAV_BY_ID = Object.fromEntries(SITE_NAV.map((n) => [n.id, n])) as Record<SiteNavId, SiteNavEntry>;

export function getNavEntry(id: SiteNavId): SiteNavEntry {
  return NAV_BY_ID[id];
}

export function getDesktopHeaderNavEntries(): SiteNavEntry[] {
  const entries = SITE_NAV.filter((n) => n.showInDesktopHeader);
  const iletisim = entries.find((n) => n.id === "iletisim");
  const rest = entries.filter((n) => n.id !== "iletisim");
  if (!iletisim) return entries;
  return [...rest, iletisim];
}

export function getMobileSheetNavEntries(): SiteNavEntry[] {
  return SITE_NAV.filter((n) => n.showInMobileSheet);
}

export function getBottomNavBaseEntries(): SiteNavEntry[] {
  return SITE_NAV.filter((n) => n.showInBottomNav);
}

/** Telefon + tablet alt menÃ¼ (sÄ±ra sabit). Tam liste hamburger menÃ¼de. */
const BOTTOM_NAV_HANDHELD_IDS: readonly SiteNavId[] = [
  "anasayfa",
  "referanslar",
  "hesapla",
  "iletisim",
];

export function getBottomNavHandheldEntries(): SiteNavEntry[] {
  return BOTTOM_NAV_HANDHELD_IDS.map((id) => getNavEntry(id));
}

export function getActiveNavIdFromPathname(pathname: string | null): SiteHeaderNavId | undefined {
  const stripped = stripLocalePrefix(pathname ?? "/").replace(/\/+$/, "") || "/";

  const matches = (paths: string[]): boolean =>
    paths.some((p) => (p === "/" ? stripped === "/" : stripped === p || stripped.startsWith(`${p}/`)));

  let best: SiteHeaderNavId | undefined;
  let bestLen = -1;
  for (const entry of SITE_NAV) {
    if (!matches(entry.matchPaths)) continue;
    for (const p of entry.matchPaths) {
      const len = p === "/" ? 1 : p.length;
      if (len > bestLen) {
        bestLen = len;
        best = entry.id;
      }
    }
  }
  return best;
}


export const NAV_LUCIDE_ICON: Record<SiteNavId, LucideIcon> = {
  anasayfa: Home,
  kurumsal: Building2,
  sistemlerimiz: Grid2x2,
  hesapla: Calculator,
  referanslar: Link2,
  blog: PenLine,
  "sss": HelpCircle,
  iletisim: Mail,
};

export function getHeaderNavIcon(id: string): React.ReactNode {
  const Icon = NAV_LUCIDE_ICON[id as SiteNavId] ?? Home;
  return <Icon size={14} aria-hidden="true" />;
}

export function getLucideNavIcon(id: SiteNavId, fallback: LucideIcon = Home): LucideIcon {
  return NAV_LUCIDE_ICON[id] ?? fallback;
}
