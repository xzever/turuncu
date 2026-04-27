"use client";

/**
 * HomeMobile — MDS 8.6 Ana sayfa (Faz 09).
 * Native-app landing: hero + 2x2 quick links + sektör scroll + öne çıkan referanslar
 * + değerler + CTA banner.
 */

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Zap,
  Building2,
  GitCompare,
  MessageCircle,
  ShieldCheck,
  Lightbulb,
  Leaf,
  Users,
  BookOpen,
  ChevronRight,
} from "lucide-react";
import {
  Card,
  ListItem,
  SectionHeader,
} from "@/components/ui/mobile";
import {
  REFERENCE_PROJECTS,
  type ReferenceSector,
} from "../../../app/referanslar/data";

type QuickLink = {
  id: string;
  href: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
};

const QUICK_LINKS: ReadonlyArray<QuickLink> = [
  {
    id: "systems",
    href: "/sistemlerimiz",
    icon: <Zap width={24} height={24} aria-hidden="true" />,
    title: "Sistemlerimiz",
    subtitle: "On-grid, hibrit, off-grid",
  },
  {
    id: "references",
    href: "/referanslar",
    icon: <Building2 width={24} height={24} aria-hidden="true" />,
    title: "Referanslar",
    subtitle: "Tamamlanan projeler",
  },
  {
    id: "compare",
    href: "/sistem-farklari",
    icon: <GitCompare width={24} height={24} aria-hidden="true" />,
    title: "Sistem Farkları",
    subtitle: "Karşılaştır",
  },
  {
    id: "contact",
    href: "/iletisim",
    icon: <MessageCircle width={24} height={24} aria-hidden="true" />,
    title: "İletişim",
    subtitle: "Uzman görüş",
  },
];

type SectorCard = {
  sector: ReferenceSector;
  title: string;
  description: string;
  image: string;
};

const SECTORS: ReadonlyArray<SectorCard> = [
  {
    sector: "Sanayi",
    title: "Sanayi Çözümleri",
    description: "Üretim tesisleri için çatı ve arazi GES.",
    image: "/sistemlerimiz.jpg",
  },
  {
    sector: "Lojistik",
    title: "Lojistik Merkezleri",
    description: "Geniş çatı alanları için maksimum verim.",
    image: "/sistemlerimiz.jpg",
  },
  {
    sector: "Tarım",
    title: "Tarımsal GES",
    description: "Sera, sulama ve tesis için özel tasarım.",
    image: "/sistemlerimiz.jpg",
  },
  {
    sector: "Turizm",
    title: "Otel & Turizm",
    description: "Yüksek sezon tüketim profiline uygun.",
    image: "/sistemlerimiz.jpg",
  },
];

type ValueCard = {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
};

const VALUES: ReadonlyArray<ValueCard> = [
  {
    id: "reliable",
    icon: <ShieldCheck width={24} height={24} aria-hidden="true" />,
    title: "Güvenilir",
    description: "Tier-1 ekipman, 25 yıl performans garantisi.",
  },
  {
    id: "engineering",
    icon: <Lightbulb width={24} height={24} aria-hidden="true" />,
    title: "Mühendislik",
    description: "Projeye özel tasarım, saha etüdü, enerji modelleme.",
  },
  {
    id: "transparent",
    icon: <Users width={24} height={24} aria-hidden="true" />,
    title: "Şeffaf",
    description: "Her aşamada takip, saklı maliyet yok.",
  },
  {
    id: "sustainable",
    icon: <Leaf width={24} height={24} aria-hidden="true" />,
    title: "Sürdürülebilir",
    description: "ESG uyumlu, karbon raporlu, geri dönüşüm planlı.",
  },
];


