/**
 * SEO metadata builder.
 * Keeps shared route metadata aligned with AGENTS.md page-level SEO rules.
 */
import type { Metadata } from "next";

import { SITE_URL } from "@/config/env";

type PageId =
  | "blog"
  | "referanslar"
  | "sss"
  | "iletisim"
  | "hakkimizda"
  | "sistemlerimiz"
  | "systems"
  | "sistem-farklari";

type PageMetadata = {
  titleTr: string;
  titleEn: string;
  descTr: string;
  descEn: string;
  path: string;
};

const DEFAULT_IMAGE = "/turuncsolar.jpeg";

const PAGE_METADATA: Record<PageId, PageMetadata> = {
  blog: {
    titleTr: "Blog | Turuncu Solar",
    titleEn: "Blog | Turuncu Solar",
    descTr: "Turuncu Solar Blog: gunes enerjisi sistemleri hakkinda teknik ve operasyonel icerikler.",
    descEn: "Turuncu Solar Blog: technical and operational content about solar energy systems.",
    path: "/blog",
  },
  referanslar: {
    titleTr: "Referanslar | Turuncu Solar",
    titleEn: "References | Turuncu Solar",
    descTr: "Turuncu Solar referans projeleri.",
    descEn: "Turuncu Solar reference projects.",
    path: "/referanslar",
  },
  sss: {
    titleTr: "SSS | Turuncu Solar",
    titleEn: "FAQ | Turuncu Solar",
    descTr: "Sikca sorulan sorular ve yanitlar.",
    descEn: "Frequently asked questions and answers.",
    path: "/sss",
  },
  iletisim: {
    titleTr: "Iletisim | Turuncu Solar",
    titleEn: "Contact | Turuncu Solar",
    descTr: "Turuncu Solar ile iletisime gecin.",
    descEn: "Get in touch with Turuncu Solar.",
    path: "/iletisim",
  },
  hakkimizda: {
    titleTr: "Hakkimizda | Turuncu Solar",
    titleEn: "About Us | Turuncu Solar",
    descTr: "Turuncu Solar hakkinda bilgi.",
    descEn: "About Turuncu Solar.",
    path: "/hakkimizda",
  },
  sistemlerimiz: {
    titleTr: "Sistemlerimiz | Turuncu Solar",
    titleEn: "Our Systems | Turuncu Solar",
    descTr: "Gunes enerjisi sistemleri.",
    descEn: "Solar energy systems.",
    path: "/sistemlerimiz",
  },
  systems: {
    titleTr: "Sistemlerimiz | Turuncu Solar",
    titleEn: "Our Systems | Turuncu Solar",
    descTr: "Gunes enerjisi sistemleri.",
    descEn: "Solar energy systems.",
    path: "/sistemlerimiz",
  },
  "sistem-farklari": {
    titleTr: "Sistem Farklari | Turuncu Solar",
    titleEn: "System Differences | Turuncu Solar",
    descTr: "Grid, Hibrit ve Off-Grid gunes enerjisi sistemlerinin 7 kriterde karsilastirilmasi.",
    descEn: "Grid, Hybrid and Off-Grid solar energy systems compared across 7 criteria.",
    path: "/sistem-farklari",
  },
};


/**
 * Sayfa-bazlı metadata builder (stub — sandbox cut'tan recovery).
 * Mevcut metadata config'lerini Next.js Metadata tipine dönüştürür.
 */
export async function buildPageMetadata(locale: string, pageId: PageId): Promise<Metadata> {
  const meta =
    PAGE_METADATA[pageId] ?? {
      titleTr: "Turuncu Solar",
      titleEn: "Turuncu Solar",
      descTr: "Gunes enerjisi sistemleri.",
      descEn: "Solar energy systems.",
      path: "/",
    };

  const isTr = locale === "tr";
  const title = isTr ? meta.titleTr : meta.titleEn;
  const description = isTr ? meta.descTr : meta.descEn;
  const canonical = new URL(meta.path, SITE_URL).toString();

  return {
    title,
    description,
    alternates: {
      canonical: meta.path,
    },
    openGraph: {
      type: "website",
      locale: isTr ? "tr_TR" : "en_US",
      url: canonical,
      title,
      description,
      images: [
        {
          url: DEFAULT_IMAGE,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_IMAGE],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
