import { z } from "zod";

export const equipTypeSchema = z.enum(["NON_WEAPON", "WEAPON"]);
export type EquipType = z.infer<typeof equipTypeSchema>;
export const equipTypeLabels: Record<EquipType, string> = {
  NON_WEAPON: "방어구",
  WEAPON: "무기",
};
