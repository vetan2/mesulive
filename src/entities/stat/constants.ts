import { z } from "zod";

// 유효 스탯
export const effectiveStatSchema = z.enum([
  "STR",
  "STR %",
  "DEX",
  "DEX %",
  "INT",
  "INT %",
  "LUK",
  "LUK %",
  "HP",
  "HP %",
  "ALL",
  "ALL %",
  "ATTACK",
  "MAGIC_ATTACK",
  "BOSS_DAMAGE",
  "DAMAGE",
  "IGNORE_DEFENSE",
]);
export type EffectiveStat = z.infer<typeof effectiveStatSchema>;
export const effectiveStatOptions = effectiveStatSchema.options;
export const effectiveStatLabels: Record<EffectiveStat, string> = {
  STR: "STR",
  "STR %": "STR %",
  DEX: "DEX",
  "DEX %": "DEX %",
  INT: "INT",
  "INT %": "INT %",
  LUK: "LUK",
  "LUK %": "LUK %",
  HP: "HP",
  "HP %": "HP %",
  ALL: "올스탯",
  "ALL %": "올스탯 %",
  ATTACK: "공격력",
  MAGIC_ATTACK: "마력",
  BOSS_DAMAGE: "보공 %",
  DAMAGE: "데미지 %",
  IGNORE_DEFENSE: "방무 %",
};
