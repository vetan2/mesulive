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
  "ATTACK %",
  "MAGIC_ATTACK",
  "MAGIC_ATTACK %",
  "BOSS_DAMAGE",
  "DAMAGE",
  "IGNORE_DEFENSE",
  "CRITICAL_DAMAGE",
  "COOL_DOWN",
  "STR_PER_9LEV",
  "DEX_PER_9LEV",
  "INT_PER_9LEV",
  "LUK_PER_9LEV",
  "ITEM_DROP",
  "MESO_OBTAIN",
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
  "ATTACK %": "공격력 %",
  MAGIC_ATTACK: "마력",
  "MAGIC_ATTACK %": "마력 %",
  BOSS_DAMAGE: "보스 공격 시 데미지 %",
  DAMAGE: "데미지 %",
  IGNORE_DEFENSE: "몬스터 방어율 무시 %",
  CRITICAL_DAMAGE: "크리티컬 데미지 %",
  COOL_DOWN: "모든 스킬의 재사용 대기시간 감소",
  STR_PER_9LEV: "캐릭터 기준 9레벨 당 STR",
  DEX_PER_9LEV: "캐릭터 기준 9레벨 당 DEX",
  INT_PER_9LEV: "캐릭터 기준 9레벨 당 INT",
  LUK_PER_9LEV: "캐릭터 기준 9레벨 당 LUK",
  ITEM_DROP: "아이템 드롭률",
  MESO_OBTAIN: "메소 획득량",
};
