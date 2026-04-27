"use client";

/**
 * SistemlerimizRouter — mobil/tablet ailede yok: sadece masaüstü shell.
 * Elde tutulan cihazda /sistemlerimiz açılırsa ana sayfaya yönlendirilir.
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDevice } from "@/components/layout/DeviceProvider";
import { useResponsiveShell } from "@/lib/useResponsiveShell";
import SistemlerimizDesktop from "./SistemlerimizDesktop";

export default function SistemlerimizRouter() {
  const device = useDevice();
  const ssrIsMobileOrTablet = device !== "desktop";
  const isMobileOrTablet = useResponsiveShell(ssrIsMobileOrTablet);
  const router = useRouter();
  useEffect(() => {
    if (isMobileOrTablet) router.replace("/");
  }, [isMobileOrTablet, router]);
  if (isMobileOrTablet) return null;
  return <SistemlerimizDesktop />;
}
