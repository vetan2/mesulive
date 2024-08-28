import { ord } from "fp-ts";
import { type Either } from "fp-ts/lib/Either";
import { flow, pipe } from "fp-ts/lib/function";
import { type Option } from "fp-ts/lib/Option";
import { match } from "ts-pattern";
import {
  assign,
  setup,
  sendTo,
  type AnyActorRef,
  fromPromise,
  stateIn,
  not,
} from "xstate";
import { z } from "zod";

import { equips, equipSchema, type Equip } from "~/entities/equip";
import { currencyUnitSchema, type CurrencyUnit } from "~/entities/game";
import { Potential } from "~/entities/potential";
import {
  type EffectiveStat,
  effectiveStatLabels,
  effectiveStatOptions,
} from "~/entities/stat";
import { getPotentialOptionTable } from "~/features/get-potential-data/actions";
import { A, E, O } from "~/shared/fp";
import { convertToNumber } from "~/shared/number";
import { values } from "~/shared/object";
import { type FormPayload } from "~/shared/react";
import { parseZod, parseZodWithErrorMessage } from "~/shared/zod";

import { type PotentialCalcRootEvent } from "./types";

export type PotentialInputContext = {
  equip: Equip;
  level: FormPayload<number>;
  grade: Potential.Grade;
  aimType: Potential.AimType;
  type: Potential.Type;
  resetMethods: Potential.ResetMethod[];
  cubePrices: Record<
    Potential.Cube,
    { price: FormPayload<number>; unit: CurrencyUnit }
  >;
  possibleStats: Partial<Record<EffectiveStat, string>>;
  shouldRefreshPossibleStats: boolean;
  optionRecordsArray: {
    stat: Option<Potential.PossibleStat>;
    figure: FormPayload<number>;
  }[][];

  inputStatus: Either<string, true>;
  triedCalculate: boolean;
  rootActorRef: AnyActorRef;
};

type PotentialInputEvent =
  | { type: "SET_EQUIP"; value: string }
  | { type: "SET_LEVEL"; value: string }
  | { type: "SET_GRADE"; value: string }
  | { type: "SET_AIM_TYPE"; value: string }
  | { type: "SET_TYPE"; value: string }
  | {
      type: "ADD_RESET_METHOD";
      value: string;
    }
  | {
      type: "REMOVE_RESET_METHOD";
      value: string;
    }
  | {
      type: "SET_CUBE_PRICE";
      cube: Potential.Cube;
      price?: string;
      unit?: string;
    }
  | { type: "FETCH_POSSIBLE_OPTION_IDS" }
  | { type: "RETRY" }
  | { type: "CANCEL" }
  | { type: "ADD_OPTION_RECORDS" }
  | {
      type: "EDIT_OPTION_RECORD";
      index: number;
      recordIndex: number;
      stat?: string | "NONE";
      figure?: string;
    }
  | { type: "REMOVE_OPTION_RECORDS"; index: number }
  | { type: "RESET_OPTION_RECORDS_ARRAY" }
  | { type: "TRY_CALCULATE" }
  | { type: "LOCK" }
  | { type: "UNLOCK" };

