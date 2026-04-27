"use client";

/**
 * SistemFarklariRouter — İletişim ile aynı: `useDevice` + `useResponsiveShell`.
 */

import { useDevice } from "@/components/layout/DeviceProvider";
import { useResponsiveShell } from "@/lib/useResponsiveShell";
import SistemFarklariDesktop from "./SistemFarklariDesktop";
import SistemFarklariMobile from "./SistemFarklariMobile";

export default function SistemFarklariRouter() {
  const device = useDevice();
  const ssrIsMobileOrTablet = device !== "desktop";
  const isMobileOrTablet = useResponsiveShell(ssrIsMobileOrTablet);
  if (isMobileOrTablet) {
    return <SistemFarklariMobile />;
  }
  return <SistemFarklariDesktop />;
}
