"use client"

import { type ReactNode } from "react";
import {
  LayoutGrid,
  Waves,
  ArrowLeftRight,
  Zap,
  Layers,
  BatteryCharging,
  Unplug,
  Link2,
  CircleDollarSign,
  ShieldCheck,
  Target,
  TrendingUp,
  Briefcase,
  Search,
  FileText,
  FileCheck,
  Wrench,
  Activity,
} from "lucide-react";

export type DioramaSectionId = "grid" | "hybrid-no-battery" | "hybrid-with-battery" | "off-grid";
export type IconName =
  | "systems"
  | "flow"
  | "versus"
  | "grid"
  | "hybrid"
  | "battery"
  | "offgrid"
  | "dependency"
  | "investment"
  | "resilience"
  | "independence"
  | "roi"
  | "usecase"
  | "discovery"
  | "project"
  | "permits"
  | "install"
  | "monitor";
export type SystemColumnKey = "grid" | "hybridNoBattery" | "hybridWithBattery" | "offGrid";
export type KpiIconName = "roi" | "independence" | "investment";

export type SystemContent = {
  id: DioramaSectionId;
  navLabel: string;
  title: string;
  summary: string;
  bullets: ReadonlyArray<string>;
  kpis: ReadonlyArray<{ label: string; value: string; description: string; icon: KpiIconName }>;
  image: string;
  imageAlt: string;
};

export type ProcessStep = {
  step: string;
  title: string;
  detail: string;
  icon: IconName;
  duration: string;
};

/** Stable key for compare rows (locale-safe; do not use visible criterion text for logic). */
export type VersusRowId =
  | "grid-connection-mode"
  | "initial-budget"
  | "outage-performance"
  | "grid-independence-ratio"
  | "payback-period"
  | "permits-timeline"
  | "best-use-case";

export type VersusRow = {
  id: VersusRowId;
  criterion: string;
  criterionMeta: string;
  criterionIcon: IconName;
  grid: string;
  hybridNoBattery: string;
  hybridWithBattery: string;
  offGrid: string;
};

export type VersusColumn = {
  key: SystemColumnKey;
  label: string;
  icon: IconName;
  detail: string;
};


/*
  Tüm ikonlar tek aile (lucide-react) — tutarlı 24x24 viewBox, tutarlı stroke,
  tutarlı görsel ağırlık. CSS'te stroke-width 1.5'e düşürülür.
*/
const LUCIDE_PROPS = { size: "1em" as const, strokeWidth: 1.5 };

export const ICONS: Record<IconName, ReactNode> = {
  systems: <LayoutGrid {...LUCIDE_PROPS} />,
  flow: <Waves {...LUCIDE_PROPS} />,
  versus: <ArrowLeftRight {...LUCIDE_PROPS} />,
  grid: <Zap {...LUCIDE_PROPS} />,
  hybrid: <Layers {...LUCIDE_PROPS} />,
  battery: <BatteryCharging {...LUCIDE_PROPS} />,
  offgrid: <Unplug {...LUCIDE_PROPS} />,
  dependency: <Link2 {...LUCIDE_PROPS} />,
  investment: <CircleDollarSign {...LUCIDE_PROPS} />,
  resilience: <ShieldCheck {...LUCIDE_PROPS} />,
  independence: <Target {...LUCIDE_PROPS} />,
  roi: <TrendingUp {...LUCIDE_PROPS} />,
  usecase: <Briefcase {...LUCIDE_PROPS} />,
  discovery: <Search {...LUCIDE_PROPS} />,
  project: <FileText {...LUCIDE_PROPS} />,
  permits: <FileCheck {...LUCIDE_PROPS} />,
  install: <Wrench {...LUCIDE_PROPS} />,
  monitor: <Activity {...LUCIDE_PROPS} />,
};


