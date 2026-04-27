# 📋 DENETİM RAPORU

> **Kaynak:** AGENTS.md v3.0 (Mart 2026 — iPad Pro 12.9 landscape + tablet container kuralları eklendi)
> **Tarih:** 26 Nisan 2026
> **Kod tabanı:** `turuncu/`
> **Build:** `npx tsc --noEmit` ✓ temiz · `npx eslint .` ✓ temiz

---

## 📊 ÖZET

| Kategori | Sayı | Etki |
|---|---|---|
| 🔴 **Kritik** | 3 ihlal | iPad Pro yatay'da bottom nav görünmez, yanlış shell |
| 🟠 **Yüksek** | 4 ihlal (200+ satır) | Token disiplini bozuk, tema değişiminde toplu kırılma |
| 🟡 **Orta** | 3 ihlal | Dosya hijyeni, gelecek ihlal riski |
| 🔵 **Şüpheli** | 1 madde | İncelenmeli, context bağımlı |
| ✅ **Geçti** | 16 madde | tsc + eslint dahil |

---

## ✅ TAMAMEN UYUMLU MADDELER

| § | Madde | Detay |
|---|---|---|
| §0.1 | Kurallar değişmez | AGENTS.md v3.0 mevcut, dosya tek kaynak |
| §0.2 | Desktop = Mobile içerik eşdeğer | Sayfaların çoğu Mobile/Desktop split (BlogShell, ReferencesShell, IletisimRouter, vs.) |
| §0.3 | Hover-only davranış | 151 hover'ın 74'ü `@media (hover: hover)` guard içinde; kalanı `:focus`/`:active` (state stilleri) |
| §0.4 | AGENTS.md taşınabilir | Dosya kökte, versiyonlu (v3.0) |
| §1 | Ekran sınırları | `breakpoints.ts` doğru token'ları export ediyor |
| §2.1.2 | Shell query merkezi | `SHELL_HANDHELD_QUERY` = `MQ.maxMd` ∪ `SHELL_TOUCH_TABLET_QUERY` ∪ `SHELL_LARGE_TABLET_VIEWPORT_QUERY` |
| §2.1.2 | Hook'lar tek kaynak kullanıyor | `useViewportProfile`, `useResponsiveShell`, `useWideNavLayout` — hepsi `breakpoints.ts`'den |
| §6 | `width: 100vw` | 0 aktif kullanım (sadece comment) |
| §6 | `height: 100vh` | 0 aktif kullanım (sadece comment) |
| §6 | `body/html { overflow: hidden }` | 0 aktif kullanım |
| §6 | `scroll-snap-type: y mandatory` | 0 ihlal |
| §8 | Native `<select>` mobilde | MobilePicker mevcut, IletisimMobile kullanıyor |
| §9 | `outline: none` | 0 ihlal |
| §9 | Focus ring beyaz | `--color-focus-ring` token global tanımlı |
| §12 | Z-index keyfi 1000+ | 0 ihlal — hepsi `--z-*` token'ında |
| §15 | `.bak`/`.old`/`_copy` dosyalar | 0 dosya |
| §17 | TypeScript strict + tsc + eslint | İkisi de temiz |

---

## ❌ İHLALLER (öncelik sırasına göre)

---

### 🔴 KRİTİK — 3 ihlal

#### 🚨 K1. §2.1.7 — Bottom nav desktop guard eksik

```
❌ İHLAL: src/styles/components/bottom-nav.css:216
📜 KURAL: §2.1.7 — Desktop kararı (hover: hover) and (pointer: fine) içermeli

🔧 MEVCUT:
   @media (min-width: 1280px) {
     .ui-bottom-nav { display: none; }
   }

🔧 OLMASI GEREKEN:
   @media (min-width: 1280px) and (hover: hover) and (pointer: fine) {
     .ui-bottom-nav { display: none; }
   }

💡 GEREKÇE:
   iPad Pro 12.9" yatay (1366×1024 touch) — viewport 1280px üstü ama
   pointer: coarse. Mevcut CSS bottom nav'ı GİZLER. AppChrome'da
   showDesktopHeader = false olduğu için BottomNav JSX'te render edilse
   bile CSS gizliyor. Bu §2.1.7 + §2.1.3 ihlali.
```

#### 🚨 K2. §2.1.2 — HomePageClient'ta keyfi matchMedia (1024px)

```
❌ İHLAL: app/HomePageClient.tsx:418
📜 KURAL: §2.1.2 — Component'ler kendi içinde keyfi matchMedia yazamaz

🔧 MEVCUT:
   const mediaQuery = window.matchMedia("(max-width: 1024px)");

🔧 OLMASI GEREKEN:
   import { SHELL_HANDHELD_QUERY } from "@/lib/breakpoints";
   const mediaQuery = window.matchMedia(SHELL_HANDHELD_QUERY);

💡 GEREKÇE:
   1024px keyfi sınır:
   - iPad Air yatay  (1180px)  — yanlış sınıflanır
   - iPad Pro 11 yatay  (1194px) — yanlış sınıflanır
   - iPad Pro 12.9 yatay (1366px) — yanlış sınıflanır
   Hepsi mobil aile ama isMobileViewport false döner.
```

