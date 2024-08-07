export type CurrencyUnit = "meso" | "cash" | "coin";
export const currencyUnits: CurrencyUnit[] = ["meso", "cash", "coin"];
export const currencyUnitLabels: Record<CurrencyUnit, string> = {
  meso: "메소",
  cash: "캐시",
  coin: "코인",
};
