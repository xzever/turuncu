"use client";

import { motion } from "framer-motion";
import { BarChart3, BatteryCharging, Coins, Gauge, Grid3x3, Leaf, SunMedium, TimerReset } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { usePathname } from "next/navigation";
import {
  PROVINCE_OPTIONS,
  getDistrictOptions,
  type SolarAnalysisResult,
  type SolarInputState,
} from "@/lib/calculationEngine";
import {
  buildHomepagePreAnalysisPricingSnapshot,
  buildLeadPayload,
} from "@/lib/leadBuilder";
import { getUtmParams } from "@/lib/utm";
import {
  PLATFORM_DEFAULT_LANGUAGE,
  PLATFORM_LANGUAGE_CODES,
  type PlatformLanguageCode,
} from "@/lib/language-config";

const modalShellVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.24,
      ease: [0.22, 1, 0.36, 1],
      when: "beforeChildren" as const,
      staggerChildren: 0.06,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.16, ease: "easeOut" as const },
  },
};

const modalPanelVariants = {
  hidden: { opacity: 0, y: 26, scale: 0.965, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { type: "spring" as const, stiffness: 240, damping: 24, mass: 0.9 },
  },
  exit: {
    opacity: 0,
    y: 18,
    scale: 0.98,
    filter: "blur(4px)",
    transition: { duration: 0.16, ease: "easeOut" as const },
  },
};

const modalItemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const },
  },
};

type OfferModalProps = {
  onClose: () => void;
  inputs: SolarInputState;
  result: SolarAnalysisResult;
  /** Anasayfada analiz başlatılmadan teklif gönderilmesin. */
  analysisStarted: boolean;
  consentLabel?: string;
  /** Optional brand override (e.g. logo URL). */
  logoUrl?: string;
  inline?: boolean;
};

type OfferFormState = {
  fullName: string;
  phone: string;
  email: string;
  customerType: "INDIVIDUAL" | "CORPORATE";
  company: string;
  budget: string;
  message: string;
  province: string;
  district: string;
  kvkkAccepted: boolean;
};

const CURRENCY_FORMATTER = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 0,
});

const DECIMAL_FORMATTER = new Intl.NumberFormat("tr-TR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const INTEGER_FORMATTER = new Intl.NumberFormat("tr-TR", {
  maximumFractionDigits: 0,
});

const SYSTEM_LABELS: Record<SolarInputState["systemType"], string> = {
  onGrid: "On-Grid",
  hybrid: "Hibrit",
  offGrid: "Off-Grid",
};

const LEAD_DRAFTS_STORAGE_KEY = "leadDrafts";
const DRAFT_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24h

type MinimalDraft = {
  name: string;
  city: string;
  type: string;
  expiresAt: number;
};
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Telefon maskesi: +90 XXX XXX XX XX */
function formatPhoneMask(value: string): string {
  const digits = value.replace(/\D/g, "").replace(/^0+/, "");
  const with90 = digits.startsWith("90") ? digits : "90" + digits;
  const rest = with90.slice(2, 12);
  const parts: string[] = [];
  if (rest.length > 0) parts.push(rest.slice(0, 3));
  if (rest.length > 3) parts.push(rest.slice(3, 6));
  if (rest.length > 6) parts.push(rest.slice(6, 8));
  if (rest.length > 8) parts.push(rest.slice(8, 10));
  return parts.length ? "+90 " + parts.join(" ") : "+90 ";
}

function createInitialForm(inputs: SolarInputState): OfferFormState {
  const districtOptions = getDistrictOptions(inputs.province);
  const district = districtOptions.includes(inputs.district) ? inputs.district : "";

  return {
    fullName: "",
    phone: "+90 ",
    email: "",
    customerType: "INDIVIDUAL",
    company: "",
    budget: "",
    message: "",
    province: inputs.province,
    district,
    kvkkAccepted: false,
  };
}

function formatKwp(value: number): string {
  return `${DECIMAL_FORMATTER.format(value)} kW`;
}

function formatKwh(value: number): string {
  return `${INTEGER_FORMATTER.format(value)} kWh`;
}

function resolveLocale(pathname: string): "tr" | "en" | "de" | "fr" {
  const segment = pathname.split("/")[1]?.toLowerCase();
  if (segment === "en" || segment === "de" || segment === "fr" || segment === "tr") {
    return segment;
  }
  return "tr";
}

