"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDevice } from "@/components/layout/DeviceProvider";
import { useResponsiveShell } from "@/lib/useResponsiveShell";
import HakkimizdaDesktop from "./HakkimizdaDesktop";

export default function HakkimizdaRouter() {
  const device = useDevice();
  const ssrIsMobileOrTablet = device !== "desktop";
  const isMobileOrTablet = useResponsiveShell(ssrIsMobileOrTablet);
  const router = useRouter();
  useEffect(() => {
    if (isMobileOrTablet) router.replace("/");
  }, [isMobileOrTablet, router]);
  if (isMobileOrTablet) return null;
  return <HakkimizdaDesktop />;
}
