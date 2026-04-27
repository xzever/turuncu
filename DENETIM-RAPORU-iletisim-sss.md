> ⚠️ v1 (DARK) — geçersiz. Açık temaya geçildi v2 için bkz mockups/TURUNCU-LIGHT-UI-KIT.html

# Denetim Raporu — İletişim ve SSS Sayfaları v2 LIGHT

**Tek kaynak:** `mockups/TURUNCU-LIGHT-UI-KIT.html`  
**Kapsam:** `/iletisim` ve `/sss` mobil + tablet + desktop.  
**Karar:** Solstice LIGHT final lock. Eski DARK, deep/warm radial ve transparent overlay yaklaşımı geçersiz.

---

## 1. Sahne Token'ları

LIGHT sahne doküman seviyesinde solid uygulanır:

```css
:root {
  --bg-page: #FAF6EE;
  --surface: #FFFFFF;
  --surface-2: #F5EDDF;
  --surface-3: #FFF8EE;
  --ink: #1B1813;
  --muted: #6B5F4E;
  --dim: #9C8E7A;
  --hint: rgba(27,24,19,0.30);
  --primary: #D4621A;
  --primary-hover: #B8521A;
  --primary-soft: rgba(212,98,26,0.10);
  --primary-line: rgba(212,98,26,0.30);
  --gold: #C9A961;
  --line: rgba(27,24,19,0.10);
  --line-soft: rgba(27,24,19,0.05);
}
```

Zorunlu sahne:

```css
body:has(.iletisim-mobile-page),
body:has(.contact-desktop-page),
body:has(.sss-mobile-page),
body:has(.sss-desktop) {
  background: var(--color-bg) !important;
  background-color: var(--color-bg) !important;
}
```

Eski deep/warm radial referansları silindi. Sayfa zemini `background: var(--color-bg)` solid (AGENTS.md Madde 4.1). `background-attachment: fixed` kullanılmaz. `SolarVideoBackground` iletişim ve SSS sayfalarında `display: none` kalır.

---

## 2. Ortak Bileşenler

Mockup CSS kaynaklı token sınıfları LIGHT değerdedir.

### 2.1 `.ic`

44x44, `border-radius: 50%`, `background: var(--surface)`, `border: 1px solid var(--line)`, `color: var(--text)`. Hover state `--primary`.

### 2.2 `.h-page`

Light bg üstünde dark text: `font-family: var(--font-slab)`, `font-size: var(--text-3xl)`, `font-weight: 700`, `line-height: 1.1`, `color: var(--text)`. İçindeki `em` primary ve italic.

### 2.3 `.lead`

`font-size: var(--text-base)`, `color: var(--muted)`, `line-height: 1.6`. `strong` dark text.

### 2.4 `.search`

`position: relative`; input `background: var(--surface)`, `border: 1px solid var(--line)`, `border-radius: var(--r-md)`, `min-height: 48px`, koyu text. Focus `border-color: var(--primary)` + `0 0 0 4px var(--primary-soft)`.

### 2.5 `.chips`, `.chip`

`.chips/.chip-row` flex wrap ve `gap: var(--space-2)`. `.chip` beyaz surface, line border, muted text. Aktif chip primary zemin + beyaz text.

### 2.6 `.seg`

`background: var(--surface-2)`, radius `var(--r-md)`, iç butonlar muted. Aktif buton beyaz surface, primary text ve `--shadow-sm`.

### 2.7 `.btn`

Varyantlar korunur:

- `.btn`: primary zemin, beyaz text.
- `.btn.ghost`: beyaz surface, dark text, line border.
- `.btn.soft`: primary-soft zemin, primary text.
- `.btn.dark`: dark text zemini, bg text.
- `.btn.gold`: gold zemin.
- `.btn.sm`, `.btn.lg`, `.btn.full` boyut/width varyantları.

### 2.8 `.rail`, `.rail-row`, `.ic-mini`, `.lbl-r`

Rail warm/surface paneldir: `background: var(--surface)`, `border: 1px solid var(--line-soft)`, radius `var(--r-xl)`. Sayfa özelinde iletişim rail'i `var(--color-surface-warm)` kullanabilir. Satırlar 3 parçalı: icon, label, value. Input/textarea transparent, text dark, placeholder hint.

### 2.9 `.acc`, `.acc-q`, `.acc-a`

