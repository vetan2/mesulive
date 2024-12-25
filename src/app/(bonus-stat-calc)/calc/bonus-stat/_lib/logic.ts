import { pipe } from "fp-ts/lib/function";
import { type Option } from "fp-ts/lib/Option";
import { match, P } from "ts-pattern";
import { z } from "zod";

import { BonusStat } from "~/entities/bonus-stat";
import { equipTypeSchema, type EquipType } from "~/entities/equip";
import { type EffectiveStat } from "~/entities/stat";
import { O, R } from "~/shared/fp";
import { getCombinations, getRepeatPermutations } from "~/shared/math";

export const getOptionTable =
  (level: number, condition?: { isBossDrop?: boolean }) =>
  (option: BonusStat.Option): Option<BonusStat.OptionTable> =>
    pipe(
      O.Do,
      O.filter(() => level >= 100 && level <= 250),
      O.let("weight", () => (condition?.isBossDrop ? 2 : 0)),
      O.map(({ weight }) =>
        Array.from({ length: 5 })
          .map((_, i) => i + 1)
          .map((i) =>
            match(option)
              .with(
                P.union("STR", "DEX", "INT", "LUK"),
                () =>
                  (level < 250 ? Math.floor(level / 20) + 1 : 12) *
                  (i + weight),
              )
              .with(
                P.union(
                  "STR+DEX",
                  "STR+INT",
                  "STR+LUK",
                  "DEX+INT",
                  "DEX+LUK",
                  "INT+LUK",
                ),
                () => (Math.floor(level / 40) + 1) * (i + weight),
              )
              .with(
                P.union("ALL %", "ATTACK", "MAGIC_ATTACK", "DAMAGE_OR_JUMP"),
                () => i + weight,
              )
              .with("BOSS_DAMAGE_OR_SPEED", () => (i + weight) * 2)
              .with(
                "HP",
                () =>
                  (level < 250 ? Math.floor(level / 10) * 10 * 3 : 700) *
                  (i + weight),
              )
              .otherwise(() => 0),
          ),
      ),
      O.chain(O.tryCatchK(BonusStat.optionTableSchema.parse)),
    );

export const getEfficiencyAdjustedOptionTableRecord = ({
  equipLevel,
  equipType,
  statEfficiencyRecord,
  isBossDrop,
}: {
  equipLevel: number;
  equipType: EquipType;
  statEfficiencyRecord: Partial<Record<EffectiveStat, number>>;
  isBossDrop?: boolean;
}): Option<BonusStat.OptionTableRecord> =>
  pipe(
    BonusStat.optionSchema.options.reduce(
      (acc, option) => ({
        ...acc,
        [option]: pipe(
          getOptionTable(equipLevel, { isBossDrop })(option),
          O.toUndefined,
        ),
      }),
      {},
    ),
    O.tryCatchK(BonusStat.optionTableRecordSchema.parse),
    O.map(
      R.mapWithIndex((option, table) => {
        const efficiency = BonusStat.optionStatRecord[option].reduce(
          (acc, stat) => acc + (statEfficiencyRecord[stat] ?? 0),
          0,
        );

        return table.map((value) =>
          match(null)
            .when(
              () => equipType === "WEAPON" && option === "ATTACK",
              () => value,
            )
            .when(
              () =>
                equipType !== "WEAPON" &&
                BonusStat.isOptionAvailableAtWeapon(option),
              () => 0,
            )
            .otherwise(() => value * efficiency),
        ) as BonusStat.OptionTable;
      }),
    ),
  );

export type GetMethodProbRecord = (param: {
  equipLevel: number;
  equipType: EquipType;
  statEfficiencyRecord: Partial<Record<EffectiveStat, number>>;
  isBossDrop?: boolean;
  aimStat?: number;
  weaponGrade?: number;
}) => Partial<Record<BonusStat.ResetMethod, number>>;
export const getMethodProbRecordParamSchema: z.ZodType<
  Parameters<GetMethodProbRecord>[0]
