import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./references-kesif.css";

const RAW_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;
const SITE_URL = RAW_SITE_URL && /^https?:\/\//.test(RAW_SITE_URL) ? RAW_SITE_URL : "https://www.turuncusolar.com";
const REFERENCES_PATH = "/referanslar";

export const metadata: Metadata = {
  title: "Referanslar",
  description:
    "Turuncu Solar referans projeleri: sanayi, lojistik, tarım ve ticari segmentlerde teslim edilen on-grid, hibrit ve depolamalı sistem örnekleri.",
  keywords: [
    "turuncu solar referanslar",
    "ges referans projeleri",
    "çatı ges referans",
    "depolamalı güneş sistemi",
    "kurumsal ges projeleri",
  ],
  alternates: {
    canonical: REFERENCES_PATH,
    languages: {
      "tr-TR": REFERENCES_PATH,
      "x-default": REFERENCES_PATH,
    },
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: new URL(REFERENCES_PATH, SITE_URL).toString(),
    title: "Referanslar | Turuncu Solar",
    description:
      "Farklı sektörlerde devreye alınan güneş enerjisi sistemlerinden seçilmiş referans projeler.",
    images: [
      {
        url: "/turuncsolar.jpeg",
        width: 1200,
        height: 630,
        alt: "Turuncu Solar referans proje sayfası",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Referanslar | Turuncu Solar",
    description: "Sektör bazlı seçilmiş güneş enerjisi referans projeleri.",
    images: ["/turuncsolar.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ReferencesLayout({ children }: { children: ReactNode }) {
  return children;
}
