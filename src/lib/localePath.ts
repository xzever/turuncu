import { LOCALES, type Locale } from "@/lib/i18n";

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
