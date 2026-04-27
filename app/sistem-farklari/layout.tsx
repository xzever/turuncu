import type { Metadata } from "next";
import type { ReactNode } from "react";

const RAW_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;
const SITE_URL = RAW_SITE_URL && /^https?:\/\//.test(RAW_SITE_URL) ? RAW_SITE_URL : "https://www.turuncusolar.com";
const PATH = "/sistem-farklari";

export const metadata: Metadata = {
  title: "Sistem Farkları",
  description:
    "Grid, Hibrit ve Off-Grid güneş enerjisi sistemlerinin 7 kriterde karşılaştırılması.",
  alternates: {
    canonical: PATH,
    languages: {
      "tr-TR": PATH,
      "x-default": PATH,
    },
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: new URL(PATH, SITE_URL).toString(),
    title: "Sistem Farkları | Turuncu Solar",
    description:
      "Grid, Hibrit ve Off-Grid güneş enerjisi sistemlerinin 7 kriterde karşılaştırılması.",
    images: [
      {
        url: "/center-villa-light.webp",
        width: 1200,
        height: 630,
        alt: "Turuncu Solar sistem farkları",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SistemFarklariLayout({ children }: { children: ReactNode }) {
  return children;
}
