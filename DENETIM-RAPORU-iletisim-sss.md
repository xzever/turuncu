# Denetim Raporu — İletişim ve SSS Sayfaları

**Kaynak (single source of truth):** `mockups/SOLSTICE-FINAL-UI-KIT.html`
**Denetlenen sayfalar:**
- `/iletisim` (mobil + tablet + desktop)
- `/sss` (mobil + tablet + desktop)

**Amaç:** Bu iki sayfayı UI-Kit'in P8 (SSS) ve P9 (İletişim) bölümleri ile **birebir** uyumlu hâle getirmek. Aşağıdaki tüm token, ölçü ve davranışlar UI-Kit'ten alınmıştır.

---

## 1. SAHNE TOKENLARI (her iki sayfa için ortak)

```css
:root {
  --o-deep:   #B83A0E;
  --o-base:   #D4621A;
  --o-bright: #FF8C3A;
  --o-warm:   #FFA060;
  --o-glow:   #FFD2A0;   /* em vurgu rengi */
  --bg-page:  #1A0907;
  --ink:      #FFF8F0;
  --muted:    rgba(255,248,240,0.62);
  --dim:      rgba(255,248,240,0.40);
  --line:     rgba(255,248,240,0.10);
  --line-soft:rgba(255,248,240,0.06);
  --accent:   #FF8533;
}
```

**SSS body radial bg (warm):**
`radial-gradient(ellipse at 50% 30%, #FFB060 0%, #FF8C3A 30%, #D4621A 65%, #3A1408 100%)`

**İletişim body radial bg (deep):**
`radial-gradient(ellipse at 50% 70%, #FF8C3A 0%, #D4621A 35%, #B83A0E 70%, #1A0907 100%)`

Body üzerinde `background-attachment: fixed`. Sayfa sarmalayıcı (page-shell, .sss-mobile-page, .iletisim-mobile-page vb.) `background: transparent !important`. SolarVideoBackground bu iki sayfada `display: none`.

---

## 2. ORTAK BİLEŞENLER (UI-Kit token'ları)

### 2.1 Topbar ikon butonu `.ic`
```
38×38 / border-radius:50% / bg rgba(0,0,0,0.30) / blur 20px
border 1px rgba(255,255,255,0.12) / color #fff
svg 14×14 / stroke currentColor / fill none / stroke-width 2
```

### 2.2 Hero başlık `.h-page`
```
font-size: 30px (mobil), 42px (tablet)
font-weight: 800 / letter-spacing: -0.025em / line-height: 1.05
color: #fff / margin-top: 14px
em → font-style: italic; color: #FFD2A0;
```

### 2.3 Lead `.lead`
```
14px / rgba(255,255,255,0.78) / line-height: 1.55 / margin-top: 8px
strong → color:#fff; font-weight:600;
```

### 2.4 Search `.search`
```
.search { position: relative; }
.search input {
  width:100%;
  background: rgba(0,0,0,0.28);
  backdrop-filter: blur(18px);
  border: 1px solid rgba(255,255,255,0.10);
  border-radius: 14px;
  padding: 13px 16px 13px 42px;
  font-size: 14px;
  color: #fff;
}
.search input::placeholder { color: rgba(255,255,255,0.40); }
.search > svg {
  position:absolute; left:16px; top:50%; transform:translateY(-50%);
  width:14px; height:14px;
  color: rgba(255,255,255,0.55);
  stroke: currentColor; fill: none; stroke-width: 2;
  pointer-events: none;
}
```

### 2.5 Chips `.chips` + `.chip`
```
.chips { display:flex; gap:6px; overflow-x:auto; margin:0 -22px; padding:0 22px; }
.chip {
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(0,0,0,0.25);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.10);
  color: rgba(255,255,255,0.75);
  font-size: 12px; font-weight: 600;
  white-space: nowrap; flex-shrink: 0;
}
.chip.is-active { background:#fff; color:#1A0907; border-color:#fff; }
```