#### 🚨 K3. §3 — Tailwind utility'leri token sistemini bypass ediyor

```
❌ İHLAL: app/error.tsx:21       → className="text-2xl font-bold text-slate-900"
❌ İHLAL: app/global-error.tsx:22 → className="text-2xl font-bold"
❌ İHLAL: app/not-found.tsx:6    → className="text-4xl font-bold text-slate-900"

📜 KURAL: §3 — Tüm font-size token'a bağlı, hardcoded YASAK

💡 GEREKÇE: Tailwind text-2xl/text-4xl token sistemini bypass eder.
   CLS riski + responsive bozar. Slate-900 brand renk token'ı değil.

🔧 OLMASI GEREKEN: var(--text-2xl) / var(--text-4xl) + var(--color-text-primary)
```

---

### 🟠 YÜKSEK — 4 kategori, 200+ satır

#### Y1. §3 — Hardcoded font-size (input istisnası hariç)

```
❌ İHLAL: 7 satır toplam
   app/sistemlerimiz/sistemlerimiz.css:1980  font-size: 11px
   app/sistemlerimiz/sistemlerimiz.css:2000  font-size: 13px
   app/sistemlerimiz/sistemlerimiz.css:2049  font-size: 12px
   app/sistemlerimiz/sistemlerimiz.css:2053  font-size: 11px
   app/sistemlerimiz/sistemlerimiz.css:2163  font-size: 10px !important
   app/sistemlerimiz/sistemlerimiz.css:2281  font-size: 11px
   app/sistem-farklari/sistem-farklari.css:411  font-size: 1em

📜 KURAL: §3 "Hardcoded font-size: 14px benzeri değerler YASAK"

🔧 11px → var(--text-2xs)
   12px → var(--text-2xs)
   13px → var(--text-2xs)
   1em → var(--text-base) veya bağlam token'ı

✓ İZİNLİ (input/textarea iOS zoom önleme):
   blog-kesif.css:2061, iletisim-mobile.css:811, mobile-picker.css:39
```

#### Y2. §3 — Özel `clamp()` font-size (token zaten clamp üretir)

```
❌ İHLAL: 41 satır toplam
   app/hakkimizda/hakkimizda-systems-desktop.css → 35+ satır
   Diğer dosyalarda dağınık 5-6 satır

📜 KURAL: §3 "Özel clamp(px, vw, px) yazma — TOKEN zaten fluid"

🔧 ÖRNEK:
   ❌ font-size: clamp(28px, 3vw, 46px)
   ✓ font-size: var(--text-3xl)  /* zaten 30→35→40 clamp eder */

💡 GEREKÇE: Manuel clamp tema değişiminde tek noktadan güncellenemez.
   CLS riski (vw değişen viewport'ta sürekli reflow).
```

#### Y3. §14 — Hardcoded border-radius

```
❌ İHLAL: 87 satır toplam, dosya bazlı:
   app/page.css                                  → 50 ihlal
   app/sistemlerimiz/sistemlerimiz.css           → 18 ihlal
   app/hakkimizda/hakkimizda-systems-desktop.css → 15 ihlal
   app/blog/blog-kesif.css                       → 2  ihlal
   src/styles/components/unified-header.css      → 1  ihlal
   src/styles/components/blog-detail.css         → 1  ihlal

📜 KURAL: §14 — border-radius token kullanılmalı

🔧 EŞLEME:
   2px   → var(--radius-sm)  (en yakın)
   6px   → var(--radius-sm)
   10px  → var(--radius-md)
   12px  → var(--radius-md)  (en yakın)
   14px  → var(--radius-lg)
   16px  → var(--radius-lg)  (en yakın)
   18px  → var(--radius-xl)
   20px  → var(--radius-xl)
   22px  → var(--radius-xl)  (en yakın)
   24px  → var(--radius-2xl)
   999px → var(--radius-full)
```

#### Y4. §5 — 4'ün katı olmayan spacing

```
❌ İHLAL: 70 satır toplam, dosya bazlı:
   app/page.css                                  → 58 ihlal
   app/hakkimizda/hakkimizda-systems-desktop.css → 7  ihlal
   app/sistemlerimiz/sistemlerimiz.css           → 4  ihlal
   app/sistem-farklari/sistem-farklari.css       → 1  ihlal

📜 KURAL: §5 "4'ün katı olmayan değer (3, 5, 7, 9, 13, ... — YASAK)"

🔧 EŞLEME:
   6px  → var(--space-2) (8) veya --space-1 (4)
   10px → var(--space-3) (12)
   14px → var(--space-4) (16)
   18px → var(--space-5) (20)
   19px → var(--space-5) (20)
   22px → var(--space-6) (24)
```

---

### 🟡 ORTA — 3 ihlal

#### O1. §6 — Sayfa CSS'lerinde `overflow-x: hidden`