export const SYSTEM_CONTENT: ReadonlyArray<SystemContent> = [
  {
    id: "grid",
    navLabel: "Şebeke Bağlantılı Mimari",
    title: "On-Grid",
    summary:
      "Şebekeye bağlı çalışır. Gündüz üretilen elektriği önce kendi tüketimin için kullanır, üretim yetmezse sistem otomatik olarak şebekeden beslenir.",
    bullets: [
      "Fazla üretim olduğunda çift yönlü sayaç üzerinden şebekeye satış yapılabilir.",
      "Üretim azaldığında enerji akışı kesilmez, şebeke desteği ile devam eder.",
      "Konut ve küçük/orta ölçekli işletmelerde en hızlı geri ödeme sunan modeldir.",
      "Projelendirme ve izin süreci çoğu kurulumda ortalama 3-4 ay sürer.",
    ],
    kpis: [
      {
        label: "Yatırımın Geri Ödeme Süresi",
        value: "3.2 - 4.6 yıl",
        description: "Elektrik tasarrufu ile yatırımın kendini ödeme aralığı",
        icon: "roi",
      },
      {
        label: "Şebekeden Bağımsız Çalışma",
        value: "%35",
        description: "Tüketimin şebekesiz karşılanabilen ortalama kısmı",
        icon: "independence",
      },
      {
        label: "İlk Kurulum Bütçesi",
        value: "Düşük",
        description: "Başlangıç ekipman ve montaj maliyeti seviyesi",
        icon: "investment",
      },
    ],
    image: "/sistemlerimiz.jpg",
    imageAlt: "On-grid güneş sistemi görseli",
  },
  {
    id: "hybrid-no-battery",
    navLabel: "Batarya Hazır Hibrit Mimari",
    title: "Hibrit Grid (Batarya Hazır)",
    summary:
      "On-grid çalışma mantığı aynıdır. Farkı, hibrit inverter sayesinde sisteme daha sonra batarya eklenebilmesidir.",
    bullets: [
      "Şebekeye bağlı çalışır ve enerji akışını tüketim önceliğine göre yönetir.",
      "Fazla üretim şebekeye satılabilir; altyapı batarya ilavesine hazır kalır.",
      "Üretim azaldığında şebekeden beslenerek kesintisiz enerji sağlar.",
      "Projelendirme ve izin süreci genelde 3-4 ay aralığındadır.",
    ],
    kpis: [
      {
        label: "Yatırımın Geri Ödeme Süresi",
        value: "3.8 - 5.2 yıl",
        description: "Batarya hazırlığıyla birlikte beklenen geri kazanım aralığı",
        icon: "roi",
      },
      {
        label: "Şebekeden Bağımsız Çalışma",
        value: "%48",
        description: "Akıllı yönetimle şebekeden bağımsız karşılanan tüketim oranı",
        icon: "independence",
      },
      {
        label: "İlk Kurulum Bütçesi",
        value: "Düşük-Orta",
        description: "On-grid sisteme göre biraz daha yüksek başlangıç seviyesi",
        icon: "investment",
      },
    ],
    image: "/sistemlerimiz.jpg",
    imageAlt: "Hibrit bataryasız sistem görseli",
  },
  {
    id: "off-grid",
    navLabel: "Tam Bağımsız Mimari",
    title: "Off-Grid",
    summary:
      "Şebekeye erişimi olmayan alanlar için tam bağımsız kurulumdur. Üretim ve depolama tamamen saha içinde yönetilir.",
    bullets: [
      "Şebeke bağlantısı zorunlu değildir; sistem kendi batarya altyapısı ile çalışır.",
      "Fazla üretim bataryada depolanır, enerji şebekeye satılmaz.",
      "Üretim olmadığı anlarda önce batarya, gerekirse jeneratör desteği devreye alınır.",
      "Uzak saha, tarım arazisi ve şebekesiz tesislerde en doğru tercihtir.",
    ],
    kpis: [
      {
        label: "Yatırımın Geri Ödeme Süresi",
        value: "5.6 - 7.9 yıl",
        description: "Tam bağımsız mimari için beklenen geri ödeme aralığı",
        icon: "roi",
      },
      {
        label: "Şebekeden Bağımsız Çalışma",
        value: "%100",
        description: "Enerjinin tamamı saha içinde üretim ve depolama ile karşılanır",
        icon: "independence",
      },
      {
        label: "İlk Kurulum Bütçesi",
        value: "Yüksek",
        description: "Depolama ve yedek kaynak ihtiyacı nedeniyle yüksek seviye",
        icon: "investment",
      },
    ],
    image: "/sistemlerimiz.jpg",
    imageAlt: "Off-grid sistem görseli",
  },
];