### 2.6 Segment `.seg` (Şube switch)
```
.seg {
  display:flex;
  background: rgba(0,0,0,0.28);
  backdrop-filter: blur(18px);
  border: 1px solid rgba(255,255,255,0.10);
  border-radius: 999px;
  padding: 5px;
}
.seg button {
  flex:1; background:transparent; border:none;
  color: rgba(255,255,255,0.65);
  font-size: 13px; font-weight: 600;
  padding: 10px 14px; border-radius: 999px;
  letter-spacing: -0.005em;
}
.seg button.is-active { background:#fff; color:#1A0907; }
```

### 2.7 Buton `.btn` (Gönder, Bize sor vb.)
```
.btn {
  display:inline-flex; align-items:center; justify-content:center; gap:8px;
  background: #fff; color: #1A0907;
  padding: 14px 22px;
  border-radius: 999px;
  font-size: 14px; font-weight: 600; letter-spacing: -0.005em;
  border: none; text-decoration: none;
}
.btn.full { width: 100%; }
.btn.glass {
  background: rgba(0,0,0,0.30);
  backdrop-filter: blur(20px);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.14);
}
.btn svg { width:14px; height:14px; stroke:currentColor; fill:none; stroke-width:2.2; }
```

---

## 3. SSS SAYFASI (P8) — yapı taşları

### 3.1 İçerik sırası (mobil + tablet portrait)
1. Topbar (`.top` — menu / "SSS" / search ikon)
2. `<h2 class="h-page">{N} <em>soru.</em></h2>` (büyük sayı + italic glow "soru.")
3. `<p class="lead">` (mobil opsiyonel, tablet zorunlu)
4. `.search`
5. `.chips` (kategori filtresi: Tümü, On-Grid, Hibrit, Maliyet, Garanti, Kurulum)
6. Accordion listesi (`.acc` × N)

### 3.2 Tablet landscape
- `.lay-side` 280px aside + 1fr main
- Aside: `<h2 class="h-detail">`, search, chip listesi (her satır flex-start, sayım sağda muted)
- Main: accordion listesi

### 3.3 Accordion `.acc`
```
.acc {
  padding: 16px 0;
  border-bottom: 1px solid rgba(255,255,255,0.10);
}
.acc:last-child { border-bottom: none; }
.acc-h { display:flex; align-items:center; justify-content:space-between; gap:12px; cursor:pointer; }
.acc-q { font-size:14px; font-weight:600; color:#fff; flex:1; letter-spacing:-0.005em; }
.acc-t {
  width:24px; height:24px; border-radius:50%;
  background: rgba(0,0,0,0.30);
  color:#fff;
  border: 1px solid rgba(255,255,255,0.12);
  flex-shrink: 0;
}
.acc.is-open .acc-t { background:#fff; color:#1A0907; border-color:#fff; }
.acc-t svg { width:11px; height:11px; stroke:currentColor; fill:none; stroke-width:2.4; }
.acc.is-open .acc-t svg { transform: rotate(180deg); }
.acc-a {
  font-size: 13px;
  color: rgba(255,255,255,0.78);
  margin-top: 10px;
  line-height: 1.6;
}
.acc-a strong { color:#fff; font-weight:600; }
.acc-a em { color:#FFD2A0; font-style:italic; }
```

**Davranış:**
- Tek seferde **tek accordion açık** (yenisi açılınca eski kapanır)
- Search yazılırken accordion'lar **real-time filtrelenir**
- Chip + search **AND** mantığı ile beraber çalışır

---

## 4. İLETİŞİM SAYFASI (P9) — yapı taşları

### 4.1 İçerik sırası (mobil)
1. Topbar (`.top` — back / "İletişim" / menu ikon)
2. `<h2 class="h-page">Bize <em>yazın.</em></h2>`
3. `<p class="lead">2 ofis · mühendis ekip aynı gün döner.</p>`
4. `.seg` (Ankara / Muğla switch)
5. `.rail-head`Bilgileriniz`</div>` + `.rail` (Ad Soyad / E-Posta / Telefon)
6. `.rail-head>Mesajınız</div>` + `.rail` (Konu — tek satır input)
7. `<a class="btn full" style="margin-top:auto">Gönder</a>` (en altta sabit)

