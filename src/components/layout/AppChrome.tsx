"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { MenuProvider } from "@/components/layout/MenuContext";
import MobileTopbar from "@/components/layout/MobileTopbar";
import BottomNav from "@/components/layout/BottomNav";
import SiteHeader from "@/components/layout/SiteHeader";
import SideRail from "@/components/layout/SideRail";
import { useDevice } from "@/components/layout/DeviceProvider";
import { getActiveNavIdFromPathname, type SiteHeaderNavId } from "@/components/layout/headerConfig";
import { useWideNavLayout } from "@/hooks/useWideNavLayout";

function isHomePath(pathname: string): boolean {
  const s = pathname.replace(/\/+$/, "") || "/";
  return s === "/" || s === "/en";
}

export default function AppChrome({
  children,
  ssrWideNav,
}: Readonly<{ children: React.ReactNode; ssrWideNav: boolean }>) {
  /** Desktop: ≥1280px ve touch-tablet değilse SiteHeader. Tablet ailesi yatayda da handheld chrome kullanır. */
  const device = useDevice();
  const showDesktopHeader = useWideNavLayout(ssrWideNav) && device === "desktop";
  const pathname = usePathname() ?? "/";
  const searchParams = useSearchParams();
  const router = useRouter();

  const home = isHomePath(pathname);

  const homeSection = (searchParams.get("section") as SiteHeaderNavId | null) ?? "anasayfa";

  const setHomeSection = (id: string) => {
    const q = new URLSearchParams(searchParams.toString());
    q.set("section", id);
    const qs = q.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const routeNavId = useMemo(() => getActiveNavIdFromPathname(pathname), [pathname]);

  const headerActiveId: SiteHeaderNavId | string | undefined = home ? homeSection : routeNavId;

  useEffect(() => {
    document.documentElement.toggleAttribute("data-header-wide", showDesktopHeader);
    return () => document.documentElement.removeAttribute("data-header-wide");
  }, [showDesktopHeader]);

  /* Hydration-safe yapı: MenuProvider HER ZAMAN var, içerikteki bar'lar
   * media query ile gizlenir. Böylece SSR/client DOM ağacı tutarlı. */
  return (
    <MenuProvider>
      <SideRail />

      {showDesktopHeader ? (
        <SiteHeader activeNavId={headerActiveId} onNavChange={home ? setHomeSection : undefined} />
      ) : (
        <>
          <MobileTopbar fixed homeHref={pathname.startsWith("/en") ? "/en" : "/"} />
          <BottomNav />
        </>
      )}

      <div
        id="main-content"
        className={[
          home ? "relative min-h-0" : "",
          "app-chrome-main",
        ]
          .filter(Boolean)
          .join(" ")}
        style={home ? { zIndex: "var(--z-base)" } : undefined}
        suppressHydrationWarning
      >
        {children}
      </div>
    </MenuProvider>
  );
}
