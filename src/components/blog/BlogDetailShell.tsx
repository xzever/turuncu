"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/blogTypes";
import { sanitizeHtml } from "@/lib/sanitize";
import NewsletterCta from "./NewsletterCta";

export type BlogDetailShellProps = {
  posts: BlogPost[];
  locale: string;
  basePath: string;
  activePost: BlogPost;
};

const TR_MONTHS = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];

function resolveImageUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("http")) return url;
  return url.startsWith("/") ? url : `/${url}`;
}

function formatDateTr(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getUTCDate()} ${TR_MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

function readingTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const words = text.split(" ").filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatInlineMarkdown(value: string): string {
  return escapeHtml(value)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/__([^_]+)__/g, "<strong>$1</strong>");
}

function markdownToHtml(value: string): string {
  return value
    .replace(/\r\n?/g, "\n")
    .trim()
    .split(/\n{2,}/)
    .map((block) => {
      const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
      if (lines.length === 0) return "";
      const first = lines[0];

      if (/^#{2,6}\s+/.test(first)) {
        const level = first.match(/^#+/)?.[0].length ?? 2;
        const text = first.replace(/^#{2,6}\s+/, "");
        const tag = level <= 2 ? "h2" : "h3";
        const headingHtml = `<${tag}>${formatInlineMarkdown(text)}</${tag}>`;
        const rest = lines.slice(1);
        if (rest.length === 0) return headingHtml;
        return `${headingHtml}<p>${rest.map((line) => formatInlineMarkdown(line)).join("<br />")}</p>`;
      }

      if (lines.every((line) => /^[-*+]\s+/.test(line))) {
        return `<ul>${lines.map((line) => `<li>${formatInlineMarkdown(line.replace(/^[-*+]\s+/, ""))}</li>`).join("")}</ul>`;
      }

      if (lines.every((line) => /^\d+\.\s+/.test(line))) {
        return `<ol>${lines.map((line) => `<li>${formatInlineMarkdown(line.replace(/^\d+\.\s+/, ""))}</li>`).join("")}</ol>`;
      }

      if (lines.every((line) => /^>\s?/.test(line))) {
        return `<blockquote>${lines.map((line) => formatInlineMarkdown(line.replace(/^>\s?/, ""))).join("<br />")}</blockquote>`;
      }

      return `<p>${lines.map((line) => formatInlineMarkdown(line)).join("<br />")}</p>`;
    })
    .join("");
}

function normalizeArticleHtml(value: string): string {
  const raw = value.trim();
  if (!raw) return "";
  return /<\/?[a-z][\s\S]*>/i.test(raw) ? raw : markdownToHtml(raw);
}

export default function BlogDetailShell({
  posts,
  basePath,
  activePost,
}: BlogDetailShellProps) {
  const sanitizedContent = useMemo(
    () => sanitizeHtml(normalizeArticleHtml(activePost.content)),
    [activePost.content],
  );

  const readMinutes = useMemo(
    () => readingTime(activePost.content),
    [activePost.content],
  );

  const relatedPosts = useMemo(() => {
    const activeCategoryId = activePost.categories?.[0]?.id ?? activePost.categoryId;
    return posts
      .filter((p) => {
        if (p.slug === activePost.slug) return false;
        const pid = p.categories?.[0]?.id ?? p.categoryId;
        return activeCategoryId ? pid === activeCategoryId : true;
      })
      .sort((a, b) => {
        const da = new Date(a.publishedAt ?? a.createdAt).getTime();
        const db = new Date(b.publishedAt ?? b.createdAt).getTime();
        return db - da;
      })
      .slice(0, 3);
  }, [posts, activePost]);

  const heroImg = resolveImageUrl(activePost.featuredImage);
  const categoryName = activePost.categories?.[0]?.name;
  const tags = activePost.keywords ?? [];

  return (
    <>
      <article className="bs-detail-shell">
        {heroImg && (
          <div className="bs-detail-shell__hero">
            <Image
              src={heroImg}
              alt={activePost.title}
              fill
              priority
              sizes="(max-width: 767px) 100vw, (max-width: 1279px) 90vw, 900px"
            />
          </div>
        )}

        <div className="bs-detail-shell__body">
          <div className="bs-detail-shell__meta">
            {categoryName && <span>{categoryName}</span>}
            {activePost.publishedAt && (
              <>
                <span aria-hidden="true">·</span>
                <span>{formatDateTr(activePost.publishedAt)}</span>
              </>
            )}
            <span aria-hidden="true">·</span>
            <span>{readMinutes} dk okuma</span>
          </div>

          <h1 className="bs-detail-shell__title">{activePost.title}</h1>

          {activePost.seoDescription && (
            <p className="bs-detail-shell__lead">{activePost.seoDescription}</p>
          )}

          <div
            className="bs-detail-shell__content"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />

          {tags.length > 0 && (
            <div className="bs-detail-shell__tags" aria-label="Etiketler">
              {tags.slice(0, 8).map((tag, index) => (
                <span className="bs-detail-shell__tag" key={`${tag}-${index}`}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {relatedPosts.length > 0 && (
          <section className="bs-detail-shell__related-section">
            <h2 className="bs-detail-shell__related-heading">İlgili Yazılar</h2>
            <div className="bs-detail-shell__related-grid">
              {relatedPosts.map((p) => (
                <Link
                  key={p.slug}
                  href={`${basePath}/${p.slug}`}
                  className="bs-detail-shell__related-card"
                >
                  {p.featuredImage && (
                    <div className="bs-detail-shell__related-image">
                      <Image
                        src={resolveImageUrl(p.featuredImage) ?? ""}
                        alt={p.title}
                        fill
                        loading="lazy"
                        sizes="(max-width: 767px) 100vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="bs-detail-shell__related-body">
                    <h3 className="bs-detail-shell__related-title">{p.title}</h3>
                    {p.publishedAt && (
                      <span className="bs-detail-shell__related-date">
                        {formatDateTr(p.publishedAt)}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <NewsletterCta />
      </article>

      <noscript>
        <Link href={basePath}>Tüm yazılar</Link>
      </noscript>
    </>
  );
}