function formatKg(value: number): string {
  return `${INTEGER_FORMATTER.format(value)} kg`;
}

function formatYears(value: number): string {
  return `${DECIMAL_FORMATTER.format(value)} yıl`;
}

function toMinimalDraft(payload: unknown): MinimalDraft | null {
  if (typeof payload !== "object" || payload === null) return null;
  const p = payload as Record<string, unknown>;
  const snap = p.pricingSnapshot;
  const snapLead =
    snap && typeof snap === "object" && snap !== null && !Array.isArray(snap) && "lead" in snap
      ? ((snap as { lead: unknown }).lead as Record<string, unknown>)
      : null;
  const lead = (snapLead ?? p.lead ?? p) as Record<string, unknown>;
  const contact = (lead.contact ?? p.contact ?? {}) as Record<string, unknown>;
  const location = (lead.location ?? p.location ?? {}) as Record<string, unknown>;
  const name = String(contact.fullName ?? contact.full_name ?? "").trim() || String(p.fullName ?? "").trim();
  const province = String(location.province ?? "").trim();
  const district = String(location.district ?? "").trim();
  const city = province ? (district ? `${province}, ${district}` : province) : "";
  const type = String(
    (snap && typeof snap === "object" && snap !== null && "type" in snap
      ? (snap as { type?: string }).type
      : undefined) ?? p.type ?? "homepage_pre_analysis",
  ).trim();
  return { name, city, type, expiresAt: Date.now() + DRAFT_EXPIRY_MS };
}

function cleanExpiredDrafts(drafts: MinimalDraft[]): MinimalDraft[] {
  const now = Date.now();
  return drafts.filter((d) => d.expiresAt > now);
}

function appendLeadDraft(payload: unknown): void {
  const draft = toMinimalDraft(payload);
  if (!draft) return;
  try {
    const raw = localStorage.getItem(LEAD_DRAFTS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    const drafts = Array.isArray(parsed) ? parsed : [];
    const valid = cleanExpiredDrafts(drafts as MinimalDraft[]);
    valid.push(draft);
    localStorage.setItem(LEAD_DRAFTS_STORAGE_KEY, JSON.stringify(valid));
  } catch {
    localStorage.setItem(LEAD_DRAFTS_STORAGE_KEY, JSON.stringify([draft]));
  }
}

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) =>
      !element.hasAttribute("disabled") &&
      element.getAttribute("aria-hidden") !== "true" &&
      element.tabIndex !== -1,
  );
}

type CmsBrandPayload = {
  logoUrl?: string;
  mobileLogoUrl?: string;
  companyName?: string;
};

function resolveContentLocale(): PlatformLanguageCode {
  if (typeof document === "undefined") {
    return PLATFORM_DEFAULT_LANGUAGE;
  }
  const raw = document.documentElement.getAttribute("lang")?.toLowerCase().trim() ?? "";
  const code = (raw.split("-")[0] ?? "") as PlatformLanguageCode;
  return PLATFORM_LANGUAGE_CODES.includes(code) ? code : PLATFORM_DEFAULT_LANGUAGE;
}

function buildOfferModalCmsMessage(fullName: string, phone: string, userMessage?: string): string {
  const customMessage = userMessage?.trim();
  if (customMessage && customMessage.length >= 10) {
    return customMessage.slice(0, 500);
  }
  const name = fullName.trim();
  const base = name.length >= 2 ? `Ön analiz talebi — ${name}` : "Ön analiz talebi";
  if (base.length >= 10) return base;
  return `${base} · ${phone}`.slice(0, 5000);
}

