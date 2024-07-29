import { z } from "zod";

import { type EffectiveStat } from "~/entities/stat";
import { type ArrayElement } from "~/shared/types";
import { createZodPredicate } from "~/shared/zod";

import { type OptionTable } from "./types";

export const resetMethodSchema = z.enum([
  "POWERFUL",
  "ETERNAL",
  "ABYSS",
  "DROP",
  "CRAFT_MASTER",
  "CRAFT_MEISTER",
  "FUSE_MASTER",
  "FUSE_MEISTER",
]);
export type ResetMethod = z.infer<typeof resetMethodSchema>;
export const resetMethodLabels: Record<ResetMethod, string> = {
  POWERFUL: "강력한 환생의 불꽃",
  ETERNAL: "영원한 환생의 불꽃",
  ABYSS: "심연의 환생의 불꽃",
  DROP: "몬스터 드랍",
  CRAFT_MASTER: "장인 제작",
  CRAFT_MEISTER: "명장 제작",
  FUSE_MASTER: "장인 합성",
  FUSE_MEISTER: "명장 합성",
};
export const resetMethodProbTableRecord: Record<ResetMethod, OptionTable> = {
  POWERFUL: [0.2, 0.3, 0.36, 0.14, 0],
  ETERNAL: [0, 0.29, 0.45, 0.25, 0.01],
  ABYSS: [0, 0, 0.63, 0.34, 0.03],
  DROP: [0.25, 0.3, 0.3, 0.14, 0.01],
  CRAFT_MASTER: [0.15, 0.3, 0.4, 0.14, 0.01],
  CRAFT_MEISTER: [0, 0.19, 0.5, 0.3, 0.01],
  FUSE_MASTER: [0, 0.4, 0.45, 0.14, 0.01],
  FUSE_MEISTER: [0, 0.3, 0.5, 0.19, 0.01],
};

export const possibleStats = [
  "STR",
  "DEX",
  "INT",
  "LUK",
  "HP",
  "ALL %",
  "ATTACK",
  "MAGIC_ATTACK",
  "DAMAGE", // 데미지, 보공 합산
] satisfies EffectiveStat[];
export type PossibleStat = ArrayElement<typeof possibleStats>;

export const optionAvailableAtWeaponSchema = z.enum([
  "BOSS_DAMAGE_OR_SPEED",
  "DAMAGE_OR_JUMP",
]);
export type optionAvailableAtWeapon = z.infer<
  typeof optionAvailableAtWeaponSchema
>;
export const isOptionAvailableAtWeapon = createZodPredicate(
  optionAvailableAtWeaponSchema,
);

export const optionSchema = z.enum([
  "STR",
  "DEX",
  "INT",
  "LUK",
  "STR+DEX",
  "STR+INT",
  "STR+LUK",
  "DEX+INT",
  "DEX+LUK",
  "INT+LUK",
  "HP",
  "MP",
  "LEVEL",
  "DEFENSE",
  "ATTACK",
  "MAGIC_ATTACK",
  "ALL %",
  ...optionAvailableAtWeaponSchema.options,
]);
export type Option = z.infer<typeof optionSchema>;

export const optionStatRecord: Record<Option, EffectiveStat[]> = {
  STR: ["STR"],
  DEX: ["DEX"],
  INT: ["INT"],
  LUK: ["LUK"],
  "STR+DEX": ["STR", "DEX"],
  "STR+INT": ["STR", "INT"],
  "STR+LUK": ["STR", "LUK"],
  "DEX+INT": ["DEX", "INT"],
  "DEX+LUK": ["DEX", "LUK"],
  "INT+LUK": ["INT", "LUK"],
  HP: ["HP"],
  MP: [],
  LEVEL: [],
  DEFENSE: [],
  ATTACK: ["ATTACK"],
  MAGIC_ATTACK: ["MAGIC_ATTACK"],
  BOSS_DAMAGE_OR_SPEED: ["BOSS_DAMAGE"],
  DAMAGE_OR_JUMP: ["DAMAGE"],
  "ALL %": ["ALL %"],
};
