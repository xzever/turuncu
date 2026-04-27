"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { FAQS, FAQ_CATEGORIES, FAQ_INTRO_TEXT, type FaqCategory } from "./faqs";

const ALL_CATEGORY = FAQ_CATEGORIES[0].key;

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

type FaqSurfaceProps = {
  activeCategory: FaqCategory;
  query: string;
  openId: string;
  filteredFaqs: typeof FAQS;
  onCategoryChange: (category: FaqCategory) => void;
  onQueryChange: (value: string) => void;
  onToggle: (id: string) => void;
};

function AccordionList({ filteredFaqs, openId, onToggle }: Pick<FaqSurfaceProps, "filteredFaqs" | "openId" | "onToggle">) {
  if (filteredFaqs.length === 0) {
    return (
      <div className="sss-empty" role="status">
        Aramanla eslesen soru bulunamadi.
      </div>
    );
  }

  return filteredFaqs.map((faq) => {
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
          onClick={() => onToggle(faq.id)}
        >
          <span className="acc-q">{faq.title}</span>
          <span className="acc-t" aria-hidden="true">
            <ChevronDown />
          </span>
        </button>

        {isOpen ? (
          <div id={panelId} className="acc-a" role="region" aria-labelledby={buttonId}>
            {faq.answer}
          </div>
        ) : null}
      </article>
    );
  });
}

function CategoryChips({ activeCategory, onCategoryChange }: Pick<FaqSurfaceProps, "activeCategory" | "onCategoryChange">) {
  return (
    <>
      {FAQ_CATEGORIES.map((category) => {
        const isActive = activeCategory === category.key;
        return (
          <button
            key={category.key}
            type="button"
            className={`chip${isActive ? " is-active" : ""}`}
            aria-pressed={isActive}
            onClick={() => onCategoryChange(category.key)}
          >
            <span>{category.key}</span>
            <small>{category.count}</small>
          </button>
        );
      })}
    </>
  );
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

  function handleCategoryChange(category: FaqCategory) {
    setActiveCategory(category);
    const next = FAQS.find((faq) => category === ALL_CATEGORY || faq.category === category);
    if (next) setOpenId(next.id);
  }

  function handleToggle(id: string) {
    setOpenId((current) => (current === id ? "" : id));
  }

  return (
    <>
      <main className="sss-mobile-page" aria-labelledby="sss-mobile-title">
        <section className="sss-mobile-page__hero">
          <h1 className="h-page" id="sss-mobile-title">
            {FAQS.length} <em>soru.</em>
          </h1>
          <p className="lead">{FAQ_INTRO_TEXT}</p>
        </section>

        <div className="search" role="search">
          <Search aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Soru ara..."
            aria-label="SSS icinde ara"
          />
        </div>

        <nav className="chips" aria-label="SSS kategorileri">
          <CategoryChips activeCategory={activeCategory} onCategoryChange={handleCategoryChange} />
        </nav>

        <section className="sss-mobile-page__list" aria-label="Sik sorulan sorular">
          <AccordionList filteredFaqs={filteredFaqs} openId={openId} onToggle={handleToggle} />
        </section>
      </main>

      <main className="sss-desktop" aria-labelledby="sss-desktop-title">
        <section className="sss-desktop__hero">
          <h1 className="h-page" id="sss-desktop-title">
            {FAQS.length} <em>soru.</em>
          </h1>
          <p className="lead">{FAQ_INTRO_TEXT}</p>
        </section>

        <section className="lay-side" aria-label="SSS filtreleri ve cevaplar">
          <aside className="sss-desktop__aside">
            <div className="search" role="search">
              <Search aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Soru ara..."
                aria-label="SSS icinde ara"
              />
            </div>

            <nav className="sss-desktop__chips" aria-label="SSS kategorileri">
              <CategoryChips activeCategory={activeCategory} onCategoryChange={handleCategoryChange} />
            </nav>
          </aside>

          <section className="sss-desktop__main" aria-label="Sik sorulan sorular">
            <AccordionList filteredFaqs={filteredFaqs} openId={openId} onToggle={handleToggle} />
          </section>
        </section>
      </main>
    </>
  );
}
