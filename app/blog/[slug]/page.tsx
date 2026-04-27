import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BlogDetailShell from "@/components/blog/BlogDetailShell";
import JsonLd from "@/components/seo/JsonLd";
import "../blog-story.css";
import { SITE_URL } from "@/config/env";
import { staticBlog } from "@/lib/staticBlog";
import { GLOBAL_SEO_KEYWORDS_TR, mergeKeywords } from "@/lib/seoKeywords";

type RouteParams = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

function resolveBlogImage(url?: string | null): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("http")) return url;
  return url.startsWith("/") ? url : `/${url}`;
}

function buildAbsoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalized, SITE_URL).toString();
}

function stripHtml(value: string): string {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function resolvePostDescription(content: string, seoDescription?: string): string {
  const normalizedSeoDescription = seoDescription?.trim();
  if (normalizedSeoDescription) return normalizedSeoDescription;
  return stripHtml(content).slice(0, 160);
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const post = await staticBlog.getBySlug("tr", slug);
  if (!post || !post.publishedAt) return {};
  const blogSlug = "blog";
  /* Başlık formatı: "Yazı Adı | Blog"  →  template ile "Yazı Adı | Blog | Turuncu Solar"
     (layout template: "%s | Turuncu Solar"). SEO-optimal: yazı adı en başta,
     kategori breadcrumb ortada, marka sonda. */
  const rawTitle = post.seoTitle.trim() || post.title;
  const title = `${rawTitle} | Blog`;
  const description = resolvePostDescription(post.content, post.seoDescription);
  const canonicalPath = `/${blogSlug}/${post.slug}`;
  const ogImage = resolveBlogImage(post.featuredImage) ?? "/turuncsolar.jpeg";

  return {
    title,
    description,
    keywords: mergeKeywords(GLOBAL_SEO_KEYWORDS_TR, post.keywords),
    alternates: {
      canonical: canonicalPath,
      languages: {
        "tr-TR": canonicalPath,
        "x-default": canonicalPath,
      },
    },
    openGraph: {
      type: "article",
      locale: "tr_TR",
      url: buildAbsoluteUrl(canonicalPath),
      title,
      description,
      images: [
        {
          url: ogImage,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: { index: true, follow: true },
  };
}

export default async function BlogDetailPage({ params }: RouteParams) {
  const { slug } = await params;
  const post = await staticBlog.getBySlug("tr", slug);
  if (!post || !post.publishedAt) {
    notFound();
  }
  const posts = await staticBlog.list("tr", false);
  const blogSlug = "blog";
  const articleImage = resolveBlogImage(post.featuredImage);
  const articleUrl = buildAbsoluteUrl(`/${blogSlug}/${post.slug}`);
  const articleKeywords = mergeKeywords(GLOBAL_SEO_KEYWORDS_TR, post.keywords);
  const articleDescription = resolvePostDescription(post.content, post.seoDescription);
  const categoryName = post.categories?.[0]?.name
    ?? (post.categoryId ? post.categoryId.charAt(0).toUpperCase() + post.categoryId.slice(1) : undefined);

  /* BlogPosting: makale için daha spesifik schema.
     - dateModified: yoksa publishedAt (veri modelinde updatedAt yok)
     - description: SEO açıklama veya content özetinden türetilir
     - articleSection: kategori (varsa) */
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: articleDescription,
    url: articleUrl,
    keywords: articleKeywords.join(", "),
    datePublished: post.publishedAt,
    dateModified: post.publishedAt ?? post.createdAt,
    inLanguage: "tr-TR",
    articleSection: categoryName,
    image: articleImage ? [articleImage] : undefined,
    author: {
      "@type": "Organization",
      name: "Turuncu Solar",
      url: SITE_URL.replace(/\/+$/, ""),
    },
    publisher: {
      "@type": "Organization",
      name: "Turuncu Solar",
      url: SITE_URL.replace(/\/+$/, ""),
      logo: {
        "@type": "ImageObject",
        url: buildAbsoluteUrl("/turuncsolar.jpeg"),
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
  };

  /* BreadcrumbList — Ana Sayfa › Blog › (Kategori) › Yazı */
  const breadcrumbItems = [
    { name: "Ana Sayfa", item: buildAbsoluteUrl("/") },
    { name: "Blog", item: buildAbsoluteUrl(`/${blogSlug}`) },
    ...(categoryName
      ? [{ name: categoryName, item: buildAbsoluteUrl(`/${blogSlug}`) }]
      : []),
    { name: post.title, item: articleUrl },
  ];
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: b.name,
      item: b.item,
    })),
  };

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <BlogDetailShell posts={posts} locale="tr" basePath={`/${blogSlug}`} activePost={post} />
    </>
  );
}
