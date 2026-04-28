"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Mail, MessageCircle, Phone, Send, User } from "lucide-react";
import {
  contactFormSchema,
  getContactFormDefaults,
  type ContactFormValues,
} from "@/components/iletisim/contactFormSchema";
import type { Locale } from "@/components/layout/headerConfig";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: getContactFormDefaults(contactPage?.systemTypes?.[0]?.id ?? ""),
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const formError =
    form.formState.errors.fullName?.message ??
    form.formState.errors.email?.message ??
    form.formState.errors.phone?.message ??
    form.formState.errors.message?.message;

  function handleSubmit() {
    if (submitting) return;
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} noValidate aria-describedby={formError ? "im-form-err" : undefined}>
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
                    {...form.register("fullName")}
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
                    {...form.register("email")}
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
                    {...form.register("phone")}
                  />
                </div>
              </div>
            </div>
          </section>

          {contactPage?.systemTypes?.length ? (
            <section className="iletisim-m__group" aria-labelledby="im-system-head">
              <h2 id="im-system-head" className="rail-head">
                {labels.systemTypeLabel ?? "Sistem tipi"}
              </h2>
              <RadioGroup
                className="contact-radio-grid"
                value={form.watch("systemType")}
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
                    {...form.register("message")}
                  />
                </div>
              </div>
            </div>
          </section>

          {formError ? (
            <p id="im-form-err" role="alert" className="iletisim-m__error">
              {formError}
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
        </Form>
      )}
    </main>
  );
}
