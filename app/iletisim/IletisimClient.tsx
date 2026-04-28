"use client";

import { useState } from "react";
import { ArrowUpRight, Building2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import type { Locale } from "@/components/layout/headerConfig";
import {
  contactFormSchema,
  getContactFormDefaults,
  type ContactFormValues,
} from "@/components/iletisim/contactFormSchema";
import { Checkbox } from "@/components/ui/checkbox";
import { Form } from "@/components/ui/form";
import type { ContactFollowLink, ContactLocation, ContactPageData } from "@/data/contact";
import "./iletisim.css";

type IletisimPageProps = {
  locale: Locale;
  contactPage: ContactPageData | null;
};

const AVATARS = ["TS", "GE", "PV", "AR", "24"];

function OrisaLocationCard({ location }: { location: ContactLocation }) {
  return (
    <article className="orisa-location">
      <span className="orisa-location__icon" aria-hidden="true">
        <Building2 size={22} strokeWidth={1.8} />
      </span>
      <div>
        <h3>{location.name}</h3>
        <p>{location.address}</p>
        <a href={`tel:${location.phone.replace(/\D/g, "")}`}>{location.phone}</a>
        <a href={`mailto:${location.email}`}>{location.email}</a>
      </div>
    </article>
  );
}

function OrisaStatus() {
  return (
    <aside className="orisa-status" aria-label="Proje dönüş notu">
      <span className="orisa-status__star" aria-hidden="true">✻</span>
      <div className="orisa-status__avatars" aria-hidden="true">
        {AVATARS.map((avatar) => <span key={avatar}>{avatar}</span>)}
      </div>
      <p><strong>500+ projede</strong><span>24 saat dönüş</span></p>
    </aside>
  );
}

function OrisaForm({
  contactPage,
  compact = false,
}: {
  contactPage: ContactPageData;
  compact?: boolean;
}) {
  const labels = contactPage.content.labels;
  const kvkkUrl = contactPage.kvkkUrl;
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: getContactFormDefaults(contactPage.systemTypes[0]?.id ?? ""),
  });
  const kvkkAccepted = useWatch({ control: form.control, name: "kvkkAccepted" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
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

  if (submitted) {
    return (
      <div className="orisa-form-success" role="status">
        {labels.successMessage ?? "Teşekkür ederiz. Ekibimiz en kısa sürede size dönüş yapacaktır."}
      </div>
    );
  }

  return (
    <Form {...form}>
      <form className={compact ? "orisa-form is-compact" : "orisa-form"} onSubmit={form.handleSubmit(handleSubmit)} noValidate aria-describedby={formError ? "orisa-form-error" : undefined}>
        <label className="orisa-field">
          <span>Ad</span>
          <input type="text" required autoComplete="name" placeholder={labels.fullNamePlaceholder ?? "Adınız Soyadınız"} {...form.register("fullName")} />
        </label>

        <label className="orisa-field">
          <span>Email</span>
          <input type="email" required inputMode="email" autoComplete="email" placeholder={labels.emailFieldPlaceholder ?? "ornek@email.com"} {...form.register("email")} />
        </label>

        <label className="orisa-field">
          <span>Tel</span>
          <input type="tel" inputMode="tel" autoComplete="tel" placeholder={labels.phoneFieldPlaceholder ?? "05XX XXX XX XX"} {...form.register("phone")} />
        </label>

        <label className="orisa-field orisa-field--message">
          <span>Mesaj</span>
          <textarea required placeholder={labels.messagePlaceholder ?? "Çatı, arazi, tüketim ve hedefinizi yazın..."} {...form.register("message")} />
        </label>

        {formError ? <p id="orisa-form-error" role="alert" className="orisa-form__error">{formError}</p> : null}

        <div className="orisa-form__footer">
          <button type="submit" className="orisa-submit" disabled={submitting}>
            <span>{submitting ? labels.submittingLabel ?? "Gönderiliyor..." : "Gönder"}</span>
            <ArrowUpRight aria-hidden="true" size={18} strokeWidth={2} />
          </button>

          <label className="orisa-kvkk">
            <Checkbox
              checked={kvkkAccepted}
              onCheckedChange={(checked) =>
                form.setValue("kvkkAccepted", checked === true, { shouldDirty: true, shouldValidate: true })
              }
            />
            <span>
              <a href={kvkkUrl}>KVKK</a> metnini okudum ve onaylıyorum.
            </span>
          </label>
        </div>
      </form>
    </Form>
  );
}

function FollowList({ links }: { links: ContactFollowLink[] }) {
  return (
    <aside className="orisa-follow" aria-labelledby="orisa-follow-title">
      <h3 id="orisa-follow-title">Bizi takip et</h3>
      <ul>
        {links.map((link) => (
          <li key={link.id}>
            <a href={link.href} target={link.href.startsWith("http") ? "_blank" : undefined} rel={link.href.startsWith("http") ? "noreferrer noopener" : undefined} aria-label={link.aria}>
              <span>{link.label}</span>
              <small>{link.value}</small>
              <ArrowUpRight aria-hidden="true" size={18} strokeWidth={2} />
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default function IletisimPage({ contactPage }: IletisimPageProps) {
  if (!contactPage) return null;

  return (
    <div className="contact-desktop-page contact-orisa contact-orisa--desktop">
      <main className="contact-orisa__body">
        <section className="orisa-hero" aria-labelledby="orisa-title">
          <div className="orisa-hero__copy">
            <p className="orisa-eyebrow">İLETİŞİM ↗</p>
            <h1 id="orisa-title">Çatına özel <em>güneşi</em> birlikte planlayalım.</h1>
            <div className="orisa-location-grid">
              {contactPage.locations.map((location) => <OrisaLocationCard key={location.id} location={location} />)}
            </div>
          </div>
          <OrisaStatus />
        </section>

        <section className="orisa-form-section" aria-labelledby="orisa-form-title">
          <div className="orisa-form-section__main">
            <h2 id="orisa-form-title">Bize bir şeyler yaz.</h2>
            <OrisaForm contactPage={contactPage} />
          </div>
          <FollowList links={contactPage.followLinks} />
        </section>
      </main>
    </div>
  );
}

export { FollowList, OrisaForm, OrisaLocationCard, OrisaStatus };
