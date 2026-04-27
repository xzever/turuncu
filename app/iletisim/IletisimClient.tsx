"use client";

import { useId, useState, type FormEvent } from "react";
import type { Locale } from "@/components/layout/headerConfig";
import { Mail, MapPin, MessageCircle, Navigation, Phone, Send, User } from "lucide-react";
import "./iletisim.css";

type ContactChannel = { type?: string; value?: string };

type ContactWorkingHour = {
  dayOfWeek: string;
  openTime: string;
  closeTime: string;
  isClosed?: boolean;
};

type ContactLocation = {
  id: string;
  name: string;
  tabLabel?: string;
  isPrimary?: boolean;
  address?: string;
  note?: string;
  mapEmbedUrl?: string;
  mapLink?: string;
  channels?: ContactChannel[];
  workingHours?: ContactWorkingHour[];
};

type ContactPage = {
  pageSlug: string;
  pageTitle: string;
  requireConsent: boolean;
  kvkkUrl?: string;
  locations: ContactLocation[];
  categories: Array<{ id: string; name: string }>;
  systemTypes?: Array<{ id: string; name: string }>;
  content: {
    labels: Record<string, string>;
    settings?: Record<string, boolean>;
  };
};

function getMapEmbedUrl(location: ContactLocation | null): string {
  if (!location) return "";
  if (location.mapEmbedUrl?.trim()) return location.mapEmbedUrl;
  const q = location.address?.trim() || location.name?.trim();
  return q ? `https://www.google.com/maps?q=${encodeURIComponent(q)}&output=embed` : "";
}

function getChannelValue(location: ContactLocation | null, type: "PHONE" | "EMAIL" | "WHATSAPP"): string {
  const channel = location?.channels?.find((item) => item.type?.toUpperCase() === type);
  return channel?.value?.trim() ?? "";
}

function telHref(value: string): string {
  return `tel:${value.replace(/\D/g, "")}`;
}

