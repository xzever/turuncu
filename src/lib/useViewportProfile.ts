"use client";

import { useEffect, useState } from "react";
import { useDevice } from "@/components/layout/DeviceProvider";
import {
  SHELL_DESKTOP_MIN_WIDTH_PX,
  SHELL_HANDHELD_MAX_WIDTH_PX,
  SHELL_LARGE_TABLET_VIEWPORT_QUERY,
  SHELL_TOUCH_TABLET_QUERY,
} from "@/lib/breakpoints";

export type ViewportProfile = {
  /** Telefon + tablet ailesi: width ≤1279 veya touch tablet ≤1366 */
  isMobileOrTablet: boolean;
  /** Desktop shell: ≥1280 ve touch tablet değil */
  isDesktop: boolean;
  /** pointer: coarse */
  isTouch: boolean;
  /** orientation: landscape */
  isLandscape: boolean;
  width: number;
  height: number;
};

const SERVER_FALLBACK: ViewportProfile = {
  isMobileOrTablet: false,
  isDesktop: true,
  isTouch: false,
  isLandscape: false,
  width: 0,
  height: 0,
};

function readProfile(): ViewportProfile {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const isTouch = window.matchMedia("(pointer: coarse)").matches;
  const isTouchTablet = window.matchMedia(SHELL_TOUCH_TABLET_QUERY).matches;
  const isLargeTabletViewport = window.matchMedia(SHELL_LARGE_TABLET_VIEWPORT_QUERY).matches;
  const isMobileOrTablet = width <= SHELL_HANDHELD_MAX_WIDTH_PX || isTouchTablet || isLargeTabletViewport;
  const isDesktop = width >= SHELL_DESKTOP_MIN_WIDTH_PX && !isTouchTablet && !isLargeTabletViewport;
  const isLandscape = window.matchMedia("(orientation: landscape)").matches;

  return {
    isMobileOrTablet,
    isDesktop,
    isTouch,
    isLandscape,
    width,
    height,
  };
}

/**
 * İstemci viewport + pointer + yön profili. SSR'da sabit fallback;
 * mount sonrası gerçek değerler.
 */
export function useViewportProfile(): ViewportProfile {
  const device = useDevice();
  const [profile, setProfile] = useState<ViewportProfile>(SERVER_FALLBACK);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setProfile(readProfile());

    const shell = window.matchMedia(`(max-width: ${SHELL_HANDHELD_MAX_WIDTH_PX}px)`);
    const coarse = window.matchMedia("(pointer: coarse)");
    const touchTablet = window.matchMedia(SHELL_TOUCH_TABLET_QUERY);
    const largeTabletViewport = window.matchMedia(SHELL_LARGE_TABLET_VIEWPORT_QUERY);
    const landscape = window.matchMedia("(orientation: landscape)");

    const sync = () => {
      const next = readProfile();
      if (device !== "desktop") {
        setProfile({ ...next, isMobileOrTablet: true, isDesktop: false, isTouch: true });
        return;
      }
      setProfile(next);
    };

    shell.addEventListener("change", sync);
    coarse.addEventListener("change", sync);
    touchTablet.addEventListener("change", sync);
    largeTabletViewport.addEventListener("change", sync);
    landscape.addEventListener("change", sync);
    window.addEventListener("resize", sync);
    window.addEventListener("orientationchange", sync);

    return () => {
      shell.removeEventListener("change", sync);
      coarse.removeEventListener("change", sync);
      touchTablet.removeEventListener("change", sync);
      largeTabletViewport.removeEventListener("change", sync);
      landscape.removeEventListener("change", sync);
      window.removeEventListener("resize", sync);
      window.removeEventListener("orientationchange", sync);
    };
  }, [device]);

  return mounted ? profile : SERVER_FALLBACK;
}