Accordion light surface üstünde çalışır: `background: var(--surface)`, `border: 1px solid var(--line-soft)`, açık state `border-color: var(--primary)` + `background: var(--surface-3)`. Soru dark text, cevap muted text.

---

## 3. SSS (P8)

Hedef: LIGHT surface, hairline ayraçlı accordion hissi, açık state primary border + surface-3 zemin.

Zorunlu yapı:

1. Hero: `<h1 class="h-page">{FAQS.length} <em>soru.</em></h1>`
2. Lead: `FAQ_INTRO_TEXT`, `--muted`.
3. Search: `.search`.
4. Kategori chipleri: `.chips > .chip`.
5. Accordion: `.acc`, `.acc-h`, `.acc-q`, `.acc-t`, `.acc-a`.

Desktop/tablet landscape:

- `.lay-side`: 280px aside + 1fr main.
- Aside: search + dikey chip listesi.
- Main: accordion listesi panel içinde scroll.

Davranış:

- Tek seferde tek accordion açık.
- Search + chip filtreleri AND mantığıyla çalışır.
- CTA/mode toggle yok.

---

## 4. İletişim (P9)

Hedef: beyaz/warm surface, 3 satır rail, `btn.full` submit.

Mobil:

1. Hero: `Bize <em>yazın.</em>`
2. Lead: `2 ofis · mühendis ekip aynı gün döner.`
3. Şube switch: `.seg`
4. Bilgileriniz rail: Ad Soyad, E-Posta, Telefon
5. Mesajınız rail: Konu
6. Submit: `.btn.full`
7. KVKK sadece `.kvkk-note` muted satır olarak kalır.

Desktop:

- Header: hero + lead + şube switch.
- Üstte harita `map-card` kalabilir.
- İçerik `.lay-2`: sol kolon şube/iletişim rail, sağ kolon form rail + mesaj rail + submit.
- Info card beyaz/warm surface kullanır; form rail warm paneldir.

---

## 5. Sapmalar

Eski DARK sapmaları LIGHT geçişinde temizlendi/kontrol edildi:

- Deep/warm radial body zemini: kontrol edildi, kaldırıldı.
- `background-attachment: fixed`: kontrol edildi, kaldırıldı.
- Beyaz yazı/koyu overlay varsayımı: kontrol edildi, LIGHT dark text'e çevrildi.
- `scene-deep`, `scene-warm`, `color-on-deep`: kontrol edildi, kalıntı yok.
- Manrope: kontrol edildi, kalıntı yok.
- KVKK kartı yok; `.kvkk-note` link satırı korunur.
- Mobil iletişimde map yok.

---

## 6. Doğrulama

Komutlar:

```bash
npx tsc --noEmit
npx eslint .
```

Kalıntı taraması:

```bash
Manrope = 0
scene-deep = 0
scene-warm = 0
color-on-deep = 0
```

Görsel kontrol:

- `/iletisim`: açık warm krem zemin, koyu yazı, primary vurgu.
- `/sss`: açık warm krem zemin, koyu yazı, surface accordion.

---

## 7. Red Kriterleri

Aşağıdakiler geri eklenmeyecek:

- Trust kartları.
- “Mühendise sor” CTA/mode toggle.
- Firma toggle.
- KVKK kartı; sadece `.kvkk-note` link satırı OK.
- Vergi no alanı.
- Mobil map.
- Backdrop-filter olmadan transparent overlay.
- Gri/hardcoded border; sadece token `--line` / `--line-soft`.
- Koyu zemin varsayımıyla beyaz metin.

---

## 8. Cursor Prompt

`mockups/TURUNCU-LIGHT-UI-KIT.html` tek doğru kaynaktır. `DENETIM-RAPORU-iletisim-sss.md` v2 LIGHT spec Bölüm 1-7'ye göre yalnızca `src/components/iletisim/`, `app/iletisim/`, `src/components/sss/`, `app/sss/` ve `src/styles/components/solstice/solstice-tokens-v2.css` dosyalarını LIGHT temaya hizala. Eski DARK radial sahne, beyaz text varsayımı, `scene-deep`, `scene-warm`, `color-on-deep`, Manrope ve red kriterlerdeki UI öğelerini geri ekleme. Sonunda `npx tsc --noEmit`, `npx eslint .`, kalıntı taraması ve `/iletisim` + `/sss` görsel kontrolünü yap.
