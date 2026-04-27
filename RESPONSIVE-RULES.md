# Turuncu Solar — Responsive & Simetri Kuralları

> Bu doküman AGENTS.md §0.2, §0.2.1, §0.2.2 ve MOBILE-DESIGN-SYSTEM.md §1, §2'nin
> sıkıştırılmış, uygulanabilir özetidir. Her tasarım/kod kararı bunlara uymalı.

---

## 1. CİHAZ MATRİSİ — gerçek viewport'lar

Her ekran her cihazda test edilir. Tasarım bu listenin tamamında çalışmak zorunda.

### 1.1 Telefon (≤767px)

| Cihaz | Dikey | Yatay |
|---|---|---|
| iPhone SE 2020 | **375×667** | 667×375 |
| iPhone 14 | **390×844** | 844×390 |
| iPhone 14 Pro Max | **430×932** | 932×430 |
| Pixel 7 | 412×915 | 915×412 |
| Galaxy S23 | 360×800 | 800×360 |

**En dar telefon: 360px. En geniş: 430px.** Tasarım 360'tan başlamalı.

### 1.2 Tablet (768–1279px)

| Cihaz | Dikey | Yatay | Pointer |
|---|---|---|---|
| iPad Mini 6 | **744×1133** | 1133×744 | coarse |
| iPad Air | **820×1180** | **1180×820** | coarse |
| iPad Pro 11" | **834×1194** | **1194×834** | coarse |
| iPad Pro 12.9" | **1024×1366** | **1366×1024** | coarse |
| Galaxy Tab S9 Ultra 14.6" | ~904×1449 | **1366×680** | coarse |
| Surface dokunmatik laptop | 1280×800+ | 1280×800+ | coarse |

**Kritik nokta:** iPad Pro 12.9" yatay (1366px) ve 14.6" Galaxy yatay (1366px) — viewport olarak desktop genişliğinde **ama dokunmatik**. Bunlar **mobil aile**ye dahil.

### 1.3 Desktop (≥1280px + pointer:fine)

| Sınıf | Aralık |
|---|---|
| 13" laptop | 1280–1439 |
| Standart desktop | 1440–1919 |
| Geniş ekran | 1920+ |

---

## 2. BREAKPOINT SİSTEMİ — tek kural

**Mobil aile** (telefon + tablet + dokunmatik tablet/laptop) tek query ile tespit:

```css
@media (max-width: 1279px), (pointer: coarse) { /* MOBİL */ }
```

**Desktop** sadece:

```css
@media (min-width: 1280px) and (pointer: fine) { /* DESKTOP */ }
```

### 2.1 Detay breakpoint'ler (mobil aile içinde)

```css
/* Telefon — küçük */
@media (max-width: 480px) { ... }

/* Telefon — standart */
@media (max-width: 767px) { ... }

/* Tablet dikey */
@media (min-width: 768px) and (max-width: 1023px) { ... }

/* Tablet yatay / büyük tablet */
@media (min-width: 1024px) and (max-width: 1279px) { ... }

/* Yatay-only telefon (TopBar daralır) */
@media (max-width: 896px) and (orientation: landscape) { ... }

/* Tablet yatay + dokunmatik (1366×680 gibi geniş ama mobil) */
@media (min-width: 1024px) and (pointer: coarse) { ... }
```

### 2.2 JavaScript tespiti

```ts
const mq = window.matchMedia(
  "(max-width: 1279px), (pointer: coarse)"
);
const isMobile = mq.matches; // mobil aile
```

`(max-width: 1024px)` veya benzer dar query KULLANMA — iPad Pro yatayı kaçırır.

---

## 3. MOBİL AİLE = TEK DAVRANIŞ

**Kural (AGENTS §0.2.1):**

> Telefon ve tablet aynı mobil sistemin iki ölçeğidir. Ayrı tasarım dili üretilemez.

- Telefonda **şube switch** nasılsa, tablette de aynı.
- Telefonda **bottom nav** varsa, tablette de var (etiketli olabilir).
- Telefonda **MobilePicker** açılıyorsa, tablette de açılır (geniş bottom sheet).
- Telefonda **kategori chip'leri yatay scroll** ediyorsa, tablette de scroll eder (wrap edip kesilmez).

### 3.1 Tablet farkları (sadece bunlar serbest)

