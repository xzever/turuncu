import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getSiteUrl } from "@/config/env";

const CONTACT_PATH = "/iletisim";

export const metadata: Metadata = {
  title: "İletişim",
  description:
    "Turuncu Solar iletişim sayfası: teklif talebi, keşif planlama, kurulum ve bakım süreçleri için doğrudan iletişim kanalları.",
  keywords: [
    "Turuncu Solar iletişim",
    "güneş enerjisi teklif talebi",
    "solar keşif planlama",
    "teknik destek iletişim",
    "İstanbul solar ofisi",
    "Antalya solar ofisi",
    "Ankara solar ofisi",
  ],
  alternates: {
    canonical: CONTACT_PATH,
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: new URL(CONTACT_PATH, getSiteUrl()).toString(),
    title: "İletişim | Turuncu Solar",
    description:
      "Teklif, keşif ve teknik destek için Turuncu Solar iletişim bilgileri ve şube konumları.",
    images: [
      {
        url: "/logo.svg",
        width: 512,
        height: 512,
        alt: "Turuncu Solar",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "İletişim | Turuncu Solar",
    description:
      "Teklif, keşif ve teknik destek için Turuncu Solar iletişim bilgileri ve şube konumları.",
    images: ["/logo.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function IletisimLayout({ children }: { children: ReactNode }) {
  return children;
}
