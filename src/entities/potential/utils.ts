import { flow, pipe } from "fp-ts/lib/function";
import { concatAll, type Monoid } from "fp-ts/lib/Monoid";
import { type Option } from "fp-ts/lib/Option";
import { P, match } from "ts-pattern";

import { type EffectiveStat } from "~/entities/stat";
import { A, E, O } from "~/shared/fp";
import { convertToNumber } from "~/shared/number";
import { entries } from "~/shared/object";

import { Potential } from ".";
import {
  type PossibleStat,
  gradesEnableToPromote,
  gradesEnableToReset,
  possibleStatRegexRecord,
  type AimType,
  type Grade,
  type ResetMethod,
  type Type,
} from "./constants";
import {
  type OptionSetForm,
  type OptionSet,
  type RefinedOptionSetForm,
} from "./types";

export const flattenLevel = (level: number) =>
  pipe(
    level,
    O.fromPredicate((l) => 0 <= l && l <= 250),
    O.map((l) => {
      if (l === 0) {
        return 9;
      }

      if (l < 120) {
        if (l % 10 === 0) {
          return l;
        }
        return Math.floor(l / 10) * 10 + 9;
      }

      if (l <= 200) {
        return 200;
      }

      return 250;
    }),
  );

export const getIsResetMethodEnable = (params: {
  aimType: AimType;
  resetMethod: ResetMethod;
  grade: Grade;
  type: Type;
}) =>
  match(params)
    .with(
      {
        type: "ADDI",
        resetMethod: P.not(P.union("ADDI", "ADDI_POTENTIAL", "STRANGE_ADDI")),
      },
      () => false,
    )
    .with(
      {
        type: "COMMON",
        resetMethod: P.union("ADDI", "ADDI_POTENTIAL", "STRANGE_ADDI"),
      },
      () => false,
    )
    .with({ aimType: "GRADE_UP" }, ({ resetMethod, grade }) =>
      gradesEnableToPromote[resetMethod].includes(grade),
    )
    .with({ aimType: "OPTIONS" }, ({ resetMethod, grade }) =>
      gradesEnableToReset[resetMethod].includes(grade),
    )
    .otherwise(() => false);

export const getResetCost = (params: {
  method: ResetMethod;
  level: number;
  grade: Grade;
}): number =>
  match(params)
    .with({ method: "POTENTIAL", grade: "RARE" }, ({ level }) => {
      if (level <= 159) return 4000000;
      if (level <= 199) return 4250000;
      if (level <= 249) return 4500000;
      return 5000000;
    })
    .with({ method: "POTENTIAL", grade: "EPIC" }, ({ level }) => {
      if (level <= 159) return 16000000;
      if (level <= 199) return 17000000;
      if (level <= 249) return 18000000;
      return 20000000;
    })
    .with({ method: "POTENTIAL", grade: "UNIQUE" }, ({ level }) => {
      if (level <= 159) return 34000000;
      if (level <= 199) return 36125000;
      if (level <= 249) return 38250000;
      return 42500000;
    })
    .with({ method: "POTENTIAL", grade: "LEGENDARY" }, ({ level }) => {
      if (level <= 159) return 40000000;
      if (level <= 199) return 42500000;
      if (level <= 249) return 45000000;
      return 50000000;
    })
    .with({ method: "ADDI_POTENTIAL", grade: "RARE" }, ({ level }) => {
      if (level <= 159) return 9_750_000;
      if (level <= 199) return 10_375_000;
      if (level <= 249) return 11_000_000;
      return 12_250_000;
    })
    .with({ method: "ADDI_POTENTIAL", grade: "EPIC" }, ({ level }) => {
      if (level <= 159) return 27_300_000;
      if (level <= 199) return 29_050_000;
      if (level <= 249) return 30_800_000;
      return 34_300_000;
    })
    .with({ method: "ADDI_POTENTIAL", grade: "UNIQUE" }, ({ level }) => {
      if (level <= 159) return 66_300_000;
      if (level <= 199) return 70_550_000;
      if (level <= 249) return 74_800_000;
      return 83_300_000;
    })
    .with({ method: "ADDI_POTENTIAL", grade: "LEGENDARY" }, ({ level }) => {
      if (level <= 159) return 78_000_000;
      if (level <= 199) return 83_000_000;
      if (level <= 249) return 88_000_000;
      return 98_000_000;
    })
    .otherwise(({ level }) => {
      if (level <= 30) return 0;
      if (level <= 70) return 0.5 * level ** 2;
      if (level <= 120) return 2.5 * level ** 2;
      return 20 * level ** 2;
    });

