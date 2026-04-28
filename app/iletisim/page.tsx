import type { Metadata } from "next";
import IletisimRouter from "@/components/iletisim/IletisimRouter";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_URL } from "@/config/env";
import { CONTACT_PAGE, GENERAL_CONTACT_EMAIL } from "@/data/contact";
import "./iletisim-mobile.css";
import "@/styles/components/solstice/solstice-tokens.css";
import "@/styles/components/solstice/solstice-tokens-v2.css";
import "@/styles/components/solstice/solstice-components.css";

const LOCALE = "tr";
const PATH = "/iletisim";
const TITLE = "İletişim";
const DESC =
  "Turuncu Solar Ankara ve Muğla irtibat ofisleri. Güneş enerjisi projeleri için teklif, destek, WhatsApp ve yol tarifi bilgileri.";
const OG_IMAGE = "/turuncsolar.jpeg";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: {
    canonical: PATH,
    languages: { "tr-TR": PATH, "x-default": PATH },
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: PATH,
    title: `${TITLE} | Turuncu Solar`,
    description: DESC,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Turuncu Solar iletişim" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} | Turuncu Solar`,
    description: DESC,
    images: [OG_IMAGE],
  },
  robots: { index: true, follow: true },
};

const CONTACT_JSON_LD = [
  {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: `${TITLE} | Turuncu Solar`,
    url: `${SITE_URL}${PATH}`,
    description: DESC,
    inLanguage: "tr-TR",
    isPartOf: { "@type": "WebSite", name: "Turuncu Solar", url: SITE_URL },
    mainEntity: {
      "@type": "Organization",
      name: "Turuncu Solar",
      url: SITE_URL,
      email: GENERAL_CONTACT_EMAIL,
      telephone: CONTACT_PAGE.locations[0].phone,
      contactPoint: CONTACT_PAGE.locations.map((location) => ({
        "@type": "ContactPoint",
        name: location.name,
        telephone: location.phone,
        email: location.email,
        contactType: "sales",
        areaServed: "TR",
        availableLanguage: ["Turkish", "English"],
      })),
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

export default function IletisimRoutePage() {
  return (
    <>
      <JsonLd data={CONTACT_JSON_LD} />
      <IletisimRouter locale={LOCALE} contactPage={CONTACT_PAGE} />
    </>
  );
}
