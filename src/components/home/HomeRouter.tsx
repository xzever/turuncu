"use client";

/**
 * HomeRouter — İletişim ile aynı shell kararı: `useDevice` + `useResponsiveShell`.
 */

import { useDevice } from "@/components/layout/DeviceProvider";
import { useResponsiveShell } from "@/lib/useResponsiveShell";
import HomeDesktop from "./HomeDesktop";
import HomeMobile from "./HomeMobile";

export default function HomeRouter() {
  const device = useDevice();
  const ssrIsMobileOrTablet = device !== "desktop";
  const isMobileOrTablet = useResponsiveShell(ssrIsMobileOrTablet);
  if (isMobileOrTablet) {
    return <HomeMobile />;
  }
  return <HomeDesktop />;
}
