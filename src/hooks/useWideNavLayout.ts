"use client";

import { useSyncExternalStore } from "react";
import {
  SHELL_DESKTOP_MIN_WIDTH_PX,
  SHELL_HANDHELD_MAX_WIDTH_PX,
  SHELL_LARGE_TABLET_VIEWPORT_QUERY,
  SHELL_TOUCH_TABLET_QUERY,
} from "@/lib/breakpoints";

/**
 * Proje masaüstü eşiği: ≥1280px ve touch-tablet değilse SiteHeader.
 * Telefon + tablet ailesi → MobileTopbar (logo, dil, hamburger) + BottomNav.
 */
const DESKTOP_QUERY = `(min-width: ${SHELL_DESKTOP_MIN_WIDTH_PX}px)`;
const HANDHELD_QUERY = `(max-width: ${SHELL_HANDHELD_MAX_WIDTH_PX}px)`;

function isWideNav(): boolean {
  const desktopWidth = window.matchMedia(DESKTOP_QUERY).matches;
  const handheldWidth = window.matchMedia(HANDHELD_QUERY).matches;
  const touchTablet = window.matchMedia(SHELL_TOUCH_TABLET_QUERY).matches;
  const largeTabletViewport = window.matchMedia(SHELL_LARGE_TABLET_VIEWPORT_QUERY).matches;
  return desktopWidth && !handheldWidth && !touchTablet && !largeTabletViewport;
}

function subscribe(onStoreChange: () => void) {
  const desktop = window.matchMedia(DESKTOP_QUERY);
  const handheld = window.matchMedia(HANDHELD_QUERY);
  const touchTablet = window.matchMedia(SHELL_TOUCH_TABLET_QUERY);
  const largeTabletViewport = window.matchMedia(SHELL_LARGE_TABLET_VIEWPORT_QUERY);
  desktop.addEventListener("change", onStoreChange);
  handheld.addEventListener("change", onStoreChange);
  touchTablet.addEventListener("change", onStoreChange);
  largeTabletViewport.addEventListener("change", onStoreChange);
  window.addEventListener("resize", onStoreChange);
  window.addEventListener("orientationchange", onStoreChange);
  return () => {
    desktop.removeEventListener("change", onStoreChange);
    handheld.removeEventListener("change", onStoreChange);
    touchTablet.removeEventListener("change", onStoreChange);
    largeTabletViewport.removeEventListener("change", onStoreChange);
    window.removeEventListener("resize", onStoreChange);
    window.removeEventListener("orientationchange", onStoreChange);
  };
}

function getSnapshot(): boolean {
  return isWideNav();
}

/**
 * true: masaüstü — SiteHeader
 * false: telefon + tablet — MobileTopbar + BottomNav
 *
 * `ssrWideNav` RootLayout’taki UA ile aynı olmalı (`device === "desktop"`).
 * Sunucuda hep `true` kullanmak, mobilde SSR’da masaüstü header üretir; sayfa
 * yenilenince hidrasyon öncesi/sonrası layout flaşını tetikler.
 */
export function useWideNavLayout(ssrWideNav: boolean): boolean {
  return useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => ssrWideNav,
  );
}
