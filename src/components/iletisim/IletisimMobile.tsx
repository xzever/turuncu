"use client";

import type { Locale } from "@/components/layout/headerConfig";
import type { ContactPageData } from "@/data/contact";
import { FollowList, OrisaForm, OrisaLocationCard, OrisaStatus } from "../../../app/iletisim/IletisimClient";

export type IletisimMobileProps = {
  locale: Locale;
  contactPage: ContactPageData | null;
};

export default function IletisimMobile({ contactPage }: IletisimMobileProps) {
  if (!contactPage) return null;

  return (
    <main className="iletisim-mobile-page contact-orisa contact-orisa--mobile">
      <div className="contact-orisa__body">
        <section className="orisa-hero" aria-labelledby="orisa-mobile-title">
          <div className="orisa-hero__copy">
            <p className="orisa-eyebrow">İLETİŞİM ↗</p>
            <h1 id="orisa-mobile-title">Çatına özel <em>güneşi</em> birlikte planlayalım.</h1>
            <OrisaStatus />
            <div className="orisa-location-grid">
              {contactPage.locations.map((location) => <OrisaLocationCard key={location.id} location={location} />)}
            </div>
          </div>
        </section>

        <section className="orisa-form-section" aria-labelledby="orisa-mobile-form-title">
          <div className="orisa-form-section__main">
            <h2 id="orisa-mobile-form-title">Bize bir şeyler yaz.</h2>
            <OrisaForm contactPage={contactPage} compact />
          </div>
          <FollowList links={contactPage.followLinks} />
        </section>
      </div>
    </main>
  );
}
