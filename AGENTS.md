# TURUNCU SOLAR — TEK KURAL DOSYASI

> Bu dosya **tek geçerli kuraldır**. Eski `docs/ANAYASA.md`, `KURALLAR-*.md`, `STANDARDS.md`, `HEADER_RULES.md`, `PROJE-KURALLARI.md`, `AGENTS.md` SİLİNDİ. Çelişki yok — bu dosya kazanır.
>
> **Bu dosya yeni projelere taşınır.** Yeni bir siteye başlandığında bu kurallar baz alınır; her proje için sıfırdan kural yazılmaz.

---

## 0. DEĞİŞMEZLİK PRENSİPLERİ — KURAL ÜSTÜ KURALLAR

Bu 4 prensip, aşağıdaki tüm maddelerden üstündür. Bir çelişki varsa bu bölüm kazanır.

### 0.1 KURALLAR ASLA DEĞİŞMEZ

- Tasarım ne olursa olsun kurallar değişmez.
- Yeni müşteri, yeni sayfa, yeni talep — kurallar ezilmez.
- "Bu sefer istisna olsun" YASAK.
- Kural ihlal etmeden tasarım yapılamıyorsa, tasarım değişir, kural değişmez.

### 0.2 DESKTOP = MOBİL (TASARIM & İÇERİK EŞDEĞERLİĞİ)

- Desktop'ta yapılan **tasarım ve içerik**, mobilde **birebir aynı**dır.
- Desktop'ta olan her UI öğesi mobilde de vardır (ve tersi).
- Desktop'ta bir button varsa mobilde de aynı işlev vardır.
- Desktop'ta bir bölüm varsa mobilde de aynı bilgi sunulur.
- Layout/biçim cihaza göre uyarlanır; **içerik asla kesilmez**.
- Tasarım yaparken **desktop'tan başla, mobili aynı anda düşün**.

### 0.2.1 TELEFON = TABLET (MOBİL AİLESİ EŞ DAVRANIŞI)

- Telefon ve tablet **aynı mobil sistemin iki ölçeğidir**; ayrı tasarım dili üretilemez.
- iPad Pro 12.9 yatay gibi büyük tabletler CSS genişliği `1280px` üstüne çıksa bile mobil ailede kalır: `pointer: coarse` + `hover: none` + `≤1366px` veya `1280–1366px` + `min-height:800px` → MobileTopbar + BottomNav.
- UA/SSR cihaz tipi `tablet` veya `mobile` ise client viewport genişliği sonradan büyüse bile mobil aile kazanır. Desktop shell sadece UA `desktop` + tablet viewport değilse açılır.
- Telefonda yapılan her davranış tablet üzerinde de aynıdır: şube switch, kart sırası, form akışı, picker/dropdown, bottom nav, tap feedback.
- Tablet sadece ekran genişliğine göre **oransal büyür ve nefes alır**; davranış, içerik, sıra, hizalama mantığı değişmez.
- Tablet dikeyde telefon akışı korunur; sadece ana kolon genişliği, harita yüksekliği ve kart boşlukları ekranı dolduracak şekilde büyür.
- Tablet ekran genişliği boşa bırakılmaz: `768–1279px` aralığında ana sayfa container'ı keyfi `720px/900px` gibi dar bir `max-width` ile ortada bırakmak YASAK. Telefon akışı korunur ama ana kolon `width: 100%` kullanır; sol/sağ padding token/clamp ile artar.
- Tablet için özel davranış gerekiyorsa önce telefon davranışı bozulmadan büyütülür; farklı komponent/akış son çaredir.
- “Telefonda iyi, tablette başka” YASAK. İkisi de aynı app hissini vermeli.

### 0.2.2 MOBİL SİMETRİ VE BAŞLANGIÇ-BİTİŞ HATLARI

- Aynı bölüm içindeki ana bloklar aynı sol/sağ hatta başlar ve biter: istatistik kartları, şube switch, harita, iletişim kartları, form kartı.
- Şube switch gibi segment kontrolü, altındaki harita/kart bloğu ile aynı dış genişlikte olmalıdır.
- Kart/grid elemanları “göz kararı” ortalanmaz; container genişliği tek kaynak olur.
- Tablet büyürken bloklar farklı oranlarda büyüyemez. Bir blok 720px ise aynı bölümdeki ana bloklar da aynı hatta oturur.
- Tablet simetrisinde ana blokların dış hattı viewport'a göre kurulur; harita, switch, kart grid'i ve form aynı container genişliğini kullanır. Ortada dar kolon bırakıp çevrede boş alan oluşturmak hata sayılır.
- İçerik simetrisi bozuluyorsa önce container/hizalama düzeltilir; font küçültmek veya eleman saklamak çözüm değildir.

### 0.3 DAVRANIŞ TUTARLILIĞI

- Fare (mouse) ve parmak (touch) aynı UX'i verir.
- Kaydırma, sürükleme, tıklama — her iki ortamda da çalışır.
- Hover-only davranış YASAK (touch'ta yok).
- Drag/swipe hareketi hem mouse hem parmak ile çalışmalı.

### 0.4 SÜREKLİLİK

- Bu kural dosyası projeden projeye taşınır.
- Yeni siteye başlandığında **AGENTS.md kopyalanır**, sıfırdan yazılmaz.
- İyi olan şey değişmez; yeni kural eklenir, eskisi silinmez.

---

## 1. EKRAN SINIRLARI

| Terim | Aralık | Davranış |
|---|---|---|
| **mobil** | ≤1279px + tablet viewport ≤1366px | Telefon + tablet. Tek terim. |
| **desktop** | ≥1280px ve tablet viewport değil | lg + xl + 2xl. Tek terim. |

- `MQ.maxMd` = `(max-width: 1279px)` → mobil
- `SHELL_TOUCH_TABLET_QUERY` = `(hover: none) and (pointer: coarse) and (max-width: 1366px)` → mobil aile
- `SHELL_LARGE_TABLET_VIEWPORT_QUERY` = `(min-width: 1280px) and (max-width: 1366px) and (min-height: 800px)` → iPad Pro 12.9 landscape koruması
- `MQ.lg` = `(min-width: 1280px)` → desktop adayı; tablet viewport ise mobil aile kazanır
- 13" özel kompakt: `(min-width: 1280px) and (max-width: 1439px)`

---

## 2. RESPONSIVE PATTERN

İki yaklaşım kullanılır — proje gereksinimine göre:

**A) Responsive CSS (tek bileşen)** — *Referanslar örneği*
```tsx
// Aynı component, davranış CSS @media ile yönetilir
export default function MyShell() {
  return <div>...</div>;
}
```
```css
@media (max-width: 1279px) { /* mobil davranış */ }
@media (min-width: 768px) and (max-width: 1366px) { /* tablette scale-up */ }
@media (min-width: 1280px) and (hover: hover) { /* desktop */ }
```

