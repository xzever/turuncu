export const SOCIAL_LINKS = [
  {
    kind: "mail",
    href: "mailto:info@turuncusolar.com",
    label: "info@turuncusolar.com",
    aria: "E-posta gonder",
  },
  {
    kind: "instagram",
    href: "https://instagram.com/turuncusolar",
    label: "@turuncusolar",
    aria: "Instagram",
  },
  {
    kind: "linkedin",
    href: "https://linkedin.com/company/turuncusolar",
    label: "Turuncu Solar",
    aria: "LinkedIn",
  },
  {
    kind: "youtube",
    href: "https://youtube.com/@turuncusolar",
    label: "Turuncu Solar",
    aria: "YouTube",
  },
] as const;

export type SocialLink = (typeof SOCIAL_LINKS)[number];
export type SocialKind = SocialLink["kind"];
