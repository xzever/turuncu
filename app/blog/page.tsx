import type { Metadata } from "next";
import BlogRouter from "@/components/blog/BlogRouter";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_URL } from "@/config/env";
import { staticBlog } from "@/lib/staticBlog";
import { GLOBAL_SEO_KEYWORDS_TR, mergeKeywords } from "@/lib/seoKeywords";
import "../referanslar/references-kesif.css";
import "./blog-story.css";

export const dynamic = "force-dynamic";

const BLOG_LIST_DESCRIPTION =
  "Turuncu Solar Blog: güneş enerjisi sistemleri hakkında teknik ve operasyonel içerikler.";

const blogListingJsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Turuncu Solar Blog",
  description: BLOG_LIST_DESCRIPTION,
  url: `${SITE_URL.replace(/\/+$/, "")}/blog`,
  inLanguage: "tr-TR",
  keywords: GLOBAL_SEO_KEYWORDS_TR.join(", "),
  publisher: {
    "@type": "Organization",
    name: "Turuncu Solar",
    url: SITE_URL.replace(/\/+$/, ""),
  },
};

function resolveBlogImage(url?: string | null): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("http")) return url;
  return url.startsWith("/") ? url : `/${url}`;
}

export async function generateMetadata(): Promise<Metadata> {
  const posts = await staticBlog.list("tr", false);
  const title = "Blog | Turuncu Solar";
  const description = BLOG_LIST_DESCRIPTION;
  const ogImage = resolveBlogImage(posts[0]?.featuredImage) ?? "/turuncsolar.jpeg";

  return {
    title,
    description,
    keywords: mergeKeywords(GLOBAL_SEO_KEYWORDS_TR, [
      "blog",
      "güneş enerjisi blog",
      "GES blog",
    ]),
    alternates: {
      canonical: "/blog",
      languages: {
        "tr-TR": "/blog",
        "x-default": "/blog",
      },
    },
    openGraph: {
      type: "website",
      locale: "tr_TR",
      url: new URL("/blog", SITE_URL).toString(),
      title,
      description,
      images: [
        {
          url: ogImage,
          alt: title,
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

export default async function BlogPage() {
  const posts = await staticBlog.list("tr", false);
  return (
    <>
      <JsonLd data={blogListingJsonLd} />
      <BlogRouter posts={posts} basePath="/blog" />
    </>
  );
}
