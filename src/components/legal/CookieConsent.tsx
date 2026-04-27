"use client";

/**
 * CookieConsent — KVKK/GDPR uyumlu çerez onay banner'ı.
 * Seçenekler: "Tümünü kabul et" | "Reddet (yalnızca zorunlu)" | "Ayarlar"
 * Karar localStorage'a yazılır (key: turuncu-cookie-consent, v1).
 * Karar verilene kadar non-essential çerez/analytics yüklenmez.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import "./cookie-consent.css";

const STORAGE_KEY = "turuncu-cookie-consent";
const CONSENT_VERSION = 1;

type ConsentState = {
  version: number;
  essential: true; // her zaman açık
  analytics: boolean;
  marketing: boolean;
  decidedAt: string; // ISO
};

function readConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentState;
    if (parsed.version !== CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeConsent(state: Omit<ConsentState, "version" | "essential" | "decidedAt">) {
  const full: ConsentState = {
    version: CONSENT_VERSION,
    essential: true,
    analytics: state.analytics,
    marketing: state.marketing,
    decidedAt: new Date().toISOString(),
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(full));
  // Analytics/marketing entegrasyonu olduğunda buradan tetiklenir.
  window.dispatchEvent(new CustomEvent("cookie-consent-updated", { detail: full }));
}

export default function CookieConsent() {
  const [open, setOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<Element | null>(null);

  useEffect(() => {
    const existing = readConsent();
    if (!existing) setOpen(true);
  }, []);

  // Açılışta focus dialog'a git, kapanışta geri döndür.
  useEffect(() => {
    if (!open) return;
    previousFocusRef.current = document.activeElement;
    const firstBtn = dialogRef.current?.querySelector<HTMLElement>(
      "button, a, input:not([disabled])",
    );
    firstBtn?.focus();
    return () => {
      const prev = previousFocusRef.current as HTMLElement | null;
      if (prev && typeof prev.focus === "function") prev.focus();
    };
  }, [open]);

  // Focus trap + Escape ile kapatma (reddet olarak kaydet).
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        writeConsent({ analytics: false, marketing: false });
        setOpen(false);
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, a, input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const acceptAll = useCallback(() => {
    writeConsent({ analytics: true, marketing: true });
    setOpen(false);
  }, []);

  const rejectAll = useCallback(() => {
    writeConsent({ analytics: false, marketing: false });
    setOpen(false);
  }, []);

  const saveCustom = useCallback(() => {
    writeConsent({ analytics, marketing });
    setOpen(false);
  }, [analytics, marketing]);

  if (!open) return null;

  return (
    <div
      ref={dialogRef}
      className="cookie-consent"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-desc"
    >
      <div className="cookie-consent__inner">
        <div className="cookie-consent__text">
          <h2 id="cookie-consent-title" className="cookie-consent__title">
            Çerezleri kabul ediyor musunuz?
          </h2>
          <p id="cookie-consent-desc" className="cookie-consent__desc">
            Sitemiz, deneyiminizi iyileştirmek ve ziyaret davranışını anlamak
            için çerezler kullanır. Zorunlu çerezler sitenin çalışması için
            gereklidir. Ayrıntılar için{" "}
            <Link href="/gizlilik" className="cookie-consent__link">
              Gizlilik Politikası
            </Link>
            {" ve "}
            <Link href="/kvkk" className="cookie-consent__link">
              KVKK Aydınlatma Metni
            </Link>
            .
          </p>
        </div>

        {showSettings && (
          <div className="cookie-consent__settings" aria-label="Çerez tercihleri">
            <label className="cookie-consent__option">
              <input type="checkbox" checked disabled aria-label="Zorunlu çerezler (her zaman açık)" />
              <span className="cookie-consent__option-text">
                <strong>Zorunlu</strong> — site işleyişi için gerekli (devre dışı bırakılamaz)
              </span>
            </label>
            <label className="cookie-consent__option">
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
                aria-label="Analitik çerezler"
              />
              <span className="cookie-consent__option-text">
                <strong>Analitik</strong> — ziyaretçi davranışı (anonim)
              </span>
            </label>
            <label className="cookie-consent__option">
              <input
                type="checkbox"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
                aria-label="Pazarlama çerezleri"
              />
              <span className="cookie-consent__option-text">
                <strong>Pazarlama</strong> — kişiselleştirilmiş içerik
              </span>
            </label>
          </div>
        )}

        <div className="cookie-consent__actions">
          {showSettings ? (
            <>
              <button
                type="button"
                className="cookie-consent__btn cookie-consent__btn--ghost"
                onClick={() => setShowSettings(false)}
              >
                Geri
              </button>
              <button
                type="button"
                className="cookie-consent__btn cookie-consent__btn--primary"
                onClick={saveCustom}
              >
                Seçimleri Kaydet
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="cookie-consent__btn cookie-consent__btn--ghost"
                onClick={() => setShowSettings(true)}
              >
                Ayarlar
              </button>
              <button
                type="button"
                className="cookie-consent__btn cookie-consent__btn--secondary"
                onClick={rejectAll}
              >
                Reddet
              </button>
              <button
                type="button"
                className="cookie-consent__btn cookie-consent__btn--primary"
                onClick={acceptAll}
              >
                Tümünü Kabul Et
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
