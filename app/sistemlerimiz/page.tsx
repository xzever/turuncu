import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/config/env";
import SistemlerimizRouter from "@/components/sistemlerimiz/SistemlerimizRouter";

const LOCALE = "tr";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata(LOCALE, "systems");
}

/**
 * ItemList JSON-LD — sistem mimarilerini arama motorlarına ürün serisi olarak tanıtır.
 * NOT: `sistemlerimiz-data.tsx` "use client" olduğu için server component olan bu page
 * dosyasından doğrudan import edilemiyor (runtime TypeError). Veri burada sabit tutulur;
 * data dosyası client component'lerde tüketilir. Faz 10'da veri JSX'ten ayrılıp ortak
 * server-safe modüle taşınabilir.
 */
const BASE_URL = SITE_URL.replace(/\/+$/, "");
const SYSTEMS_ITEMLIST_JSONLD = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Turuncu Solar Sistem Mimarileri",
  itemListOrder: "https://schema.org/ItemListOrderAscending",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "Service",
        name: "On-Grid",
        serviceType: "Şebeke Bağlantılı Mimari",
        url: `${BASE_URL}/sistemlerimiz#grid`,
        provider: { "@type": "Organization", name: "Turuncu Solar" },
        description:
          "Şebekeye bağlı çalışır. Gündüz üretilen elektriği önce kendi tüketimin için kullanır, üretim yetmezse sistem otomatik olarak şebekeden beslenir.",
      },
    },
    {
      "@type": "ListItem",
      position: 2,
      item: {
        "@type": "Service",
        name: "Hibrit Grid (Batarya Hazır)",
        serviceType: "Batarya Hazır Hibrit Mimari",
        url: `${BASE_URL}/sistemlerimiz#hybrid-no-battery`,
        provider: { "@type": "Organization", name: "Turuncu Solar" },
        description:
          "On-grid çalışma mantığı aynıdır. Farkı, hibrit inverter sayesinde sisteme daha sonra batarya eklenebilmesidir.",
      },
    },
    {
      "@type": "ListItem",
      position: 3,
      item: {
        "@type": "Service",
        name: "Off-Grid",
        serviceType: "Tam Bağımsız Mimari",
        url: `${BASE_URL}/sistemlerimiz#off-grid`,
        provider: { "@type": "Organization", name: "Turuncu Solar" },
        description:
          "Şebekeye erişimi olmayan alanlar için tam bağımsız kurulumdur. Üretim ve depolama tamamen saha içinde yönetilir.",
      },
    },
  ],
};

export default function SistemlerimizPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SYSTEMS_ITEMLIST_JSONLD) }}
      />
      <SistemlerimizRouter />
    </>
  );
}
