"use client";

import { identity, pipe } from "fp-ts/lib/function";
import { atom } from "jotai";
import { atomFamily, atomWithStorage } from "jotai/utils";
import { fromPairs, omit, values } from "lodash-es";
import { type PropsWithChildren } from "react";
import { P, match } from "ts-pattern";
import { z } from "zod";

import { BonusStat } from "~/entities/bonus-stat";
import { equipTypeSchema, type EquipType } from "~/entities/equip";
import { E, O } from "~/shared/fp";
import { createScopeProvider } from "~/shared/jotai";
import { parseZod } from "~/shared/zod";

import { type GetMethodProbRecord } from "./logic";

const equipType = atom<EquipType>(equipTypeSchema.enum.NON_WEAPON);
// equipType.debugLabel = "bonusStatCalc/equipType";

const equipLevel = atom<number | undefined>(undefined);
equipLevel.debugLabel = "bonusStatCalc/equipLevel";

const equipLevelParseResult = atom((get) =>
  pipe(
    get(equipLevel),
    parseZod(
      z
        .number()
        .min(0, { message: "100 이상 250 이하의 수치를 입력해주세요." })
        .max(250, { message: "100 이상 250 이하의 수치를 입력해주세요." })
        .int({ message: "정수를 입력해주세요." }),
    ),
  ),
);
equipLevelParseResult.debugLabel = "bonusStatCalc/equipLevelParseResult";

const isBossDrop = atom(true);
isBossDrop.debugLabel = "bonusStatCalc/isBossDrop";

const aimStat = atom<number | undefined>(undefined);
aimStat.debugLabel = "bonusStatCalc/aimStat";

const aimStatParseResult = atom((get) =>
  pipe(
    get(aimStat),
    parseZod(
      z
        .number()
        .positive({ message: "0보다 큰 수치를 입력해주세요." })
        .optional()
        .refine(
          (v) =>
            match({ equipType: get(equipType), weaponGrade: get(weaponGrade) })
              .with({ equipType: "NON_WEAPON" }, () => v != null && v > 0)
              .with({ weaponGrade: "none" }, () => v != null && v > 0)
              .with({ weaponGrade: P.number.gt(0) }, () => true)
              .otherwise(() => v != null && v > 0),
          "0보다 큰 수치를 입력해주세요.",
        )
        .transform((v) => v ?? 0),
    ),
  ),
);
aimStatParseResult.debugLabel = "bonusStatCalc/aimStatParseResult";

const weaponGrade = atom<"none" | number>("none");
weaponGrade.debugLabel = "bonusStatCalc/weaponGrade";

const statEfficiency = atomFamily((stat: BonusStat.PossibleStat) => {
  const _atom = atomWithStorage<number | null>(
    `bonusStatCalc/statEfficiency-${stat}`,
    match(stat)
      .with("STR", () => 1)
      .with("DEX", () => 0.1)
      .with("ATTACK", () => 4)
      .with("ALL %", () => 10)
      .with("DAMAGE", () => 14)
      .otherwise(() => null),
    undefined,
  );
  _atom.debugLabel = `bonusStatCalc/statEfficiency-${stat}`;
  return _atom;
});

const statEfficiencyParseResult = atomFamily((stat: BonusStat.PossibleStat) => {
  const _atom = atom((get) =>
    pipe(
      get(statEfficiency(stat)),
      parseZod(
        z
          .number()
          .positive({ message: "0 이상의 수치를 입력해주세요." })
          .max(9999, { message: "9999 이하의 수치를 입력해주세요." })
          .nullable()
          .transform((v) => v ?? undefined),
      ),
    ),
  );
  _atom.debugLabel = `bonusStatCalc/statEfficiencyParseResult-${stat}`;
  return _atom;
});

const isStatEfficiencyValid = atom((get) =>
  BonusStat.possibleStats.every((stat) =>
    E.isRight(get(statEfficiencyParseResult(stat))),
  ),
);
isStatEfficiencyValid.debugLabel = "bonusStatCalc/isStatEfficiencyValid";

const isStatEfficiencyModalOpen = atom(false);
isStatEfficiencyModalOpen.debugLabel =
  "bonusStatCalc/isStatEfficiencyModalOpen";

const calcInput = atom((get) =>
  pipe(
    E.right({
      equipType: get(equipType),
      isBossDrop: get(isBossDrop),
      weaponGrade: match(get(weaponGrade))
        .with("none", () => undefined)
        .otherwise(identity),
    }),
    E.apS("equipLevel", get(equipLevelParseResult)),
    E.apS("aimStat", get(aimStatParseResult)),
    E.apS(
      "statEfficiencyRecord",
      pipe(
        E.sequenceArray(
          BonusStat.possibleStats.map((stat) =>
            get(statEfficiencyParseResult(stat)),
          ),
        ),
        E.map(
          (efficiencies) =>
            fromPairs(
              BonusStat.possibleStats.map((stat, i) => [stat, efficiencies[i]]),
            ) as Record<BonusStat.PossibleStat, number | undefined>,
        ),
      ),
    ),
    O.fromEither<Parameters<GetMethodProbRecord>[0]>,
  ),
);
calcInput.debugLabel = "bonusStatCalc/calcInput";

const isInputValid = atom((get) => O.isSome(get(calcInput)));
isInputValid.debugLabel = "bonusStatCalc/isInputValid";

const simulatedStatFigure = atomFamily((stat: BonusStat.PossibleStat) => {
  const _atom = atom<number | undefined>(undefined);
  _atom.debugLabel = `bonusStatCalc/simulatedStatFigure-${stat}`;
  return _atom;
});

const simulatedStatSum = atom((get) =>
  BonusStat.possibleStats.reduce(
    (acc, stat) =>
      acc +
      (get(statEfficiency(stat)) ?? 0) * (get(simulatedStatFigure(stat)) ?? 0),
    0,
  ),
);
simulatedStatSum.debugLabel = "bonusStatCalc/simulatedStatSum";

const isStatSimulationModalOpen = atom(false);
isStatSimulationModalOpen.debugLabel =
  "bonusStatCalc/isStatSimulationModalOpen";

const resultState = atom<"idle" | "failure" | "pending" | "success">("idle");
resultState.debugLabel = "bonusStatCalc/resultState";

const calcResult = atom(
  fromPairs(
    BonusStat.resetMethodSchema.options.map((method) => [method, undefined]),
  ) as Record<BonusStat.ResetMethod, number | undefined>,
);
calcResult.debugLabel = "bonusStatCalc/calcResult";

export const bonusStatCalcAtoms = {
  equipType,
  equipLevelParseResult,
  equipLevel,
  isBossDrop,
  aimStat,
  aimStatParseResult,
  weaponGrade,
  statEfficiency,
  statEfficiencyParseResult,
  isStatEfficiencyValid,
  isStatEfficiencyModalOpen,
  isInputValid,
  simulatedStatFigure,
  simulatedStatSum,
  isStatSimulationModalOpen,
  resultState,
  calcInput,
  calcResult,
};

export const BonusStatCalcProvider = createScopeProvider(
  [
    ...values(
      omit(bonusStatCalcAtoms, [
        "statEfficiency",
        "statEfficiencyParseResult",
        "simulatedStatFigure",
      ]),
    ),
    ...BonusStat.possibleStats.map(statEfficiency),
    ...BonusStat.possibleStats.map(statEfficiencyParseResult),
    ...BonusStat.possibleStats.map(simulatedStatFigure),
  ],
  ({ children }: PropsWithChildren) => children,
);
