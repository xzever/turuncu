import {
  ROOF_ORIENTATION_LABELS,
  ROOF_TYPE_LABELS,
  SYSTEM_TYPE_LABELS,
  type SolarAnalysisResult,
  type SolarInputState,
} from "./calculationEngine";

export interface LeadContactInput {
  fullName: string;
  phone: string;
  province: string;
  district: string;
}

export interface BuiltLeadPayload {
  submittedAt: string;
  contact: {
    fullName: string;
    phone: string;
  };
  location: {
    province: string;
    district: string;
  };
  project: {
    systemType: string;
    roofType: string;
    roofAreaM2: number;
    roofOrientation: string;
    roofTiltDeg: number;
    evEnabled: boolean;
    evDailyKm: number;
  };
  consumption: {
    source: "annual" | "monthlyBill";
    annualConsumptionKwh: number;
    evAnnualConsumptionKwh: number;
    totalAnnualConsumptionKwh: number;
    monthlyBillTry: number;
  };
  result: {
    specificYieldKwhPerKwp: number;
    systemSizeKwp: number;
    panelCount: number;
    annualProductionKwh: number;
    annualSavingsTry: number;
    paybackYears: number;
    co2ReductionKg: number;
    systemCostTry: number;
  };
}

function normalizeText(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

export function buildLeadPayload(
  contact: LeadContactInput,
  inputs: SolarInputState,
  result: SolarAnalysisResult,
): BuiltLeadPayload {
  return {
    submittedAt: new Date().toISOString(),
    contact: {
      fullName: normalizeText(contact.fullName),
      phone: normalizeText(contact.phone),
    },
    location: {
      province: normalizeText(contact.province || inputs.province),
      district: normalizeText(contact.district || inputs.district),
    },
    project: {
      systemType: SYSTEM_TYPE_LABELS[inputs.systemType],
      roofType: ROOF_TYPE_LABELS[inputs.roofType],
      roofAreaM2: Number(inputs.roofAreaM2.toFixed(1)),
      roofOrientation: ROOF_ORIENTATION_LABELS[inputs.roofOrientation],
      roofTiltDeg: Number(inputs.roofTiltDeg.toFixed(1)),
      evEnabled: inputs.evEnabled,
      evDailyKm: inputs.evEnabled ? Number(inputs.evDailyKm.toFixed(1)) : 0,
    },
    consumption: {
      source: inputs.useMonthlyBill ? "monthlyBill" : "annual",
      annualConsumptionKwh: Math.round(result.baseAnnualConsumptionKwh),
      evAnnualConsumptionKwh: Math.round(result.evAnnualConsumptionKwh),
      totalAnnualConsumptionKwh: Math.round(result.totalAnnualConsumptionKwh),
      monthlyBillTry: Number(inputs.monthlyBillTry.toFixed(0)),
    },
    result: {
      specificYieldKwhPerKwp: Number(result.specificYieldKwhPerKwp.toFixed(0)),
      systemSizeKwp: Number(result.systemSizeKwp.toFixed(2)),
      panelCount: result.panelCount,
      annualProductionKwh: Math.round(result.annualProductionKwh),
      annualSavingsTry: Math.round(result.annualSavingsTry),
      paybackYears: Number(result.paybackYears.toFixed(2)),
      co2ReductionKg: Math.round(result.co2ReductionKg),
      systemCostTry: Math.round(result.systemCostTry),
    },
  };
}

/**
 * `publicPricingLeadSchema` / `isPricingLeadBody` ile uyumlu `pricingSnapshot` gövdesi.
 * Geçersiz sonuçta `null` döner (form gönderilmemeli).
 */
export function buildHomepagePreAnalysisPricingSnapshot(input: {
  referenceId: string;
  followUpDateIso: string;
  inputs: SolarInputState;
  result: SolarAnalysisResult;
  systemTypeLabel: string;
  lead: BuiltLeadPayload;
  source: string;
}): Record<string, unknown> | null {
  const { result, inputs } = input;
  if (
    !Number.isFinite(result.systemSizeKwp) ||
    result.systemSizeKwp <= 0 ||
    !Number.isFinite(result.panelCount) ||
    result.panelCount < 1 ||
    !Number.isFinite(result.annualProductionKwh)
  ) {
    return null;
  }

  return {
    type: "homepage_pre_analysis",
    referenceId: input.referenceId,
    source: input.source,
    submittedAt: new Date().toISOString(),
    followUpDate: input.followUpDateIso,
    consumptionInput: inputs.useMonthlyBill
      ? { mode: "monthlyBill", monthlyBillTry: Math.round(inputs.monthlyBillTry) }
      : { mode: "annualConsumption", annualConsumptionKwh: Math.round(result.baseAnnualConsumptionKwh) },
    analysisSummary: {
      systemType: input.systemTypeLabel,
      systemSizeKw: Number(result.systemSizeKwp.toFixed(2)),
      panelCount: result.panelCount,
      annualProductionKwh: Math.round(result.annualProductionKwh),
      monthlySavingsTry: Math.round(result.monthlySavingsTry),
      paybackYears: Number(result.paybackYears.toFixed(2)),
      co2ReductionKg: Math.round(result.co2ReductionKg),
    },
    lead: {
      ...input.lead,
      contact: input.lead.contact,
      location: input.lead.location,
      project: input.lead.project,
    },
  };
}
