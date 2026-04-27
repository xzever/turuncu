import type { Metadata } from "next";
import IletisimRouter from "@/components/iletisim/IletisimRouter";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_URL } from "@/config/env";
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

const CONTACT_PAGE = {
  pageSlug: "iletisim",
  pageTitle: "Bize ulaşın",
  requireConsent: true,
  kvkkUrl: "/kvkk",
  categories: [
    { id: "teklif", name: "Teklif Talebi" },
    { id: "destek", name: "Teknik Destek" },
    { id: "ortaklik", name: "İş Ortaklığı" },
    { id: "genel", name: "Genel Bilgi" },
  ],
  systemTypes: [
    { id: "grid", name: "Grid sistem" },
    { id: "hibrit", name: "Hibrit" },
    { id: "off-grid", name: "Off-grid" },
    { id: "diger", name: "Diğer" },
  ],
  locations: [
    {
      id: "ankara",
      name: "Ankara İrtibat Ofisi",
      tabLabel: "Ankara",
      isPrimary: true,
      address: "Üniversiteler Mah. 1598 Cad. Bilkent Plaza A3/17, Bilkent, Çankaya / Ankara",
      note: "Kamu, sanayi ve ticari projeler için irtibat ofisi",
      coverImage: "/about-hero.webp",
      mapLink:
        "https://maps.google.com/?q=%C3%9Cniversiteler+Mah.+1598+Cad.+Bilkent+Plaza+A3%2F17+Bilkent+%C3%87ankaya+Ankara",
      channels: [
        { type: "PHONE", value: "+90 312 285 66 67" },
        { type: "WHATSAPP", value: "+90 312 285 66 67" },
        { type: "EMAIL", value: "info@turuncusolar.com" },
      ],
      workingHours: [
        { dayOfWeek: "MONDAY", openTime: "09:00", closeTime: "18:00" },
        { dayOfWeek: "TUESDAY", openTime: "09:00", closeTime: "18:00" },
        { dayOfWeek: "WEDNESDAY", openTime: "09:00", closeTime: "18:00" },
        { dayOfWeek: "THURSDAY", openTime: "09:00", closeTime: "18:00" },
        { dayOfWeek: "FRIDAY", openTime: "09:00", closeTime: "18:00" },
        { dayOfWeek: "SATURDAY", openTime: "", closeTime: "", isClosed: true },
        { dayOfWeek: "SUNDAY", openTime: "", closeTime: "", isClosed: true },
      ],
    },
    {
      id: "mugla",
      name: "Muğla İrtibat Ofisi",
      tabLabel: "Muğla",
      address: "Emek Milas Mh. Muğla Karadağ Cd. No:38/1, Muğla",
      note: "Turizm, tarım ve arazi projeleri için bölgesel destek",
      coverImage: "/about-hero.webp",
      mapLink:
        "https://maps.google.com/?q=Emek+Milas+Mh.+Mu%C4%9Fla+Karada%C4%9F+Cd.+No%3A38%2F1+Mu%C4%9Fla",
      channels: [
        { type: "PHONE", value: "+90 312 285 66 67" },
        { type: "WHATSAPP", value: "+90 312 285 66 67" },
        { type: "EMAIL", value: "info@turuncusolar.com" },
      ],
      workingHours: [
        { dayOfWeek: "MONDAY", openTime: "09:00", closeTime: "18:00" },
        { dayOfWeek: "TUESDAY", openTime: "09:00", closeTime: "18:00" },
        { dayOfWeek: "WEDNESDAY", openTime: "09:00", closeTime: "18:00" },
        { dayOfWeek: "THURSDAY", openTime: "09:00", closeTime: "18:00" },
        { dayOfWeek: "FRIDAY", openTime: "09:00", closeTime: "18:00" },
        { dayOfWeek: "SATURDAY", openTime: "", closeTime: "", isClosed: true },
        { dayOfWeek: "SUNDAY", openTime: "", closeTime: "", isClosed: true },
      ],
    },
  ],
  content: {
    labels: {
      branchBadgeLabel: "İletişim",
      phoneLabel: "Telefon",
      whatsappLabel: "WhatsApp",
      emailLabel: "E-Posta",
      hoursLabel: "Çalışma Saatleri",
      addressLabel: "Adres",
      callButtonLabel: "Ara",
      emailActionLabel: "E-Posta",
      directionsButtonLabel: "Yol Tarifi",
      whatsappButtonLabel: "WhatsApp",
      mapButtonLabel: "Haritada Aç",
      locationEmptyMessage: "Size en yakın şubemiz ve iletişim kanallarımız burada yer alır.",
      formTitle: "Mesaj",
      formDescription: "Mesajınızı bırakın, en kısa sürede dönüş yapalım.",
      fullNameLabel: "Ad Soyad",
      fullNamePlaceholder: "Adınız Soyadınız",
      fullNameError: "Lütfen adınızı girin.",
      emailFieldLabel: "E-Posta",
      emailFieldPlaceholder: "ornek@email.com",
      phoneFieldLabel: "Telefon",
      phoneFieldPlaceholder: "05XX XXX XX XX",
      systemTypeLabel: "Sistem tipi",
      messageLabel: "Mesajınız",
      messagePlaceholder: "Çatı, arazi, tüketim ve hedefinizi yazın...",
      messageError: "Mesajınız en az 10 karakter olmalıdır.",
      submitLabel: "Gönder",
      submittingLabel: "Gönderiliyor...",
      successMessage: "Teşekkür ederiz. Ekibimiz en kısa sürede size dönüş yapacaktır.",
      requestError: "Gönderim sırasında bir sorun oluştu. Lütfen tekrar deneyin.",
    },
    settings: {
      showCategoryField: false,
      showLocationField: false,
      showDepartmentField: false,
      showCompanyField: false,
      showSubjectField: false,
      showProvinceField: false,
      showDistrictField: false,
    },
  },
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
      email: "info@turuncusolar.com",
      telephone: "+90-312-285-66-67",
      contactPoint: CONTACT_PAGE.locations.map((location) => ({
        "@type": "ContactPoint",
        name: location.name,
        telephone: "+90-312-285-66-67",
        email: "info@turuncusolar.com",
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
