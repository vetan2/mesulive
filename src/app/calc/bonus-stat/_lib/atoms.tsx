"use client";

import { atom } from "jotai";
import { atomFamily } from "jotai/utils";
import { omit, values } from "lodash-es";
import { type PropsWithChildren } from "react";
import { z } from "zod";

import { BonusStat } from "~/entities/bonus-stat";
import { equipTypeSchema, type EquipType } from "~/entities/equip";
import { createScopeProvider } from "~/shared/jotai";
import { getZodErrorMessage } from "~/shared/zod";

const equipType = atom<EquipType>(equipTypeSchema.enum.NON_WEAPON);
equipType.debugLabel = "bonusStatCalc/equipType";

const equipLevel = atom<number | undefined>(undefined);
equipLevel.debugLabel = "bonusStatCalc/equipLevel";

const equipLevelErrorMessage = atom((get) =>
  getZodErrorMessage(
    z
      .number()
      .min(0, { message: "100 이상 250 이하의 수치를 입력해주세요." })
      .max(250, { message: "100 이상 250 이하의 수치를 입력해주세요." })
      .int({ message: "정수를 입력해주세요." }),
  )(get(equipLevel)),
);
equipLevelErrorMessage.debugLabel = "bonusStatCalc/equipLevelErrorMessage";

const isBossDrop = atom(true);
isBossDrop.debugLabel = "bonusStatCalc/isBossDrop";

const aimStat = atom<number | undefined>(undefined);
aimStat.debugLabel = "bonusStatCalc/aimStat";

const aimStatErrorMessage = atom((get) =>
  getZodErrorMessage(
    z.number().positive({ message: "0 이상의 수치를 입력해주세요." }),
  )(get(aimStat)),
);
aimStatErrorMessage.debugLabel = "bonusStatCalc/aimStatErrorMessage";

const weaponGrade = atom<"none" | number>("none");
weaponGrade.debugLabel = "bonusStatCalc/weaponGrade";

const statEfficiency = atomFamily((stat: BonusStat.PossibleStat) => {
  const _atom = atom<number | undefined>(undefined);
  _atom.debugLabel = `bonusStatCalc/statEfficiency-${stat}`;
  return _atom;
});

const statEfficiencyErrorMessage = atomFamily(
  (stat: BonusStat.PossibleStat) => {
    const _atom = atom((get) =>
      getZodErrorMessage(
        z
          .number()
          .positive({ message: "0 이상의 수치를 입력해주세요." })
          .max(9999, { message: "9999 이하의 수치를 입력해주세요." }),
      )(get(statEfficiency(stat))),
    );
    _atom.debugLabel = `bonusStatCalc/statEfficiencyErrorMessage-${stat}`;
    return _atom;
  },
);

const isStatEfficiencyModalOpen = atom(false);
isStatEfficiencyModalOpen.debugLabel =
  "bonusStatCalc/isStatEfficiencyModalOpen";

const isInputValid = atom(
  (get) =>
    get(equipLevelErrorMessage) == null &&
    get(aimStatErrorMessage) == null &&
    BonusStat.possibleStats.every(
      (stat) => get(statEfficiencyErrorMessage(stat)) == null,
    ),
);
isInputValid.debugLabel = "bonusStatCalc/isInputValid";

export const bonusStatCalcAtoms = {
  equipType,
  equipLevelErrorMessage,
  equipLevel,
  isBossDrop,
  aimStat,
  aimStatErrorMessage,
  weaponGrade,
  statEfficiency,
  statEfficiencyErrorMessage,
  isStatEfficiencyModalOpen,
  isInputValid,
};

export const BonusStatCalcProvider = createScopeProvider(
  [
    ...values(
      omit(bonusStatCalcAtoms, [
        "statEfficiency",
        "statEfficiencyErrorMessage",
      ]),
    ),
    ...BonusStat.possibleStats.map(statEfficiency),
    ...BonusStat.possibleStats.map(statEfficiencyErrorMessage),
  ],
  ({ children }: PropsWithChildren) => children,
);
