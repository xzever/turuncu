# REVIEW CHECKLIST — Faz Denetim Prosedürü

> Bu doküman **her faz Cursor'dan döndükten sonra** Claude (ve insan denetleyici) tarafından izlenir.
>
> Her faz için: **(1) Mekanik kontrol → (2) Spec uyum kontrolü → (3) Manuel viewport testi → (4) Karar**.
>
> Herhangi bir kontrol başarısız olursa **REDDEDİLİR**, düzeltme prompt'u üretilir, Cursor'a geri gönderilir.

---

## 0. Genel

Her denetim başında:

```bash
cd turuncu
git status                    # Beklenen değişiklik dosya listesi
git diff --stat               # Değişiklik hacmi
```

Değişiklik listesi **prompt'ta "Değiştirilen dosyalar" bölümüyle eşleşmeli**. Fazla dosya varsa → Cursor scope dışı bir şey yapmış, incele.

---

## 1. Mekanik Kontroller (tüm fazlar için geçerli)

```bash
# TypeScript
npx tsc --noEmit
# Beklenen: hiç hata yok

# Eslint
npx eslint . --max-warnings 0
# Beklenen: hiç warning/error yok

# Hardcoded font-size (input 16px hariç)
grep -rnE "font-size:\s*[0-9]+px" app/ src/ | grep -v "var(--" | grep -v "16px"
# Beklenen: boş

# Hardcoded border-radius
grep -rnE "border-radius:\s*[0-9]+px" app/ src/ | grep -v "var(--"
# Beklenen: boş

# Hardcoded spacing
grep -rnE "(gap|padding|margin)(-[a-z]+)?:\s*[0-9]+px" app/ src/ | grep -v "var(--"
# Beklenen: boş

# 100vw YASAĞI
grep -rnE "(width|max-width):\s*100vw" app/ src/
# Beklenen: boş

# 100vh YASAĞI (dvh/svh dışında)
grep -rnE "height:\s*100vh" app/ src/ | grep -v "viewport-height\|100dvh\|100svh"
# Beklenen: boş

# outline: none YASAK
grep -rn "outline:\s*none" app/ src/ | grep -v "data-no-outline\|focus-visible"
# Beklenen: boş

# pointer: coarse kullanım sayısı
grep -rln "pointer: coarse\|pointer:coarse" app/ src/ | wc -l
# Beklenen: ≥ faz numarası (Faz 00 sonrası 1+, Faz 10 sonrası ≥10)

# Focus ring beyaz kontrolü
grep -rn "outline-color" app/ src/ | grep -v "focus-ring\|var(--color-focus-ring)\|rgba(255,\s*255,\s*255"
# Beklenen: boş (hepsi beyaz token'a bağlı)

# Hover guard kontrolü (ham :hover varsa guard içinde olmalı)
grep -rn ":hover" app/ src/ | wc -l
# Karşılaştırma:
grep -rn "@media (hover: hover)" app/ src/ | wc -l
# Oran: :hover sayısı ≤ hover-guard sayısı × ortalama 3
```

---

## 2. Faz-Spesifik Kontroller

### Faz 00 — Foundation

- [ ] `src/lib/useResponsiveShell.ts` birleşik media query kullanıyor: `(max-width: 1279px), (pointer: coarse)`
- [ ] `src/lib/useViewportProfile.ts` dosyası var
- [ ] `src/styles/mobile-foundation.css` dosyası var
- [ ] `src/app/layout.tsx`'te import edilmiş
- [ ] `viewport-fit: cover` meta'da
- [ ] `app/page.css:1198-1199` artık `100vw` yok
- [ ] `grep "pointer: coarse" src/` ≥ 3 sonuç

### Faz 01 — UI Kit

