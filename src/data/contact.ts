export type ContactChannel = {
  type: "PHONE" | "WHATSAPP" | "EMAIL";
  value: string;
};

export type ContactLocation = {
  id: "ankara" | "mugla";
  name: string;
  shortName: string;
  tabLabel: string;
  isPrimary?: boolean;
  address: string;
  phone: string;
  email: string;
  channels: ContactChannel[];
};

export type ContactFollowLink = {
  id: "instagram" | "linkedin" | "youtube" | "whatsapp" | "email";
  label: string;
  value: string;
  href: string;
  aria: string;
};

export type ContactPageData = {
  pageSlug: string;
  pageTitle: string;
  requireConsent: boolean;
  kvkkUrl: string;
  systemTypes: Array<{ id: string; name: string }>;
  locations: ContactLocation[];
  followLinks: ContactFollowLink[];
  content: {
    labels: Record<string, string>;
  };
};

export const CONTACT_PAGE: ContactPageData = {
  pageSlug: "iletisim",
  pageTitle: "Bize ulaşın",
  requireConsent: true,
  kvkkUrl: "/kvkk",
  systemTypes: [
    { id: "grid", name: "Grid sistem" },
    { id: "hibrit", name: "Hibrit" },
    { id: "off-grid", name: "Off-grid" },
    { id: "diger", name: "Diğer" },
  ],
  locations: [
    {
      id: "ankara",
      name: "Ankara Ofisi",
      shortName: "Ankara",
      tabLabel: "Ankara",
      isPrimary: true,
      address: "Bilkent Plaza A3/17, Çankaya 06800",
      phone: "+90 312 285 66 67",
      email: "ankara@turuncusolar.com",
      channels: [
        { type: "PHONE", value: "+90 312 285 66 67" },
        { type: "WHATSAPP", value: "+90 312 285 66 67" },
        { type: "EMAIL", value: "ankara@turuncusolar.com" },
      ],
    },
    {
      id: "mugla",
      name: "Muğla Ofisi",
      shortName: "Muğla",
      tabLabel: "Muğla",
      address: "Bodrum Marina Plaza, 48400",
      phone: "+90 252 313 00 12",
      email: "mugla@turuncusolar.com",
      channels: [
        { type: "PHONE", value: "+90 252 313 00 12" },
        { type: "WHATSAPP", value: "+90 312 285 66 67" },
        { type: "EMAIL", value: "mugla@turuncusolar.com" },
      ],
    },
  ],
  followLinks: [
    {
      id: "instagram",
      label: "Instagram",
      value: "@turuncusolar",
      href: "https://instagram.com/turuncusolar",
      aria: "Instagram'da takip et",
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      value: "/company/turuncusolar",
      href: "https://linkedin.com/company/turuncusolar",
      aria: "LinkedIn'de takip et",
    },
    {
      id: "youtube",
      label: "YouTube",
      value: "@turuncusolar",
      href: "https://youtube.com/@turuncusolar",
      aria: "YouTube kanalını aç",
    },
    {
      id: "whatsapp",
      label: "WhatsApp",
      value: "+90 312 285 66 67",
      href: "https://wa.me/903122856667",
      aria: "WhatsApp ile yaz",
    },
    {
      id: "email",
      label: "Email",
      value: "info@turuncusolar.com",
      href: "mailto:info@turuncusolar.com",
      aria: "E-posta gönder",
    },
  ],
  content: {
    labels: {
      fullNamePlaceholder: "Adınız Soyadınız",
      emailFieldPlaceholder: "ornek@email.com",
      phoneFieldPlaceholder: "05XX XXX XX XX",
      messagePlaceholder: "Çatı, arazi, tüketim ve hedefinizi yazın...",
      submitLabel: "Gönder",
      submittingLabel: "Gönderiliyor...",
      successMessage: "Teşekkür ederiz. Ekibimiz en kısa sürede size dönüş yapacaktır.",
    },
  },
};

export const GENERAL_CONTACT_EMAIL = "info@turuncusolar.com";
