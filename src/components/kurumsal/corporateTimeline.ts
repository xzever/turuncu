export type CompanyTimelineEntry = {
  year: string;
  title: string;
  description: string;
  image: string;
};

/** Kurumsal / Hakkımızda — masaüstü ve mobil timeline tek kaynak */
export const COMPANY_TIMELINE: ReadonlyArray<CompanyTimelineEntry> = [
  { year: "2019", title: "Kuruluş", description: "Turuncu Solar, güneş enerjisi sektöründe mühendislik odaklı çözüm üretmek amacıyla kuruldu.", image: "/hakkimizda.webp" },
  { year: "2020", title: "İlk Projeler", description: "İlk konut ve ticari güneş enerjisi sistemleri başarıyla devreye alındı.", image: "/biz-kimiz.webp" },
  { year: "2021", title: "Büyüme", description: "Proje kapasitesi artırıldı, çok lokasyonlu operasyon modeline geçildi.", image: "/sistemlerimiz.webp" },
  { year: "2022", title: "Genişleme", description: "Antalya ve Ankara'da yeni şubeler açılarak hizmet ağı genişletildi.", image: "/faaliyet-alanlari.webp" },
  { year: "2023", title: "5 MW Kurulu Güç", description: "Toplam kurulu güç 5 MW'ı aştı, veri odaklı performans izleme sistemi devreye alındı.", image: "/solar-bg.webp" },
  { year: "2024", title: "Dijital Dönüşüm", description: "Müşteri portalı ve anlık izleme sistemiyle dijital altyapı güçlendirildi.", image: "/blog-arka.webp" },
  { year: "2025", title: "Sürdürülebilir Gelecek", description: "Enerji depolama ve hibrit sistem çözümleriyle yeni nesil projelere adım atıldı.", image: "/arkaplan.jpg" },
  { year: "2026", title: "Vizyon 2026", description: "Türkiye'nin referans enerji markası olma hedefiyle stratejik büyüme planı hayata geçirildi.", image: "/referanslar.webp" },
];
