import type { Metadata } from "next";
import type { ReactNode } from "react";

const RAW_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;
const SITE_URL = RAW_SITE_URL && /^https?:\/\//.test(RAW_SITE_URL) ? RAW_SITE_URL : "https://www.turuncusolar.com";
const SYSTEMS_PATH = "/sistemlerimiz";

export const metadata: Metadata = {
  title: "Sistemlerimiz",
  description:
    "Grid, hibrit ve off-grid güneş enerjisi sistem mimarilerini karşılaştırmalı olarak sunan Turuncu Solar sistemlerimiz sayfası.",
  alternates: {
    canonical: SYSTEMS_PATH,
    languages: {
      "tr-TR": SYSTEMS_PATH,
      "x-default": SYSTEMS_PATH,
    },
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: new URL(SYSTEMS_PATH, SITE_URL).toString(),
    title: "Sistemlerimiz | Turuncu Solar",
    description:
      "Grid, hibrit ve off-grid güneş enerjisi sistem mimarilerini karşılaştırmalı olarak sunan Turuncu Solar sistemlerimiz sayfası.",
    images: [
      {
        url: "/center-villa-light.webp",
        width: 1200,
        height: 630,
        alt: "Turuncu Solar sistem çözümleri",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sistemlerimiz | Turuncu Solar",
    description:
      "Grid, hibrit ve off-grid güneş enerjisi sistem mimarilerini karşılaştırmalı olarak sunan Turuncu Solar sistemlerimiz sayfası.",
    images: ["/center-villa-light.webp"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SistemlerimizLayout({ children }: { children: ReactNode }) {
  return children;
}