function whatsappHref(value: string, message: string): string {
  const digits = value.replace(/\D/g, "");
  const normalized = digits.startsWith("0") ? `90${digits.slice(1)}` : digits;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

function emailHref(value: string): string {
  return `mailto:${value}`;
}

function weekdayHours(location: ContactLocation | null): string {
  const monday = location?.workingHours?.find((item) => item.dayOfWeek === "MONDAY");
  return monday && !monday.isClosed ? `${monday.openTime} - ${monday.closeTime}` : "09:00 - 18:00";
}

export default function IletisimPage({
  contactPage,
}: {
  locale: Locale;
  contactPage: ContactPage | null;
}) {
  const locations = contactPage?.locations ?? [];
  const labels = contactPage?.content.labels ?? {};
  const systemTypes = contactPage?.systemTypes ?? [];
  const defaultSystem = systemTypes[0]?.id ?? "grid";
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const selectedLocation =
    locations.find((item) => item.id === selectedLocationId) ??
    locations.find((item) => item.isPrimary) ??
    locations[0] ??
    null;

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    systemType: defaultSystem,
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const systemLabelId = useId();

  const mapSrc = getMapEmbedUrl(selectedLocation);
  const phoneVal = getChannelValue(selectedLocation, "PHONE");
  const waVal = getChannelValue(selectedLocation, "WHATSAPP");
  const emailVal = getChannelValue(selectedLocation, "EMAIL");
  const hours = weekdayHours(selectedLocation);
  const whatsappMessage = "Merhaba, güneş enerjisi projem için bilgi almak istiyorum.";

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((previous) => ({ ...previous, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    if (!form.fullName.trim()) {
      setError(labels.fullNameError ?? "Lütfen ad soyad girin.");
      return;
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Lütfen geçerli bir e-posta girin.");
      return;
    }
    if (!form.message.trim() || form.message.trim().length < 10) {
      setError(labels.messageError ?? "Mesajınız en az 10 karakter olmalıdır.");
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
    <div className="contact-desktop-page">
      <main className="contact-page">
        <header className="contact-page__head">
          <div className="contact-page__title">
            <p className="contact-page__eyebrow">İletişim</p>
            <h1>Bize ulaşın.</h1>
            <p>Ankara ve Muğla irtibat ofisleri.</p>
          </div>

          {locations.length > 1 ? (
            <div className="seg contact-page__branches" role="tablist" aria-label="Şubeler">
              {locations.map((location) => {
                const isActive = selectedLocation?.id === location.id;
                return (
                  <button
                    key={location.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={isActive ? "is-active" : undefined}
                    onClick={() => setSelectedLocationId(location.id)}
                  >
                    {location.tabLabel ?? location.name}
                  </button>
                );
              })}
            </div>
          ) : null}
        </header>

        <section className="contact-page__layout" aria-label="İletişim bilgileri ve form">
          <div className="contact-page__info">
            {selectedLocation && mapSrc ? (
              <div className="map-card contact-page__map">
                <iframe
                  src={mapSrc}
                  title={`${selectedLocation.name} haritası`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="map-card__overlay" aria-hidden="true" />
                {selectedLocation.mapLink ? (
                  <div className="map-card__actions">
                    <a className="map-btn" href={selectedLocation.mapLink} target="_blank" rel="noreferrer">
                      <Navigation width={14} height={14} aria-hidden="true" />
                      {labels.directionsButtonLabel ?? "Yol Tarifi"}
                    </a>
                    {waVal ? (
                      <a className="map-btn" href={whatsappHref(waVal, whatsappMessage)} target="_blank" rel="noreferrer">
                        <MessageCircle width={14} height={14} aria-hidden="true" />
                        {labels.whatsappButtonLabel ?? "WhatsApp"}
                      </a>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ) : null}

            {selectedLocation ? (
              <section className="info-card" aria-labelledby="contact-location-title">
                <div className="info-card__header">
                  <div>
                    <h2 id="contact-location-title">{selectedLocation.name}</h2>
                    {selectedLocation.note ? <p>{selectedLocation.note}</p> : null}
                  </div>
                  {selectedLocation.isPrimary ? <span className="badge">MERKEZ</span> : null}
                </div>

                <div className="info-grid">
                  {phoneVal ? (
                    <a href={telHref(phoneVal)} className="info-row">
                      <span className="info-icon"><Phone width={16} height={16} aria-hidden="true" /></span>
                      <span className="info-content">
                        <span className="info-label">{labels.phoneLabel ?? "Telefon"}</span>
                        <span className="info-value">{phoneVal}</span>
                      </span>
                    </a>
                  ) : null}
                  {waVal ? (
                    <a href={whatsappHref(waVal, whatsappMessage)} className="info-row" target="_blank" rel="noreferrer">
                      <span className="info-icon"><MessageCircle width={16} height={16} aria-hidden="true" /></span>
                      <span className="info-content">
                        <span className="info-label">{labels.whatsappLabel ?? "WhatsApp"}</span>
                        <span className="info-value">{waVal}</span>
                      </span>
                    </a>
                  ) : null}
                  {emailVal ? (
                    <a href={emailHref(emailVal)} className="info-row">
                      <span className="info-icon"><Mail width={16} height={16} aria-hidden="true" /></span>
                      <span className="info-content">
                        <span className="info-label">{labels.emailLabel ?? "E-Posta"}</span>
                        <span className="info-value">{emailVal}</span>
                      </span>
                    </a>
                  ) : null}
                  {selectedLocation.address ? (
                    <div className="info-row info-row--full">
                      <span className="info-icon"><MapPin width={16} height={16} aria-hidden="true" /></span>
                      <span className="info-content">
                        <span className="info-label">{labels.addressLabel ?? "Adres"}</span>
                        <span className="info-value">{selectedLocation.address}</span>
                      </span>
                    </div>
                  ) : null}
                </div>

                <div className="hours-grid" aria-label={labels.hoursLabel ?? "Çalışma Saatleri"}>
                  <div className="hours-row">
                    <span className="hours-day">Hafta içi</span>
                    <span className="hours-time">{hours}</span>
                  </div>
                  <div className="hours-row hours-row--closed">
                    <span className="hours-day">Hafta sonu</span>
                    <span className="hours-time">Kapalı</span>
                  </div>
                </div>
              </section>
            ) : null}
          </div>

          <section className="contact-page__form" aria-label="İletişim formu">
            {submitted ? (
              <div className="contact-page__success" role="status">
                <p>{labels.successMessage ?? "Teşekkür ederiz. Ekibimiz en kısa sürede size dönüş yapacaktır."}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate aria-describedby={error ? "contact-form-error" : undefined}>
                <p className="rail-head">Bilgileriniz</p>
                <div className="rail">
                  <div className="rail-row">
                    <span className="ic-mini"><User width={14} height={14} aria-hidden="true" /></span>
                    <label className="lbl-r" htmlFor="contact-name">{labels.fullNameLabel ?? "Ad Soyad"}</label>
                    <div className="val">
                      <input
                        id="contact-name"
                        type="text"
                        required
                        autoComplete="name"
                        placeholder={labels.fullNamePlaceholder ?? "Adınız Soyadınız"}
                        value={form.fullName}
                        onChange={(event) => update("fullName", event.target.value)}
                      />
                    </div>
                  </div>
                  <div className="rail-row">
                    <span className="ic-mini"><Mail width={14} height={14} aria-hidden="true" /></span>
                    <label className="lbl-r" htmlFor="contact-email">{labels.emailFieldLabel ?? "E-Posta"}</label>
                    <div className="val">
                      <input
                        id="contact-email"
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
                    <span className="ic-mini"><Phone width={14} height={14} aria-hidden="true" /></span>
                    <label className="lbl-r" htmlFor="contact-phone">{labels.phoneFieldLabel ?? "Telefon"}</label>
                    <div className="val">
                      <input
                        id="contact-phone"
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

                <fieldset className="contact-radio-group" aria-labelledby={systemLabelId}>
                  <legend id={systemLabelId}>{labels.systemTypeLabel ?? "Sistem tipi"}</legend>
                  <div className="contact-radio-group__options" role="radiogroup" aria-labelledby={systemLabelId}>
                    {systemTypes.map((item) => (
                      <label key={item.id} className="contact-radio-option">
                        <input
                          type="radio"
                          name="contact-system-type"
                          value={item.id}
                          checked={form.systemType === item.id}
                          onChange={() => update("systemType", item.id)}
                        />
                        <span>{item.name}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <p className="rail-head">Mesajınız</p>
                <div className="rail rail--message">
                  <div className="rail-row rail-row--textarea">
                    <span className="ic-mini"><MessageCircle width={14} height={14} aria-hidden="true" /></span>
                    <label className="lbl-r" htmlFor="contact-message">{labels.messageLabel ?? "Mesajınız"}</label>
                    <div className="val">
                      <textarea
                        id="contact-message"
                        rows={4}
                        required
                        placeholder={labels.messagePlaceholder ?? "Çatı, arazi, tüketim ve hedefinizi yazın..."}
                        value={form.message}
                        onChange={(event) => update("message", event.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {error ? (
                  <p id="contact-form-error" role="alert" className="contact-page__error">{error}</p>
                ) : null}

                <button type="submit" className="btn full" disabled={submitting}>
                  <Send width={14} height={14} aria-hidden="true" />
                  <span>{submitting ? labels.submittingLabel ?? "Gönderiliyor..." : labels.submitLabel ?? "Gönder"}</span>
                </button>
              </form>
            )}
          </section>
        </section>
      </main>
    </div>
  );
}