> = z.object({
  equipLevel: z.number(),
  equipType: equipTypeSchema,
  statEfficiencyRecord: z.record(z.number().optional()),
  isBossDrop: z.boolean().optional(),
  aimStat: z.number().optional(),
  weaponGrade: z.number().optional(),
});
export const getMethodProbRecord: GetMethodProbRecord = ({
  equipLevel,
  equipType,
  statEfficiencyRecord,
  isBossDrop,
  aimStat: rawAimStat = 0,
  weaponGrade,
}) =>
  pipe(
    O.Do,
    O.apS(
      "aimStat",
      pipe(
        rawAimStat,
        O.fromPredicate((aimStat) =>
          match(equipType)
            .with("WEAPON", () => aimStat > 0 || (weaponGrade ?? 0) > 0)
            .with("NON_WEAPON", () => aimStat >= 0)
            .exhaustive(),
        ),
      ),
    ),
    O.apS(
      "efficiencyAdjustedOptionTableRecord",
      getEfficiencyAdjustedOptionTableRecord({
        equipLevel,
        equipType,
        statEfficiencyRecord,
        isBossDrop,
      }),
    ),
    O.bind("selectCountArray", () => O.some(isBossDrop ? [4] : [1, 2, 3, 4])),
    O.let(
      // methodProbArray[i][j]: method[j]에서 성공할 확률
      "methodProbArray",
      ({ efficiencyAdjustedOptionTableRecord, selectCountArray, aimStat }) =>
        selectCountArray.map((count) => {
          const optionsArray = getCombinations(
            BonusStat.optionSchema.options,
            count,
          );

          /**
           * 가능한 모든 등급 array 모음
           */
          const gradesArray = getRepeatPermutations([0, 1, 2, 3, 4], count);

          return pipe(
            optionsArray.map((options) => {
              const attackOptionIndex = options.indexOf("ATTACK");
              let boundedOptions = options;

              const checkIsAimAlwaysReached = () =>
                boundedOptions.reduce(
                  (acc, option) =>
                    acc + efficiencyAdjustedOptionTableRecord[option][0],
                  0,
                ) >= aimStat;

              const checkIsAimNeverReached = () =>
                boundedOptions.reduce(
                  (acc, option) =>
                    acc + efficiencyAdjustedOptionTableRecord[option][4],
                  0,
                ) < aimStat;

              // 나올 수 있는 스탯 총합 최소치에서 이미 목표 달성하면 true
              if (equipType !== "WEAPON" && checkIsAimAlwaysReached()) {
                return BonusStat.resetMethodSchema.options.map(() => 1);
              }

              // 나올 수 있는 스탯 총합 최대치에서서도 목표 달성 못하면 false
              if (equipType !== "WEAPON" && checkIsAimNeverReached()) {
                return BonusStat.resetMethodSchema.options.map(() => 0);
              }

              /**
               * 주어진 options에서 목표 달성 가능한 등급들 모음
               */
              const accomplishedValuesGrades = gradesArray.filter((grades) => {
                let boundedGrades = grades;

                if (equipType === "WEAPON") {
                  const attackGrade =
                    attackOptionIndex === -1
                      ? 0
                      : efficiencyAdjustedOptionTableRecord["ATTACK"][
                          grades[attackOptionIndex]
                        ];
                  if (weaponGrade && attackGrade < weaponGrade) {
                    return false;
                  }

                  boundedGrades = grades.filter(
                    (_, i) => i !== attackOptionIndex,
                  );
                  boundedOptions = options.filter(
                    (_, i) => i !== attackOptionIndex,
                  );

                  // 나올 수 있는 스탯 총합 최소치에서 이미 목표 달성하면 true
                  if (checkIsAimAlwaysReached()) {
                    return true;
                  }

                  // 나올 수 있는 스탯 총합 최대치에서서도 목표 달성 못하면 false
                  if (checkIsAimNeverReached()) {
                    return false;
                  }
                }

                return (
                  boundedOptions.reduce(
                    (acc, option, index) =>
                      acc +
                      efficiencyAdjustedOptionTableRecord[option][
                        boundedGrades[index]
                      ],
                    0,
                  ) >= aimStat
                );
              });

              return BonusStat.resetMethodSchema.options.map((method) =>
                accomplishedValuesGrades.length < gradesArray.length
                  ? accomplishedValuesGrades
                      .map((grades) =>
                        grades.reduce(
                          (acc, grade) =>
                            acc *
                            BonusStat.resetMethodProbTableRecord[method][grade],
                          1,
                        ),
                      )
                      .reduce((acc, prob) => acc + prob, 0)
                  : 1,
              );
            }),
            // methodProbArray[i][j]: optionsArray[i]인 option일 때, method[j]에서 성공할 확률
            (methodProbArray) =>
              BonusStat.resetMethodSchema.options.map(
                (_, j) =>
                  Array.from({ length: optionsArray.length }).reduce<number>(
                    (acc, _, i) => acc + methodProbArray[i][j],
                    0,
                  ) / optionsArray.length,
              ),
          );
        }),
    ),
    // methodProbArray[i][j]: selectedCountArray[i]개의 option을 선택했을 때, method[j]에서 성공할 확률
    O.map(({ methodProbArray }) =>
      BonusStat.resetMethodSchema.options.reduce(
        (acc, method, j) => ({
          ...acc,
          [method]:
            Array.from({ length: methodProbArray.length }).reduce<number>(
              (acc, _, i) => acc + methodProbArray[i][j],
              0,
            ) / methodProbArray.length,
        }),
        {} as Record<BonusStat.ResetMethod, number>,
      ),
    ),
    O.getOrElseW(() =>
      BonusStat.resetMethodSchema.options.reduce(
        (acc, method) => ({
          ...acc,
          [method]: undefined,
        }),
        {} as Record<BonusStat.ResetMethod, undefined>,
      ),
    ),
  );
