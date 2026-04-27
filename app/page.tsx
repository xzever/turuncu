import { type Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_URL } from "@/config/env";
import HomeRouter from "@/components/home/HomeRouter";
import "./page.css";
import "./page-mobile.css";

const TITLE = "Ana Sayfa";
const DESC =
  "Turuncu Solar — sanayi, lojistik, tarım ve ticari segmentlerde anahtar teslim güneş enerjisi (GES) sistemleri: on-grid, hibrit ve depolamalı çözümler.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/", languages: { "tr-TR": "/", "x-default": "/" } },
};

const JSON_LD = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Turuncu Solar",
    url: SITE_URL,
    inLanguage: "tr-TR",
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/blog?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Turuncu Solar",
    url: SITE_URL,
    image: `${SITE_URL}/turuncsolar.jpeg`,
    telephone: "+90-312-285-66-67",
    email: "info@turuncusolar.com",
    priceRange: "₺₺₺",
    areaServed: { "@type": "Country", name: "Türkiye" },
    description: DESC,
  },
];

export default function Page() {
  return (
    <>
      <JsonLd data={JSON_LD} />
      <HomeRouter />
    </>
  );
}