### 4.2 Tablet portrait
- Aynı sıra + arada `.rail-head>Şube</div>` + `.rail` ile **picker satırı** (`.rail-row` sağda chevron `.arr`)

### 4.3 Tablet landscape (`.lay-2` 1fr/1fr grid)
- Sol kolon: hero + lead + seg + Şube rail + Bilgileriniz rail
- Sağ kolon: Mesajınız rail (textarea ile uzun) + Gönder

### 4.4 Rail bileşeni (zorunlu uyum)
```
.rail-head {
  font-size: 10px;
  color: rgba(255,255,255,0.55);
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-weight: 600;
  margin-bottom: 6px;
  padding-left: 4px;
}
.rail {
  background: rgba(0,0,0,0.28);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.10);
  border-radius: 18px;
  overflow: hidden;
}
.rail-row {
  display: flex; align-items: center; gap: 14px;
  padding: 14px 16px;
  border-top: 1px solid rgba(255,255,255,0.08);
}
.rail-row:first-child { border-top: none; }
.rail-row .ic-mini {
  width:32px; height:32px;
  border-radius: 10px;
  background: rgba(255,255,255,0.12);
  color: #fff;
  flex-shrink: 0;
}
.rail-row .ic-mini svg { width:14px; height:14px; stroke:currentColor; fill:none; stroke-width:2; }
.rail-row .lbl-r {
  font-size: 11px;
  color: rgba(255,255,255,0.55);
  min-width: 80px;
  letter-spacing: -0.005em;
}
.rail-row .val { flex:1; font-size:14px; color:#fff; font-weight:500; }
.rail-row .val input,
.rail-row .val textarea {
  width: 100%;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 14px;
  outline: none;
}
.rail-row .val input::placeholder,
.rail-row .val textarea::placeholder { color: rgba(255,255,255,0.30); }
.rail-row .arr { color: rgba(255,255,255,0.40); }
.rail-row .arr svg { width:13px; height:13px; stroke:currentColor; fill:none; stroke-width:2; }
```

**Form alanları (mobil/tablet portrait için zorunlu sıra):**
- Bilgileriniz: `Ad Soyad` (i-user) → `E-Posta` (i-mail) → `Telefon` (i-phone)
- Mesajınız: `Konu` (i-msg)
- Tablet portrait için ek olarak: `Şube` (i-pin) — picker satırı, sağda chevron `.arr`