```
⚠ ŞÜPHELİ: 5 dosya
   app/blog/blog-kesif.css:34          (with !important)
   app/blog/secenekler/secenekler.css:21
   app/hakkimizda/hakkimizda-systems-desktop.css:126
   app/iletisim/iletisim.css:63
   app/page.css:133

📜 KURAL: §6 "overflow-x: clip SADECE html'de"

💡 GEREKÇE: hidden iOS momentum scroll bozar; clip semantik olarak doğru.
   Sayfa wrapper'larında hidden — html'e taşınmalı veya clip yapılmalı.
```

#### O2. §15 — Boş klasör

```
⚠ İHLAL: app/preview/kurumsal-premium/  (boş klasör)
📜 KURAL: §15 "Boş klasör (orphan) YASAK"
🔧 Sil veya placeholder ekle.
```

#### O3. §15 — Kökte mockup HTML

```
⚠ İHLAL: 24 adet showcase HTML kökte
   SHOWCASE-A-Solstice.html, SHOWCASE-A2-Solstice-DARK.html,
   SHOWCASE-A2-Solstice-Pro.html, SHOWCASE-B-Voltage.html,
   SHOWCASE-B2-Voltage-Pro.html
   iletisim-V1-cilali.html ... iletisim-V4-3kolon.html (4 dosya)
   sss-V1-magazine.html ... sss-V10-glass-luxe.html (12 dosya)

📜 KURAL: §15 "Mockup HTML kökte YASAK"

🔧 ÖNERİ: /mockups/ veya /preview-static/ klasörü oluştur, hepsini taşı.
   .gitignore'a /mockups/* eklenebilir (build dışı).

💡 NOT: Bunlar tasarım iterasyonunda üretilen dosyalar. Repo temizliği için.
```

---

### 🔵 ŞÜPHELİ — 1 madde

#### S1. §0.2.1 — Tablet container şüpheli max-width

```
⚠ ŞÜPHELİ: app/referanslar/references-kesif.css:1618
   max-width: 720px

📜 KURAL: §0.2.1 "768-1279 tablet bandında ana container'ı 720px ile
   ortada bırakmak YASAK; width:100% + padding token kullanılmalı"

🔧 İNCELENMELİ:
   1. Bu satır hangi @media bloğunda?
   2. Ana sayfa container'ı mı yoksa okuma sütunu mu?
   3. Eğer >=768 bandında ana içerik container'ı ise YASAK.

ℹ DOĞRU KULLANIM REFERANSI:
   src/styles/components/blog-detail.css:164  max-width: 800px
   → Okuma sütunu (~70ch §3.2 uyumlu), OK.
```

---

## 🎯 ÖNERİLEN DÜZELTME PLANI

### 🚀 Hızlı (Kritikleri bitir, ~30 dk)

1. **`bottom-nav.css:216`** — query'ye `and (hover: hover) and (pointer: fine)` ekle (1 satır)
2. **`HomePageClient.tsx:418`** — `SHELL_HANDHELD_QUERY` import et, query'yi değiştir (2 satır)
3. **`error.tsx`, `not-found.tsx`, `global-error.tsx`** — Tailwind text-* utility'lerini token-bazlı className'e çevir (3 dosya)

### 🔧 Orta süre (Token disiplinini düzelt, ~2 saat)

4. **`referanslar/references-kesif.css:1618`** — context incele, ihlal ise düzelt
5. **`sistemlerimiz.css`** — 6 hardcoded font-size → token (10 dk)
6. **`sistem-farklari.css:411`** — `font-size: 1em` → token (1 dk)
7. **`hakkimizda-systems-desktop.css`** — 35+ özel `clamp()` → token'a çevir (45 dk)
8. **`app/preview/kurumsal-premium/`** — boş klasör sil (1 dk)
9. **5 dosyada `overflow-x: hidden`** — `clip`'e çevir veya html'e taşı (15 dk)

### 🧹 Geniş cleanup (Repo hijyeni, 3-4 saat)

10. **87 hardcoded `border-radius`** → script ile bulup token'a çevir, elle onay
11. **70 hardcoded `spacing` (6/10/14/18/19/22 px)** → token
12. **24 mockup HTML kökten** → `/mockups/` veya `/preview-static/` taşı

---

## 📈 SKOR

```
Kural uyum oranı:    16/20 madde = %80
Kritik ihlal:         3 (responsive shell entegrasyonu)
Token disiplin:       %38 ihlal yoğunluğu (CSS dosyalarında)
Build:                ✓ tsc temiz, ✓ eslint temiz
A11y temel:           ✓ outline, focus ring, aria
Şu anki durum:        Çalışır ama yeni AGENTS v3 kuralı için iyileştirme gerekli
```

---

## 🔄 SONRAKI ADIMLAR

Önerilen iş akışı:
1. Bu raporu tarih damgasıyla sakla (versiyon takibi)
2. Hızlı düzeltmeleri (#1-3) hemen yap → kritikler biter
3. Orta vadeli düzeltmeler için ayrı PR
4. Geniş cleanup için script + code review akışı kur
5. Yeni sayfa eklerken bu rapor checklist'ini kullan (§19)

---

*Versiyon: v1.0 — 26 Nisan 2026*
*Kapsam: AGENTS.md v3.0'ın 20 maddesi denetlendi*
