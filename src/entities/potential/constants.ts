import { type $Enums } from "@prisma/client";
import { z } from "zod";

import { type EffectiveStat } from "~/entities/stat";

export type ResetMethod = $Enums.PotentialResetMethod;
export const resetMethods: ResetMethod[] = [
  "RED",
  "POTENTIAL",
  "ADDI",
  "ADDI_POTENTIAL",
  "STRANGE",
  "MASTER",
  "ARTISAN",
  "STRANGE_ADDI",
];

export const resetMethodLabels: Record<ResetMethod, string> = {
  RED: "레드 큐브",
  POTENTIAL: "잠재능력 재설정/블랙 큐브",
  ADDI: "에디셔널 큐브/화이트 에디셔널 큐브",
  ADDI_POTENTIAL: "에디셔널 잠재능력 재설정",
  STRANGE: "수상한 큐브",
  MASTER: "장인의 큐브",
  ARTISAN: "명장의 큐브",
  STRANGE_ADDI: "수상한 에디셔널 큐브",
};

export type Grade = $Enums.PotentialGrade;
export const grades: Grade[] = ["RARE", "EPIC", "UNIQUE", "LEGENDARY"];
export const gradeLabels: Record<Grade, string> = {
  RARE: "레어",
  EPIC: "에픽",
  UNIQUE: "유니크",
  LEGENDARY: "레전드리",
};

export const gradesEnableToPromote: Record<ResetMethod, Grade[]> = {
  RED: ["RARE", "EPIC", "UNIQUE"],
  POTENTIAL: ["RARE", "EPIC", "UNIQUE"],
  ADDI: ["RARE", "EPIC", "UNIQUE"],
  ADDI_POTENTIAL: ["RARE", "EPIC", "UNIQUE"],
  STRANGE: ["RARE"],
  MASTER: ["RARE", "EPIC"],
  ARTISAN: ["RARE", "EPIC", "UNIQUE"],
  STRANGE_ADDI: ["RARE"],
};

export const possibleStats = [
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
] as const satisfies EffectiveStat[];
export const possibleStatsSchema = z.enum(possibleStats);
export type PossibleStat = z.infer<typeof possibleStatsSchema>;

export const possibleStatRegexes: Record<PossibleStat, RegExp> = {
  STR: /^\s*STR\s*:\s*\+(\d+)\s*$/,
  "STR %": /^\s*STR\s*:\s*\+(\d+)\s*%\s*$/,
  DEX: /^\s*DEX\s*:\s*\+(\d+)\s*$/,
  "DEX %": /^\s*DEX\s*:\s*\+(\d+)\s*%\s*$/,
  INT: /^\s*INT\s*:\s*\+(\d+)\s*$/,
  "INT %": /^\s*INT\s*:\s*\+(\d+)\s*%\s*$/,
  LUK: /^\s*LUK\s*:\s*\+(\d+)\s*$/,
  "LUK %": /^\s*LUK\s*:\s*\+(\d+)\s*%\s*$/,
  HP: /^\s*최대\s*HP\s*:\s*\+(\d+)\s*$/,
  "HP %": /^\s*최대\s*HP\s*:\s*\+(\d+)\s*%\s*$/,
  ALL: /^\s*올스탯\s*:\s*\+(\d+)\s*$/,
  "ALL %": /^\s*올스탯\s*:\s*\+(\d+)\s*%\s*$/,
  ATTACK: /^\s*공격력\s*:\s*\+(\d+)\s*$/,
  "ATTACK %": /^\s*공격력\s*:\s*\+(\d+)\s*%\s*$/,
  MAGIC_ATTACK: /^\s*마력\s*:\s*\+(\d+)\s*$/,
  "MAGIC_ATTACK %": /^\s*마력\s*:\s*\+(\d+)\s*%\s*$/,
  BOSS_DAMAGE: /^\s*보스\s*몬스터\s*공격\s*시\s*데미지\s*:\s*\+(\d+)\s*%\s*$/,
  DAMAGE: /^\s*데미지\s*:\s*\+(\d+)\s*%\s*$/,
  IGNORE_DEFENSE: /^\s*몬스터\s*방어율\s*무시\s*:\s*\+(\d+)\s*%\s*$/,
  CRITICAL_DAMAGE: /^\s*크리티컬\s*데미지\s*:\s*\+(\d+)\s*%\s*$/,
  COOL_DOWN: /^\s*모든\s*스킬의\s*재사용\s*대기시간\s*:\s*-(\d+)\s*초\s*/,
  STR_PER_9LEV: /^\s*캐릭터\s*기준\s*9레벨\s*당\s*STR\s*:\s*\+(\d+)\s*$/,
  DEX_PER_9LEV: /^\s*캐릭터\s*기준\s*9레벨\s*당\s*DEX\s*:\s*\+(\d+)\s*$/,
  INT_PER_9LEV: /^\s*캐릭터\s*기준\s*9레벨\s*당\s*INT\s*:\s*\+(\d+)\s*$/,
  LUK_PER_9LEV: /^\s*캐릭터\s*기준\s*9레벨\s*당\s*LUK\s*:\s*\+(\d+)\s*$/,
  ITEM_DROP: /^\s*아이템\s*드롭률\s*:\s*\+(\d+)\s*%\s*$/,
  MESO_OBTAIN: /^\s*메소\s*획득량\s*:\s*\+(\d+)\s*%\s*$/,
};

// 세 개의 옵션 중 최대 한 개만 존재할 수 있는 옵션의 정규식
export const maxOneOptionRegexes = [/쓸만한/, /피격\s*후\s*무적시간/];

// 세 개의 옵션 중 최대 두 개만 존재할 수 있는 옵션
export const maxTwoOptionRegexes = [
  /피격\s*시\s*일정\s*확률로\s*데미지\s*%\s*무시/,
  /피격\s*시\s*일정\s*확률로\s*일정\s*시간\s*무적/,
];
