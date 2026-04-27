export type ReferenceSector = "Sanayi" | "Lojistik" | "Tarım" | "Turizm" | "Ticari";

export type ReferenceStatus = "Tamamlandı" | "Devam Eden" | "Yapım Aşamasında";

export type ReferenceProject = {
  id: string;
  title: string;
  city: string;
  country: string;
  sector: ReferenceSector;
  status: ReferenceStatus;
  systemType: "On-Grid" | "Hibrit" | "Hibrit + Batarya";
  image: string;
  imageAlt: string;
  gallery?: ReadonlyArray<{ src: string; alt: string }>;
  description: string;
  tags: ReadonlyArray<string>;
  installedPowerKw: number;
  annualProductionMWh: number;
  co2ReductionTon: number;
  performanceRatio: number;
  commissioningDate: string;
};

export const REFERENCE_PROJECTS: ReadonlyArray<ReferenceProject> = [
  {
    id: "gebze-elektronik-fabrikasi",
    title: "Gebze Elektronik Fabrikası Çatı GES",
    city: "Kocaeli",
    country: "Türkiye",
    sector: "Sanayi",
    status: "Tamamlandı",
    systemType: "On-Grid",
    image: "/projects/gebze-elektronik-fabrikasi.webp",
    imageAlt: "Gebze elektronik fabrikası çatı GES projesi",
    gallery: [
      { src: "/projects/gebze-elektronik-fabrikasi.webp", alt: "Çatı genel görünüm" },
      { src: "/projects/bursa-lojistik-merkezi.webp", alt: "Panel dizilim detayı" },
      { src: "/projects/manisa-tarim-kampusu.webp", alt: "Bağlantı kabini" },
      { src: "/projects/ankara-ticari-kompleks.webp", alt: "İnverter odası" },
    ],
    description:
      "Yüksek gündüz tüketimi olan üretim hattı için proje, izin süreçleri ve devreye alma dahil uçtan uca uygulama tamamlandı.",
    tags: ["Çatı GES", "Sanayi", "On-Grid", "Verim Takibi"],
    installedPowerKw: 1280,
    annualProductionMWh: 1910,
    co2ReductionTon: 1014,
    performanceRatio: 82.3,
    commissioningDate: "Kasım 2024",
  },
  {
    id: "bursa-lojistik",
    title: "Bursa Lojistik Merkezi Hibrit GES",
    city: "Bursa",
    country: "Türkiye",
    sector: "Lojistik",
    status: "Tamamlandı",
    systemType: "Hibrit + Batarya",
    image: "/projects/bursa-lojistik-merkezi.webp",
    imageAlt: "Bursa lojistik merkezi hibrit güneş enerji projesi",
    gallery: [
      { src: "/projects/bursa-lojistik-merkezi.webp", alt: "Depo çatısı genel" },
      { src: "/projects/izmir-lojistik-hub.webp", alt: "Batarya odası" },
      { src: "/projects/ankara-ticari-kompleks.webp", alt: "İnverter hattı" },
    ],
    description:
      "Kesinti toleransı düşük operasyonlar için batarya destekli hibrit mimari kurgulandı ve enerji sürekliliği artırıldı.",
    tags: ["Lojistik", "Depolama", "Hibrit", "Kesinti Dayanımı"],
    installedPowerKw: 960,
    annualProductionMWh: 1385,
    co2ReductionTon: 742,
    performanceRatio: 81.6,
    commissioningDate: "Ekim 2024",
  },
  {
    id: "manisa-tarim",
    title: "Manisa Tarım Kampüsü Sulama Projesi",
    city: "Manisa",
    country: "Türkiye",
    sector: "Tarım",
    status: "Tamamlandı",
    systemType: "Hibrit",
    image: "/projects/manisa-tarim-kampusu.webp",
    imageAlt: "Manisa tarım kampüsü hibrit GES sistemi",
    gallery: [
      { src: "/projects/manisa-tarim-kampusu.webp", alt: "Tarla üstü panel sıraları" },
      { src: "/projects/gebze-elektronik-fabrikasi.webp", alt: "Sulama pompa odası" },
      { src: "/projects/antalya-resort-otel.webp", alt: "İzleme panosu" },
      { src: "/projects/izmir-lojistik-hub.webp", alt: "Saha bağlantı kabini" },
    ],
    description:
      "Sulama ve soğutma yükleri için mevsimsel üretim-tüketim profilini dengeleyen hibrit sistem modeli uygulandı.",
    tags: ["Tarım", "Sulama", "Hibrit", "Mevsimsel Yük"],
    installedPowerKw: 740,
    annualProductionMWh: 1060,
    co2ReductionTon: 566,
    performanceRatio: 80.8,
    commissioningDate: "Eylül 2024",
  },
  {
    id: "antalya-turizm",
    title: "Antalya Resort Otel Çatı + Otopark GES",
    city: "Antalya",
    country: "Türkiye",
    sector: "Turizm",
    status: "Tamamlandı",
    systemType: "On-Grid",
    image: "/projects/antalya-resort-otel.webp",
    imageAlt: "Antalya turizm tesisi güneş enerji sistemi",
    gallery: [
      { src: "/projects/antalya-resort-otel.webp", alt: "Otel çatı kuşbakışı" },
      { src: "/projects/ankara-ticari-kompleks.webp", alt: "Otopark gölgelik GES" },
      { src: "/projects/gebze-elektronik-fabrikasi.webp", alt: "Trafo odası" },
    ],
    description:
      "Yüksek sezon tüketimini dengelemek için çatı ve gölgelik alanlar birlikte değerlendirilerek kurulum optimize edildi.",
    tags: ["Turizm", "On-Grid", "Otopark GES", "KPI"],
    installedPowerKw: 1125,
    annualProductionMWh: 1670,
    co2ReductionTon: 892,
    performanceRatio: 83.1,
    commissioningDate: "Aralık 2024",
  },
  {
    id: "ankara-ticari",
    title: "Ankara Ticari Kompleks Depolamalı Hibrit",
    city: "Ankara",
    country: "Türkiye",
    sector: "Ticari",
    status: "Tamamlandı",
    systemType: "Hibrit + Batarya",
    image: "/projects/ankara-ticari-kompleks.webp",
    imageAlt: "Ankara ticari hibrit depolamalı güneş enerji projesi",
    gallery: [
      { src: "/projects/ankara-ticari-kompleks.webp", alt: "Kompleks dış cephe" },
      { src: "/projects/bursa-lojistik-merkezi.webp", alt: "Batarya kabini" },
      { src: "/projects/manisa-tarim-kampusu.webp", alt: "Pano detayları" },
      { src: "/projects/izmir-lojistik-hub.webp", alt: "Çatı geçiş noktaları" },
    ],
    description:
      "Akşam pik yüklerinde maliyet optimizasyonu ve kritik yük sürekliliği için depolamalı hibrit yapı devreye alındı.",
    tags: ["Ticari", "Depolama", "Hibrit", "Pik Yönetimi"],
    installedPowerKw: 1540,
    annualProductionMWh: 2260,
    co2ReductionTon: 1208,
    performanceRatio: 81.9,
    commissioningDate: "Ocak 2025",
  },
  {
    id: "konya-tarim",
    title: "Konya Tarım İşletmesi Sulama GES",
    city: "Konya",
    country: "Türkiye",
    sector: "Tarım",
    status: "Tamamlandı",
    systemType: "Hibrit",
    image: "/projects/manisa-tarim-kampusu.webp",
    imageAlt: "Konya tarım işletmesi sulama hibrit GES projesi",
    gallery: [
      { src: "/projects/manisa-tarim-kampusu.webp", alt: "Tarla genel görünüm" },
      { src: "/projects/izmir-lojistik-hub.webp", alt: "Pompa kabini" },
    ],
    description:
      "Geniş ovada damla sulama sistemine entegre, mevsimsel yük profiline uygun hibrit kurulum gerçekleştirildi.",
    tags: ["Tarım", "Sulama", "Hibrit"],
    installedPowerKw: 680,
    annualProductionMWh: 985,
    co2ReductionTon: 524,
    performanceRatio: 80.4,
    commissioningDate: "Mart 2025",
  },
  {
    id: "kayseri-sanayi",
    title: "Kayseri Mobilya Fabrikası Çatı GES",
    city: "Kayseri",
    country: "Türkiye",
    sector: "Sanayi",
    status: "Tamamlandı",
    systemType: "On-Grid",
    image: "/projects/gebze-elektronik-fabrikasi.webp",
    imageAlt: "Kayseri mobilya fabrikası çatı GES",
    gallery: [
      { src: "/projects/gebze-elektronik-fabrikasi.webp", alt: "Çatı dizilim" },
      { src: "/projects/ankara-ticari-kompleks.webp", alt: "İnverter odası" },
      { src: "/projects/bursa-lojistik-merkezi.webp", alt: "Pano detayları" },
    ],
    description:
      "Mobilya üretim hattının yüksek gündüz tüketimi için çatı odaklı ekonomik on-grid sistem tasarlandı.",
    tags: ["Sanayi", "Mobilya", "Çatı GES"],
    installedPowerKw: 1100,
    annualProductionMWh: 1635,
    co2ReductionTon: 869,
    performanceRatio: 82.0,
    commissioningDate: "Şubat 2025",
  },
  {
    id: "gaziantep-tekstil",
    title: "Gaziantep Tekstil Tesisi GES",
    city: "Gaziantep",
    country: "Türkiye",
    sector: "Sanayi",
    status: "Tamamlandı",
    systemType: "On-Grid",
    image: "/projects/gebze-elektronik-fabrikasi.webp",
    imageAlt: "Gaziantep tekstil tesisi GES projesi",
    gallery: [
      { src: "/projects/gebze-elektronik-fabrikasi.webp", alt: "Çatı genel" },
      { src: "/projects/manisa-tarim-kampusu.webp", alt: "Saha kabini" },
    ],
    description:
      "Boyahane ve dokuma hatlarının sürekli tüketimini destekleyen geniş ölçekli çatı GES uygulaması.",
    tags: ["Tekstil", "Sanayi", "On-Grid"],
    installedPowerKw: 1850,
    annualProductionMWh: 2740,
    co2ReductionTon: 1463,
    performanceRatio: 82.5,
    commissioningDate: "Aralık 2024",
  },
  {
    id: "mersin-liman",
    title: "Mersin Liman Aktarma Merkezi GES",
    city: "Mersin",
    country: "Türkiye",
    sector: "Lojistik",
    status: "Tamamlandı",
    systemType: "On-Grid",
    image: "/projects/izmir-lojistik-hub.webp",
    imageAlt: "Mersin liman aktarma merkezi GES",
    gallery: [
      { src: "/projects/izmir-lojistik-hub.webp", alt: "Liman çatısı" },
      { src: "/projects/bursa-lojistik-merkezi.webp", alt: "Konteyner sahası" },
    ],
    description:
      "Aktarma merkezi yönetim binası ve depolar için çatı GES uygulaması ile yıllık tüketim önemli ölçüde dengelendi.",
    tags: ["Liman", "Lojistik", "On-Grid"],
    installedPowerKw: 920,
    annualProductionMWh: 1380,
    co2ReductionTon: 735,
    performanceRatio: 82.1,
    commissioningDate: "Ocak 2025",
  },
  {
    id: "mugla-otel",
    title: "Muğla Butik Otel Çatı GES",
    city: "Muğla",
    country: "Türkiye",
    sector: "Turizm",
    status: "Tamamlandı",
    systemType: "Hibrit + Batarya",
    image: "/projects/antalya-resort-otel.webp",
    imageAlt: "Muğla butik otel çatı GES projesi",
    gallery: [
      { src: "/projects/antalya-resort-otel.webp", alt: "Otel kuşbakışı" },
      { src: "/projects/ankara-ticari-kompleks.webp", alt: "Batarya odası" },
    ],
    description:
      "Şebeke kesintilerine dayanıklı, sezonsal tüketim için optimize edilmiş hibrit + batarya kurulumu yapıldı.",
    tags: ["Otel", "Turizm", "Hibrit", "Batarya"],
    installedPowerKw: 540,
    annualProductionMWh: 805,
    co2ReductionTon: 430,
    performanceRatio: 82.7,
    commissioningDate: "Kasım 2024",
  },
  {
    id: "eskisehir-avm",
    title: "Eskişehir AVM Otopark + Çatı GES",
    city: "Eskişehir",
    country: "Türkiye",
    sector: "Ticari",
    status: "Tamamlandı",
    systemType: "On-Grid",
    image: "/projects/ankara-ticari-kompleks.webp",
    imageAlt: "Eskişehir AVM otopark ve çatı GES",
    gallery: [
      { src: "/projects/ankara-ticari-kompleks.webp", alt: "AVM görünüm" },
      { src: "/projects/antalya-resort-otel.webp", alt: "Otopark gölgelik" },
      { src: "/projects/gebze-elektronik-fabrikasi.webp", alt: "İnverter sahası" },
    ],
    description:
      "AVM ortak alan tüketimini hedefleyen, çatı ve otopark gölgelik GES birlikte değerlendirilen kurulum.",
    tags: ["AVM", "Ticari", "Otopark GES"],
    installedPowerKw: 1320,
    annualProductionMWh: 1955,
    co2ReductionTon: 1043,
    performanceRatio: 82.2,
    commissioningDate: "Mart 2025",
  },
  {
    id: "izmir-lojistik",
    title: "İzmir Lojistik Hub Dağıtım Merkezi",
    city: "İzmir",
    country: "Türkiye",
    sector: "Lojistik",
    status: "Tamamlandı",
    systemType: "Hibrit",
    image: "/projects/izmir-lojistik-hub.webp",
    imageAlt: "İzmir lojistik dağıtım merkezi hibrit güneş enerji projesi",
    gallery: [
      { src: "/projects/izmir-lojistik-hub.webp", alt: "Hub çatısı genel" },
      { src: "/projects/gebze-elektronik-fabrikasi.webp", alt: "İnverter sahası" },
      { src: "/projects/bursa-lojistik-merkezi.webp", alt: "Sevkiyat alanı GES" },
    ],
    description:
      "Depo ve sevkiyat operasyonları için tek panelden izlenebilir, bakım odaklı hibrit enerji yönetimi sağlandı.",
    tags: ["Lojistik", "Hibrit", "Operasyon", "İzleme"],
    installedPowerKw: 860,
    annualProductionMWh: 1260,
    co2ReductionTon: 670,
    performanceRatio: 81.2,
    commissioningDate: "Şubat 2025",
  },
  /* ── Devam eden projeler (saha ve devreye alma aşamaları) ── */
  {
    id: "eskisehir-otomotiv",
    title: "Eskişehir Otomotiv Yan Sanayi Çatı GES",
    city: "Eskişehir",
    country: "Türkiye",
    sector: "Sanayi",
    status: "Devam Eden",
    systemType: "On-Grid",
    image: "/projects/gebze-elektronik-fabrikasi.webp",
    imageAlt: "Eskişehir otomotiv yan sanayi çatı GES projesi",
    gallery: [
      { src: "/projects/gebze-elektronik-fabrikasi.webp", alt: "Çatı ön hazırlık" },
      { src: "/projects/ankara-ticari-kompleks.webp", alt: "Pano montaj sahası" },
    ],
    description:
      "Otomotiv yan sanayi tesisi için panel montajı tamamlandı, inverter devreye alma ve şebeke bağlantı testleri sürüyor.",
    tags: ["Sanayi", "Otomotiv", "Çatı GES", "Devreye Alma"],
    installedPowerKw: 1420,
    annualProductionMWh: 2100,
    co2ReductionTon: 1122,
    performanceRatio: 82.5,
    commissioningDate: "Nisan 2026 (planlanan)",
  },
  /* ── Yapım aşamasındaki projeler (imalat / kurulum başlangıcı) ── */
  {
    id: "mersin-lojistik",
    title: "Mersin Liman Lojistik Merkezi Depolamalı GES",
    city: "Mersin",
    country: "Türkiye",
    sector: "Lojistik",
    status: "Yapım Aşamasında",
    systemType: "Hibrit + Batarya",
    image: "/projects/bursa-lojistik-merkezi.webp",
    imageAlt: "Mersin liman lojistik merkezi depolamalı GES projesi",
    gallery: [
      { src: "/projects/bursa-lojistik-merkezi.webp", alt: "Saha ölçüm çalışması" },
    ],
    description:
      "Liman lojistiği için batarya destekli hibrit sistem projelendirildi; çatı statik analizi ve pano imalatı aşamasında.",
    tags: ["Lojistik", "Liman", "Depolama", "Hibrit"],
    installedPowerKw: 2100,
    annualProductionMWh: 3050,
    co2ReductionTon: 1630,
    performanceRatio: 82.0,
    commissioningDate: "Eylül 2026 (planlanan)",
  },
  {
    id: "tekirdag-gida",
    title: "Tekirdağ Gıda İşleme Tesisi Çatı GES",
    city: "Tekirdağ",
    country: "Türkiye",
    sector: "Sanayi",
    status: "Yapım Aşamasında",
    systemType: "On-Grid",
    image: "/projects/ankara-ticari-kompleks.webp",
    imageAlt: "Tekirdağ gıda tesisi çatı GES projesi",
    gallery: [
      { src: "/projects/ankara-ticari-kompleks.webp", alt: "Saha ön inceleme" },
    ],
    description:
      "Soğutma + üretim hattı tüketimini dengelemek üzere tasarlanan çatı GES için saha hazırlıkları ve kablo güzergahı çalışmaları başladı.",
    tags: ["Sanayi", "Gıda", "Çatı GES", "Saha"],
    installedPowerKw: 980,
    annualProductionMWh: 1445,
    co2ReductionTon: 772,
    performanceRatio: 81.4,
    commissioningDate: "Temmuz 2026 (planlanan)",
  },
];

export const SECTOR_FILTERS = ["Tümü", "Sanayi", "Lojistik", "Tarım", "Turizm", "Ticari"] as const;

export type SectorFilter = (typeof SECTOR_FILTERS)[number];

export const STATUS_FILTERS = ["Tümü", "Tamamlandı", "Devam Eden", "Yapım Aşamasında"] as const;

export type StatusFilter = (typeof STATUS_FILTERS)[number];