- [ ] `src/components/ui/mobile/` klasörünün içinde 12 `.tsx` dosyası
- [ ] `src/styles/components/mobile/` klasöründe 12 `.css` dosyası
- [ ] Her komponent `"use client"` (gereken)
- [ ] Her komponent prop type export etmiş
- [ ] `app/preview/mobile-ui-kit/page.tsx` render ediyor (dev'de)
- [ ] `<Pill>` 5 varyant desteklemiş
- [ ] `<BottomSheet>` swipe-dismiss + focus trap + Esc
- [ ] `<TopBar>` sticky + safe-top + 3-zone
- [ ] `<BottomNav>` sadece mobilde görünür
- [ ] Hover'lar guard içinde

### Faz 02 — Blog

- [ ] `BlogRouter`, `BlogDesktop`, `BlogMobile`, `BlogDetailRouter`, `BlogDetailDesktop`, `BlogDetailMobile` var
- [ ] `app/blog/page.tsx` Router import ediyor
- [ ] `app/blog/[slug]/page.tsx` aynı
- [ ] UI Kit tüketimi (Pill, Card, TopBar, BottomSheet, SearchInput, SectionHeader, EmptyState, ShareSheet)
- [ ] Grid: 1 kolon ≤767, 2 kolon 768-1023, 3 kolon 1024+ coarse
- [ ] Hero image `priority` prop
- [ ] JSON-LD `ItemList` (liste) + `Article` (detay)
- [ ] `blog-mobile.css` ve `blog-detail-mobile.css` dosyaları var
- [ ] Eski `blog-kesif.css`'te mobile blokları temizlendi veya `// TODO: FAZ 10` işaretli

### Faz 03 — SSS

- [ ] `SssRouter`, `SssDesktop` (mobil SSS yok)
- [ ] UI Kit `Accordion` kullanılmış
- [ ] JSON-LD `FAQPage`
- [ ] `app/sss/sss.css`'te hardcoded 999px, 12px, 16px radius → token
- [ ] `max(16px, var(--text-sm))` gibi zorlama kalmamış

### Faz 04 — İletişim

- [ ] `IletisimRouter`, `IletisimDesktop`, `IletisimMobile`
- [ ] Form a11y: `<label htmlFor>`, `autoComplete`, `inputMode`
- [ ] JSON-LD `ContactPage`
- [ ] `iletisim-mobile.css` yeniden yazılmış
- [ ] `gap: 6px`, `padding: 6px 10px`, `font-size: 32px` YOK

### Faz 05 — Sistemlerimiz

- [ ] Router/Desktop/Mobile split
- [ ] Pill tab → panel deseni
- [ ] `margin-left: 19px` YOK
- [ ] `border-radius: 18px/22px/28px` YOK (token'a çevrildi)
- [ ] JSON-LD `ItemList`

### Faz 06 — Hakkımızda

- [ ] Router/Desktop/Mobile split
- [ ] Stats (4 kart), Values, Timeline, Team bölümleri
- [ ] JSON-LD `AboutPage`

### Faz 07 — Referanslar

- [ ] Router/Desktop/Mobile split (eski `ReferencesShell` → `ReferencesDesktop` rename)
- [ ] Blog mobile ile TEK dil (aynı card, pill, filter sheet)
- [ ] Filter `<BottomSheet>` kullanıyor
- [ ] JSON-LD `CollectionPage`

### Faz 08 — Sistem Farkları

- [ ] Router/Desktop/Mobile split
- [ ] Tab pill → panel
- [ ] Karşılaştırma mobil-dostu sıkıştırılmış

### Faz 09 — Ana Sayfa

- [ ] `HomeRouter`, `HomeDesktop`, `HomeMobile`
- [ ] Hero LCP prioritized, `priority` prop
- [ ] 2x2 quick grid
- [ ] Horizontal scroll kategoriler (scroll-snap)
- [ ] JSON-LD `WebSite` + `Organization`
- [ ] Menu BottomSheet tüm sayfalara linkleri veriyor

### Faz 10 — Cleanup

- [ ] Tüm eski mobile blokları silindi veya işaretlendi
- [ ] Orphan komponentler silindi
- [ ] Import sırası doğru
- [ ] `npm run build` temiz
- [ ] Sitemap tüm sayfaları içeriyor
- [ ] `preview/mobile-ui-kit` noindex

---

## 3. Manuel Viewport Testi

Faz 02+ her sayfa için **bu 8 viewport'ta** test. Browser devtools + physical device.

| Viewport | Açıklama |
|---|---|
| 375×667 | iPhone SE 2020 dikey |
| 390×844 | iPhone 14 dikey |
| 430×932 | iPhone 14 Pro Max dikey |
| 844×390 | iPhone 14 yatay |
| 768×1024 | iPad Mini dikey |
| 1024×1366 | iPad Pro dikey |
| **1366×680** | **14.6" tablet yatay — KULLANICI CİHAZI** |
| 1280×800 | Dokunmatik laptop (Surface) — pointer:coarse |

Her viewport'ta:

- [ ] Sayfa yüklenmesinde CLS < 0.1 (görsel kayma yok)
- [ ] TopBar sticky + safe-top
- [ ] BottomNav sabit (mobil), safe-bottom
- [ ] İçerik taşmıyor, yatay scroll yok
- [ ] Grid kolon sayısı MDS'e uygun (1/2/3)
- [ ] Pill button 44×44 min touch
- [ ] Focus ring **beyaz** (tab ile gez)
- [ ] `:active` tap feedback var (scale 0.97-0.98)
- [ ] Animasyon 250ms altında smoothly
- [ ] Landscape'te TopBar daraldı
- [ ] BottomSheet swipe-down kapanıyor (pointer simulation)
- [ ] Esc tuşu BottomSheet kapatıyor
- [ ] Formda klavye açıldığında layout bozulmuyor
- [ ] Hero image LCP < 2.5s (Lighthouse)

---

## 4. Lighthouse Audit (Faz 10 sonrası)

Her ana sayfa için mobil Lighthouse:

- Performance ≥ 85
- Accessibility ≥ 95
- Best Practices ≥ 95
- SEO ≥ 95

CLS: <0.1, LCP: <2.5s, FID/INP: <200ms.

---

## 5. Karar Matrisi

| Durum | Karar |
|---|---|
| Tüm kontroller ✓ | **Kabul** — sonraki faza geç |
| Grep 1-2 ihlal | **Koşullu kabul** — Cursor'a mini prompt: "şu 2 dosyada şu satırda ihlal, düzelt" |
| Grep ≥3 ihlal | **Red** — faz yeniden çalıştır, prompt hatayı açıkla |
| tsc/eslint hata | **Red** — blocker |
| Spec sapması | **Red** — prompt güncelle, detaylandır |
| Viewport test 1 hata | **Koşullu kabul** — sonraki faza geç + cleanup fazına ekle |
| Viewport test ≥3 hata | **Red** — faz tekrar |

---

## 6. Dokümantasyon

Her faz kabul sonrası:

- [ ] Git commit: `feat(mobile): Faz NN - [kapsam]`
- [ ] MDS'te öğrenilen varsa `v1.X` güncelle
- [ ] Bir sonraki faz prompt'unda eksik referans varsa ekle

Final (Faz 10) sonrası:

- [ ] `MOBILE-DESIGN-SYSTEM.md` versiyonu `v1.0 → v1.1`
- [ ] Değişiklik log'u oluştur (`/docs/mobile-changelog.md`)
- [ ] Screenshot'lar al (8 sayfa × 3 viewport = 24) + `/docs/screenshots/mobile/` altına koy

---

*Bu doküman Claude'un denetim protokolü. Her faz sonrası bu sırayla izlenir.*
