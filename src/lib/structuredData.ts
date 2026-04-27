import { SITE_URL } from "@/config/env";

type BreadcrumbItem = {
  name: string;
  path: string;
};

function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildPageBreadcrumbJsonLd(name: string, path: string) {
  return buildBreadcrumbJsonLd([
    { name: "Ana Sayfa", path: "/" },
    { name, path },
  ]);
}
