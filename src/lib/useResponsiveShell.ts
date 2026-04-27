"use client";

import { useEffect, useState } from "react";
import { useDevice } from "@/components/layout/DeviceProvider";
import { SHELL_HANDHELD_MAX_WIDTH_PX, SHELL_HANDHELD_QUERY } from "@/lib/breakpoints";

/** `MobileTopbar` / `BottomNav` ile uyumlu: telefon + tablet shell query. */
export const SHELL_MOBILE_MAX_WIDTH = SHELL_HANDHELD_MAX_WIDTH_PX;

export function useResponsiveShell(
  ssrIsMobileOrTablet: boolean = false,
  breakpoint: number = SHELL_MOBILE_MAX_WIDTH,
): boolean {
  const device = useDevice();
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(ssrIsMobileOrTablet);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    if (device !== "desktop") {
      setIsMobileOrTablet(true);
      return undefined;
    }

    const mediaQuery = window.matchMedia(
      breakpoint === SHELL_HANDHELD_MAX_WIDTH_PX
        ? SHELL_HANDHELD_QUERY
        : `(max-width: ${breakpoint}px)`,
    );
    const updateViewport = () => setIsMobileOrTablet(mediaQuery.matches);

    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);
    window.addEventListener("orientationchange", updateViewport);
    window.addEventListener("resize", updateViewport);

    return () => {
      mediaQuery.removeEventListener("change", updateViewport);
      window.removeEventListener("orientationchange", updateViewport);
      window.removeEventListener("resize", updateViewport);
    };
  }, [breakpoint, device]);

  return isMounted ? isMobileOrTablet : ssrIsMobileOrTablet;
}
