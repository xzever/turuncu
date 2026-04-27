import type { NextConfig } from "next";

const configuredImageHosts = process.env.NEXT_IMAGE_REMOTE_HOSTS?.split(",").map((h) => h.trim()).filter(Boolean) ?? [];

type RemotePattern = {
  protocol: "http" | "https";
  hostname: string;
  port: string;
  pathname: string;
};

function toRemotePattern(origin: string): RemotePattern | null {
  try {
    const url = new URL(origin);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return {
      protocol: url.protocol.replace(":", "") as "http" | "https",
      hostname: url.hostname,
      port: url.port,
      pathname: "/**",
    };
  } catch {
    return null;
  }
}

const defaultImageOrigins = ["http://localhost:3000", "http://127.0.0.1:3000", "http://0.0.0.0:3000"];
const imageOrigins = [...defaultImageOrigins, ...configuredImageHosts];
const remotePatternMap = new Map<string, RemotePattern>();
for (const origin of imageOrigins) {
  const pattern = toRemotePattern(origin);
  if (!pattern) continue;
  const key = `${pattern.protocol}|${pattern.hostname}|${pattern.port}`;
  if (!remotePatternMap.has(key)) remotePatternMap.set(key, pattern);
}
const remotePatterns = Array.from(remotePatternMap.values());

/**
 * Security headers — enterprise baseline (CSP, HSTS, clickjack, MIME sniff, referrer).
 * Prod'da HSTS, dev'de gevşek CSP (Turbopack inline script için).
 *
 * CSP notu:
 *   - `'unsafe-inline'` style için Tailwind runtime + Next.js inline style gerektiriyor.
 *   - Google Maps iframe için google.com + gstatic.com.
 *   - Google Fonts için googleapis.com + gstatic.com.
 *   - Script için `'self'` + Next.js inline hydration script için `'unsafe-inline'` (strict-dynamic ileride).
 */
const isProd = process.env.NODE_ENV === "production";

const cspDirectives: Record<string, string[]> = {
  "default-src": ["'self'"],
  "script-src": [
    "'self'",
    "'unsafe-inline'",
    ...(isProd ? [] : ["'unsafe-eval'"]),
  ],
  "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
  "img-src": [
    "'self'",
    "data:",
    "blob:",
    "https:",
  ],
  "font-src": ["'self'", "data:", "https://fonts.gstatic.com"],
  "connect-src": [
    "'self'",
    ...(isProd ? [] : ["ws:", "wss:"]),
  ],
  "frame-src": [
    "'self'",
    "https://www.google.com",
    "https://maps.google.com",
  ],
  "object-src": ["'none'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'", "mailto:"],
  "frame-ancestors": ["'none'"],
  "upgrade-insecure-requests": [],
};

const cspHeader = Object.entries(cspDirectives)
  .map(([key, values]) => (values.length ? `${key} ${values.join(" ")}` : key))
  .join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: cspHeader },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  ...(isProd
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ]
    : []),
];

const nextConfig: NextConfig = {
  allowedDevOrigins: ["http://localhost:3000", "http://127.0.0.1:3000", "http://0.0.0.0:3000"],
  images: {
    remotePatterns,
    dangerouslyAllowSVG: true,
    unoptimized: process.env.NODE_ENV === "development",
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
