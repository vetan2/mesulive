"use client";

import { molecule, type MoleculeConstructor } from "bunshi";
import { pipe } from "fp-ts/lib/function";
import { sign } from "fp-ts/lib/Ordering";
import { produce } from "immer";
import { type Getter, type Setter, atom } from "jotai";
import { atomWithReset, atomWithStorage, RESET } from "jotai/utils";
import { z } from "zod";

import { equipSchema, equips, type Equip } from "~/entities/equip";
import { currencyUnitSchema, type CurrencyUnit } from "~/entities/game";
import { Potential } from "~/entities/potential";
import { E, O } from "~/shared/fp";
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
      const nextValue = pipe(
        input,
        parseZod(Potential.aimTypeSchema),
        E.getOrElse(() => get(_aimTypeAtom)),
      );
      set(_aimTypeAtom, nextValue);
      if (nextValue !== "GRADE_UP") {
        set(isMiracleTimeAtom, false);
      }

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
  const resetMethodsAtom = atom((get) =>
    get(_resetMethodsAtom).toSorted((a, b) =>
      sign(
        Potential.resetMethods.indexOf(a) - Potential.resetMethods.indexOf(b),
      ),
    ),
  );
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

  const isMiracleTimeAtom = atom(false);

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

  const createNewOptionSet = (): Potential.OptionSetForm[number] =>
    Array.from({ length: 3 }).map(() => ({
      stat: O.none,
      figure: { input: "", value: E.right(0) },
    }));
  const _optionSetsAtom = atomWithReset<Potential.OptionSetForm>([
    createNewOptionSet(),
  ]);
  const optionSetFormAtom = atom(
    (get) => get(_optionSetsAtom),
    (get, set, reset: typeof RESET) => {
      set(_optionSetsAtom, reset);
    },
  );

  const refinedOptionSetFormAtom = atom(
    (get) => Potential.refineOptionSetForm(get(_optionSetsAtom)),
    (get, set, reset: typeof RESET) => {
      set(_optionSetsAtom, reset);
    },
  );

  const isOptionSetFormValidAtom = atom(
    (get) => get(refinedOptionSetFormAtom).length > 0,
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

  const possibleOptionIdsAtom = atom<Potential.PossibleStat[]>([]);

  type OptionPreset = {
    optionSets: Potential.OptionSetForm;
    name: string; // KEY
  };
  const optionPresetsAtom = atomWithStorage<OptionPreset[]>(
    "optionPresets",
    [],
    undefined,
    { getOnInit: true },
  );

  const currentOptionPresetAtom = atomWithReset<OptionPreset | null>(null);

  const addOptionPresetAtom = atom(null, (get, set, preset: OptionPreset) => {
    set(optionPresetsAtom, (prev) => {
      const index = prev.findIndex((p) => p.name === preset.name);
      if (index !== -1) return prev;

      return [...prev, preset];
    });
  });

  const editOptionPresetAtom = atom(
    null,
    (get, set, name: string, preset: OptionPreset) => {
      set(optionPresetsAtom, (prev) => {
        const index = prev.findIndex((p) => p.name === name);
        if (index === -1) return prev;

        return produce(prev, (draft) => {
          draft[index] = preset;
        });
      });

      const currentOptionPreset = get(currentOptionPresetAtom);
      if (currentOptionPreset?.name === name) {
        set(currentOptionPresetAtom, preset);
      }
    },
  );

  const removeOptionPresetAtom = atom(null, (get, set, name: string) => {
    set(optionPresetsAtom, (prev) =>
      prev.filter((preset) => preset.name !== name),
    );

    if (get(currentOptionPresetAtom)?.name === name) {
      set(currentOptionPresetAtom, RESET);
    }
  });

  const applyOptionPresetAtom = atom(null, (get, set, name: string) => {
    const preset = get(optionPresetsAtom).find((p) => p.name === name);
    if (!preset) return;

    set(_optionSetsAtom, preset.optionSets);
    set(currentOptionPresetAtom, preset);
  });

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
          Potential.isOptionSetFormValid(get(possibleOptionIdsAtom))(
            optionSets,
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
    isMiracleTimeAtom,
    cubePricesAtom,
    cubePriceSettingModalOpen,
    setCubePriceAtom,
    optionSetFormAtom,
    refinedOptionSetFormAtom,
    isOptionSetFormValidAtom,
    addOptionSetAtom,
    editOptionAtom,
    removeOptionSetAtom,
    possibleOptionIdsAtom,
    optionPresetsAtom,
    currentOptionPresetAtom,
    addOptionPresetAtom,
    editOptionPresetAtom,
    removeOptionPresetAtom,
    applyOptionPresetAtom,
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
