/**
 * HTML sanitization utility
 * Strips dangerous tags/attributes while preserving safe formatting.
 */

const ALLOWED_TAGS = new Set([
  "p", "br", "strong", "em", "b", "i", "u", "a",
  "ul", "ol", "li", "h1", "h2", "h3", "h4", "h5", "h6",
  "blockquote", "code", "pre", "span", "div", "img",
  "table", "thead", "tbody", "tr", "th", "td",
]);

const TAG_REGEX = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g;

export function sanitizeHtml(html: string): string {
  if (!html) return "";
  return html.replace(TAG_REGEX, (match, tagName: string) => {
    return ALLOWED_TAGS.has(tagName.toLowerCase()) ? match : "";
  });
}
