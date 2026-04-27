# Turuncu Solar — Tam UI Kit (mevcut implementasyon, A → Z)

Bu dosya kodda **şu an gerçekten uygulanan** tasarımı uçtan uca belgeler. Renk, tipografi, ölçüler, bileşenler, sayfa yapıları, davranışlar ve responsive eşikler — hepsi mevcut CSS / TSX dosyalarından çıkarıldı.

İlgili kaynaklar:
- Tokenlar: `src/styles/tokens/*.css`
- Component CSS: `src/styles/components/*`
- Sayfa CSS: `app/*/...css`
- Layout component: `src/components/layout/*`
- Sayfa component: `src/components/iletisim/*`, `src/components/sss/*`

---

## A. RENKLER (palette)

### A.1 Primary (turuncu)
| Token | Değer | Kullanım |
|---|---|---|
| `--color-primary` | `#ff6a00` | Marka turuncusu (CTA, focus, ikon) |
| `--color-primary-hover` | `#ff8533` | Hover / accent |
| `--color-primary-soft` | `rgba(255,106,0,0.16)` | Ghost pill, ikon chip, açık accordion |
| `--color-primary-softer` | `rgba(255,106,0,0.08)` | Secondary hover |

### A.2 Sıcak sahne (warm radial — TURUNCU dili)
| Anahtar | HEX | Rol |
|---|---|---|
| Glow | `#FFD2A0` | em italic vurgu, ikon glow, küçük caps eyebrow |
| Warm | `#FFA060` | Sahne dış halkası |
| Bright | `#FF8C3A` | Sahne merkez parlaklık |
| Base | `#D4621A` / `#C25218` | Sahne mid |
| Deep | `#B83A0E` / `#2A1008` | Sahne kenar |

**SSS / iletişim mobile body radial:**
```
radial-gradient(ellipse at 50% 25%, #FFB060 0%, #FF8C3A 30%, #C25218 65%, #2A1008 100%)
```
`background-attachment: fixed` zorunlu.

### A.3 Kinetic (dark fallback / desktop iletişim base)
| Token | Değer |
|---|---|
| `--color-kinetic-bg` | `#1A1C1E` |
| `--color-kinetic-bg-solid` | `#000000` |
| `--color-kinetic-surface` | `#2A2D31` |
| `--color-kinetic-surface-high` | (mid surface) |
| `--color-kinetic-text` | `#F4F4F6` |
| `--color-kinetic-text-muted` | rgba(244,244,246,0.62) |
| `--color-kinetic-text-dim` | rgba(244,244,246,0.40) |
| `--color-kinetic-border-soft` | rgba(255,255,255,0.10) |

### A.4 Glass yüzey katmanları (sıcak sahne üstünde)
| Katman | Değer |
|---|---|
| Glass-soft | `rgba(0,0,0,0.20)` |
| Glass-base | `rgba(0,0,0,0.28)` |
| Glass-mid | `rgba(0,0,0,0.30)` |
| Glass-strong | `rgba(0,0,0,0.34)` – `0.36` |
| Glass-deep | `rgba(15,8,5,0.78)` – `0.92` (bottom dock, modal) |
| Hairline | `rgba(255,255,255,0.06–0.10)` |
| Soft border | `rgba(255,255,255,0.12–0.14)` |

### A.5 Metin
| Rol | Değer |
|---|---|
| Ink (birincil) | `#fff` veya `#FFF8F0` |
| Muted | `rgba(255,248,240,0.78)` veya `rgba(255,255,255,0.70)` |
| Dim | `rgba(255,255,255,0.55)` |
| Hint | `rgba(255,255,255,0.30–0.40)` (placeholder) |
| Glow vurgu | `#FFD2A0` (em, eyebrow, label caps) |

---

## B. TİPOGRAFİ

Base aile: `"Manrope", "Inter", system-ui, sans-serif`. Mono (kodlar için): JetBrains Mono.