- **Container genişliği** büyür (oransal)
- **Padding-inline** büyür (clamp ile)
- **Grid kolon sayısı** artar (1 → 2 → 3)
- **Font-size** clamp ile ölçeklenir (zorla büyütme yok)
- **Görsel yükseklik** orantısal artar
- **Bottom nav** etiketleri görünür

### 3.2 Tablet farkı OLMAYAN

- Davranış (tıklama/açılma/kapanma)
- Sıra (içerik aynı sırada)
- Hizalama mantığı
- Component identity (aynı pill, aynı card)
- Tap feedback
- Scroll davranışı

---

## 4. ORANTISAL BÜYÜME — clamp() prensibi

**Kural:** Telefonda küçük → tablette orta → desktopta büyük. Hardcoded font-size YASAK. Tüm boyutlar `clamp(min, fluid, max)` veya token ile.

### 4.1 Font scale (token sistemi)

| Token | Telefon | Tablet | Desktop |
|---|---|---|---|
| `--text-2xs` | 12px | 12.5px | 13px |
| `--text-xs` | 14px | 14.5px | 15px |
| `--text-sm` | 15px | 15.5px | 16px |
| `--text-base` | 16px | 17px | 18px |
| `--text-lg` | 18px | 19px | 20px |
| `--text-xl` | 20px | 22px | 24px |
| `--text-2xl` | 24px | 27px | 30px |
| `--text-3xl` | 30px | 35px | 40px |
| `--text-4xl` | 36px | 45px | 56px |
| `--text-5xl` | 44px | 58px | 72px |

Token'lar zaten `clamp()` üretir. Üstüne `clamp()` veya `vw` yazmak YASAK.

### 4.2 Padding scale

| Token | Telefon | Tablet | Desktop |
|---|---|---|---|
| Sayfa padding-inline | `--space-3` (12) | `--space-6` (24) | `--space-8` (32) |
| Section gap | `--space-12` (48) | `--space-16` (64) | `--space-20` (80) |
| Card padding | `--space-4` (16) | `--space-5` (20) | `--space-6` (24) |

Dinamik için: `padding: clamp(16px, 4vw, 48px)` — min 16, ekrana göre artar, max 48.

### 4.3 Görsel yükseklik

Hero görseli vs. — `clamp` ile:
```css
.hero-img {
  height: clamp(160px, 28vw, 320px);
}
```

### 4.4 Touch target — DEĞİŞMEZ

**Min 44×44px** (Apple HIG). Telefon + tablet + desktop hepsinde aynı:
```css
button, .pill, .nav-item {
  min-height: 44px;
  min-width: 44px;
}
```

Tablette "büyük ekran var" diye küçültme YASAK.

---

## 5. SİMETRİ KURALLARI

**Kural (AGENTS §0.2.2):**

> Aynı bölüm içindeki ana bloklar aynı sol/sağ hatta başlar ve biter.

### 5.1 Container hizalaması

- Şube switch (segment kontrol) genişliği = altındaki harita genişliği = altındaki bilgi kartı genişliği
- Üst başlık, paragraf, alt CTA — hepsi aynı padding-inline ile aynı x koordinatında başlar/biter
- "Göz kararı" ortalama YASAK — container genişliği tek kaynak

### 5.2 Tablet'te orantı bozulması

Tablet büyürken:
- 3 kolon grid'in tüm sütunları **eşit genişlikte**
- Kart yükseklikleri **eşit** (içerik az olsa bile padding ile dengelenir)
- Bir blok 720px ise **aynı section'daki diğer ana bloklar da aynı hizada** — biri 720, diğeri 680 olamaz

### 5.3 İçerik simetrisi bozulursa

Önce `container/hizalama` düzeltilir.
**YASAK çözümler:**
- Font küçültmek
- Eleman saklamak (`display:none` + responsive)
- `overflow:hidden` ile kesmek
- `scale()` ile sıkıştırmak

### 5.4 Asimetrik bilinçli tasarım (split layouts)

7+5 veya 8+4 split kullanılıyorsa:
- İki kolon **görsel olarak dengeli** (az içerik olan tarafa boşluk veya görsel ekle)
- Mobile'a düşünce dikey stack — sol kolon önce, sağ kolon altında
- Sıra korunur

---

## 6. CONTAINER GENİŞLİK DİSİPLİNİ

