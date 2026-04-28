"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { Clock, Copy, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import {
  contactFormSchema,
  getContactFormDefaults,
  type ContactFormValues,
} from "@/components/iletisim/contactFormSchema";
import type { Locale } from "@/components/layout/headerConfig";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type ContactChannel = { type?: string; value?: string };

type ContactLocation = {
  id: string;
  name: string;
  tabLabel?: string;
  isPrimary?: boolean;
  address?: string;
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
  content: { labels: Record<string, string>; settings?: Record<string, boolean> };
};

export type IletisimMobileProps = {
  locale: Locale;
  contactPage: ContactPage | null;
};

const HOURS = [
  ["Pzt", "09:00 - 18:00"],
  ["Sal", "09:00 - 18:00"],
  ["Çar", "09:00 - 18:00"],
  ["Per", "09:00 - 18:00"],
  ["Cum", "09:00 - 18:00"],
  ["Cmt", "10:00 - 15:00"],
] as const;

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

export default function IletisimMobile({ contactPage }: IletisimMobileProps) {
  const locations = useMemo(() => contactPage?.locations ?? [], [contactPage?.locations]);
  const labels = contactPage?.content.labels ?? {};
  const kvkkUrl = contactPage?.kvkkUrl ?? "/kvkk";
  const primary = locations.find((item) => item.isPrimary) ?? locations[0] ?? null;
  const [activeLocationId, setActiveLocationId] = useState<string>(primary?.id ?? "");
  const activeLocation = locations.find((item) => item.id === activeLocationId) ?? primary;
  const phoneVal = getChannelValue(activeLocation, "PHONE");
  const waVal = getChannelValue(activeLocation, "WHATSAPP");
  const emailVal = getChannelValue(activeLocation, "EMAIL");
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: getContactFormDefaults(contactPage?.systemTypes?.[0]?.id ?? ""),
  });
  const selectedSystemType = useWatch({ control: form.control, name: "systemType" });
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

  function copyValue(value: string) {
    if (!value) return;
    void navigator.clipboard?.writeText(value);
  }

  const formNode = submitted ? (
    <Card className="iletisim-dash__card" role="status">
      <CardContent>
        <p>{labels.successMessage ?? "Teşekkür ederiz. Ekibimiz en kısa sürede size dönüş yapacaktır."}</p>
      </CardContent>
    </Card>
  ) : (
    <Form {...form}>
      <form className="iletisim-dash__form" onSubmit={form.handleSubmit(handleSubmit)} noValidate aria-describedby={formError ? "im-form-err" : undefined}>
        <div className="iletisim-dash__field-grid">
          <label>
            <span>Ad Soyad</span>
            <Input type="text" required autoComplete="name" placeholder={labels.fullNamePlaceholder ?? "Adınız Soyadınız"} {...form.register("fullName")} />
          </label>
          <label>
            <span>E-posta</span>
            <Input type="email" required inputMode="email" autoComplete="email" placeholder={labels.emailFieldPlaceholder ?? "ornek@email.com"} {...form.register("email")} />
          </label>
          <label>
            <span>Telefon</span>
            <Input type="tel" inputMode="tel" autoComplete="tel" placeholder={labels.phoneFieldPlaceholder ?? "05XX XXX XX XX"} {...form.register("phone")} />
          </label>
        </div>

        {contactPage?.systemTypes?.length ? (
          <RadioGroup
            className="contact-radio-grid"
            value={selectedSystemType}
            onValueChange={(value) => form.setValue("systemType", value, { shouldDirty: true })}
          >
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

        <label>
          <span>Mesaj</span>
          <Textarea required placeholder={labels.messagePlaceholder ?? "Güneş enerjisi hakkında merak ettiklerinizi yazın..."} {...form.register("message")} />
        </label>

        {formError ? <p id="im-form-err" role="alert" className="iletisim-m__error">{formError}</p> : null}

        <label className="kvkk-control">
          <Checkbox
            checked={kvkkAccepted}
            onCheckedChange={(checked) =>
              form.setValue("kvkkAccepted", checked === true, { shouldDirty: true, shouldValidate: true })
            }
          />
          <span><a href={kvkkUrl}>KVKK aydınlatma metnini</a> okudum ve onaylıyorum.</span>
        </label>

        <Button type="submit" className="btn full" disabled={submitting}>
          <span>{submitting ? labels.submittingLabel ?? "Gönderiliyor..." : labels.submitLabel ?? "Gönder"}</span>
          <Send aria-hidden="true" />
        </Button>
      </form>
    </Form>
  );

  return (
    <main className="iletisim-mobile-page iletisim-m iletisim-dash">
      <header className="iletisim-dash__hero">
        <Badge variant="secondary">İletişim</Badge>
        <h1>Bize ulaşın.</h1>
        <p>Ankara ve Muğla irtibat ofisleri, aynı gün mühendis dönüşü.</p>
      </header>

      {locations.length > 1 ? (
        <ToggleGroup type="single" value={activeLocation?.id ?? ""} onValueChange={(value) => value && setActiveLocationId(value)} className="iletisim-dash__branch-toggle" aria-label="Şube seçimi">
          {locations.map((location) => (
            <ToggleGroupItem key={location.id} value={location.id}>
              {location.tabLabel ?? location.name}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      ) : null}

      <Tabs defaultValue="info" className="iletisim-dash__tabs">
        <TabsList className="iletisim-dash__tabs-list">
          <TabsTrigger value="info">Bilgi</TabsTrigger>
          <TabsTrigger value="hours">Saatler</TabsTrigger>
          <TabsTrigger value="form">Form</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="iletisim-dash__panel">
          <Card className="iletisim-dash__card">
            <CardHeader>
              <CardTitle>{activeLocation?.name ?? "Ankara İrtibat Ofisi"}</CardTitle>
            </CardHeader>
            <CardContent className="iletisim-dash__info-list">
              <div><MapPin aria-hidden="true" /><span>{activeLocation?.address ?? "Adres bilgisi için bizimle iletişime geçin."}</span><Button type="button" variant="ghost" size="icon" onClick={() => copyValue(activeLocation?.address ?? "")} aria-label="Adresi kopyala"><Copy /></Button></div>
              <div><Phone aria-hidden="true" /><a href={phoneVal ? telHref(phoneVal) : undefined}>{phoneVal || "+90 312 285 66 67"}</a><Button type="button" variant="ghost" size="icon" onClick={() => copyValue(phoneVal)} aria-label="Telefonu kopyala"><Copy /></Button></div>
              <div><Mail aria-hidden="true" /><a href={emailVal ? emailHref(emailVal) : undefined}>{emailVal || "info@turuncusolar.com"}</a><Button type="button" variant="ghost" size="icon" onClick={() => copyValue(emailVal)} aria-label="E-postayı kopyala"><Copy /></Button></div>
              <div><MessageCircle aria-hidden="true" /><span>{waVal || "WhatsApp danışmanlığı"}</span><Button type="button" variant="ghost" size="icon" onClick={() => copyValue(waVal)} aria-label="WhatsApp kopyala"><Copy /></Button></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hours" className="iletisim-dash__panel">
          <Card className="iletisim-dash__card">
            <CardHeader>
              <CardTitle><Clock aria-hidden="true" /> Çalışma saatleri</CardTitle>
            </CardHeader>
            <CardContent className="iletisim-dash__hours">
              {HOURS.map(([day, hour]) => (
                <div key={day}><strong>{day}</strong><span>{hour}</span></div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="form" className="iletisim-dash__panel">
          {formNode}
        </TabsContent>
      </Tabs>
    </main>
  );
}
