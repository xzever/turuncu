"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname, useSearchParams } from "next/navigation";
import { type CSSProperties, type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { buildLocaleAwareHref, resolveLocaleFromPathname, stripLocalePrefix } from "@/lib/localePath";
import OrbitalNav from "@/components/systems/OrbitalNav";
import SystemSimulation from "@/components/systems/SystemSimulation";
import HolographicHUD from "@/components/systems/HolographicHUD";
import { WORLDMAP_LAND_DOTS, WORLDMAP_TURKEY_DOTS, WORLDMAP_TURKEY_CENTER } from "@/lib/worldmap-dots";
import "../page.css";
import "./sistemlerimiz.css";
// Faz 10 cleanup: SistemlerimizMobile + local HakkimizdaMobile stub kaldırıldı.
// Router (src/components/sistemlerimiz/SistemlerimizRouter.tsx) üzerinden mobil
// shell seçimi yapılıyor; bu dosya sadece desktop render'ı üstlenir.
import { SYSTEM_CONTENT, type DioramaSectionId, type SystemContent } from "./sistemlerimiz-data";

type SystemSectionId = DioramaSectionId;
type ScrollSectionId = "diorama";

type CorporateProfile = {
  title: string;
  summary: string;
  lead: string;
  missionTitle: string;
  missionText: string;
  visionTitle: string;
  visionText: string;
  videoLabel: string;
  videoSource: string;
  videoPoster?: string;
};

const SECTION_ORDER: ReadonlyArray<SystemSectionId> = [
  "grid",
  "hybrid-no-battery",
  "off-grid",
];

const NAV_LABELS: Record<SystemSectionId, string> = {
  grid: "Grid Sistem",
  "hybrid-no-battery": "Hibrit",
  "hybrid-with-battery": "Hibrit + Batarya",
  "off-grid": "Off-Grid",
};

const CORPORATE_SECTION_ORDER: ReadonlyArray<SystemSectionId> = [
  "grid",
  "hybrid-no-battery",
  "hybrid-with-battery",
];

const CORPORATE_NAV_LABELS: Record<SystemSectionId, string> = {
  ...NAV_LABELS,
  grid: "Biz Kimiz",
  "hybrid-no-battery": "Hikayemiz",
  "hybrid-with-battery": "Sürdürülebilirlik",
  "off-grid": "Yönetim Kurulu",
};

const CORPORATE_PROFILES: Record<DioramaSectionId, CorporateProfile> = {
  grid: {
    title: "Biz Kimiz",
    summary:
      "Turuncu Solar olarak konut ve ticari projelerde uçtan uca mühendislik yaklaşımıyla çalışan, ölçülebilir sonuç üreten bir yenilenebilir enerji ekibiyiz.",
    lead:
      "Fizibiliteden kurulum ve devreye almaya, performans takibinden optimizasyona kadar tüm süreci tek operasyon çizgisinde yönetiyoruz.",
    missionTitle: "Misyon",
    missionText: "Temiz enerjiyi erişilebilir, güvenilir ve sürdürülebilir proje modeliyle yaygınlaştırmak.",
    visionTitle: "Vizyon",
    visionText: "Türkiye’de yüksek verimli güneş enerji dönüşümünde referans gösterilen mühendislik markası olmak.",
    videoLabel: "Kurumsal Video",
    videoSource: "/hakkimizda.mp4",
    videoPoster: "/hakkimizda1.jpg",
  },
  "hybrid-no-battery": {
    title: "Hikayemiz",
    summary:
      "Yolculuğumuz, sahada güvenilir kurulum standartları oluşturarak başladı ve zamanla çok lokasyonlu, veri odaklı proje yönetimine dönüştü.",
    lead:
      "Her projeden öğrendiğimizi süreçlerimize taşıyarak teknik kaliteyi, teslim hızını ve müşteri memnuniyetini birlikte büyüttük.",
    missionTitle: "Başlangıç",
    missionText: "Doğru keşif ve doğru kurulumla riskleri minimize eden sağlam bir temel kurmak.",
    visionTitle: "Bugün",
    visionText: "Operasyon ve performans izlemeyi kurulum kadar kritik gören bütüncül bir enerji partneri olmak.",
    videoLabel: "Süreç",
    videoSource: "/hakkimizda.mp4",
    videoPoster: "/hakkimizda1.jpg",
  },
  "hybrid-with-battery": {
    title: "Sürdürülebilirlik",
    summary:
      "Sürdürülebilirliği yalnızca enerji üretimi olarak değil; tasarım, malzeme seçimi ve uzun dönem işletme performansı ile birlikte ele alıyoruz.",
    lead:
      "Her projede çevresel etki, finansal fayda ve operasyonel süreklilik dengesini aynı karar çerçevesinde değerlendiriyoruz.",
    missionTitle: "Çevresel Etki",
    missionText: "Karbon emisyonunu azaltan, verimi sürekli izlenen ve kaynak tüketimini optimize eden sistemler üretmek.",
    visionTitle: "Uzun Ömür",
    visionText: "Yüksek performansı yıllara yayılan, bakım disiplini güçlü ve sürdürülebilir enerji altyapıları kurmak.",
    videoLabel: "Sürdürülebilirlik",
    videoSource: "/sürdürülebilirlik.mp4",
    videoPoster: "/hakkimizda1.jpg",
  },
  "off-grid": {
    title: "Yönetim Kurulu",
    summary:
      "Yönetim yaklaşımımız teknik doğruluk, şeffaf iletişim ve uzun vadeli değer üretimi üzerine kuruludur.",
    lead:
      "Stratejik kararlarımızda güvenlik, performans ve sürdürülebilir büyüme aynı anda değerlendirilir; ekip kültürümüzde sorumluluk ve sürekli gelişim esastır.",
    missionTitle: "Yönetim İlkesi",
    missionText: "Müşteriye güven veren, sahada karşılığı olan ve ölçülebilir sonuç üreten kararlar almak.",
    visionTitle: "Kurumsal Hedef",
    visionText: "Türkiye’nin enerji dönüşümünde teknolojik ve operasyonel olarak örnek gösterilen kurum kültürü oluşturmak.",
    videoLabel: "Kurumsal Mesaj",
    videoSource: "/hakkimizda.mp4",
    videoPoster: "/hakkimizda1.jpg",
  },
};

const COMPANY_TIMELINE: ReadonlyArray<{
  year: string;
  title: string;
  description: string;
}> = [
  { year: "2019", title: "Kuruluş", description: "Turuncu Solar, güneş enerjisi sektöründe mühendislik odaklı çözüm üretmek amacıyla kuruldu." },
  { year: "2020", title: "İlk Projeler", description: "İlk konut ve ticari güneş enerjisi sistemleri başarıyla devreye alındı." },
  { year: "2021", title: "Büyüme", description: "Proje kapasitesi artırıldı, çok lokasyonlu operasyon modeline geçildi." },
  { year: "2022", title: "Genişleme", description: "Antalya ve Ankara'da yeni şubeler açılarak hizmet ağı genişletildi." },
  { year: "2023", title: "5 MW Kurulu Güç", description: "Toplam kurulu güç 5 MW'ı aştı, veri odaklı performans izleme sistemi devreye alındı." },
  { year: "2024", title: "Dijital Dönüşüm", description: "Müşteri portalı ve anlık izleme sistemiyle dijital altyapı güçlendirildi." },
  { year: "2025", title: "Sürdürülebilir Gelecek", description: "Enerji depolama ve hibrit sistem çözümleriyle yeni nesil projelere adım atıldı." },
  { year: "2026", title: "Vizyon 2026", description: "Türkiye'nin referans enerji markası olma hedefiyle stratejik büyüme planı hayata geçirildi." },
];

const SUSTAINABILITY_PILLARS: ReadonlyArray<{ id: string; title: string; icon: ReactNode }> = [
  {
    id: "clean-energy",
    title: "Erişilebilir ve Temiz Enerji",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path d="M12 3v6M8.6 5.2 11 7.6M15.4 5.2 13 7.6" />
        <path d="M8.2 13.6 12 9.8l3.8 3.8" />
        <path d="M6.8 13.6h10.4M8.6 20.2h6.8" />
      </svg>
    ),
  },
  {
    id: "cities",
    title: "Sürdürülebilir �?ehirler ve Topluluklar",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path d="M3 20h18M6 20V8h5v12M13 20V4h5v16" />
        <path d="M8.2 11h1.6M8.2 14h1.6M15.2 7h1.6M15.2 10h1.6M15.2 13h1.6" />
      </svg>
    ),
  },
  {
    id: "responsible-production",
    title: "Sorumlu Üretim ve Tüketim",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path d="M8.2 6.2A6.2 6.2 0 0 1 17.6 9l1.6-.8-.2 4.2-4-1.2 1.4-.7a4.2 4.2 0 0 0-6.6-2.3" />
        <path d="M15.8 17.8A6.2 6.2 0 0 1 6.4 15l-1.6.8.2-4.2 4 1.2-1.4.7a4.2 4.2 0 0 0 6.6 2.3" />
      </svg>
    ),
  },
  {
    id: "climate-action",
    title: "İklim Eylemi",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path d="M12 20c-3.6 0-6.5-2.8-6.5-6.2C5.5 9.8 8.8 7 12 4.5c3.2 2.5 6.5 5.3 6.5 9.3 0 3.4-2.9 6.2-6.5 6.2Z" />
        <path d="M9.2 13.2c.6-1.5 2-2.8 3.6-3.4" />
      </svg>
    ),
  },
];

