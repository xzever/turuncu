import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SITE_URL } from "@/config/env";
import { GLOBAL_SEO_KEYWORDS_TR, mergeKeywords } from "@/lib/seoKeywords";
const BLOG_PATH = "/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Turuncu Solar Blog: güneş enerjisi sistem seçimi, kurulum süreçleri, teknik detaylar, bakım ve enerji ekonomisi içerikleri.",
  keywords: mergeKeywords(GLOBAL_SEO_KEYWORDS_TR, [
    "turuncu solar blog",
    "güneş enerjisi blog",
    "on-grid",
    "hibrit sistem",
    "off-grid sistem",
    "ges kurulumu",
    "solar yatırım geri ödeme",
  ]),
  alternates: {
    canonical: BLOG_PATH,
    languages: {
      "tr-TR": BLOG_PATH,
      "x-default": BLOG_PATH,
    },
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: new URL(BLOG_PATH, SITE_URL).toString(),
    title: "Blog | Turuncu Solar",
    description:
      "Güneş enerjisi sistemleri hakkında teknik ve operasyonel içerikler.",
    images: [
      {
        url: "/turuncsolar.jpeg",
        width: 1200,
        height: 630,
        alt: "Turuncu Solar Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Turuncu Solar",
    description: "Güneş enerjisi sistemleri hakkında teknik ve operasyonel içerikler.",
    images: ["/turuncsolar.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function BlogLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
