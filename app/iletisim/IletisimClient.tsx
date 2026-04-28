"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import type { Locale } from "@/components/layout/headerConfig";
import {
  contactFormSchema,
  getContactFormDefaults,
  type ContactFormValues,
} from "@/components/iletisim/contactFormSchema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ChevronRight, Mail, MapPin, MessageCircle, Navigation, Phone, Send, User } from "lucide-react";
import "./iletisim.css";

type ContactChannel = { type?: string; value?: string };

type ContactLocation = {
  id: string;
  name: string;
  tabLabel?: string;
  isPrimary?: boolean;
  address?: string;
  mapEmbedUrl?: string;
  mapLink?: string;
  channels?: ContactChannel[];
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

function emailHref(value: string): string {
  return `mailto:${value}`;
}

function whatsappHref(value: string, message: string): string {
  const digits = value.replace(/\D/g, "");
  const normalized = digits.startsWith("0") ? `90${digits.slice(1)}` : digits;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

export default function IletisimPage({
  contactPage,
}: {
  locale: Locale;
  contactPage: ContactPage | null;
}) {
  const locations = contactPage?.locations ?? [];
  const labels = contactPage?.content.labels ?? {};
  const kvkkUrl = contactPage?.kvkkUrl ?? "/kvkk";
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const selectedLocation =
    locations.find((item) => item.id === selectedLocationId) ??
    locations.find((item) => item.isPrimary) ??
    locations[0] ??
    null;
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: getContactFormDefaults(contactPage?.systemTypes?.[0]?.id ?? ""),
  });
  const selectedSystemType = useWatch({ control: form.control, name: "systemType" });
  const kvkkAccepted = useWatch({ control: form.control, name: "kvkkAccepted" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const mapSrc = getMapEmbedUrl(selectedLocation);
  const phoneVal = getChannelValue(selectedLocation, "PHONE");
  const waVal = getChannelValue(selectedLocation, "WHATSAPP");
  const emailVal = getChannelValue(selectedLocation, "EMAIL");
  const whatsappMessage = "Merhaba, gunes enerjisi projem icin bilgi almak istiyorum.";
  const formError =
    form.formState.errors.fullName?.message ??
    form.formState.errors.email?.message ??
    form.formState.errors.phone?.message ??
    form.formState.errors.message?.message ??
    form.formState.errors.kvkkAccepted?.message;

  function handleSubmit() {
    if (submitting) return;
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
            <h1>
              Bize <em>yazin.</em>
            </h1>
            <p>2 ofis · muhendis ekip ayni gun doner.</p>
          </div>

          {locations.length > 1 ? (
            <Tabs
              value={selectedLocation?.id ?? ""}
              onValueChange={setSelectedLocationId}
              className="contact-page__branches"
            >
              <TabsList className="seg" aria-label="Subeler">
                {locations.map((location) => {
                  const isActive = selectedLocation?.id === location.id;
                  return (
                    <TabsTrigger key={location.id} value={location.id} className={isActive ? "is-active" : undefined}>
                    {location.tabLabel ?? location.name}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </Tabs>
          ) : null}
        </header>

        {selectedLocation && mapSrc ? (
          <section className="map-card contact-page__map" aria-label={`${selectedLocation.name} haritasi`}>
            <iframe
              src={mapSrc}
              title={`${selectedLocation.name} haritasi`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <span className="pin" aria-hidden="true" />
            {selectedLocation.mapLink ? (
              <div className="controls">
                <a className="map-btn" href={selectedLocation.mapLink} target="_blank" rel="noreferrer">
                  <Navigation aria-hidden="true" />
                  Yol Tarifi
                </a>
              </div>
            ) : null}
          </section>
        ) : null}

        <section className="lay-2" aria-label="Iletisim bilgileri ve form">
          <div className="contact-page__left">
            <section aria-labelledby="branch-head">
              <h2 id="branch-head" className="rail-head">
                Sube
              </h2>
              <div className="rail">
                <div className="rail-row">
                  <span className="ic-mini">
                    <MapPin aria-hidden="true" />
                  </span>
                  <span className="lbl-r">Ofis</span>
                  <span className="val">{selectedLocation?.name ?? "Ankara Irtibat Ofisi"}</span>
                  <span className="arr" aria-hidden="true">
                    <ChevronRight />
                  </span>
                </div>
                {selectedLocation?.address ? (
                  <div className="rail-row">
                    <span className="ic-mini">
                      <Navigation aria-hidden="true" />
                    </span>
                    <span className="lbl-r">Adres</span>
                    <span className="val">{selectedLocation.address}</span>
                  </div>
                ) : null}
              </div>
            </section>

            <section aria-labelledby="desktop-info-head">
              <h2 id="desktop-info-head" className="rail-head">
                Bilgileriniz
              </h2>
              <div className="rail">
                <div className="rail-row">
                  <span className="ic-mini">
                    <Phone aria-hidden="true" />
                  </span>
                  <span className="lbl-r">Telefon</span>
                  <span className="val">
                    {phoneVal ? <a href={telHref(phoneVal)}>{phoneVal}</a> : "+90 312 285 66 67"}
                  </span>
                </div>
                <div className="rail-row">
                  <span className="ic-mini">
                    <MessageCircle aria-hidden="true" />
                  </span>
                  <span className="lbl-r">WhatsApp</span>
                  <span className="val">
                    {waVal ? (
                      <a href={whatsappHref(waVal, whatsappMessage)} target="_blank" rel="noreferrer">
                        {waVal}
                      </a>
                    ) : (
                      "0312 285 66 67"
                    )}
                  </span>
                </div>
                <div className="rail-row">
                  <span className="ic-mini">
                    <Mail aria-hidden="true" />
                  </span>
                  <span className="lbl-r">E-Posta</span>
                  <span className="val">
                    {emailVal ? <a href={emailHref(emailVal)}>{emailVal}</a> : "info@turuncusolar.com"}
                  </span>
                </div>
              </div>
            </section>
          </div>

          <section className="contact-page__form" aria-label="Mesaj formu">
            {submitted ? (
              <div className="contact-page__success" role="status">
                <p>{labels.successMessage ?? "Tesekkur ederiz. Ekibimiz en kisa surede size donus yapacaktir."}</p>
              </div>
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  noValidate
                  aria-describedby={formError ? "contact-form-error" : undefined}
                >
                <section aria-labelledby="desktop-form-info-head">
                  <h2 id="desktop-form-info-head" className="rail-head">
                    Bilgileriniz
                  </h2>
                  <div className="rail">
                    <div className="rail-row">
                      <span className="ic-mini">
                        <User aria-hidden="true" />
                      </span>
                      <label className="lbl-r" htmlFor="contact-name">
                        Ad Soyad
                      </label>
                      <div className="val">
                        <Input
                          id="contact-name"
                          type="text"
                          required
                          autoComplete="name"
                          placeholder={labels.fullNamePlaceholder ?? "Adiniz Soyadiniz"}
                          {...form.register("fullName")}
                        />
                      </div>
                    </div>
                    <div className="rail-row">
                      <span className="ic-mini">
                        <Mail aria-hidden="true" />
                      </span>
                      <label className="lbl-r" htmlFor="contact-email">
                        E-Posta
                      </label>
                      <div className="val">
                        <Input
                          id="contact-email"
                          type="email"
                          required
                          inputMode="email"
                          autoComplete="email"
                          placeholder={labels.emailFieldPlaceholder ?? "ornek@email.com"}
                          {...form.register("email")}
                        />
                      </div>
                    </div>
                    <div className="rail-row">
                      <span className="ic-mini">
                        <Phone aria-hidden="true" />
                      </span>
                      <label className="lbl-r" htmlFor="contact-phone">
                        Telefon
                      </label>
                      <div className="val">
                        <Input
                          id="contact-phone"
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          placeholder={labels.phoneFieldPlaceholder ?? "05XX XXX XX XX"}
                          {...form.register("phone")}
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {contactPage?.systemTypes?.length ? (
                  <section className="contact-page__system" aria-labelledby="desktop-system-head">
                    <h2 id="desktop-system-head" className="rail-head">
                      {labels.systemTypeLabel ?? "Sistem tipi"}
                    </h2>
                    <RadioGroup
                      className="contact-radio-grid"
                      value={selectedSystemType}
                      onValueChange={(value) => form.setValue("systemType", value, { shouldDirty: true })}
                    >
                      {contactPage.systemTypes.map((systemType) => (
                        <label key={systemType.id} className="contact-radio-tile">
                          <Card className="contact-radio-tile__card">
                            <RadioGroupItem value={systemType.id} aria-label={systemType.name} />
                            <span>{systemType.name}</span>
                          </Card>
                        </label>
                      ))}
                    </RadioGroup>
                  </section>
                ) : null}

                <section className="contact-page__message" aria-labelledby="desktop-message-head">
                  <h2 id="desktop-message-head" className="rail-head">
                    Mesajiniz
                  </h2>
                  <div className="rail">
                    <div className="rail-row rail-row--textarea">
                      <span className="ic-mini">
                        <MessageCircle aria-hidden="true" />
                      </span>
                      <label className="lbl-r" htmlFor="contact-message">
                        Konu
                      </label>
                      <div className="val">
                        <Textarea
                          id="contact-message"
                          required
                          placeholder={labels.messagePlaceholder ?? "Gunes enerjisi hakkinda merak ettiklerinizi yazin..."}
                          {...form.register("message")}
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {formError ? (
                  <p id="contact-form-error" role="alert" className="contact-page__error">
                    {formError}
                  </p>
                ) : null}

                <label className="kvkk-control">
                  <Checkbox
                    checked={kvkkAccepted}
                    onCheckedChange={(checked) =>
                      form.setValue("kvkkAccepted", checked === true, { shouldDirty: true, shouldValidate: true })
                    }
                  />
                  <span>
                    <a href={kvkkUrl}>KVKK aydinlatma metnini</a> okudum ve onayliyorum.
                  </span>
                </label>

                <Button type="submit" className="btn full" disabled={submitting}>
                  <span>{submitting ? labels.submittingLabel ?? "Gonderiliyor..." : labels.submitLabel ?? "Gonder"}</span>
                  <Send aria-hidden="true" />
                </Button>
                </form>
              </Form>
            )}
          </section>
        </section>
      </main>
    </div>
  );
}
