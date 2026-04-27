"use client";

/**
 * Referanslar — Hikâye (Full-bleed, TikTok-vari dikey story)
 *
 * Yapı:
 *  - Her proje 100svh bir bölüm — tam ekran arka plan + üstünde içerik
 *  - Dikey scroll + scroll-snap proximity → sonraki proje
 *  - Sol üstte yüzen filtre şeridi (sektör + durum)
 *  - Sağ kenarda dikey dot indicator (02 / 15)
 *  - Sol altta: kategori + durum + başlık + KPI + CTA
 *  - Sağ altta: hızlı eylemler (beğen, kaydet, paylaş)
 *
 * Anayasa uyumu:
 *  - scroll-snap-type: y PROXIMITY (y mandatory YASAK → proximity)
 *  - body/html overflow override sadece bu shell için
 *  - 100svh (100vh yasak)
 *  - Dokunmatik hedefler ≥44×44
 *  - Input font-size ≥16px (bu sayfada input yok ama arama açılırsa da öyle)
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Facebook,
  Factory,
  Info,
  Instagram,
  Layers,
  Leaf,
  Linkedin,
  MapPin,
  Palmtree,
  Share2,
  ShoppingBag,
  SlidersHorizontal,
  Tags,
  Truck,
  Twitter,
  X,
} from "lucide-react";
import {
  REFERENCE_PROJECTS,
  SECTOR_FILTERS,
  STATUS_FILTERS,
  type ReferenceProject,
  type ReferenceSector,
  type SectorFilter,
  type StatusFilter,
} from "@/app/referanslar/data";

/* ──────────────────────────────────────────────────────────────
   Yardımcılar
   ────────────────────────────────────────────────────────────── */