export const PROCESS_STEPS: ReadonlyArray<ProcessStep> = [
  {
    step: "01",
    title: "Ön Keşif ve Tüketim Analizi",
    detail: "Elektrik faturaları, saha ölçümleri ve çatı/arsa uygunluğu birlikte değerlendirilir.",
    icon: "discovery",
    duration: "1-2 HAFTA",
  },
  {
    step: "02",
    title: "Mühendislik Tasarımı",
    detail: "Panel, inverter, kablolama ve koruma ekipmanları için teknik proje hazırlanır.",
    icon: "project",
    duration: "2 HAFTA",
  },
  {
    step: "03",
    title: "İzin ve Resmi Başvurular",
    detail: "Dağıtım şirketi, belediye ve ilgili kurum süreçleri planlı biçimde tamamlanır.",
    icon: "permits",
    duration: "2-4 HAFTA",
  },
  {
    step: "04",
    title: "Kurulum ve Saha Testleri",
    detail: "Mekanik montaj, elektriksel bağlantı ve güvenlik testleri kontrol listesiyle yürütülür.",
    icon: "install",
    duration: "2 HAFTA",
  },
  {
    step: "05",
    title: "Devreye Alma ve İzleme",
    detail: "Sistem canlı alınır, uzaktan izleme paneli ve bakım takvimi müşteriye teslim edilir.",
    icon: "monitor",
    duration: "1 HAFTA",
  },
];

export const VERSUS_COLUMNS: ReadonlyArray<VersusColumn> = [
  { key: "grid", label: "On-Grid", icon: "grid", detail: "Şebeke bağlı, hızlı geri ödeme" },
  { key: "hybridNoBattery", label: "Hibrit", icon: "hybrid", detail: "Batarya eklenebilir altyapı" },
  { key: "offGrid", label: "Off-Grid", icon: "offgrid", detail: "Tam bağımsız mimari" },
];

/** Mobile compare cell emphasis by row id + column (not tied to translated labels). */
export const VERSUS_MOBILE_HIGHLIGHTS: Readonly<
  Partial<Record<VersusRowId, Partial<Record<SystemColumnKey, "active" | "active-blue" | "active-orange">>>>
> = {
  "grid-connection-mode": {
    grid: "active",
    hybridNoBattery: "active-blue",
    hybridWithBattery: "active-orange",
  },
  "initial-budget": { grid: "active" },
  "outage-performance": { hybridWithBattery: "active-orange", offGrid: "active" },
  "grid-independence-ratio": { hybridWithBattery: "active-orange", offGrid: "active" },
  "payback-period": { grid: "active" },
};

export const VERSUS_ROWS: ReadonlyArray<VersusRow> = [
  {
    id: "grid-connection-mode",
    criterion: "Şebeke ile Çalışma Şekli",
    criterionMeta: "Sistemin şebekeye bağlı mı bağımsız mı çalıştığını anlatır",
    criterionIcon: "dependency",
    grid: "Tam bağlı",
    hybridNoBattery: "Bağlı + akıllı yönetim",
    hybridWithBattery: "Bağlı + batarya destekli",
    offGrid: "Şebekesiz tam bağımsız",
  },
  {
    id: "initial-budget",
    criterion: "İlk Kurulum Bütçesi",
    criterionMeta: "Sistemin kurulumu için gereken başlangıç maliyet seviyesi",
    criterionIcon: "investment",
    grid: "Düşük",
    hybridNoBattery: "Düşük-Orta",
    hybridWithBattery: "Orta-Yüksek",
    offGrid: "Yüksek",
  },
  {
    id: "outage-performance",
    criterion: "Kesinti Anında Çalışma",
    criterionMeta: "Elektrik kesildiğinde sistemin enerji sağlamaya devam etme seviyesi",
    criterionIcon: "resilience",
    grid: "Sınırlı",
    hybridNoBattery: "Sınırlı",
    hybridWithBattery: "Yüksek",
    offGrid: "Çok yüksek",
  },
  {
    id: "grid-independence-ratio",
    criterion: "Şebekeden Bağımsızlık Oranı",
    criterionMeta: "Tüketimin ne kadarının şebekeye ihtiyaç duymadan karşılandığını gösterir",
    criterionIcon: "independence",
    grid: "%35",
    hybridNoBattery: "%48",
    hybridWithBattery: "%74",
    offGrid: "%100",
  },
  {
    id: "payback-period",
    criterion: "Yatırımın Geri Ödeme Süresi",
    criterionMeta: "Elektrik tasarrufu ile kurulum maliyetinin geri kazanım aralığı",
    criterionIcon: "roi",
    grid: "3.2 - 4.6 yıl",
    hybridNoBattery: "3.8 - 5.2 yıl",
    hybridWithBattery: "4.7 - 6.3 yıl",
    offGrid: "5.6 - 7.9 yıl",
  },
  {
    id: "permits-timeline",
    criterion: "İzin ve Başvuru Süreci",
    criterionMeta: "Kurulum öncesi resmi süreç ve onay hazırlık süresi",
    criterionIcon: "permits",
    grid: "Ortalama 3-4 ay",
    hybridNoBattery: "Ortalama 3-4 ay",
    hybridWithBattery: "Ortalama 3-4 ay",
    offGrid: "Şebeke bağlantı izni gerekmez",
  },
  {
    id: "best-use-case",
    criterion: "En Uygun Kullanım Alanı",
    criterionMeta: "Sistemin en verimli sonuç verdiği proje tipi",
    criterionIcon: "usecase",
    grid: "Konut / KOBİ",
    hybridNoBattery: "Büyüme planlı işletmeler",
    hybridWithBattery: "Kesinti kritik tesisler",
    offGrid: "Uzak saha / şebekesiz alan",
  },
];

