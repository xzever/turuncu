/**
 * Site geneli SEO anahtar ifadeleri — meta keywords, JSON-LD (ekranda gösterilmez).
 * İstenen arama varyantları: evges, gesev, solaenerji, güneş enerjisi/paneli, Turuncu Solar.
 */

export const GLOBAL_SEO_KEYWORDS_TR: readonly string[] = [
  "evges",
  "gesev",
  "solaenerji",
  "solar enerji",
  "güneş enerjisi",
  "güneşenerjisi",
  "güneş paneli",
  "güneşpaneli",
  "turuncu solar",
  "Turuncu Solar",
  "turuncusolar",
  "GES",
  "çatı GES",
  "photovoltaik",
];

export function mergeKeywords(...groups: (readonly string[] | undefined)[]): string[] {
  const set = new Set<string>();
  for (const g of groups) {
    if (!g) continue;
    for (const k of g) {
      const t = k.trim();
      if (t) set.add(t);
    }
  }
  return [...set];
}