| Token / Rol | Mobil | Tablet/Desktop | Weight | Letter-spacing |
|---|---|---|---|---|
| Hero title (`h-page`) | 32px | clamp(36px, 4vw, 60px) | 800 | -0.025em / -0.03em |
| Hero em vurgu | (aynı boyut, italic, `#FFD2A0`) | aynı | 800 | aynı |
| Hero lead | 13–14px | 14px | 500 | -0.005em |
| Card title (`h-detail`) | 18px | 22–24px | 700 | -0.02em |
| Body | 13–14px | 14–15px | 500–600 | -0.005em |
| Eyebrow / caps | 9–11px | 10–11px | 600–700 | 0.14–0.18em + UPPERCASE |
| Form label | 10–11px | 11px | 700 | 0.14em + UPPERCASE |
| Submit / pill text | 14px | 14px | 700 | -0.005em |
| Tag chip | 10–11px | — | 600 | -0.005em |

Line-height: hero 1.0–1.05, body 1.5–1.6, başlıklar 1.1–1.15.

---

## C. SPACING (mevcut --space-* token'ları)

`--space-1` 4px, `--space-2` 8px, `--space-3` 12px, `--space-4` 16px, `--space-5` 20px, `--space-6` 24px, `--space-8` 32px, `--space-10` 40px, `--space-12` 48px, `--space-16` 64px, `--space-20` 80px, `--space-24` 96px.

---

## D. RADIUS

| Boyut | Değer | Kullanım |
|---|---|---|
| 8 | `--radius-md` | Hours mini kart, hata kutusu |
| 10–12 | `--radius-lg` | İkon kutusu, küçük chip kart |
| 14 | (inline) | Search input, info satır |
| 16–18 | (inline) | Glass kart (info, form, accordion item) |
| 20–22 | (inline) | Form-wrap kabuk, hero tag |
| 999 | `--radius-full` | Pill, segment, chip, top bar, bottom dock cell, CTA submit, ikon yuvarlak |

---

## E. SHADOWS (mevcut)

| Rol | Değer |
|---|---|
| Soft glass card | `0 20px 40px -20px rgba(0,0,0,0.40)` |
| Strong card | `0 24px 48px -16px rgba(0,0,0,0.45–0.60)` |
| Bottom dock | `0 -8px 24px rgba(0,0,0,0.40)` |
| Submit pill | `0 8px 20px rgba(0,0,0,0.25–0.30)` |
| FAB | `0 4px 14px rgba(0,0,0,0.25)` |

---

## F. BREAKPOINT'LER

```
≤ 379    çok dar telefon (sıkıştırma)
≤ 480    telefon
480–767  geniş telefon
768–1023 tablet portrait
1024–1279 tablet landscape / küçük desktop
≥ 1280   masaüstü (header-wide, dock gizlenir)
```

`@media (hover: hover) and (pointer: fine)` — gerçek mouse kontrolü.
`@media (prefers-reduced-motion: reduce)` — animasyon kapama.

---

## G. NAVİGASYON

### G.1 Mobile Topbar — Floating Pill
**Component:** `src/components/layout/MobileTopbar.tsx`
**CSS:** `src/components/layout/mobile-topbar.css`

```
position: fixed; top: 0; left: 0; right: 0;
padding-top: safe-area-top + 14px;
padding-x: 14px;
z-index: var(--z-nav, 50);
background: transparent;
```

Asıl pill (`.mobile-topbar__row`):
```
display: flex; align-items: center; gap: 8px;
padding: 6px 8px 6px 10px;
background: rgba(0,0,0,0.32);
backdrop-filter: blur(20px) saturate(150%);
border: 1px solid rgba(255,255,255,0.12);
border-radius: 999px;
box-shadow: 0 8px 24px rgba(0,0,0,0.25);
```

