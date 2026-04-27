import provinceDistrictMapRaw from "../../data/tr_il_ilce.json";
import solarYieldMapRaw from "../../data/tr_solar_yield.json";

export type SystemType = "onGrid" | "hybrid" | "offGrid";
export type RoofType = "kiremit" | "trapez" | "sandvic" | "teras";
export type RoofOrientation = "south" | "southEast" | "eastWest" | "north";

export interface SolarInputState {
  annualConsumptionKwh: number;
  useMonthlyBill: boolean;
  monthlyBillTry: number;
  province: string;
  district: string;
  roofType: RoofType;
  roofAreaM2: number;
  roofOrientation: RoofOrientation;
  roofTiltDeg: number;
  systemType: SystemType;
  evEnabled: boolean;
  evDailyKm: number;
}

export interface SolarAnalysisResult {
  baseAnnualConsumptionKwh: number;
  evAnnualConsumptionKwh: number;
  totalAnnualConsumptionKwh: number;
  specificYieldKwhPerKwp: number;
  usedFallbackYield: boolean;
  systemSizeKwp: number;
  panelCount: number;
  annualProductionKwh: number;
  dailyProductionKwh: number;
  annualSavingsTry: number;
  monthlySavingsTry: number;
  paybackYears: number;
  systemCostTry: number;
  co2ReductionKg: number;
  orientationFactor: number;
  tiltFactor: number;
  roofYieldFactor: number;
  roofCostFactor: number;
  gridCostFactor: number;
  selfConsumptionFactor: number;
  roofCapacityKwp: number;
  roofLimitApplied: boolean;
  tariffTryPerKwh: number;
  performanceRatio: number;
}

export interface SolarSliderLimits {
  annualConsumptionMin: number;
  annualConsumptionMax: number;
  annualConsumptionDefault: number;
  monthlyBillMin: number;
  monthlyBillMax: number;
  monthlyBillDefault: number;
  roofAreaMin: number;
  roofAreaMax: number;
  roofTiltMin: number;
  roofTiltMax: number;
  evDailyKmMin: number;
  evDailyKmMax: number;
}

export interface SolarRuntimeConfig {
  baseCostPerKwpTry: number;
  defaultTariffTryPerKwh: number;
  panelPowerWatt: number;
  performanceRatio: number;
  areaPerKwpM2: number;
  defaultSpecificYield: number;
  co2FactorKgPerKwh: number;
  evKwhPer100Km: number;
  selfConsumptionFactors: Record<SystemType, number>;
  gridCostFactors: Record<SystemType, number>;
  roofCostFactors: Record<RoofType, number>;
  roofYieldFactors: Record<RoofType, number>;
  orientationFactors: Record<RoofOrientation, number>;
  inputDefaults: SolarInputState;
  sliderLimits: SolarSliderLimits;
}

export type SolarRuntimeConfigPatch = Partial<
  Omit<
    SolarRuntimeConfig,
    | "selfConsumptionFactors"
    | "gridCostFactors"
    | "roofCostFactors"
    | "roofYieldFactors"
    | "orientationFactors"
    | "inputDefaults"
    | "sliderLimits"
  >
> & {
  selfConsumptionFactors?: Partial<SolarRuntimeConfig["selfConsumptionFactors"]>;
  gridCostFactors?: Partial<SolarRuntimeConfig["gridCostFactors"]>;
  roofCostFactors?: Partial<SolarRuntimeConfig["roofCostFactors"]>;
  roofYieldFactors?: Partial<SolarRuntimeConfig["roofYieldFactors"]>;
  orientationFactors?: Partial<SolarRuntimeConfig["orientationFactors"]>;
  inputDefaults?: Partial<SolarRuntimeConfig["inputDefaults"]>;
  sliderLimits?: Partial<SolarRuntimeConfig["sliderLimits"]>;
};

const provinceDistrictMap = provinceDistrictMapRaw as Record<string, string[]>;
const solarYieldMap = solarYieldMapRaw as Record<string, number>;

export const PROVINCE_OPTIONS = Object.keys(provinceDistrictMap).sort((a, b) =>
  a.localeCompare(b, "tr"),
);

