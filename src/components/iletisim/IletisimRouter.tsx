"use client";

/**
 * IletisimRouter — SSR-safe split (AGENTS.md Madde 2 tercih edilen hook).
 * `useResponsiveShell` SSR'da `useDevice` (user-agent) ile doğru değer verir
 * → ilk render'da desktop flash YOK. `useViewportProfile` SSR'da hep
 * `isMobileOrTablet: false` döner (flash riski).
 */

import type { ComponentProps } from "react";
import { useDevice } from "@/components/layout/DeviceProvider";
import { useResponsiveShell } from "@/lib/useResponsiveShell";
import IletisimDesktop from "./IletisimDesktop";
import IletisimMobile from "./IletisimMobile";

export type IletisimRouterProps = ComponentProps<typeof IletisimDesktop>;

export default function IletisimRouter(props: IletisimRouterProps) {
  const device = useDevice();
  const ssrIsMobileOrTablet = device !== "desktop";
  const isMobileOrTablet = useResponsiveShell(ssrIsMobileOrTablet);
  if (isMobileOrTablet) {
    return <IletisimMobile {...(props as ComponentProps<typeof IletisimMobile>)} />;
  }
  return <IletisimDesktop {...props} />;
}
