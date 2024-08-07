import { assign, setup, sendTo } from "xstate";

import { equips, type Equip } from "~/entities/equip";
import { type CurrencyUnit } from "~/entities/game";
import { Potential } from "~/entities/potential";
import { type ArrayElement } from "~/shared/types";

import { type PotentialCalcRootEvent } from "./potentialCalcRootMachine/types";

export type PotentialInputContext = {
  equip: Equip;
  level: number;
  grade: Potential.Grade;
  aimType: Potential.AimType;
  type: Potential.Type;
  resetMethods: Potential.ResetMethod[];
  cubePrices: Record<Potential.Cube, { price: number; unit: CurrencyUnit }>;
  optionRecordsArray: { stat?: Potential.PossibleStat; figure: number }[][];
  rootMachineId: string;
};

type PotentialInputEvent =
  | { type: "SET_EQUIP"; equip: Equip }
  | { type: "SET_LEVEL"; level: number }
  | { type: "SET_GRADE"; grade: Potential.Grade }
  | { type: "SET_AIM_TYPE"; aimType: Potential.AimType }
  | { type: "SET_TYPE"; potentialType: Potential.Type }
  | {
      type: "ADD_RESET_METHOD";
      resetMethod: ArrayElement<PotentialInputContext["resetMethods"]>;
    }
  | {
      type: "REMOVE_RESET_METHOD";
      resetMethod: ArrayElement<PotentialInputContext["resetMethods"]>;
    }
  | {
      type: "SET_CUBE_PRICE";
      cube: Potential.Cube;
      price?: number;
      unit?: CurrencyUnit;
    }
  | { type: "ADD_OPTION_RECORDS" }
  | {
      type: "EDIT_OPTION_RECORD";
      index: number;
      recordIndex: number;
      stat?: Potential.PossibleStat;
      figure?: number;
    }
  | { type: "REMOVE_OPTION_RECORD"; index: number }
  | { type: "RESET_OPTION_RECORDS_ARRAY" }
  | { type: "LOCK" }
  | { type: "UNLOCK" };