const numberFormatter = new Intl.NumberFormat("tr-TR");
const decimalFormatter = new Intl.NumberFormat("tr-TR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

function resolveImageUrl(url: string): string {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return url.startsWith("/") ? url : `/${url}`;
}

const STATUS_VARIANT: Record<string, "done" | "doing" | "warn"> = {
  "Tamamlandı": "done",
  "Devam Eden": "doing",
  "Yapım Aşamasında": "warn",
};

/* Filtre modalında durum chip'leri için display label'ı (sadece görsel).
   Underlying filter değerleri (Tamamlandı/Devam Eden/...) aynı kalır. */
const STATUS_FILTER_LABEL: Record<string, string> = {
  "Tümü": "Tümü",
  "Tamamlandı": "Tamamlanan",
  "Devam Eden": "Devam Eden",
  "Yapım Aşamasında": "Yapım Aşamasında",
};

/* Sektör → icon eşleşmesi (sol tarafta chip içinde gösterilir) */
const SECTOR_ICON: Record<string, typeof Layers> = {
  "Tümü": Layers,
  "Sanayi": Factory,
  "Lojistik": Truck,
  "Tarım": Leaf,
  "Turizm": Palmtree,
  "Ticari": ShoppingBag,
};

/* ──────────────────────────────────────────────────────────────
   DisplayProject
   ────────────────────────────────────────────────────────────── */
type DisplayProject = {
  project: ReferenceProject;
  imageUrl: string;
};

function toDisplay(project: ReferenceProject): DisplayProject {
  return {
    project,
    imageUrl: resolveImageUrl(project.image),
  };
}

type Props = {
  projects?: ReadonlyArray<ReferenceProject>;
};

/* ──────────────────────────────────────────────────────────────
   ReferencesShell — Hikâye
   ────────────────────────────────────────────────────────────── */
export default function ReferencesShell({ projects }: Props = {}) {
  const source = projects ?? REFERENCE_PROJECTS;
  const displayProjects = useMemo<DisplayProject[]>(
    () => source.map(toDisplay),
    [source],
  );

  const [activeSector, setActiveSector] = useState<SectorFilter>("Tümü");
  const [activeStatus, setActiveStatus] = useState<StatusFilter>("Tümü");
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [shareOpenId, setShareOpenId] = useState<string | null>(null);
  /* Her proje için aktif fotoğraf indexi (galeri varsa) */
  const [photoIdxByProject, setPhotoIdxByProject] = useState<Record<string, number>>({});
  /* Her proje için detay paneli (pills + KPI'lar) açık mı — mobilde tek accordion */
  const [detailOpenSet, setDetailOpenSet] = useState<Set<string>>(() => new Set());
  /* Lightbox — tıklanan resim full ekranda açılır */
  const [lightbox, setLightbox] = useState<
    | {
        src: string;
        alt: string;
        projectId: string;
        idx: number;
        gallery: ReadonlyArray<{ src: string; alt: string }>;
      }
    | null
  >(null);

  const selectPhoto = (projectId: string, idx: number) => {
    setPhotoIdxByProject((prev) => ({ ...prev, [projectId]: idx }));
  };

  const closeLightbox = () => setLightbox(null);

  const lightboxPrev = () => {
    if (!lightbox) return;
    const next = (lightbox.idx - 1 + lightbox.gallery.length) % lightbox.gallery.length;
    const photo = lightbox.gallery[next];
    if (!photo) return;
    setLightbox({
      ...lightbox,
      idx: next,
      src: resolveImageUrl(photo.src),
      alt: photo.alt,
    });
    selectPhoto(lightbox.projectId, next);
  };

  const lightboxNext = () => {
    if (!lightbox) return;
    const next = (lightbox.idx + 1) % lightbox.gallery.length;
    const photo = lightbox.gallery[next];
    if (!photo) return;
    setLightbox({
      ...lightbox,
      idx: next,
      src: resolveImageUrl(photo.src),
      alt: photo.alt,
    });
    selectPhoto(lightbox.projectId, next);
  };

  const toggleDetail = (projectId: string) => {
    setDetailOpenSet((prev) => {
      const next = new Set(prev);
      if (next.has(projectId)) next.delete(projectId);
      else next.add(projectId);
      return next;
    });
  };

  const containerRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef<Array<HTMLElement | null>>([]);

  /* Sektör + durum sayıları */
  const sectorTabs = useMemo(() => {
    const counts: Record<string, number> = { Tümü: displayProjects.length };
    displayProjects.forEach((d) => {
      counts[d.project.sector] = (counts[d.project.sector] || 0) + 1;
    });
    return SECTOR_FILTERS.map((s) => ({
      id: s,
      name: s,
      count: s === "Tümü" ? displayProjects.length : (counts[s] ?? 0),
    }));
  }, [displayProjects]);

  const statusPills = useMemo(() => {
    const counts: Record<string, number> = { Tümü: displayProjects.length };
    displayProjects.forEach((d) => {
      counts[d.project.status] = (counts[d.project.status] || 0) + 1;
    });
    return STATUS_FILTERS.map((s) => ({
      id: s,
      name: s,
      count: s === "Tümü" ? displayProjects.length : (counts[s] ?? 0),
      variant: STATUS_VARIANT[s] ?? "all",
    }));
  }, [displayProjects]);

  /* Filtrelenmiş projeler */
  const filtered = useMemo(() => {
    return displayProjects.filter((d) => {
      if (activeSector !== "Tümü" && d.project.sector !== activeSector) return false;
      if (activeStatus !== "Tümü" && d.project.status !== activeStatus) return false;
      return true;
    });
  }, [displayProjects, activeSector, activeStatus]);

  /* Filtre değişince scroll'u başa sar */
  useEffect(() => {
    setCurrentIdx(0);
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [activeSector, activeStatus]);

  /* IntersectionObserver ile aktif projeyi takip et */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // En yüksek intersectionRatio'ya sahip section'ı seç
        let bestIdx = currentIdx;
        let bestRatio = 0;
        for (const entry of entries) {
          const idx = Number(entry.target.getAttribute("data-idx"));
          if (entry.intersectionRatio > bestRatio) {
            bestRatio = entry.intersectionRatio;
            bestIdx = idx;
          }
        }
        if (bestRatio > 0.5 && bestIdx !== currentIdx) {
          setCurrentIdx(bestIdx);
        }
      },
      {
        root: container,
        threshold: [0.25, 0.5, 0.75, 1.0],
      },
    );

    sectionRefs.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [filtered, currentIdx]);

  /* Scroll yardımcılar — artık YATAY (inline) eksen */
  const scrollToIdx = useCallback((idx: number) => {
    const container = containerRef.current;
    if (!container) return;
    const section = sectionRefs.current[idx];
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        inline: "start",
        block: "nearest",
      });
    }
  }, []);

  function goNext() {
    const next = Math.min(currentIdx + 1, filtered.length - 1);
    scrollToIdx(next);
  }
  function goPrev() {
    scrollToIdx(Math.max(currentIdx - 1, 0));
  }

  /* Lightbox açıkken arka plan scroll'unu kilitle */
  useEffect(() => {
    if (!lightbox) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [lightbox]);

  /* Klavye navigasyonu */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      /* Lightbox öncelikli — açıkken: ESC kapatır, ←/→ resim gezintisi */
      if (lightbox) {
        if (e.key === "Escape") {
          e.preventDefault();
          closeLightbox();
          return;
        }
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          lightboxPrev();
          return;
        }
        if (e.key === "ArrowRight") {
          e.preventDefault();
          lightboxNext();
          return;
        }
        return; /* Lightbox açıkken story scroll'u çalışmasın */
      }

      if (e.key === "Escape" && filterOpen) {
        e.preventDefault();
        setFilterOpen(false);
        return;
      }
      if (filterOpen) return;
      /* Yatay scroll: ArrowRight/PageDown → next, ArrowLeft/PageUp → prev */
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault();
        scrollToIdx(Math.min(currentIdx + 1, filtered.length - 1));
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        scrollToIdx(Math.max(currentIdx - 1, 0));
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIdx, filtered.length, scrollToIdx, filterOpen, lightbox]);

  /* Aktif filtre sayısı — trigger butonunda badge */
  const activeFilterCount = (activeSector !== "Tümü" ? 1 : 0) + (activeStatus !== "Tümü" ? 1 : 0);
  const isFirst = currentIdx === 0;
  const isLast = currentIdx === filtered.length - 1;

  const maxDots = Math.min(filtered.length, 7);
  const dotStart = Math.max(0, Math.min(currentIdx - Math.floor(maxDots / 2), filtered.length - maxDots));
  /* Mobil ilerleme çubuğu için % oranı — basit tek parça progress. */
  const progressPercent = filtered.length > 0
    ? ((currentIdx + 1) / filtered.length) * 100
    : 0;

  return (
    <div className="page-shell references-story-shell">
      <main className="rfs-main" id="referanslar-top">
        {/* AGENTS.md §10 — sayfa-düzeyi tek H1 (ekranda görünmez, SEO + a11y için). */}
        <h1 className="sr-only">Turuncu Solar · Referans Projeleri</h1>
        {/* Filtre backdrop — modal açıkken arka planı karartır + tıklayınca kapatır.
            Sadece mobilde görünür (CSS ile), tablet/desktop'ta inline chip kalır. */}
        {filterOpen && (
          <div
            className="rfs-filter-backdrop"
            onClick={() => setFilterOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Filtre bar — tek bar, açılınca chips aynı bar içinden yana açılır.
            Mobilde modal popup, tablet/desktop'ta inline chip. */}
        <div
          className={`rfs-filter-bar${filterOpen ? " rfs-filter-bar--open" : ""}`}
          role="toolbar"
          aria-label="Referans filtreleri"
        >
          <button
            type="button"
            className={`rfs-filter-trigger${activeFilterCount > 0 ? " rfs-filter-trigger--active" : ""}`}
            onClick={() => setFilterOpen((v) => !v)}
            aria-expanded={filterOpen}
            aria-controls="rfs-filter-panel"
            aria-label={filterOpen ? "Filtreyi kapat" : "Filtreyi aç"}
          >
            {filterOpen ? (
              <X size={16} aria-hidden="true" />
            ) : (
              <SlidersHorizontal size={16} aria-hidden="true" />
            )}
            <span>Filtre</span>
            {activeFilterCount > 0 && !filterOpen && (
              <span className="rfs-filter-trigger__badge">{activeFilterCount}</span>
            )}
          </button>

          {filterOpen && (
            <div id="rfs-filter-panel" className="rfs-filter-panel">
              {/* Modal başlığı + X kapat butonu — kullanıcı net şekilde kapatabilsin */}
              <div className="rfs-filter-modal-header">
                <span className="rfs-filter-modal-title">Filtre</span>
                <button
                  type="button"
                  className="rfs-filter-modal-close"
                  onClick={() => setFilterOpen(false)}
                  aria-label="Filtreyi kapat"
                >
                  <X size={20} aria-hidden="true" />
                </button>
              </div>

              <div className="rfs-filter-group">
                <span className="rfs-filter-label">
                  <Tags size={14} aria-hidden="true" />
                  <span>Sektör</span>
                </span>
                <div className="rfs-filter-chips">
                  {sectorTabs.map((s) => {
                    const SectorIcon = SECTOR_ICON[s.id] ?? Layers;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        className={`rfs-chip rfs-chip--with-icon${activeSector === s.id ? " rfs-chip--on" : ""}`}
                        onClick={() => setActiveSector(s.id)}
                        aria-pressed={activeSector === s.id}
                      >
                        <SectorIcon size={14} aria-hidden="true" />
                        <span>{s.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <span className="rfs-filter-sep" aria-hidden="true" />

              <div className="rfs-filter-group">
                <span className="rfs-filter-label">
                  <span>Durum</span>
                </span>
                <div className="rfs-filter-chips">
                  {statusPills.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className={
                        `rfs-chip rfs-chip--status rfs-chip--${s.variant}`
                        + (activeStatus === s.id ? " rfs-chip--on" : "")
                      }
                      onClick={() => setActiveStatus(s.id)}
                      aria-pressed={activeStatus === s.id}
                    >
                      {STATUS_FILTER_LABEL[s.id] ?? s.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sticky footer: Sıfırla + Filtrele butonu
                  Kullanıcı seçimleri yaptıktan sonra "Filtrele (N sonuç)" ile onaylar/kapatır. */}
              <div className="rfs-filter-modal-footer">
                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    className="rfs-filter-clear"
                    onClick={() => {
                      setActiveSector("Tümü");
                      setActiveStatus("Tümü");
                    }}
                    aria-label="Filtreyi sıfırla"
                  >
                    Sıfırla
                  </button>
                )}
                <button
                  type="button"
                  className="rfs-filter-apply"
                  onClick={() => setFilterOpen(false)}
                >
                  Filtrele ({filtered.length} sonuç)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Paylaş butonu — aktif story'nin paylaşımını yönetir.
            Parity: breakpointlerde gizlenmez; CSS sadece konumu ve akışı değiştirir. */}
        {filtered.length > 0 && (() => {
          const activeProject = filtered[currentIdx]?.project;
          if (!activeProject) return null;
          const isOpen = shareOpenId === activeProject.id;
          const projectUrl = `https://www.turuncusolar.com/referanslar#${activeProject.id}`;
          return (
            <div
              className={`references-share rfs-story__actions rfs-story__actions--top${isOpen ? " rfs-story__actions--share-open" : ""}`}
              role="group"
              aria-label="Paylaş"
            >
              <div className="rfs-action-share">
                <button
                  type="button"
                  className={`rfs-action${isOpen ? " rfs-action--on" : ""}`}
                  aria-label={isOpen ? "Paylaş kapat" : "Paylaş"}
                  aria-expanded={isOpen}
                  onClick={() => setShareOpenId((id) => (id === activeProject.id ? null : activeProject.id))}
                >
                  {isOpen ? <X size={16} aria-hidden="true" /> : <Share2 size={16} aria-hidden="true" />}
                </button>
                {isOpen && (
                  <div className="rfs-share-fan rfs-share-fan--right" role="group" aria-label="Sosyal medya">
                    <a className="rfs-action" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(projectUrl)}`} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn'de paylaş">
                      <Linkedin size={16} aria-hidden="true" />
                    </a>
                    <a className="rfs-action" href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(projectUrl)}&text=${encodeURIComponent(activeProject.title)}`} target="_blank" rel="noopener noreferrer" aria-label="X/Twitter'da paylaş">
                      <Twitter size={16} aria-hidden="true" />
                    </a>
                    <a className="rfs-action" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(projectUrl)}`} target="_blank" rel="noopener noreferrer" aria-label="Facebook'ta paylaş">
                      <Facebook size={16} aria-hidden="true" />
                    </a>
                    <a className="rfs-action" href="https://www.instagram.com/turuncusolar" target="_blank" rel="noopener noreferrer" aria-label="Instagram'da takip et">
                      <Instagram size={16} aria-hidden="true" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* Dikey indicator — tablet & desktop'ta sağ kenarda dikey strip,
            mobilde (CSS ile) ince tek parça yatay progress bar'a dönüşür. */}
        {filtered.length > 0 && (
          <aside
            className="rfs-indicator"
            aria-label={`Proje ${currentIdx + 1} / ${filtered.length} — hikâye gezinme`}
            style={{ ["--rfs-progress" as string]: `${progressPercent}%` }}
          >
            <button
              type="button"
              className="rfs-nav-arrow"
              onClick={goPrev}
              disabled={isFirst}
              aria-label="Önceki proje"
              title="Önceki (←)"
            >
              <ChevronLeft size={18} aria-hidden="true" />
            </button>

            <div className="rfs-indicator__dots">
              {Array.from({ length: maxDots }, (_, i) => {
                const idx = dotStart + i;
                const isOn = idx === currentIdx;
                return (
                  <button
                    key={idx}
                    type="button"
                    className={`rfs-indicator__dot${isOn ? " rfs-indicator__dot--on" : ""}`}
                    onClick={() => scrollToIdx(idx)}
                    aria-label={`Proje ${idx + 1}`}
                    aria-current={isOn ? "true" : undefined}
                  />
                );
              })}
            </div>

            <button
              type="button"
              className="rfs-nav-arrow rfs-nav-arrow--pulse"
              onClick={goNext}
              disabled={isLast}
              aria-label="Sonraki proje"
              title="Sonraki (→)"
            >
              <ChevronRight size={18} aria-hidden="true" />
            </button>

            {!isLast && (
              <div className="rfs-indicator__hint" aria-hidden="true">
                <span>Kaydır</span>
              </div>
            )}

            {/* Mobil ince progress bar fill — sadece CSS ile ::before üzerinden gösterilir */}
            <span
              className="rfs-indicator__progress"
              aria-hidden="true"
            />
          </aside>
        )}


        {/* Full-bleed story container */}
        <div
          ref={containerRef}
          className="rfs-stories"
          role="feed"
          aria-live="polite"
          aria-busy="false"
        >
          {filtered.length === 0 ? (
            <div className="rfs-empty" role="status">
              Bu filtreye uygun referans yok.
            </div>
          ) : (
            filtered.map((d, idx) => {
              const p = d.project;
              const statusVariant = STATUS_VARIANT[p.status] ?? "done";
              const gallery = p.gallery && p.gallery.length > 0
                ? p.gallery
                : [{ src: p.image, alt: p.imageAlt }];
              const photoIdx = photoIdxByProject[p.id] ?? 0;
              const currentPhoto = gallery[photoIdx] ?? gallery[0];
              const currentPhotoUrl = resolveImageUrl(currentPhoto.src);
              const isDetailOpen = detailOpenSet.has(p.id);
              return (
                <section
                  key={p.id}
                  ref={(el) => {
                    sectionRefs.current[idx] = el;
                  }}
                  data-idx={idx}
                  className="rfs-story"
                  aria-label={`${idx + 1}. proje`}
                >
                  {/* Ana görünüm: full-bleed bg + content overlay (detay KAPALIYKEN görünür) */}
                  <div
                    className="rfs-story__bg"
                    style={{ backgroundImage: `url(${currentPhotoUrl})` }}
                    role="img"
                    aria-label={currentPhoto.alt}
                  />
                  <div className="rfs-story__fade" aria-hidden="true" />

                  <div className="rfs-story__content">
                    <h2 className="rfs-story__title">{p.title}</h2>

                    <div className="rfs-story__loc">
                      <MapPin size={14} aria-hidden="true" />
                      <span>{p.city}, {p.country}</span>
                      <span className="rfs-story__sep" aria-hidden="true">·</span>
                      <Cpu size={14} aria-hidden="true" />
                      <span>{p.systemType}</span>
                      <span className="rfs-story__sep" aria-hidden="true">·</span>
                      <CalendarDays size={14} aria-hidden="true" />
                      <span>{p.commissioningDate}</span>
                    </div>

                    {/* Desktop thumbnail strip — title/meta altında, DETAY üstünde.
                        Mobilde gizli (CSS ile); mobilde media-card içindeki overlay aktif. */}
                    {gallery.length > 1 && (
                      <div
                        className="rfs-story__thumbs rfs-story__thumbs--desktop"
                        role="tablist"
                        aria-label="Proje fotoğrafları — seçmek için tıkla"
                      >
                        {gallery.map((g, i) => (
                          <button
                            key={g.src + i}
                            type="button"
                            role="tab"
                            className={`rfs-thumb${i === photoIdx ? " rfs-thumb--on" : ""}`}
                            onClick={() => selectPhoto(p.id, i)}
                            aria-selected={i === photoIdx}
                            aria-label={g.alt}
                            style={{ backgroundImage: `url(${resolveImageUrl(g.src)})` }}
                          />
                        ))}
                      </div>
                    )}

                    {/* Detay paneli — mobilde tek accordion.
                        İçerik: pills (Referans/Sektör/Durum) + KPI'lar + galeri thumbnails
                        Tablet/desktop'ta buton gizli, panel her zaman açık. */}
                    <div
                      className={`rfs-detail${isDetailOpen ? " rfs-detail--open" : ""}`}
                      data-open={isDetailOpen ? "true" : "false"}
                    >
                      <button
                        type="button"
                        className="rfs-detail__toggle"
                        onClick={() => toggleDetail(p.id)}
                        aria-expanded={isDetailOpen}
                        aria-controls={`rfs-detail-panel-${p.id}`}
                      >
                        <Info size={14} aria-hidden="true" />
                        <span className="rfs-detail__label">Detay</span>
                        <ChevronDown
                          size={14}
                          aria-hidden="true"
                          className="rfs-detail__chevron"
                        />
                      </button>

                      <div
                        id={`rfs-detail-panel-${p.id}`}
                        className="rfs-detail__panel"
                      >
                        {/* WIREFRAME UYUMU (SADECE MOBİLDE GÖRÜNÜR):
                            Panelin en üstünde resim kartı + thumbnails + overlay paylaş.
                            Tablet/desktop'ta bu blok CSS ile gizlenir, bg photo zaten var.
                            Resme tıklayınca BÜYÜMEZ — sadece görüntü amaçlı. */}
                        <div className="rfs-story__media rfs-story__media--in-panel">
                          <div
                            className="rfs-story__media-image"
                            style={{ backgroundImage: `url(${currentPhotoUrl})` }}
                            role="img"
                            aria-label={currentPhoto.alt}
                          />
                          <div className="rfs-story__media-fade" aria-hidden="true" />

                          <div
                            className={`references-share rfs-story__actions rfs-story__actions--overlay${shareOpenId === p.id ? " rfs-story__actions--share-open" : ""}`}
                            role="group"
                            aria-label="Paylaş"
                          >
                            <div className="rfs-action-share">
                              <button
                                type="button"
                                className={`rfs-action${shareOpenId === p.id ? " rfs-action--on" : ""}`}
                                aria-label={shareOpenId === p.id ? "Paylaş kapat" : "Paylaş"}
                                aria-expanded={shareOpenId === p.id}
                                onClick={() => setShareOpenId((id) => (id === p.id ? null : p.id))}
                              >
                                {shareOpenId === p.id ? (
                                  <X size={16} aria-hidden="true" />
                                ) : (
                                  <Share2 size={16} aria-hidden="true" />
                                )}
                              </button>
                              {shareOpenId === p.id && (
                                <div className="rfs-share-fan rfs-share-fan--down" role="group" aria-label="Sosyal medya">
                                  <a
                                    className="rfs-action"
                                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://www.turuncusolar.com/referanslar#${p.id}`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="LinkedIn'de paylaş"
                                  >
                                    <Linkedin size={16} aria-hidden="true" />
                                  </a>
                                  <a
                                    className="rfs-action"
                                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`https://www.turuncusolar.com/referanslar#${p.id}`)}&text=${encodeURIComponent(p.title)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="X/Twitter'da paylaş"
                                  >
                                    <Twitter size={16} aria-hidden="true" />
                                  </a>
                                  <a
                                    className="rfs-action"
                                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://www.turuncusolar.com/referanslar#${p.id}`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Facebook'ta paylaş"
                                  >
                                    <Facebook size={16} aria-hidden="true" />
                                  </a>
                                  <a
                                    className="rfs-action"
                                    href="https://www.instagram.com/turuncusolar"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Instagram'da takip et"
                                  >
                                    <Instagram size={16} aria-hidden="true" />
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>

                          {gallery.length > 1 && (
                            <div
                              className="rfs-story__thumbs"
                              role="tablist"
                              aria-label="Proje fotoğrafları — seçmek için tıkla"
                            >
                              {gallery.map((g, i) => (
                                <button
                                  key={g.src + i}
                                  type="button"
                                  role="tab"
                                  className={`rfs-thumb${i === photoIdx ? " rfs-thumb--on" : ""}`}
                                  onClick={() => selectPhoto(p.id, i)}
                                  aria-selected={i === photoIdx}
                                  aria-label={g.alt}
                                  style={{ backgroundImage: `url(${resolveImageUrl(g.src)})` }}
                                />
                              ))}
                            </div>
                          )}
                        </div>

                        <div
                          className="rfs-story__pills"
                          role="group"
                          aria-label="Proje bilgisi"
                        >
                          <span className="rfs-pill rfs-pill--orange">
                            {p.sector}
                          </span>
                          <span className={`rfs-pill rfs-pill--${statusVariant}`}>
                            {p.status}
                          </span>
                        </div>

                        <dl className="rfs-story__kpis">
                          <div>
                            <dt>Kurulu Güç</dt>
                            <dd>{numberFormatter.format(p.installedPowerKw)} kWp</dd>
                          </div>
                          <div>
                            <dt>Yıllık Üretim</dt>
                            <dd>{numberFormatter.format(p.annualProductionMWh)} MWh</dd>
                          </div>
                          <div>
                            <dt>Performans</dt>
                            <dd>{decimalFormatter.format(p.performanceRatio)}%</dd>
                          </div>
                          <div>
                            <dt>CO₂ Azaltım</dt>
                            <dd>{numberFormatter.format(p.co2ReductionTon)} t</dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </div>

                  {/* Paylaş butonu — tüm breakpointlerde erişilebilir kalır.
                      Parity: mobilde full-width akışa, desktopta floating/top düzene uyarlanır. */}
                  <div
                    className={`references-share rfs-story__actions rfs-story__actions--floating${shareOpenId === p.id ? " rfs-story__actions--share-open" : ""}`}
                    role="group"
                    aria-label="Paylaş"
                  >
                    <div className="rfs-action-share">
                      <button
                        type="button"
                        className={`rfs-action${shareOpenId === p.id ? " rfs-action--on" : ""}`}
                        aria-label={shareOpenId === p.id ? "Paylaş kapat" : "Paylaş"}
                        aria-expanded={shareOpenId === p.id}
                        onClick={() => setShareOpenId((id) => (id === p.id ? null : p.id))}
                      >
                        {shareOpenId === p.id ? (
                          <X size={16} aria-hidden="true" />
                        ) : (
                          <Share2 size={16} aria-hidden="true" />
                        )}
                      </button>
                      {shareOpenId === p.id && (
                        <div className="rfs-share-fan" role="group" aria-label="Sosyal medya">
                          <a className="rfs-action" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://www.turuncusolar.com/referanslar#${p.id}`)}`} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn'de paylaş">
                            <Linkedin size={16} aria-hidden="true" />
                          </a>
                          <a className="rfs-action" href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`https://www.turuncusolar.com/referanslar#${p.id}`)}&text=${encodeURIComponent(p.title)}`} target="_blank" rel="noopener noreferrer" aria-label="X/Twitter'da paylaş">
                            <Twitter size={16} aria-hidden="true" />
                          </a>
                          <a className="rfs-action" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://www.turuncusolar.com/referanslar#${p.id}`)}`} target="_blank" rel="noopener noreferrer" aria-label="Facebook'ta paylaş">
                            <Facebook size={16} aria-hidden="true" />
                          </a>
                          <a className="rfs-action" href="https://www.instagram.com/turuncusolar" target="_blank" rel="noopener noreferrer" aria-label="Instagram'da takip et">
                            <Instagram size={16} aria-hidden="true" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              );
            })
          )}
        </div>
      </main>

      {/* Lightbox — tıklanan thumbnail'ın büyük görüntüsü.
          Backdrop'a tıklayınca veya ESC basınca kapanır.
          Çoklu resim varsa ← / → oklarıyla gezinme. */}
      {lightbox && (
        <div
          className="rfs-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.alt}
          onClick={closeLightbox}
        >
          <button
            type="button"
            className="rfs-lightbox__close"
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
            aria-label="Kapat"
          >
            <X size={20} aria-hidden="true" />
          </button>

          {lightbox.gallery.length > 1 && (
            <>
              <button
                type="button"
                className="rfs-lightbox__nav rfs-lightbox__nav--prev"
                onClick={(e) => {
                  e.stopPropagation();
                  lightboxPrev();
                }}
                aria-label="Önceki fotoğraf"
              >
                <ChevronLeft size={24} aria-hidden="true" />
              </button>
              <button
                type="button"
                className="rfs-lightbox__nav rfs-lightbox__nav--next"
                onClick={(e) => {
                  e.stopPropagation();
                  lightboxNext();
                }}
                aria-label="Sonraki fotoğraf"
              >
                <ChevronRight size={24} aria-hidden="true" />
              </button>
            </>
          )}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="rfs-lightbox__image"
            src={lightbox.src}
            alt={lightbox.alt}
            onClick={(e) => e.stopPropagation()}
          />

          {lightbox.gallery.length > 1 && (
            <span className="rfs-lightbox__counter" aria-live="polite">
              {lightbox.idx + 1} / {lightbox.gallery.length}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export type { ReferenceSector };
