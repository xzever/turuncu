import provinceDistrictMapRaw from "../../data/tr_il_ilce.json";

const provinceDistrictMap = provinceDistrictMapRaw as Record<string, string[]>;

export const PROVINCE_OPTIONS = Object.keys(provinceDistrictMap).sort((a, b) =>
  a.localeCompare(b, "tr"),
);

export function getDistrictOptions(province: string): string[] {
  const districtOptions = provinceDistrictMap[province] ?? ["Merkez"];
  return districtOptions.length > 0 ? districtOptions : ["Merkez"];
}
