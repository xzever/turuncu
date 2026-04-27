# TURUNCU SOLAR — DESIGN LOCK (SOLSTICE LIGHT)

> **Onay tarihi:** 2026-04-28  
> **Kaynak referans:** `mockups/TURUNCU-LIGHT-UI-KIT.html`  
> **Durum:** 🔒 **KİLİTLİ** — açık tema tek geçerli görsel sistemdir.

Bu doküman görsel kilittir. Uygulama kural hiyerarşisinde `AGENTS.md` ana kuraldır; burada
tanımlanan tasarım kararları onunla çelişmeden uygulanır.

---

## 1) Tek Doğru Referans

- Solstice LIGHT sistemindeki palette, komponent dili, ikon tavrı ve yüzey yapısı baz alınır.
- Yeni ekran/komponent yapılırken önce `mockups/TURUNCU-LIGHT-UI-KIT.html` içinde eşleniği bulunur.
- "Bu sayfada farklı olsun" yaklaşımı yasak; varyant gerekiyorsa token/komponent seviyesinde eklenir.

---

## 2) Renk ve Yüzey Kilidi

Tek kaynak: `src/styles/tokens/colors.css` ve UI-kit komponent token katmanı.

### 2.1 Ana Solstice LIGHT tonları
| Token (anlam) | Değer | Kullanım |
|---|---|---|
| `--bg` / `--color-bg` | `#FAF6EE` | Ana açık warm krem zemin |
| `--surface` / `--color-surface` | `#FFFFFF` | Kart, input, panel yüzeyi |
| `--surface-2` / `--color-surface-warm` | `#F5EDDF` | Sıcak ikincil yüzey |
| `--surface-3` / `--color-surface-3` | `#FFF8EE` | Hover/active yüzey |
| `--text` / `--color-text` | `#1B1813` | Ana metin |
| `--muted` / `--color-muted` | `#6B5F4E` | Paragraf/ikincil metin |
| `--dim` / `--color-dim` | `#9C8E7A` | Meta, açıklama |
| `--hint` | `rgba(27,24,19,0.30)` | Placeholder |
| `--primary` / `--color-primary` | `#D4621A` | Marka vurgu/CTA |
| `--primary-hover` / `--color-primary-hover` | `#B8521A` | Hover |
| `--primary-soft` / `--color-primary-soft` | `rgba(212,98,26,0.10)` | Soft vurgu |
| `--gold` / `--color-gold` | `#C9A961` | Premium detay |
| `--line` / `--color-line` | `rgba(27,24,19,0.10)` | Border |
| `--line-soft` / `--color-line-soft` | `rgba(27,24,19,0.05)` | İnce ayraç |

### 2.2 Yasaklar
- Koyu Solstice DARK yüzeyleri yeni tasarımda kullanmak yasak.
- Radial deep/warm page gradient'leri tasarım zemini olarak geri getirmek yasak.
- Turuncu/altın dışında rastgele vurgu rengi yasak.

---

## 3) Tipografi ve İkon Kilidi

- Display + body: **Roboto**.
- Başlıklar: **Roboto Slab**.
- Kod/sayı yardımcı alanlar: **Roboto Mono**.
- İkon dili: Lucide-style stroke (`stroke=currentColor`, net çizgi, dolgu yok).
- Hiyerarşi: başlıklar koyu text, body muted; meta dim.

---

## 4) Komponent Dili (Zorunlu)

1. **Pill/Button:** primary turuncu; ghost beyaz yüzey + line border.  
2. **Chip/Icon-chip:** filtre chip aktifte primary; pasifte beyaz yüzey.  
3. **Card:** surface tabanlı, soft line border, radius 14-20 bandı.  
4. **Accordion:** açık state primary border + `--surface-3` zemin.  
5. **Form:** light surface input + line border + primary focus state.  
6. **Topbar/BottomNav:** Solstice LIGHT chrome yapısı korunur.  
7. **Prose/Article:** açık zeminde koyu body, primary başlık/vurgu.

---

## 5) Hareket ve Etkileşim

- Hover-only davranış yok; touch-first korunur.
- Hareketler kısa ve sakin (transform/opacity öncelikli).
- `prefers-reduced-motion` desteği zorunlu.
- Focus görünürlüğü erişilebilir kalır.

---

## 6) Uygulama Kararı

**v3.0 — Açık tema (Solstice LIGHT) referansına yeniden kilitlendi. Tek kaynak: `mockups/TURUNCU-LIGHT-UI-KIT.html`.**  
Açık tema final lock'tur. Solstice DARK arşivde.

---

## 7) Değişiklik Prosedürü

1. Gerekçe yazılır.  
2. Etki analizi yapılır.  
3. `AGENTS.md` kuralları ile uyum kontrolü yapılır.  
4. Onay sonrası bu dosya versiyonu güncellenir.

---

*Versiyon: v3.0 — Solstice LIGHT referansına kilitlendi.*
