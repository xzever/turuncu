"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Mail, MessageCircle, Phone, Send, User } from "lucide-react";
import type { Locale } from "@/components/layout/headerConfig";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ContactLocation = {
  id: string;
  name: string;
  tabLabel?: string;
  isPrimary?: boolean;
};

type ContactPage = {
  pageSlug: string;
  pageTitle: string;
  requireConsent: boolean;
  kvkkUrl?: string;
  locations: ContactLocation[];
  categories: Array<{ id: string; name: string }>;
  systemTypes?: Array<{ id: string; name: string }>;
  content: { labels: Record<string, string>; settings?: Record<string, boolean> };
};

export type IletisimMobileProps = {
  locale: Locale;
  contactPage: ContactPage | null;
};

export default function IletisimMobile({ contactPage }: IletisimMobileProps) {
  const locations = useMemo(() => contactPage?.locations ?? [], [contactPage?.locations]);
  const labels = contactPage?.content.labels ?? {};
  const kvkkUrl = contactPage?.kvkkUrl ?? "/kvkk";
  const primary = locations.find((item) => item.isPrimary) ?? locations[0];
  const [activeLocationId, setActiveLocationId] = useState<string>(primary?.id ?? "");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((previous) => ({ ...previous, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    if (!form.fullName.trim()) {
      setError(labels.fullNameError ?? "Lutfen ad soyad girin.");
      return;
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Lutfen gecerli bir e-posta girin.");
      return;
    }
    if (!form.message.trim() || form.message.trim().length < 3) {
      setError(labels.messageError ?? "Lutfen mesajinizi yazin.");
      return;
    }

    setError(null);
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 700);
  }

  return (
    <main className="iletisim-mobile-page iletisim-m">
      <header className="iletisim-m__hero">
        <h1 className="h-page">
          Bize <em>yazin.</em>
        </h1>
        <p className="lead">2 ofis · muhendis ekip ayni gun doner.</p>
      </header>

      {locations.length > 1 ? (
        <div className="seg" role="tablist" aria-label="Subeler">
          {locations.map((location) => {
            const isActive = location.id === activeLocationId;
            return (
              <button
                key={location.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={isActive ? "is-active" : undefined}
                onClick={() => setActiveLocationId(location.id)}
              >
                {location.tabLabel ?? location.name}
              </button>
            );
          })}
        </div>
      ) : null}

      {submitted ? (
        <div className="iletisim-m__success" role="status">
          <p>{labels.successMessage ?? "Tesekkur ederiz. Ekibimiz en kisa surede size donus yapacaktir."}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate aria-describedby={error ? "im-form-err" : undefined}>
          <section className="iletisim-m__group" aria-labelledby="im-info-head">
            <h2 id="im-info-head" className="rail-head">
              Bilgileriniz
            </h2>
            <div className="rail">
              <div className="rail-row">
                <span className="ic-mini">
                  <User aria-hidden="true" />
                </span>
                <label className="lbl-r" htmlFor="im-name">
                  Ad Soyad
                </label>
                <div className="val">
                  <Input
                    id="im-name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder={labels.fullNamePlaceholder ?? "Adiniz Soyadiniz"}
                    value={form.fullName}
                    onChange={(event) => update("fullName", event.target.value)}
                  />
                </div>
              </div>
              <div className="rail-row">
                <span className="ic-mini">
                  <Mail aria-hidden="true" />
                </span>
                <label className="lbl-r" htmlFor="im-email">
                  E-Posta
                </label>
                <div className="val">
                  <Input
                    id="im-email"
                    type="email"
                    required
                    inputMode="email"
                    autoComplete="email"
                    placeholder={labels.emailFieldPlaceholder ?? "ornek@email.com"}
                    value={form.email}
                    onChange={(event) => update("email", event.target.value)}
                  />
                </div>
              </div>
              <div className="rail-row">
                <span className="ic-mini">
                  <Phone aria-hidden="true" />
                </span>
                <label className="lbl-r" htmlFor="im-phone">
                  Telefon
                </label>
                <div className="val">
                  <Input
                    id="im-phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder={labels.phoneFieldPlaceholder ?? "05XX XXX XX XX"}
                    value={form.phone}
                    onChange={(event) => update("phone", event.target.value)}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="iletisim-m__group" aria-labelledby="im-message-head">
            <h2 id="im-message-head" className="rail-head">
              Mesajiniz
            </h2>
            <div className="rail">
              <div className="rail-row">
                <span className="ic-mini">
                  <MessageCircle aria-hidden="true" />
                </span>
                <label className="lbl-r" htmlFor="im-message">
                  Konu
                </label>
                <div className="val">
                  <Textarea
                    id="im-message"
                    rows={1}
                    required
                    placeholder={labels.messagePlaceholder ?? "Gunes enerjisi hakkinda merak ettiklerinizi yazin..."}
                    value={form.message}
                    onChange={(event) => update("message", event.target.value)}
                  />
                </div>
              </div>
            </div>
          </section>

          {error ? (
            <p id="im-form-err" role="alert" className="iletisim-m__error">
              {error}
            </p>
          ) : null}

          <button type="submit" className="btn full" disabled={submitting}>
            <span>{submitting ? labels.submittingLabel ?? "Gonderiliyor..." : labels.submitLabel ?? "Gonder"}</span>
            <Send aria-hidden="true" />
          </button>
          <p className="kvkk-note">
            Gönder&apos;e basarak{" "}
            <a href={kvkkUrl}>KVKK aydınlatma metnini</a> onayladığını kabul edersin.
          </p>
        </form>
      )}
    </main>
  );
}