**B) Component split** — *İletişim, Hakkımızda örnekleri*
```tsx
const isMobileOrTablet = useResponsiveShell();
if (isMobileOrTablet) return <MyMobile />;
return <MyDesktop />;
```

**Kural:** `useResponsiveShell()` mevcuttur (`src/lib/useResponsiveShell.ts`), her sayfa bunu veya CSS responsive'i kullanır.

---

## 2.1 RESPONSIVE & MOBİL APP SHELL — SERT YAN KURAL

Bu bölüm telefon, tablet, iPad Pro, büyük Android tablet, dokunmatik laptop ve desktop ayrımını netleştirir. Amaç tek tek yama yapmak değil; her sayfanın aynı shell mantığıyla stabil çalışmasıdır.

### 2.1.1 CİHAZ MATRİSİ — TEST EDİLECEK GERÇEK VIEWPORT'LAR

Her yeni mobil/tablet tasarım bu ekranlarda kontrol edilir:

| Sınıf | Viewport | Not |
|---|---:|---|
| Galaxy dar telefon | `360×800` | En dar pratik telefon tabanı |
| iPhone SE / küçük telefon | `375×667` | Dikeyde sıkışma testi |
| iPhone 12/13/14 | `390×844` | Ana telefon referansı |
| iPhone Pro Max | `430×932` | Geniş telefon |
| Telefon yatay | `844×390`, `932×430` | Topbar/bottombar sıkışma testi |
| iPad Mini | `744×1133` | Tablet dikey, mobil aile |
| iPad Air | `820×1180` | Tablet dikey, mobil aile |
| iPad Pro 11" | `834×1194`, `1194×834` | Tablet dikey+yatay |
| iPad Pro 12.9" | `1024×1366`, `1366×1024` | Geniş olsa bile touch ise mobil aile |
| Büyük Android tablet | `1366×680` | Yatay büyük tablet, touch ise mobil aile |
| 13" laptop | `1280×800` | Pointer fine ise desktop |
| Standart desktop | `1440×900` | Desktop referans |
| Geniş ekran | `1920×1080` | 1440px container ortalama testi |

### 2.1.2 SHELL KARARI — WIDTH TEK BAŞINA YETMEZ

Desktop kararı sadece `width >= 1280` ile verilemez. iPad Pro 12.9" ve büyük Android tabletler `1366px` genişliğe çıkabilir ama kullanım hâlâ parmak/touch davranışıdır.

**Mobil aile:**

```css
@media (max-width: 1279px),
  ((min-width: 1280px) and (max-width: 1366px) and (pointer: coarse)) {
  /* mobile/tablet shell */
}
```

**Desktop:**

```css
@media (min-width: 1280px) and (hover: hover) and (pointer: fine) {
  /* desktop shell */
}
```

**JavaScript tarafında tek kaynak kullanılır:**

- `src/lib/breakpoints.ts`
- `src/lib/useViewportProfile.ts`
- `src/lib/useResponsiveShell.ts`

Her component kendi içinde farklı `matchMedia("(min-width: 1280px)")` kararı yazamaz. Shell kararı merkezi hook/query ile alınır.

### 2.1.3 TELEFON = TABLET — DAVRANIŞ DEĞİŞMEZ

Telefon ve tablet aynı mobil sistemdir. Tablet yeni tasarım dili değildir.

Tablet sadece şunları değiştirebilir:

- Container genişliği oransal büyür.
- Padding token ile artar.
- Liste/kart grid kolon sayısı kontrollü artabilir.
- Görsel/harita yüksekliği oransal büyür.
- Bottom nav etiketleri daha rahat gösterilebilir.

Tablet şunları değiştiremez:

- İçerik sırası.
- Picker/dropdown davranışı.
- Form akışı.
- Segment/tab mantığı.
- Tap feedback.
- Bottom nav varlığı.
- Component kimliği.

“Telefonda app, tablette web sayfası” YASAK.

### 2.1.4 MOBİL APP FRAME KURALI

Mobil ailede sayfa, topbar ile bottombar arasında bağımsız bir uygulama alanı gibi düşünülür.

```txt
MobileTopbar
↓
App Frame / Page Canvas
  - kompakt app header
  - primary content
  - segment/tab/picker
  - kendi içinde scroll eden body
↓
BottomNav
```

Zorunlu kurallar:

- İçerik bottombar/FAB altında kalamaz.
- Ana CTA bottombar ile çakışamaz.
- App frame yüksekliği `topbar-clearance` ve `bottomnav-clearance` hesaba katılarak kurulur.
- Mobil sayfa “desktop hero küçültmesi” gibi davranamaz.
- Uzun içerik gerekiyorsa dış sayfayı değil, ilgili app body alanını kontrollü scroll ettir.
- Tablet yatayda da aynı app frame davranışı korunur.
- **Tek viewport — sayfa aşağı inmez**. App body topbar ile bottombar arasında sığar; uzun içerik panel-içi scroll ile yönetilir. Detay: bkz. Madde 6.1.
- **Full-bleed — sağ/sol tam kullanılır**. Ortada dar kolon + iki yan boş YASAK. Detay: bkz. Madde 6.2.

