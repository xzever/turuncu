/**
 * i18n — Locale type definition
 * Used by referanslar and other multi-language components.
 */
export type Locale = "tr" | "en" | "de" | "ru" | "fr";

export const DEFAULT_LOCALE: Locale = "tr";
export const LOCALES = ["tr", "en", "de", "ru", "fr"] as const;
export const SUPPORTED_LOCALES: readonly Locale[] = LOCALES;
