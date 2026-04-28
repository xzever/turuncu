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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Clock, Copy, Mail, MapPin, MessageCircle, Navigation, Phone, Send } from "lucide-react";
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

const HOURS = [
  ["Pazartesi", "09:00 - 18:00"],
  ["Salı", "09:00 - 18:00"],
  ["Çarşamba", "09:00 - 18:00"],
  ["Perşembe", "09:00 - 18:00"],
  ["Cuma", "09:00 - 18:00"],
  ["Cumartesi", "10:00 - 15:00"],
] as const;

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
  const whatsappMessage = "Merhaba, güneş enerjisi projem için bilgi almak istiyorum.";
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

  function copyValue(value: string) {
    if (!value) return;
    void navigator.clipboard?.writeText(value);
  }

  return (
    <div className="contact-desktop-page contact-concept">
      <main className="contact-page">
        <header className="contact-page__head">
          <div className="contact-page__title">
            <Badge variant="secondary">İletişim</Badge>
            <h1>Bize ulaşın.</h1>
            <p>Ankara ve Muğla irtibat ofisleri, aynı gün mühendis dönüşü.</p>
          </div>

          {locations.length > 1 ? (
            <ToggleGroup
              type="single"
              value={selectedLocation?.id ?? ""}
              onValueChange={(value) => value && setSelectedLocationId(value)}
              className="contact-page__branches"
              aria-label="Şube seçimi"
            >
              {locations.map((location) => (
                <ToggleGroupItem key={location.id} value={location.id}>
                  {location.tabLabel ?? location.name}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          ) : null}
        </header>

        <section className="contact-page__dashboard" aria-label="İletişim dashboard">
          <Card className="contact-panel contact-panel--info">
            <CardHeader>
              <CardTitle>{selectedLocation?.name ?? "Ankara İrtibat Ofisi"}</CardTitle>
            </CardHeader>
            <CardContent className="contact-info-list">
              <div><MapPin aria-hidden="true" /><span>{selectedLocation?.address ?? "Adres bilgisi için bizimle iletişime geçin."}</span><Button type="button" variant="ghost" size="icon" onClick={() => copyValue(selectedLocation?.address ?? "")} aria-label="Adresi kopyala"><Copy /></Button></div>
              <div><Phone aria-hidden="true" /><a href={phoneVal ? telHref(phoneVal) : undefined}>{phoneVal || "+90 312 285 66 67"}</a><Button type="button" variant="ghost" size="icon" onClick={() => copyValue(phoneVal)} aria-label="Telefonu kopyala"><Copy /></Button></div>
              <div><MessageCircle aria-hidden="true" /><a href={waVal ? whatsappHref(waVal, whatsappMessage) : undefined} target="_blank" rel="noreferrer">{waVal || "WhatsApp danışmanlığı"}</a><Button type="button" variant="ghost" size="icon" onClick={() => copyValue(waVal)} aria-label="WhatsApp kopyala"><Copy /></Button></div>
              <div><Mail aria-hidden="true" /><a href={emailVal ? emailHref(emailVal) : undefined}>{emailVal || "info@turuncusolar.com"}</a><Button type="button" variant="ghost" size="icon" onClick={() => copyValue(emailVal)} aria-label="E-postayı kopyala"><Copy /></Button></div>
            </CardContent>
          </Card>

          <Card className="contact-panel contact-panel--map">
            <CardHeader>
              <CardTitle><Clock aria-hidden="true" /> Harita ve saatler</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedLocation && mapSrc ? (
                <div className="map-card contact-page__map" aria-label={`${selectedLocation.name} haritası`}>
                  <iframe src={mapSrc} title={`${selectedLocation.name} haritası`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                  <span className="pin" aria-hidden="true" />
                  {selectedLocation.mapLink ? (
                    <div className="controls">
                      <a className="map-btn" href={selectedLocation.mapLink} target="_blank" rel="noreferrer">
                        <Navigation aria-hidden="true" />
                        Yol Tarifi
                      </a>
                    </div>
                  ) : null}
                </div>
              ) : null}
              <div className="contact-hours-grid">
                {HOURS.map(([day, hour]) => <div key={day}><strong>{day}</strong><span>{hour}</span></div>)}
              </div>
            </CardContent>
          </Card>

          <Card className="contact-panel contact-panel--form">
            <CardHeader>
              <CardTitle>Ücretsiz keşif</CardTitle>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="contact-page__success" role="status">
                  <p>{labels.successMessage ?? "Teşekkür ederiz. Ekibimiz en kısa sürede size dönüş yapacaktır."}</p>
                </div>
              ) : (
                <Form {...form}>
                  <form className="contact-page__form-grid" onSubmit={form.handleSubmit(handleSubmit)} noValidate aria-describedby={formError ? "contact-form-error" : undefined}>
                    <label><span>Ad Soyad</span><Input type="text" required autoComplete="name" placeholder={labels.fullNamePlaceholder ?? "Adınız Soyadınız"} {...form.register("fullName")} /></label>
                    <label><span>E-posta</span><Input type="email" required inputMode="email" autoComplete="email" placeholder={labels.emailFieldPlaceholder ?? "ornek@email.com"} {...form.register("email")} /></label>
                    <label><span>Telefon</span><Input type="tel" inputMode="tel" autoComplete="tel" placeholder={labels.phoneFieldPlaceholder ?? "05XX XXX XX XX"} {...form.register("phone")} /></label>

                    {contactPage?.systemTypes?.length ? (
                      <RadioGroup className="contact-radio-grid" value={selectedSystemType} onValueChange={(value) => form.setValue("systemType", value, { shouldDirty: true })}>
                        {contactPage.systemTypes.slice(0, 4).map((systemType) => (
                          <label key={systemType.id} className="contact-radio-tile">
                            <Card className="contact-radio-tile__card">
                              <RadioGroupItem value={systemType.id} aria-label={systemType.name} />
                              <span>{systemType.name}</span>
                            </Card>
                          </label>
                        ))}
                      </RadioGroup>
                    ) : null}

                    <label><span>Mesaj</span><Textarea required placeholder={labels.messagePlaceholder ?? "Güneş enerjisi hakkında merak ettiklerinizi yazın..."} {...form.register("message")} /></label>

                    {formError ? <p id="contact-form-error" role="alert" className="contact-page__error">{formError}</p> : null}

                    <label className="kvkk-control">
                      <Checkbox checked={kvkkAccepted} onCheckedChange={(checked) => form.setValue("kvkkAccepted", checked === true, { shouldDirty: true, shouldValidate: true })} />
                      <span><a href={kvkkUrl}>KVKK aydınlatma metnini</a> okudum ve onaylıyorum.</span>
                    </label>

                    <Button type="submit" className="btn full" disabled={submitting}>
                      <span>{submitting ? labels.submittingLabel ?? "Gönderiliyor..." : labels.submitLabel ?? "Gönder"}</span>
                      <Send aria-hidden="true" />
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