export default function HomeMobile() {
  const featuredReferences = REFERENCE_PROJECTS.slice(0, 3);

  return (
    <>

      <main className="home-mobile">
        <section className="home-mobile__hero">
          <div className="home-mobile__hero-bg" aria-hidden="true">
            <Image
              src="/sistemlerimiz.webp"
              alt=""
              fill
              priority
              sizes="100vw"
            />
          </div>
          <div className="home-mobile__hero-content">
            <span className="home-mobile__hero-overline">Turuncu Solar</span>
            <h1 className="home-mobile__hero-title">
              Güneşten Geleceğe, Bugün Başla
            </h1>
            <p className="home-mobile__hero-lead">
              Sanayi, tarım, lojistik ve ticari alanlar için anahtar teslim GES çözümleri.
            </p>
            <div className="home-mobile__hero-cta">
              <Link href="/iletisim" className="home-mobile__hero-btn home-mobile__hero-btn--primary">
                Ücretsiz Teklif Al
                <ArrowRight width={18} height={18} aria-hidden="true" />
              </Link>
              <Link href="/sistemlerimiz" className="home-mobile__hero-btn home-mobile__hero-btn--ghost">
                Sistemleri Gör
              </Link>
            </div>
          </div>
        </section>

        <section className="home-mobile__quick" aria-label="Hızlı bağlantılar">
          {QUICK_LINKS.map((q) => (
            <Card
              key={q.id}
              variant="interactive"
              href={q.href}
              padding="md"
              className="home-mobile__quick-card"
            >
              <div className="home-mobile__quick-icon" aria-hidden="true">
                {q.icon}
              </div>
              <h3 className="home-mobile__quick-title">{q.title}</h3>
              <span className="home-mobile__quick-subtitle">{q.subtitle}</span>
            </Card>
          ))}
        </section>

        <SectionHeader
          overline="Çözümler"
          title="Sektöre Özel GES"
          subtitle="Her sektörün kendine özgü enerji profili var."
        />
        <div
          className="home-mobile__sector-scroll"
          role="list"
          aria-label="Sektör çözümleri"
        >
          {SECTORS.map((s) => (
            <Card
              key={s.sector}
              variant="interactive"
              href={`/referanslar#${s.sector.toLocaleLowerCase("tr")}`}
              className="home-mobile__sector-card"
            >
              <div className="home-mobile__sector-image">
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  loading="lazy"
                  sizes="280px"
                />
              </div>
              <div className="home-mobile__sector-body">
                <span className="home-mobile__sector-tag">{s.sector}</span>
                <h3 className="home-mobile__sector-title">{s.title}</h3>
                <p className="home-mobile__sector-desc">{s.description}</p>
              </div>
            </Card>
          ))}
        </div>

        <SectionHeader
          overline="Portföy"
          title="Son Projeler"
          subtitle={`${REFERENCE_PROJECTS.length} tamamlanan projenin son 3'ü.`}
        />
        <div className="home-mobile__references">
          {featuredReferences.map((p) => (
            <Card
              key={p.id}
              variant="interactive"
              href={`/referanslar#${p.id}`}
              className="home-mobile__ref-card"
            >
              <div className="home-mobile__ref-image">
                <Image
                  src={p.image}
                  alt={p.imageAlt}
                  fill
                  loading="lazy"
                  sizes="(max-width: 767px) 100vw, 33vw"
                />
              </div>
              <div className="home-mobile__ref-body">
                <span className="home-mobile__ref-tag">
                  {p.sector} · {p.systemType}
                </span>
                <h3 className="home-mobile__ref-title">{p.title}</h3>
                <span className="home-mobile__ref-meta">
                  {p.city} · {p.installedPowerKw.toLocaleString("tr-TR")} kWp
                </span>
              </div>
            </Card>
          ))}
        </div>
        <div className="home-mobile__see-all">
          <Link href="/referanslar" className="home-mobile__see-all-link">
            Tüm Referanslar
            <ArrowRight width={16} height={16} aria-hidden="true" />
          </Link>
        </div>

        <SectionHeader
          overline="Neden Biz?"
          title="Güvenilir, Garantili, Akıllı"
        />
        <div className="home-mobile__values">
          {VALUES.map((v) => (
            <Card
              key={v.id}
              variant="flat"
              padding="md"
              className="home-mobile__value-card"
            >
              <div className="home-mobile__value-icon" aria-hidden="true">
                {v.icon}
              </div>
              <h3 className="home-mobile__value-title">{v.title}</h3>
              <p className="home-mobile__value-desc">{v.description}</p>
            </Card>
          ))}
        </div>

        <section
          className="home-mobile__cta-banner"
          aria-label="Ücretsiz keşif çağrısı"
        >
          <h2 className="home-mobile__cta-title">Projeniz için ücretsiz keşif</h2>
          <p className="home-mobile__cta-text">
            Uzman ekibimiz çatınızı veya alanınızı değerlendirir, size özel teklif sunar.
          </p>
          <Link href="/iletisim" className="home-mobile__cta-btn">
            Keşif Talebi Oluştur
            <ArrowRight width={18} height={18} aria-hidden="true" />
          </Link>
        </section>

        <Card
          variant="interactive"
          href="/blog"
          className="home-mobile__blog-card"
        >
          <ListItem
            leading={<BookOpen width={20} height={20} aria-hidden="true" />}
            title="Blog'da Okuma Notları"
            subtitle="Teknik yazılar, vaka analizleri, sektör trendleri."
            trailing={<ChevronRight width={20} height={20} aria-hidden="true" />}
            divider={false}
          />
        </Card>
      </main>
    </>
  );
}