export const potentialInputMachine = setup({
  types: {
    context: {} as PotentialInputContext,
    events: {} as PotentialInputEvent,
    input: {} as { rootMachineId: string },
  },
  actions: {
    resetResults: sendTo(({ context }) => context.rootMachineId, {
      type: "RESET_RESULTS",
    } satisfies PotentialCalcRootEvent),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QAcD2AXMA7dBLAhgDYCSWyArugHS4SFgDEAMgPIDCA0gNoAMAuohSpYuPKiyCQAD0QBmACwAOKvICc6gOzz5ANg0aesgIwaANCACeiIwFYdAJiqqbinj0V35PVTp0BfP3M0TBwCEjJKGjpGAGUAUQAVAH04gEUAVWIABV4BJBA0ETEJfJkEI3sjFQ0dO3see3lZZvtZcyty+XsNJx1FWXVZRS9+xQCgjGw8IlIKalp6BnjkpjiANTimXMlC0VxxSTKKqvkauoamlrbLa1keGyo6o1VGxu9Fe3GCydCZiPnoktEkkAOIAJQAggAROLbfK7YqHayVaq1BwXZqyVrtaxGfpUWw2VQeXTyIwVGxfYJTMKzSILWLAiHEACySQSAE0srD+DthHsDqVcVUbANDDpdEYeBUdDjyjwdDwqFpVPoPDwyfYdKoqT9puE5lFFst2VyeXkhEV9iVQEcUac0fVGpjsTcEKohlQFLIbBpbNojGT5LqQvq6QDFtCoUkwXETSzEgAJFhQuGWgU26SIRQ6ZVSj2VGzyGzkjVyxS2JyyDSyCUuMk2X0hml-Q0MhixlksDYxuPAhMJZOp3nw-mIoUIAy9RRaEs6Ywz+yKOXa2SPYw8LTND21z6Bb6h2n-I2M5JsdIAITiSSyYOIbHNfKtgtt1kMBOlja8ZMVRaMct9KoKiUPRqw9GwFWbX4DXpQEoySFgsgSYgWAAOV7NgWDBKEYjTb5n0zMoNGUV4TAcDR1HnIxrg6bRlD9HNFTJD0JQ0KCw2Pds4ihYhkkQ5C0IwrDhwtfCMyRBAPnXClbGMF4FRouQtS9YDRWLD0KM3dijzbQFO27a9+JQ9DY0w7C8IRa0JL0L09BMFwNT9Yj7Dleo11UBVGglQYPWDfdqWg8MTw7Ps+KQ4yhOwmIkghMFIQ5CyxysicuioNx0oyjLA3LE51E0RQfHUTc9wmQ9W0iQhUAAYwAa0gBh0lQ1hOESgiJIUZQ1E0bQ9AMYwzDdWwKhUBzVDUGx7A0ykviwVAIDgPkypg9An3EicAFoHjy7aduJWU3XW-x-L1HTYPoVbx1fcpRSoRo8r6bRvQUOVCQeatTg0SbqJrLRtPK6hKtqyALuSq7TnkKgHAghoKxYyoXsbHoZw+r7q3egIAiAA */
  id: "potentialInput",
  context: ({ input }) => ({
    equip: equips[0],
    level: 100,
    grade: Potential.grades[0],
    aimType: "OPTIONS",
    type: "COMMON",
    resetMethods: [],
    cubePrices: Potential.cubes.reduce(
      (acc, cube) => ({
        ...acc,
        [cube]: {
          unit: "meso",
          price: 0,
        } satisfies PotentialInputContext["cubePrices"][Potential.Cube],
      }),
      {} as PotentialInputContext["cubePrices"],
    ),
    optionRecordsArray: [],
    rootMachineId: input.rootMachineId,
  }),
  initial: "idle",
  states: {
    idle: {
      on: {
        LOCK: {
          target: "locked",
        },
        SET_EQUIP: {
          actions: [
            assign({
              equip: ({ event: { equip } }) => equip,
              optionRecordsArray: [],
            }),
            "resetResults",
          ],
        },
        SET_LEVEL: {
          actions: [
            assign({
              level: ({ event: { level } }) => level,
            }),
            "resetResults",
          ],
        },
        SET_GRADE: {
          actions: [
            assign({
              grade: ({ event: { grade } }) => grade,
              resetMethods: ({ event: { grade }, context: { resetMethods } }) =>
                resetMethods.filter((method) =>
                  Potential.gradesEnableToReset[method].includes(grade),
                ),
            }),
            "resetResults",
          ],
        },
        SET_AIM_TYPE: {
          actions: [
            assign({
              aimType: ({ event: { aimType } }) => aimType,
            }),
            "resetResults",
          ],
        },
        SET_TYPE: {
          actions: [
            assign({
              type: ({ event: { potentialType } }) => potentialType,
            }),
            "resetResults",
          ],
        },
        ADD_RESET_METHOD: {
          actions: [
            assign({
              resetMethods: ({
                event: { resetMethod },
                context: { resetMethods },
              }) =>
                resetMethods
                  .filter((method) => method !== resetMethod)
                  .concat(resetMethod),
            }),
            "resetResults",
          ],
        },
        REMOVE_RESET_METHOD: {
          actions: [
            assign({
              resetMethods: ({
                event: { resetMethod },
                context: { resetMethods },
              }) => resetMethods.filter((method) => method !== resetMethod),
            }),
            "resetResults",
          ],
        },
        SET_CUBE_PRICE: {
          actions: [
            assign({
              cubePrices: ({
                event: { cube, price, unit },
                context: { cubePrices },
              }) => ({
                ...cubePrices,
                [cube]: {
                  price: price ?? cubePrices[cube].price,
                  unit: unit ?? cubePrices[cube].unit,
                },
              }),
            }),
            "resetResults",
          ],
        },
        ADD_OPTION_RECORDS: {
          actions: [
            assign({
              optionRecordsArray: ({ context: { optionRecordsArray } }) => [
                ...optionRecordsArray,
                [],
              ],
            }),
            "resetResults",
          ],
        },
        EDIT_OPTION_RECORD: {
          actions: [
            assign({
              optionRecordsArray: ({
                event: { index, recordIndex, stat, figure },
                context: { optionRecordsArray },
              }) => {
                const newOptionRecordsArray = [...optionRecordsArray];
                newOptionRecordsArray[index][recordIndex] = {
                  stat,
                  figure:
                    figure ??
                    (stat != null
                      ? optionRecordsArray[index][recordIndex].figure
                      : 0),
                };
                return newOptionRecordsArray;
              },
            }),
            "resetResults",
          ],
        },
        REMOVE_OPTION_RECORD: {
          actions: [
            assign({
              optionRecordsArray: ({
                event: { index },
                context: { optionRecordsArray },
              }) => optionRecordsArray.filter((_, i) => i !== index),
            }),
            "resetResults",
          ],
        },
        RESET_OPTION_RECORDS_ARRAY: {
          actions: [
            assign({
              optionRecordsArray: () => [],
            }),
            "resetResults",
          ],
        },
      },
    },
    locked: {
      on: {
        UNLOCK: {
          target: "idle",
        },
      },
    },
  },
});
