"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useRef, useState, type ReactNode } from "react";
import OrbitalNav from "@/components/systems/OrbitalNav";
import "@/styles/components/hakkimizda-solar2-desktop.css";
// Faz 10 cleanup: HakkimizdaSolar2Mobile + useResponsiveShell + useDevice kaldırıldı.
// HakkimizdaRouter (src/components/kurumsal/HakkimizdaRouter.tsx) üzerinden mobil
// shell seçimi yapılıyor; bu dosya sadece desktop render'ı üstlenir.

export { COMPANY_TIMELINE } from "./corporateTimeline";
export type { CompanyTimelineEntry } from "./corporateTimeline";

export type CorporateSectionId = "grid" | "hybrid-with-battery";

type CorporateProfile = {
  title: string;
  summary: string;
  missionTitle: string;
  missionText: string;
  visionTitle: string;
  visionText: string;
};

export const CORPORATE_SECTION_ORDER: ReadonlyArray<CorporateSectionId> = ["grid", "hybrid-with-battery"];

export const CORPORATE_NAV_LABELS: Record<CorporateSectionId, string> = {
  grid: "Biz Kimiz",
  "hybrid-with-battery": "Sürdürülebilirlik",
};

const CORPORATE_TAB_ICONS: Record<CorporateSectionId, ReactNode> = {
  grid: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden>
      <path d="M12 2 6.4 10.8h11.2z" />
      <path d="M8 10.8V22M16 10.8V22" />
    </svg>
  ),
  "hybrid-with-battery": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden>
      <rect x="3.8" y="6.2" width="17.2" height="11.6" rx="2.5" />
      <path d="M21 9.3h1.6v5.4H21M7.8 12h8.4" />
    </svg>
  ),
};

export const CORPORATE_PROFILES: Record<CorporateSectionId, CorporateProfile> = {
  grid: {
    title: "Biz Kimiz",
    summary:
      "Turuncu Solar olarak konut ve ticari projelerde uçtan uca mühendislik yaklaşımıyla çalışan, ölçülebilir sonuç üreten bir yenilenebilir enerji ekibiyiz.",
    missionTitle: "Misyon",
    missionText: "Temiz enerjiyi erişilebilir, güvenilir ve sürdürülebilir proje modeliyle yaygınlaştırmak.",
    visionTitle: "Vizyon",
    visionText: "Türkiye’de yüksek verimli güneş enerji dönüşümünde referans gösterilen mühendislik markası olmak.",
  },
  "hybrid-with-battery": {
    title: "Sürdürülebilirlik",
    summary:
      "Sürdürülebilirliği yalnızca enerji üretimi olarak değil; tasarım, malzeme seçimi ve uzun dönem işletme performansı ile birlikte ele alıyoruz.",
    missionTitle: "Çevresel Etki",
    missionText: "Karbon emisyonunu azaltan, verimi sürekli izlenen ve kaynak tüketimini optimize eden sistemler üretmek.",
    visionTitle: "Uzun Ömür",
    visionText: "Yüksek performansı yıllara yayılan, bakım disiplini güçlü ve sürdürülebilir enerji altyapıları kurmak.",
  },
};

