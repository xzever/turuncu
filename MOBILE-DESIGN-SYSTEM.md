# TURUNCU SOLAR — MOBİL TASARIM SİSTEMİ (MDS) v1.0

> Bu doküman **tek otorite**. `CLAUDE.md`'nin altında, mobil (≤1279px **veya** dokunmatik) için genişletilmiş, native-app kalitesinde tek dil tanımıdır.
>
> **Hiyerarşi:** `CLAUDE.md` (kural dosyası) > `MOBILE-DESIGN-SYSTEM.md` (bu dosya, mobil spesifikasyon) > sayfa CSS'i.
>
> Bir çelişki varsa `CLAUDE.md` kazanır. Bu dosya onunla çelişmeyecek şekilde yazıldı.

---

## 0. AMAÇ

8 sayfanın tamamında — **telefon, tablet dikey, tablet yatay (14.6" dahil) ve dokunmatik laptop** — **tek tasarım dili** konuşan, **native app hissi veren**, **CLAUDE.md kurallarına %100 uyan** mobil arayüz.

**Ölçü:**
- `grep "font-size: [0-9]\+px"` → 0 eşleşme
- `grep "border-radius: [0-9]\+px"` → 0 eşleşme
- `grep "100vw"` → 0 eşleşme
- `grep "pointer: coarse"` → ≥10 eşleşme (her responsive dosyada)
- Sekiz sayfada da aynı Pill, aynı Card, aynı TopBar, aynı BottomSheet.

---

## 1. CİHAZ MATRİSİ (test zorunlu)

Her sayfa bu cihazların **tamamında** dikey ve yatay konumda test edilir:

| # | Cihaz | CSS viewport (dikey) | CSS viewport (yatay) | Pointer |
|---|---|---|---|---|
| 1 | iPhone SE 2020 | 375×667 | 667×375 | coarse |
| 2 | iPhone 14 | 390×844 | 844×390 | coarse |
| 3 | iPhone 14 Pro Max | 430×932 | 932×430 | coarse |
| 4 | Pixel 7 | 412×915 | 915×412 | coarse |
| 5 | iPad Mini 6 | 744×1133 | 1133×744 | coarse |
| 6 | iPad Pro 11" | 834×1194 | 1194×834 | coarse |
| 7 | iPad Pro 12.9" | 1024×1366 | 1366×1024 | coarse |
| 8 | Galaxy Tab S9 Ultra 14.6" | 904×1449 (~) | **1366×680** | coarse |
| 9 | Dokunmatik laptop (Surface) | 1280×800+ | 1280×800+ | coarse |

**Yatay konumda (14.6" tabletin 1366×680 gibi) 1279px'i aşan her dokunmatik cihaz için Madde 2.2 geçerli: `(pointer: coarse)` ile mobil layout uygulanır.**

---

## 2. TESPİT + BREAKPOINT SİSTEMİ

### 2.1 Mobil tanımı

Mobil layout aşağıdaki iki durumdan **herhangi biri** doğruysa uygulanır:

```css
/* (A) viewport genişliği ≤ 1279px — klasik telefon/tablet dikey */
@media (max-width: 1279px) { ... }

/* (B) dokunmatik cihaz — genişlik ne olursa olsun — 14.6" tablet yatay dahil */
@media (pointer: coarse) { ... }

/* Birleşik — her ikisini de kapsayan TEK kural */
@media (max-width: 1279px), (pointer: coarse) { ... }
```

Bu birleşik query **tüm mobil bileşen CSS'lerinde** böyle yazılır.

### 2.2 Desktop tanımı

Desktop layout sadece şu koşulda uygulanır:

```css
/* Geniş viewport + hassas işaretçi (mouse/trackpad) */
@media (min-width: 1280px) and (pointer: fine) { ... }
```

**Önemli:** `(min-width: 1280px)` tek başına yetmez — 14.6" tablet yatay buraya düşer ama pointer: fine olmadığı için desktop almaz.

### 2.3 Landscape orientasyonu

Telefon ve küçük tabletlerde yatay konuma geçildiğinde TopBar daralır, grid kolon sayısı artar:

```css
/* Telefon yatay: TopBar 48px, safe-area left+right uygulanır */
@media (max-width: 896px) and (orientation: landscape) { ... }

/* Tablet yatay (1024-1366): grid kolon sayısı 3 */
@media (min-width: 1024px) and (orientation: landscape) and (pointer: coarse) { ... }
```

### 2.4 JavaScript tespit

`src/lib/useResponsiveShell.ts` aşağıdaki birleşik mantığa geçirilir:

```ts
const mq = window.matchMedia(
  "(max-width: 1279px), (pointer: coarse)"
);
```

Ek olarak `orientationchange` + `resize` event'lerini dinler.

---

## 3. TOKEN KULLANIMI

### 3.1 Zorunlu ilkeler

- **Her değer token'lı.** `padding: 12px` yerine `padding: var(--space-3)`.
- **Tek istisna:** `input { font-size: 16px }` (iOS zoom önleme).
- **4'ün katı olmayan değer YASAK.** (3, 5, 6, 7, 9, 10, 11, 13, 14, 15, 17, 18, 19, 22 → hepsi yasak.)
- **Radius token'ı zorunlu.** `border-radius: 12px` → `var(--radius-card)`.

### 3.2 Token eşleme tablosu (hardcoded değer → token)

| Hardcoded (YASAK) | Doğru token |
|---|---|
| `4px` | `var(--space-1)` |
| `8px` | `var(--space-2)` |
| `12px` | `var(--space-3)` |
| `16px` | `var(--space-4)` |
| `20px` | `var(--space-5)` |
| `24px` | `var(--space-6)` |
| `32px` | `var(--space-8)` |
| `40px` | `var(--space-10)` |
| `48px` | `var(--space-12)` |
| `64px` | `var(--space-16)` |
| `border-radius: 6px` | `var(--radius-sm)` |
| `border-radius: 10px` | `var(--radius-md)` |
| `border-radius: 12px` | `var(--radius-card)` |
| `border-radius: 14px` | `var(--radius-lg)` |
| `border-radius: 18px` | `var(--radius-xl)` |
| `border-radius: 24px` | `var(--radius-2xl)` |
| `border-radius: 30px` | `var(--radius-3xl)` |
| `border-radius: 999px` | `var(--radius-full)` |
| `font-size: 14px` | `var(--text-xs)` |
| `font-size: 16px` | `var(--text-base)` (genel) / `16px` sadece input'ta |
| `font-size: 32px` | `var(--text-3xl)` |

### 3.3 Kenarlar / ince çizgiler

1px çizgiler hariç token ihlali değildir (1px alt token yok, Retina'da alt piksel). Ancak 2px, 3px çizgiler için:
- `2px` → `var(--space-1)` **kullanılmaz** (space token semantiği farklı); bunun yerine `outline-width: 2px` gibi az yerde hardcoded kalabilir, **ama sadece kenar/outline'da**. Layout padding/margin'de YASAK.

---

## 4. TİPOGRAFİ HİYERARŞİSİ — MOBİL

`CLAUDE.md` madde 3.1 ve 3.2 burada genişletilir. Mobil için tablo:

| Bağlam | Token | Telefon (≤430) | Tablet (768-1279) | Hardcoded var mı? |
|---|---|---|---|---|
| Overline / meta (tarih, etiket) | `--text-2xs` | 12px | 13px | YASAK |
| İkincil bilgi, buton label | `--text-xs` | 14px | 14.5px | YASAK |
| Küçük body | `--text-sm` | 15px | 15.5px | YASAK |
| Body (default) | `--text-base` | 16px | 17px | YASAK |
| Lead paragraf | `--text-lg` | 18px | 19px | YASAK |
| Kart başlığı (normal kart) | `--text-lg` | 18px | 19px | YASAK |
| Kart başlığı (dar kart ≤360px) | `--text-base` | 16px | — | YASAK |
| Modal / BottomSheet başlığı (MAX) | `--text-xl` | 20px | 22px | YASAK |
| Section başlık | `--text-2xl` | 24px | 27px | YASAK |
| Sayfa H1 | `--text-3xl` | 30px | 35px | YASAK |
| Hero (liste/detay üstü) | `--text-3xl` **veya** `--text-4xl` (dikkatli) | 30-36px | 35-45px | YASAK |
| Hero tam-ekran splash | `--text-5xl` | 44px | 58px | YASAK |

**Katı kurallar:**
- Mobilde **>40px** başlık YASAK.
- Kart başlığında **>22px** YASAK.
- BottomSheet başlığında **>22px** YASAK.
- Hero dışında tüm `font-size` değerleri token.
- Line-height: body `--leading-normal` (1.55), başlık `--leading-tight` (1.2) veya `--leading-snug` (1.35).

---

## 5. RENK + FOCUS RING

### 5.1 Kullanım

- `--color-primary` (#ff6a00): **sadece** CTA, aktif state, brand vurgusu. Dekoratif kullanım YASAK.
- `--color-text-primary`: tüm body metin.
- `--color-text-secondary`: meta, açıklama.
- `--color-text-muted`: disabled, yardımcı.
- `--color-bg-app`, `--color-bg-cream`, `--color-bg-layer-a/b`: sayfa arkaplanı.

### 5.2 Focus ring — BEYAZ, HER YERDE

```css
:focus-visible {
  outline: 2px solid var(--color-focus-ring); /* rgba(255,255,255,0.85) */
  outline-offset: 2px;
  box-shadow: var(--shadow-focus);
}
```

**Açık zemin üzerinde beyaz focus ring zayıf görünebilir diye turuncuya kaymak YASAK.** Kontrast için `box-shadow: var(--shadow-focus)` eklenir (zaten token olarak var).

`outline: none` **YASAK**.

---

## 6. MOBİL LAYOUT SHELL

### 6.1 Yapı

```
┌──────────────────────────────┐
│ SAFE-AREA-TOP                │
├──────────────────────────────┤
│ TOP BAR (56-64px, sticky)    │ ← --topbar-content-height (66px)
├──────────────────────────────┤
│                              │
│ MAIN SCROLL AREA             │
│ - max-width: 100%            │
│ - padding-inline: var        │
│ - padding-bottom: clearance  │
│                              │
├──────────────────────────────┤
│ BOTTOM NAV (88px + overflow) │ ← --bottomnav-clearance
├──────────────────────────────┤
│ SAFE-AREA-BOTTOM             │
└──────────────────────────────┘
```

### 6.2 Token'lar

- TopBar yüksekliği: `--topbar-content-height` = 66px.
- TopBar üstü boşluk: `var(--safe-top)`.
- TopBar clearance (içerik top padding'i): `var(--topbar-clearance)`.
- BottomNav yüksekliği: `--bottomnav-height` = 88px.
- BottomNav clearance (içerik bottom padding'i): `var(--bottomnav-clearance)`.
- Yatay padding: `var(--header-inline-pad)` (clamp 12-28px).

### 6.3 Yasaklar

- `body { overflow: hidden }` YASAK.
- `html { overflow: hidden }` YASAK.
- `width: 100vw` YASAK.
- `max-width: 100vw` YASAK.
- `height: 100vh` YASAK — bunun yerine `var(--viewport-height-dynamic)` (100dvh) ya da `var(--viewport-height-stable)` (100svh).
- `overflow-x: clip` sadece `html`'de.

---

## 7. KOMPONENT KÜTÜPHANESİ

Konum: `src/components/ui/mobile/` (tsx) + `src/styles/components/mobile/` (css).

Her komponent:
- Tek kaynak, `import { Pill } from "@/components/ui/mobile"`.
- Tüm sayfalar aynı komponenti kullanır.
- Prop type'ları TypeScript strict.

### 7.1 `<Pill>` — Kapsül Buton

**Dosya:** `src/components/ui/mobile/Pill.tsx`, `src/styles/components/mobile/pill.css`.

**Varyantlar:**
- `primary` — dolu turuncu, beyaz metin (CTA)
- `secondary` — hayalet kenar, beyaz zeminli (ikincil aksiyon)
- `ghost` — hayalet kenar, şeffaf zemin (quick actions)
- `filter-chip` — filtre seçimi, `is-on` state'iyle
- `size-pill` — küçük, sayfa başına seçici

**Spec:**
- `min-height: 44px` (Apple HIG).
- `padding-inline: var(--space-5)`, `padding-block: var(--space-2)`.
- `border-radius: var(--radius-full)`.
- `font-size: var(--text-xs)`, `font-weight: var(--weight-semibold)`.
- `gap: var(--space-2)` (icon + label).
- `transition: var(--transition-fast)`.
- `:active { transform: scale(0.97); }` — haptic analog.
- Disabled: `opacity: 0.5; pointer-events: none;`.
- Focus: Madde 5.2.
- Hover: **sadece `@media (hover: hover) and (pointer: fine)` içinde**.

**TSX imzası:**

```tsx
type PillProps = {
  variant?: "primary" | "secondary" | "ghost" | "filter-chip" | "size-pill";
  size?: "sm" | "md"; // default md (44px), sm = 36px (sadece size-pill için)
  active?: boolean; // filter-chip için
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  disabled?: boolean;
  as?: "button" | "a"; // <Link> ile sarmalanabilir
  onClick?: () => void;
  children: React.ReactNode;
  ariaLabel?: string;
};
```

### 7.2 `<Card>` — Temel Kart

**Spec:**
- `border-radius: var(--radius-card)` (12px).
- `background: var(--color-bg-layer-a)` (beyaz %62 opasite).
- `padding: var(--space-4)` (default); `var(--space-5)` (büyük).
- `box-shadow: var(--shadow-soft)` (opsiyonel).
- `transition: transform var(--duration-fast), box-shadow var(--duration-fast)`.
- Tıklanabilir kartlar: `:active { transform: scale(0.98); }`.
- Hover YOK (touch).

**Varyantlar:**
- `flat` — gölgesiz
- `elevated` — --shadow-soft
- `interactive` — tıklanabilir, active state

**TSX imzası:**

```tsx
type CardProps = {
  variant?: "flat" | "elevated" | "interactive";
  padding?: "sm" | "md" | "lg"; // space-3 / space-4 / space-5
  href?: string; // interactive ise
  onClick?: () => void;
  children: React.ReactNode;
};
```

### 7.3 `<TopBar>` — Üst Çubuk

**Spec:**
- `position: sticky; top: 0;`.
- `z-index: var(--z-sticky)`.
- `padding-top: var(--safe-top)`.
- İçerik yüksekliği: 56px (standart), 48px (landscape telefon).
- Backdrop: `backdrop-filter: blur(12px); background: rgba(255,255,255,0.85);`.
- İçerik: `grid-template-columns: 44px 1fr auto;` (sol / orta / sağ).
- Sol: back (ChevronLeft) veya logo.
- Orta: başlık (truncate, `--text-base`, `--weight-semibold`).
- Sağ: maks 2 ikon (search, share, vb.), her biri 44×44.

**TSX imzası:**

```tsx
type TopBarProps = {
  title?: string;
  back?: boolean | { href?: string; onClick?: () => void };
  actions?: Array<{ icon: React.ReactNode; label: string; onClick: () => void; href?: string }>;
  variant?: "solid" | "transparent"; // transparent hero üstünde
  showLogo?: boolean; // back yerine
};
```

### 7.4 `<BottomNav>` — Alt Navigasyon

**Spec:**
- `position: fixed; bottom: 0; left: 0; right: 0;`.
- `z-index: var(--z-nav)`.
- `padding-bottom: var(--safe-bottom)`.
- Yükseklik: `--bottomnav-height` (88px).
- 4-5 item, her biri `min-width: 64px; min-height: 56px;`.
- Aktif item: `--color-primary` underline veya bubble.
- Icon + label (label `--text-2xs`).

**Yalnızca ≤1279 VEYA coarse pointer'da gösterilir.**

### 7.5 `<BottomSheet>` — Alt Levha

Modal/filtre için. Merkez modal YASAK mobilde.

**Spec:**
- `position: fixed; bottom: 0; left: 0; right: 0;`.
- `border-radius: var(--radius-2xl) var(--radius-2xl) 0 0`.
- `max-height: 85vh; min-height: 40vh;`.
- Üstte handle bar: 36×4px, `--color-text-muted`.
- `z-index: var(--z-modal)`.
- Overlay: `position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px);`.
- Swipe-down to dismiss (pointer + touch events).
- Enter: `transform: translateY(0)` + overlay opacity 1, 250ms ease-out.
- Exit: tersine.
- Focus trap + Esc tuşu kapat.
- `prefers-reduced-motion: reduce` → transition'sız snap.

**TSX imzası:**

```tsx
type BottomSheetProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  snapPoints?: ("40" | "60" | "85")[]; // default ["85"]
};
```

### 7.6 `<ListItem>` — Liste Satırı

**Spec:**
- `min-height: 56px` (Material Design).
- `padding: var(--space-3) var(--space-4)`.
- `display: grid; grid-template-columns: auto 1fr auto; gap: var(--space-3);`.
- Sol: icon/avatar (opsiyonel).
- Orta: başlık + alt başlık.
- Sağ: chevron / meta (opsiyonel).
- `:active { background: rgba(0,0,0,0.05); }`.
- Bölücü: `border-bottom: 1px solid rgba(0,0,0,0.08);`.

### 7.7 `<SearchInput>` — Arama

**Spec:**
- `height: 44px`.
- `border-radius: var(--radius-full)`.
- `padding: 0 var(--space-4) 0 var(--space-10)` (sol: icon alanı).
- Icon (Search): sol, 20×20, `--color-text-secondary`.
- Clear (X) butonu: sağ, input doluyken.
- `font-size: 16px` **(iOS zoom zorunluluğu, token kullanılmaz)**.
- Background: `rgba(0,0,0,0.04)` (açık tema) veya `--color-bg-layer-a`.
- Focus: ring beyaz + subtle primary glow.

### 7.8 `<SectionHeader>` — Bölüm Başlığı

**Spec:**
- `padding: var(--space-8) 0 var(--space-4)`.
- Overline (opsiyonel): `--text-2xs`, uppercase, `letter-spacing: var(--tracking-wider)`, `--color-primary`.
- Başlık: `--text-2xl`, `--weight-bold`.
- Alt-başlık (opsiyonel): `--text-base`, `--color-text-secondary`, `margin-top: var(--space-2)`.

### 7.9 `<EmptyState>` — Boş Durum

**Spec:**
- Flex column center.
- `padding: var(--space-12) var(--space-6)`.
- Icon (64×64, `--color-text-muted`).
- Başlık: `--text-lg`, `--weight-semibold`, `margin-top: var(--space-4)`.
- Açıklama: `--text-sm`, `--color-text-secondary`, `text-align: center`, `max-width: 320px`.
- Opsiyonel CTA: `<Pill variant="primary">`.

### 7.10 `<Skeleton>` — Yükleme İskeleti

**Spec:**
- `background: linear-gradient(90deg, rgba(0,0,0,0.06), rgba(0,0,0,0.10), rgba(0,0,0,0.06))`.
- `background-size: 200% 100%`.
- `animation: shimmer 1.4s ease-in-out infinite`.
- `@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`.
- `border-radius: var(--radius-card)`.
- `@media (prefers-reduced-motion: reduce) { animation: none; }`.

### 7.11 `<Accordion>` — Açılır Panel

**Spec:**
- Item yüksekliği (kapalı): 56px minimum.
- `padding: var(--space-4) var(--space-4)`.
- Chevron: sağda, 20×20, açıldığında 180° döner.
- Açılma: `max-height` + `opacity` geçişi, 250ms.
- `aria-expanded`, `aria-controls` zorunlu.
- Açılan içerik: `padding: 0 var(--space-4) var(--space-4)`.

### 7.12 `<ShareSheet>` — Paylaşım Levhası

Native `navigator.share` varsa onu kullanır, yoksa BottomSheet içinde paylaşım seçenekleri (WhatsApp, Twitter, LinkedIn, Facebook, link kopyala).

---

## 8. SAYFA ŞABLONLARI

### 8.1 Liste sayfası (Blog, Referanslar)

```
TopBar (title, search icon, share icon)
├─ Hero card (opsiyonel, featured post)
├─ Filter pill row (yatay scroll, "Tümü | Sanayi | Lojistik | …")
├─ Grid
│   ├─ Telefon (≤767): 1 kolon
│   ├─ Tablet dikey (768-1023): 2 kolon
│   └─ Tablet yatay / geniş (1024+, coarse): 3 kolon
└─ Pagination pill-row veya infinite scroll
```

### 8.2 Detay sayfası (Blog post, Referans detay)

```
TopBar (back, share icon)
├─ Hero image (16:9, --radius-card, priority load)
├─ Meta row (tarih · yazar · okuma süresi, --text-2xs)
├─ H1 (--text-3xl)
├─ Lead paragraph (--text-lg)
├─ Content (prose, --text-base, --leading-normal)
├─ Tag chips (<Pill filter-chip>)
├─ Share bar (sticky bottom, yatay row)
├─ İlgili yazılar (2-3 kart grid)
└─ Newsletter CTA
```

### 8.3 Form sayfası (İletişim)

```
TopBar (title)
├─ Hero başlık + alt başlık
├─ Quick actions row (<Pill ghost>, Ara / WhatsApp / E-posta)
├─ Form
│   ├─ Input group (label + input, label üstte)
│   ├─ Textarea (min 120px)
│   └─ Submit (<Pill primary> tam genişlik)
├─ Alternatif iletişim (adres, harita)
└─ SSS linki
```

### 8.4 Accordion sayfası (SSS)

```
TopBar (title, search icon)
├─ Hero kısa başlık
├─ Category pill row (yatay scroll)
├─ Search input (sticky altında)
└─ Accordion list
    └─ <Accordion item>[]
```

### 8.5 İçerik sayfası (Hakkımızda, Sistemlerimiz, Sistem Farkları)

```
TopBar (title)
├─ Hero (image + başlık + alt başlık)
├─ Section[] (header + content + opsiyonel image)
├─ Değer kartları grid (2 kolon telefon, 3 kolon tablet)
├─ CTA banner (<Pill primary>)
```

### 8.6 Ana sayfa

```
TopBar (logo + search + hamburger)
├─ Hero (full-bleed, H1 + 2 CTA)
├─ Hızlı giriş grid (2x2 kartlar)
├─ Ürün kategorileri (horizontal scroll kart karuseli)
├─ Öne çıkan referanslar (3 kart)
├─ Blog öne çıkanlar (2-3 kart)
├─ CTA banner
└─ Footer
```

---

## 9. ETKİLEŞİM DESENLERİ

### 9.1 Dokunma

- Tap active state: `transform: scale(0.97-0.98)`, `transition: var(--duration-fast)`.
- Active hit target minimum 44×44 (CLAUDE.md Madde 8).
- Butonlar arası ≥8px.
- Long-press yok (kullanıcı ezberinde değil, web'de anti-pattern).

### 9.2 Kaydırma

- Native `overflow-y: auto` + `-webkit-overflow-scrolling: touch` (modern browser'da otomatik).
- `scroll-snap-type: y mandatory` YASAK (CLAUDE.md Madde 6). `proximity` serbest.
- Yatay scroll: `scroll-snap-type: x proximity` pill row ve kart karuselinde serbest.

### 9.3 Swipe (BottomSheet)

- `pointerdown` → `pointermove` → `pointerup` event chain.
- 50px altı aşağı sürükleme → kapat.
- Mouse ile de çalışır (test için).

### 9.4 Animasyon

- **Sadece `transform` ve `opacity` animate edilir** (CLAUDE.md Madde 11).
- Süre: `--duration-fast` (150ms) hızlı UI, `--duration-base` (250ms) default, `--duration-slow` (350ms) sayfa geçişleri.
- Ease: `--ease-base` default, `--ease-out` girişler, `--ease-in-out` iki yönlü.
- `prefers-reduced-motion: reduce` → süre 0 veya animasyon kaldırılır.

### 9.5 Hover

- **Sadece `@media (hover: hover) and (pointer: fine)` guard'ı içinde** tanımlanır.
- Mobilde asla etkili değildir.

---

## 10. NAVİGASYON

### 10.1 Zorunlu

- Mobilde (≤1279 VEYA coarse): **BottomNav görünür, TopBar minimal**.
- Desktop'ta (≥1280 AND fine): **TopBar tam menü, BottomNav YOK**.

### 10.2 BottomNav itemları (4-5 tab)

Sıralama:
1. Ana Sayfa (`/`)
2. Sistemler (`/sistemlerimiz`)
3. Blog (`/blog`)
4. Referanslar (`/referanslar`)
5. İletişim (`/iletisim`)

SSS, Hakkımızda, Sistem Farkları: TopBar hamburger menü içinde.

### 10.3 Hamburger (TopBar → hamburger → sheet)

BottomSheet açılır, tam ekran menü. Alt linkler: Hakkımızda, SSS, Sistem Farkları, Blog, Referanslar, İletişim.

### 10.4 Yasak

- Bottom bar + Top header'da aynı sekmeler (duplicate nav) YASAK.
- Hover-only dropdown YASAK.

---

## 11. LANDSCAPE KURALI

### 11.1 14.6" tablet yatay (1366×680)

- Mobil layout alır (`pointer: coarse` sayesinde).
- TopBar + BottomNav görünür.
- Safe-area left + right padding eklenir: `padding-left: max(var(--safe-left), var(--space-6));`.
- Grid: 3 kolon (liste sayfaları).
- Max-width: `min(1280px, 100%)` ile ortalanır.

### 11.2 Telefon yatay (≤896px landscape)

- TopBar yüksekliği 48px'e iner.
- BottomNav 72px'e iner.
- Hero yüksekliği azalır (overflow bırakılır).
- Form: tek kolon korunur (iki kolona geçilmez).

### 11.3 Tablet dikey (768-1023)

- Grid: 2 kolon (liste).
- TopBar standart 56px.
- Side padding: `var(--space-6)`.

---

## 12. ERİŞİLEBİLİRLİK

- `:focus-visible` her tıklanabilir element (Madde 5.2).
- `<img>` alt zorunlu (dekoratif için `alt=""`).
- `<label htmlFor>` form input'u (placeholder yetmez).
- `aria-label` icon-only button'larda.
- `aria-expanded` accordion'da.
- `aria-current="page"` aktif nav item'da.
- `role` doğru kullanım.
- `prefers-reduced-motion: reduce` → tüm animasyon kaldır.
- Renk kontrastı WCAG AA (4.5:1 body, 3:1 büyük metin/UI).
- Touch target ≥44×44.
- Klavye navigasyonu: Tab, Enter, Esc.

---

## 13. PERFORMANS

- `next/image` zorunlu tüm görsellerde.
- Hero image: `priority` prop.
- Ekran dışı image: `loading="lazy"`.
- Image sizes attribute doğru: `sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"`.
- `font-display: swap` (layout'ta tanımlı).
- Sadece transform + opacity animate.
- Critical CSS inline (Next.js otomatik).
- Lazy loaded client components mümkünse.

---

## 14. SEO

`CLAUDE.md` Madde 10 geçerli. Mobil için ek:

- Viewport meta: `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`.
- Mobile-friendly test: Google Search Console ile kontrol.
- Core Web Vitals: LCP <2.5s, CLS <0.1, FID/INP <200ms.
- Her sayfa JSON-LD: Organization, Article (blog), ContactPage (iletişim), FAQPage (SSS), BreadcrumbList.

---

## 15. KALİTE KAPISI (DoD)

### 15.1 Mekanik kontroller (grep)

```bash
# Hardcoded font-size
grep -rnE "font-size:\s*[0-9]+px" app/ src/ | grep -v "var(--" | grep -v "input\|textarea\|select\|button" | wc -l
# Beklenen: 0

# Hardcoded border-radius
grep -rnE "border-radius:\s*[0-9]+px" app/ src/ | grep -v "var(--" | wc -l
# Beklenen: 0

# Hardcoded spacing (4'ün katı olmayan)
grep -rnE "(gap|padding|margin)(-[a-z]+)?:\s*[0-9]+px" app/ src/ | grep -v "var(--" | wc -l
# Beklenen: 0

# width:100vw / height:100vh YASAK
grep -rnE "(width|max-width):\s*100vw" app/ src/ | wc -l
# Beklenen: 0
grep -rnE "height:\s*100vh" app/ src/ | grep -v "100dvh\|100svh\|viewport-height" | wc -l
# Beklenen: 0

# pointer: coarse en az 10 dosyada var
grep -rln "pointer: coarse\|pointer:coarse" app/ src/ | wc -l
# Beklenen: ≥10
```

### 15.2 TypeScript + Lint

```bash
npx tsc --noEmit
# Beklenen: temiz

npx eslint .
# Beklenen: temiz
```

### 15.3 Manuel viewport testi

Her sayfa için:
- 360×640 (küçük telefon dikey)
- 390×844 (iPhone 14 dikey)
- 430×932 (iPhone 14 Pro Max dikey)
- 844×390 (iPhone 14 yatay)
- 768×1024 (iPad Mini dikey)
- 1024×1366 (iPad Pro dikey)
- 1366×680 (14.6" tablet yatay) ← **özellikle bu**
- 1280×800 (dokunmatik laptop, pointer:coarse forced)

Kontrol:
- [ ] TopBar sticky
- [ ] BottomNav sabit, safe-area
- [ ] İçerik kırılma yok, taşma yok
- [ ] Pill button tüm sayfada aynı
- [ ] Card tüm sayfada aynı
- [ ] Focus ring BEYAZ
- [ ] Animasyon 250ms altında
- [ ] Tap feedback var

### 15.4 Komponent tekilliği

```bash
# BlogShell/BlogStoryShell ikizliği bitmeli — tek Desktop + tek Mobile
find src/components/blog -name "*.tsx" -type f
# Beklenen: BlogMobile.tsx, BlogDesktop.tsx (liste); BlogDetailMobile.tsx, BlogDetailDesktop.tsx (detay) veya 2 ayrı shell

# Pill stil tekilliği
grep -rln "rounded-full\|border-radius: var(--radius-full)" src/ app/ | wc -l
# Tek Pill komponenti kullanılmalı, 5 farklı CSS sınıfı YASAK
```

---

## 16. DEFINITION OF DONE (DoD)

Bir faz tamam sayılır:

- [ ] Spec'e uygun (bu dokümanda tanımlı madde)
- [ ] Grep kontrolleri temiz (Madde 15.1)
- [ ] `npx tsc --noEmit` temiz
- [ ] `npx eslint` temiz
- [ ] 8 viewport'ta manuel kontrol (Madde 15.3)
- [ ] CLAUDE.md ihlal raporu yok
- [ ] Gerekli ise screenshot eklenmiş

---

## 17. DOKUMAN KULLANIM AKIŞI

1. **Kod yazılmadan önce** bu doküman Cursor'a/Codex'e verilir (prompt ile birlikte).
2. Cursor ilgili maddeyi referans alır.
3. Tamamlanan iş review checklist ile denetlenir.
4. Sapma varsa reddedilir, düzeltme istenir.
5. Tüm fazlar bittiğinde bu doküman `v1.1`'e revize edilir (varsa öğrenilenler eklenir).

---

*Versiyon: 1.0 — Turuncu Solar mobil tek dil sözleşmesi.*
*Bağlı: CLAUDE.md > MOBILE-DESIGN-SYSTEM.md > sayfa CSS.*
