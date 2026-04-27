import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/env";
import { staticBlog } from "@/lib/staticBlog";

/** Ana site rotaları — yeni sayfa eklendiğinde buraya ekleyin (tasarım değişmez). */
const CORE_PATHS = [
  "",
  "/blog",
  "/hakkimizda",
  "/iletisim",
  "/referanslar",
  "/sistem-farklari",
  "/sistemlerimiz",
  "/sss",
  "/kvkk",
  "/gizlilik",
  "/kullanim-kosullari",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await staticBlog.list("tr", false);
  const base = SITE_URL.replace(/\/+$/, "");

  const core: MetadataRoute.Sitemap = CORE_PATHS.map((path, index) => ({
    url: path === "" ? `${base}/` : `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: index === 0 ? ("daily" as const) : ("weekly" as const),
    priority: path === "" ? 1 : path === "/blog" ? 0.95 : 0.85,
  }));

  const blogPosts: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: p.publishedAt ? new Date(p.publishedAt) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...core, ...blogPosts];
}
