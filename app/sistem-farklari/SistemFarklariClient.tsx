"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type CSSProperties, useCallback, useMemo, useState } from "react";
import OrbitalNav from "@/components/systems/OrbitalNav";
import { buildLocaleAwareHref, resolveLocaleFromPathname } from "@/lib/localePath";
import {
  ICONS,
  VERSUS_CELL_DETAILS,
  VERSUS_COLUMNS,
  VERSUS_ROWS,
  type DioramaSectionId,
  type IconName,
  type SystemColumnKey,
} from "../sistemlerimiz/sistemlerimiz-data";
import "../sistemlerimiz/sistemlerimiz.css";
import "./sistem-farklari.css";

/* OrbitalNav sayfasının alt dock'u: /sistemlerimiz ile aynı 3 sekme.
   Sekmeye tıklanınca o sekmeyi hash ile taşıyarak /sistemlerimiz sayfasına git. */
const SF_SECTION_ORDER: ReadonlyArray<DioramaSectionId> = [
  "grid",
  "hybrid-no-battery",
  "off-grid",
];

const SF_NAV_LABELS: Record<DioramaSectionId, string> = {
  grid: "Grid Sistem",
  "hybrid-no-battery": "Hibrit",
  "hybrid-with-battery": "Hibrit + Batarya",
  "off-grid": "Off-Grid",
};

const ALL_COMPARE_COLUMN_KEYS: ReadonlyArray<SystemColumnKey> = VERSUS_COLUMNS.map((c) => c.key);

function UiIcon({ name }: { name: IconName }) {
  return <span className="sf-icon" aria-hidden="true">{ICONS[name]}</span>;
}

/**
 * Sistem Farkları — bağımsız sayfa.
 * Grid / Hibrit / Off-Grid karşılaştırma tablosu + filtre chip'leri.
 * AGENTS.md: tokenize, min-2 sistem seçili kalır kuralı, beyaz focus ring.
 */
export default function SistemFarklariClient() {
  const pathname = usePathname();
  const router = useRouter();
  const activeLocale = resolveLocaleFromPathname(pathname, "tr");

  const handleSystemTabSelect = useCallback(
    (id: DioramaSectionId) => {
      /* /sistemlerimiz?section=<id> — SistemlerimizClient bunu okuyup ilgili sekmeyi aktif yapar. */
      const href = `${buildLocaleAwareHref("/sistemlerimiz", activeLocale)}?section=${encodeURIComponent(id)}`;
      router.push(href);
    },
    [activeLocale, router],
  );

  const [visibleCompareColumns, setVisibleCompareColumns] =
    useState<ReadonlyArray<SystemColumnKey>>(ALL_COMPARE_COLUMN_KEYS);

  const shownCompareColumns = useMemo(() => {
    const filtered = VERSUS_COLUMNS.filter((column) => visibleCompareColumns.includes(column.key));
    if (filtered.length < 2) {
      return VERSUS_COLUMNS;
    }
    return filtered;
  }, [visibleCompareColumns]);

  const handleCompareColumnToggle = useCallback((key: SystemColumnKey) => {
    setVisibleCompareColumns((prev) => {
      if (prev.includes(key)) {
        if (prev.length <= 2) {
          return prev;
        }
        return prev.filter((item) => item !== key);
      }
      return [...prev, key];
    });
  }, []);

  return (
    <main className="sf-page">
      <section className="sf-section">
        <header className="sf-head">
          <span className="sf-eyebrow">
            <UiIcon name="versus" />
            <span>Sistemler Arasındaki Farklar</span>
          </span>
          <h1 className="sf-title">
            <UiIcon name="versus" />
            <span>Grid vs Hibrit vs Off-Grid</span>
          </h1>
          <p className="sf-sub">
            Tek bakışta yatırım seviyesi, bağımsızlık, kesinti dayanımı ve kullanım senaryosu karşılaştırması.
          </p>
        </header>

        <div className="sf-filters" role="group" aria-label="Karşılaştırılacak sistemleri seçin">
          {VERSUS_COLUMNS.map((column) => {
            const isSelected = shownCompareColumns.some((item) => item.key === column.key);
            return (
              <button
                key={column.key}
                type="button"
                className={`sf-filter ${isSelected ? "is-active" : "is-inactive"}`.trim()}
                data-column={column.key}
                onClick={() => handleCompareColumnToggle(column.key)}
                aria-pressed={isSelected}
              >
                <UiIcon name={column.icon} />
                <span>{column.label}</span>
                <span className="sf-filter-mark" aria-hidden="true">
                  {isSelected ? "✓" : "○"}
                </span>
              </button>
            );
          })}
        </div>

        <p className="sf-hint">Kıyaslama için en az 2 sistem seçili kalır.</p>

        <div
          className="sf-table"
          role="table"
          aria-label="Sistem karşılaştırma tablosu"
          style={{ "--compare-cols": `${shownCompareColumns.length}` } as CSSProperties}
        >
          <div className="sf-row sf-row--head" role="row">
            <div role="columnheader" className="sf-head-cell sf-head-cell--criterion">
              <UiIcon name="versus" />
              <span>Kriter</span>
            </div>
            {shownCompareColumns.map((column) => (
              <div
                key={column.key}
                role="columnheader"
                className={`sf-head-cell sf-head-cell--${column.key}`}
              >
                <UiIcon name={column.icon} />
                <div>
                  <strong>{column.label}</strong>
                  <small>{column.detail}</small>
                </div>
              </div>
            ))}
          </div>

          {VERSUS_ROWS.map((row, index) => (
            <div
              key={row.criterion}
              className="sf-row"
              role="row"
              style={{ "--delay": `${index * 80}ms` } as CSSProperties}
            >
              <div role="cell" className="sf-criterion">
                <UiIcon name={row.criterionIcon} />
                <div>
                  <strong>{row.criterion}</strong>
                  <small>{row.criterionMeta}</small>
                </div>
              </div>
              {shownCompareColumns.map((column) => (
                <div
                  key={column.key}
                  role="cell"
                  className={`sf-cell sf-cell--${column.key}`}
                  data-column-label={column.label}
                >
                  <div className="sf-cell-value">
                    <UiIcon name={column.icon} />
                    <strong>{row[column.key]}</strong>
                  </div>
                  <small>{VERSUS_CELL_DETAILS[row.criterion]?.[column.key]}</small>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/*
        OrbitalNav — /sistemlerimiz ile aynı alt dock. 3 sistem tab'ı tıklanınca
        /sistemlerimiz'e yönlenir (section=<id>). Trailing "Sistem Farkları" linki
        bu sayfada is-active durumunda (kendi sayfamız).
      */}
      <OrbitalNav
        activeSection={"__sistem-farklari__" as DioramaSectionId}
        onSelect={handleSystemTabSelect}
        sectionOrder={SF_SECTION_ORDER}
        labels={SF_NAV_LABELS}
        trailing={
          <Link
            href={buildLocaleAwareHref("/sistem-farklari", activeLocale)}
            className="systems-tab systems-tab--link is-active"
            data-system-id="sistem-farklari"
            aria-current="page"
          >
            <span className="systems-tab__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                <path d="M8.5 5 4 12l4.5 7M15.5 5 20 12l-4.5 7" />
                <path d="M9.5 10h5M9.5 14h5" />
              </svg>
            </span>
            <span>Sistem Farkları</span>
          </Link>
        }
      />
    </main>
  );
}
