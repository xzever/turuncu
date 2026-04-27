#!/usr/bin/env node
/**
 * Header / AppChrome kilidi: mobil & tablet yenileme flaşını önleyen SSR uyumu.
 * Kırılırsa `npm run verify:header-lock` (veya build öncesi) hata verir.
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function mustRead(rel) {
  return readFileSync(join(root, rel), "utf8");
}

let failed = false;
function fail(msg) {
  console.error(`[header-chrome-lock] ${msg}`);
  failed = true;
}

const hook = mustRead("src/hooks/useWideNavLayout.ts");
if (!hook.includes("ssrWideNav")) {
  fail("useWideNavLayout.ts must accept `ssrWideNav` and pass it to useSyncExternalStore getServerSnapshot.");
}
if (!hook.includes("() => ssrWideNav")) {
  fail("useWideNavLayout must use () => ssrWideNav as the server snapshot for useSyncExternalStore.");
}

const chrome = mustRead("src/components/layout/AppChrome.tsx");
if (!chrome.includes("ssrWideNav") || !chrome.includes("useWideNavLayout(ssrWideNav)")) {
  fail("AppChrome must pass `ssrWideNav` from layout into useWideNavLayout(ssrWideNav).");
}

const layout = mustRead("app/layout.tsx");
if (!layout.includes("ssrWideNav") || !layout.includes('device === "desktop"')) {
  fail("app/layout.tsx must define ssrWideNav from UA (e.g. device === \"desktop\") and pass to AppChrome.");
}

if (failed) {
  process.exit(1);
}
console.log("[header-chrome-lock] OK");