### 2.1.5 TİPOGRAFİ — MOBİL ÜST SINIR

Mobil ailede yazı büyüklüğü bağlama göre seçilir; tablet için yazı zorla büyütülmez.

| Bağlam | Mobil üst sınır | Token |
|---|---:|---|
| Meta / overline | 13px | `--text-2xs` |
| Buton / chip label | 15px | `--text-xs` |
| Body | 16–18px | `--text-base` |
| Kart başlığı | 20–24px | `--text-lg` / `--text-xl` |
| App/page başlığı | 30–40px | `--text-3xl` |
| Hero başlığı | 40px max | `--text-3xl` dikkatli |

Yasak:

- Mobilde dev hero başlığıyla ekranın yarısını yemek.
- Tablet için ekstra `vw` font büyütmesi yazmak.
- Kart içinde `--text-2xl` ve üstünü gelişigüzel kullanmak.
- Metin sığmayınca fontu gizlice küçültmek yerine container/hiyerarşi hatasını çözmek.

### 2.1.6 SİMETRİ VE CONTAINER KURALI

Aynı section içindeki ana bloklar aynı dış hatta başlar ve biter.

Zorunlu:

- Segment/tab genişliği, altındaki ana kart/harita/form bloğu ile aynı container mantığından gelir.
- Telefon ve tablette aynı container sistemi kullanılır.
- Tablet büyürken bir blok genişleyip diğer blok dar kalamaz.
- 2xl desktopta ana container `1440px` max ve ortalıdır.
- Okuma metinlerinde satır genişliği `65–75ch` bandında tutulur; `>80ch` YASAK.

Yasak:

- Göz kararı ortalama.
- `display:none` ile içerik saklayarak simetri düzeltmek.
- `overflow:hidden` ile yazı/kart kesmek.
- `scale()` ile layout sıkıştırmak.

### 2.1.7 BOTTOM NAV — MOBİL AİLEDE ZORUNLU

Mobil ailede bottom nav görünür. Desktopta gizlenir.

```css
.bottom-nav {
  display: flex;
}

@media (min-width: 1280px) and (hover: hover) and (pointer: fine) {
  .bottom-nav {
    display: none;
  }
}
```

Telefon:

- 5 item düzeni korunur.
- Touch target minimum `44×44px`.
- Etiketler alan darsa kısalabilir ama bilgi kaybı yaratamaz.

Tablet:

- Aynı item sırası ve aynı davranış korunur.
- Etiketler görünür olabilir.
- Bar genişliği/padding büyüyebilir.

### 2.1.8 TOUCH, PICKER VE HOVER

Mobil ailede her etkileşim touch-first tasarlanır.

Zorunlu:

- Tıklanabilir her hedef en az `44×44px`.
- Butonlar arası en az `8px`.
- `:active` veya pressed feedback vardır.
- `:focus-visible` beyaz ring kullanır.
- Klavye: Tab, Enter, Escape, ok tuşları çalışır.
- Swipe varsa buton/tap alternatifi de vardır.

Yasak:

- Hover-only davranış.
- Native `<select>` ile sistem mavi/beyaz dropdown.
- Picker/list açılırken alttaki inputların üstüne binmesi.
- Tablet yatayda picker'ı desktop dropdown'a çevirmek.

### 2.1.9 ORIENTATION KURALI

Telefon yatay:

- Topbar/bottombar sıkışmaz.
- Form tek kolon kalır.
- Hero/görsel kısalır.
- Safe-area left/right dikkate alınır.

Tablet dikey:

- Telefon akışı korunur.
- Container ve padding büyür.

Tablet yatay:

- Touch ise mobil ailede kalır.
- Bottom nav korunur.
- App frame genişler ama desktop nav'a geçmez.

### 2.1.10 DEFINITION OF DONE — RESPONSIVE DENETİM

Her mobil/tablet iş sonunda şunlar kontrol edilir:

- `360×800`, `375×667`, `390×844`, `430×932` taşmasız.
- `744×1133`, `820×1180`, `834×1194` tablet dikey taşmasız.
- `1194×834`, `1366×1024`, `1366×680` touch/tablet yatay mobil shell.
- `1280×800` pointer fine desktop shell.
- `1440×900`, `1920×1080` desktop container ortalı.
- Bottom nav mobil/tablette görünür, desktopta gizli.
- Topbar + bottombar arasında içerik çakışmaz.
- Touch target minimum `44×44px`.
- Focus ring beyaz.
- Native `<select>` yok.
- Hardcoded font-size yok.
- `width:100vw`, `height:100vh`, root `overflow:hidden` yok.
- Bilgi kaybı yapan ellipsis yok.
- Ana blokların sol/sağ hatları simetrik.
- `npm run typecheck` ve `npm run lint` temiz.

### 2.1.11 ANTI-YAMA KURALI

Bir sayfada mobil/tablet sorun çıkarsa önce şu sıra izlenir:

1. Shell kararı doğru mu?
2. Topbar/bottombar clearance doğru mu?
3. App frame var mı, yoksa sayfa web akışı mı?
4. Container hattı tek kaynak mı?
5. Tipografi token bağlamı doğru mu?
6. Touch hedefleri ve picker davranışı aynı mı?
7. Telefon/tablet aynı içerik ve aynı sırayı mı kullanıyor?

Bu kontroller yapılmadan breakpoint'e özel küçük yama yazmak YASAK.

---

## 3. TİPOGRAFİ — TEK KAYNAK

**Dosya:** `src/styles/tokens/typography.css`