export default function OfferModal({
  onClose,
  inputs,
  result,
  analysisStarted,
  consentLabel,
  logoUrl: logoUrlProp,
  inline = false,
}: OfferModalProps) {
  const pathname = usePathname();
  const [form, setForm] = useState<OfferFormState>(() => createInitialForm(inputs));
  const [errorMessage, setErrorMessage] = useState("");
  const [successReference, setSuccessReference] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cmsBrand, setCmsBrand] = useState<CmsBrandPayload | null>(
    logoUrlProp ? { logoUrl: logoUrlProp } : null,
  );

  const modalContentRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusedElementRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);

  const districtOptions = useMemo(() => {
    const province = form.province.trim();
    if (!PROVINCE_OPTIONS.includes(province)) {
      return [];
    }
    return getDistrictOptions(province);
  }, [form.province]);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (logoUrlProp) {
      setCmsBrand({ logoUrl: logoUrlProp });
      return;
    }
    setCmsBrand(null);
  }, [logoUrlProp]);

  useEffect(() => {
    setForm((prev) => {
      const districtOptions = getDistrictOptions(inputs.province);
      const district = districtOptions.includes(inputs.district) ? inputs.district : "";

      if (prev.province === inputs.province && prev.district === district) {
        return prev;
      }

      return {
        ...prev,
        province: inputs.province,
        district,
      };
    });
  }, [inputs.district, inputs.province]);

  useEffect(() => {
    if (inline) {
      return;
    }

    previousFocusedElementRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 0);

    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const content = modalContentRef.current;
      if (!content) {
        return;
      }

      const focusableElements = getFocusableElements(content);
      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;

      if (event.shiftKey) {
        if (!activeElement || activeElement === first || !content.contains(activeElement)) {
          event.preventDefault();
          last.focus();
        }
        return;
      }

      if (activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      previousFocusedElementRef.current?.focus({ preventScroll: true });
    };
  }, [inline]);

  const handleProvinceChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      province: value,
      district: "",
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    const province = form.province.trim();
    const district = form.district.trim();
    const phoneRaw = form.phone.replace(/\D/g, "").slice(2, 12);
    const phone = phoneRaw.length >= 10 ? "+90 " + phoneRaw.replace(/(\d{3})(?=\d)/g, "$1 ").trim() : form.phone.trim();

    const provinceIsValid = PROVINCE_OPTIONS.includes(province);
    const provinceDistricts = provinceIsValid ? getDistrictOptions(province) : [];
    const districtIsValid = provinceDistricts.includes(district);

    if (!phone || phone.replace(/\D/g, "").length < 12) {
      setErrorMessage("Geçerli bir telefon numarası girin (+90 XXX XXX XX XX).");
      return;
    }

    if (!provinceIsValid || !districtIsValid) {
      setErrorMessage("Lütfen geçerli bir il ve ilçe seçin.");
      return;
    }

    if (!form.kvkkAccepted) {
      setErrorMessage("Devam etmek için KVKK onayı gereklidir.");
      return;
    }

    if (!analysisStarted) {
      setErrorMessage("Önce simülasyon başlatın.");
      return;
    }

    if (form.message.trim().length > 500) {
      setErrorMessage("Mesaj en fazla 500 karakter olabilir.");
      return;
    }

    const referenceId = `TS-${Date.now()}`;
    const utm = getUtmParams();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const followUpDateIso = tomorrow.toISOString();

    const leadPart = buildLeadPayload(
      {
        fullName: form.fullName,
        phone,
        province,
        district,
      },
      inputs,
      result,
    );

    const pricingSnapshot = buildHomepagePreAnalysisPricingSnapshot({
      referenceId,
      followUpDateIso,
      inputs,
      result,
      systemTypeLabel: SYSTEM_LABELS[inputs.systemType],
      lead: leadPart,
      source: "homepage-pre-analysis",
    });

    if (pricingSnapshot == null) {
      setErrorMessage("Önce simülasyon başlatın.");
      return;
    }

    if (Object.keys(utm).length > 0) {
      pricingSnapshot.utm = utm;
    }

    const fullNameForCms = form.fullName.trim().length >= 2 ? form.fullName.trim() : "Misafir";
    const messageForCms = buildOfferModalCmsMessage(form.fullName, phone, form.message);
    const email = form.email.trim();
    const company = form.customerType === "CORPORATE" ? form.company.trim() : "";
    const budget = form.budget.trim();

    /** `publicPricingLeadSchema` (.strict) — yalnızca şema alanları; UTM `pricingSnapshot` içinde. */
    const leadPayload: Record<string, unknown> = {
      contactPageSlug: "iletisim",
      locale: resolveContentLocale(),
      fullName: fullNameForCms,
      message: messageForCms,
      consent: form.kvkkAccepted,
      phone,
      customerType: form.customerType,
      pricingSnapshot,
    };

    if (email) {
      leadPayload.email = email;
    }

    if (company) {
      leadPayload.company = company;
    }

    if (budget) {
      leadPayload.budget = budget;
    }

    if (typeof window !== "undefined" && window.location.href) {
      leadPayload.sourceUrl = window.location.href;
    }

    setIsSubmitting(true);

    try {
      appendLeadDraft(leadPayload);
      setErrorMessage("");
      setSuccessReference(referenceId);
    } catch {
      setErrorMessage("Gönderim başarısız oldu. Lütfen tekrar deneyin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const summaryConsumptionLabel = inputs.useMonthlyBill ? "Aylık fatura" : "Yıllık tüketim";
  const summaryConsumptionValue = inputs.useMonthlyBill
    ? CURRENCY_FORMATTER.format(inputs.monthlyBillTry)
    : formatKwh(result.baseAnnualConsumptionKwh);

  const dialogLocale = resolveLocale(pathname);
  const modalCalendarDate = useMemo(() => new Date(), []);
  const headerDateLabel = useMemo(
    () =>
      new Intl.DateTimeFormat(dialogLocale === "tr" ? "tr-TR" : "en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(modalCalendarDate),
    [dialogLocale, modalCalendarDate],
  );

  const summaryItems = [
    { label: "Sistem tipi", value: SYSTEM_LABELS[inputs.systemType], icon: SunMedium, tone: "teal" },
    { label: summaryConsumptionLabel, value: summaryConsumptionValue, icon: BarChart3, tone: "orange" },
    { label: "Sistem gücü", value: formatKwp(result.systemSizeKwp), icon: Gauge, tone: "blue" },
    { label: "Panel sayısı", value: INTEGER_FORMATTER.format(result.panelCount), icon: Grid3x3, tone: "teal" },
    { label: "Yıllık üretim", value: formatKwh(result.annualProductionKwh), icon: BatteryCharging, tone: "blue" },
    { label: "Aylık tasarruf", value: CURRENCY_FORMATTER.format(result.monthlySavingsTry), icon: Coins, tone: "orange" },
    { label: "Geri dönüş", value: formatYears(result.paybackYears), icon: TimerReset, tone: "orange" },
    { label: "CO₂ azaltımı", value: formatKg(result.co2ReductionKg), icon: Leaf, tone: "green" },
  ] as const;

  const formMarkup = successReference ? (
    <motion.div className="walr-lead-modal__success" variants={modalItemVariants}>
      <h3 id="walr-offer-success-title">Talebiniz alındı</h3>
      <p>Talebiniz alındı. Uzman ekibimiz sizi arayacak.</p>
      <p className="walr-lead-modal__ref">Referans No: {successReference}</p>
    </motion.div>
  ) : (
    <motion.div className={`walr-lead-modal__body${inline ? " walr-lead-modal__body--inline" : ""}`} variants={modalShellVariants}>
      {inline ? null : (
        <motion.section className="walr-lead-modal__summary" aria-label="Analiz özeti" variants={modalItemVariants}>
          <h3>Analiz Özeti</h3>
          <div className="walr-lead-modal__summary-grid">
            {summaryItems.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.label} className={`walr-lead-modal__summary-card walr-lead-modal__summary-card--${item.tone}`}>
                  <div className="walr-lead-modal__summary-card-top">
                    <span>{item.label}</span>
                    <i className="walr-lead-modal__summary-icon" aria-hidden="true">
                      <Icon size={14} strokeWidth={2} />
                    </i>
                  </div>
                  <strong>{item.value}</strong>
                </article>
              );
            })}
          </div>
        </motion.section>
      )}

      <motion.form className={`walr-lead-modal__form${inline ? " walr-lead-modal__form--inline" : ""}`} onSubmit={handleSubmit} variants={modalItemVariants}>
        <div className="walr-lead-modal__form-head">
          <h4>Teklif Formu</h4>
          <button type="button" ref={closeButtonRef} className="walr-lead-modal__close" onClick={onClose} aria-label="Kapat">
            ×
          </button>
        </div>
        <label htmlFor="offer-fullname">
          <span>Ad Soyad (opsiyonel)</span>
          <input
            id="offer-fullname"
            type="text"
            value={form.fullName}
            onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
          />
        </label>

        <label htmlFor="offer-phone">
          <span>Telefon (+90 XXX XXX XX XX)</span>
          <input
            id="offer-phone"
            type="tel"
            required
            placeholder="+90"
            value={form.phone}
            onChange={(event) => setForm((prev) => ({ ...prev, phone: formatPhoneMask(event.target.value) }))}
          />
        </label>

        <label htmlFor="offer-email">
          <span>Mail (opsiyonel)</span>
          <input
            id="offer-email"
            type="email"
            placeholder="ornek@mail.com"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          />
        </label>

        {inline ? null : (
          <div className="walr-lead-modal__grid">
            <label htmlFor="offer-province">
              <span>İl</span>
              <input
                id="offer-province"
                type="text"
                list="offer-province-options"
                required
                value={form.province}
                onChange={(event) => handleProvinceChange(event.target.value)}
              />
              <datalist id="offer-province-options">
                {PROVINCE_OPTIONS.map((province) => (
                  <option key={province} value={province} />
                ))}
              </datalist>
            </label>

            <label htmlFor="offer-district">
              <span>İlçe</span>
              <input
                id="offer-district"
                type="text"
                list="offer-district-options"
                required
                value={form.district}
                onChange={(event) => setForm((prev) => ({ ...prev, district: event.target.value }))}
              />
              <datalist id="offer-district-options">
                {districtOptions.map((district) => (
                  <option key={district} value={district} />
                ))}
              </datalist>
            </label>
          </div>
        )}

        <label htmlFor="offer-kvkk" className="walr-lead-modal__consent">
          <input
            id="offer-kvkk"
            type="checkbox"
            checked={form.kvkkAccepted}
            onChange={(event) => setForm((prev) => ({ ...prev, kvkkAccepted: event.target.checked }))}
          />
          <span>{consentLabel ?? "KVKK aydınlatma metnini okudum ve onaylıyorum."}</span>
        </label>

        {errorMessage ? <p className="walr-lead-modal__error" role="alert">{errorMessage}</p> : null}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Gönderiliyor..." : "Teklifi Gönder"}
        </button>
      </motion.form>
    </motion.div>
  );
  if (inline) {
    return (
      <motion.div
        className="walr-lead-modal walr-lead-modal--inline"
        role="region"
        aria-label="Teklif formu"
        variants={modalShellVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.div className="walr-lead-modal__content walr-lead-modal__content--inline" ref={modalContentRef} variants={modalPanelVariants}>
          {formMarkup}
        </motion.div>
      </motion.div>
    );
  }

  const resolvedModalLogoUrl =
    cmsBrand?.logoUrl || cmsBrand?.mobileLogoUrl || logoUrlProp || undefined;
  const modalLogoAlt = cmsBrand?.companyName?.trim() || "Turuncu Solar";

  return (
    <motion.div
      className="walr-lead-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby={successReference ? "walr-offer-success-title" : "walr-offer-brand-title"}
      variants={modalShellVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div
        className="walr-lead-modal__backdrop"
        aria-hidden="true"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      />

      <motion.div
        className="walr-lead-modal__content"
        ref={modalContentRef}
        tabIndex={-1}
        variants={modalPanelVariants}
      >
        <header className="walr-lead-modal__company-header">
          <div className="walr-lead-modal__company-header-logo">
            {resolvedModalLogoUrl ? (
              <Image
                src={resolvedModalLogoUrl}
                alt={modalLogoAlt}
                width={200}
                height={48}
                className="walr-lead-modal__company-header-logo-img"
              />
            ) : (
              <span className="walr-lead-modal__company-header-fallback">{modalLogoAlt}</span>
            )}
          </div>
          <div className="walr-lead-modal__company-header-center">
            <h2 id={successReference ? undefined : "walr-offer-brand-title"} className="walr-lead-modal__company-header-title">
              Ücretsiz Ön Analiz
            </h2>
          </div>
          <div className="walr-lead-modal__company-header-meta">
            <time dateTime={modalCalendarDate.toISOString().slice(0, 10)}>{headerDateLabel}</time>
            <span className="walr-lead-modal__company-header-tagline">30 saniyede analiz</span>
          </div>
        </header>

        {formMarkup}
      </motion.div>
    </motion.div>
  );
}
