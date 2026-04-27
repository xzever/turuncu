import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/env";

export default function robots(): MetadataRoute.Robots {
  const base = SITE_URL.replace(/\/+$/, "");
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Faz 01 UI Kit preview sayfası — dev-only galeri, prod crawl dışı.
      disallow: ["/preview/"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