İçerik:
- **Sol:** brand (R logo, 32×32 transparent çerçeve, beyaz svg)
- **Sağ (actions):** dil ikonu (32×32 transparent), hamburger ikonu (32×32 transparent). Active state'te `rgba(255,255,255,0.10)` yuvarlak vurgu.

### G.2 Hamburger Menü — Compact List
**Açılış davranışı:** body scroll-lock, panel `position: fixed; inset: 0`, animasyonla fade-up.

Overlay (`.mobile-topbar__panel--menu`):
```
background: #0A0604; (TAM SOLID)
z-index: 9999;
padding-top: safe-top + 16px;
padding-x: 14px;
overflow-y: auto;
```

İç yüzey (`.mobile-topbar__menu-surface`): solid `#0A0604`, padding 0, border yok, border-radius 0.

Header (`.mobile-topbar__menu-head`):
- **Sol:** sadece logo (R, 28×28 yuvarlak transparent rozet)
- **Sağ:** dil segment pill (TR/EN, 30px min-w, beyaz aktif siyah text) + X kapat (28×28 yuvarlak transparent border)
- "Mobil Menu" başlığı / "TURUNCU SOLAR" eyebrow **yok** (kaldırıldı)

Nav listesi (`.mobile-topbar__panel-link`):
```
min-height: 48px;
padding: 12px;
margin: 0 -12px;
border-radius: 12px;
background: transparent;
gap: 12px;
font-size: 14px; font-weight: 600;
border: yok; hairline yok.
```

Mini ikon (`.mobile-topbar__panel-icon`):
```
28×28; border-radius: 9px;
background: rgba(255,255,255,0.08);
border: yok;
svg 14×14 stroke 2 white.
```

Aktif sekme:
```
background: rgba(255,210,160,0.10);  /* glow vurgu */
border-radius: 12px;
icon background: rgba(255,210,160,0.18); icon color: #FFD2A0
```

Diğer Markalar (`.mobile-topbar__partners`):
- Üst hairline yok, doğal boşluk.
- Label: 9px UPPERCASE / rgba 0.50 / 0.18em.
- Renevo kartı: 56px min-h, 12px radius, `rgba(255,255,255,0.06)` glass, border yok, 36×36 logo kutusu (rgba 0.10 bg, border yok), text + ↗ icon.

**Menüde gösterilen sayfalar:** Ana Sayfa, Kurumsal, Sistemlerimiz, Hesapla, Referanslar, Blog, SSS, İletişim — `headerConfig.tsx` içinde `showInMobileSheet: true` ile flag'lenmiş.

### G.3 Bottom Dock — Edge-to-edge Glass
**Component:** `src/components/layout/BottomNav.tsx`
**CSS:** `src/styles/components/bottom-nav.css`

```
.handheld-dock {
  position: fixed; left/right: 0; bottom: 0;
  z-index: var(--z-nav, 50);
  display: flex; padding: 0;
  background: transparent;
}
.handheld-dock__blob {
  display: grid; grid-template-columns: repeat(4, minmax(0,1fr));
  width: 100%;
  min-height: calc(64px + safe-area-bottom);
  padding: 8px max(12px, safe-x) calc(safe-bottom + 8px) max(12px, safe-x);
  background: rgba(15,8,5,0.78);
  backdrop-filter: blur(28px) saturate(160%);
  border-top: 1px solid rgba(255,255,255,0.10);
  box-shadow: 0 -8px 24px rgba(0,0,0,0.40);
  border-radius: 0;
}
```

Cell'ler: 4 nav (anasayfa / referanslar / hesapla-FAB / iletisim). Min 44×44 dokunma.

Aktif gösterge:
- Background YOK
- Bottom 4px → `5×5 #FFD2A0 nokta` + `0 0 10px rgba(255,210,160,0.55)` glow halo

FAB cell (hesapla):
```
icon-slot: 36×36; border-radius: 50%;
background: #fff; border: 1px solid rgba(255,255,255,0.20);
box-shadow: 0 4px 14px rgba(0,0,0,0.25);
icon color: #1A0907.
```

