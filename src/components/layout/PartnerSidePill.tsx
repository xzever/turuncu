"use client";

import Image from "next/image";
import type { ReactNode } from "react";

type WordItem = { label: string; icon: ReactNode };

const WORDS: WordItem[] = [
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
];

export function PartnerSidePill() {
  return (
    <a
      href="https://renevoenergy.com/"
      target="_blank"
      rel="noreferrer"
      className="partner-side-pill"
      aria-label="İş ortağımız: Renevo Energy"
    >
      <Image
        src="/renevologo.svg"
        alt="Renevo Energy"
        width={332}
        height={78}
        className="partner-side-pill__logo"
      />
      <span className="partner-side-pill__sep" aria-hidden="true" />
      <span className="partner-side-pill__rotator" aria-hidden="true">
        {WORDS.map((item) => (
          <span key={item.label} className="partner-side-pill__word">
            <span className="partner-side-pill__icon">{item.icon}</span>
            <span className="partner-side-pill__label">{item.label}</span>
          </span>
        ))}
      </span>
    </a>
  );
}
