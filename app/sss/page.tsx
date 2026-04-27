import type { Metadata } from "next";
import SolarVideoBackground from "@/components/effects/SolarVideoBackground";
import SssPageContent from "@/components/sss/SssPageContent";
import { FAQS, getFaqAnswerText } from "@/components/sss/faqs";
import "@/styles/components/solstice/solstice-tokens-v2.css";
import "./sss-page.css";
import "./sss-mobile.css";
import "./sss-desktop.css";

const RAW_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;
const SITE_URL =
  RAW_SITE_URL && /^https?:\/\//.test(RAW_SITE_URL) ? RAW_SITE_URL : "https://www.turuncusolar.com";
const SSS_PATH = "/sss";
const SSS_URL = new URL(SSS_PATH, SITE_URL).toString();

export const metadata: Metadata = {
  title: "SSS | Turuncu Solar",
  description:
    "Güneş enerjisi kurulumu, maliyetler, bakım ve izin süreçleri hakkında sık sorulan sorular.",
  alternates: {
    canonical: SSS_URL,
    languages: {
      "tr-TR": SSS_URL,
      "x-default": SSS_URL,
    },
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: SSS_URL,
    title: "SSS | Turuncu Solar",
    description:
      "Güneş enerjisi kurulumu, maliyet, bakım, izin ve garanti hakkında sık sorulan sorular.",
    images: [
      {
        url: "/sistemlerimiz.webp",
        width: 1200,
        height: 630,
        alt: "Turuncu Solar SSS",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SSS | Turuncu Solar",
    description:
      "Güneş enerjisi kurulumu, maliyet, bakım, izin ve garanti hakkında sık sorulan sorular.",
    images: ["/sistemlerimiz.webp"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const FAQ_JSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.title,
    acceptedAnswer: {
      "@type": "Answer",
      text: getFaqAnswerText(faq.id),
    },
  })),
};

export default function SssPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSONLD) }}
      />
      <SolarVideoBackground />
      <SssPageContent />
    </>
  );
}