**Form alanları olmaması gerekenler (UI-Kit'te yok):**
- ❌ Firma alanı
- ❌ İl seçimi
- ❌ İlçe seçimi
- ❌ Başvuru tipi (Şahıs/Firma) toggle
- ❌ KVKK checkbox (UI-Kit'in iletişim form'unda yok — gerekiyorsa rail dışında, butonun altında 11px muted bir satır olarak)

---

## 5. MEVCUT KODDA TESPİT EDİLEN SAPMALAR

### 5.1 İletişim mobile (`src/components/iletisim/IletisimMobile.tsx` + `app/iletisim/iletisim-mobile.css`)
- [ ] Form'da fazlalık alanlar var (Firma, İl, İlçe, Şahıs/Firma toggle). UI-Kit'e göre **silinmeli**, sadece Ad Soyad / E-Posta / Telefon / Konu kalmalı.
- [ ] `.rail`, `.rail-head`, `.rail-row`, `.ic-mini`, `.lbl-r` sınıfları yerine `.iletisim-m__rail-*` türevleri kullanılmış. Sınıf isimleri **UI-Kit ile birebir** olsun (sayfa scope'unda override gerekirse `.iletisim-m .rail`, `.iletisim-m .rail-row` kalıbı kullan).
- [ ] Hero alt yazısı (`<p class="lead">`) eksik veya farklı metin. **Birebir:** "2 ofis · mühendis ekip aynı gün döner."
- [ ] Şube switch `.seg` yerine custom `.iletisim-m__pills` kullanılmış. UI-Kit'in `.seg` token'ına uy.
- [ ] Submit butonu `.btn.full` token'ını kullanmıyor; özel `.iletisim-m__submit` kuralları yerine `.btn.full` token'ı uygulansın.
- [ ] Map / info kartı / çalışma saatleri **UI-Kit'in P9'unda yok** — bunlar mobil iletişim için fazlalık. Rail-only akışa indirgenmeli (info için ayrı bir rail veya CTA satırı eklenebilir, ama harita ve haftalık saat grid'i çıkarılır).

### 5.2 İletişim desktop (`app/iletisim/IletisimClient.tsx` + `app/iletisim/iletisim.css`)
- [ ] Mevcut `.cd-split` / `.cd-v2` katmanları UI-Kit'in `.lay-2` (1fr 1fr) yapısı ile uyumlu hâle getirilsin.
- [ ] Sol kolon: hero + lead + seg + Şube rail + Bilgileriniz rail. Sağ kolon: Mesajınız rail (textarea, esnek yükseklik) + Gönder. Harita zorunlu değil, kalacaksa **iki kolon dışında** (örn. üstte full-width row).
- [ ] Form input'ları `.cd-form-group input` özel kuralları yerine `.rail-row .val input` token'ı kullansın (sayfa scope'lu).
- [ ] CTA: `.cd-form-submit` yerine `.btn.full` token'ı.

### 5.3 SSS mobile (`src/components/sss/SssMobile.tsx` + `app/sss/sss-mobile.css`)
- [ ] Hero başlığı `<h2 class="h-page">{N} <em>soru.</em></h2>` formatına geçsin (şu an "Sık sorulan sorular" gibi farklı metin).
- [ ] Sınıf isimleri `.sss-mobile__*` yerine UI-Kit token isimleri (`.search`, `.chips`, `.chip`, `.acc`, `.acc-h`, `.acc-q`, `.acc-t`, `.acc-a`) kullanılsın (page scope: `.sss-mobile .acc` vb.).
- [ ] Accordion'lar **kart kart** (her item kendi background) DEĞİL — UI-Kit'te tek hairline ayraç (`border-bottom: 1px rgba(255,255,255,0.10)`), arka planı yok. Buna döndür.
- [ ] Toggle (`.acc-t`) 24×24 (22 değil), açıkken **bg #fff + #1A0907 metin + chevron 180° rotate**.
- [ ] CTA "Mühendise sor" UI-Kit'in P8'inde **yok** — gerekiyorsa `.btn.glass` ile sağda küçük bir kart olarak eklenebilir, ama hero gibi büyük bir CTA kartı kullanılmamalı.

### 5.4 SSS desktop (`src/components/sss/SssDesktop.tsx` + `app/sss/sss-desktop.css`)
- [ ] Tablet landscape pattern'i: `.lay-side` (280px aside + 1fr main).
  - Aside: `<h2 class="h-detail">{N} <em>soru.</em></h2>` + `.search` + dikey chip listesi (her chip 100% genişlik, sağda sayım muted).
  - Main: `.acc` listesi.
- [ ] "Mühendise sor" mode toggle UI-Kit'te yok — kaldırılsın veya basit bir `.btn.glass` linki olarak küçültülsün.

---

## 6. ÇALIŞMA ÖRDU (Cursor için adım adım)

1. **`src/styles/components/solstice/`** altına yeni `solstice-tokens-v2.css` dosyası oluştur. Yukarıdaki bütün token'ları (`.ic`, `.h-page`, `.lead`, `.search`, `.chips`, `.chip`, `.seg`, `.btn`, `.rail-head`, `.rail`, `.rail-row`, `.ic-mini`, `.lbl-r`, `.acc`, `.acc-h`, `.acc-q`, `.acc-t`, `.acc-a`) buraya birebir kopyala.

2. **İletişim mobile JSX'i UI-Kit P9 ile birebir yeniden yaz:**
   - Şu an silinen alanlar: Firma, İl, İlçe, Şahıs/Firma toggle. Map ve info kartı (mobil için).
   - Sadece: hero (`h-page` + `lead`), `.seg`, Bilgileriniz `.rail` (3 satır), Mesajınız `.rail` (1 satır), `.btn.full`.

3. **İletişim desktop JSX'ini UI-Kit P9 tablet-landscape (`.lay-2`) yapısına geçir.** Map kalacaksa hero'nun altında full-width band olarak.

4. **SSS mobile JSX'ini UI-Kit P8 ile birebir yeniden yaz:**
   - Hero: "{FAQS.length} <em>soru.</em>"
   - `.search`, `.chips` (kategori), `.acc` listesi.
   - Accordion'lar tek hairline ayraçlı, kart kart değil.
   - "Mühendise sor" CTA kartı kaldır.

5. **SSS desktop JSX'ini UI-Kit P8 tablet-landscape (`.lay-side`) yapısına geçir.** Aside dikey chip listesi + main accordion.

6. **Sahne arka planları:**
   - `body:has(.sss-mobile-page)` ve `body:has(.sss-desktop)` → SSS warm radial.
   - `body:has(.iletisim-mobile-page)` ve `body:has(.contact-desktop-page)` → İletişim deep radial.
   - `background-attachment: fixed`. `SolarVideoBackground` her ikisinde `display: none`.

7. **Token sınıflarını sayfa scope'unda kullan** — global token'ları sayfa içinde aktif etmek için `.sss-mobile .acc { ... }`, `.iletisim-m .rail { ... }` kalıbını kullan. Mevcut `__rail-*`, `__chevron`, `__category` gibi BEM modifier'ları **silinsin** veya UI-Kit token'ına remap edilsin.

8. **Doğrulama:** Yeni hâli `mockups/SOLSTICE-FINAL-UI-KIT.html`'in P8 ve P9 bölümleri ile **piksel düzeyinde** kıyasla. Her sapma için DENETIM-RAPORU'na geri dön.

---

## 7. KESİN OLMAMASI GEREKENLER (denetim red kriterleri)

- ❌ Gri border / hairline rastgele kullanımı (sadece `rgba(255,255,255,0.08-0.10)` kabul, `--line` token'ı dışında ekstra border yok)
- ❌ İkon altında veya etrafında ekstra çerçeve (UI-Kit'te `ic-mini` ve `acc-t` haricinde border yok)
- ❌ İletişim mobil hero'da eyebrow ("24 saat içinde dönüş"), trust kartlar (500+/45 MW/7+) — UI-Kit'te bunlar yok
- ❌ İletişim form'da Firma/İl/İlçe/Şahıs-Firma toggle/KVKK kartı — UI-Kit form spec'inde yok
- ❌ SSS'de "Mühendise sor" mode toggle — UI-Kit P8'de yok
- ❌ Bottom dock'ta brand mark cell — UI-Kit'te yok (sadece nav cells: Ana / Referans / Hesapla-FAB / Mesaj)
- ❌ Hamburger menü içinde "TURUNCU SOLAR / Mobil Menu" başlık — UI-Kit'te yok (sadece logo + dil + X)
- ❌ Backdrop-filter olmadan transparent overlay — menü açıkken arka kesinlikle solid kapansın

---

## 8. PROMPT (Cursor'a doğrudan verebilirsin)

> `mockups/SOLSTICE-FINAL-UI-KIT.html` tek doğru kaynaktır. `DENETIM-RAPORU-iletisim-sss.md` dosyasındaki bölüm 1–7'ye göre `src/components/iletisim/`, `app/iletisim/`, `src/components/sss/`, `app/sss/` altındaki tüm iletişim ve SSS dosyalarını **birebir UI-Kit token isimleri ve ölçüleri** ile yeniden yaz. Mevcut `.iletisim-m__*`, `.sss-mobile__*`, `.cd-*` BEM modifier'larını ya UI-Kit token'larına remap et ya da kaldır. Her dosyada başlamadan önce ilgili UI-Kit bölümünü (P8 = SSS, P9 = İletişim) tekrar oku, ardından tek seferde uygula. Sonunda her sayfa için ekran görüntüsü al ve UI-Kit'in aynı bölümüyle yan yana sun. Bölüm 5'teki "Mevcut sapmalar" listesindeki her madde fix edilene kadar bitmiş sayma. Bölüm 7'deki "kesin olmamasıgerekenler" listesindeki herhangi bir öğeyi geri ekleme.
