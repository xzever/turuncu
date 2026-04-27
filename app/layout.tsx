import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import AppChrome from "@/components/layout/AppChrome";
import CookieConsent from "@/components/legal/CookieConsent";
import { GLOBAL_SEO_KEYWORDS_TR } from "@/lib/seoKeywords";
import { DeviceProvider, type DeviceType } from "../src/components/layout/DeviceProvider";
import "@/styles/globals.css";
import "@/styles/mobile-foundation.css";
import "@/styles/components/mobile-page-frame.css";
import "@/styles/components/mobile/index.css";

const PLATFORM_LANGUAGE_CODES = ["tr", "en", "de", "ru", "fr"] as const;
type PlatformLanguageCode = (typeof PLATFORM_LANGUAGE_CODES)[number];
const PLATFORM_DEFAULT_LANGUAGE: PlatformLanguageCode = "tr";

const RAW_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;
const SITE_URL =
  typeof RAW_SITE_URL === "string" && /^https?:\/\//.test(RAW_SITE_URL)
    ? RAW_SITE_URL.replace(/\/+$/, "")
    : "https://www.turuncusolar.com";

function getSiteUrl(): string {
  return SITE_URL;
}

function getDeviceType(ua: string): DeviceType {
  if (/iPhone|Android.+Mobile/.test(ua)) return "mobile";
  // iPad Pro 13"+ ve iOS 13+ Safari "Request Desktop" varsayılanı: UA'da "iPad"
  // yerine "Macintosh" + "Mobile/" markeri gönderir; touch destekli "Macintosh"
  // olarak tanı: tablet say.
  if (/iPad|Tablet|Android(?!.*Mobile)/.test(ua)) return "tablet";
  if (/Macintosh.*(?:Mobile\/|Version\/.*Safari)/.test(ua) && /Mobile\//.test(ua)) return "tablet";
  return "desktop";
}

const DEFAULT_TITLE = "Turuncu Solar";
const DEFAULT_DESC =
  "Turuncu Solar — sanayi, lojistik, tarım ve ticari segmentlerde anahtar teslim güneş enerjisi (GES) sistemleri: on-grid, hibrit ve depolamalı çözümler.";
const DEFAULT_OG_IMAGE = "/turuncsolar.jpeg";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: { default: DEFAULT_TITLE, template: "%s | Turuncu Solar" },
  description: DEFAULT_DESC,
  keywords: [...GLOBAL_SEO_KEYWORDS_TR],
  applicationName: "Turuncu Solar",
  authors: [{ name: "Turuncu Solar" }],
  referrer: "origin-when-cross-origin",
  formatDetection: { email: false, address: false, telephone: false },
  alternates: {
    canonical: "/",
    languages: { "tr-TR": "/", "x-default": "/" },
  },
  openGraph: {
    type: "website",
    siteName: "Turuncu Solar",
    locale: "tr_TR",
    url: getSiteUrl(),
    title: DEFAULT_TITLE,
    description: DEFAULT_DESC,
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: "Turuncu Solar — Güneş Enerjisi Sistemleri" }],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESC,
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

/* Site-wide Organization JSON-LD (structured data) */
const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Turuncu Solar",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.svg`,
  description: DEFAULT_DESC,
  sameAs: ["https://www.linkedin.com/company/turuncusolar", "https://www.instagram.com/turuncusolar"],
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+90-312-285-66-67",
      contactType: "customer service",
      email: "info@turuncusolar.com",
      areaServed: "TR",
      availableLanguage: ["Turkish", "English"],
    },
  ],
};


// Anayasa Madde 2.1 — viewport-fit=cover safe-area için zorunlu,
// userScalable=true WCAG 1.4.4 (zoom yasağı yasak)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  userScalable: true,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const requestHeaders = await headers();
  const requestedLocale = requestHeaders.get("x-site-locale")?.toLowerCase() ?? PLATFORM_DEFAULT_LANGUAGE;
  const htmlLang = PLATFORM_LANGUAGE_CODES.includes(requestedLocale as PlatformLanguageCode)
    ? requestedLocale
    : PLATFORM_DEFAULT_LANGUAGE;
  const skipToMainLabel = htmlLang === "tr" ? "Ana içeriğe geç" : "Skip to main content";

  const ua = requestHeaders.get("user-agent") ?? "";
  const device = getDeviceType(ua);
  /**
   * SSR anlık görüntü: tablet/mobil UA’da üst menü üretme.
   * İstemcide gerçek eşik `useWideNavLayout` → viewport ≥1280px (`MQ.lg`, ~13").
   */
  const ssrWideNav = device === "desktop";

  return (
    <html lang={htmlLang} data-device={device}>
      <body
        className="antialiased flex min-h-[100dvh] flex-col"
        suppressHydrationWarning
      >
        {/* Site-wide JSON-LD Organization (Google SEO structured data) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD) }}
        />
        <DeviceProvider device={device}>
          <a href="#main-content" className="skip-to-main">
            {skipToMainLabel}
          </a>
          {/* NOT: Suspense boundary AppChrome'un iç kısmına (useSearchParams)
              taşındı. Root'ta sarmak, stream swap script'i ($RC) tarayıcı
              eklentilerinin DOM enjeksiyonuyla takıldığında tüm sayfayı
              fallback'te bırakıyordu. Burada sayfa içeriği sunum sırasında
              Suspense'a bağımlı değil. */}
          <AppChrome ssrWideNav={ssrWideNav}>{children}</AppChrome>
          <CookieConsent />
        </DeviceProvider>
      </body>
    </html>
  );
}
