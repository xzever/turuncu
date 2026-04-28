"use client";

import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FAQS, FAQ_CATEGORIES, FAQ_INTRO_TEXT, type FaqCategory } from "./faqs";

const ALL_CATEGORY = FAQ_CATEGORIES[0].key;
const CONCEPT_CATEGORIES = [
  { key: "Tümü", label: "Tümü", matches: [ALL_CATEGORY] },
  { key: "Süreç", label: "Süreç", matches: ["Kurulum", "Teknik", "İzinler", "Ä°zinler"] },
  { key: "Garanti", label: "Garanti", matches: ["Garanti"] },
  { key: "Finansman", label: "Finansman", matches: ["Maliyet"] },
  { key: "Bakım", label: "Bakım", matches: ["BakÄ±m", "Bakım"] },
] as const;

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
  activeCategory: string;
  openId: string;
  filteredFaqs: typeof FAQS;
  onCategoryChange: (category: string) => void;
  onOpenChange: (id: string) => void;
};

function AccordionList({ filteredFaqs, openId, onOpenChange }: Pick<FaqSurfaceProps, "filteredFaqs" | "openId" | "onOpenChange">) {
  if (filteredFaqs.length === 0) {
    return (
      <div className="sss-empty" role="status">
        Aramanla eslesen soru bulunamadi.
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible value={openId} onValueChange={onOpenChange} className="sss-accordion">
      {filteredFaqs.map((faq) => (
        <AccordionItem key={faq.id} value={faq.id} className="acc">
          <AccordionTrigger className="acc-h">
            <span className="acc-num">{faq.num}</span>
            <span className="acc-q">{faq.title}</span>
            <Badge variant="outline" className="acc-cat">{faq.category}</Badge>
            <span className="acc-plus" aria-hidden="true"><Plus /></span>
          </AccordionTrigger>
          <AccordionContent className="acc-a">{faq.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

function CategoryChips({ activeCategory, onCategoryChange }: Pick<FaqSurfaceProps, "activeCategory" | "onCategoryChange">) {
  return (
    <Tabs value={activeCategory} onValueChange={(value) => onCategoryChange(value as FaqCategory)} className="sss-tabs">
      <TabsList className="chips" aria-label="SSS kategorileri">
        {CONCEPT_CATEGORIES.map((category) => {
          const isActive = activeCategory === category.key;
          const count = category.key === "Tümü"
            ? 42
            : FAQS.filter((faq) => category.matches.includes(faq.category as never)).length;
          return (
            <TabsTrigger key={category.key} value={category.key} className={`chip${isActive ? " is-active" : ""}`}>
              <span>{category.label}</span>
              <small>{count}</small>
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
}

export default function SssPageContent() {
  const [activeCategory, setActiveCategory] = useState<string>("Tümü");
  const [openId, setOpenId] = useState(FAQS[0]?.id ?? "");
  const [query, setQuery] = useState("");

  const filteredFaqs = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr-TR");
    return FAQS.filter((faq) => {
      const conceptCategory = CONCEPT_CATEGORIES.find((item) => item.key === activeCategory);
      const matchesConceptCategory =
        !conceptCategory || conceptCategory.key === "Tümü" || conceptCategory.matches.includes(faq.category as never);
      if (!matchesConceptCategory) return false;
      if (!q) return true;
      const haystack = `${faq.title} ${faq.category} ${flattenAnswerToText(faq.answer)}`.toLocaleLowerCase(
        "tr-TR",
      );
      return haystack.includes(q);
    });
  }, [activeCategory, query]);

  function handleCategoryChange(category: string) {
    setActiveCategory(category);
    const conceptCategory = CONCEPT_CATEGORIES.find((item) => item.key === category);
    const next = FAQS.find((faq) => !conceptCategory || conceptCategory.key === "Tümü" || conceptCategory.matches.includes(faq.category as never));
    if (next) setOpenId(next.id);
  }

  return (
    <>
      <main className="sss-mobile-page" aria-labelledby="sss-mobile-title">
        <section className="sss-mobile-page__hero">
          <h1 className="h-page" id="sss-mobile-title">
            42 <em>soru.</em>
          </h1>
          <p className="lead">{FAQ_INTRO_TEXT}</p>
        </section>

        <div className="search" role="search">
          <Search aria-hidden="true" />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Soru ara..."
            aria-label="SSS icinde ara"
          />
        </div>

        <nav className="sss-mobile-page__chips" aria-label="SSS kategorileri">
          <CategoryChips activeCategory={activeCategory} onCategoryChange={handleCategoryChange} />
        </nav>

        <section className="sss-mobile-page__list" aria-label="Sik sorulan sorular">
          <AccordionList filteredFaqs={filteredFaqs} openId={openId} onOpenChange={setOpenId} />
        </section>
      </main>

      <main className="sss-desktop" aria-labelledby="sss-desktop-title">
        <section className="sss-desktop__hero">
          <h1 className="h-page" id="sss-desktop-title">
            42 <em>soru.</em>
          </h1>
          <p className="lead">{FAQ_INTRO_TEXT}</p>
        </section>

        <section className="lay-side" aria-label="SSS filtreleri ve cevaplar">
          <aside className="sss-desktop__aside">
            <div className="search" role="search">
              <Search aria-hidden="true" />
              <Input
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
            <AccordionList filteredFaqs={filteredFaqs} openId={openId} onOpenChange={setOpenId} />
          </section>
        </section>
      </main>
    </>
  );
}
