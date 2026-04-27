"use client";

/**
 * SistemFarklariMobile — MDS 8.5 (Faz 08).
 * Pill tab + panel + sıkıştırılmış karşılaştırma deseni.
 * Veri: `app/sistemlerimiz/sistemlerimiz-data.tsx` → VERSUS_COLUMNS + VERSUS_ROWS + ICONS.
 * 3 sistem: On-Grid, Hibrit, Off-Grid — 7 karşılaştırma kriteri.
 */

import { useState } from "react";
import Link from "next/link";
import { HelpCircle, ChevronRight, ArrowRight } from "lucide-react";
import {
  TopBar,
  Pill,
  Card,
  ListItem,
  SectionHeader,
} from "@/components/ui/mobile";
import {
  VERSUS_COLUMNS,
  VERSUS_ROWS,
  ICONS,
  type SystemColumnKey,
} from "../../../app/sistemlerimiz/sistemlerimiz-data";

export default function SistemFarklariMobile() {
  const firstCol = VERSUS_COLUMNS[0];
  const [activeKey, setActiveKey] = useState<SystemColumnKey>(firstCol.key);
  const activeCol = VERSUS_COLUMNS.find((c) => c.key === activeKey) ?? firstCol;

  // Aktif sistemin satır değerlerini çek
  const activeRows = VERSUS_ROWS.map((row) => ({
    id: row.id,
    criterion: row.criterion,
    criterionMeta: row.criterionMeta,
    criterionIcon: row.criterionIcon,
    value: row[activeKey],
  }));

  return (
    <>
      <TopBar title="Sistem Farkları" />

      <main className="diff-mobile">
        <section className="diff-mobile__hero">
          <h1 className="diff-mobile__title">Hangi Sistem Size Uygun?</h1>
          <p className="diff-mobile__lead">
            On-grid, hibrit ve off-grid sistemler arasındaki temel farkları kriter kriter
            karşılaştırın — ihtiyacınıza en uygun mimariyi seçin.
          </p>
        </section>

        <div
          className="diff-mobile__tabs"
          role="tablist"
          aria-label="Sistem seçici"
        >
          {VERSUS_COLUMNS.map((col) => (
            <Pill
              key={col.key}
              variant="filter-chip"
              active={activeKey === col.key}
              onClick={() => setActiveKey(col.key)}
            >
              {col.label}
            </Pill>
          ))}
        </div>

        <section
          key={activeCol.key}
          className="diff-mobile__panel"
          aria-labelledby={`diff-${activeCol.key}-title`}
        >
          <div className="diff-mobile__panel-icon" aria-hidden="true">
            {ICONS[activeCol.icon]}
          </div>
          <h2
            id={`diff-${activeCol.key}-title`}
            className="diff-mobile__panel-title"
          >
            {activeCol.label}
          </h2>
          <p className="diff-mobile__panel-detail">{activeCol.detail}</p>

          <Link
            href={`/iletisim?system=${activeCol.key}`}
            className="diff-mobile__panel-cta"
          >
            <span>{activeCol.label} için Teklif Al</span>
            <ArrowRight width={18} height={18} aria-hidden="true" />
          </Link>
        </section>

        <SectionHeader
          overline="Kriterler"
          title="Detaylı Karşılaştırma"
          subtitle={`${activeCol.label} sistemi için tüm kriterler`}
        />

        <div className="diff-mobile__criteria-list">
          {activeRows.map((row) => (
            <Card
              key={row.id}
              variant="flat"
              padding="md"
              className="diff-mobile__criterion-card"
            >
              <div className="diff-mobile__criterion-head">
                <span
                  className="diff-mobile__criterion-icon"
                  aria-hidden="true"
                >
                  {ICONS[row.criterionIcon]}
                </span>
                <div className="diff-mobile__criterion-text">
                  <h3 className="diff-mobile__criterion-title">
                    {row.criterion}
                  </h3>
                  <p className="diff-mobile__criterion-meta">
                    {row.criterionMeta}
                  </p>
                </div>
              </div>
              <div className="diff-mobile__criterion-value">{row.value}</div>
            </Card>
          ))}
        </div>

        <SectionHeader
          overline="Yan Yana"
          title="Tüm Sistemler"
          subtitle="3 sistemin her kriterde karşılaştırılması"
        />

        <div className="diff-mobile__compare">
          {VERSUS_ROWS.map((row) => (
            <Card
              key={row.id}
              variant="flat"
              padding="md"
              className="diff-mobile__compare-row"
            >
              <h4 className="diff-mobile__compare-row-title">{row.criterion}</h4>
              <div className="diff-mobile__compare-cells">
                {VERSUS_COLUMNS.map((col) => {
                  const isActiveCol = col.key === activeKey;
                  return (
                    <div
                      key={col.key}
                      className={`diff-mobile__compare-cell ${isActiveCol ? "is-active" : ""}`}
                    >
                      <span className="diff-mobile__compare-system">
                        {col.label}
                      </span>
                      <span className="diff-mobile__compare-value">
                        {row[col.key]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>

        <Card
          variant="interactive"
          href="/iletisim"
          className="diff-mobile__help-card"
        >
          <ListItem
            leading={<HelpCircle width={20} height={20} aria-hidden="true" />}
            title="Hangisi size uygun?"
            subtitle="Mühendis danışmanlığı — ücretsiz"
            trailing={<ChevronRight width={20} height={20} aria-hidden="true" />}
            divider={false}
          />
        </Card>
      </main>
    </>
  );
}
