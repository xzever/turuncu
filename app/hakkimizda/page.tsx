import { type Metadata } from "next";
import HakkimizdaRouter from "@/components/kurumsal/HakkimizdaRouter";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_URL } from "@/config/env";

const PATH = "/hakkimizda";
const TITLE = "Hakkımızda";
const DESC = "Turuncu Solar kurumsal profil, mühendislik yaklaşımı ve sürdürülebilirlik politikamız.";
const OG_IMAGE = "/hakkimizda.webp";
const PAGE_URL = new URL(PATH, SITE_URL).toString();
const OG_IMAGE_URL = new URL(OG_IMAGE, SITE_URL).toString();

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: {
    canonical: PAGE_URL,
    languages: { "tr-TR": PAGE_URL, "x-default": PAGE_URL },
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: PAGE_URL,
    title: `${TITLE} | Turuncu Solar`,
    description: DESC,
    images: [{ url: OG_IMAGE_URL, width: 1200, height: 630, alt: "Hakkımızda — Turuncu Solar" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} | Turuncu Solar`,
    description: DESC,
    images: [OG_IMAGE_URL],
  },
  robots: { index: true, follow: true },
};

const JSON_LD = [
  {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: `${TITLE} | Turuncu Solar`,
    url: PAGE_URL,
    description: DESC,
    primaryImageOfPage: OG_IMAGE_URL,
    inLanguage: "tr-TR",
    isPartOf: { "@type": "WebSite", name: "Turuncu Solar", url: SITE_URL },
    about: {
      "@type": "Organization",
      name: "Turuncu Solar",
      url: SITE_URL,
      description:
        "Sanayi, lojistik, tarım ve ticari segmentlerde anahtar teslim güneş enerjisi sistemleri sağlayan mühendislik şirketi.",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: TITLE, item: PAGE_URL },
    ],
  },
];

export default function HakkimizdaPage() {
  return (
    <>
      <JsonLd data={JSON_LD} />
      <HakkimizdaRouter />
    </>
  );
}
