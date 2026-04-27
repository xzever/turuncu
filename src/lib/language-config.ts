export const PLATFORM_LANGUAGE_CODES = ["tr", "en", "de", "ru", "fr"] as const;

export type PlatformLanguageCode = (typeof PLATFORM_LANGUAGE_CODES)[number];

export const PLATFORM_DEFAULT_LANGUAGE: PlatformLanguageCode = "tr";

export const PLATFORM_LANGUAGE_META: Record<
  PlatformLanguageCode,
  { name: string; locale: string }
> = {
  tr: { name: "Türkçe", locale: "tr-TR" },
  en: { name: "English", locale: "en-US" },
  de: { name: "Deutsch", locale: "de-DE" },
  ru: { name: "Русский", locale: "ru-RU" },
  fr: { name: "Français", locale: "fr-FR" },
};