Label görünmez (`clip-path: inset(50%)`) — sadece ekran okuyucu için.

Desktop ≥1280px + hover/fine pointer: `display: none` (gizlenir).

---

## H. HERO BLOĞU

```
.h-page {
  font-size: clamp(32px, 4vw, 60px);
  font-weight: 800;
  letter-spacing: -0.025em;
  line-height: 1.05;
  color: #fff;
}
.h-page em { font-style: italic; color: #FFD2A0; font-weight: 800; }

.lead {
  font-size: 13–14px;
  color: rgba(255,248,240,0.78);
  line-height: 1.55;
}
.lead strong { color: #fff; font-weight: 600; }
```

Eyebrow rozet (opsiyonel — şu an iletişim'de YOK):
```
display: inline-flex; padding: 6px 14px;
background: rgba(0,0,0,0.30); blur 12px;
border: 1px solid rgba(255,255,255,0.15);
border-radius: 999px;
color: #FFD2A0;
font-size: 11px; letter-spacing: 0.18em; weight 600; UPPERCASE.
```

---

## I. SEARCH

```
.search { position: relative; }
.search input {
  width: 100%;
  background: rgba(0,0,0,0.30);
  backdrop-filter: blur(18px);
  border: yok;
  border-radius: 14px;
  padding: 13px 16px 13px 42px;
  font-size: 14px; color: #fff; outline: none;
}
.search input::placeholder { color: rgba(255,255,255,0.40); }
.search > svg {
  position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
  width: 16×16; color: rgba(255,255,255,0.55);
}
.search input:focus {
  border: 1px solid rgba(255,210,160,0.50);
  box-shadow: 0 0 0 3px rgba(255,210,160,0.15);
}
```

---

## J. CHIPS (kategori filtresi)

```
.chips { display: flex; gap: 6px; overflow-x: auto;
         margin: 0 -16px; padding: 0 16px 4px;
         scroll-snap-type: x proximity; }

.chip {
  min-height: 36px; padding: 8px 14px;
  background: rgba(0,0,0,0.28);
  backdrop-filter: blur(12px);
  border: yok;
  border-radius: 999px;
  color: #fff;
  font-size: 12px; font-weight: 600;
  white-space: nowrap;
  display: inline-flex; align-items: center; gap: 6px;
}
.chip small {
  font-size: 11px; font-weight: 500;
  color: rgba(255,255,255,0.40);
  margin-left: 2px; background: transparent;
}
.chip.is-active {
  background: #fff; color: #1A0907;
}
.chip.is-active small { color: rgba(26,9,7,0.45); }
```

---

## K. SEGMENT (Şube switch)

```
.seg {
  display: flex; padding: 5px;
  background: rgba(0,0,0,0.28);
  backdrop-filter: blur(18px);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 999px;
}
.seg button {
  flex: 1; min-height: 38px;
  padding: 8–10px 14–18px;
  background: transparent; border: yok;
  color: rgba(255,255,255,0.65–0.70);
  font-size: 12–13px; font-weight: 700;
  letter-spacing: 0.02–0.08em; UPPERCASE.
  border-radius: 999px;
}
.seg button.is-active { background: #fff; color: #1A0907; }
```

---

## L. RAIL (form bileşeni — iOS Settings tarzı)

Mevcut implementasyonda bu blok **iletişim mobile** için mevcut, sınıf adları `.iletisim-m__rail-*` BEM modifier'ı ile (UI-Kit'in standart `.rail` token'ı yerine).

```
.rail-head {
  font-size: 11px;
  color: #fff;  /* (UI-Kit: rgba(255,255,255,0.55) — burada beyaz override) */
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-weight: 700;
  padding: 14px 4px 6px;
}

.rail {
  background: rgba(255,255,255,0.06);
  backdrop-filter: blur(20px) saturate(140%);
  border: 1px solid rgba(255,255,255,0.10);
  border-radius: 18px;
  overflow: hidden;
}

.rail-row {
  display: grid;
  grid-template-columns: 28px 88px 1fr;
  align-items: center; gap: 12px;
  padding: 14px 16px;
  border-top: 1px solid rgba(255,255,255,0.08);
  min-height: 56px;
}
.rail-row:first-child { border-top: none; }

.rail-row.--textarea { align-items: start; min-height: 100px; }

.rail-ic {
  width: 28px; height: 28px; border-radius: 9px;
  background: rgba(255,255,255,0.10);
  color: #fff;
  svg 14×14 stroke 2.
}

.rail-lbl {
  font-size: 12px; color: #fff; font-weight: 600;
  letter-spacing: -0.005em; text-transform: none;
}

.rail-val { min-width: 0; }
.rail-val input, .rail-val textarea {
  width: 100%; background: transparent;
  border: yok; outline: yok;
  color: #fff;
  font-size: 16px; font-weight: 500;  /* iOS zoom-prevention */
  padding: 0; min-height: 24px;
}
.rail-val textarea { min-height: 72px; line-height: 1.55; resize: none; }
.rail-val input::placeholder { color: rgba(255,255,255,0.30); }
```

**Form sırası (iletişim mobile mevcut):**
1. Başvuru tipi (Şahıs / Firma toggle — `.iletisim-m__type-pill`)
2. Bilgileriniz rail: (Firma — sadece firma seçiliyse) → Ad Soyad → E-Posta → Telefon
3. Mesajınız rail: Mesaj (textarea)
4. KVKK consent
5. Beyaz solid Gönder pill

---

## M. ACCORDION

Mevcut SSS mobile (`SssMobile.tsx` + `sss-mobile.css`):

```
.sss-mobile__list { display: flex; flex-direction: column; gap: 0; }

.sss-mobile__item {
  background: rgba(0,0,0,0.20);
  border: yok;
  border-radius: 14px;
  padding: 0 14px;
  margin: 0 0 8px;
}
.sss-mobile__item.is-open { background: rgba(0,0,0,0.32); }

.sss-mobile__question {
  width: 100%; padding: 14px 0;
  display: flex; align-items: center; justify-content: space-between;
  background: transparent; border: yok;
  color: #fff; text-align: left; cursor: pointer;
}

.sss-mobile__question strong {
  font-size: 13px; font-weight: 600; line-height: 1.4;
  letter-spacing: -0.005em; color: #fff;
}

.sss-mobile__chevron {
  width: 22px; height: 22px; border-radius: 50%;
  background: rgba(255,255,255,0.12);
  border: yok;
  color: #fff;
  svg 10×10 stroke 2.4.
}
.sss-mobile__item.is-open .sss-mobile__chevron {
  background: rgba(255,255,255,0.22);
  transform: rotate(180deg);
}

.sss-mobile__answer {
  font-size: 12px; line-height: 1.55;
  color: rgba(255,255,255,0.70);
  padding: 0 0 14px;
}
.sss-mobile__answer strong { color: #fff; font-weight: 600; }
.sss-mobile__answer em { color: #FFD2A0; font-style: italic; }
```

**Davranış:**
- Tek seferde tek accordion açık.
- Search yazılırken real-time filter.
- Chip + search AND mantığı.

**Tag chips (cevap altı):**
```
display: inline-flex; padding: 5px 10px;
background: rgba(255,255,255,0.10);
border: yok;
border-radius: 999px;
color: #FFD2A0;
font-size: 10–11px; weight 600.
```

---

## N. INFO KARTI (iletişim sol panel)

`.cd-branch-card` (desktop) + `.iletisim-m__info-grid` (mobile):

```
background: rgba(0,0,0,0.32);
backdrop-filter: blur(20px) saturate(150%);
border: 1px solid rgba(255,255,255,0.12);
border-radius: 18px;
padding: clamp(16px, 1.6vh, 22px);
box-shadow: 0 20px 40px -20px rgba(0,0,0,0.40);
```

Header:
- Şube adı (h2): clamp(18px, 1.6vw, 22px) / 700 / -0.02em / `#fff`
- MERKEZ badge: `rgba(255,210,160,0.16)` bg + `rgba(255,210,160,0.32)` border + `#FFD2A0` text + 999px / 4-10 padding / 10px caps 0.16em.

Info satırı (`.cd-info-row`):
```
display: grid; grid-template-columns: 32px 1fr; gap: 12px;
padding: 10px 0;
border-top: 1px solid rgba(255,255,255,0.06);
```

İkon (`.cd-info-icon`):
```
32×32; border-radius: 9px;
background: rgba(255,210,160,0.14);
border: 1px solid rgba(255,210,160,0.22);
color: #FFD2A0;
svg stroke #FFD2A0.
```

Label / value:
- `.cd-info-label`: 10–11px / 700 / 0.14em / UPPERCASE / rgba 0.60.
- `.cd-info-value`: 13–15px / 600 / `#fff` / line-height 1.4.

Çalışma saatleri grid:
```
display: grid; grid-template-columns: 1fr 1fr; gap: 6px;
```
Hücre (`.cd-hours-row`):
```
background: rgba(255,255,255,0.06);
border: 1px solid rgba(255,255,255,0.10);
border-radius: 8–10px; padding: 7–8px 10–12px;
```
Gün adı: 9–11px / rgba 0.55 / 0.12em UPPERCASE / 700.
Saat: 12–13px / `#fff` / 700.
Kapalı state: saat rgba(255,255,255,0.45).

---

## O. CTA / SUBMIT BUTONU

Beyaz solid pill (en yüksek vurgu):
```
display: inline-flex; align-items: center; justify-content: center; gap: 8px;
width: 100%;  /* form submit için */
min-height: 50–52px;
padding: 14px 22px;
background: #fff;
color: #1A0907;
border: yok;
border-radius: 999px;
font-size: 13–14px; font-weight: 700; letter-spacing: -0.005em;
box-shadow: 0 8px 20–24px rgba(0,0,0,0.25–0.30);
```

Disabled: `opacity: 0.55; cursor: not-allowed`.
Hover (fine pointer): `opacity: 0.92`.

---

## P. HARİTA (`.cd-map`)

```
border-radius: 16–18px;
border: 1px solid rgba(255,255,255,0.12);
background: rgba(0,0,0,0.28–0.30);
overflow: hidden; position: relative;
height: clamp(140–180px, 18vh, 220–280px);
box-shadow: 0 16–30px 32–50px -15–20px rgba(0,0,0,0.40–0.45);
```

iframe filter: `grayscale(0.5–0.6) brightness(0.7–0.78) contrast(0.95) saturate(0.85)`.

Map butonları (`.cd-map__btn`):
```
background: rgba(255,255,255,0.10) veya rgba(0,0,0,0.42);
border: 1px solid rgba(255,255,255,0.16–0.18);
color: #fff;
padding: 5–6px 10–12px;
border-radius: 999px;
font-size: 11px; weight 600.
backdrop-filter: blur(18px).
```

---

## Q. KVKK / CONSENT

```
display: flex; align-items: flex-start; gap: 10px;
font-size: 11–12px;
color: rgba(255,255,255,0.65–0.78);
line-height: 1.5;
```

Checkbox: `accent-color: #FF8533`, 14×14.
Link: `color: #FFD2A0; text-decoration: underline; font-weight: 600`.

---

## R. HATA / SUCCESS MESAJI

```
.cd-form-feedback (error) {
  background: rgba(239,68,68,0.12–0.14);
  border: 1px solid rgba(239,68,68,0.40);
  color: #FCA5A5;
  border-radius: 10–14px; padding: 8–12px;
  font-size: 12–13px;
}
.cd-form-feedback--success {
  background: rgba(34,197,94,0.14);
  border-color: rgba(34,197,94,0.40);
  color: #86efac;
}
```

---

## S. SAYFA YAPILARI

### S.1 SSS Mobile (`/sss` ≤1279px)
**Dosyalar:** `src/components/sss/SssMobile.tsx`, `app/sss/sss-mobile.css`
**Akış:**
1. Hero: `<p eyebrow>TURUNCU SOLAR SSS</p><h1>{N} <em>soru.</em></h1><p lead>...</p>`
2. Search input (frosted glass + lupe prefix)
3. Category chips (kaydırılabilir, dark glass / beyaz aktif)
4. List head ("X SORU" sağa hizalı, dim caps)
5. Accordion liste (her item dark glass kart, 14px radius, açıkken daha opak; hairline yok)
6. CTA: "Cevabını bulamadın mı?" + Bize sor pill (whatsapp link)

### S.2 SSS Desktop (`/sss` ≥1280px)
**Dosyalar:** `src/components/sss/SssDesktop.tsx`, `app/sss/sss-desktop.css`
**Yapı:** body warm radial sahne, TURUNCU katmanlı override'lar (chip / accordion / CTA glass).

### S.3 İletişim Mobile (`/iletisim` ≤1279px)
**Dosyalar:** `src/components/iletisim/IletisimMobile.tsx`, `app/iletisim/iletisim-mobile.css`
**Akış:**
1. Hero: sade — sadece `<h1>Bize <span>ulaşın.</span></h1>`
2. Şube tabs (Ankara / Muğla — `iletisim-m__pills` segment)
3. Harita (full width, 16px radius glass, grayscale filter)
4. Info kartı (Ankara İrtibat Ofisi) — başlık + Merkez badge + 4 info satır + 7 günlük saat grid
5. Çalışma saatleri toggle (sticky)
6. Form: rail-style 3 grup (Başvuru tipi → Bilgileriniz → Mesajınız) + KVKK + beyaz Gönder pill

### S.4 İletişim Desktop (`/iletisim` ≥1280px)
**Dosyalar:** `app/iletisim/IletisimClient.tsx`, `app/iletisim/iletisim.css`
**Yapı:** `.cd-v2` class'ı altında 3 satır grid (full viewport):
- Row 1: title + tabs full width
- Row 2: harita full width
- Row 3: info kartı | form (2 kolon eşit yükseklik)

Form alanları: Ad Soyad / Firma 2-col → E-Posta / Telefon 2-col → Mesajınız (full + esneyebilir) → KVKK → Gönder.

---

## T. STATE / DAVRANIŞ

| State | Görsel |
|---|---|
| Hover (fine pointer) | bg opacity +0.04, border opacity +0.04 |
| Active (tap) | `transform: scale(0.96–0.98)` |
| Focus-visible | `outline: 2px solid #FFD2A0; outline-offset: 2px` veya glow ring |
| Aktif sekme | beyaz solid bg + #1A0907 text (chip / segment) ya da glow nokta + halo (dock) ya da glow gradient bg (menü) |
| Açık accordion | bg daha opak + chevron 180° rotate |
| Disabled | opacity 0.55, cursor not-allowed |
| Reduced motion | tüm transition / animation `none` |

---

## U. Z-INDEX KATMANLARI

```
--z-base   :   0–10
--z-sticky :  20–30
--z-nav    :  40–50  (top bar, bottom dock)
--z-alert  :  70–80
modal/menu : 9000+
```

Hamburger menü overlay: 9999. Backdrop button: 9998. Bottom dock: var(--z-nav, 50). Top bar: var(--z-nav, 50).

---

## V. ERİŞİLEBİLİRLİK

- Tüm dokunma alanları min 44×44.
- `aria-pressed`, `aria-selected`, `aria-expanded`, `aria-controls`, `role="tablist"/"tab"/"region"` doğru kullanılmış.
- Focus-visible ring her etkileşim öğesinde mevcut.
- Reduced motion media query her transition için kapanış sağlar.
- Bottom dock label'ları sr-only (`clip-path: inset(50%)`).

---

## W. RESPONSIVE EŞİKLER (sayfa bazında)

### SSS mobile
- ≤359 hero 28px (32px yerine), chip padding 7-12, font 11px.
- 768–1366 padding-inline 20–40px, max-width 720px center.

### İletişim mobile
- ≤419 form field-row tek kolon (2-col yerine).
- ≤379 form içi tek kolon, label & input alt alta.
- 768–1366 info-grid 2 kolon, çalışma saatleri grid.

### İletişim desktop (cd-v2)
- ≤599 hero başlık + tabs alt alta, form alanları tek kolon.
- 600–1023 cd-stage__row tek kolon (info üstte, form altta).
- ≥1024 iki kolon eşit yükseklik (info | form).

---

## X. SES YOK / BACKDROP-FILTER FALLBACK

Webkit prefix tüm `backdrop-filter` kullanan kuralda zorunlu (`-webkit-backdrop-filter`).

---

## Y. SAFE AREA

Tüm fixed öğelerde `env(safe-area-inset-*)` zorunlu:
- Top bar: padding-top safe-top.
- Bottom dock: padding-bottom safe-bottom.
- Menu overlay: padding safe-top / safe-bottom.

---

## Z. DOSYA HARİTASI

```
src/styles/tokens/
  colors.css           — palet
  spacing.css          — --space-*
  radius.css           — --radius-*
  typography.css       — --text-*, --weight-*, --leading-*
  motion.css           — --duration-*, --ease-*
  shadows.css          — --shadow-*
  safe-area.css        — --safe-*, clearance
  z-index.css          — --z-*

src/styles/components/
  bottom-nav.css       — handheld dock
  mobile/              — bottom-sheet, mobile-picker

src/components/layout/
  MobileTopbar.tsx     — top bar pill + hamburger menu drawer
  mobile-topbar.css
  BottomNav.tsx        — bottom dock
  AppChrome.tsx        — site shell (router'ları render eder)
  headerConfig.tsx     — SITE_NAV (showInMobileSheet, showInBottomNav flag'leri)

app/iletisim/
  page.tsx             — CMS data + CONTACT_PAGE config
  IletisimClient.tsx   — desktop component (.cd-v2)
  iletisim.css         — desktop CSS + warm sahne
  iletisim-mobile.css  — mobile (.iletisim-m) CSS

src/components/iletisim/
  IletisimMobile.tsx   — mobile component
  IletisimDesktop.tsx  — wrapper → IletisimClient
  IletisimRouter.tsx   — viewport split

app/sss/
  page.tsx             — FAQ JSON-LD + SssRouter
  sss-mobile.css       — mobile CSS
  sss-desktop.css      — desktop CSS

src/components/sss/
  SssMobile.tsx        — mobile component
  SssDesktop.tsx       — desktop component
  SssRouter.tsx        — viewport split
  faqs.tsx             — FAQ data + FAQ_CATEGORIES
```

---

**Son söz:**
Bu UI Kit, 2025-04-27 itibarıyla mevcut implementasyonun fotoğrafıdır. UI-Kit token isimleri (`.rail`, `.acc`, `.seg`, `.chip`, `.btn`, `.h-page` vb.) UI-Kit mockup'ı (`mockups/SOLSTICE-FINAL-UI-KIT.html`) ile **birebir eşit değil** — kodda BEM modifier'lar (`.iletisim-m__rail-row`, `.sss-mobile__chevron`, `.cd-info-row` vb.) kullanılıyor. Hedef: `DENETIM-RAPORU-iletisim-sss.md` çalıştırılarak token isimleri uyumlu hâle getirilebilir.
