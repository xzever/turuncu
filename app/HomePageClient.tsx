"use client";

import {
  Activity,
  BarChart3,
  Car,
  Check,
  ChevronRight,
  Clock3,
  Compass,
  Gauge,
  Grid3x3,
  Leaf,
  LocateFixed,
  MapPin,
  Sun,
  Wallet,
} from "lucide-react";
import { AnimatePresence, animate, motion, useMotionValue, useMotionValueEvent } from "framer-motion";
import Image from "next/image";
import { createPortal } from "react-dom";
import { type CSSProperties, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import OfferModal from "@/components/home/OfferModal";
import { SHELL_HANDHELD_QUERY } from "@/lib/breakpoints";

import {
  PLATFORM_DEFAULT_LANGUAGE,
  PLATFORM_LANGUAGE_CODES,
  PLATFORM_LANGUAGE_META,
  type PlatformLanguageCode,
} from "@/lib/language-config";
import { fillHomePageTemplate, getDefaultHomePageUiCopy } from "@/lib/homepageUiCopy";
import { resolveLocaleFromPathname } from "@/lib/localePath";
import { PROVINCE_OPTIONS, getDistrictOptions } from "@/lib/calculationEngine";
import { useSolarAnalysisStore } from "@/lib/solarAnalysisStore";
import "./page.css";

type SliderSlide = {
  id: string;
  mediaType?: "image" | "video";
  image: string;
  mobileImage?: string;
  imageAlt: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  order: number;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

type CountUpValueProps = {
  value: number;
  format: (value: number) => string;
  fromZero?: boolean;
  duration?: number;
};

function CountUpValue({ value, format, fromZero, duration }: CountUpValueProps) {
  const motionValue = useMotionValue(fromZero ? 0 : value);
  const [displayValue, setDisplayValue] = useState(fromZero ? 0 : value);

  useMotionValueEvent(motionValue, "change", (latest) => {
    setDisplayValue(latest);
  });

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: duration ?? 0.45,
      ease: duration ? [0.25, 1, 0.5, 1] : [0.22, 1, 0.36, 1],
    });

    return () => controls.stop();
  }, [motionValue, value, duration]);

  return (
    <motion.span
      key={`value-${value}`}
      initial={{ opacity: 0.74, filter: "blur(0.3px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {format(displayValue)}
    </motion.span>
  );
}

type MobileSelectProps = {
  options: string[];
  value: string;
  onChange: (value: string) => void;
};

function MobileSelect({ options, value, onChange }: MobileSelectProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [listStyle, setListStyle] = useState<CSSProperties | null>(null);

  const syncPosition = useCallback(() => {
    const triggerElement = triggerRef.current;
    if (!triggerElement) return;
    const rect = triggerElement.getBoundingClientRect();
    setListStyle({
      top: `${rect.bottom}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
    });
  }, []);

  const handleOutsideClick = useCallback((e: MouseEvent) => {
    if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      syncPosition();
      document.addEventListener("mousedown", handleOutsideClick);
      const handleScrollClose = () => setOpen(false);
      window.addEventListener("scroll", handleScrollClose, true);
      window.addEventListener("resize", handleScrollClose);
      return () => {
        document.removeEventListener("mousedown", handleOutsideClick);
        window.removeEventListener("scroll", handleScrollClose, true);
        window.removeEventListener("resize", handleScrollClose);
      };
    }
  }, [open, handleOutsideClick, syncPosition]);

  useEffect(() => {
    if (!open || !listRef.current) return;
    const activeItem = listRef.current.querySelector<HTMLElement>(".hp-mobile-select__item.is-active");
    activeItem?.scrollIntoView({ block: "center" });
  }, [open, value]);

  return (
    <div className="hp-mobile-select" ref={wrapRef}>
      <button type="button" ref={triggerRef} className="hp-mobile-select__trigger" onClick={() => setOpen(!open)}>
        <span>{value}</span>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2.5 4L5 6.5L7.5 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      {open && listStyle
        ? createPortal(
            <div className="hp-mobile-select__list" ref={listRef} style={listStyle}>
              {options.map((o) => (
                <button
                  key={o}
                  type="button"
                  className={`hp-mobile-select__item${o === value ? " is-active" : ""}`}
                  onClick={() => { onChange(o); setOpen(false); }}
                >
                  {o}
                </button>
              ))}
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

function getDefaultCmsCopy(locale: PlatformLanguageCode) {
  if (locale === "tr") {
    return {
      heroTitle: "AI SİSTEMLERİ",
      heroSubtitle: "Akıllı Ön Analiz Motoru",
      ctaPrimaryLabel: "Analizi Başlat",
      ctaSecondaryLabel: "Teklif Al",
      microcopy: "Ön analiz 30 saniye sürer • Ücretsiz keşif planı",
      consentLabel: "Gizlilik politikasını okudum ve kabul ediyorum.",
    };
  }

  return {
    heroTitle: "AI SYSTEMS",
    heroSubtitle: "Smart pre-analysis engine",
    ctaPrimaryLabel: "Start analysis",
    ctaSecondaryLabel: "Get quote",
    microcopy: "Pre-analysis takes 30 seconds • Free discovery plan",
    consentLabel: "I have read and accept the privacy notice.",
  };
}

export default function HomePage() {
  const {
    config: solarConfig,
    inputs,
    result,
    analysisStarted,
    setInput,
    setProvince,
    startAnalysis,
  } = useSolarAnalysisStore();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeLocale = useMemo(() => {
    const locale = resolveLocaleFromPathname(pathname, PLATFORM_DEFAULT_LANGUAGE);
    return PLATFORM_LANGUAGE_CODES.includes(locale as PlatformLanguageCode)
      ? (locale as PlatformLanguageCode)
      : PLATFORM_DEFAULT_LANGUAGE;
  }, [pathname]);
  const numberLocale = PLATFORM_LANGUAGE_META[activeLocale]?.locale ?? "tr-TR";
  const defaultCmsCopy = useMemo(() => getDefaultCmsCopy(activeLocale), [activeLocale]);
  const defaultUiCopy = useMemo(() => getDefaultHomePageUiCopy(activeLocale), [activeLocale]);
  const isTurkish = activeLocale === "tr";
  const desktopRoofTypeLabelId = useId();
  const mobileRoofTypeLabelId = useId();
  const decimalFormatter = useMemo(
    () =>
      new Intl.NumberFormat(numberLocale, {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }),
    [numberLocale],
  );
  const integerFormatter = useMemo(
    () =>
      new Intl.NumberFormat(numberLocale, {
        maximumFractionDigits: 0,
      }),
    [numberLocale],
  );
  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(numberLocale, {
        style: "currency",
        currency: "TRY",
        maximumFractionDigits: 0,
      }),
    [numberLocale],
  );

  const [isOfferModalOpen, setOfferModalOpen] = useState(false);
  const [calcModalOpen, setCalcModalOpen] = useState(false);
  const sliderSlides = useMemo<SliderSlide[]>(() => [], []);
  const sliderIndex = 0;
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [isMobileSelect, setIsMobileSelect] = useState(false);
  const [mobileStep, setMobileStep] = useState<1 | 2 | 3 | 4>(1);
  const [isCalculating, setIsCalculating] = useState(false);
  const [calcFormName, setCalcFormName] = useState("");
  const [calcFormPhone, setCalcFormPhone] = useState("");
  const [calcFormEmail, setCalcFormEmail] = useState("");
  const [calcFormKvkk, setCalcFormKvkk] = useState(false);
  const [calcFormSending, setCalcFormSending] = useState(false);
  const [slideDir, setSlideDir] = useState<"fwd" | "back">("fwd");
  const cmsCopy = defaultCmsCopy;
  const uiCopy = defaultUiCopy;
  const sliderLimits = solarConfig.sliderLimits;

  const goStep = (target: 1 | 2 | 3 | 4) => {
    setSlideDir(target > mobileStep ? "fwd" : "back");
    setMobileStep(target);
  };

  const handleStartAnalysis = () => {
    startAnalysis();

    if (isMobileSelect) {
      setIsCalculating(true);
      setTimeout(() => {
        setIsCalculating(false);
        goStep(2);
      }, 1500);
      return;
    }

    if (typeof window === "undefined") return;
    window.requestAnimationFrame(() => {
      const target = document.querySelector<HTMLElement>(".hp-section--calculator");
      target?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  };

  const handleCalcFormSubmit = () => {
    if (!calcFormPhone.trim()) return;
    setCalcFormSending(true);
    window.setTimeout(() => {
      setCalcFormSending(false);
    }, 400);
  };

  const handleCloseCalcModal = useCallback(() => {
    setCalcModalOpen(false);
    const nextQuery = new URLSearchParams(searchParams.toString());
    nextQuery.delete("hesapla");
    const nextSearch = nextQuery.toString();
    router.replace(nextSearch ? `${pathname}?${nextSearch}` : pathname, { scroll: false });
  }, [pathname, router, searchParams]);

  const formatKw = (value: number) => `${decimalFormatter.format(value)} kWp`;
  const formatKwhInt = (value: number) => `${integerFormatter.format(value)} kWh`;
  const formatMoney = (value: number) => currencyFormatter.format(value);
  const formatYears = (value: number) => `${decimalFormatter.format(value)} ${isTurkish ? "yıl" : "years"}`;
  const formatCo2 = (value: number) => `${decimalFormatter.format(value / 1000)} ${isTurkish ? "ton" : "tons"}`;

  const ui = useMemo(
    () => ({
      heroAria: isTurkish ? "Solar konfigurator sahnesi" : "Solar configurator stage",
      sliderDetails: isTurkish ? "Detayları Gör" : "See details",
      sliderDetailsAria: (title: string) =>
        isTurkish ? `${title || "Slider"} detaylarını gör` : `View details for ${title || "slider"}`,
      sliderDots: isTurkish ? "Slider sayfalari" : "Slider pagination",
      systemPanelAria: isTurkish ? "Sistem secim paneli" : "System selection panel",
      addEvConsumption: uiCopy.addEvConsumption,
      evDailyKmAria: isTurkish ? "Günlük EV kilometresi" : "Daily EV distance",
      kmPerDay: uiCopy.kmPerDay,
      annualConsumption: uiCopy.annualConsumption,
      annualConsumptionAria: isTurkish ? "Yıllık tüketim tutarı" : "Annual consumption amount",
      computeFromBill: uiCopy.computeFromBill,
      monthlyBillAria: isTurkish ? "Aylık fatura tutarı" : "Monthly bill amount",
      assistantInputs: isTurkish ? "Proje girdileri" : "Project inputs",
      province: uiCopy.fieldLabels.province,
      district: uiCopy.fieldLabels.district,
      roofType: uiCopy.fieldLabels.roofType,
      roofArea: uiCopy.fieldLabels.roofArea,
      orientation: uiCopy.fieldLabels.orientation,
      tilt: uiCopy.fieldLabels.tilt,
      roofLimitActive: uiCopy.roofLimitActiveLabel,
      roofLimitOk: uiCopy.roofLimitOkLabel,

      metricsAria: isTurkish ? "Canli analiz ozeti" : "Live analysis summary",
      specificYield: uiCopy.metricLabels.specificYield,
      fallbackYieldApplied: uiCopy.metricLabels.fallbackYieldApplied,
      panelCount: uiCopy.metricLabels.panelCount,
      moduleLabel: uiCopy.metricLabels.moduleLabel,
      systemSize: uiCopy.metricLabels.systemSize,
      roofLimited: uiCopy.metricLabels.roofLimited,
      optimizedForDemand: uiCopy.metricLabels.optimizedForDemand,
      co2Reduction: uiCopy.metricLabels.co2Reduction,
      annualCarbonReduction: uiCopy.metricLabels.annualCarbonReduction,
      annualProduction: uiCopy.metricLabels.annualProduction,
      annualSavings: uiCopy.metricLabels.annualSavings,
      payback: uiCopy.metricLabels.payback,
      systemType: uiCopy.metricLabels.systemType,
      analysisSuffix: uiCopy.metricLabels.analysisSuffix,
      roiLabel: uiCopy.metricLabels.roiLabel,
      locationCoefficient: (province: string) =>
        fillHomePageTemplate(uiCopy.templates.locationCoefficient, { province }),
      averagePerDay: (value: number) =>
        fillHomePageTemplate(uiCopy.templates.averagePerDay, {
          value: decimalFormatter.format(value),
        }),
      tariffLine: (value: number) =>
        fillHomePageTemplate(uiCopy.templates.tariffLine, {
          value: decimalFormatter.format(value),
        }),
      investmentEstimate: (value: number) =>
        fillHomePageTemplate(uiCopy.templates.investmentEstimate, {
          value: currencyFormatter.format(value),
        }),
      assistantSummary: (province: string, district: string, yieldValue: number, performanceRatio: number, roofLimited: boolean) =>
        fillHomePageTemplate(uiCopy.templates.assistantSummary, {
          province,
          district,
          yield: integerFormatter.format(yieldValue),
          performanceRatio: decimalFormatter.format(performanceRatio),
          roofLimitLabel: roofLimited ? uiCopy.roofLimitActiveLabel : uiCopy.roofLimitOkLabel,
        }),
      systemLabels: uiCopy.systemLabels,
      roofTypeLabels: uiCopy.roofTypeLabels,
      orientationLabels: uiCopy.orientationLabels,
    }),
    [currencyFormatter, decimalFormatter, integerFormatter, isTurkish, uiCopy],
  );

  const systemPanelItems = useMemo(
    () => [
      { value: "onGrid" as const, label: ui.systemLabels.onGrid, icon: Grid3x3 },
      { value: "hybrid" as const, label: ui.systemLabels.hybrid, icon: Sun },
      { value: "offGrid" as const, label: ui.systemLabels.offGrid, icon: Car },
    ],
    [ui],
  );

  const roofTypeItems = useMemo(
    () => [
      { value: "kiremit" as const, label: ui.roofTypeLabels.kiremit },
      { value: "trapez" as const, label: ui.roofTypeLabels.trapez },
      { value: "sandvic" as const, label: ui.roofTypeLabels.sandvic },
      { value: "teras" as const, label: ui.roofTypeLabels.teras },
    ],
    [ui],
  );

  const roofOrientationItems = useMemo(
    () => [
      { value: "south" as const, label: ui.orientationLabels.south },
      { value: "southEast" as const, label: ui.orientationLabels.southEast },
      { value: "eastWest" as const, label: ui.orientationLabels.eastWest },
      { value: "north" as const, label: ui.orientationLabels.north },
    ],
    [ui],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    // AGENTS.md §0.2.1 + MOBILE-DESIGN-SYSTEM §2.1 — telefon + tablet (iPad Air/Pro
    // dahil yatay) aynı mobil aile. (max-width: 1279px) klasik viewport kuralı,
    // (pointer: coarse) ile dokunmatik tablet/laptop yatay (1366px gibi) dahil edilir.
    // Bu sayede iPad'lerde de native <select> yerine custom MobileSelect render edilir.
    const mediaQuery = window.matchMedia(SHELL_HANDHELD_QUERY);
    const selectQuery = window.matchMedia(SHELL_HANDHELD_QUERY);
    const syncViewport = () => setIsMobileViewport(mediaQuery.matches);
    const syncSelect = () => setIsMobileSelect(selectQuery.matches);
    syncViewport();
    syncSelect();
    mediaQuery.addEventListener("change", syncViewport);
    selectQuery.addEventListener("change", syncSelect);
    return () => {
      mediaQuery.removeEventListener("change", syncViewport);
      selectQuery.removeEventListener("change", syncSelect);
    };
  }, []);

  useEffect(() => {
    document.documentElement.toggleAttribute("data-calc-open", calcModalOpen && isMobileViewport);
    return () => document.documentElement.removeAttribute("data-calc-open");
  }, [calcModalOpen, isMobileViewport]);

  useEffect(() => {
    if (!isMobileViewport) return;
    if (searchParams.get("hesapla") !== "1") return;
    setSlideDir("fwd");
    setMobileStep(1);
    setCalcModalOpen(true);
  }, [isMobileViewport, searchParams]);

  const activeSlide = sliderSlides[sliderIndex];
  const activeSlideMedia = activeSlide
    ? isMobileViewport && activeSlide.mobileImage
      ? activeSlide.mobileImage
      : activeSlide.image
    : "";

  const provinceDistrictOptions = useMemo(() => getDistrictOptions(inputs.province), [inputs.province]);
  const openOfferModal = () => setOfferModalOpen(true);

  const roiPercent = useMemo(() => {
    const normalized = Math.max(0.01, result.paybackYears);
    return Math.round(clamp((7 / normalized) * 40, 28, 92));
  }, [result.paybackYears]);

  return (
    <div className="walr-page">
      {/* Fullscreen video background */}
      <div className="hp-video-bg" aria-hidden="true">
        <video
          src="/hakkimizda.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="hp-video-overlay" />
        {sliderSlides.length > 0 ? (
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={sliderSlides[sliderIndex]?.id ?? sliderIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="hp-slider-media"
            >
              {(sliderSlides[sliderIndex]?.mediaType ?? "image") === "video" ? (
                <video
                  src={activeSlideMedia}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <Image
                  src={activeSlideMedia}
                  alt={sliderSlides[sliderIndex]?.imageAlt ?? ""}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="100vw"
                  priority
                />
              )}
            </motion.div>
          </AnimatePresence>
        ) : null}
        {/* Hero text overlay on the left side */}
        {(sliderSlides[sliderIndex]?.title || sliderSlides[sliderIndex]?.subtitle) ? (
          <div className="hp-hero-text">
            {sliderSlides[sliderIndex]?.title ? <h1 className="hp-hero-title">{sliderSlides[sliderIndex].title}</h1> : null}
            {sliderSlides[sliderIndex]?.subtitle ? <p className="hp-hero-subtitle">{sliderSlides[sliderIndex].subtitle}</p> : null}
            {sliderSlides.length > 1 ? (
              <div className="hp-hero-dots">
                {sliderSlides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Slide ${i + 1}`}
                    className={i === sliderIndex ? "is-active" : undefined}
                    onClick={() => undefined}
                  />
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* === FIXED RIGHT PANEL (desktop) / MOBILE STEPPER === */}
      <aside className="hp-panel" aria-label={ui.systemPanelAria}>
        <div className="hp-panel__scroll">

          {/* ── Mobile stepper bar ── */}
          {isMobileSelect && (
            <div className="hp-m-stepper">
              {[1, 2, 3, 4].map((s) => (
                <span key={s} className={`hp-m-stepper__bar${s <= mobileStep ? " is-filled" : ""}${s === mobileStep ? " is-active" : ""}`} />
              ))}
            </div>
          )}

          {/* ── STEP 1: System & Calculation (always on desktop, step 1 on mobile) ── */}
          {(!isMobileSelect || mobileStep === 1) && (
            <>
              <div className="hp-section hp-section--calculator">
                <p className="hp-section__label">{isTurkish ? "Sistem Tipi" : "System Type"}</p>
                <div className="hp-system-btns">
                  {systemPanelItems.map((item) => {
                    const isActive = item.value === inputs.systemType;
                    return (
                      <button
                        key={item.value}
                        type="button"
                        className={`hp-system-btn${isActive ? " is-active" : ""}`}
                        onClick={() => setInput("systemType", item.value)}
                      >
                        <item.icon size={14} strokeWidth={1.8} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="hp-divider" />

              <div className="hp-section hp-section--consumption">
                <p className="hp-section__label">{ui.annualConsumption}</p>

                {/* Manuel tüketim girişleri — Yıllık ve Aylık (kWh). İki input birbirine bağlı. */}
                <div className="hp-fields hp-fields--consumption">
                  <label className="hp-field">
                    <span><BarChart3 size={10} /> {isTurkish ? "Yıllık Tüketim (kWh)" : "Annual Consumption (kWh)"}</span>
                    <input
                      type="number"
                      inputMode="numeric"
                      min={sliderLimits.annualConsumptionMin}
                      max={sliderLimits.annualConsumptionMax}
                      step={100}
                      value={inputs.annualConsumptionKwh}
                      onChange={(e) => setInput("annualConsumptionKwh", Number(e.target.value))}
                      aria-label={ui.annualConsumptionAria}
                      disabled={inputs.useMonthlyBill}
                    />
                  </label>
                  <label className="hp-field">
                    <span><Activity size={10} /> {isTurkish ? "Aylık Tüketim (kWh)" : "Monthly Consumption (kWh)"}</span>
                    <input
                      type="number"
                      inputMode="numeric"
                      min={Math.ceil(sliderLimits.annualConsumptionMin / 12)}
                      max={Math.ceil(sliderLimits.annualConsumptionMax / 12)}
                      step={10}
                      value={Math.round(inputs.annualConsumptionKwh / 12)}
                      onChange={(e) => setInput("annualConsumptionKwh", Number(e.target.value) * 12)}
                      aria-label={isTurkish ? "Aylık tüketim kWh" : "Monthly consumption kWh"}
                      disabled={inputs.useMonthlyBill}
                    />
                  </label>
                </div>

                <div className="hp-fields">
                  <div className="hp-field">
                    <span><MapPin size={10} /> {ui.province}</span>
                    <MobileSelect options={PROVINCE_OPTIONS} value={inputs.province} onChange={(v) => setProvince(v)} />
                  </div>
                  <div className="hp-field">
                    <span><LocateFixed size={10} /> {ui.district}</span>
                    <MobileSelect options={provinceDistrictOptions} value={inputs.district} onChange={(v) => setInput("district", v)} />
                  </div>
                  <div className="hp-field">
                    <span id={desktopRoofTypeLabelId}><Sun size={10} /> {ui.roofType}</span>
                    <div className="hp-roof-type-radios" role="radiogroup" aria-labelledby={desktopRoofTypeLabelId}>
                      {roofTypeItems.map((item) => (
                        <label key={item.value} className="hp-roof-type-radios__option">
                          <input
                            type="radio"
                            name="desktop-roof-type"
                            value={item.value}
                            checked={inputs.roofType === item.value}
                            onChange={() => setInput("roofType", item.value)}
                          />
                          <span>{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <label className="hp-field">
                    <span><BarChart3 size={10} /> {ui.roofArea}</span>
                    <input type="number" min={sliderLimits.roofAreaMin} max={sliderLimits.roofAreaMax} value={inputs.roofAreaM2} onChange={(e) => setInput("roofAreaM2", Number(e.target.value))} />
                  </label>
                  <div className="hp-field">
                    <span><Compass size={10} /> {ui.orientation}</span>
                    <MobileSelect options={roofOrientationItems.map((o) => o.label)} value={roofOrientationItems.find((o) => o.value === inputs.roofOrientation)?.label ?? roofOrientationItems[0].label} onChange={(label) => {
                      const next = roofOrientationItems.find((o) => o.label === label);
                      if (next) setInput("roofOrientation", next.value);
                    }} />
                  </div>
                </div>

                <div className="hp-ai-summary" aria-live="polite">
                  <p>{ui.assistantSummary(inputs.province, inputs.district, result.specificYieldKwhPerKwp, result.performanceRatio, result.roofLimitApplied)}</p>
                </div>

                {/* Mobile: Start Analysis button (triggers mobile step 2 transition) */}
                {isMobileSelect && (
                  <div className="hp-actions">
                    <button type="button" className="hp-btn hp-btn--primary hp-btn--sheen" onClick={handleStartAnalysis} disabled={isCalculating}>
                      <span className="hp-btn__label">
                        {isCalculating
                          ? (isTurkish ? "â³ Hesaplanıyor..." : "â³ Calculating...")
                          : (isTurkish ? "Analizi Başlat" : "Start Analysis")}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ── STEP 2: Analysis Results (desktop: always visible & live, mobile: step 2) ── */}
          {!isMobileSelect || (isMobileSelect && mobileStep === 2) ? (
            <>
              {!isMobileSelect && <div className="hp-divider" />}

              {isMobileSelect && (
                <button type="button" className="hp-m-back" onClick={() => setMobileStep(1)}>
                  ← {isTurkish ? "Geri" : "Back"}
                </button>
              )}

              <div className="hp-section">
                <div className="hp-section__header">
                  <p className="hp-section__label">
                    <span className="hp-section__dot" aria-hidden="true" />
                    {isTurkish ? "Analiz Sonuçları" : "Analysis Results"}
                  </p>
                  <span className="hp-badge-ready">{isTurkish ? "â— CANLI" : "â— LIVE"}</span>
                </div>

                {/* ── Hero savings card (big emphasis) ── */}
                <div className="hp-hero-metric" aria-live="polite">
                  <div className="hp-hero-metric__top">
                    <Wallet size={14} strokeWidth={2} />
                    <span>{isTurkish ? "Yıllık Tasarrufun" : "Annual Savings"}</span>
                  </div>
                  <strong className="hp-hero-metric__value">
                    <CountUpValue value={result.annualSavingsTry} format={formatMoney} fromZero duration={1.2} />
                  </strong>
                  <div className="hp-hero-metric__foot">
                    <span className="hp-hero-metric__badge">{roiPercent}% ROI</span>
                    <span className="hp-hero-metric__sub">
                      <CountUpValue value={result.paybackYears} format={formatYears} fromZero duration={1} /> {isTurkish ? "geri ödeme" : "payback"}
                    </span>
                  </div>
                </div>

                <div className="hp-stats-grid hp-stats-grid--in-panel" aria-label={ui.metricsAria}>
                  <article className="hp-stat hp-stat--blue">
                    <div className="hp-stat__top">
                      <span className="hp-stat__label">{ui.specificYield}</span>
                      <BarChart3 size={14} strokeWidth={2} className="hp-stat__icon" />
                    </div>
                    <strong className="hp-stat__value">
                      <CountUpValue value={result.specificYieldKwhPerKwp} format={(v) => `${integerFormatter.format(v)}`} fromZero duration={1} />
                      <small className="hp-stat__unit"> kWh/kWp</small>
                    </strong>
                  </article>
                  <article className="hp-stat hp-stat--purple">
                    <div className="hp-stat__top">
                      <span className="hp-stat__label">{ui.panelCount}</span>
                      <Grid3x3 size={14} strokeWidth={2} className="hp-stat__icon" />
                    </div>
                    <strong className="hp-stat__value">
                      <CountUpValue value={result.panelCount} format={(v) => integerFormatter.format(v)} fromZero duration={1} />
                      <small className="hp-stat__unit"> {ui.moduleLabel}</small>
                    </strong>
                  </article>
                  <article className="hp-stat hp-stat--blue">
                    <div className="hp-stat__top">
                      <span className="hp-stat__label">{ui.systemSize}</span>
                      <Gauge size={14} strokeWidth={2} className="hp-stat__icon" />
                    </div>
                    <strong className="hp-stat__value">
                      <CountUpValue value={result.systemSizeKwp} format={formatKw} fromZero duration={1} />
                    </strong>
                  </article>
                  <article className="hp-stat hp-stat--green">
                    <div className="hp-stat__top">
                      <span className="hp-stat__label">{ui.co2Reduction}</span>
                      <Leaf size={14} strokeWidth={2} className="hp-stat__icon" />
                    </div>
                    <strong className="hp-stat__value">
                      <CountUpValue value={result.co2ReductionKg} format={formatCo2} fromZero duration={1} />
                    </strong>
                  </article>
                  <article className="hp-stat hp-stat--orange">
                    <div className="hp-stat__top">
                      <span className="hp-stat__label">{ui.annualProduction}</span>
                      <Activity size={14} strokeWidth={2} className="hp-stat__icon" />
                    </div>
                    <strong className="hp-stat__value">
                      <CountUpValue value={result.annualProductionKwh} format={formatKwhInt} fromZero duration={1} />
                    </strong>
                  </article>
                  <article className="hp-stat hp-stat--orange hp-stat--savings">
                    <div className="hp-stat__top">
                      <span className="hp-stat__label">{ui.annualSavings}</span>
                      <Wallet size={14} strokeWidth={2} className="hp-stat__icon" />
                    </div>
                    <strong className="hp-stat__value">
                      <CountUpValue value={result.annualSavingsTry} format={formatMoney} fromZero duration={1} />
                    </strong>
                  </article>
                  <article className="hp-stat hp-stat--teal">
                    <div className="hp-stat__top">
                      <span className="hp-stat__label">{ui.payback}</span>
                      <Clock3 size={14} strokeWidth={2} className="hp-stat__icon" />
                    </div>
                    <strong className="hp-stat__value">
                      <CountUpValue value={result.paybackYears} format={formatYears} fromZero duration={1} />
                    </strong>
                    <span className="hp-stat__badge">{roiPercent}% ROI</span>
                  </article>
                  <article className="hp-stat hp-stat--green">
                    <div className="hp-stat__top">
                      <span className="hp-stat__label">{ui.systemType}</span>
                      <Sun size={14} strokeWidth={2} className="hp-stat__icon" />
                    </div>
                    <strong className="hp-stat__value">
                      {systemPanelItems.find((s) => s.value === inputs.systemType)?.label ?? ui.systemLabels.onGrid}
                    </strong>
                  </article>
                </div>

                {/* Mobile-only step 2 CTA to go to step 3 */}
                {isMobileSelect && (
                  <div className="hp-actions" style={{ marginTop: 12 }}>
                    <button type="button" className="hp-btn hp-btn--primary" onClick={() => setMobileStep(3)}>
                      {isTurkish ? "Teklif Al →" : "Get Quote →"}
                    </button>
                  </div>
                )}
              </div>

              {/* ── Desktop-only: CTA card (right column, below hero metric) ── */}
              {!isMobileSelect && (
                <div className="hp-section hp-section--cta-card">
                  <button
                    type="button"
                    className="hp-btn hp-btn--primary hp-btn--sheen hp-btn--lg"
                    onClick={openOfferModal}
                  >
                    <span className="hp-btn__label">{isTurkish ? "Teklif Al →" : "Get Quote →"}</span>
                  </button>
                  <p className="hp-cta-microcopy">
                    {isTurkish ? "Ücretsiz · 24 saat içinde dönüş · Kayıt gerektirmez" : "Free · 24-hour response · No sign-up"}
                  </p>
                </div>
              )}
            </>
          ) : null}

          {/* ── STEP 3: Quote Form (mobile only) ── */}
          {isMobileSelect && mobileStep === 3 && (
            <div className="mobile-stepper-enter mobile-stepper-enter-active">
              <button type="button" className="hp-m-back" onClick={() => goStep(2)}>
                ← {isTurkish ? "Geri" : "Back"}
              </button>

              <div className="hp-section">
                <p className="hp-section__label">{isTurkish ? "Analiz Özeti" : "Analysis Summary"}</p>
                <div className="hp-stats-grid hp-stats-grid--compact">
                  <article className="hp-stat hp-stat--orange"><div className="hp-stat__top"><span className="hp-stat__label">{ui.systemSize}</span></div><strong className="hp-stat__value"><CountUpValue value={result.systemSizeKwp} format={formatKw} /></strong></article>
                  <article className="hp-stat hp-stat--orange hp-stat--savings"><div className="hp-stat__top"><span className="hp-stat__label">{ui.annualSavings}</span></div><strong className="hp-stat__value"><CountUpValue value={result.annualSavingsTry} format={formatMoney} /></strong></article>
                  <article className="hp-stat hp-stat--teal"><div className="hp-stat__top"><span className="hp-stat__label">{ui.payback}</span></div><strong className="hp-stat__value"><CountUpValue value={result.paybackYears} format={formatYears} /></strong></article>
                  <article className="hp-stat hp-stat--blue"><div className="hp-stat__top"><span className="hp-stat__label">{ui.annualProduction}</span></div><strong className="hp-stat__value"><CountUpValue value={result.annualProductionKwh} format={formatKwhInt} /></strong></article>
                  <article className="hp-stat hp-stat--green"><div className="hp-stat__top"><span className="hp-stat__label">{ui.co2Reduction}</span></div><strong className="hp-stat__value"><CountUpValue value={result.co2ReductionKg} format={formatCo2} /></strong></article>
                  <article className="hp-stat hp-stat--purple"><div className="hp-stat__top"><span className="hp-stat__label">{ui.panelCount}</span></div><strong className="hp-stat__value"><CountUpValue value={result.panelCount} format={(v) => integerFormatter.format(v)} /></strong></article>
                </div>
              </div>

              <div className="hp-section">
                <p className="hp-section__label">{isTurkish ? "Teklif Formu" : "Quote Form"}</p>
                <p className="hp-m-form-hint">{isTurkish ? "Detaylı teklif için bilgilerinizi doldurun." : "Fill in your details for a detailed quote."}</p>
                <div className="hp-fields" style={{ marginTop: 10 }}>
                  <label className="hp-field">
                    <span>{isTurkish ? "Ad Soyad" : "Full Name"}</span>
                    <input type="text" value={calcFormName} onChange={(e) => setCalcFormName(e.target.value)} placeholder={isTurkish ? "Adınız" : "Your name"} />
                  </label>
                  <label className="hp-field">
                    <span>{isTurkish ? "Telefon" : "Phone"} *</span>
                    <input type="tel" value={calcFormPhone} onChange={(e) => setCalcFormPhone(e.target.value)} placeholder="05XX XXX XX XX" required />
                  </label>
                  <label className="hp-field">
                    <span>{isTurkish ? "E-posta" : "Email"}</span>
                    <input type="email" value={calcFormEmail} onChange={(e) => setCalcFormEmail(e.target.value)} placeholder="ornek@email.com" />
                  </label>
                  <label className="hp-field hp-field--checkbox">
                    <input type="checkbox" checked={calcFormKvkk} onChange={(e) => setCalcFormKvkk(e.target.checked)} />
                    <span style={{ fontSize: "var(--text-xs)" }}>{isTurkish ? "KVKK aydınlatma metnini okudum, kabul ediyorum." : "I accept the privacy policy."}</span>
                  </label>
                </div>
                <button
                  type="button"
                  className="hp-btn hp-btn--primary"
                  style={{ marginTop: 12, width: "100%" }}
                  disabled={!calcFormPhone.trim() || !calcFormKvkk || calcFormSending}
                  onClick={() => { handleCalcFormSubmit(); goStep(4); }}
                >
                  {calcFormSending ? (isTurkish ? "Gönderiliyor..." : "Sending...") : (isTurkish ? "Teklif Al →" : "Get Quote →")}
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 4: Success (mobile only) ── */}
          {isMobileSelect && mobileStep === 4 && (
            <div className="mobile-stepper-enter mobile-stepper-enter-active">
              <div className="hp-section" style={{ textAlign: "center", paddingTop: 40 }}>
                <div style={{ fontSize: "var(--text-5xl)", marginBottom: 16 }}>✓</div>
                <p className="hp-section__label" style={{ fontSize: "var(--text-lg)", color: "var(--accent)" }}>
                  {isTurkish ? "Talebiniz Alındı!" : "Request Received!"}
                </p>
                <p className="hp-m-form-hint" style={{ marginTop: 8 }}>
                  {isTurkish
                    ? "En kısa sürede sizinle iletişime geçeceğiz."
                    : "We will contact you as soon as possible."}
                </p>
                <button
                  type="button"
                  className="hp-btn hp-btn--ghost"
                  style={{ marginTop: 24 }}
                  onClick={() => {
                    setCalcFormName("");
                    setCalcFormPhone("");
                    setCalcFormEmail("");
                    setCalcFormKvkk(false);
                    goStep(1);
                  }}
                >
                  {isTurkish ? "← Yeni Hesaplama" : "← New Calculation"}
                </button>
              </div>
            </div>
          )}

        </div>
      </aside>

      {/* ═══════════════════════════════════════════════════════════
          DESKTOP-ONLY: Bottom full-width stats strip (8 cards)
          ALWAYS VISIBLE on desktop — values animate live as the user
          changes inputs (system type, consumption, location, tilt, …).
          ═══════════════════════════════════════════════════════════ */}
      {!isMobileSelect && (
        <section className="hp-stats-strip" aria-label={ui.metricsAria}>
          <article className="hp-stats-strip__card hp-stats-strip__card--blue">
            <div className="hp-stats-strip__top">
              <BarChart3 size={18} strokeWidth={1.8} className="hp-stats-strip__icon" />
              <span className="hp-stats-strip__label">{ui.specificYield}</span>
            </div>
            <strong className="hp-stats-strip__value">
              <CountUpValue value={result.specificYieldKwhPerKwp} format={(v) => integerFormatter.format(v)} fromZero duration={1} />
              <small className="hp-stats-strip__unit"> kWh/kWp</small>
            </strong>
            <span className="hp-stats-strip__sub">{isTurkish ? "yıllık özgül verim" : "annual specific yield"}</span>
          </article>

          <article className="hp-stats-strip__card hp-stats-strip__card--purple">
            <div className="hp-stats-strip__top">
              <Grid3x3 size={18} strokeWidth={1.8} className="hp-stats-strip__icon" />
              <span className="hp-stats-strip__label">{ui.panelCount}</span>
            </div>
            <strong className="hp-stats-strip__value">
              <CountUpValue value={result.panelCount} format={(v) => integerFormatter.format(v)} fromZero duration={1} />
              <small className="hp-stats-strip__unit"> {ui.moduleLabel}</small>
            </strong>
            <span className="hp-stats-strip__sub">{isTurkish ? "550W modül sayısı" : "550W module count"}</span>
          </article>

          <article className="hp-stats-strip__card hp-stats-strip__card--blue">
            <div className="hp-stats-strip__top">
              <Gauge size={18} strokeWidth={1.8} className="hp-stats-strip__icon" />
              <span className="hp-stats-strip__label">{ui.systemSize}</span>
            </div>
            <strong className="hp-stats-strip__value">
              <CountUpValue value={result.systemSizeKwp} format={formatKw} fromZero duration={1} />
            </strong>
            <span className="hp-stats-strip__sub">{isTurkish ? "toplam kurulu güç" : "total installed power"}</span>
          </article>

          <article className="hp-stats-strip__card hp-stats-strip__card--green">
            <div className="hp-stats-strip__top">
              <Leaf size={18} strokeWidth={1.8} className="hp-stats-strip__icon" />
              <span className="hp-stats-strip__label">{ui.co2Reduction}</span>
            </div>
            <strong className="hp-stats-strip__value">
              <CountUpValue value={result.co2ReductionKg} format={formatCo2} fromZero duration={1} />
            </strong>
            <span className="hp-stats-strip__sub">{isTurkish ? "yıllık salım azaltımı" : "annual emission reduction"}</span>
          </article>

          <article className="hp-stats-strip__card hp-stats-strip__card--orange">
            <div className="hp-stats-strip__top">
              <Activity size={18} strokeWidth={1.8} className="hp-stats-strip__icon" />
              <span className="hp-stats-strip__label">{ui.annualProduction}</span>
            </div>
            <strong className="hp-stats-strip__value">
              <CountUpValue value={result.annualProductionKwh} format={formatKwhInt} fromZero duration={1} />
            </strong>
            <span className="hp-stats-strip__sub">{isTurkish ? "yıllık temiz enerji" : "annual clean energy"}</span>
          </article>

          <article className="hp-stats-strip__card hp-stats-strip__card--orange hp-stats-strip__card--accent">
            <div className="hp-stats-strip__top">
              <Wallet size={18} strokeWidth={1.8} className="hp-stats-strip__icon" />
              <span className="hp-stats-strip__label">{ui.annualSavings}</span>
            </div>
            <strong className="hp-stats-strip__value">
              <CountUpValue value={result.annualSavingsTry} format={formatMoney} fromZero duration={1} />
            </strong>
            <span className="hp-stats-strip__sub">{isTurkish ? "faturadan doğrudan düşüm" : "direct bill offset"}</span>
          </article>

          <article className="hp-stats-strip__card hp-stats-strip__card--teal">
            <div className="hp-stats-strip__top">
              <Clock3 size={18} strokeWidth={1.8} className="hp-stats-strip__icon" />
              <span className="hp-stats-strip__label">{ui.payback}</span>
            </div>
            <strong className="hp-stats-strip__value">
              <CountUpValue value={result.paybackYears} format={formatYears} fromZero duration={1} />
            </strong>
            <span className="hp-stats-strip__sub">{roiPercent}% ROI · {isTurkish ? "yatırım geri dönüşü" : "return on investment"}</span>
          </article>

          <article className="hp-stats-strip__card hp-stats-strip__card--green">
            <div className="hp-stats-strip__top">
              <Sun size={18} strokeWidth={1.8} className="hp-stats-strip__icon" />
              <span className="hp-stats-strip__label">{ui.systemType}</span>
            </div>
            <strong className="hp-stats-strip__value">
              {systemPanelItems.find((s) => s.value === inputs.systemType)?.label ?? ui.systemLabels.onGrid}
            </strong>
            <span className="hp-stats-strip__sub">{isTurkish ? "önerilen sistem tipi" : "recommended system type"}</span>
          </article>
        </section>
      )}

      {/* Mobile calc stepper — full-screen 4-step flow with video bg */}
      <AnimatePresence>
        {isMobileViewport && calcModalOpen && (
          <motion.div
            className="mobile-calc"
            aria-label={ui.systemPanelAria}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
          >
            {/* Full-screen premium background */}
            <div className="mobile-calc__video-bg" aria-hidden="true">
              <span className="mobile-calc__bg-orb mobile-calc__bg-orb--primary" />
              <span className="mobile-calc__bg-orb mobile-calc__bg-orb--secondary" />
              <div className="mobile-calc__video-overlay" />
            </div>

            {/* Glass nav bar */}
            <nav className="mobile-calc__nav">
              <div className="mobile-calc__nav-logo" aria-label="Turuncu Solar">
                <Image
                  src="/logo.svg"
                  alt="Turuncu Solar"
                  width={28}
                  height={28}
                  className="mobile-calc__nav-mark"
                />
              </div>
              <button
                type="button"
                className="mobile-calc__nav-close"
                onPointerDown={handleCloseCalcModal}
                onClick={handleCloseCalcModal}
                aria-label={isTurkish ? "Kapat" : "Close"}
              >
                ×
              </button>
            </nav>

            {/* Progress bar with labels */}
            <div className="mobile-calc__progress">
              {([
                { step: 1 as const, label: isTurkish ? "Sistem" : "System" },
                { step: 2 as const, label: isTurkish ? "Sonuç" : "Result" },
                { step: 3 as const, label: isTurkish ? "Teklif" : "Quote" },
              ]).map(({ step, label }) => (
                <div key={step} className={`mobile-calc__progress-item${step <= mobileStep ? " is-active" : ""}${step === mobileStep ? " is-current" : ""}`}>
                  <div className="mobile-calc__progress-bar" />
                  <span className="mobile-calc__progress-label">{label}</span>
                </div>
              ))}
            </div>

            {/* Scrollable step content */}
            <div className="mobile-calc__body">
              <AnimatePresence mode="wait" custom={slideDir}>
                {/* ── Step 1: Sistem Seçimi ── */}
                {mobileStep === 1 && (
                  <motion.div
                    key="step1"
                    className="mobile-calc__step"
                    initial={{ x: slideDir === "fwd" ? "60%" : "-60%", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: slideDir === "fwd" ? "-30%" : "30%", opacity: 0 }}
                    transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <h2 className="mobile-calc__title">{isTurkish ? "Sistem Tipini Seçin" : "Select System Type"}</h2>

                    {/* System type selection */}
                    <div className="mobile-calc__system-chips">
                      {systemPanelItems.map((item) => {
                        const isActive = item.value === inputs.systemType;
                        return (
                          <button
                            key={item.value}
                            type="button"
                            className={`pill-btn pill-btn--outline pill-btn--sm mobile-calc__chip${isActive ? " is-active" : ""}`}
                            onClick={() => setInput("systemType", item.value)}
                          >
                            <item.icon size={16} strokeWidth={1.8} />
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Consumption — manual inputs: yearly + monthly (both kWh, linked) */}
                    <div className="mobile-calc__ios-group">
                      <label className="mobile-calc__ios-row">
                        <span className="mobile-calc__ios-icon"><BarChart3 size={14} /></span>
                        <span className="mobile-calc__ios-label">{isTurkish ? "Yıllık (kWh)" : "Annual (kWh)"}</span>
                        <input
                          className="mobile-calc__ios-input"
                          type="number"
                          inputMode="numeric"
                          min={sliderLimits.annualConsumptionMin}
                          max={sliderLimits.annualConsumptionMax}
                          step={100}
                          value={inputs.annualConsumptionKwh}
                          onChange={(e) => setInput("annualConsumptionKwh", Number(e.target.value))}
                          disabled={inputs.useMonthlyBill}
                        />
                      </label>
                      <label className="mobile-calc__ios-row mobile-calc__ios-row--last">
                        <span className="mobile-calc__ios-icon"><Activity size={14} /></span>
                        <span className="mobile-calc__ios-label">{isTurkish ? "Aylık (kWh)" : "Monthly (kWh)"}</span>
                        <input
                          className="mobile-calc__ios-input"
                          type="number"
                          inputMode="numeric"
                          min={Math.ceil(sliderLimits.annualConsumptionMin / 12)}
                          max={Math.ceil(sliderLimits.annualConsumptionMax / 12)}
                          step={10}
                          value={Math.round(inputs.annualConsumptionKwh / 12)}
                          onChange={(e) => setInput("annualConsumptionKwh", Number(e.target.value) * 12)}
                          disabled={inputs.useMonthlyBill}
                        />
                      </label>
                    </div>

                    {/* iOS-style input group */}
                    <div className="mobile-calc__ios-group">
                      <div className="mobile-calc__ios-row">
                        <span className="mobile-calc__ios-icon"><MapPin size={14} /></span>
                        <span className="mobile-calc__ios-label">{ui.province}</span>
                        <div className="mobile-calc__ios-value">
                          <MobileSelect options={PROVINCE_OPTIONS} value={inputs.province} onChange={(v) => setProvince(v)} />
                        </div>
                      </div>
                      <div className="mobile-calc__ios-row">
                        <span className="mobile-calc__ios-icon"><LocateFixed size={14} /></span>
                        <span className="mobile-calc__ios-label">{ui.district}</span>
                        <div className="mobile-calc__ios-value">
                          <MobileSelect options={provinceDistrictOptions} value={inputs.district} onChange={(v) => setInput("district", v)} />
                        </div>
                      </div>
                      <div className="mobile-calc__ios-row">
                        <span className="mobile-calc__ios-icon"><Sun size={14} /></span>
                        <span id={mobileRoofTypeLabelId} className="mobile-calc__ios-label">{ui.roofType}</span>
                        <div className="mobile-calc__ios-value">
                          <div className="mobile-calc__roof-type-radios" role="radiogroup" aria-labelledby={mobileRoofTypeLabelId}>
                            {roofTypeItems.map((item) => (
                              <label key={item.value} className="mobile-calc__roof-type-option">
                                <input
                                  type="radio"
                                  name="mobile-roof-type"
                                  value={item.value}
                                  checked={inputs.roofType === item.value}
                                  onChange={() => setInput("roofType", item.value)}
                                />
                                <span>{item.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                      <label className="mobile-calc__ios-row">
                        <span className="mobile-calc__ios-icon"><BarChart3 size={14} /></span>
                        <span className="mobile-calc__ios-label">{ui.roofArea}</span>
                        <input className="mobile-calc__ios-input" type="number" min={sliderLimits.roofAreaMin} max={sliderLimits.roofAreaMax} value={inputs.roofAreaM2} onChange={(e) => setInput("roofAreaM2", Number(e.target.value))} />
                      </label>
                      <div className="mobile-calc__ios-row mobile-calc__ios-row--last">
                        <span className="mobile-calc__ios-icon"><Compass size={14} /></span>
                        <span className="mobile-calc__ios-label">{ui.orientation}</span>
                        <div className="mobile-calc__ios-value">
                          <MobileSelect
                            options={roofOrientationItems.map((o) => o.label)}
                            value={roofOrientationItems.find((o) => o.value === inputs.roofOrientation)?.label ?? roofOrientationItems[0].label}
                            onChange={(label) => { const next = roofOrientationItems.find((o) => o.label === label); if (next) setInput("roofOrientation", next.value); }}
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="mobile-calc__cta"
                      onClick={() => { startAnalysis(); setIsCalculating(true); setTimeout(() => { setIsCalculating(false); goStep(2); }, 1200); }}
                      disabled={isCalculating}
                    >
                      {isCalculating
                        ? (isTurkish ? "Hesaplanıyor..." : "Calculating...")
                        : (isTurkish ? "Analizi Başlat" : "Start Analysis")}
                    </button>
                  </motion.div>
                )}

                {/* ── Step 2: Sonuçlar ── */}
                {mobileStep === 2 && (
                  <motion.div
                    key="step2"
                    className="mobile-calc__step"
                    initial={{ x: slideDir === "fwd" ? "60%" : "-60%", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: slideDir === "fwd" ? "-30%" : "30%", opacity: 0 }}
                    transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
                  >
                    {/* Big savings hero card */}
                    <div className="mobile-calc__hero-card">
                      <Wallet size={28} strokeWidth={1.5} />
                      <span className="mobile-calc__hero-label">{ui.annualSavings}</span>
                      <strong className="mobile-calc__hero-value">
                        <CountUpValue value={result.annualSavingsTry} format={formatMoney} fromZero duration={1} />
                      </strong>
                      <span className="mobile-calc__hero-badge">{roiPercent}% ROI</span>
                    </div>

                    {/* Stat list */}
                    <div className="mobile-calc__stat-list">
                      <div className="mobile-calc__stat-row">
                        <Clock3 size={16} className="mobile-calc__stat-icon" />
                        <span>{ui.payback}</span>
                        <strong><CountUpValue value={result.paybackYears} format={formatYears} fromZero duration={0.8} /></strong>
                      </div>
                      <div className="mobile-calc__stat-row">
                        <Gauge size={16} className="mobile-calc__stat-icon" />
                        <span>{ui.systemSize}</span>
                        <strong><CountUpValue value={result.systemSizeKwp} format={formatKw} fromZero duration={0.8} /></strong>
                      </div>
                      <div className="mobile-calc__stat-row">
                        <Activity size={16} className="mobile-calc__stat-icon" />
                        <span>{ui.annualProduction}</span>
                        <strong><CountUpValue value={result.annualProductionKwh} format={formatKwhInt} fromZero duration={0.8} /></strong>
                      </div>
                      <div className="mobile-calc__stat-row">
                        <Leaf size={16} className="mobile-calc__stat-icon" />
                        <span>{ui.co2Reduction}</span>
                        <strong><CountUpValue value={result.co2ReductionKg} format={formatCo2} fromZero duration={0.8} /></strong>
                      </div>
                      <div className="mobile-calc__stat-row">
                        <Grid3x3 size={16} className="mobile-calc__stat-icon" />
                        <span>{ui.panelCount}</span>
                        <strong><CountUpValue value={result.panelCount} format={(v) => `${integerFormatter.format(v)} ${ui.moduleLabel}`} fromZero duration={0.8} /></strong>
                      </div>
                    </div>

                    <button type="button" className="mobile-calc__cta mobile-calc__cta--gradient" onClick={() => goStep(3)}>
                      {isTurkish ? "Teklif Al" : "Get Quote"} <ChevronRight size={18} />
                    </button>
                    <button type="button" className="mobile-calc__back" onClick={() => goStep(1)}>
                      {isTurkish ? "← Yeniden Hesapla" : "← Recalculate"}
                    </button>
                  </motion.div>
                )}

                {/* ── Step 3: Teklif Formu ── */}
                {mobileStep === 3 && (
                  <motion.div
                    key="step3"
                    className="mobile-calc__step"
                    initial={{ x: slideDir === "fwd" ? "60%" : "-60%", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: slideDir === "fwd" ? "-30%" : "30%", opacity: 0 }}
                    transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
                  >
                    {/* Compact summary card */}
                    <div className="mobile-calc__summary-card">
                      <div className="mobile-calc__summary-row">
                        <span>{ui.systemSize}</span>
                        <strong><CountUpValue value={result.systemSizeKwp} format={formatKw} /></strong>
                      </div>
                      <div className="mobile-calc__summary-row">
                        <span>{ui.annualSavings}</span>
                        <strong><CountUpValue value={result.annualSavingsTry} format={formatMoney} /></strong>
                      </div>
                      <div className="mobile-calc__summary-row">
                        <span>{ui.payback}</span>
                        <strong><CountUpValue value={result.paybackYears} format={formatYears} /></strong>
                      </div>
                    </div>

                    <h2 className="mobile-calc__title">{isTurkish ? "Teklif Bilgileri" : "Quote Details"}</h2>
                    <p className="mobile-calc__hint">{isTurkish ? "Detaylı teklif için bilgilerinizi doldurun." : "Fill in your details for a detailed quote."}</p>

                    {/* Form in iOS group style */}
                    <div className="mobile-calc__ios-group">
                      <label className="mobile-calc__ios-row">
                        <span className="mobile-calc__ios-label">{isTurkish ? "Ad Soyad" : "Full Name"}</span>
                        <input className="mobile-calc__ios-input" type="text" value={calcFormName} onChange={(e) => setCalcFormName(e.target.value)} placeholder={isTurkish ? "Adınız" : "Your name"} />
                      </label>
                      <label className="mobile-calc__ios-row">
                        <span className="mobile-calc__ios-label">{isTurkish ? "Telefon" : "Phone"} *</span>
                        <input className="mobile-calc__ios-input" type="tel" value={calcFormPhone} onChange={(e) => setCalcFormPhone(e.target.value)} placeholder="05XX XXX XX XX" required />
                      </label>
                      <label className="mobile-calc__ios-row mobile-calc__ios-row--last">
                        <span className="mobile-calc__ios-label">{isTurkish ? "E-posta" : "Email"}</span>
                        <input className="mobile-calc__ios-input" type="email" value={calcFormEmail} onChange={(e) => setCalcFormEmail(e.target.value)} placeholder="ornek@email.com" />
                      </label>
                    </div>

                    <label className="mobile-calc__kvkk">
                      <input type="checkbox" checked={calcFormKvkk} onChange={(e) => setCalcFormKvkk(e.target.checked)} />
                      <span>{isTurkish ? "KVKK aydınlatma metnini okudum, kabul ediyorum." : "I accept the privacy policy."}</span>
                    </label>

                    <button
                      type="button"
                      className="mobile-calc__cta mobile-calc__cta--gradient"
                      disabled={!calcFormPhone.trim() || !calcFormKvkk || calcFormSending}
                      onClick={() => { handleCalcFormSubmit(); goStep(4); }}
                    >
                      {calcFormSending ? (isTurkish ? "Gönderiliyor..." : "Sending...") : (isTurkish ? "Gönder" : "Submit")} <ChevronRight size={18} />
                    </button>
                    <button type="button" className="mobile-calc__back" onClick={() => goStep(2)}>
                      {isTurkish ? "← Geri" : "← Back"}
                    </button>
                  </motion.div>
                )}

                {/* ── Step 4: Başarı ── */}
                {mobileStep === 4 && (
                  <motion.div
                    key="step4"
                    className="mobile-calc__step mobile-calc__step--center"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <motion.div
                      className="mobile-calc__success-icon"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.15 }}
                    >
                      <Check size={48} strokeWidth={2.5} />
                    </motion.div>
                    <h2 className="mobile-calc__success-title">
                      {isTurkish ? "Talebiniz Alındı!" : "Request Received!"}
                    </h2>
                    <p className="mobile-calc__hint">
                      {isTurkish
                        ? "En kısa sürede sizinle iletişime geçeceğiz."
                        : "We will contact you as soon as possible."}
                    </p>
                    <button
                      type="button"
                      className="mobile-calc__back"
                      style={{ marginTop: 24 }}
                      onClick={() => {
                        setCalcFormName("");
                        setCalcFormPhone("");
                        setCalcFormEmail("");
                        setCalcFormKvkk(false);
                        goStep(1);
                      }}
                    >
                      {isTurkish ? "← Yeni Hesaplama" : "← New Calculation"}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOfferModalOpen ? (
          <OfferModal
            onClose={() => setOfferModalOpen(false)}
            inputs={inputs}
            result={result}
            analysisStarted={analysisStarted}
            consentLabel={cmsCopy.consentLabel}
          />
        ) : null}
      </AnimatePresence>

      {/* ── Mobile Hero Card (visible only <768px via CSS, hidden when calc is open) ── */}
      {!calcModalOpen && <div className="mobile-hero-card">
        <div className="mobile-hero-card__badge">
          <span className="mobile-hero-card__badge-dot" />
          AI Destekli · Ücretsiz Analiz
        </div>
        <h2 className="mobile-hero-card__title">
          Güneş enerjisiyle <span>tasarruf et</span>
        </h2>
        <p className="mobile-hero-card__subtitle">
          Konumunuza özel solar analizi. 30 saniyede hesaplayın.
        </p>
      </div>}

    </div>
  );
}
