import { type $Enums } from "@prisma/client";
import { type StaticImageData } from "next/image";
import { z } from "zod";

import { type EffectiveStat } from "~/entities/stat";
import {
  AddiCube,
  AddiPotential,
  ArtisanCube,
  MasterCube,
  Potential,
  RedCube,
  StrangeAddiCube,
  StrangeCube,
} from "~/shared/assets/images";
import { cx } from "~/shared/style";

export type ResetMethod = $Enums.PotentialResetMethod;
export const resetMethodSchema = z.enum([
  "RED",
  "POTENTIAL",
  "ADDI",
  "ADDI_POTENTIAL",
  "STRANGE",
  "MASTER",
  "ARTISAN",
  "STRANGE_ADDI",
] as const satisfies ResetMethod[]);
export const resetMethods = resetMethodSchema.options;

export type Cube = Exclude<ResetMethod, "POTENTIAL" | "ADDI_POTENTIAL">;
export const cubes: Cube[] = [
  "RED",
  "ADDI",
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
export const resetMethodImages: Record<ResetMethod, StaticImageData> = {
  RED: RedCube,
  POTENTIAL: Potential,
  ADDI: AddiCube,
  ADDI_POTENTIAL: AddiPotential,
  STRANGE: StrangeCube,
  MASTER: MasterCube,
  ARTISAN: ArtisanCube,
  STRANGE_ADDI: StrangeAddiCube,
};
export const resetMethodColorClassNames: Record<
  ResetMethod,
  { text: string; bg: string }
> = {
  RED: { text: cx("text-redCube"), bg: cx("bg-redCube") },
  POTENTIAL: { text: cx("text-potential"), bg: cx("bg-potential") },
  ADDI: { text: cx("text-addiCube"), bg: cx("bg-addiCube") },
  ADDI_POTENTIAL: {
    text: cx("text-addiPotential"),
    bg: cx("bg-addiPotential"),
  },
  STRANGE: { text: cx("text-strangeCube"), bg: cx("bg-strangeCube") },
  MASTER: { text: cx("text-masterCube"), bg: cx("bg-masterCube") },
  ARTISAN: { text: cx("text-artisanCube"), bg: cx("bg-artisanCube") },
  STRANGE_ADDI: {
    text: cx("text-strangeAddiCube"),
    bg: cx("bg-strangeAddiCube"),
  },
};

export type OptionGrade = $Enums.PotentialOptionGrade;
export const optionGradeSchema = z.enum([
  "NORMAL",
  "RARE",
  "EPIC",
  "UNIQUE",
  "LEGENDARY",
] as const satisfies OptionGrade[]);
export const optionGrades = optionGradeSchema.options;

export type Grade = $Enums.PotentialGrade;
export const gradeSchema = z.enum([
  "RARE",
  "EPIC",
  "UNIQUE",
  "LEGENDARY",
] as const satisfies Grade[]);
export const grades = gradeSchema.options;
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

export const gradesEnableToReset: Record<ResetMethod, Grade[]> = {
  RED: ["RARE", "EPIC", "UNIQUE", "LEGENDARY"],
  POTENTIAL: ["RARE", "EPIC", "UNIQUE", "LEGENDARY"],
  ADDI: ["RARE", "EPIC", "UNIQUE", "LEGENDARY"],
  ADDI_POTENTIAL: ["RARE", "EPIC", "UNIQUE", "LEGENDARY"],
  STRANGE: ["RARE", "EPIC"],
  MASTER: ["RARE", "EPIC", "UNIQUE"],
  ARTISAN: ["RARE", "EPIC", "UNIQUE", "LEGENDARY"],
  STRANGE_ADDI: ["RARE", "EPIC"],
};

export const aimTypeSchema = z.enum(["GRADE_UP", "OPTIONS"]);
export const aimTypes = aimTypeSchema.options;
export type AimType = z.infer<typeof aimTypeSchema>;
export const aimTypeLabels: Record<AimType, string> = {
  GRADE_UP: "등급 업",
  OPTIONS: "옵션 띄우기",
};

export const typeSchema = z.enum(["COMMON", "ADDI"]);
export const types = typeSchema.options;
export type Type = z.infer<typeof typeSchema>;
export const typeLabels: Record<Type, string> = {
  COMMON: "일반",
  ADDI: "에디셔널",
};

export const typesEnableToReset: Record<ResetMethod, Type[]> = {
  RED: ["COMMON"],
  POTENTIAL: ["COMMON"],
  ADDI: ["ADDI"],
  ADDI_POTENTIAL: ["ADDI"],
  STRANGE: ["COMMON"],
  MASTER: ["COMMON"],
  ARTISAN: ["COMMON"],
  STRANGE_ADDI: ["ADDI"],
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