const SUSTAINABILITY_COPY = {
  title: "Temiz Bir Gelecek için Gücümüz Enerji,\nHedefimiz Sürdürülebilirlik!",
  paragraphs: [
    "Sürdürülebilirlik; doğal kaynakların korunarak yenilenmesi ve gelecek nesillere aktarılması anlayışına dayanır. Günümüzde küresel ısınma, iklim değişikliği ve çevresel tahribatın en büyük nedenlerinden biri fosil yakıtların yoğun kullanımıdır. Oysa yenilenebilir enerji kaynakları, hem çevreye duyarlı hem de uzun vadede çok daha verimli bir enerji çözümü sunar.",
    "Turuncu Solaer olarak, tüm projelerimizde sürdürülebilirlik ilkesini temel alıyor; yenilenebilir enerji çözümleriyle daha temiz ve yaşanabilir bir gelecek için çalışıyoruz. Kullandığımız teknolojileri ve uygulama süreçlerimizi çevre dostu, verimli ve yenilikçi yaklaşımlar doğrultusunda geliştiriyoruz.",
    "Sürdürülebilirliği yalnızca bir iş modeli değil, gelecek nesillere daha yeşil bir dünya bırakma sorumluluğu olarak görüyoruz. Bu doğrultuda küresel sürdürülebilirlik hedeflerini yakından takip ediyor ve enerji gücümüzle daha sürdürülebilir yarınlar inşa etmeyi amaçlıyoruz.",
  ],
} as const;

