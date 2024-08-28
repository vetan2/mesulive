import { z } from "zod";

export const currencyUnitSchema = z.enum(["meso", "cash", "coin"]);
export const currencyUnits = currencyUnitSchema.options;
export type CurrencyUnit = z.infer<typeof currencyUnitSchema>;
export const currencyUnitLabels: Record<CurrencyUnit, string> = {
  meso: "메소",
  cash: "캐시",
  coin: "코인",
};
