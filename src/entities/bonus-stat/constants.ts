import { z } from "zod";

import { type EffectiveStat } from "~/entities/stat";
import { type ArrayElement } from "~/shared/types";

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
