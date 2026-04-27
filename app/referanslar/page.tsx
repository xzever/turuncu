import type { Metadata } from "next";
import ReferencesRouter from "@/components/referanslar/ReferencesRouter";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_URL } from "@/config/env";
import { REFERENCE_PROJECTS } from "./data";
import "./references-kesif.css";

const PATH = "/referanslar";
const TITLE = "Referanslar";
const DESC =
  "Turuncu Solar referans projeleri: sanayi, lojistik, tarım ve ticari segmentlerde teslim edilen on-grid, hibrit ve depolamalı sistem örnekleri.";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: TITLE,
    description: DESC,
    alternates: {
      canonical: PATH,
      languages: { "tr-TR": PATH, "x-default": PATH },
    },
    openGraph: {
      type: "website",
      locale: "tr_TR",
      url: new URL(PATH, SITE_URL).toString(),
      title: `${TITLE} | Turuncu Solar`,
      description: DESC,
      images: [{ url: "/referanslar.webp", width: 1200, height: 630, alt: "Turuncu Solar referans projeleri" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${TITLE} | Turuncu Solar`,
      description: DESC,
      images: ["/referanslar.webp"],
    },
    robots: { index: true, follow: true },
  };
}

const ITEM_LIST_ELEMENTS = REFERENCE_PROJECTS.slice(0, 20).map((p, i) => ({
  "@type": "ListItem" as const,
  position: i + 1,
  item: {
    "@type": "CreativeWork",
    name: p.title,
    image: `${SITE_URL}${p.image}`,
    about: p.sector,
  },
}));

const JSON_LD = [
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${TITLE} | Turuncu Solar`,
    url: `${SITE_URL}${PATH}`,
    description: DESC,
    inLanguage: "tr-TR",
    isPartOf: { "@type": "WebSite", name: "Turuncu Solar", url: SITE_URL },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: REFERENCE_PROJECTS.length,
      itemListElement: ITEM_LIST_ELEMENTS,
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: TITLE, item: `${SITE_URL}${PATH}` },
    ],
  },
];

export default function ReferencesPage() {
  return (
    <>
      <JsonLd data={JSON_LD} />
      <ReferencesRouter />
    </>
  );
}