| Bağlam | Max-width |
|---|---|
| Telefon | 100% (padding ile) |
| Tablet dikey | 100% — 600px max |
| Tablet yatay | 900px max |
| Desktop 13" | 1200px |
| Desktop standart | **1440px sabit** (AGENTS §6) |
| Desktop geniş | 1440px ortalı (yan boşluk büyür) |

### 6.1 Reading column (okuma sütunu)

Body metin / blog yazı / SSS cevap için:
- `max-width: 65–75ch` (göz yormama)
- `>80ch` YASAK
- Tablet/desktop'ta sayfa genişler ama metin sütunu sabit kalır

---

## 7. ORIENTATION (yatay/dikey) DAVRANIŞI

### 7.1 Telefon yatay (≤896px landscape)

```css
@media (max-width: 896px) and (orientation: landscape) {
  /* TopBar yüksekliği: 56 → 48px */
  /* BottomNav yüksekliği: 88 → 72px */
  /* Form: tek kolon korunur (2 kolona geçilmez) */
  /* Hero yüksekliği azalır (overflow OK) */
  /* Safe-area left+right uygulanır (notch için) */
}
```

### 7.2 Tablet dikey (768-1023)

- Grid 2 kolon (liste sayfaları)
- TopBar 56px
- Side padding `--space-6` (24px)

### 7.3 Tablet yatay (1024-1366)

- Grid 3 kolon (liste)
- Container max `min(1280px, 100%)` ortalı
- Bottom nav etiketli görünür
- 14.6" tablet (1366×680) yatay: pointer:coarse → mobil layout

### 7.4 iPad Pro 12.9" özel

- Dikey 1024×1366 → 3 kolon, premium kart boyutu
- Yatay 1366×1024 → desktop genişliği ama hala mobil (coarse), 4 kolona kadar açılabilir
- TopBar+BottomNav aynı

---

## 8. BOTTOM NAV — tablet de dahil

**Kural:** Mobil ailede bottom nav her zaman görünür. Telefondaki davranış tablette de aynı.

### 8.1 Telefon

- 5 ikon yan yana (4 nav + 1 FAB ortada)
- Sadece ikon (etiket gizli)
- Floating capsule veya edge-to-edge
- Min item: 44×44

### 8.2 Tablet (yeni)

- Aynı 5 item — ama label göster
- Daha geniş padding (8 → 14px)
- Capsule daha geniş ya da edge-to-edge bar
- Min item: 44px yükseklik (genişlik daha rahat)

### 8.3 Desktop

- BottomNav **GİZLİ** (`display: none`)
- TopBar tam menü gösterir

```css
.bottom-nav { display: flex; }
@media (min-width: 1280px) and (pointer: fine) {
  .bottom-nav { display: none; }
}
```

---

## 9. METİN TAŞMA / SARMA / ELLIPSIS

**Kural (AGENTS §3.3):** Bilgi kaybı YASAK.

| Senaryo | Davranış |
|---|---|
| Sayı, kısa meta (örn. "75 kW") | `white-space: nowrap` OK |
| Adres, açıklama, e-posta | `overflow-wrap: anywhere` ile sar |
| Form label, kart başlığı | Tek satır olmalı; sığmıyorsa **font düşür** veya **container genişlet** |
| Picker/dropdown seçenekleri | `text-overflow: ellipsis` OK ama `title` attr ile tam gösterilebilir |
| Body paragraf | Sar, kesme yok |

`text-overflow: ellipsis` bilgi kaybı yaratıyorsa **YASAK**.

---

## 10. TOUCH + ETKİLEŞİM (mobil aile, tablet dahil)

### 10.1 Touch hedef

- ≥ 44×44px (Apple HIG, AGENTS §8)
- Buton aralığı ≥ 8px

### 10.2 Native dropdown YASAK (mobil ailede)

- `<select>` mobilde MobilePicker'a sarılır
- BottomSheet açılır, alttaki inputlara binmez
- iPad Pro yatay'da da MobilePicker (pointer:coarse → mobil)

### 10.3 Tap feedback

- Touch target tıklanınca `transform: scale(0.97)` veya `:active` background change
- Telefon + tablet aynı feedback

### 10.4 Hover

- **Sadece** `@media (hover: hover) and (pointer: fine)` içinde tanımlı
- Mobil/tablette tetiklenmez

