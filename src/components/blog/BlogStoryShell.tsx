"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Search, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { BlogPost } from "@/lib/blogTypes";

function resolveImageUrl(url: string): string {
  if (!url) return "/blog-back.webp";
  if (url.startsWith("http")) return url;
  return url.startsWith("/") ? url : `/${url}`;
}

const TR_MONTHS = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
];

function formatDateTr(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${TR_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function estimateReadMinutes(content: string): number {
  const words = content.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function categoryLabel(post: BlogPost): string {
  const raw = post.categories?.[0]?.name ?? post.categoryId ?? "Teknik";
  const normalized = raw.toLocaleLowerCase("tr-TR");
  if (normalized.includes("rehber")) return "Rehberler";
  if (normalized.includes("teknik")) return "Teknik";
  if (normalized.includes("vaka") || normalized.includes("sanayi") || normalized.includes("tar")) return "Vaka analizleri";
  return "Rehberler";
}

type Props = {
  posts: ReadonlyArray<BlogPost>;
  basePath?: string;
};

const RAILS = [
  { title: "Vaka analizleri", count: 14 },
  { title: "Rehberler", count: 9 },
  { title: "Teknik", count: 8 },
] as const;

export default function BlogStoryShell({ posts, basePath = "/blog" }: Props) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLocaleLowerCase("tr-TR");
  const filteredPosts = useMemo(() => {
    if (!normalizedQuery) return posts;
    return posts.filter((post) => `${post.title} ${post.seoDescription} ${post.keywords.join(" ")}`.toLocaleLowerCase("tr-TR").includes(normalizedQuery));
  }, [normalizedQuery, posts]);

  const postsByRail = useMemo(() => {
    const map = new Map<string, BlogPost[]>();
    RAILS.forEach((rail) => map.set(rail.title, []));
    filteredPosts.forEach((post, index) => {
      const label = categoryLabel(post);
      const fallback = RAILS[index % RAILS.length].title;
      map.get(map.has(label) ? label : fallback)?.push(post);
    });
    RAILS.forEach((rail) => {
      const list = map.get(rail.title) ?? [];
      if (list.length === 0) map.set(rail.title, filteredPosts.slice(0, 6));
    });
    return map;
  }, [filteredPosts]);

  return (
    <main className="blog-rails-page bs-list-shell" id="blog-top">
      <header className="blog-rails__hero">
        <div>
          <Badge variant="secondary">Blog</Badge>
          <h1>Keşfet.</h1>
          <p>Vaka analizleri, rehberler ve teknik notlar tek ekranda ray ray ilerler.</p>
        </div>
        <div className="blog-rails__search" role="search">
          <Search aria-hidden="true" />
          <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Yazı ara..." aria-label="Blog içinde ara" />
        </div>
      </header>

      <section className="blog-rails__body" aria-label="Blog kategorileri">
        {RAILS.map((rail) => {
          const railPosts = postsByRail.get(rail.title) ?? [];
          return (
            <section key={rail.title} className="blog-rail" aria-labelledby={`rail-${rail.title}`}>
              <header className="blog-rail__head">
                <div>
                  <h2 id={`rail-${rail.title}`}>{rail.title}</h2>
                  <Badge variant="outline">{rail.count}</Badge>
                </div>
                <Link href={basePath}>
                  Tümü <ArrowRight aria-hidden="true" />
                </Link>
              </header>

              <div className="blog-rail__track">
                {railPosts.slice(0, 8).map((post, index) => {
                  const href = `${basePath}/${post.slug}`;
                  const image = resolveImageUrl(post.featuredImage ?? "/blog-back.webp");
                  const readMinutes = estimateReadMinutes(post.content ?? "");
                  const date = formatDateTr(post.publishedAt);
                  const tags = (post.keywords ?? []).slice(0, 3);
                  return (
                    <Card key={`${rail.title}-${post.id}-${index}`} className="blog-rail-card">
                      <Link href={href} className="blog-rail-card__link">
                        <div className="blog-rail-card__image">
                          <Image src={image} alt={post.title} fill sizes="(max-width: 767px) 82vw, 280px" />
                        </div>
                        <CardContent>
                          <div className="blog-rail-card__meta">
                            <span><Zap aria-hidden="true" /> {index % 2 === 0 ? "250 kW" : "110 kW"}</span>
                            <Badge variant="secondary">{rail.title.replace("leri", "")}</Badge>
                          </div>
                          <h3>{post.title}</h3>
                          <div className="blog-rail-card__tags">
                            {tags.map((tag) => <Badge key={tag} variant="outline">{tag}</Badge>)}
                          </div>
                          <div className="blog-rail-card__author">
                            <span className="blog-rail-card__avatar">TS</span>
                            <span>Turuncu Solar</span>
                            <CalendarDays aria-hidden="true" />
                            <span>{date}</span>
                            <span>{readMinutes} dk</span>
                          </div>
                        </CardContent>
                      </Link>
                    </Card>
                  );
                })}
              </div>
            </section>
          );
        })}
      </section>

      <nav className="blog-rails__pagination" aria-label="Blog sayfalama">
        {[1, 2, 3, 4].map((item) => <Button key={item} variant={item === 1 ? "default" : "outline"}>{item}</Button>)}
        <span>...</span>
        <Button variant="outline">8</Button>
        <Button variant="secondary">Daha fazla yükle</Button>
      </nav>
    </main>
  );
}
