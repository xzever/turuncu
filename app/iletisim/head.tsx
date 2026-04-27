const CONTACT_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Iletisim | Turuncu Solar",
  description:
    "Turuncu Solar teklif, kesif, kurulum ve teknik destek surecleri icin dogrudan iletisim kanallari.",
  mainEntity: {
    "@type": "Organization",
    name: "Turuncu Solar",
    url: "https://turuncusolar.com/iletisim",
    email: "info@turuncusolar.com",
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "regional office",
        areaServed: "TR",
        telephone: "+90 312 285 66 67",
        email: "info@turuncusolar.com",
        availableLanguage: ["tr", "en"],
      },
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        areaServed: "TR",
        telephone: "+90 312 285 66 67",
        email: "info@turuncusolar.com",
        availableLanguage: ["tr", "en"],
      },
    ],
    address: [
      {
        "@type": "PostalAddress",
        streetAddress: "Mugla Emek Milas Mh. Mugla Karadag Cd. No:38/1",
        addressCountry: "TR",
      },
      {
        "@type": "PostalAddress",
        streetAddress:
          "Bilkent Cankaya Ankara Renevo / Universiteler Mah. 1598 Cad. Bilkent Plaza A3/17",
        addressCountry: "TR",
      },
    ],
  },
};

export default function Head() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(CONTACT_JSON_LD) }}
      />
    </>
  );
}
