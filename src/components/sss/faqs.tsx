/**
 * SSS (FAQ) veri kaynağı — Faz 03.
 * `SssDesktop` SSS verisini tüketir.
 * İçerik JSX ReactNode olarak gömülü; tek kaynak garantisi için buradadır.
 */

import type { ReactNode } from "react";

export type FaqCategory =
  | "Tümü"
  | "Kurulum"
  | "Maliyet"
  | "Bakım"
  | "Teknik"
  | "İzinler"
  | "Garanti";

export type FaqItem = {
  id: string;
  num: string;
  title: string;
  category: Exclude<FaqCategory, "Tümü">;
  tags?: string[];
  answer: ReactNode;
};

export const FAQ_INTRO_TEXT =
  "Kurulum, maliyet, bakım, teknik detaylar, izinler ve garanti başlıklarını sade bir şekilde incele.";

export const FAQ_CATEGORIES: ReadonlyArray<{ key: FaqCategory; count: number }> = [
  { key: "Tümü", count: 10 },
  { key: "Kurulum", count: 3 },
  { key: "Maliyet", count: 2 },
  { key: "Bakım", count: 1 },
  { key: "Teknik", count: 2 },
  { key: "İzinler", count: 1 },
  { key: "Garanti", count: 1 },
];

export const FAQS: ReadonlyArray<FaqItem> = [
  {
    id: "kurulum-suresi",
    num: "01",
    title: "Güneş enerjisi sistemi kurulumu ne kadar sürer?",
    category: "Kurulum",
    tags: ["Süreç", "Zaman", "Planlama"],
    answer: (
      <>
        <p>
          Ortalama bir konut için <b>fiziksel kurulum 2 – 4 gün</b> sürer. Toplam proje süreci:
        </p>
        <ul>
          <li><b>Ön keşif & ölçüm</b> — 1 hafta</li>
          <li><b>Mühendislik & tasarım</b> — 1–2 hafta</li>
          <li><b>Şebeke başvurusu & izinler</b> — 3–4 hafta</li>
          <li><b>Fiziksel kurulum</b> — 2–4 gün</li>
          <li><b>Test ve devreye alma</b> — 1 gün</li>
        </ul>
        <p>
          Toplam süre ortalama <b>5–7 haftadır</b>; izin süresi şehirden şehire değişir.
        </p>
      </>
    ),
  },
  {
    id: "geri-donus",
    num: "02",
    title: "Yatırımın geri dönüş süresi ne kadar?",
    category: "Maliyet",
    tags: ["Geri ödeme", "Amortisman"],
    answer: (
      <>
        <p>
          Konutlarda tipik geri ödeme süresi <b>4 – 6 yıl</b>. Üç değişken belirler: sistem
          büyüklüğü, aylık tüketim profili ve elektrik tarifenin kademesi.
        </p>
        <p>
          25 yıl panel ömrüyle, sistem kendini ödedikten sonra <b>18–20 yıl net getiri</b> üretir.
        </p>
      </>
    ),
  },
  {
    id: "panel-omru",
    num: "03",
    title: "Panellerin ve inverterin ömrü ne kadar?",
    category: "Garanti",
    tags: ["Garanti", "Ömür"],
    answer: (
      <>
        <p>
          <b>Panel performans garantisi 25–30 yıl</b>; 25. yılın sonunda paneller nominal gücün
          ~%85&apos;ini üretir. Donanım garantisi 10–12 yıl.
        </p>
        <p>
          <b>İnverter</b> standart garantisi 10 yıl, uzatılabilir. 10–15 yılda bir değişim beklenir.
        </p>
      </>
    ),
  },
  {
    id: "bakim",
    num: "04",
    title: "Sistem nasıl bir bakım gerektirir?",
    category: "Bakım",
    tags: ["Bakım", "Temizlik"],
    answer: (
      <>
        <p>
          Hareketli parça yok — bakım minimum. Yılda <b>1 görsel kontrol + temizlik</b>;
          tozlu/tarım bölgelerinde 2 kez.
        </p>
        <p>
          Turuncu Solar, <b>ücretsiz yıllık uzaktan performans raporu</b> ve anormal üretim
          uyarıları gönderir.
        </p>
      </>
    ),
  },
  {
    id: "fatura-dususu",
    num: "05",
    title: "Elektrik faturam ne kadar düşer?",
    category: "Maliyet",
    tags: ["Fatura", "Tasarruf"],
    answer: (
      <>
        <p>
          Doğru boyutlandırılmış sistemde <b>yıllık faturanın %70–95&apos;i</b> karşılanır. Kalan
          pay sabit dağıtım bedelleri ve kış açığından gelir.
        </p>
        <p>
          Mahsuplaşma ile fazla üretim şebekeye verilir, ileriki aylarda mahsup edilir.
        </p>
      </>
    ),
  },
  {
    id: "kis-bulut",
    num: "06",
    title: "Kışın ve bulutlu günlerde sistem çalışır mı?",
    category: "Teknik",
    tags: ["Verim", "İklim"],
    answer: (
      <>
        <p>
          Evet. Paneller <b>yayılmış ışıkla</b> da üretim yapar; bulutlu günde verim %10–25&apos;e
          düşer ama durmaz. Kışın yaz aylarına göre %40–50 azalır.
        </p>
        <p>
          Yıllık hesap, yaz fazlasıyla kış açığını dengeler — sistemler yıllık tüketim üzerinden
          boyutlandırılır.
        </p>
      </>
    ),
  },
  {
    id: "hangi-sistem",
    num: "07",
    title: "Hangi sistem benim için uygun: On-Grid, Hibrit ya da Off-Grid?",
    category: "Kurulum",
    tags: ["Sistem", "Seçim"],
    answer: (
      <>
        <p><b>On-Grid:</b> şebekeye bağlı, mahsuplaşmalı — şehir içi konutların çoğuna uygun.</p>
        <p><b>Hibrit:</b> batarya destekli, kesintide kritik yükleri çalıştırır.</p>
        <p><b>Off-Grid:</b> tamamen bağımsız — dağ evi, tarla ve şebekesiz noktalar için.</p>
      </>
    ),
  },
  {
    id: "cati-uygun",
    num: "08",
    title: "Çatım güneş enerjisi için uygun mu?",
    category: "Kurulum",
    tags: ["Çatı", "Yön"],
    answer: (
      <>
        <p>
          Çoğu çatı uygundur. En verimli yön <b>güney</b>, eğim <b>25°–35°</b>. Doğu–batı çatılar
          ~%10–15 düşük verim. Kiremit, sandviç panel, shingle ve beton için özel montaj var.
        </p>
        <p>
          Keşifte yük, yön, gölgelenme ve yaş kontrol edilir; uygun değilse zemin/arazi
          alternatifi değerlendirilir.
        </p>
      </>
    ),
  },
  {
    id: "izin",
    num: "09",
    title: "İzin ve başvuru süreci nasıl işler?",
    category: "İzinler",
    tags: ["İzin", "Bürokrasi"],
    answer: (
      <>
        <p>
          Tüm başvuru sürecini Turuncu Solar yürütür: <b>bağlantı anlaşması</b>, <b>çağrı
          mektubu</b>, <b>sayaç değişimi</b>, devreye alma.
        </p>
        <p>Ortalama 3–4 hafta. Müşteriden sadece tapu + kimlik paylaşımı.</p>
      </>
    ),
  },
  {
    id: "uzaktan-izleme",
    num: "10",
    title: "Sistemi uzaktan izleyebilir miyim?",
    category: "Teknik",
    tags: ["İzleme", "Uygulama"],
    answer: (
      <>
        <p>
          Evet. <b>Mobil uygulama + web panel</b> ile canlı izleme: anlık güç, günlük/aylık/yıllık
          üretim, tasarruf, CO₂ eşdeğeri.
        </p>
        <p>Anormal üretimde otomatik uyarı; saha ekibi aynı gün müdahale eder.</p>
      </>
    ),
  },
];

