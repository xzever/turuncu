/**
 * Client-side UTM and campaign parameter capture for lead attribution.
 */

export interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
}

export function getUtmParams(): UtmParams {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);
  const result: UtmParams = {};

  const keys: (keyof UtmParams)[] = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "gclid",
    "fbclid",
  ];

  for (const key of keys) {
    const value = params.get(key);
    if (value) {
      result[key] = value.slice(0, 200);
    }
  }

  return Object.keys(result).length > 0 ? result : {};
}
