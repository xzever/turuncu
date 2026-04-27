export type HomePageUiCopy = {
  assistantTitlePrefix: string;
  assistantTitleSuffix: string;
  systemLabels: {
    onGrid: string;
    hybrid: string;
    offGrid: string;
  };
  addEvConsumption: string;
  kmPerDay: string;
  annualConsumption: string;
  computeFromBill: string;
  fieldLabels: {
    province: string;
    district: string;
    roofType: string;
    roofArea: string;
    orientation: string;
    tilt: string;
  };
  roofTypeLabels: {
    kiremit: string;
    trapez: string;
    sandvic: string;
    teras: string;
  };
  orientationLabels: {
    south: string;
    southEast: string;
    eastWest: string;
    north: string;
  };
  roofLimitActiveLabel: string;
  roofLimitOkLabel: string;
  metricLabels: {
    specificYield: string;
    fallbackYieldApplied: string;
    panelCount: string;
    moduleLabel: string;
    systemSize: string;
    roofLimited: string;
    optimizedForDemand: string;
    co2Reduction: string;
    annualCarbonReduction: string;
    annualProduction: string;
    annualSavings: string;
    payback: string;
    systemType: string;
    analysisSuffix: string;
    roiLabel: string;
  };
  templates: {
    assistantSummary: string;
    locationCoefficient: string;
    averagePerDay: string;
    tariffLine: string;
    investmentEstimate: string;
  };
};

export type HomePageUiCopyPatch = Partial<HomePageUiCopy> & {
  systemLabels?: Partial<HomePageUiCopy["systemLabels"]>;
  fieldLabels?: Partial<HomePageUiCopy["fieldLabels"]>;
  roofTypeLabels?: Partial<HomePageUiCopy["roofTypeLabels"]>;
  orientationLabels?: Partial<HomePageUiCopy["orientationLabels"]>;
  metricLabels?: Partial<HomePageUiCopy["metricLabels"]>;
  templates?: Partial<HomePageUiCopy["templates"]>;
};

export function getDefaultHomePageUiCopy(locale: string): HomePageUiCopy {
  const isTurkish = locale === "tr";

  return {
    assistantTitlePrefix: "TuSo",
    assistantTitleSuffix: "AI",
    systemLabels: {
      onGrid: "On-grid",
      hybrid: isTurkish ? "Hibrit" : "Hybrid",
      offGrid: "Off-grid",
    },
    addEvConsumption: isTurkish ? "EV tüketimi ekle" : "Add EV consumption",
    kmPerDay: isTurkish ? "km/gün" : "km/day",
    annualConsumption: isTurkish ? "YILLIK TÜKETİM (kWh)" : "ANNUAL CONSUMPTION (kWh)",
    computeFromBill: isTurkish ? "Aylık faturadan hesapla" : "Calculate from monthly bill",
    fieldLabels: {
      province: isTurkish ? "İl" : "Province",
      district: isTurkish ? "İlçe" : "District",
      roofType: isTurkish ? "Çatı tipi" : "Roof type",
      roofArea: isTurkish ? "Çatı alanı" : "Roof area",
      orientation: isTurkish ? "Yönelim" : "Orientation",
      tilt: isTurkish ? "Eğim (°)" : "Tilt (°)",
    },
    roofTypeLabels: {
      kiremit: isTurkish ? "Kiremit" : "Tile",
      trapez: isTurkish ? "Trapez" : "Trapezoid",
      sandvic: isTurkish ? "Sandviç" : "Sandwich panel",
      teras: isTurkish ? "Teras" : "Terrace",
    },
    orientationLabels: {
      south: isTurkish ? "Güney" : "South",
      southEast: isTurkish ? "Güneydoğu" : "South-east",
      eastWest: isTurkish ? "Doğu / Batı" : "East / West",
      north: isTurkish ? "Kuzey" : "North",
    },
    roofLimitActiveLabel: isTurkish ? "Aktif" : "Active",
    roofLimitOkLabel: isTurkish ? "Uygun" : "Eligible",
    metricLabels: {
      specificYield: isTurkish ? "SPESİFİK VERİM" : "SPECIFIC YIELD",
      fallbackYieldApplied: isTurkish ? "Fallback 1450 uygulandı" : "Fallback 1450 applied",
      panelCount: isTurkish ? "PANEL SAYISI" : "PANEL COUNT",
      moduleLabel: isTurkish ? "550W modül" : "550W module",
      systemSize: isTurkish ? "SİSTEM BOYUTU" : "SYSTEM SIZE",
      roofLimited: isTurkish ? "Çatı alanı ile sınırlı" : "Limited by roof area",
      optimizedForDemand: isTurkish ? "Tüketime göre optimize" : "Optimized for demand",
      co2Reduction: isTurkish ? "CO₂ AZALTMA" : "CO2 REDUCTION",
      annualCarbonReduction: isTurkish ? "Yıllık karbon azaltma" : "Annual carbon reduction",
      annualProduction: isTurkish ? "YILLIK ÜRETİM" : "ANNUAL PRODUCTION",
      annualSavings: isTurkish ? "YILLIK TASARRUF" : "ANNUAL SAVINGS",
      payback: isTurkish ? "GERİ ÖDEME" : "PAYBACK",
      systemType: isTurkish ? "SİSTEM TİPİ" : "SYSTEM TYPE",
      analysisSuffix: isTurkish ? "bazlı analiz" : "consumption-based analysis",
      roiLabel: "ROI",
    },
    templates: {
      assistantSummary: isTurkish
        ? "{province} / {district} için spesifik verim {yield} kWh/kWp. PR: {performanceRatio} • Çatı limiti: {roofLimitLabel}."
        : "Specific yield for {province} / {district}: {yield} kWh/kWp. PR: {performanceRatio} • Roof limit: {roofLimitLabel}.",
      locationCoefficient: isTurkish ? "{province} konum katsayısı" : "{province} location coefficient",
      averagePerDay: isTurkish ? "Ortalama {value} kWh / gün" : "Average {value} kWh / day",
      tariffLine: isTurkish ? "₺{value} / kWh tarife" : "₺{value} / kWh tariff",
      investmentEstimate: isTurkish ? "{value} yatırım tahmini" : "{value} estimated investment",
    },
  };
}

export function mergeHomePageUiCopy(
  base: HomePageUiCopy,
  patch?: HomePageUiCopyPatch | null,
): HomePageUiCopy {
  if (!patch) return base;

  return {
    ...base,
    ...patch,
    systemLabels: {
      ...base.systemLabels,
      ...(patch.systemLabels ?? {}),
    },
    fieldLabels: {
      ...base.fieldLabels,
      ...(patch.fieldLabels ?? {}),
    },
    roofTypeLabels: {
      ...base.roofTypeLabels,
      ...(patch.roofTypeLabels ?? {}),
    },
    orientationLabels: {
      ...base.orientationLabels,
      ...(patch.orientationLabels ?? {}),
    },
    metricLabels: {
      ...base.metricLabels,
      ...(patch.metricLabels ?? {}),
    },
    templates: {
      ...base.templates,
      ...(patch.templates ?? {}),
    },
  };
}

export function fillHomePageTemplate(
  template: string,
  values: Record<string, string>,
): string {
  return template.replace(/\{([a-zA-Z0-9_]+)\}/g, (_, key: string) => {
    return values[key] ?? "";
  });
}