export const potentialInputMachine = setup({
  types: {
    context: {} as PotentialInputContext,
    events: {} as PotentialInputEvent,
    input: {} as { rootActorRef: AnyActorRef },
  },
  actions: {
    setEquip: assign(
      (
        { context: { equip } },
        {
          value,
        }: Omit<Extract<PotentialInputEvent, { type: "SET_EQUIP" }>, "type">,
      ) => ({
        equip: pipe(
          value,
          parseZod(equipSchema),
          E.getOrElse(() => equip),
        ),
      }),
    ),
    setLevel: assign({
      level: (
        _,
        {
          value,
        }: Omit<Extract<PotentialInputEvent, { type: "SET_LEVEL" }>, "type">,
      ) => ({
        input: value,
        value: pipe(
          convertToNumber(value),
          O.getOrElseW(() => null),
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
      }),
    }),
    setGrade: assign(
      (
        { context: { grade } },
        {
          value,
        }: Omit<Extract<PotentialInputEvent, { type: "SET_GRADE" }>, "type">,
      ) => ({
        grade: pipe(
          value,
          parseZod(Potential.gradeSchema),
          E.getOrElse(() => grade),
        ),
      }),
    ),
    setAimType: assign(
      (
        { context: { aimType } },
        {
          value,
        }: Omit<Extract<PotentialInputEvent, { type: "SET_AIM_TYPE" }>, "type">,
      ) => ({
        aimType: pipe(
          value,
          parseZod(Potential.aimTypeSchema),
          E.getOrElse(() => aimType),
        ),
      }),
    ),
    setType: assign(
      (
        { context: { type } },
        {
          value,
        }: Omit<Extract<PotentialInputEvent, { type: "SET_TYPE" }>, "type">,
      ) => ({
        type: pipe(
          value,
          parseZod(Potential.typeSchema),
          E.getOrElse(() => type),
        ),
      }),
    ),
    addResetMethod: assign({
      resetMethods: (
        { context: { resetMethods } },
        {
          value,
        }: Omit<
          Extract<PotentialInputEvent, { type: "ADD_RESET_METHOD" }>,
          "type"
        >,
      ) =>
        pipe(
          value,
          parseZod(Potential.resetMethodSchema),
          E.match(
            () => resetMethods,
            (method) => resetMethods.filter((m) => m !== method).concat(method),
          ),
        ),
    }),
    removeResetMethod: assign({
      resetMethods: (
        { context: { resetMethods } },
        {
          value,
        }: Omit<
          Extract<PotentialInputEvent, { type: "REMOVE_RESET_METHOD" }>,
          "type"
        >,
      ) => resetMethods.filter((method) => method !== value),
    }),
    setCubePrice: assign({
      cubePrices: (
        { context: { cubePrices } },
        {
          cube,
          price,
          unit,
        }: Omit<
          Extract<PotentialInputEvent, { type: "SET_CUBE_PRICE" }>,
          "type"
        >,
      ) => ({
        ...cubePrices,
        [cube]: {
          price: pipe(
            O.fromNullable(price),
            O.map((input) => ({
              input,
              value: pipe(
                input || 0,
                convertToNumber,
                O.getOrElseW(() => null),
                parseZodWithErrorMessage(
                  z.number({ message: "숫자을 입력해주세요." }).min(0, {
                    message: "0 이상의 숫자를 입력해주세요.",
                  }),
                ),
              ),
            })),
            O.getOrElse(() => cubePrices[cube].price),
          ),
          unit: pipe(
            O.fromNullable(unit),
            O.chainEitherK(parseZod(currencyUnitSchema)),
            O.getOrElse(() => cubePrices[cube].unit),
          ),
        } satisfies PotentialInputContext["cubePrices"][Potential.Cube],
      }),
    }),
    resetResults: sendTo(({ context }) => context.rootActorRef, {
      type: "RESET_RESULTS",
    } satisfies PotentialCalcRootEvent),
    adjustResetMethods: assign(
      ({ context: { grade, type, aimType, resetMethods } }) => ({
        resetMethods: resetMethods.filter((method) =>
          Potential.getIsResetMethodEnable({
            aimType,
            resetMethod: method,
            grade,
            type,
          }),
        ),
      }),
    ),
    addOptionRecords: assign({
      optionRecordsArray: ({ context: { optionRecordsArray } }) => [
        ...optionRecordsArray,
        Array.from({ length: 3 }).map(() => ({
          stat: O.none,
          figure: { input: "", value: E.right(0) },
        })),
      ],
    }),
    editOptionRecord: assign({
      optionRecordsArray: (
        { context: { optionRecordsArray } },
        {
          index,
          recordIndex,
          stat,
          figure,
        }: Omit<
          Extract<PotentialInputEvent, { type: "EDIT_OPTION_RECORD" }>,
          "type"
        >,
      ) => {
        const newOptionRecordsArray = structuredClone(optionRecordsArray);
        newOptionRecordsArray[index][recordIndex] = {
          stat: pipe(
            O.fromNullable(stat),
            O.chainEitherK(
              parseZod(z.enum([...Potential.possibleStats, "NONE"])),
            ),
            O.filter((s): s is Exclude<typeof s, "NONE"> => s !== "NONE"),
            O.match(
              () => newOptionRecordsArray[index][recordIndex].stat,
              O.some,
            ),
          ),
          figure: pipe(
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
            O.getOrElse(() => optionRecordsArray[index][recordIndex].figure),
          ),
        };
        return newOptionRecordsArray;
      },
    }),
    removeOptionRecords: assign({
      optionRecordsArray: (
        { context: { optionRecordsArray } },
        {
          index,
        }: Omit<
          Extract<PotentialInputEvent, { type: "REMOVE_OPTION_RECORDS" }>,
          "type"
        >,
      ) => optionRecordsArray.filter((_, i) => i !== index),
    }),
    resetOptionRecordsArray: assign({
      optionRecordsArray: [
        Array.from({ length: 3 }).map(() => ({
          stat: O.none,
          figure: { input: "", value: E.right(0) },
        })),
      ],
    }),
    adjustOptionRecordsArray: assign(
      ({ context: { optionRecordsArray, possibleStats } }) => ({
        optionRecordsArray: optionRecordsArray.map((optionRecords) =>
          optionRecords.map(({ stat, figure }) => ({
            stat: pipe(
              stat,
              O.filter((s) => possibleStats[s] != null),
            ),
            figure,
          })),
        ),
      }),
    ),
    resetShouldRefreshPossibleStats: assign({
      shouldRefreshPossibleStats: true,
    }),
    refreshCanCalculate: assign(
      ({
        context: {
          level,
          aimType,
          resetMethods,
          cubePrices,
          optionRecordsArray,
          possibleStats,
        },
      }) => ({
        inputStatus: pipe(
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
            () =>
              values(cubePrices).every(({ price }) => E.isRight(price.value)),
            () => "큐브 가격을 정확히 입력해주세요.",
          ),
          E.filterOrElse(
            () => aimType === "GRADE_UP" || optionRecordsArray.length > 0,
            () => "옵션 세트를 하나 이상 입력해주세요.",
          ),
          E.filterOrElse(
            () =>
              aimType === "GRADE_UP" ||
              !optionRecordsArray.every(
                A.every(({ stat, figure }) =>
                  // 입력값이 비정상인 경우
                  pipe(
                    stat,
                    O.filter((s) => possibleStats[s] != null),
                    O.match(
                      () => false,
                      () => true,
                    ),
                  )
                    ? E.isLeft(figure.value)
                    : true,
                ),
              ),
            () => "옵션 세트를 정확히 입력해주세요.",
          ),
        ),
      }),
    ),
  },
  actors: {
    getPossibleOptionIds: fromPromise(
      async ({
        input,
      }: {
        input: Omit<Parameters<typeof getPotentialOptionTable>[0], "method"> & {
          type: Potential.Type;
        };
      }) => {
        const optionTable = await getPotentialOptionTable({
          ...input,
          method: match(input.type)
            .returnType<Potential.ResetMethod>()
            .with("ADDI", () => "ADDI_POTENTIAL")
            .with("COMMON", () => "POTENTIAL")
            .exhaustive(),
        });

        const statLabelMap = new Map(
          optionTable.flatMap(
            flow(
              A.filterMap(({ stat }) => O.fromNullable(stat)),
              A.map((stat) => [stat, effectiveStatLabels[stat]] as const),
              A.sort(
                ord.fromCompare<readonly [Potential.PossibleStat, string]>(
                  ([statA], [statB]) =>
                    effectiveStatOptions.indexOf(statA) >
                    effectiveStatOptions.indexOf(statB)
                      ? 1
                      : -1,
                ),
              ),
            ),
          ),
        );

        return Object.fromEntries(statLabelMap);
      },
    ),
  },
  guards: {
    isUnlocked: not(stateIn("locked")),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QAcD2AXMA7dBLAhgDYCSWyArugMQDKAogCoD6dAigKrEAKA2gAwBdRClSxceVFmEgAHogDsARgBMAOgCcAVgDMi7coBsy9dvUAWTQBoQAT0SKzBs6uUAOFZoC+n62kw4CEjJKWkYmABk6ADU6cP4hJBA0MQkpRLkEJTUDV3lNPnkjE3MrW3ttM0VVXK8fJIxsPCJSCmp6ZgBxACUAQQAROnjpZPFcSWkMpT5VPk1HLRVii2s7BEVFExnFTSNa3waA5uC2sJ7iAFkmBgBNLkHBYdFR8fTEA3VXVUcawuNTZbKaz4Zmc2123n2-iaQVaoWYNzuQ0SI1SEwUigMqh0Hl+S1Kq1cWhc6hyeQh9ShgRaIX6fSYXTo7SY50YAAkAPJ9JEiFJjNKgDIGeTaVROPgGfRFf74hSOL7aMl1PyNKnHKgM87smL0xlhFkMDlch7Ip6o14IAyaeTVD4gzSLaUrN7KZx8XTKPYUlVHWFMgDC7AAQnQmFwusQ-fcEjznvzZG91NM3TipSUnQh8lVwUqDtDqdRaUx2VwGMR2QA5HV+9ldPo0bn1XkvAXo5xW9ySv5pwEK9QuRQ1cnKw4wkJ0PrEZjF0sVqs1o3RxuxtGZAfVIUbe1dgGrD2Y9weoe51WwjVakPTsuVhnV2sNlF8lfyN2qZ+6Tt49N6ZxmcWHnOUj6IQMkyl6zje840EwPRdL01z3qaj7mkKnzaNomglA63arCoR6AaO6CqLgECEGAVAAGKMH6rKhuyNA0MQgaREWJZXkwxB1ghTZxhkhJ9vIB6Wh6uSEooX4GAYVQDoqkLegRREkWR4Tsn6ADSXHLuaei5NUHjbMJAnqF+JifBJri-so8hWdZrh4XJ+YKaRVAMF01xMH6PThAG4Q9AwUaPNxK4qMCMzukJmgiUZgIDto0x6BsIKJYl2h2SODkAGZgOgADGAAWuBYFAXCiGIABGpHssgqTEBAsBUBAkhgERWAAG6oAA1k1w55scqiZTl+WFcVsBlRVVV8jVsAIAVbXZfgqTxBpZotggCrOJaRjhZF4pfgJVQmDJXppb1-V5QVRUlbg5VgJV1W1VQYAAE6Pagj2qMghDzelr0ALbvceQGEadg0XSNV1jXdU0zagc0LYIS1ISta2ijshiaAZhI7YCyjbM4yjKKYEVocT6GpT1rR9VlZ1DZd123RN91MmwnC8MaMbLfGq3yOtqNbYZWM4bkziY9msnHRTwPncNo03eNkiTXCTDdP0-kmoF5rIxtaMY4mBjGR6qimH+nrdSelCUwNUu0xDDN1UyZyXAiqvs4jnOa7z6MRfzevReoeQ2sbZNm0DVMg9L4Oy5DitOwjzZu9zKObZ720+7ufCGIbuv-mL5Pm+l+C4KREAMKg5Gh+HdNy1gCsMi58Fs0uHMZPkIoYQqfMi+mOMvvIBNaK4JNoSbAPyfnheQCXZcDRXNvy-dHnlpGcQNw+ce8eo-GCcnhlidjDjWg4gcAfZvWEDDnUQFQ7Dlspamxzx5Q6Qe9rb4SX6uB-qgYuZ6fWTZ3h1CwKgCAcBHj4XzAFTSK0AC0u8cJWhFKSMw8gPiKD4ImdGQdAaOTAJApu9gPQinUDjTGOtjK6BmK4fI7wkoghSsfcWedQ5WzBpXSGeDXYZGQV3dBmhDZGHMr3fGwisGjwLkXSe5draR1thwtebxtguC3jrOBiAcbINFL+UWR1c6ETPtlC+ciH5rHtEQhUL8yG+zQliKh4pzC0Pod4IAA */
  id: "potentialInput",
  entry: ["refreshCanCalculate"],
  context: ({ input }) => ({
    equip: equips[0],
    level: { input: "", value: E.left("레벨을 입력해주세요.") },
    grade: Potential.grades[0],
    aimType: "GRADE_UP",
    type: "COMMON",
    resetMethods: [],
    cubePrices: Potential.cubes.reduce(
      (acc, cube) => ({
        ...acc,
        [cube]: {
          unit: "meso",
          price: { input: "", value: E.right(0) },
        } satisfies PotentialInputContext["cubePrices"][Potential.Cube],
      }),
      {} as PotentialInputContext["cubePrices"],
    ),
    possibleStats: {},
    shouldRefreshPossibleStats: true,
    optionRecordsArray: [
      Array.from({ length: 3 }).map(() => ({
        stat: O.none,
        figure: { input: "", value: E.right(0) },
      })),
    ],

    inputStatus: E.right(true),
    triedCalculate: false,
    rootActorRef: input.rootActorRef,
  }),
  initial: "idle",
  on: {
    SET_EQUIP: {
      guard: "isUnlocked",
      actions: [
        { type: "setEquip", params: ({ event: { value } }) => ({ value }) },
        "resetResults",
        "resetShouldRefreshPossibleStats",
      ],
    },
    SET_LEVEL: {
      guard: "isUnlocked",
      actions: [
        { type: "setLevel", params: ({ event: { value } }) => ({ value }) },
        "resetResults",
        "refreshCanCalculate",
      ],
    },
    SET_GRADE: {
      guard: "isUnlocked",
      actions: [
        { type: "setGrade", params: ({ event: { value } }) => ({ value }) },
        "adjustResetMethods",
        "resetResults",
        "resetShouldRefreshPossibleStats",
      ],
    },
    SET_AIM_TYPE: {
      guard: "isUnlocked",
      actions: [
        {
          type: "setAimType",
          params: ({ event: { value } }) => ({ value }),
        },
        "adjustResetMethods",
        "resetResults",
        "refreshCanCalculate",
      ],
    },
    SET_TYPE: {
      guard: "isUnlocked",
      actions: [
        { type: "setType", params: ({ event: { value } }) => ({ value }) },
        "adjustResetMethods",
        "resetResults",
        "resetShouldRefreshPossibleStats",
        "refreshCanCalculate",
      ],
    },
    ADD_RESET_METHOD: {
      guard: "isUnlocked",
      actions: [
        {
          type: "addResetMethod",
          params: ({ event: { value } }) => ({ value }),
        },
        "adjustResetMethods",
        "resetResults",
        "refreshCanCalculate",
      ],
    },
    REMOVE_RESET_METHOD: {
      guard: "isUnlocked",
      actions: [
        {
          type: "removeResetMethod",
          params: ({ event: { value } }) => ({ value }),
        },
        "resetResults",
        "refreshCanCalculate",
      ],
    },
    SET_CUBE_PRICE: {
      guard: "isUnlocked",
      actions: [
        {
          type: "setCubePrice",
          params: ({ event }) => event,
        },
        "resetResults",
        "refreshCanCalculate",
      ],
    },
    ADD_OPTION_RECORDS: {
      actions: ["addOptionRecords", "resetResults", "refreshCanCalculate"],
    },
    EDIT_OPTION_RECORD: {
      actions: [
        { type: "editOptionRecord", params: ({ event }) => event },
        "resetResults",
        "refreshCanCalculate",
      ],
    },
    REMOVE_OPTION_RECORDS: {
      actions: [
        { type: "removeOptionRecords", params: ({ event }) => event },
        "resetResults",
        "refreshCanCalculate",
      ],
    },
    RESET_OPTION_RECORDS_ARRAY: {
      actions: ["resetResults", "refreshCanCalculate"],
    },
  },
  states: {
    idle: {
      on: {
        FETCH_POSSIBLE_OPTION_IDS: {
          target: "fetchingPossibleOptionIds",
        },
        LOCK: {
          target: "locked",
        },
        TRY_CALCULATE: {
          actions: [assign({ triedCalculate: true })],
        },
      },
    },

    fetchingPossibleOptionIds: {
      invoke: {
        src: "getPossibleOptionIds",
        input: ({ context: { equip, grade, type } }) => ({
          equip,
          grade,
          type,
          level: 200,
        }),
        onDone: {
          target: "idle",
          actions: [
            assign(({ event: { output } }) => ({
              possibleStats: output,
              shouldRefreshPossibleStats: false,
            })),
            "adjustOptionRecordsArray",
          ],
        },
        onError: "failedToFetchPossibleOptionIds",
      },
      on: {
        SET_EQUIP: {
          target: "idle",
        },
        SET_GRADE: {
          target: "idle",
        },
        SET_AIM_TYPE: {
          target: "idle",
        },
        SET_TYPE: {
          target: "idle",
        },
      },
    },

    failedToFetchPossibleOptionIds: {
      on: {
        RETRY: {
          target: "fetchingPossibleOptionIds",
        },
        CANCEL: {
          target: "idle",
        },
      },
    },

    // TODO 삭제
    locked: {
      on: {
        UNLOCK: {
          target: "idle",
        },
      },
    },
  },
});
