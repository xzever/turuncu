"use client";

/**
 * Blog — Hikâye (Referanslar story view'ı ile aynı tasarım)
 *
 * Yapı:
 *  - Her post 100svh bir bölüm — full-bleed featured image + içerik overlay
 *  - Yatay scroll + scroll-snap proximity → sonraki post
 *  - Sol üstte filtre butonu
 *  - Desktop'ta Filtre'nin sağında paylaş butonu
 *  - Sol altta: baslik + meta (kategori / tarih)
 *  - Alt orta: KAYDIR indicator pill
 *
 * CLAUDE.md Madde 18: Referanslar referans uygulama — aynı CSS (rfs-*) kullanılır.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Facebook,
  Factory,
  FileText,
  Instagram,
  Layers,
  Leaf,
  Link2,
  Linkedin,
  Palmtree,
  Share2,
  ShoppingBag,
  SlidersHorizontal,
  Tags,
  Truck,
  Twitter,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { BlogPost } from "@/lib/blogTypes";

/* ──────────────────────────────────────────────────────────────
   Yardımcılar
   ────────────────────────────────────────────────────────────── */
function resolveImageUrl(url: string): string {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return url.startsWith("/") ? url : `/${url}`;
}

const TR_MONTHS = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
];

function formatDateTr(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${TR_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/* Okuma süresi tahmini — kelime sayısı / 200 wpm */
function estimateReadMinutes(content: string): number {
  const words = content.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}


/* Kategori adları (Referanslar ile birebir aynı) */
const CATEGORY_LIST = ["Tümü", "Sanayi", "Lojistik", "Tarım", "Turizm", "Ticari"] as const;
type CategoryFilter = (typeof CATEGORY_LIST)[number];

const CATEGORY_ICON: Record<string, typeof Layers> = {
  "Tümü": Layers,
  "Sanayi": Factory,
  "Lojistik": Truck,
  "Tarım": Leaf,
  "Turizm": Palmtree,
  "Ticari": ShoppingBag,
};

/* Blog categoryId (sanayi, lojistik...) → Kategori adı (Sanayi, Lojistik...) */
function categoryLabel(categoryId: string): CategoryFilter {
  const map: Record<string, CategoryFilter> = {
    sanayi: "Sanayi",
    lojistik: "Lojistik",
    tarim: "Tarım",
    turizm: "Turizm",
    ticari: "Ticari",
  };
  return map[categoryId] ?? "Sanayi";
}

/* ──────────────────────────────────────────────────────────────
   DisplayPost
   ────────────────────────────────────────────────────────────── */
type DisplayPost = {
  post: BlogPost;
  imageUrl: string;
  categoryName: CategoryFilter;
  dateLabel: string;
  readMinutes: number;
  /* SEO etiketleri — KPI grid'de gösterilir */
  tags: string[];
};

function toDisplay(post: BlogPost): DisplayPost {
  const content = post.content ?? "";
  /* Keywords'ten ilk 6 etiketi al — duplicate ve boşları temizle */
  const tags = Array.from(
    new Set((post.keywords ?? []).map((k) => k.trim()).filter(Boolean)),
  ).slice(0, 6);
  return {
    post,
    imageUrl: resolveImageUrl(post.featuredImage ?? "/blog-back.webp"),
    categoryName: categoryLabel(post.categoryId ?? "sanayi"),
    dateLabel: formatDateTr(post.publishedAt),
    readMinutes: estimateReadMinutes(content),
    tags,
  };
}

type Props = {
  posts: ReadonlyArray<BlogPost>;
  basePath?: string;
};

/* ──────────────────────────────────────────────────────────────
   BlogStoryShell — Hikâye
   ────────────────────────────────────────────────────────────── */
export default function BlogStoryShell({ posts, basePath = "/blog" }: Props) {
  const router = useRouter();
  const displayPosts = useMemo<DisplayPost[]>(() => posts.map(toDisplay), [posts]);

  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("Tümü");
  /* Aktif tag filtresi — null ise tüm yazılar, değer varsa o tag'i içerenler */
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [shareOpenId, setShareOpenId] = useState<string | null>(null);
  /* Share menüsü içindeki "Kopyalandı" geri bildirimi (hangi post için) */
  const [copiedForId, setCopiedForId] = useState<string | null>(null);

  const copyLink = useCallback(async (url: string, id: string) => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const ta = document.createElement("textarea");
        ta.value = url;
        ta.setAttribute("readonly", "");
        ta.style.position = "absolute";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopiedForId(id);
      window.setTimeout(() => setCopiedForId((c) => (c === id ? null : c)), 2000);
    } catch {
      /* sessiz fallback */
    }
  }, []);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef<Array<HTMLElement | null>>([]);

  /* Kategori sayıları */
  const categoryTabs = useMemo(() => {
    const counts: Record<string, number> = { Tümü: displayPosts.length };
    displayPosts.forEach((d) => {
      counts[d.categoryName] = (counts[d.categoryName] || 0) + 1;
    });
    return CATEGORY_LIST.map((c) => ({
      id: c,
      name: c,
      count: c === "Tümü" ? displayPosts.length : (counts[c] ?? 0),
    }));
  }, [displayPosts]);

  /* Filtrelenmiş postlar */
  const filtered = useMemo(() => {
    return displayPosts.filter((d) => {
      if (activeCategory !== "Tümü" && d.categoryName !== activeCategory) return false;
      if (activeTag && !d.tags.some((t) => t.toLowerCase() === activeTag.toLowerCase())) return false;
      return true;
    });
  }, [displayPosts, activeCategory, activeTag]);

  /* Filtre değişince scroll'u başa sar */
  useEffect(() => {
    setCurrentIdx(0);
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [activeCategory, activeTag]);

  /* IntersectionObserver ile aktif post takibi */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new IntersectionObserver(
      (entries) => {
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
      { root: container, threshold: [0.25, 0.5, 0.75, 1.0] },
    );
    sectionRefs.current.forEach((section) => {
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, [filtered, currentIdx]);

  const scrollToIdx = useCallback((idx: number) => {
    const container = containerRef.current;
    if (!container) return;
    const section = sectionRefs.current[idx];
    if (section) {
      section.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
    }
  }, []);

  function goNext() {
    scrollToIdx(Math.min(currentIdx + 1, filtered.length - 1));
  }
  function goPrev() {
    scrollToIdx(Math.max(currentIdx - 1, 0));
  }

  /* Klavye navigasyonu — ESC: filtre kapat, ←/→: yazılar arası gezin */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && filterOpen) {
        e.preventDefault();
        setFilterOpen(false);
        return;
      }
      if (filterOpen) return;
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
  }, [currentIdx, filtered.length, scrollToIdx, filterOpen]);

  const activeFilterCount = (activeCategory !== "Tümü" ? 1 : 0) + (activeTag ? 1 : 0);
  const isFirst = currentIdx === 0;
  const isLast = currentIdx === filtered.length - 1;
  const maxDots = Math.min(filtered.length, 7);
  const dotStart = Math.max(0, Math.min(currentIdx - Math.floor(maxDots / 2), filtered.length - maxDots));
  const progressPercent = filtered.length > 0 ? ((currentIdx + 1) / filtered.length) * 100 : 0;

  return (
    <div className="page-shell references-story-shell bs-list-shell">
      <main className="rfs-main" id="blog-top">
        {/* CLAUDE.md §10 — sayfa-düzeyi tek H1 (ekranda görünmez, SEO + a11y için). */}
        <h1 className="sr-only">Turuncu Solar · Blog</h1>
        {/* Filtre backdrop */}
        {filterOpen && (
          <div className="rfs-filter-backdrop" onClick={() => setFilterOpen(false)} aria-hidden="true" />
        )}

        {/* Filtre bar */}
        <div
          className={`rfs-filter-bar${filterOpen ? " rfs-filter-bar--open" : ""}`}
          role="toolbar"
          aria-label="Blog filtreleri"
        >
          <button
            type="button"
            className={`rfs-filter-trigger${activeFilterCount > 0 ? " rfs-filter-trigger--active" : ""}`}
            onClick={() => setFilterOpen((v) => !v)}
            aria-expanded={filterOpen}
            aria-controls="bs-filter-panel"
            aria-label={filterOpen ? "Filtreyi kapat" : "Filtreyi aç"}
          >
            {filterOpen ? <X size={16} aria-hidden="true" /> : <SlidersHorizontal size={16} aria-hidden="true" />}
            <span>Filtre</span>
            {activeFilterCount > 0 && !filterOpen && (
              <span className="rfs-filter-trigger__badge">{activeFilterCount}</span>
            )}
          </button>

          {filterOpen && (
            <div id="bs-filter-panel" className="rfs-filter-panel">
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
                  <span>Kategori</span>
                </span>
                <div className="rfs-filter-chips">
                  {categoryTabs.map((c) => {
                    const CatIcon = CATEGORY_ICON[c.id] ?? Layers;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        className={`rfs-chip rfs-chip--with-icon${activeCategory === c.id ? " rfs-chip--on" : ""}`}
                        onClick={() => setActiveCategory(c.id)}
                        aria-pressed={activeCategory === c.id}
                      >
                        <CatIcon size={14} aria-hidden="true" />
                        <span>{c.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Aktif tag — filter modal içinde gösterilir, tıklayınca kaldırılır */}
              {activeTag && (
                <div className="rfs-filter-group">
                  <span className="rfs-filter-label">
                    <Tags size={14} aria-hidden="true" />
                    <span>Etiket</span>
                  </span>
                  <div className="rfs-filter-chips">
                    <button
                      type="button"
                      className="rfs-chip rfs-chip--on"
                      onClick={() => setActiveTag(null)}
                      aria-label={`Etiket filtresi: ${activeTag} — kaldır`}
                    >
                      <span>#{activeTag}</span>
                      <X size={12} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              )}

              <div className="rfs-filter-modal-footer">
                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    className="rfs-filter-clear"
                    onClick={() => {
                      setActiveCategory("Tümü");
                      setActiveTag(null);
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
                  Filtrele ({filtered.length} yazı)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Desktop paylaş butonu — Filtre'nin sağında (≥1280px) */}
        {filtered.length > 0 && (() => {
          const activePost = filtered[currentIdx]?.post;
          if (!activePost) return null;
          const isOpen = shareOpenId === activePost.id;
          const postUrl = `https://www.turuncusolar.com${basePath}/${activePost.slug}`;
          return (
            <div
              className={`rfs-story__actions rfs-story__actions--top${isOpen ? " rfs-story__actions--share-open" : ""}`}
              role="group"
              aria-label="Paylaş"
            >
              <div className="rfs-action-share">
                <button
                  type="button"
                  className={`rfs-action${isOpen ? " rfs-action--on" : ""}`}
                  aria-label={isOpen ? "Paylaş kapat" : "Paylaş"}
                  aria-expanded={isOpen}
                  onClick={() => setShareOpenId((id) => (id === activePost.id ? null : activePost.id))}
                >
                  {isOpen ? <X size={16} aria-hidden="true" /> : <Share2 size={16} aria-hidden="true" />}
                </button>
                {isOpen && (
                  <div className="rfs-share-fan rfs-share-fan--right" role="group" aria-label="Sosyal medya">
                    <a className="rfs-action" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn'de paylaş">
                      <Linkedin size={16} aria-hidden="true" />
                    </a>
                    <a className="rfs-action" href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(activePost.title)}`} target="_blank" rel="noopener noreferrer" aria-label="X/Twitter'da paylaş">
                      <Twitter size={16} aria-hidden="true" />
                    </a>
                    <a className="rfs-action" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`} target="_blank" rel="noopener noreferrer" aria-label="Facebook'ta paylaş">
                      <Facebook size={16} aria-hidden="true" />
                    </a>
                    <a className="rfs-action" href="https://www.instagram.com/turuncusolar" target="_blank" rel="noopener noreferrer" aria-label="Instagram'da takip et">
                      <Instagram size={16} aria-hidden="true" />
                    </a>
                    <button
                      type="button"
                      className="rfs-action"
                      onClick={() => copyLink(postUrl, `top-${activePost.id}`)}
                      aria-label={copiedForId === `top-${activePost.id}` ? "Link kopyalandı" : "Linki kopyala"}
                    >
                      {copiedForId === `top-${activePost.id}` ? <Check size={16} aria-hidden="true" /> : <Link2 size={16} aria-hidden="true" />}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* Indicator pill */}
        {filtered.length > 0 && (
          <aside
            className="rfs-indicator"
            aria-label={`Yazı ${currentIdx + 1} / ${filtered.length} — blog gezinme`}
            style={{ ["--rfs-progress" as string]: `${progressPercent}%` }}
          >
            <button
              type="button"
              className="rfs-nav-arrow"
              onClick={goPrev}
              disabled={isFirst}
              aria-label="Önceki yazı"
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
                    aria-label={`Yazı ${idx + 1}`}
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
              aria-label="Sonraki yazı"
              title="Sonraki (→)"
            >
              <ChevronRight size={18} aria-hidden="true" />
            </button>

            {!isLast && (
              <div className="rfs-indicator__hint" aria-hidden="true">
                <span>Kaydır</span>
              </div>
            )}

            <span className="rfs-indicator__progress" aria-hidden="true" />
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
              Bu kategoride blog yazısı yok.
            </div>
          ) : (
            filtered.map((d, idx) => {
              const p = d.post;
              const postUrl = `https://www.turuncusolar.com${basePath}/${p.slug}`;
              return (
                <Card
                  key={p.id}
                  ref={(el) => {
                    sectionRefs.current[idx] = el;
                  }}
                  data-idx={idx}
                  className="rfs-story bs-story-clickable bs-story-card"
                  aria-label={`${idx + 1}. yazı — ${p.title}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    router.push(`${basePath}/${p.slug}`);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      router.push(`${basePath}/${p.slug}`);
                    }
                  }}
                >
                  <div
                    className="rfs-story__bg"
                    style={{ backgroundImage: `url(${d.imageUrl})` }}
                    role="img"
                    aria-label={p.title}
                  />
                  <div className="rfs-story__fade" aria-hidden="true" />

                  <div className="rfs-story__content">
                    <h2 className="rfs-story__title">{p.title}</h2>

                    <div className="rfs-story__loc">
                      <Tags size={14} aria-hidden="true" />
                      <Badge variant="secondary" className="bs-story-badge">
                        {d.categoryName}
                      </Badge>
                      <span className="rfs-story__sep" aria-hidden="true">·</span>
                      <CalendarDays size={14} aria-hidden="true" />
                      <span>{d.dateLabel}</span>
                      <span className="rfs-story__sep" aria-hidden="true">·</span>
                      <FileText size={14} aria-hidden="true" />
                      <span>{d.readMinutes} dk okuma</span>
                    </div>
                  </div>

                  {/* Per-story floating paylaş — referanslarla aynı.
                      */}
                  <div
                    className={`rfs-story__actions rfs-story__actions--floating${shareOpenId === p.id ? " rfs-story__actions--share-open" : ""}`}
                    role="group"
                    aria-label="Paylaş"
                    onClick={(e) => e.stopPropagation()}
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
                          <a className="rfs-action" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn'de paylaş">
                            <Linkedin size={16} aria-hidden="true" />
                          </a>
                          <a className="rfs-action" href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(p.title)}`} target="_blank" rel="noopener noreferrer" aria-label="X/Twitter'da paylaş">
                            <Twitter size={16} aria-hidden="true" />
                          </a>
                          <a className="rfs-action" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`} target="_blank" rel="noopener noreferrer" aria-label="Facebook'ta paylaş">
                            <Facebook size={16} aria-hidden="true" />
                          </a>
                          <a className="rfs-action" href="https://www.instagram.com/turuncusolar" target="_blank" rel="noopener noreferrer" aria-label="Instagram'da takip et">
                            <Instagram size={16} aria-hidden="true" />
                          </a>
                          <button
                            type="button"
                            className="rfs-action"
                            onClick={(e) => { e.stopPropagation(); copyLink(postUrl, `floating-${p.id}`); }}
                            aria-label={copiedForId === `floating-${p.id}` ? "Link kopyalandı" : "Linki kopyala"}
                          >
                            {copiedForId === `floating-${p.id}` ? <Check size={16} aria-hidden="true" /> : <Link2 size={16} aria-hidden="true" />}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </main>

    </div>
  );
}