export const parseStat = (
  str: string,
): Option<{ stat: PossibleStat; figure: number }> =>
  pipe(
    entries(possibleStatRegexRecord).find(([, regex]) => regex.test(str)),
    O.fromNullable,
    O.chain(([stat, regex]) =>
      pipe(
        O.Do,
        O.apS(
          "stat",
          O.tryCatch(() => Potential.possibleStatsSchema.parse(stat)),
        ),
        O.apS("figure", convertToNumber(regex.exec(str)?.[1])),
      ),
    ),
  );

export const optionSetMonoid = (
  options: {
    concatALL?: boolean;
  } = { concatALL: true },
): Monoid<OptionSet> => ({
  concat: flow(
    (a, b) =>
      [a, b].flatMap(
        flow(
          entries,
          A.filter(
            (e): e is [(typeof e)[0], NonNullable<(typeof e)[1]>] =>
              e[0] != null,
          ),
          A.map(([stat, figure]) => ({ stat, figure })),
        ),
      ),
    A.reduce(
      {} as Partial<Record<Potential.PossibleStat, number>>,
      (acc, cur) => ({
        ...acc,
        ...match({ ...cur, ...options })
          .returnType<Partial<Record<Potential.PossibleStat, number>>>()
          .with({ stat: "IGNORE_DEFENSE" }, ({ figure }) => ({
            IGNORE_DEFENSE:
              ((acc["IGNORE_DEFENSE"] ?? 0) / 100 +
                (1 - (acc["IGNORE_DEFENSE"] ?? 0) / 100) * (figure / 100)) *
              100,
          }))
          .with({ stat: "ALL", concatALL: true }, ({ figure }) =>
            Object.fromEntries(
              (
                ["STR", "DEX", "INT", "LUK"] satisfies Potential.PossibleStat[]
              ).map((additionalStat) => [
                additionalStat,
                (acc[additionalStat] ?? 0) + figure,
              ]),
            ),
          )
          .with({ stat: "ALL %", concatALL: true }, ({ figure }) =>
            Object.fromEntries(
              (
                [
                  "STR %",
                  "DEX %",
                  "INT %",
                  "LUK %",
                ] satisfies Potential.PossibleStat[]
              ).map((additionalStat) => [
                additionalStat,
                (acc[additionalStat] ?? 0) + figure,
              ]),
            ),
          )
          .otherwise(({ stat, figure }) => ({
            [stat]: (acc[stat] ?? 0) + figure,
          })),
      }),
    ),
  ),
  empty: {},
});

export const isOptionSetFormValid =
  (possibleStats: EffectiveStat[]) => (form: OptionSetForm) =>
    !form.every(
      A.every(
        ({ stat, figure }) =>
          // 입력값이 비정상인 경우
          O.isNone(stat) ||
          E.isLeft(figure.value) ||
          figure.value.right === 0 ||
          !possibleStats.includes(stat.value),
      ),
    );

export const refineOptionSetForm = (
  form: OptionSetForm,
): RefinedOptionSetForm =>
  pipe(
    form,
    A.map(
      A.filterMap(({ stat, figure: { value } }) =>
        O.isSome(stat) && E.isRight(value) && value.right > 0
          ? O.some({ stat: stat.value, figure: value.right })
          : O.none,
      ),
    ),
    A.filter((set) => set.length > 0),
  );

export const convertRefinedOptionSetFormToOptionSets =
  (...monoidArgs: Parameters<typeof optionSetMonoid>) =>
  (form: RefinedOptionSetForm): OptionSet[] =>
    pipe(
      form,
      A.map(
        flow(
          A.map(({ stat, figure }) => ({ [stat]: figure })),
          concatAll(optionSetMonoid(...monoidArgs)),
        ),
      ),
    );