```
--text-2xs   12-13px   (overline, meta)
--text-xs    14-15px   (ikincil)
--text-sm    15-16px   (small body)
--text-base  16-18px   (BODY default — SEO min)
--text-lg    18-20px
--text-xl    20-24px
--text-2xl   24-30px
--text-3xl   30-40px (--text-h2)
--text-4xl   36-56px (--text-h1)
--text-5xl   44-72px (hero)
```

### YASAKLAR
- ❌ Hardcoded `font-size: 14px` benzeri değerler
- ❌ Body font < 12px
- ❌ Input font ≠ 16px (iOS zoom önleme)
- ❌ Özel `clamp(px, vw, px)` yazma — TOKEN zaten fluid (phone → desktop clamp'li)

### ZORUNLU
- ✅ Tüm font'lar `var(--text-*)` token'ına bağlı
- ✅ Title'larda token kullan — token kendisi `clamp()` üretir
- ✅ `font-display: swap`

### 3.1 BAŞLIK HİYERARŞİSİ — Bağlam → Token

> Bu tablo, **telefon (≤767)**, **13" (1280–1439)** ve **büyük ekran (≥1440)** için optimize edilmiştir. Kart/popup başlıkları burada tanımlanan MAX tokeni geçmez — aksi takdirde telefon taşar, 13" çirkin görünür.

| Bağlam | Token | Phone → 13" → Big |
|---|---|---|
| Meta / overline / tarih | `--text-2xs` | 12 → 12.5 → 13px |
| İkincil bilgi / buton label | `--text-xs` | 14 → 14.5 → 15px |
| Küçük body / açıklama | `--text-sm` | 15 → 15.5 → 16px |
| Gövde paragrafı (default) | `--text-base` | 16 → 17 → 18px |
| Lead paragraf | `--text-lg` | 18 → 19 → 20px |
| **Kart içi başlık (dar kart, ≤360px)** | `--text-base` | 16 → 17 → 18px |
| **Kart içi başlık (normal kart)** | `--text-lg` | 18 → 19 → 20px |
| **Modal/Popup/Dialog başlığı (MAX)** | `--text-xl` | 20 → 22 → 24px |
| Bölüm (section) başlığı | `--text-2xl` | 24 → 27 → 30px |
| Sayfa başlığı (h1) | `--text-3xl` | 30 → 35 → 40px |
| Hero ana başlık | `--text-4xl` | 36 → 45 → 56px |
| Tam-ekran splash hero | `--text-5xl` | 44 → 58 → 72px |

**YASAKLAR (hiyerarşi ihlali):**
- ❌ Popup/modal başlığında `--text-2xl` veya üstü — telefonda taşar
- ❌ Dar kart (≤400px) içinde `--text-xl` veya üstü — kart sığmaz
- ❌ Bağlam değiştikçe aynı blokta ayrı ayrı override (13" için ayrı, mobil için ayrı). Token zaten fluid; **ek override yazma**. Override gerekiyorsa BAĞLAM YANLIŞ seçilmiştir, token seviyesini düşür.

### 3.2 OKUNABİLİRLİK ÜST SINIRLARI — Google SEO + CWV uyumu

> Google Core Web Vitals ve Readability sinyalleri için her bağlamda **üst sınır**. Bu sınırların ÜSTÜNE çıkmak YASAK — telefon düzeni bozulur, büyük ekranda okunabilirlik düşer, Google görsel stabilite penaltısı alır.

| Bağlam | Telefon MAX | Desktop MAX | Kullanılacak Token |
|---|---|---|---|
| Gövde / paragraf | 18px | 20px | `--text-base` veya `--text-lg` |
| Meta / overline | 13px | 14px | `--text-2xs` / `--text-xs` |
| Kart başlığı | 20px | 22px | `--text-base` / `--text-lg` |
| Popup / Modal başlığı | 22px | 24px | `--text-xl` |
| Section başlığı | 28px | 32px | `--text-2xl` |
| Page H1 | 32px | 40px | `--text-3xl` |
| Hero başlığı | 40px | 48px | `--text-3xl` veya `--text-4xl` (dikkatli) |

**Katı YASAKLAR:**
- ❌ Desktop'ta **>48px** başlık — telefon kırılır, Google ceza verir
- ❌ Mobilde **>40px** başlık — 360px ekranda kelime kırılır / taşar
- ❌ Hero'da `--text-5xl` (44-72px) — sadece tam-ekran splash'da izinli, blog/içerik sayfalarında YASAK
- ❌ Satır genişliği **>80ch** — uzun metinde göz yorulur (body `max-width: 65-75ch`)
- ❌ `line-height` < 1.4 paragraf metninde (başlıklarda ≥1.1 OK)

**Google E-E-A-T/CWV mantığı:**
- Büyük başlık ≠ iyi tasarım. İçerik hiyerarşisi + whitespace daha etkili.
- CLS (Cumulative Layout Shift) — font boyutu sabit token'dan geldiğinde stabilize kalır; hardcoded vw değerleri CLS riski.
- FID (First Input Delay) — küçük, sabit tipografi daha hızlı render olur.

### 3.3 YAZI TAŞMA VE MOBİL OKUNABİLİRLİK KURALLARI

- Yazılar hiçbir breakpoint'te kırpılmaz, üst üste binmez, bottom nav / FAB altında kalmaz.
- Kart içi metinlerde `white-space: nowrap` sadece sayı, kısa meta veya tek satır zorunlu alanlarda kullanılır; adres, açıklama, uzun e-posta ve form metinleri sarmalanabilir olmalıdır.
- Uzun metinler için `overflow-wrap: anywhere` veya uygun satır kırılımı kullanılır; `text-overflow: ellipsis` bilgi kaybı yaratıyorsa YASAK.
- Telefon ve tablet tipografi token'ı aynı bağlamda aynı kalır. Tablet için sadece container büyür; yazı gereksiz büyütülmez.
- Form label'ları, kart başlıkları ve bottom nav etiketleri tek satırda okunmalı; sığmıyorsa bağlam token'ı düşürülür veya container düzeni düzeltilir.
- Açılır seçenek/picker metinleri native mavi sistem UI gibi görünemez; koyu/açık tema fark etmeksizin proje tasarım sistemiyle aynı tipografi ve renkleri kullanır.

---

## 4. RENK — TEK KAYNAK

**Dosya:** `src/styles/tokens/colors.css`

- `--color-primary` (turuncu) → sadece marka, CTA, aktif state
- **Focus ring** → BEYAZ (`rgba(255, 255, 255, 0.85)`), TURUNCU DEĞİL
- Her renk değeri token'a bağlı

### 4.1 BACKGROUND GRADIENT'LERİ — TEK KAYNAK

> Sayfa arka planı tasarımcı keyfine göre seçilmez. UI Kit Token Studio'da **iki gradient** vardır; sayfa içeriğine göre biri seçilir. Üçüncüsü YASAK.

| Token | Sahne | Gradient | Kullanım |
|---|---|---|---|
| **Warm** (default) | sıcak güneş radyali | `radial-gradient(ellipse at 50% 25%, #FFB060 0%, #FF8C3A 30%, #C25218 65%, #2A1008 100%)` | Anasayfa, sistemlerimiz, kurumsal — birincil tema |
| **Deep** | yoğun referans / detay sahneleri için | `radial-gradient(ellipse at 50% 70%, #FF8C3A 0%, #D4621A 35%, #B83A0E 70%, #1A0907 100%)` | İletişim, SSS, referanslar, fiyat detayı, vaka çalışması — bilgi yoğun sayfalar |

Zorunlu:
- App-frame sayfaları (iletişim, SSS) **Deep** kullanır. İçerik yoğun, dikkat alt yarıya çekilir.
- Pazarlama/landing odaklı sayfalar (anasayfa, sistemlerimiz hero) **Warm** kullanır.
- Sayfa arka planı `body:has(.<page-class>)` selector'ü ile **uygulama-kabuğu** üzerine değil, **doküman seviyesinde** verilir; `background-attachment: fixed`.
- Aynı sayfada gradient karıştırılmaz; tek gradient sayfanın tamamında geçerlidir.

Yasak:
- ❌ Sayfaya özgü, kit dışı yeni gradient üretmek (`50% 30%`, `50% 50%` gibi farklı pozisyonlar).
- ❌ Warm + Deep'i aynı sayfada karıştırmak.
- ❌ Solid renk arka plan (`background: #1F1410`) — sahne hissi kaybolur.
- ❌ Video/görsel arka plan ile gradient'i çakıştırmak.

---

## 5. SPACING — TEK KAYNAK

**Dosya:** `src/styles/tokens/spacing.css`

```
--space-1   4px
--space-2   8px
--space-3   12px
--space-4   16px
--space-5   20px
--space-6   24px
--space-8   32px
--space-10  40px
--space-12  48px
--space-16  64px
--space-20  80px
--space-24  96px
```

### YASAKLAR
- ❌ Hardcoded `gap: 10px`, `padding: 7px` benzeri keyfi değerler
- ❌ 4'ün katı olmayan değer (3, 5, 7, 9, 13, ... — YASAK)

### ZORUNLU
- ✅ Tüm `gap`, `padding`, `margin` `var(--space-*)` token'ına bağlı

---

## 6. LAYOUT

### 6.1 TEK VIEWPORT — DOCUMENT SCROLL YOK, TEK SCROLL ALANI

> **Kural net:** Document/body scroll YASAK — topbar ve bottombar yerinde kalır, asla aşağı kaymaz. Sayfada **bir tek scroll alanı** olur; o da kabuğun kendisidir (mobilde) veya kabuk içindeki listedir (desktop'ta uzun bir kolon varsa). **Çift scroll YASAK** — kullanıcı parmağını kaydırırken hangi şeyin kaydığını anlayamaz.

İki cihaz iki davranış:

**Mobil (`.iletisim-m`, `.sss-mobile`):**
- Kabuk: `height: 100dvh; max-height: 100dvh; overflow-y: auto; overflow-x: hidden`.
- Topbar/bottombar `position: fixed` → yerinde kalır.
- Tüm içerik (hero, seg, map, info-card, form, vb.) doğal akışta yer alır; kabuk içinde tek scroll ile akar.
- İç paneller (form, accordion, info-card) **kendi başına scroll etmez** — çift scroll yaratmaz.

**Desktop (`.contact-desktop-page`, `.sss-desktop`):**
- Kabuk ve shell: `flex: 1 1 auto; min-height: 0; overflow: hidden`.
- Tüm içerik tek viewport'a sığacak şekilde grid/flex ile **kalan yüksekliği tüketir**.
- Eğer bir kolon (accordion list, form içeriği) doğal olarak uzunsa **o kolon** `overflow-y: auto` ile scroll eder; sayfanın geri kalanı kımıldamaz.
- Document scroll, masaüstünde de YASAK.

Ortak zorunluluklar:

- `#main-content.app-chrome-main` zorunlu olarak `max-height: 100dvh; min-height: 0`. Aksi halde body `min-h-[100dvh]` ile büyüyüp document scroll yaratabilir.
- App-frame sayfalarında `body` ek olarak `height: 100dvh; max-height: 100dvh; overflow: clip` kazanır (`:has(.iletisim-m)`, `:has(.sss-mobile)`, `:has(.contact-desktop-page)`, `:has(.sss-desktop)`). `overflow: hidden` değil `clip` kullanılır (iOS scroll-restoration kırılmaz).
- Mobil app-frame sayfasında `main-content` padding'i sıfırlanır; sayfa kendi `--topbar-clearance` + `--bottomnav-clearance` padding'ini yönetir. Aksi halde double-padding olur, içerik altta kesilir.
- Yükseklik birimi: `100dvh`/`100svh`. `100vh` YASAK (iOS adres çubuğu kırar).
- Header çakışması: `--site-header-clearance` (≥1280px) `main-content` padding-top'ı olarak verilir.

Test edilmesi zorunlu viewport'lar (atlamak YASAK):

| Cihaz / Senaryo | CSS viewport | Senaryo özeti |
|---|---|---|
| iPhone SE | 375×667 | mobil, dar yükseklik |
| iPhone 14 | 390×844 | mobil, standart |
| iPhone 14 Pro Max | 430×932 | mobil, geniş |
| iPad mini portrait | 744×1133 | tablet dikey |
| iPad Pro 11 portrait | 834×1194 | tablet dikey |
| iPad Pro 12.9 landscape | 1366×1024 | tablet yatay (mobil shell) |
| **13" 4K @ %300** | **1280×720** | **desktop shell, en sıkışık** |
| 13" 4K @ %250 | 1536×864 | desktop shell |
| 13" 4K @ %200 | 1920×1080 | desktop shell |
| 14"–15" laptop | 1440×900 | desktop shell |
| 27" QHD | 2560×1440 | desktop shell, geniş |
| 4K monitör | 3840×2160 | desktop shell, çok geniş |

Her viewport'ta:
1. Document scroll bar görünmez (yatay/dikey).
2. Header altında içerik kesilmez.
3. Bottom nav (mobil) içerik üstüne binmez.
4. Form/accordion uzunsa kendi panelinde scroll eder, sayfa kıpırdamaz.

Yasak:
- ❌ `body { overflow: visible | auto | scroll }` — document scroll YASAK.
- ❌ Sayfa kabuğunda `min-height: 100vh` + uzun grid → document scroll yaratır.
- ❌ **Çift scroll**: kabuk scroll ederken iç panel de scroll etmek (örn. mobilde sayfa scroll + form içi scroll).
- ❌ Mobilde `.iletisim-m { overflow: hidden }` + iç form `{ overflow-y: auto }` → form'un üstündeki içerik (hero, map, info) görünmez, kullanıcı kaybolur. **Telefon ekranında her şey tek wrapper scroll'unda akar.**
- ❌ Desktop'ta tüm sayfayı scroll edilebilir yapmak (anasayfa hariç). App-frame sayfa tek viewport.
- ❌ "Aşağıda devamı var" hissi yaratan tasarım — uzun bölüm varsa o bölüm scroll eder, sayfa değil.
- ❌ "1280×720'de görünmüyor olabilir, sonra bakarız" — bu viewport şart.

### 6.2 FULL-BLEED — SAĞ VE SOL TAM KULLANILIR

> Desktop/tablet sayfa kabukları **kenara kadar yayılır**, hangi monitör olursa olsun. Üst sınır YOK; ortada kapanmaz.

Zorunlu:
- Sayfa shell'i: `width: 100%; max-width: 100%; margin: 0`.
- Yatay nefes payı `padding-inline` ile **fluid**: `clamp(1.5rem, 4vw, 4rem)` (dar ekran 24px, geniş ekran 64px).
- 1920, 2560, 3440, 5120 — fark etmez; içerik kenarlara kadar gider.
- Shell **1440px / 1600px / 1920px** gibi sınırlarla daraltılmaz. Eski `Container max-width` kuralı app-frame sayfalarda geçersizdir.

Yasak:
- ❌ `max-width: 1440px / 1600px / 1920px` — full-bleed yerine "ortada bekleyen container" hissi yaratır, kullanıcı "neden ekranımın yarısı boş" der.
- ❌ `margin: 0 auto` ile shell'i ortalamak. (`margin-inline: auto` da aynı, YASAK.)
- ❌ Sağda/solda 200px+ boş alan bırakmak.

Ultra-wide ekranlarda map/grid pattern'ı bozulursa **ne yapılır?** Layout'u restructure et: tek satırda 3 kolon (map | info | form) yap veya grid-template-areas ile yeniden konumlandır. Daraltarak değil, **iç düzeni geliştirerek** çöz.

İstisna: **Okuma odaklı statik makale/blog** sayfalarında metin satırı `65–75ch` içinde kalsın diye iç container `max-width` alabilir; dış shell yine full-bleed.

### 6.3 GENEL YASAKLAR
- ❌ `body { overflow: hidden }`
- ❌ `html { overflow: hidden }`
- ❌ `width: 100vw` (iOS kırılır)
- ❌ `height: 100vh` iOS'ta (kullan: `100svh`/`100dvh`)
- ❌ `scroll-snap-type: y mandatory` (proximity tamam)

### 6.4 GENEL ZORUNLU
- ✅ `overflow-x: clip` SADECE `html`'de
- ✅ App-frame sayfalarda kabuk `max-width: 100%` + fluid `padding-inline`
- ✅ Tek viewport: page-level scroll yok, panel-level scroll var

### 6.5 APP-FRAME SAYFA ŞABLONU — KOPYA ŞABLON

> Yeni bir app-frame sayfası (iletişim, SSS, referanslar, fiyat-detayı vb.) açılırken **bu pattern'dan başlanır**. Sıfırdan layout yazmak YASAK; sapma bir tek yerden olur ve gerekçesi commit mesajına yazılır.

**1) Sayfa scope CSS (örnek `.foo-desktop`):**

```css
/* SAHNE — Madde 4.1 'den seç: Warm veya Deep */
html:has(.foo-desktop),
body:has(.foo-desktop) {
  background:
    radial-gradient(ellipse at 50% 70%, #FF8C3A 0%, #D4621A 35%, #B83A0E 70%, #1A0907 100%) !important;
  background-color: #1A0907 !important;
  background-attachment: fixed !important;
}

body:has(.foo-desktop) > div {
  background: transparent !important;
}

/* ANA KAB — Madde 6.1: tek viewport, Madde 6.2: full-bleed */
.foo-desktop {
  width: 100%;
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  color: #fff;
}

/* SHELL — kalan yüksekliği grid/flex ile tüket; tam full-bleed (üst sınır YOK) */
.foo-desktop__shell {
  width: 100%;
  max-width: 100%;                /* Madde 6.2: full-bleed; 1920/1440 cap YASAK */
  flex: 1 1 auto;
  min-height: 0;
  margin: 0;
  padding-block: clamp(20px, 2.5vh, 32px) clamp(16px, 2.2vh, 28px);
  padding-inline: clamp(1.5rem, 4vw, 4rem);
  display: grid;
  grid-template-columns: <aside-width> 1fr;
  /* veya grid-template-rows: auto auto 1fr; */
  gap: clamp(20px, 2vw, 36px);
  overflow: hidden;
}

/* SCROLL PANEL — uzun içerik buraya */
.foo-desktop__main {
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow-y: auto;
  scrollbar-gutter: stable;
}
```

**2) Mobil sayfa scope CSS (örnek `.foo-m`):**

Mobilde TEK SCROLL ALANI: kabuğun kendisi. İç paneller scroll etmez.

```css
.foo-m {
  --topbar-clearance: calc(56px + env(safe-area-inset-top, 0px) + 16px);
  --bottomnav-clearance: calc(72px + env(safe-area-inset-bottom, 0px) + 16px);

  width: 100%;
  height: 100dvh;
  max-height: 100dvh;
  padding:
    var(--topbar-clearance)
    16px
    var(--bottomnav-clearance);
  display: flex;
  flex-direction: column;
  gap: 14px;
  /* Tek scroll alanı kabuğun kendisidir; topbar/bottombar fixed yerinde kalır,
   * içerik aralarında akar. İç panel scroll YASAK (çift scroll). */
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  color: #fff;
}

/* İç kartlar/paneller doğal yüksekliklerini alır; scroll etmezler. */
```

**3) Body-level lock (zaten `safe-area.css` içinde var):**

