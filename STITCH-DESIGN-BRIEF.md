# TURUNCU SOLAR — STITCH DESIGN BRIEF

> Bu dosyayı Google Stitch'in **system prompt** / **design instructions** alanına birebir yapıştır.
> Tasarım üretmeden önce Stitch bu kurallara uymak zorundadır.

---

## 1. MARKA + TEMA

- **Ürün:** Turuncu Solar — güneş enerjisi sistemleri kurumsal sitesi (Next.js 16 + React 19).
- **Tema:** Kinetic Enterprise (Dark). Tüm sayfalar koyu zemin, orange accent.
- **Dil:** Türkçe (tüm string'ler). İngilizce tasarım terimleri kullanma.
- **Karakter:** Enerji + Güven + Profesyonel Modernizm.

---

## 2. RENK PALETİ — ZORUNLU

**Kullanılacak tam renkler (başka hiçbir hex/rgba izinli değil):**

| Token | Hex | Kullanım |
|---|---|---|
| `--color-kinetic-bg` | `#1A1C1E` | Sayfa zemini |
| `--color-kinetic-surface` | `#2A2D31` | Kart zemini |
| `--color-kinetic-surface-high` | `#333537` | Yükseltilmiş kart (modal, dropdown) |
| `--color-kinetic-text` | `#F4F4F6` | Başlık, body metin |
| `--color-kinetic-text-muted` | `rgba(244,244,246,0.72)` | İkincil metin |
| `--color-kinetic-text-dim` | `rgba(244,244,246,0.55)` | Meta, hint, overline |
| `--color-kinetic-primary` | `#E6391A` | CTA, aktif state, marka vurgu |
| `--color-kinetic-primary-hover` | `#ff4a2a` | Hover/active |
| `--color-kinetic-primary-soft` | `rgba(230,57,26,0.12)` | İkon chip bg, ghost pill |
| `--color-kinetic-primary-glow` | `rgba(230,57,26,0.3)` | CTA shadow |
| `--color-kinetic-border` | `#3A3D42` | Kart kenarı, divider |
| `--color-kinetic-border-soft` | `rgba(244,244,246,0.08)` | Hafif kenar |

**YASAK:**
- Başka herhangi bir renk kullanma
- Saf beyaz (#FFFFFF) kullanma — onun yerine `#F4F4F6`
- Saf siyah (#000000) kullanma — onun yerine `#1A1C1E`
- Gradient (lineer veya radial) — SADECE `--color-kinetic-primary` CTA'larda, başka yerde değil
- Pastel tonlar, yumuşak beyazlar, renkli shadow'lar

---

## 3. TİPOGRAFİ — ZORUNLU

**Fontlar:**
- **Headline:** `Manrope` (500/600/700/800)
- **Body + Label:** `Inter` (400/500/600/700)

**Ölçek (fluid clamp):**

| Boyut | Phone → Desktop | Kullanım |
|---|---|---|
| 2xs | 12–13px | Meta, overline, caps label |
| xs | 14–15px | İkincil bilgi, buton label |
| sm | 15–16px | Küçük body |
| base | 16–18px | **Body default** (SEO min) |
| lg | 18–20px | Lead paragraf |
| xl | 20–24px | Modal/popup başlık MAX |
| 2xl | 24–30px | Section başlık |
| 3xl | 30–40px | Page H1 |
| 4xl | 36–56px | Hero başlık |

**Kurallar:**
- **Body min 16px** (SEO + iOS zoom koruması)
- **Input min 16px** (iOS zoom koruması)
- **Line-height:** Body ≥1.55, Başlık 1.1–1.2
- **Letter-spacing:** Büyük başlık −0.02em, overline/caps 0.08–0.12em
- **Max satır genişliği:** Body `65–75ch`, uzun metin ≤80ch
- **Weight:** Sayı yazma (`font-weight: 700` YASAK) — sadece semantic (bold/semibold/regular)

**Başlık hiyerarşisi — her sayfada TEK h1:**
- H1: Page title (36–40px)
- H2: Section (24–30px)
- H3: Card/Block (20–24px)
- H4: Subsection (16–18px)

---

## 4. SPACING — 4px TABANLI

**Tüm spacing 4px'in katı olmalı:**
```
4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 80 · 96
```

**YASAK:** 3, 5, 7, 9, 11, 13, 15 gibi 4'ün katı olmayan değerler.

**Tipik kullanım:**
- Icon-text gap: 8 veya 12
- Button padding: 12×24 veya 16×32
- Card padding: 20 veya 24
- Section arası: 48 veya 64
- Page padding (mobile): 16
- Page padding (desktop): 24 veya 32

---

## 5. RADIUS

```
sm   = 6px   (ince UI, tag, chip)
md   = 10px  (buton, input)
lg   = 14px  (kart, dropdown)
xl   = 20px  (büyük kart, modal)
2xl  = 24px  (hero kart)
full = 9999px (pill, daire ikon)
```

**Kural:** İkon chip/avatar yuvarlak DAİRE (`full`). Buton pill (`full`). Kart rounded (`lg` veya `xl`). Input (`md` veya `lg`).

---

## 6. EKRAN SINIRLARI (BREAKPOINT)

```
xs  = 0–767px      Telefon
sm  = 768–1023px   Tablet dikey
md  = 1024–1279px  Tablet yatay / küçük laptop
lg  = 1280–1439px  Desktop (13")
xl  = 1440–1919px  Desktop normal
2xl = 1920+px      Geniş ekran
```

**Mobil eşik:** ≤1279px → mobile layout (bottom nav zorunlu)
**Desktop eşik:** ≥1280px → desktop layout (top header zorunlu)

**Kural:** Desktop'ta olan içerik mobilde de olmalı. Sadece layout farklı, içerik kesme YOK.

---

## 7. NAVİGASYON

| Genişlik | Top Header | Bottom Nav |
|---|---|---|
| ≤1279 mobil | Minimal (logo + hamburger) | ZORUNLU |
| ≥1280 desktop | FULL horizontal | YOK |

- Bottom nav `env(safe-area-inset-bottom)` saygılı olmalı
- Hover-only dropdown **YASAK** (touch'ta çalışmaz)

---

## 8. DOKUNMA + ETKİLEŞİM

- **Tıklanabilir alan:** ≥44×44px (Apple HIG)
- **Butonlar arası boşluk:** ≥8px
- **Keyboard:** Tab, Enter, Esc, Arrow tuşları çalışmalı
- **Hover:** Sadece `@media (hover: hover)` içinde (touch'ta yapışmasın)
- **Focus:** `:focus-visible` ring BEYAZ (`rgba(255,255,255,0.85)`), turuncu DEĞİL
- **Active:** `transform: scale(0.98)` dokunma geri bildirim

---

## 9. ERİŞİLEBİLİRLİK (WCAG 2.2 AA)

**ZORUNLU:**
- `:focus-visible` her etkileşimli elemanda
- Her `<img>` için `alt` attribute (dekoratif boş)
- Form input'larda `<label htmlFor>` (placeholder yetmez)
- `aria-label`, `aria-expanded`, `role` doğru
- `prefers-reduced-motion` saygılı animasyon
- Kontrast: body ≥4.5:1, large text ≥3:1
- Keyboard navigasyon tam (modal focus trap + Escape)

**YASAK:**
- `outline: none` (focus görünmez hale getirir)
- Sadece placeholder, label yok
- Renk tek bilgi kaynağı olmamalı (ikon/metin + renk)

---

## 10. SEO + SEMANTIK HTML

- Her sayfada **TEK** `<h1>`
- Doğru hiyerarşi: h1 → h2 → h3 (atlama yok)
- `<main>`, `<section>`, `<article>`, `<nav>` semantik
- Meta: title, description, OG, Twitter, canonical
- JSON-LD structured data (Organization, ContactPage, Article)

---

## 11. PERFORMANS + ANİMASYON

**ZORUNLU:**
- Animasyon SADECE `transform` + `opacity` (reflow tetikleme)
- `prefers-reduced-motion: reduce` saygılı
- Image: `width+height` attribute (CLS önleme)
- Ekran dışı `loading="lazy"`
- `font-display: swap`

**YASAK:**
- `width/height/top/left` animate (reflow tetikler)
- Sonsuz döngü animasyon (sadece progress için)
- Gradient/blur ağır effect'ler (perf)

**Süre token'ları:**
- fast: 150ms (hover, focus)
- base: 250ms (state değişim, modal açılma)
- slow: 350ms (karmaşık sequence)

---

## 12. Z-INDEX HIYERARŞİSİ

```
base     = 10   (temel float)
dropdown = 20   (dropdown, tooltip)
sticky   = 30   (sticky header)
modal    = 40   (modal, sheet)
nav      = 50   (bottom nav, top nav)
alert    = 60   (toast, notification)
```

**YASAK:** `z-index: 9999` gibi keyfi değerler.

---

## 13. COMPONENT DESEN KATALOĞU

### Buton — Primary
```
bg: --color-kinetic-primary
color: --color-kinetic-text (beyaz-ish)
padding: 12×24 (sm), 16×32 (md)
radius: full (pill)
min-height: 44px
hover (mouse): bg --color-kinetic-primary-hover
active: scale(0.98)
```

### Buton — Secondary
```
bg: transparent
color: --color-kinetic-text
border: 1px solid --color-kinetic-border
radius: full
```

### Buton — Ghost
```
bg: transparent
color: --color-kinetic-text-muted
no border
hover: bg --color-kinetic-primary-soft
```

### İkon Chip
```
shape: DAİRE (radius full)
size: 40×40 veya 48×48
bg: --color-kinetic-primary-soft
icon color: --color-kinetic-primary
icon size: 16–24px
```

### Kart
```
bg: --color-kinetic-surface
border: 1px solid --color-kinetic-border-soft
radius: xl (20px)
padding: 20 veya 24
```

### Input / Textarea / Select
```
bg: --color-kinetic-surface
border: 1px solid --color-kinetic-border
color: --color-kinetic-text
min-height: 48px (touch target)
radius: md (10px) veya lg (14px)
font-size: 16px (iOS zoom koruması)
focus: border --color-kinetic-primary, box-shadow glow
```

### Form Label
```
font-size: 12px
letter-spacing: 0.12em
text-transform: uppercase
font-weight: 700
color: --color-kinetic-text
margin-bottom: 8px
```

### Chip/Badge (rozet)
```
bg: --color-kinetic-primary-soft
color: --color-kinetic-primary
padding: 4×12
radius: full
font-size: 10–12px
letter-spacing: 0.1em
text-transform: uppercase
font-weight: 700
```

### Navigation Pill (aktif chip grubu)
```
Dış kap: bg --color-kinetic-surface, padding 4, radius full, border soft
İç pill (inactive): transparent, color muted
İç pill (active): bg --color-kinetic-primary, color beyaz, shadow glow
```

### Map Kartı
```
radius: xl (20px) veya 2xl (24px)
border: 1px solid --color-kinetic-border
iframe filter: grayscale + brightness 0.5 invert 0.88 opacity 0.7 (dark harmonize)
marker: --color-kinetic-primary daire + beyaz border + pulsing ring
```

---

## 14. LAYOUT DESEN

### Mobil
- Tek sütun dikey akış
- Padding 16px
- Section arası 32px
- Fixed top bar + fixed bottom nav

### Tablet (768–1279)
- Tek sütun veya 2 sütun (container ≤900px)
- Padding 24px

### Desktop (≥1280)
- 2 sütun split (50/50 veya 40/60)
- Veya container max 1200px centered
- Padding 32px

---

## 15. YASAKLAR LİSTESİ

- Başka renk kullanma (palet dışı hex)
- Hardcoded font-size (sadece token)
- 4'ün katı olmayan spacing
- `outline: none` (a11y)
- `width: 100vw` (iOS kırılır)
- `height: 100vh` (iOS — `100svh` kullan)
- `body { overflow: hidden }`
- Hover-only davranış
- `z-index: 9999` keyfi değer
- Gradient arka plan (primary CTA dışı)
- Drop shadow abartılı (sadece soft/deep token'ları)
- Infinite animation (progress dışı)
- 12px altı body font
- 80ch üstü satır genişliği
- Placeholder-only input (label zorunlu)

---

## 16. STİTCH'E ÖZET TALIMAT

> Turuncu Solar için bir tasarım yapıyorsun. Kinetic Enterprise dark tema. Zemin `#1A1C1E`, kart `#2A2D31`, metin `#F4F4F6`, accent `#E6391A`. Manrope başlık, Inter body. 4px grid spacing. Token bazlı. Her sayfada tek h1. 44px touch target. Pill branch selector, daire icon chipler, rounded kartlar. İçerik Türkçe. Desktop ve mobil içerik eşdeğer. Focus ring beyaz. Mobilde bottom nav, desktop'ta top header. Üst paletin dışında renk kullanma. Hardcoded px yazma — tüm değerler token'dan.

---

**Dosya yolu (kopya için):** `STITCH-DESIGN-BRIEF.md`