const VALID_SECTION_IDS: ReadonlySet<DioramaSectionId> = new Set([
  "grid",
  "hybrid-no-battery",
  "hybrid-with-battery",
  "off-grid",
] as const);

export default function SistemlerimizPage() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeLocale = resolveLocaleFromPathname(pathname, "tr");
  const basePath = stripLocalePrefix(pathname ?? "/");
  const isCorporateRoute = basePath === "/hakkimizda" || basePath.startsWith("/hakkimizda/");
  const isBlogRoute = basePath === "/blog" || basePath.startsWith("/blog/");
  const isMinimalRoute = isCorporateRoute || isBlogRoute;
  /* ?section=<id> — /sistem-farklari sayfasından geldiğinde hangi sekmenin
     aktif olacağını belirler; yoksa "grid" varsayılan. */
  const initialSection: DioramaSectionId = (() => {
    const raw = searchParams?.get("section");
    return raw && VALID_SECTION_IDS.has(raw as DioramaSectionId)
      ? (raw as DioramaSectionId)
      : "grid";
  })();
  const [selectedDiorama, setSelectedDiorama] = useState<DioramaSectionId>(initialSection);
  const [, setActiveScrollSection] = useState<ScrollSectionId>("diorama");

  /* Query param değişirse sekmeyi senkronla (ör. sistem-farklari'dan navigate sonrası). */
  useEffect(() => {
    const raw = searchParams?.get("section");
    if (raw && VALID_SECTION_IDS.has(raw as DioramaSectionId)) {
      setSelectedDiorama(raw as DioramaSectionId);
    }
  }, [searchParams]);
  const shellRef = useRef<HTMLElement | null>(null);
  const displayedSystemContent = useMemo<ReadonlyArray<SystemContent>>(() => {
    if (!isCorporateRoute) {
      return SYSTEM_CONTENT;
    }

    return SYSTEM_CONTENT.map((content) =>
      content.id === "grid"
        ? {
            ...content,
            image: "/hakkimizda1.jpg",
            imageAlt: "Biz Kimiz kurumsal arka plan görseli",
          }
        : content,
    );
  }, [isCorporateRoute]);

  const activeLayout: SystemSectionId = selectedDiorama;
  const activeContent = useMemo(
    () => displayedSystemContent.find((content) => content.id === selectedDiorama) ?? displayedSystemContent[0],
    [displayedSystemContent, selectedDiorama],
  );
  const corporateProfile = useMemo(
    () => CORPORATE_PROFILES[selectedDiorama],
    [selectedDiorama],
  );
  const isSustainabilityCorporate = isCorporateRoute && selectedDiorama === "hybrid-with-battery";
  const isTimelineCorporate = isCorporateRoute && selectedDiorama === "hybrid-no-battery";
  const navSectionOrder: ReadonlyArray<SystemSectionId> = isCorporateRoute
    ? CORPORATE_SECTION_ORDER
    : isBlogRoute
      ? CORPORATE_SECTION_ORDER
      : SECTION_ORDER;
  const navLabels = isCorporateRoute ? CORPORATE_NAV_LABELS : NAV_LABELS;
  const navActiveSection: SystemSectionId = isMinimalRoute ? selectedDiorama : activeLayout;

  const handleNavSelect = (id: SystemSectionId) => {
    const shell = shellRef.current;
    if (!shell) {
      return;
    }
    setSelectedDiorama(id as DioramaSectionId);
    setActiveScrollSection("diorama");
    const diorama = document.getElementById("systems-diorama");
    shell.scrollTo({ top: diorama?.offsetTop ?? 0, behavior: "auto" });
  };

  useEffect(() => {
    if (isMinimalRoute) {
      return;
    }
    const shell = shellRef.current;
    if (!shell) {
      return;
    }
    const diorama = document.getElementById("systems-diorama");
    if (!diorama) {
      return;
    }
    const handleScroll = () => {
      setActiveScrollSection("diorama");
    };
    shell.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      shell.removeEventListener("scroll", handleScroll);
    };
  }, [isMinimalRoute]);

  // Faz 10 cleanup: mobile branches kaldırıldı — SistemlerimizRouter handle ediyor.

  return (
    <div className={`systems-page systems-page--${activeLayout}`} data-active-system={selectedDiorama}>
      {!isCorporateRoute && !isBlogRoute ? (
        <div className="sistemlerimiz-bgvideo" aria-hidden="true">
          <video
            key="sistemlerimiz-bg-video"
            className="sistemlerimiz-bgvideo__el"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="/sistemlerimiz.webp"
          >
            <source src="/sisi.mp4" type="video/mp4" />
          </video>
          <span className="sistemlerimiz-bgvideo__gradient" />
          <span className="sistemlerimiz-bgvideo__image" />
          <span className="sistemlerimiz-bgvideo__mask" />
        </div>
      ) : null}

      <main className="systems-shell" ref={shellRef}>
        <section
          id="systems-diorama"
          className={`systems-stage${isCorporateRoute ? " systems-stage--corporate" : ""}${isCorporateRoute && !isSustainabilityCorporate && !isTimelineCorporate && selectedDiorama !== "grid" ? " systems-stage--editorial" : ""}${isCorporateRoute && selectedDiorama === "grid" ? " systems-stage--bizkimiz" : ""}`}
          data-system-section="diorama"
        >
          {/* Full-bleed background: sistemlerimiz = /sisi.mp4 video + turuncu gradient
              + bizkimizbackround.jpg (0.6 opak) — page-root'ta render ediliyor.
              Corporate = tab'a göre image/video. */}
          {isCorporateRoute || isBlogRoute ? (
            displayedSystemContent.map((section) => (
              <div key={section.id} className={`systems-stage__bg ${selectedDiorama === section.id ? "is-active" : ""}`}>
                {isCorporateRoute ? (
                  selectedDiorama === "grid" ? (
                    <Image
                      src="/biz%20kimiz.jpg"
                      alt="Biz Kimiz arka plan"
                      fill
                      priority
                      className="systems-stage__bg-image"
                    />
                  ) : selectedDiorama === "hybrid-no-battery" ? (
                    <Image
                      src="/biz%20kimiz.jpg"
                      alt="Hikayemiz arka plan"
                      fill
                      priority
                      className="systems-stage__bg-image systems-stage__bg-image--flipped"
                    />
                  ) : selectedDiorama === "hybrid-with-battery" ? (
                    <Image
                      src={`/${encodeURIComponent("sürdürülebilirlik")}.jpg`}
                      alt="Sürdürülebilirlik arka plan"
                      fill
                      priority
                      className="systems-stage__bg-image"
                    />
                  ) : (
                    <video
                      className="systems-stage__bg-video"
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      aria-hidden="true"
                    >
                      <source src={corporateProfile.videoSource || "/hakkimizda.mp4"} type="video/mp4" />
                    </video>
                  )
                ) : (
                  <Image
                    src={section.image}
                    alt={section.imageAlt}
                    fill
                    priority={selectedDiorama === section.id}
                    className="systems-stage__bg-image"
                  />
                )}
                <div className="systems-stage__bg-mask" />
              </div>
            ))
          ) : null}

          {isCorporateRoute ? (
            isTimelineCorporate ? (
              /* ── TIMELINE: Hikayemiz — full-width horizontal timeline over video ── */
              <motion.div
                className="corporate-stage__content corporate-stage__content--timeline"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <header className="corp-tl__header">
                  <p className="corp-tl__eyebrow">Yolculuğumuz</p>
                  <h1 className="corp-tl__title">Hikayemiz</h1>
                  <p className="corp-tl__subtitle">{corporateProfile.summary}</p>
                </header>

                <div className="corp-tl">
                  {/* Row 1: Top cards (even indices: 0,2,4,6) */}
                  <div className="corp-tl__row corp-tl__row--top">
                    {COMPANY_TIMELINE.map((item, i) => (
                      <motion.div
                        key={item.year}
                        className={`corp-tl__cell${i % 2 === 0 ? " corp-tl__cell--filled" : ""}`}
                        initial={{ opacity: 0, y: -16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.15 + i * 0.06 }}
                      >
                        {i % 2 === 0 ? (
                          <div className="corp-tl__card">
                            <span className="corp-tl__year">{item.year}</span>
                            <h3 className="corp-tl__card-title">{item.title}</h3>
                            <p className="corp-tl__card-desc">{item.description}</p>
                          </div>
                        ) : null}
                      </motion.div>
                    ))}
                  </div>

                  {/* Row 2: Dots + horizontal line */}
                  <div className="corp-tl__track">
                    <span className="corp-tl__line" />
                    {COMPANY_TIMELINE.map((item) => (
                      <span key={item.year} className="corp-tl__dot" />
                    ))}
                  </div>

                  {/* Row 3: Bottom cards (odd indices: 1,3,5,7) */}
                  <div className="corp-tl__row corp-tl__row--bottom">
                    {COMPANY_TIMELINE.map((item, i) => (
                      <motion.div
                        key={item.year}
                        className={`corp-tl__cell${i % 2 !== 0 ? " corp-tl__cell--filled" : ""}`}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.15 + i * 0.06 }}
                      >
                        {i % 2 !== 0 ? (
                          <div className="corp-tl__card">
                            <span className="corp-tl__year">{item.year}</span>
                            <h3 className="corp-tl__card-title">{item.title}</h3>
                            <p className="corp-tl__card-desc">{item.description}</p>
                          </div>
                        ) : null}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : isSustainabilityCorporate ? (
              <motion.div
                className="corporate-stage__content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <article className="corporate-stage__intro corporate-stage__intro--sustainability">
                  <h1 className="corporate-stage__title corporate-stage__title--sustainability">
                    {SUSTAINABILITY_COPY.title}
                  </h1>
                  {SUSTAINABILITY_COPY.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="corporate-stage__sustainability-copy">
                      {paragraph}
                    </p>
                  ))}
                </article>

                <aside className="corporate-stage__pillars" aria-label="Sürdürülebilirlik alanları">
                  {SUSTAINABILITY_PILLARS.map((item) => (
                    <article key={item.id} className="corporate-stage__pillar-card">
                      <span className="corporate-stage__pillar-icon" aria-hidden="true">
                        {item.icon}
                      </span>
                      <h2>{item.title}</h2>
                    </article>
                  ))}
                </aside>
              </motion.div>
            ) : isCorporateRoute && selectedDiorama === "grid" ? (
              /* ── Biz Kimiz: world map (left) + vertical timeline cards (right) ── */
              <motion.div
                className="corporate-stage__content corporate-stage__content--bizkimiz"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
              >
                {/* LEFT: Dotted World Map */}
                <motion.div
                  className="corp-worldmap"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
                  aria-label="Turuncu Solar dünya haritası"
                >
                  <svg viewBox="0 0 1000 500" xmlns="http://www.w3.org/2000/svg" className="corp-worldmap__svg">
                    {WORLDMAP_LAND_DOTS.map(([cx, cy], i) => (
                      <circle key={`ld${i}`} cx={cx} cy={cy} r="1.8" fill="rgba(255,255,255,0.35)" />
                    ))}
                    {WORLDMAP_TURKEY_DOTS.map(([cx, cy], i) => (
                      <circle key={`tr${i}`} cx={cx} cy={cy} r="2.5" fill="#f97316" />
                    ))}
                    <circle cx={WORLDMAP_TURKEY_CENTER[0]} cy={WORLDMAP_TURKEY_CENTER[1]} r="12" fill="none" stroke="#f97316" strokeWidth="1.5" opacity="0.6" className="corp-worldmap__pulse" />
                    <circle cx={WORLDMAP_TURKEY_CENTER[0]} cy={WORLDMAP_TURKEY_CENTER[1]} r="22" fill="none" stroke="#f97316" strokeWidth="0.8" opacity="0.3" className="corp-worldmap__pulse corp-worldmap__pulse--delayed" />
                    <text x={WORLDMAP_TURKEY_CENTER[0]} y={WORLDMAP_TURKEY_CENTER[1] - 20} textAnchor="middle" fill="#f97316" fontSize="11" fontWeight="700" className="corp-worldmap__label">TÜRKİYE</text>
                  </svg>
                </motion.div>

                {/* RIGHT: Vertical timeline — Hakkımızda / Misyon / Vizyon */}
                <div className="corp-vtl">
                  <span className="corp-vtl__line" aria-hidden="true" />

                  <motion.div className="corp-vtl__item" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}>
                    <span className="corp-vtl__dot" />
                    <article className="corp-vtl__card">
                      <div className="corp-vtl__card-header">
                        <span className="corp-vtl__card-icon" aria-hidden="true">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 4-7 8-7s8 3 8 7" /></svg>
                        </span>
                        <h2 className="corp-vtl__card-title">{corporateProfile.title}</h2>
                      </div>
                      <p>{corporateProfile.summary}</p>
                    </article>
                  </motion.div>

                  <motion.div className="corp-vtl__item" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.28, ease: [0.25, 0.1, 0.25, 1] }}>
                    <span className="corp-vtl__dot" />
                    <article className="corp-vtl__card">
                      <div className="corp-vtl__card-header">
                        <span className="corp-vtl__card-icon" aria-hidden="true">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 3v6M8.6 5.2 11 7.6M15.4 5.2 13 7.6" /><path d="M8.2 13.6 12 9.8l3.8 3.8" /><path d="M6.8 13.6h10.4M8.6 20.2h6.8" /></svg>
                        </span>
                        <h2 className="corp-vtl__card-title">{corporateProfile.missionTitle}</h2>
                      </div>
                      <p>{corporateProfile.missionText}</p>
                    </article>
                  </motion.div>

                  <motion.div className="corp-vtl__item" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.46, ease: [0.25, 0.1, 0.25, 1] }}>
                    <span className="corp-vtl__dot" />
                    <article className="corp-vtl__card">
                      <div className="corp-vtl__card-header">
                        <span className="corp-vtl__card-icon" aria-hidden="true">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 20h16M7 20V8h5v12M14 20V4h5v16" /><path d="M9 11h1.8M9 14h1.8M15.2 7h1.8M15.2 10h1.8M15.2 13h1.8" /></svg>
                        </span>
                        <h2 className="corp-vtl__card-title">{corporateProfile.visionTitle}</h2>
                      </div>
                      <p>{corporateProfile.visionText}</p>
                    </article>
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              /* ── Other editorial sections (Yönetim Kurulu etc.) ── */
              <motion.div
                className="corporate-stage__content corporate-stage__content--editorial"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <article className="corporate-stage__editorial-left">
                  <motion.h1 className="corporate-stage__editorial-title" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.08, ease: [0.25, 0.1, 0.25, 1] }}>
                    {corporateProfile.title}
                  </motion.h1>
                  <motion.p className="corporate-stage__editorial-subtitle" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.16, ease: [0.25, 0.1, 0.25, 1] }}>
                    {corporateProfile.summary}
                  </motion.p>
                  <motion.p className="corporate-stage__editorial-subtitle corporate-stage__editorial-subtitle--line2" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.22, ease: [0.25, 0.1, 0.25, 1] }}>
                    {corporateProfile.lead}
                  </motion.p>
                  <motion.div className="corporate-stage__ctas" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.32, ease: [0.25, 0.1, 0.25, 1] }}>
                    <Link href={buildLocaleAwareHref("/sistemlerimiz", activeLocale)} className="corporate-stage__cta corporate-stage__cta--primary">Sistemlerimiz</Link>
                    <Link href={buildLocaleAwareHref("/iletisim", activeLocale)} className="corporate-stage__cta corporate-stage__cta--secondary">İletişime Geçin</Link>
                  </motion.div>
                </article>
                <div className="corporate-stage__editorial-right">
                  <motion.div className="corporate-stage__hero-object" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}>
                    {corporateProfile.videoSource ? (
                      <video className="corporate-stage__hero-object-media" autoPlay loop muted playsInline preload="metadata" poster={corporateProfile.videoPoster} aria-label={corporateProfile.videoLabel}>
                        <source src={corporateProfile.videoSource} type="video/mp4" />
                      </video>
                    ) : (
                      <Image src={corporateProfile.videoPoster ?? displayedSystemContent[0]?.image ?? "/hakkimizda1.jpg"} alt={displayedSystemContent[0]?.imageAlt ?? "Kurumsal görsel"} fill className="corporate-stage__hero-object-media" sizes="(max-width: 980px) 100vw, 55vw" />
                    )}
                  </motion.div>
                  <motion.article className="corporate-stage__float-card corporate-stage__float-card--1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.35, ease: [0.25, 0.1, 0.25, 1] }}>
                    <h2 className="corporate-stage__heading">
                      <span className="corporate-stage__heading-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M12 3v6M8.6 5.2 11 7.6M15.4 5.2 13 7.6" /><path d="M8.2 13.6 12 9.8l3.8 3.8" /><path d="M6.8 13.6h10.4M8.6 20.2h6.8" /></svg></span>
                      {corporateProfile.missionTitle}
                    </h2>
                    <p>{corporateProfile.missionText}</p>
                  </motion.article>
                  <motion.article className="corporate-stage__float-card corporate-stage__float-card--2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.45, ease: [0.25, 0.1, 0.25, 1] }}>
                    <h2 className="corporate-stage__heading">
                      <span className="corporate-stage__heading-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M4 20h16M7 20V8h5v12M14 20V4h5v16" /><path d="M9 11h1.8M9 14h1.8M15.2 7h1.8M15.2 10h1.8M15.2 13h1.8" /></svg></span>
                      {corporateProfile.visionTitle}
                    </h2>
                    <p>{corporateProfile.visionText}</p>
                  </motion.article>
                </div>
              </motion.div>
            )
          ) : !isMinimalRoute ? (
            <div className="systems-stage__content">
              <header className="systems-stage__copy systems-stage__copy--elegant">
                <p className="systems-stage__eyebrow">
                  <span className="systems-stage__eyebrow-dot" aria-hidden="true" />
                  <span className="systems-stage__eyebrow-text">
                    {activeContent.navLabel}
                  </span>
                </p>
                <h1 className="systems-title-inline systems-title-inline--display">
                  <span className="systems-title-inline__text">
                    {activeContent.title}
                  </span>
                </h1>
              </header>

              {/* Açıklama + maddeler — yatay kayan ticker bar.
                  Her item ayrı chip; içerik seamless loop için 2x duplicate edilir.
                  Sadece transform animate → reflow yok (AGENTS.md §11). */}
              <div
                className="systems-ticker"
                role="region"
                aria-label={`${activeContent.title} özeti ve öne çıkanlar`}
              >
                <div className="systems-ticker__track" aria-hidden="false">
                  {[0, 1].map((loopIdx) => (
                    <div
                      key={loopIdx}
                      className="systems-ticker__group"
                      aria-hidden={loopIdx === 1 ? "true" : undefined}
                    >
                      <span className="systems-ticker__item systems-ticker__item--lead">
                        {activeContent.summary}
                      </span>
                      {activeContent.bullets.map((bullet) => (
                        <span key={`${loopIdx}-${bullet}`} className="systems-ticker__item">
                          <span className="systems-ticker__dot" aria-hidden="true" />
                          {bullet}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Kurulum Aşamaları — 5 fazlı yatay timeline.
                  İçinden sürekli akan bir glow ilerler (transform-only).
                  AGENTS.md §11: sadece transform+opacity; §4 beyaz ring. */}
              <ol
                className="systems-phases"
                aria-label="Kurulum aşamaları"
              >
                <span className="systems-phases__rail" aria-hidden="true">
                  {[0, 1, 2, 3].map((seg) => (
                    <span
                      key={seg}
                      className="systems-phases__segment"
                      style={{ "--seg": seg } as CSSProperties}
                    />
                  ))}
                </span>
                {[
                  {
                    num: "01",
                    title: "Keşif & Ölçüm",
                    meta: "Saha analizi",
                    icon: (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="7" />
                        <path d="m20 20-4.3-4.3" />
                      </svg>
                    ),
                  },
                  {
                    num: "02",
                    title: "Proje Tasarımı",
                    meta: "3D simülasyon",
                    icon: (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 21h18" />
                        <path d="M5 21V8l7-5 7 5v13" />
                        <path d="M9 21v-6h6v6" />
                      </svg>
                    ),
                  },
                  {
                    num: "03",
                    title: "İzin & Onay",
                    meta: "Resmi süreç",
                    icon: (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                        <path d="M14 3v6h6" />
                        <path d="m9 15 2 2 4-4" />
                      </svg>
                    ),
                  },
                  {
                    num: "04",
                    title: "Montaj",
                    meta: "Panel + inverter",
                    icon: (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94z" />
                      </svg>
                    ),
                  },
                  {
                    num: "05",
                    title: "Devreye Alma",
                    meta: "Test & teslim",
                    icon: (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    ),
                  },
                ].map((phase, idx) => (
                  <li
                    key={phase.num}
                    className="systems-phase"
                    style={{ "--i": idx } as CSSProperties}
                  >
                    <span className="systems-phase__num" aria-hidden="true">
                      {phase.num}
                    </span>
                    <span className="systems-phase__icon" aria-hidden="true">
                      {phase.icon}
                    </span>
                    <span className="systems-phase__body">
                      <strong className="systems-phase__title">{phase.title}</strong>
                      <small className="systems-phase__meta">{phase.meta}</small>
                    </span>
                  </li>
                ))}
              </ol>

              <div className="systems-stage__diagram">
                <SystemSimulation type={selectedDiorama} />
                <HolographicHUD kpis={activeContent.kpis} isVisible={true} />
              </div>
            </div>
          ) : null}
        </section>

      </main>

      <OrbitalNav
        activeSection={navActiveSection}
        onSelect={handleNavSelect}
        sectionOrder={navSectionOrder}
        labels={navLabels}
        trailing={
          !isMinimalRoute ? (
            <Link
              href={buildLocaleAwareHref("/sistem-farklari", activeLocale)}
              className="systems-tab systems-tab--link"
              data-system-id="sistem-farklari"
              aria-label="Sistem Farkları sayfasına git"
            >
              <span className="systems-tab__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                  <path d="M8.5 5 4 12l4.5 7M15.5 5 20 12l-4.5 7" />
                  <path d="M9.5 10h5M9.5 14h5" />
                </svg>
              </span>
              <span>Sistem Farkları</span>
            </Link>
          ) : null
        }
      />
    </div>
  );
}

export {
  ICONS,
  PROCESS_STEPS,
  SYSTEM_CONTENT,
  VERSUS_CELL_DETAILS,
  VERSUS_COLUMNS,
  VERSUS_MOBILE_HIGHLIGHTS,
  VERSUS_ROWS,
} from "./sistemlerimiz-data";

export type {
  DioramaSectionId,
  IconName,
  SystemColumnKey,
  SystemContent,
  VersusRowId,
} from "./sistemlerimiz-data";
