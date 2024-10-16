"use client";

import { molecule, type MoleculeConstructor } from "bunshi";
import { flow, pipe } from "fp-ts/lib/function";
import { type Option } from "fp-ts/lib/Option";
import { produce } from "immer";
import { type Getter, type Setter, atom } from "jotai";
import { atomWithReset, type RESET } from "jotai/utils";
import { z } from "zod";

import { equipSchema, equips, type Equip } from "~/entities/equip";
import { currencyUnitSchema, type CurrencyUnit } from "~/entities/game";
import { Potential } from "~/entities/potential";
import { A, E, O } from "~/shared/fp";
import { convertToNumber } from "~/shared/number";
import { values } from "~/shared/object";
import { type FormPayload } from "~/shared/react";
import { parseZod, parseZodWithErrorMessage } from "~/shared/zod";

import { PotentialCalcScope } from "./scopes";

const potentialCalcMoleculeConstructor = ((_, scope) => {
  scope(PotentialCalcScope);

  const _equipAtom = atom<Equip>(equips[0]);
  const equipAtom = atom(
    (get) => get(_equipAtom),
    (get, set, input: string) => {
      set(_equipAtom, (prev) =>
        pipe(
          input,
          parseZod(equipSchema),
          E.getOrElse(() => prev),
        ),
      );

      loadPossibleOptionIds(get, set);
    },
  );

  const _levelAtom = atom<FormPayload<number>>({
    input: "",
    value: E.left("레벨을 입력해주세요."),
  });
  const levelAtom = atom(
    (get) => get(_levelAtom),
    (get, set, input: string) => {
      set(_levelAtom, {
        input,
        value: pipe(
          convertToNumber(input),
          O.toNullable,
          parseZodWithErrorMessage(
            z
              .number({ message: "레벨을 입력해주세요." })
              .int({ message: "정수를 입력해주세요." })
              .min(0, {
                message: "0 이상의 정수를 입력해주세요.",
              })
              .max(300, {
                message: "300 이하의 정수를 입력해주세요.",
              }),
          ),
        ),
      });
    },
  );

  const _gradeAtom = atom<Potential.Grade>(Potential.grades[0]);
  const gradeAtom = atom(
    (get) => get(_gradeAtom),
    (get, set, input: string) => {
      set(_gradeAtom, (prev) =>
        pipe(
          input,
          parseZod(Potential.gradeSchema),
          E.getOrElse(() => prev),
        ),
      );

      adjustResetMethods(get, set);
      loadPossibleOptionIds(get, set);
    },
  );

  const _aimTypeAtom = atom<Potential.AimType>("GRADE_UP");
  const aimTypeAtom = atom(
    (get) => get(_aimTypeAtom),
    (get, set, input: string) => {
      set(_aimTypeAtom, (prev) =>
        pipe(
          input,
          parseZod(Potential.aimTypeSchema),
          E.getOrElse(() => prev),
        ),
      );

      adjustResetMethods(get, set);
      loadPossibleOptionIds(get, set);
    },
  );

  const _typeAtom = atom<Potential.Type>("COMMON");
  const typeAtom = atom(
    (get) => get(_typeAtom),
    (get, set, input: string) => {
      set(_typeAtom, (prev) =>
        pipe(
          input,
          parseZod(Potential.typeSchema),
          E.getOrElse(() => prev),
        ),
      );

      adjustResetMethods(get, set);
      loadPossibleOptionIds(get, set);
    },
  );

  const _resetMethodsAtom = atom<Potential.ResetMethod[]>([]);
  const resetMethodsAtom = atom((get) => get(_resetMethodsAtom));
  const addResetMethodAtom = atom(null, (get, set, input: string) => {
    set(_resetMethodsAtom, (prev) =>
      pipe(
        input,
        parseZod(Potential.resetMethodSchema),
        E.match(
          () => prev,
          (method) => prev.filter((m) => m !== method).concat(method),
        ),
      ),
    );

    adjustResetMethods(get, set);
  });
  const removeResetMethodAtom = atom(null, (_, set, input: string) => {
    set(_resetMethodsAtom, (prev) => prev.filter((method) => method !== input));
  });
  const adjustResetMethods = (get: Getter, set: Setter) => {
    const aimType = get(_aimTypeAtom);
    const grade = get(_gradeAtom);
    const type = get(_typeAtom);

    set(_resetMethodsAtom, (prev) =>
      prev.filter((method) =>
        Potential.getIsResetMethodEnable({
          aimType,
          resetMethod: method,
          grade,
          type,
        }),
      ),
    );
  };

  type CubePriceRecord = Record<
    Potential.Cube,
    { price: FormPayload<number>; unit: CurrencyUnit }
  >;
  const _cubePricesAtom = atom<CubePriceRecord>(
    Potential.cubes.reduce(
      (acc, cube) => ({
        ...acc,
        [cube]: {
          unit: "meso",
          price: { input: "", value: E.right(0) },
        } satisfies CubePriceRecord[Potential.Cube],
      }),
      {} as CubePriceRecord,
    ),
  );
  const cubePricesAtom = atom((get) => get(_cubePricesAtom));
  const setCubePriceAtom = atom(
    null,
    (
      get,
      set,
      cube: Potential.Cube,
      { priceInput, unitInput }: { priceInput?: string; unitInput?: string },
    ) => {
      set(
        _cubePricesAtom,
        produce((draft) => {
          draft[cube].price = pipe(
            O.fromNullable(priceInput),
            O.map((input) => ({
              input,
              value: pipe(
                convertToNumber(input || 0),
                O.toNullable,
                parseZodWithErrorMessage(
                  z.number({ message: "숫자을 입력해주세요." }).min(0, {
                    message: "0 이상의 숫자를 입력해주세요.",
                  }),
                ),
              ),
            })),
            O.getOrElse(() => draft[cube].price),
          );

          draft[cube].unit = pipe(
            O.fromNullable(unitInput),
            O.chainEitherK(parseZod(currencyUnitSchema)),
            O.getOrElse(() => draft[cube].unit),
          );
        }),
      );
    },
  );

  const cubePriceSettingModalOpen = atom(false);

  type OptionSets = {
    stat: Option<Potential.PossibleStat>;
    figure: FormPayload<number>;
  }[][];
  const createNewOptionSet = (): OptionSets[number] =>
    Array.from({ length: 3 }).map(() => ({
      stat: O.none,
      figure: { input: "", value: E.right(0) },
    }));
  const _optionSetsAtom = atomWithReset<OptionSets>([createNewOptionSet()]);
  const optionSetFormAtom = atom(
    (get) => get(_optionSetsAtom),
    (get, set, reset: typeof RESET) => {
      set(_optionSetsAtom, reset);
    },
  );
  const optionSetsAtom = atom(
    (get) =>
      pipe(
        get(_optionSetsAtom),
        A.map(
          A.filterMap(({ stat, figure: { value } }) =>
            O.isSome(stat) && E.isRight(value) && value.right > 0
              ? O.some({ stat: stat.value, figure: value.right })
              : O.none,
          ),
        ),
        A.filter((set) => set.length > 0),
      ),
    (get, set, reset: typeof RESET) => {
      set(_optionSetsAtom, reset);
    },
  );

  const addOptionSetAtom = atom(null, (get, set) => {
    set(_optionSetsAtom, (prev) => prev.concat([createNewOptionSet()]));
  });
  const editOptionAtom = atom(
    null,
    (
      get,
      set,
      {
        setIndex,
        optionIndex,
        stat,
        figure,
      }: {
        setIndex: number;
        optionIndex: number;
        stat?: "NONE" | string;
        figure?: string;
      },
    ) => {
      set(_optionSetsAtom, (prev) =>
        produce(prev, (draft) => {
          if (!draft[setIndex]) return;
          if (!draft[setIndex][optionIndex]) return;

          draft[setIndex][optionIndex].stat = pipe(
            O.fromNullable(stat),
            O.chainEitherK(
              parseZod(z.enum([...Potential.possibleStats, "NONE"])),
            ),
            O.match(
              () => draft[setIndex][optionIndex].stat,
              O.fromPredicate(
                (s): s is Exclude<typeof s, "NONE"> => s !== "NONE",
              ),
            ),
          );

          draft[setIndex][optionIndex].figure = pipe(
            O.fromNullable(figure),
            O.map((input) => ({
              input,
              value: pipe(
                input || 0,
                convertToNumber,
                O.getOrElseW(() => null),
                parseZodWithErrorMessage(
                  z.number({ message: "숫자를 입력해주세요." }).min(0, {
                    message: "0 이상의 숫자를 입력해주세요.",
                  }),
                ),
              ),
            })),
            O.getOrElse(() => draft[setIndex][optionIndex].figure),
          );
        }),
      );
    },
  );
  const removeOptionSetAtom = atom(null, (get, set, setIndex: number) => {
    set(_optionSetsAtom, (prev) =>
      prev.filter((_, index) => index !== setIndex),
    );
  });
  const adjustOptionSetsAtom = atom(
    null,
    (get, set, statOptions: Potential.PossibleStat[]) => {
      set(
        _optionSetsAtom,
        flow(
          A.map(
            A.map(({ stat, figure }) => ({
              stat: pipe(
                stat,
                O.filter((s) => statOptions.includes(s)),
              ),
              figure,
            })),
          ),
        ),
      );
    },
  );

  const _isPendingForPossibleOptionIdsAtom = atom(false);
  const isPendingForPossibleOptionIdsAtom = atom(
    (get) =>
      get(_aimTypeAtom) === "OPTIONS" &&
      get(_isPendingForPossibleOptionIdsAtom),
  );
  const completeLoadingPossibleOptionIdsAtom = atom(null, (get, set) => {
    set(_isPendingForPossibleOptionIdsAtom, false);
  });
  const loadPossibleOptionIds = (get: Getter, set: Setter) => {
    const aimType = get(_aimTypeAtom);
    if (aimType === "OPTIONS") {
      set(_isPendingForPossibleOptionIdsAtom, true);
    }
  };

  const inputStatusAtom = atom((get) => {
    const level = get(_levelAtom);
    const aimType = get(_aimTypeAtom);
    const resetMethods = get(_resetMethodsAtom);
    const cubePrices = get(_cubePricesAtom);
    const optionSets = get(_optionSetsAtom);

    return pipe(
      E.right(true as const),
      E.filterOrElse(
        () => E.isRight(level.value),
        () => "장비 레벨을 정확히 입력해주세요.",
      ),
      E.filterOrElse(
        () => resetMethods.length > 0,
        () => "재설정 수단을 하나 이상 선택해주세요.",
      ),
      E.filterOrElse(
        () => values(cubePrices).every(({ price }) => E.isRight(price.value)),
        () => "큐브 가격을 정확히 입력해주세요.",
      ),
      E.filterOrElse(
        () => aimType === "GRADE_UP" || optionSets.length > 0,
        () => "옵션 세트를 하나 이상 입력해주세요.",
      ),
      E.filterOrElse(
        () =>
          aimType === "GRADE_UP" ||
          !optionSets.every(
            A.every(
              ({ stat, figure }) =>
                // 입력값이 비정상인 경우
                O.isNone(stat) ||
                E.isLeft(figure.value) ||
                figure.value.right === 0,
            ),
          ),
        () => "옵션 세트를 정확히 입력해주세요.",
      ),
    );
  });

  type Result = {
    method: Potential.ResetMethod;
    prob: number;
    ceil?: number;
    optionResults?: {
      options: { name: string }[];
      prob: number;
    }[];
  }[];
  const resultAtom = atom<Result>([]);
  const resultStateAtom = atom<"idle" | "pending" | "success" | "failure">(
    "idle",
  );

  return {
    equipAtom,
    levelAtom,
    gradeAtom,
    aimTypeAtom,
    typeAtom,
    resetMethodsAtom,
    addResetMethodAtom,
    removeResetMethodAtom,
    cubePricesAtom,
    cubePriceSettingModalOpen,
    setCubePriceAtom,
    optionSetFormAtom,
    optionSetsAtom,
    addOptionSetAtom,
    editOptionAtom,
    removeOptionSetAtom,
    adjustOptionSetsAtom,
    isPendingForPossibleOptionIdsAtom,
    completeLoadingPossibleOptionIdsAtom,
    inputStatusAtom,
    resultAtom,
    resultStateAtom,
  };
}) satisfies MoleculeConstructor<unknown>;

export const PotentialCalcMolecule = molecule(potentialCalcMoleculeConstructor);

export type PotentialCalcMoleculeStructure = ReturnType<
  typeof potentialCalcMoleculeConstructor
>;
