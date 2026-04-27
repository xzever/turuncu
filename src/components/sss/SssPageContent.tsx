"use client";

import { useMemo, useState } from "react";
import {
  BadgeCheck,
  ChevronDown,
  CircleDollarSign,
  ClipboardCheck,
  HelpCircle,
  ListFilter,
  MessageCircle,
  Search,
  Settings,
  ShieldCheck,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { FAQS, FAQ_CATEGORIES, FAQ_INTRO_TEXT, type FaqCategory } from "./faqs";

const ALL_CATEGORY = FAQ_CATEGORIES[0].key;
const CATEGORY_ICONS: Partial<Record<FaqCategory, LucideIcon>> = {
  [ALL_CATEGORY]: ListFilter,
  Kurulum: ClipboardCheck,
  Maliyet: CircleDollarSign,
  Bakım: Wrench,
  Teknik: Settings,
  İzinler: BadgeCheck,
  Garanti: ShieldCheck,
};

function flattenAnswerToText(node: unknown): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(flattenAnswerToText).join(" ");
  if (typeof node === "object" && "props" in (node as { props?: unknown })) {
    const props = (node as { props?: { children?: unknown } }).props;
    return flattenAnswerToText(props?.children);
  }
  return "";
}

export default function SssPageContent() {
  const [activeCategory, setActiveCategory] = useState<FaqCategory>(ALL_CATEGORY);
  const [openId, setOpenId] = useState(FAQS[0]?.id ?? "");
  const [query, setQuery] = useState("");

  const filteredFaqs = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr-TR");
    return FAQS.filter((faq) => {
      const matchesCategory = activeCategory === ALL_CATEGORY || faq.category === activeCategory;
      if (!matchesCategory) return false;
      if (!q) return true;
      const haystack = `${faq.title} ${faq.category} ${flattenAnswerToText(faq.answer)}`.toLocaleLowerCase(
        "tr-TR",
      );
      return haystack.includes(q);
    });
  }, [activeCategory, query]);

  const engineerHref = useMemo(() => {
    const text = "Merhaba, SSS sayfasından mühendise soru sormak istiyorum.";
    return `https://wa.me/903122856667?text=${encodeURIComponent(text)}`;
  }, []);

  return (
    <main className="sss-page app-frame-mobile">
      <div className="sss-page__shell">
        <aside className="sss-page__aside">
          <div className="sss-page__intro">
            <p className="eyebrow">TURUNCU SOLAR SSS</p>
            <h1 className="h-page" id="sss-title">
              {FAQS.length} <em>soru.</em>
            </h1>
            <p className="lead">{FAQ_INTRO_TEXT}</p>
          </div>

          <div className="search" role="search">
            <Search width={14} height={14} aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Soru ara..."
              aria-label="SSS icinde ara"
            />
          </div>

          <nav className="sss-page__cats" aria-label="SSS kategorileri">
            {FAQ_CATEGORIES.map((category) => {
              const CategoryIcon = CATEGORY_ICONS[category.key] ?? HelpCircle;
              const isActive = activeCategory === category.key;
              return (
                <button
                  key={category.key}
                  type="button"
                  className={`chip${isActive ? " is-active" : ""}`}
                  aria-pressed={isActive}
                  onClick={() => {
                    setActiveCategory(category.key);
                    const next = FAQS.find(
                      (faq) => category.key === ALL_CATEGORY || faq.category === category.key,
                    );
                    if (next) setOpenId(next.id);
                  }}
                >
                  <CategoryIcon width={14} height={14} aria-hidden="true" />
                  <span>{category.key}</span>
                  <small>{category.count}</small>
                </button>
              );
            })}
          </nav>

          <a className="btn" href={engineerHref} target="_blank" rel="noreferrer">
            <MessageCircle width={14} height={14} aria-hidden="true" />
            Muhendise sor
          </a>
        </aside>

        <section className="sss-page__main" aria-label="Sık sorulan sorular">
          {filteredFaqs.length === 0 ? (
            <div className="sss-page__empty">
              <p>Aramanla eslesen soru bulunamadi.</p>
              <p>Muhendis ekibe dogrudan ulasabilirsin.</p>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = openId === faq.id;
              const panelId = `sss-answer-${faq.id}`;
              const buttonId = `sss-question-${faq.id}`;

              return (
                <article key={faq.id} className={`acc${isOpen ? " is-open" : ""}`}>
                  <button
                    id={buttonId}
                    type="button"
                    className="acc-h"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenId(isOpen ? "" : faq.id)}
                  >
                    <div className="acc-q">{faq.title}</div>
                    <span className="acc-t" aria-hidden="true">
                      <ChevronDown width={11} height={11} />
                    </span>
                  </button>

                  {isOpen ? (
                    <div id={panelId} className="acc-a" role="region" aria-labelledby={buttonId}>
                      {faq.answer}
                      {faq.tags && faq.tags.length > 0 ? (
                        <div className="tags">
                          {faq.tags.map((tag) => (
                            <span key={tag} className="tag">
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </article>
              );
            })
          )}
        </section>
      </div>
    </main>
  );
}
