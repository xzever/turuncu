import { create } from "zustand";
import {
  DEFAULT_SOLAR_CONFIG,
  DEFAULT_SOLAR_INPUTS,
  calculateSolarAnalysis,
  getDefaultSolarInputs,
  getDistrictOptions,
  normalizeSolarConfig,
  type SolarAnalysisResult,
  type SolarInputState,
  type SolarRuntimeConfig,
  type SolarRuntimeConfigPatch,
} from "./calculationEngine";

type SolarAnalysisStore = {
  config: SolarRuntimeConfig;
  inputs: SolarInputState;
  result: SolarAnalysisResult;
  analysisStarted: boolean;
  setConfig: (config: SolarRuntimeConfigPatch | SolarRuntimeConfig) => void;
  setInput: <K extends keyof SolarInputState>(key: K, value: SolarInputState[K]) => void;
  setInputs: (partial: Partial<SolarInputState>) => void;
  setProvince: (province: string) => void;
  startAnalysis: () => void;
  resetAnalysisFlow: () => void;
};

type NumericInputKey =
  | "annualConsumptionKwh"
  | "monthlyBillTry"
  | "roofAreaM2"
  | "roofTiltDeg"
  | "evDailyKm";

const NUMERIC_LIMITS: Record<NumericInputKey, readonly [number, number]> = {
  annualConsumptionKwh: [1000, 100000],
  monthlyBillTry: [500, 30000],
  roofAreaM2: [12, 1200],
  roofTiltDeg: [0, 60],
  evDailyKm: [0, 600],
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function sanitizeNumericInput(
  key: NumericInputKey,
  value: unknown,
  fallback: number,
  config: SolarRuntimeConfig,
): number {
  const limitsByKey: Record<NumericInputKey, readonly [number, number]> = {
    annualConsumptionKwh: [
      config.sliderLimits.annualConsumptionMin,
      config.sliderLimits.annualConsumptionMax,
    ],
    monthlyBillTry: [config.sliderLimits.monthlyBillMin, config.sliderLimits.monthlyBillMax],
    roofAreaM2: [config.sliderLimits.roofAreaMin, config.sliderLimits.roofAreaMax],
    roofTiltDeg: [config.sliderLimits.roofTiltMin, config.sliderLimits.roofTiltMax],
    evDailyKm: [config.sliderLimits.evDailyKmMin, config.sliderLimits.evDailyKmMax],
  };

  const [min, max] = limitsByKey[key] ?? NUMERIC_LIMITS[key];
  const numericValue = Number(value);
  const safeValue = Number.isFinite(numericValue) ? numericValue : fallback;
  return clamp(safeValue, min, max);
}

function sanitizeInputs(
  inputs: SolarInputState,
  fallbackInputs: SolarInputState,
  config: SolarRuntimeConfig,
): SolarInputState {
  return {
    ...inputs,
    annualConsumptionKwh: sanitizeNumericInput(
      "annualConsumptionKwh",
      inputs.annualConsumptionKwh,
      fallbackInputs.annualConsumptionKwh,
      config,
    ),
    monthlyBillTry: sanitizeNumericInput(
      "monthlyBillTry",
      inputs.monthlyBillTry,
      fallbackInputs.monthlyBillTry,
      config,
    ),
    roofAreaM2: sanitizeNumericInput(
      "roofAreaM2",
      inputs.roofAreaM2,
      fallbackInputs.roofAreaM2,
      config,
    ),
    roofTiltDeg: sanitizeNumericInput(
      "roofTiltDeg",
      inputs.roofTiltDeg,
      fallbackInputs.roofTiltDeg,
      config,
    ),
    evDailyKm: sanitizeNumericInput(
      "evDailyKm",
      inputs.evDailyKm,
      fallbackInputs.evDailyKm,
      config,
    ),
  };
}

function withComputedResult(
  inputs: SolarInputState,
  config: SolarRuntimeConfig,
): Pick<SolarAnalysisStore, "inputs" | "result"> {
  return {
    inputs,
    result: calculateSolarAnalysis(inputs, config),
  };
}

function syncDistrict(province: string, district: string): string {
  const districtOptions = getDistrictOptions(province);
  if (districtOptions.includes(district)) {
    return district;
  }
  return districtOptions[0] ?? "Merkez";
}

export const useSolarAnalysisStore = create<SolarAnalysisStore>((set) => ({
  config: DEFAULT_SOLAR_CONFIG,
  ...withComputedResult(DEFAULT_SOLAR_INPUTS, DEFAULT_SOLAR_CONFIG),
  analysisStarted: false,
  setConfig: (configPatch) =>
    set((state) => {
      const nextConfig = normalizeSolarConfig(configPatch);
      const fallbackInputs = getDefaultSolarInputs(nextConfig);
      const nextInputs = state.analysisStarted
        ? {
            ...sanitizeInputs(state.inputs, fallbackInputs, nextConfig),
            district: syncDistrict(state.inputs.province, state.inputs.district),
          }
        : fallbackInputs;

      return {
        config: nextConfig,
        ...withComputedResult(nextInputs, nextConfig),
      };
    }),
  setInput: (key, value) =>
    set((state) => {
      const mergedInputs = { ...state.inputs, [key]: value } as SolarInputState;
      const nextInputs = sanitizeInputs(
        mergedInputs,
        getDefaultSolarInputs(state.config),
        state.config,
      );

      if (key === "province") {
        nextInputs.district = syncDistrict(String(value), nextInputs.district);
      }

      return withComputedResult(nextInputs, state.config);
    }),
  setInputs: (partial) =>
    set((state) => {
      const merged = sanitizeInputs(
        { ...state.inputs, ...partial },
        getDefaultSolarInputs(state.config),
        state.config,
      );
      const nextInputs: SolarInputState = {
        ...merged,
        district: syncDistrict(merged.province, merged.district),
      };

      return withComputedResult(nextInputs, state.config);
    }),
  setProvince: (province) =>
    set((state) => {
      const nextInputs: SolarInputState = {
        ...sanitizeInputs(
          state.inputs,
          getDefaultSolarInputs(state.config),
          state.config,
        ),
        province,
        district: syncDistrict(province, state.inputs.district),
      };
      return withComputedResult(nextInputs, state.config);
    }),
  startAnalysis: () => set({ analysisStarted: true }),
  resetAnalysisFlow: () => set({ analysisStarted: false }),
}));