/**
 * Düz metin özet — JSON-LD FAQPage veya arama için.
 * ReactNode answer'dan ayrı olarak kısa/özet string versiyon.
 */
export function getFaqAnswerText(id: string): string {
  const texts: Record<string, string> = {
    "kurulum-suresi":
      "Ortalama konutta fiziksel kurulum 2–4 gün; toplam süreç (keşif, tasarım, izin, kurulum, devreye alma) 5–7 hafta.",
    "geri-donus":
      "Konutlarda geri ödeme 4–6 yıl; sonraki 18–20 yıl net getiri üretir.",
    "panel-omru":
      "Panel performans garantisi 25–30 yıl, donanım 10–12 yıl. İnverter standart 10 yıl, 10–15 yılda değişim.",
    "bakim":
      "Yılda 1–2 görsel kontrol ve temizlik yeter; ücretsiz yıllık uzaktan performans raporu sağlanır.",
    "fatura-dususu":
      "Doğru boyutlandırılmış sistemde yıllık faturanın %70–95'i karşılanır; mahsuplaşma fazla üretimi ileriki aylara taşır.",
    "kis-bulut":
      "Bulutlu günde %10–25'e düşer, kışın %40–50 azalır; yıllık hesap yaz fazlasıyla kış açığını dengeler.",
    "hangi-sistem":
      "On-Grid şebekeye bağlı; Hibrit batarya destekli; Off-Grid tamamen bağımsız — seçim konum ve ihtiyaca göre.",
    "cati-uygun":
      "Çoğu çatı uygun. En verimli yön güney, eğim 25°–35°. Kiremit/sandviç/beton için özel montaj.",
    "izin":
      "Tüm süreci Turuncu Solar yürütür: bağlantı anlaşması, çağrı mektubu, sayaç değişimi. Ortalama 3–4 hafta.",
    "uzaktan-izleme":
      "Mobil + web panel ile canlı izleme: anlık güç, üretim, tasarruf, CO₂. Anormal üretimde otomatik uyarı.",
  };
  return texts[id] ?? "";
}