export const SYSTEM_TYPE_LABELS: Record<SystemType, string> = {
  onGrid: "On-grid",
  hybrid: "Hybrid",
  offGrid: "Off-grid",
};

export const ROOF_TYPE_LABELS: Record<RoofType, string> = {
  kiremit: "Kiremit",
  trapez: "Trapez",
  sandvic: "Sandviç",
  teras: "Teras",
};

export const ROOF_ORIENTATION_LABELS: Record<RoofOrientation, string> = {
  south: "Güney",
  southEast: "Güneydoğu",
  eastWest: "Doğu / Batı",
  north: "Kuzey",
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function sanitizeNumber(value: number, fallback: number): number {
  return Number.isFinite(value) ? value : fallback;
}

export function getDistrictOptions(province: string): string[] {
  const districtOptions = provinceDistrictMap[province] ?? ["Merkez"];
  return districtOptions.length > 0 ? districtOptions : ["Merkez"];
}

function syncDistrict(province: string, district: string): string {
  const districtOptions = getDistrictOptions(province);
  if (districtOptions.includes(district)) {
    return district;
  }
  return districtOptions[0] ?? "Merkez";
}

export const DEFAULT_SOLAR_CONFIG: SolarRuntimeConfig = {
  baseCostPerKwpTry: 15000,
  defaultTariffTryPerKwh: 3.12,
  panelPowerWatt: 550,
  performanceRatio: 0.78,
  areaPerKwpM2: 5.2,
  defaultSpecificYield: 1450,
  co2FactorKgPerKwh: 0.43,
  evKwhPer100Km: 18,
  selfConsumptionFactors: {
    onGrid: 0.85,
    hybrid: 0.93,
    offGrid: 0.97,
  },
  gridCostFactors: {
    onGrid: 1,
    hybrid: 1.25,
    offGrid: 1.45,
  },
  roofCostFactors: {
    kiremit: 1.06,
    trapez: 1.02,
    sandvic: 1.04,
    teras: 1.08,
  },
  roofYieldFactors: {
    kiremit: 0.96,
    trapez: 0.98,
    sandvic: 0.97,
    teras: 1,
  },
  orientationFactors: {
    south: 1,
    southEast: 0.95,
    eastWest: 0.85,
    north: 0.65,
  },
  inputDefaults: {
    annualConsumptionKwh: 24000,
    useMonthlyBill: false,
    monthlyBillTry: 3200,
    province: "İstanbul",
    district: getDistrictOptions("İstanbul")[0] ?? "Kadıköy",
    roofType: "kiremit",
    roofAreaM2: 120,
    roofOrientation: "south",
    roofTiltDeg: 20,
    systemType: "hybrid",
    evEnabled: false,
    evDailyKm: 40,
  },
  sliderLimits: {
    annualConsumptionMin: 1000,
    annualConsumptionMax: 100000,
    annualConsumptionDefault: 24000,
    monthlyBillMin: 500,
    monthlyBillMax: 30000,
    monthlyBillDefault: 3200,
    roofAreaMin: 12,
    roofAreaMax: 1200,
    roofTiltMin: 0,
    roofTiltMax: 60,
    evDailyKmMin: 0,
    evDailyKmMax: 600,
  },
};

export function mergeSolarConfig(
  base: SolarRuntimeConfig,
  patch?: SolarRuntimeConfigPatch | null,
): SolarRuntimeConfig {
  if (!patch) {
    return {
      ...base,
      selfConsumptionFactors: { ...base.selfConsumptionFactors },
      gridCostFactors: { ...base.gridCostFactors },
      roofCostFactors: { ...base.roofCostFactors },
      roofYieldFactors: { ...base.roofYieldFactors },
      orientationFactors: { ...base.orientationFactors },
      inputDefaults: { ...base.inputDefaults },
      sliderLimits: { ...base.sliderLimits },
    };
  }

  const merged: SolarRuntimeConfig = {
    ...base,
    ...patch,
    selfConsumptionFactors: {
      ...base.selfConsumptionFactors,
      ...(patch.selfConsumptionFactors ?? {}),
    },
    gridCostFactors: {
      ...base.gridCostFactors,
      ...(patch.gridCostFactors ?? {}),
    },
    roofCostFactors: {
      ...base.roofCostFactors,
      ...(patch.roofCostFactors ?? {}),
    },
    roofYieldFactors: {
      ...base.roofYieldFactors,
      ...(patch.roofYieldFactors ?? {}),
    },
    orientationFactors: {
      ...base.orientationFactors,
      ...(patch.orientationFactors ?? {}),
    },
    inputDefaults: {
      ...base.inputDefaults,
      ...(patch.inputDefaults ?? {}),
    },
    sliderLimits: {
      ...base.sliderLimits,
      ...(patch.sliderLimits ?? {}),
    },
  };

  const province = PROVINCE_OPTIONS.includes(merged.inputDefaults.province)
    ? merged.inputDefaults.province
    : base.inputDefaults.province;

  return {
    ...merged,
    inputDefaults: {
      ...merged.inputDefaults,
      province,
      district: syncDistrict(province, merged.inputDefaults.district),
    },
  };
}

export function normalizeSolarConfig(
  patch?: SolarRuntimeConfigPatch | SolarRuntimeConfig | null,
): SolarRuntimeConfig {
  return mergeSolarConfig(DEFAULT_SOLAR_CONFIG, patch ?? null);
}

export function getDefaultSolarInputs(
  config: SolarRuntimeConfig = DEFAULT_SOLAR_CONFIG,
): SolarInputState {
  const normalizedConfig = normalizeSolarConfig(config);
  return {
    ...normalizedConfig.inputDefaults,
    district: syncDistrict(
      normalizedConfig.inputDefaults.province,
      normalizedConfig.inputDefaults.district,
    ),
  };
}

export const DEFAULT_SOLAR_INPUTS: SolarInputState = getDefaultSolarInputs(DEFAULT_SOLAR_CONFIG);

export function getSpecificYieldByProvince(province: string): { value: number; isFallback: boolean } {
  const raw = solarYieldMap[province];
  if (typeof raw === "number" && Number.isFinite(raw) && raw > 0) {
    return { value: raw, isFallback: false };
  }
  return { value: DEFAULT_SOLAR_CONFIG.defaultSpecificYield, isFallback: true };
}

export function getTiltFactor(roofTiltDeg: number): number {
  if (roofTiltDeg <= 5) return 0.92;
  if (roofTiltDeg <= 20) return 0.97;
  return 1;
}

export function estimateAnnualConsumptionFromMonthlyBill(
  monthlyBillTry: number,
  config: SolarRuntimeConfig = DEFAULT_SOLAR_CONFIG,
): number {
  const activeConfig = normalizeSolarConfig(config);
  const normalizedBill = clamp(
    sanitizeNumber(monthlyBillTry, activeConfig.inputDefaults.monthlyBillTry),
    activeConfig.sliderLimits.monthlyBillMin,
    activeConfig.sliderLimits.monthlyBillMax,
  );
  return Math.round((normalizedBill * 12) / activeConfig.defaultTariffTryPerKwh);
}

export function calculateSolarAnalysis(
  inputs: SolarInputState,
  config: SolarRuntimeConfig = DEFAULT_SOLAR_CONFIG,
): SolarAnalysisResult {
  const activeConfig = normalizeSolarConfig(config);
  const defaultInputs = getDefaultSolarInputs(activeConfig);
  const tariffTryPerKwh = activeConfig.defaultTariffTryPerKwh;

  const annualConsumptionKwh = clamp(
    sanitizeNumber(inputs.annualConsumptionKwh, defaultInputs.annualConsumptionKwh),
    activeConfig.sliderLimits.annualConsumptionMin,
    activeConfig.sliderLimits.annualConsumptionMax,
  );

  const monthlyBillTry = clamp(
    sanitizeNumber(inputs.monthlyBillTry, defaultInputs.monthlyBillTry),
    activeConfig.sliderLimits.monthlyBillMin,
    activeConfig.sliderLimits.monthlyBillMax,
  );

  const roofAreaM2 = clamp(
    sanitizeNumber(inputs.roofAreaM2, defaultInputs.roofAreaM2),
    activeConfig.sliderLimits.roofAreaMin,
    activeConfig.sliderLimits.roofAreaMax,
  );

  const roofTiltDeg = clamp(
    sanitizeNumber(inputs.roofTiltDeg, defaultInputs.roofTiltDeg),
    activeConfig.sliderLimits.roofTiltMin,
    activeConfig.sliderLimits.roofTiltMax,
  );

  const evDailyKm = clamp(
    sanitizeNumber(inputs.evDailyKm, defaultInputs.evDailyKm),
    activeConfig.sliderLimits.evDailyKmMin,
    activeConfig.sliderLimits.evDailyKmMax,
  );

  const baseAnnualConsumptionKwh = inputs.useMonthlyBill
    ? estimateAnnualConsumptionFromMonthlyBill(monthlyBillTry, activeConfig)
    : annualConsumptionKwh;

  const evAnnualConsumptionKwh = inputs.evEnabled
    ? (evDailyKm * 365 * activeConfig.evKwhPer100Km) / 100
    : 0;

  const totalAnnualConsumptionKwh = baseAnnualConsumptionKwh + evAnnualConsumptionKwh;

  const { value: specificYieldKwhPerKwp, isFallback: usedFallbackYield } =
    getSpecificYieldByProvince(inputs.province);

  const orientationFactor = activeConfig.orientationFactors[inputs.roofOrientation];
  const tiltFactor = getTiltFactor(roofTiltDeg);
  const roofYieldFactor = activeConfig.roofYieldFactors[inputs.roofType];
  const roofCostFactor = activeConfig.roofCostFactors[inputs.roofType];
  const gridCostFactor = activeConfig.gridCostFactors[inputs.systemType];
  const selfConsumptionFactor = activeConfig.selfConsumptionFactors[inputs.systemType];

  const requestedSystemSizeKwp = totalAnnualConsumptionKwh / specificYieldKwhPerKwp;
  const roofCapacityKwp = roofAreaM2 / activeConfig.areaPerKwpM2;
  const roofLimitApplied = roofCapacityKwp < requestedSystemSizeKwp;
  const systemSizeKwp = Math.max(0.2, roofLimitApplied ? roofCapacityKwp : requestedSystemSizeKwp);

  const annualProductionKwh =
    systemSizeKwp *
    specificYieldKwhPerKwp *
    orientationFactor *
    tiltFactor *
    activeConfig.performanceRatio *
    roofYieldFactor;

  const annualSavingsTry = totalAnnualConsumptionKwh * tariffTryPerKwh * selfConsumptionFactor;
  const monthlySavingsTry = annualSavingsTry / 12;

  const systemCostTry =
    systemSizeKwp * activeConfig.baseCostPerKwpTry * gridCostFactor * roofCostFactor;
  const paybackYears = annualSavingsTry > 0 ? systemCostTry / annualSavingsTry : 0;

  const panelCount = Math.max(1, Math.round((systemSizeKwp * 1000) / activeConfig.panelPowerWatt));
  const co2ReductionKg = annualProductionKwh * activeConfig.co2FactorKgPerKwh;
  const dailyProductionKwh = annualProductionKwh / 365;

  return {
    baseAnnualConsumptionKwh,
    evAnnualConsumptionKwh,
    totalAnnualConsumptionKwh,
    specificYieldKwhPerKwp,
    usedFallbackYield,
    systemSizeKwp,
    panelCount,
    annualProductionKwh,
    dailyProductionKwh,
    annualSavingsTry,
    monthlySavingsTry,
    paybackYears,
    systemCostTry,
    co2ReductionKg,
    orientationFactor,
    tiltFactor,
    roofYieldFactor,
    roofCostFactor,
    gridCostFactor,
    selfConsumptionFactor,
    roofCapacityKwp,
    roofLimitApplied,
    tariffTryPerKwh,
    performanceRatio: activeConfig.performanceRatio,
  };
}
