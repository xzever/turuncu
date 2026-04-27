# TURUNCU SOLAR — DESIGN LOCK (SOLSTICE DARK)

> **Onay tarihi:** 2026-04-26  
> **Kaynak referans:** `mockups/SOLSTICE-DARK-design-system.html`  
> **Durum:** 🔒 **KİLİTLİ** — bu tasarım dili tek geçerli görsel sistemdir.

Bu doküman görsel kilittir. Uygulama kural hiyerarşisinde `AGENTS.md` ana kuraldır; burada
tanımlanan tasarım kararları onunla çelişmeden uygulanır.

---

## 1) Tek Doğru Referans

- Solstice DARK sistemindeki palette, komponent dili, ikon tavrı ve yüzey yapısı baz alınır.
- Yeni ekran/komponent yapılırken önce bu sistemde eşleniği bulunur, sonra kodlanır.
- "Bu sayfada farklı olsun" yaklaşımı yasak; varyant gerekiyorsa token/komponent seviyesinde eklenir.

---

## 2) Renk ve Yüzey Kilidi

Tek kaynak: `src/styles/tokens/colors.css` (ve blog/feature local token katmanı).

### 2.1 Ana Solstice DARK tonları
| Token (anlam) | Değer | Kullanım |
|---|---|---|
| `--bg` | `#100E0B` | Ana koyu zemin |
| `--surface` | `#1B1714` | Kart, input, panel yüzeyi |
| `--surface-2` | `#26211C` | Sıcak ikinci yüzey |
| `--surface-3` | `#332D26` | Hover/active yüzey |
| `--text` | `#F5F1E8` | Ana metin |
| `--muted` | `rgba(245,241,232,0.68)` | Paragraf/ikincil metin |
| `--dim` | `rgba(245,241,232,0.45)` | Meta |
| `--hint` | `rgba(245,241,232,0.30)` | Placeholder |
| `--accent` | `#FF6A00` | Marka vurgu/CTA |
| `--accent-hover` | `#FF8533` | Hover |
| `--accent-soft` | `rgba(255,106,0,0.16)` | Soft vurgu |
| `--accent-glow` | `rgba(255,106,0,0.42)` | Glow/border |
| `--line` | `rgba(245,241,232,0.10)` | Border |
| `--line-soft` | `rgba(245,241,232,0.05)` | İnce ayraç |

### 2.2 Yasaklar
- Hardcoded hex/rgba yazmak yasak (token dışı renk yok).
- Açık tema bileşenini koyu tema içine gömmek yasak.
- Turuncu dışı rastgele vurgu rengi yasak.

---

## 3) Tipografi ve İkon Kilidi

- Display + body: **Manrope** yaklaşımı korunur.
- Kod/sayı yardımcı alanlar: mono (JetBrains Mono tarzı) kullanılabilir.
- İkon dili: Lucide-style stroke (`stroke=currentColor`, net çizgi, dolgu yok).
- Hiyerarşi: başlıklar güçlü, body muted; meta dim. Karışık ton kullanımına izin yok.

---

## 4) Komponent Dili (Zorunlu)

1. **Pill/Button:** tam yuvarlak, primary accent; ghost yüzey tabanlı.  
2. **Chip/Icon-chip:** filtre chip aktifte accent, icon-chip accent-soft dairesel.  
3. **Card:** surface tabanlı, soft line border, radius 14-18 bandı.  
4. **Accordion:** açık state accent border + sıcak arka plan.  
5. **Form:** koyu surface input + line border + belirgin focus state.  
6. **Topbar/BottomNav:** Solstice DARK chrome yapısı (mobil app hissi) korunur.  
7. **Prose/Article:** koyu zeminde okunaklı muted body, accent başlık vurguları.

---

## 5) Hareket ve Etkileşim

- Hover-only davranış yok; touch-first korunur.
- Hareketler kısa ve sakin (transform/opacity öncelikli).
- `prefers-reduced-motion` desteği zorunlu.
- Focus görünürlüğü erişilebilir kalır (projedeki focus kuralları geçerli).

---

## 6) Uygulama Kararı

Bu lock ile cevap: **Evet, bu daha doğru design lock.**  
Bundan sonra tasarım referansı olarak `mockups/SOLSTICE-DARK-design-system.html` kullanılır.

---

## 7) Değişiklik Prosedürü

1. Gerekçe yazılır (neden mevcut Solstice LOCK yetmiyor).  
2. Etki analizi yapılır (hangi sayfalar/komponentler).  
3. `AGENTS.md` kuralları ile uyum kontrolü yapılır.  
4. Onay sonrası bu dosya versiyonu güncellenir.

---

*Versiyon: v2.0 — Solstice DARK referansına kilitlendi.*