```css
body:has(.foo-desktop),
body:has(.foo-m) {
  height: 100dvh;
  max-height: 100dvh;
  overflow: clip;
}

/* Mobil app-frame sayfası kendi --topbar-clearance + --bottomnav-clearance
 * padding'ini yönetir → main-content'te DOUBLE padding olmasın. */
body:has(.foo-m) #main-content.app-chrome-main {
  padding-top: 0;
  padding-bottom: 0;
}
```

→ Yeni sayfa eklendiğinde bu listeler güncellenir, başka yerde override yapılmaz. **Mobil sayfa eklenirse padding-zero override'ı da eklemek ZORUNLU**, yoksa sayfa altı kesilir, panel scroll çalışmaz görünür.

**Definition of Done:**

- [ ] Madde 4.1 gradient'i seçildi (Warm veya Deep) — kit dışı yok.
- [ ] Sayfa kabuğu `flex: 1 1 auto; min-height: 0; overflow: hidden`.
- [ ] Shell `max-width: 100%`, fluid `padding-inline`, **ortalanmış değil**.
- [ ] En az bir scroll-panel mevcut (form/accordion/list); panel-içi scroll çalışıyor.
- [ ] `body:has(...)` lock listesine yeni sayfa eklendi (`safe-area.css`).
- [ ] Test viewport listesindeki **her satırda** document scrollbar görünmüyor (özellikle 1280×720, 375×667).
- [ ] Header altında içerik kesilmiyor; bottom nav (mobil) içerik üstüne binmiyor.
- [ ] `npm run typecheck && npm run lint` temiz.

