import { z } from "zod";

export const equipTypeSchema = z.enum(["NON_WEAPON", "WEAPON"]);
export type EquipType = z.infer<typeof equipTypeSchema>;
export const equipTypeLabels: Record<EquipType, string> = {
  NON_WEAPON: "방어구",
  WEAPON: "무기",
};

export const equips = [
  "무기",
  "엠블렘",
  "보조무기(포스실드, 소울링 제외)",
  "포스실드, 소울링",
  "방패",
  "모자",
  "상의",
  "한벌옷",
  "하의",
  "신발",
  "장갑",
  "망토",
  "벨트",
  "어깨장식",
  "얼굴장식",
  "눈장식",
  "귀고리",
  "반지",
  "펜던트",
  "기계심장",
] as const;
export type Equip = (typeof equips)[number];
