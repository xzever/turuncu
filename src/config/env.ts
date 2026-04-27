/**
 * Central environment config.
 * All env access goes through this module; no process.env in components or services.
 */

const RAW_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;
export const SITE_URL =
  typeof RAW_SITE_URL === "string" && /^https?:\/\//.test(RAW_SITE_URL)
    ? RAW_SITE_URL.replace(/\/+$/, "")
    : "https://www.turuncusolar.com";

export function getSiteUrl(): string {
  return SITE_URL;
}

export function getGoogleSiteVerification(): string | undefined {
  const value = process.env.GOOGLE_SITE_VERIFICATION?.trim();
  return value ? value : undefined;
}

export function getBingSiteVerification(): string | undefined {
  const value = process.env.BING_SITE_VERIFICATION?.trim();
  return value ? value : undefined;
}

/** Central contact email used in all forms across the site. */
export const CONTACT_EMAIL = "info@turuncusolar.com";