---

## 7. NAVİGASYON

| Genişlik | Bottom Bar | Top Header |
|---|---|---|
| ≤1279 + tablet viewport ≤1366 (mobil) | **ZORUNLU** | Yok / minimal |
| ≥1280 ve tablet viewport değil (desktop) | YOK | **ZORUNLU** |

### YASAKLAR
- ❌ Bottom bar + top header'da AYNI sekmeler (duplicate nav)
- ❌ Hover-only dropdown (touch'ta çalışmaz)

### ZORUNLU
- ✅ Bottom bar `env(safe-area-inset-bottom)` alır
- ✅ `@media (pointer: coarse)` touch tespiti

---

## 8. DOKUNMA & ETKİLEŞİM

### ZORUNLU
- ✅ Tıklanabilir elemanlar **≥ 44×44px**
- ✅ Butonlar arası **≥ 8px** boşluk
- ✅ Keyboard nav: Tab, Enter, Esc, Ok tuşları
- ✅ Telefon ve tablette aynı dokunma davranışı: tap feedback, açık/kapalı state, picker/list açılımı, focus state

### YASAKLAR
- ❌ Hover-only davranış (touch'ta yok)
- ❌ Native `<select>` dropdown'un mavi/beyaz sistem menüsüyle tasarımı bozması
- ❌ Açılır picker/list'in alttaki inputların üstüne binmesi; mobilde liste akış içinde açılır veya kontrollü bottom sheet olur

---

## 9. ERİŞİLEBİLİRLİK (a11y)

### ZORUNLU
- ✅ `:focus-visible` tanımlı (BEYAZ ring)
- ✅ Tüm `<img>`'de `alt` attribute
- ✅ Form input'larda `<label htmlFor>` (placeholder yetmez)
- ✅ `aria-label`, `aria-expanded`, `role` doğru kullanılmış
- ✅ `@media (prefers-reduced-motion: reduce)` global tanımlı

### YASAKLAR
- ❌ `outline: none` (focus-visible şart)
- ❌ Sadece placeholder, label yok

---

## 10. SEO — GOOGLE DESTEKLİ

### Sayfa başına ZORUNLU
- ✅ **TEK** `<h1>` (birden fazla h1 YASAK)
- ✅ `<title>` (Next.js metadata API)
- ✅ Meta `description`
- ✅ Open Graph (og:title, og:description, og:image, og:url)
- ✅ Twitter Card (twitter:card, twitter:title, twitter:image)
- ✅ Canonical URL (`alternates.canonical`)
- ✅ Robots: `index: true, follow: true`
- ✅ JSON-LD structured data (sayfa türüne uygun: Organization, Article, BreadcrumbList, ContactPage, vs.)

### Görsel ZORUNLU
- ✅ `alt` attribute (boş alt= sadece dekoratif görseller için)
- ✅ Hero görselinde `width`+`height` attribute
- ✅ Ekran dışı görsellerde `loading="lazy"`
- ✅ `next/image` tercih edilir (otomatik optimize)

### URL/Routing
- ✅ Tüm URL'ler `/sitemap.xml`'de
- ✅ `robots.ts` doğru kuralları içerir
- ✅ Dynamic route'lar (örn `/blog/[slug]`) `generateStaticParams` veya `dynamicParams` ile yönetilir

---

## 11. PERFORMANS

### ZORUNLU
- ✅ Hero görselinde `width`+`height`
- ✅ `loading="lazy"` ekran dışı görsellerde
- ✅ `font-display: swap`
- ✅ Animasyon: SADECE `transform` + `opacity`

### YASAKLAR
- ❌ `width`, `height`, `top`, `left` animate (reflow tetikler)
- ❌ Sonsuz döngü animasyon (sadece progress göstergeleri için OK)

---

## 12. Z-INDEX — TOKEN

**Dosya:** `src/styles/tokens/z-index.css`

```
--z-base      10  (temel float)
--z-dropdown  20  (dropdown, tooltip)
--z-sticky    30  (sticky header)
--z-modal     40  (modal, sheet)
--z-nav       50  (bottom bar, top navbar)
--z-alert     60  (toast, notification)
```

### YASAKLAR
- ❌ `z-index: 9999` keyfi yüksek değer
- ❌ Tokenize olmayan z-index

---

## 13. ANIMASYON — TOKEN

**Dosya:** `src/styles/tokens/motion.css`

```
--duration-fast   150ms
--duration-base   250ms (standart)
--duration-slow   350ms
--ease-base
--stagger-step
```

### ZORUNLU
- ✅ Tüm animasyon süreleri `var(--duration-*)`
- ✅ Sadece `transform` + `opacity` animate
- ✅ `prefers-reduced-motion` saygı

---

## 14. RADIUS — TOKEN

**Dosya:** `src/styles/tokens/radius.css`

```
--radius-sm   6px
--radius-md   10px
--radius-lg   14px
--radius-xl
--radius-2xl
--radius-3xl
--radius-full
```

---

## 15. KOMPONENT YAPISI

```
app/<route>/                  → Sayfa-spesifik (page.tsx, layout.tsx, route CSS)
src/components/<area>/        → Reusable component'ler
src/components/layout/        → Site shell, nav, header
src/styles/tokens/            → Design token'ları
src/styles/components/        → Global komponent stilleri
src/lib/                      → Utility, hook'lar
src/icons/                    → Custom icon component'leri
```

### YASAKLAR
- ❌ Boş klasör (orphan)
- ❌ Backup dosyaları (`.bak`, `.old`, `_copy`)
- ❌ Mockup HTML kökte
- ❌ Dead import / unused export

---

## 16. TEMİZLİK

### Devamlı uygulanır
- Orphan dosyalar SİLİNİR
- Dead imports temizlenir
- Boş klasörler kaldırılır
- Stale config (yokmuş route referansı, vs.) güncellenir

---

## 17. TEKNİK STANDART

- TypeScript **strict mode** aktif
- `any` YASAK (eslint kuralı ile)
- Hooks: Rules of Hooks ihlal edilmez (`useResponsiveShell` her zaman aynı sırada)
- `npx tsc --noEmit` ve `npx eslint` temiz olmalı

---

## 18. REFERANS UYGULAMA

**`Referanslar` sayfası** (`src/components/referanslar/ReferencesShell.tsx` + `app/referanslar/references-kesif.css`) bu dosyadaki tüm kuralları uygular. Yeni sayfalar bu sayfayı örnek alır:

- Mobil/tablet/desktop tek bileşen, responsive CSS
- Title + meta + thumbnails (galeri varsa) + DETAY accordion
- Filter bar (mobile: tam-ekran modal, desktop: inline chip + 13"'te 2 satır)
- KAYDIR indicator pill (mobil: tam genişlik, desktop: ortada)
- Paylaş butonu desktop'ta Filtreler'in sağında (filtreler açıkken gizli)
- Focus ring BEYAZ
- Tüm ölçüler token'a bağlı

---

## 19. İŞ AKIŞI (her görev başına)

1. Görevin hangi maddeleri etkilediğini belirle
2. İlgili token'ları kontrol et (eksikse raporla)
3. Kodu yaz / düzelt
4. Bu dosyadaki kontrol listesinden geç
5. İhlal bulursan **DUR**, raporla, onay iste
6. `npx tsc --noEmit` çalıştır → temiz olmalı

### İhlal raporu formatı
```
❌ İHLAL: [dosya:satır]
📜 KURAL: [madde no]
🔧 DÜZELTME: [kod önerisi]
💡 GEREKÇE: [neden yasak]
```

---

## 20. YUMUŞATMA YASAKLARI

- "Bu eski kod, sonra düzeltiriz" → YASAK
- "Çalışıyor, bırak" → YASAK
- "Çok dosya var, bazılarını atla" → YASAK
- "Tamamen düzeltmek uzun, yarım yapalım" → YASAK

**Kurallar her zaman kazanır. Hızdan önce gelir.**

---

*Versiyon: 2.0 — Tek kural dosyası, eski tüm kurallar geçersiz.*
