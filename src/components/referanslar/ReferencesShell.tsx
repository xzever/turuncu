"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ArrowRight, MapPin, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  REFERENCE_PROJECTS,
  type ReferenceProject,
  type ReferenceSector,
} from "@/app/referanslar/data";

function resolveImageUrl(url: string): string {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return url.startsWith("/") ? url : `/${url}`;
}

const numberFormatter = new Intl.NumberFormat("tr-TR");

const FILTERS = ["Tümü", "Konut", "Ticari", "Tarım", "Sanayi", "Lojistik", "On-Grid", "Hibrit"] as const;

type Filter = (typeof FILTERS)[number];

type Props = {
  projects?: ReadonlyArray<ReferenceProject>;
};

function matchesFilter(project: ReferenceProject, filter: Filter): boolean {
  if (filter === "Tümü") return true;
  if (filter === "Konut") return project.tags.some((tag) => tag.toLocaleLowerCase("tr-TR").includes("konut"));
  if (filter === "On-Grid" || filter === "Hibrit") return project.systemType.includes(filter);
  return project.sector === filter;
}

function StatGrid({ project }: { project: ReferenceProject }) {
  return (
    <dl className="refs-case__stats">
      <div><dt>Güç</dt><dd>{numberFormatter.format(project.installedPowerKw)} kWp</dd></div>
      <div><dt>Üretim</dt><dd>{numberFormatter.format(project.annualProductionMWh)} MWh</dd></div>
      <div><dt>CO₂</dt><dd>{numberFormatter.format(project.co2ReductionTon)} t</dd></div>
      <div><dt>PR</dt><dd>{project.performanceRatio.toFixed(1)}%</dd></div>
    </dl>
  );
}

export default function ReferencesShell({ projects }: Props = {}) {
  const source = projects ?? REFERENCE_PROJECTS;
  const [activeFilter, setActiveFilter] = useState<Filter>("Tümü");
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLocaleLowerCase("tr-TR");
  const filtered = useMemo(() => {
    return source.filter((project) => {
      if (!matchesFilter(project, activeFilter)) return false;
      if (!normalizedQuery) return true;
      return `${project.title} ${project.city} ${project.sector} ${project.systemType} ${project.tags.join(" ")}`.toLocaleLowerCase("tr-TR").includes(normalizedQuery);
    });
  }, [activeFilter, normalizedQuery, source]);
  const featured = filtered.slice(0, 2);
  const list = filtered.slice(2);

  return (
    <main className="refs-cases-page">
      <header className="refs-cases__hero">
        <div>
          <Badge variant="secondary">Referanslar · 500+ proje</Badge>
          <h1>Anahtar projeler.</h1>
          <p>Öne çıkan kurulumlar, sektör filtreleri ve detaylı proje kartları tek app-frame içinde.</p>
        </div>
        <div className="refs-cases__search" role="search">
          <Search aria-hidden="true" />
          <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Proje ara..." aria-label="Referanslarda ara" />
        </div>
      </header>

      <section className="refs-cases__body" aria-label="Referans projeleri">
        <section className="refs-featured" aria-labelledby="refs-featured-title">
          <header className="refs-section-head">
            <div>
              <h2 id="refs-featured-title">Öne çıkan vakalar</h2>
              <Badge variant="outline">{featured.length}</Badge>
            </div>
          </header>
          <div className="refs-featured__grid">
            {featured.map((project) => (
              <Card key={project.id} className="refs-case refs-case--featured">
                <div className="refs-case__image">
                  <Image src={resolveImageUrl(project.image)} alt={project.imageAlt} fill sizes="(max-width: 767px) 92vw, 45vw" />
                </div>
                <CardContent>
                  <div className="refs-case__meta">
                    <Badge>{project.sector}</Badge>
                    <Badge variant="secondary">{project.systemType}</Badge>
                    <span><MapPin aria-hidden="true" /> {project.city}</span>
                  </div>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <StatGrid project={project} />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="refs-all" aria-labelledby="refs-all-title">
          <header className="refs-section-head">
            <div>
              <h2 id="refs-all-title">Tüm projeler</h2>
              <Badge variant="outline">512</Badge>
            </div>
            <Tabs value={activeFilter} onValueChange={(value) => setActiveFilter(value as Filter)} className="refs-filters">
              <TabsList>
                {FILTERS.map((filter) => (
                  <TabsTrigger key={filter} value={filter}>{filter}</TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </header>

          <div className="refs-list">
            {list.map((project) => (
              <Card key={project.id} className="refs-list-card">
                <div className="refs-list-card__image">
                  <Image src={resolveImageUrl(project.image)} alt={project.imageAlt} fill sizes="(max-width: 767px) 80px, 120px" />
                </div>
                <CardContent>
                  <div className="refs-case__meta">
                    <Badge variant="secondary">{project.sector}</Badge>
                    <Badge variant="outline">{project.systemType}</Badge>
                  </div>
                  <h3>{project.title}</h3>
                  <p>{project.city}, {project.country} · {project.commissioningDate}</p>
                  <div className="refs-list-card__tags">
                    {project.tags.slice(0, 3).map((tag) => <Badge key={tag} variant="outline">{tag}</Badge>)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </section>

      <nav className="refs-cases__pagination" aria-label="Referans sayfalama">
        {[1, 2, 3].map((item) => <Button key={item} variant={item === 1 ? "default" : "outline"}>{item}</Button>)}
        <Button variant="secondary">Daha fazla yükle <ArrowRight aria-hidden="true" /></Button>
      </nav>
    </main>
  );
}

export type { ReferenceSector };
