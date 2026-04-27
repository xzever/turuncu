"use client";

import { createContext, useContext } from "react";
export type DeviceType = "mobile" | "tablet" | "desktop";

const DeviceContext = createContext<DeviceType>("desktop");

export function DeviceProvider({
  device,
  children,
}: Readonly<{ device: DeviceType; children: React.ReactNode }>) {
  return <DeviceContext.Provider value={device}>{children}</DeviceContext.Provider>;
}

export function useDevice(): DeviceType {
  return useContext(DeviceContext);
}