### 10.5 Klavye

- Tab/Enter/Escape/Ok tuşları her tıklanabilir elementte
- Beyaz focus ring (turuncu DEĞİL)

---

## 11. RENK + FOCUS RING

- Marka turuncu **sadece** CTA, aktif state, brand vurgu
- Focus ring **BEYAZ** (`rgba(255,255,255,0.85)`)
- `outline: none` YASAK
- `outline: 2px solid var(--color-focus-ring); outline-offset: 2px;`

---

## 12. TOKEN DİSİPLİNİ

### 12.1 ZORUNLU

- `padding: var(--space-N)` — hardcoded px YASAK
- `border-radius: var(--radius-N)` — keyfi YASAK
- `font-size: var(--text-N)` — keyfi YASAK
- `z-index: var(--z-N)` — keyfi YASAK

### 12.2 İSTİSNA

- `input { font-size: 16px }` — iOS zoom önleme (TEK izinli hardcoded)
- 1px border (Retina alt-pixel) — alt token olmadığı için OK

### 12.3 Spacing scale (4px tabanlı)

```
4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 80 · 96
```

3, 5, 7, 9, 11, 13, 15 gibi 4'ün katı olmayan değer **YASAK**.

---

## 13. GREP KONTROL (Definition of Done)

```bash
# Hardcoded font-size yok
grep -rnE "font-size:\s*[0-9]+px" app/ src/ | grep -v "var(--" | grep -v "input\|textarea" | wc -l
# Beklenen: 0

# Hardcoded border-radius yok
grep -rnE "border-radius:\s*[0-9]+px" app/ src/ | grep -v "var(--" | wc -l
# Beklenen: 0

# pointer: coarse en az 10 dosyada
grep -rln "pointer: coarse" app/ src/ | wc -l
# Beklenen: ≥10

# 100vw yok (iOS'ta kırılır)
grep -rnE "(width|max-width):\s*100vw" app/ src/ | wc -l
# Beklenen: 0

# 100vh yok (iOS'ta kırılır — 100svh / 100dvh kullan)
grep -rnE "height:\s*100vh" app/ src/ | grep -v "100dvh\|100svh" | wc -l
# Beklenen: 0

# tsc temiz
npx tsc --noEmit
# Beklenen: hata yok
```

---

## 14. KONTROL LİSTESİ — yeni sayfa eklerken

- [ ] `(max-width: 1279px), (pointer: coarse)` kullanıldı (mobil aile)
- [ ] Telefonda 360px'te taşma yok
- [ ] iPhone SE (375×667) test edildi
- [ ] iPhone 14 Pro Max (430×932) test edildi
- [ ] iPad Mini (744×1133) dikey test
- [ ] iPad Pro 11" (834×1194) dikey + yatay test
- [ ] iPad Pro 12.9" (1024×1366) dikey + yatay test
- [ ] 14.6" tablet yatay (1366×680) test — **özellikle bu**
- [ ] Desktop 1280, 1440, 1920 test
- [ ] Bottom nav telefon + tablette görünüyor, desktop'ta gizli
- [ ] Touch target ≥44px her yerde
- [ ] Focus ring BEYAZ
- [ ] Native `<select>` yok (MobilePicker kullanıldı)
- [ ] Hardcoded px yok (sadece input 16px)
- [ ] Tablet'te wrap+overflow:visible yerine scroll
- [ ] Simetri: ana bloklar aynı sol/sağ hatta hizalı
- [ ] Metin kırpma yok (ellipsis ile bilgi kaybı yok)

---

## 15. ÖZET — bir cümlede

> Telefon ne yapıyorsa tablet de **aynısını yapar**, sadece **oransal büyür**. Davranış değişmez, sıra değişmez, simetri korunur. iPad Pro 12.9" ve 14.6" tablet yatayı **mobil ailedir** — 1366px geniş olsa bile dokunmatik olduğu için. Desktop ancak ≥1280 **ve** mouse varsa devreye girer.

---

*Versiyon: v1.0 — Mart 2026 referans dökümü.*
*Kaynak: AGENTS.md §0.2/§0.2.1/§0.2.2/§1/§2/§3/§5/§7/§8 + MOBILE-DESIGN-SYSTEM.md §1/§2/§3/§4*
