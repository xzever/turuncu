import type { Metadata } from "next";
import BlogStorySecenekler from "@/components/blog/BlogStorySecenekler";
import "./secenekler.css";

const RAW_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;
const SITE_URL =
  RAW_SITE_URL && /^https?:\/\//.test(RAW_SITE_URL)
    ? RAW_SITE_URL
    : "https://www.turuncusolar.com";
const PATH = "/blog/secenekler";
const PAGE_TITLE = "Blog Tasarim Se�enekleri | Turuncu Solar";
const PAGE_DESC =
  "Blog hik�ye popup'i i�in dahili tasarim varyasyonlari. Sadece i� kullanimda, indekslenmez.";
const OG_IMAGE = "/sistemlerimiz.webp";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: {
    canonical: PATH,
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: new URL(PATH, SITE_URL).toString(),
    title: PAGE_TITLE,
    description: PAGE_DESC,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Turuncu Solar blog tasarim se�enekleri",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESC,
    images: [OG_IMAGE],
  },
  robots: { index: false, follow: false },
};

export default function BlogStorySecenekleriPage() {
  return <BlogStorySecenekler />;
}