export default function HakkimizdaSolar2Desktop() {
  const [selectedSection, setSelectedSection] = useState<CorporateSectionId>("grid");
  const shellRef = useRef<HTMLElement | null>(null);

  const isSustainability = selectedSection === "hybrid-with-battery";
  // Faz 10 cleanup: isMobileOrTablet branch kaldırıldı — Router handle ediyor.

  const handleNavSelect = (id: CorporateSectionId) => {
    setSelectedSection(id);
    const shell = shellRef.current;
    if (shell) {
      shell.scrollTo({ top: 0, behavior: "auto" });
    }
  };


  return (
    <div className="systems-page systems-page--hakkimizda-desktop" data-active-system={selectedSection}>
      <div className="systems-bg" aria-hidden="true">
        <span className="systems-bg__orb systems-bg__orb--left" />
        <span className="systems-bg__orb systems-bg__orb--right" />
      </div>
      <span className="systems-bg__mesh" aria-hidden="true" />

      <main className="systems-shell" ref={shellRef}>
        <section
          id="hakkimizda-stage"
          className={`systems-stage systems-stage--corporate${selectedSection === "grid" ? " systems-stage--bizkimiz" : ""}`}
          data-hakkimizda-section="stage"
        >
          {CORPORATE_SECTION_ORDER.map((sectionId) => (
            <div
              key={sectionId}
              className={`systems-stage__bg ${selectedSection === sectionId ? "is-active" : ""}`.trim()}
            >
              <Image
                src="/bizkimizbackround.jpg"
                alt={sectionId === "grid" ? "Biz Kimiz arka plan" : "Sürdürülebilirlik arka plan"}
                fill
                priority
                className="systems-stage__bg-image"
              />
              <div className="systems-stage__bg-mask" />
            </div>
          ))}

          <div className="systems-stage__grid-overlay" aria-hidden="true" />

          <a
            href="https://renevoenergy.com/"
            target="_blank"
            rel="noreferrer"
            className="kurumsal-bk2__partner"
            style={{ display: "none" }}
            aria-label="İş ortağımız: Renevo Energy"
          >
            <span className="kurumsal-bk2__partner-rotator" aria-hidden="true">
              {[
                {
                  label: "Rüzgar Enerjisi",
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
                      <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
                      <path d="M17.6 7.6A2.5 2.5 0 1 1 19.4 12H2" />
                    </svg>
                  ),
                },
                {
                  label: "Güneş Enerjisi",
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="4" />
                      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4" />
                    </svg>
                  ),
                },
                {
                  label: "Hidroelektrik",
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2s6 7.5 6 12a6 6 0 0 1-12 0c0-4.5 6-12 6-12z" />
                    </svg>
                  ),
                },
                {
                  label: "Hibrit Çözümler",
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2 2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5" />
                      <path d="M2 12l10 5 10-5" />
                    </svg>
                  ),
                },
                {
                  label: "Depolama Çözümleri",
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="18" height="10" rx="2" />
                      <path d="M22 11v2" />
                      <path d="M6 10v4M10 10v4" />
                    </svg>
                  ),
                },
                {
                  label: "Rüzgar Ölçüm İstasyonu",
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
                      <path d="M12 2a10 10 0 0 1 10 10" />
                      <path d="M12 6a6 6 0 0 1 6 6" />
                      <path d="M12 22V14" />
                    </svg>
                  ),
                },
              ].map((item, i) => (
                <span
                  key={item.label}
                  className="kurumsal-bk2__partner-word"
                  style={{ animationDelay: `${i * 3}s` }}
                >
                  <span className="kurumsal-bk2__partner-icon">{item.icon}</span>
                  <span className="kurumsal-bk2__partner-label">{item.label}</span>
                </span>
              ))}
            </span>
            <Image
              src="/renevologo.svg"
              alt="Renevo Energy"
              width={332}
              height={78}
              className="kurumsal-bk2__partner-logo"
            />
          </a>

          {isSustainability ? (
            // ─── SÜRDÜRÜLEBİLİRLİK · 4 Kolon (Animasyonlu) ───
            <motion.div
              className="suscols"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.svg" alt="" aria-hidden="true" className="suscols__brandmark" />
              <div className="suscols__head">
                <div className="suscols__kicker">Sürdürülebilirlik · Dört Taahhüt</div>
                <h2 className="suscols__h">
                  Temiz bir gelecek için gücümüz enerji, <em>hedefimiz sürdürülebilirlik.</em>
                </h2>
                <p className="suscols__sub">
                  Turuncu Solar olarak sürdürülebilirliği dört temel sütun üzerinden ölçülebilir bir taahhüt olarak ele alıyoruz. Her sütun, bir projede karşıladığımız somut bir sorumluluğa karşılık geliyor.
                </p>
              </div>

              <div className="suscols__grid">
                {[
                  {
                    n: "01",
                    top: "Güneş enerjisini teknik ve ekonomik olarak erişilebilir kılarak temiz üretimi yaygınlaştırıyoruz.",
                    title: "Erişilebilir Temiz Enerji",
                    bot: "Her ölçekte uygulanabilir, finansal olarak kendini amorti eden güneş sistemleri.",
                    svg: (
                      <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/></svg>
                    ),
                  },
                  {
                    n: "02",
                    top: "Şehir ölçeğinde düşük karbonlu altyapılar kurarak sürdürülebilir topluluklara katkı sağlıyoruz.",
                    title: "Sürdürülebilir Şehirler",
                    bot: "Yerel iklim ve kaynak dengesine göre planlanmış, dirençli enerji altyapıları.",
                    svg: (
                      <svg viewBox="0 0 24 24"><path d="M3 21h18M6 21V9l6-4 6 4v12M10 21v-6h4v6"/><path d="M9 9h0M15 9h0M9 13h0M15 13h0"/></svg>
                    ),
                  },
                  {
                    n: "03",
                    top: "Uzun ömürlü, geri dönüştürülebilir bileşenlerle çalışıyor; israfı en aza indiriyoruz.",
                    title: "Sorumlu Üretim & Tüketim",
                    bot: "%98 geri dönüştürülebilir malzeme, şeffaf tedarik zinciri ve uzun ömür.",
                    svg: (
                      <svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 0 1 15.5-6.3L21 8M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15.5 6.3L3 16M3 21v-5h5"/></svg>
                    ),
                  },
                  {
                    n: "04",
                    top: "Her projede ölçülebilir karbon azaltımı taahhüt ediyor, iklim eylemini raporluyoruz.",
                    title: "İklim Eylemi",
                    bot: "2019'dan bugüne 12.400 ton CO₂ eşdeğeri emisyon azaltımına katkı.",
                    svg: (
                      <svg viewBox="0 0 24 24"><path d="M12 3s-6 6-6 11a6 6 0 0 0 12 0c0-5-6-11-6-11z"/><path d="M12 13v5"/></svg>
                    ),
                  },
                ].map((c) => (
                  <article key={c.n} className="suscols__col" data-n={c.n}>
                    <p className="suscols__col-top">{c.top}</p>
                    <div className="suscols__icon" aria-hidden="true">{c.svg}</div>
                    <div className="suscols__col-divider" />
                    <h3 className="suscols__col-title">{c.title}</h3>
                    <p className="suscols__col-bot">{c.bot}</p>
                    <div className="suscols__arrow" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
                    </div>
                  </article>
                ))}
              </div>
            </motion.div>
          ) : (
            // ─── BİZ KİMİZ · Konsept 4 (Immersive) ───
            <motion.div
              className="kurumsal-c4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div className="kurumsal-c4__inner">
              <div className="kurumsal-bk2">
                <div className="kurumsal-bk2__left">
                  <Image
                    src="/logo.svg"
                    alt=""
                    width={689}
                    height={764}
                    className="kurumsal-bk2__logo"
                    priority
                  />
                  <h1 className="kurumsal-bk2__h">Biz kimiz ?</h1>
                  <div className="kurumsal-bk2__text">
                    <p>Turuncu Solar, güneş enerjisi alanında mühendislik, proje geliştirme ve uygulama disiplinlerini bütüncül bir yaklaşımla bir araya getiren bağımsız bir enerji firmasıdır. Kurulduğumuz günden bu yana odağımız; enerji üretimini yalnızca teknik bir süreç olarak değil, uzun vadeli sürdürülebilirlik ve verimlilik perspektifiyle ele almaktır.</p>
                    <p>Bizim için güneş enerjisi; yalnızca elektrik üretimi sağlayan bir sistem değil, aynı zamanda çevresel sorumluluğun, ekonomik bağımsızlığın ve teknolojik ilerlemenin kesişim noktasıdır. Bu nedenle her projeyi yalnızca bugünün ihtiyaçlarına göre değil, geleceğin enerji dinamiklerini de dikkate alarak değerlendiririz.</p>
                    <p>Turuncu Solar, klasik anlamda bir uygulayıcı olmanın ötesinde; enerji sistemlerini doğru tanımlayan, doğru kurgulayan ve uzun vadeli performans odaklı çözümler geliştiren bir mühendislik yaklaşımını temsil eder.</p>
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/turuncusolaryazi.svg" alt="" aria-hidden="true" className="kurumsal-bk2__wordmark" />
                </div>
                <div className="kurumsal-bk2__map" aria-hidden="true">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/haritadunya.svg" alt="Turuncu Solar dünya haritası" className="kurumsal-bk2__map-svg" />
                  <div className="kurumsal-bk2__twinkles">
                    {Array.from({ length: 22 }).map((_, i) => (
                      <span
                        key={i}
                        className="kurumsal-bk2__twinkle"
                        style={{
                          left: `${(i * 37 + 11) % 92 + 4}%`,
                          top: `${(i * 53 + 17) % 78 + 11}%`,
                          animationDelay: `${(i * 0.27) % 4.2}s`,
                          animationDuration: `${2.4 + ((i * 0.31) % 2.6)}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              </div>
            </motion.div>
          )}
          <div className="kurumsal-orbit-nav">
            <OrbitalNav
              activeSection={selectedSection}
              onSelect={handleNavSelect}
              sectionOrder={CORPORATE_SECTION_ORDER}
              labels={CORPORATE_NAV_LABELS}
              icons={CORPORATE_TAB_ICONS}
            />
          </div>
        </section>
      </main>

      <footer aria-label="Sayfa sonu" />
    </div>
  );
}
