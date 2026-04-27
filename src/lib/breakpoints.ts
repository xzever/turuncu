/**
 * Breakpoint Token Sistemi — Anayasa Madde 3.1
 *
 * TEK KAYNAK: Bu dosya ile `src/styles/tokens/breakpoints.css`
 * ve `tailwind.config.js → theme.screens` senkron tutulmalıdır.
 *
 * Kullanım:
 *   import { BP, MQ } from "@/lib/breakpoints";
 *   window.matchMedia(MQ.md).matches;
 */

export const BP = {
  xs: 0,
  sm: 768,
  md: 1024,
  lg: 1280,
  xl: 1440,
  "2xl": 1920,
} as const;

export type BreakpointKey = keyof typeof BP;

/**
 * Media query string'leri — matchMedia, useSyncExternalStore vb. için.
 *
 * min-* : breakpoint ve üstü
 * max-* : breakpoint altı (bir alt bandın sonu, örn. maxSm = sm altı = xs bandı)
 *
 * App shell (SiteHeader vs MobileTopbar+BottomNav):
 * - viewport ≤1279px
 * - veya gerçek touch tablet ailesi ≤1366px (iPad Pro 12.9 landscape dahil)
 */
export const MQ = {
  sm: `(min-width: ${BP.sm}px)`,
  md: `(min-width: ${BP.md}px)`,
  lg: `(min-width: ${BP.lg}px)`,
  xl: `(min-width: ${BP.xl}px)`,
  "2xl": `(min-width: ${BP["2xl"]}px)`,

  maxXs: `(max-width: ${BP.sm - 1}px)`,
  maxSm: `(max-width: ${BP.md - 1}px)`,
  maxMd: `(max-width: ${BP.lg - 1}px)`,
  maxLg: `(max-width: ${BP.xl - 1}px)`,
  maxXl: `(max-width: ${BP["2xl"] - 1}px)`,
} as const;

/** AppChrome masaüstü üst menü — viewport genişliği ≥ bu değer (Tailwind `lg` ile aynı; ~13"). */
export const SHELL_DESKTOP_MIN_WIDTH_PX = BP.lg;

/** Handheld shell (üst bar + alt bar) — viewport ≤ bu değer. */
export const SHELL_HANDHELD_MAX_WIDTH_PX = BP.lg - 1;

/** iPad Pro 12.9 landscape CSS width: 1366px; touch tablet desktop kabuğa düşmez. */
export const SHELL_TOUCH_TABLET_MAX_WIDTH_PX = 1366;

export const SHELL_TOUCH_TABLET_QUERY = `(hover: none) and (pointer: coarse) and (max-width: ${SHELL_TOUCH_TABLET_MAX_WIDTH_PX}px)`;
export const SHELL_LARGE_TABLET_VIEWPORT_QUERY = `(min-width: ${BP.lg}px) and (max-width: ${SHELL_TOUCH_TABLET_MAX_WIDTH_PX}px) and (min-height: 800px)`;
export const SHELL_HANDHELD_QUERY = `${MQ.maxMd}, ${SHELL_TOUCH_TABLET_QUERY}, ${SHELL_LARGE_TABLET_VIEWPORT_QUERY}`;

export type MediaQueryKey = keyof typeof MQ;