export const VERSUS_CELL_DETAILS: Record<string, Record<SystemColumnKey, string>> = {
  "Şebeke ile Çalışma Şekli": {
    grid: "Dağıtım şebekesi ana kaynakla beraber çalışır.",
    hybridNoBattery: "Şebeke bağlıdır, hibrit inverter tüketimi önceliklendirir.",
    hybridWithBattery: "Şebeke bağlıdır, batarya kritik anları dengeler.",
    offGrid: "Şebeke gerektirmez, sistem kendi içinde kapanır.",
  },
  "İlk Kurulum Bütçesi": {
    grid: "Ekipman seti sade olduğu için başlangıç maliyeti düşüktür.",
    hybridNoBattery: "Enerji yönetimi eklenir, maliyet kontrollü artar.",
    hybridWithBattery: "Depolama ile birlikte yatırım seviyesi yükselir.",
    offGrid: "Tam bağımsız altyapı nedeniyle en yüksek kurulum bedeli.",
  },
  "Kesinti Anında Çalışma": {
    grid: "Şebeke kesintisinde standart on-grid üretim durur.",
    hybridNoBattery: "Batarya yoksa kesinti koruması sınırlı kalır.",
    hybridWithBattery: "Batarya desteği ile kritik yük sürekliliği korunur.",
    offGrid: "Kesintiden etkilenmez, sistem kendi beslemesini sürdürür.",
  },
  "Şebekeden Bağımsızlık Oranı": {
    grid: "Gündüz üretim desteği ile kısmi bağımsızlık.",
    hybridNoBattery: "Yönetimli tüketim ile bağımsızlık oranı artar.",
    hybridWithBattery: "Depolama ile akşam/pik saatlerde bağımsızlık yükselir.",
    offGrid: "Enerji tamamen saha içinde üretilir ve depolanır.",
  },
  "Yatırımın Geri Ödeme Süresi": {
    grid: "Düşük maliyetli kurulum, hızlı geri ödeme sağlar.",
    hybridNoBattery: "Esneklik avantajı ile geri ödeme dengeli seviyede kalır.",
    hybridWithBattery: "Süreklilik faydası nedeniyle amorti süresi uzar.",
    offGrid: "Tam bağımsız altyapı nedeniyle geri ödeme daha uzun olabilir.",
  },
  "İzin ve Başvuru Süreci": {
    grid: "Şebeke bağlantılı projelerde resmi izin adımları gerekir.",
    hybridNoBattery: "On-grid süreci ile aynı resmi başvurular tamamlanır.",
    hybridWithBattery: "Depolama ekipmanı eklenmiş hibrit proje süreci yürütülür.",
    offGrid: "Şebekeye bağlı olmayan projelerde bağlantı başvurusu aranmaz.",
  },
  "En Uygun Kullanım Alanı": {
    grid: "Maliyet odaklı konut/KOBİ projeleri.",
    hybridNoBattery: "Genişlemeye açık ticari ve kurumsal yapılar.",
    hybridWithBattery: "Kesinti toleransı düşük işletme ve tesisler.",
    offGrid: "Şebekeden uzak veya bağımsız çalışması gereken alanlar.",
  },
};
