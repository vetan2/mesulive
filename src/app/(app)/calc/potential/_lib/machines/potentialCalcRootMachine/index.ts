import { pipe } from "fp-ts/lib/function";
import { assign, fromPromise, sendTo, setup } from "xstate";

import { potentialInputMachine } from "~/app/(app)/calc/potential/_lib/machines/potentialInputMachine";
import { type Potential } from "~/entities/potential";
import {
  getPotentialGradeUpRecord,
  getPotentialOptionIdNameMap,
  getPotentialOptionTable,
} from "~/features/get-potential-data/actions";
import { A } from "~/shared/fp";

import {
  type PotentialCalcRootContext,
  type PotentialCalcRootEvent,
} from "./types";

export const potentialCalcMachine = setup({
  types: {
    context: {} as PotentialCalcRootContext,
    events: {} as PotentialCalcRootEvent,
  },
  actions: {
    resetResults: assign({ results: () => new Map() }),
  },
  guards: {
    hasResults: ({ context: { results } }) => !!results,
  },
  actors: {
    inputActor: potentialInputMachine,
    fetchGradeUpRecords: fromPromise<
      Map<
        Potential.ResetMethod,
        Awaited<ReturnType<typeof getPotentialGradeUpRecord>>
      >,
      { resetMethods: Potential.ResetMethod[]; currentGrade: Potential.Grade }
    >(async ({ input: { resetMethods, currentGrade } }) => {
      return new Map(
        await Promise.all(
          resetMethods.map((method) =>
            getPotentialGradeUpRecord({ method, currentGrade }).then(
              (record) => [method, record] as const,
            ),
          ),
        ),
      );
    }),
    fetchOptionTables: fromPromise(
      async ({
        input: { equip, grade, level, resetMethods },
      }: {
        input: Omit<Parameters<typeof getPotentialOptionTable>[0], "method"> & {
          resetMethods: Potential.ResetMethod[];
        };
      }) => {
        const tableMap = new Map(
          await Promise.all(
            resetMethods.map((method) =>
              getPotentialOptionTable({
                method,
                equip,
                level,
                grade,
              }).then((table) => [method, table] as const),
            ),
          ),
        );

        const optionIds = pipe(
          Array.from(tableMap.values()),
          A.flatMap(A.flatMap(A.map(({ optionId }) => optionId))),
        );

        const optionIdNameMap = await getPotentialOptionIdNameMap({
          optionIds,
        });

        return { tableMap, optionIdNameMap };
      },
    ),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QAcD2AXMA7dBLAhgDYDCRAxgEqoYB0uEhYAxAGICiAKsQBID6A4hQCCAETa8AqgAVeFNsQDyFEQGUA2gAYAuohSpYuPKiy6QAD0QAWAEwAaEAE9E1gMyWalgBzXvLgOwAjNaWli4BAL7h9miYOAQk5FS09IysnDwCwmKSMnKKyuoBOkggaAZGJiUWCJYArNY0frUaGnUAbBq1lgCctbX2TghhfjTdGm3WzZ5jAX7d3ZHRGNh4RKSElNTodAzM7Fx8ClIcAJIKAHK8HEIAQgAybOrapmWGuMam1R00bv7dni5-m1at5LANEAEAaNvL5PBNmhpJotSss4mtElsdql9hkjqcLldbg9CsU9OV3pVQNU6g0mi12p0en1wQhZu46mEXG1AXVam1PLVkTEVvF1ptaAAzMDoMgAC1wWCg-AATvgIGAJMgKGAyKhlRBYEwIMYwHQsAA3VAAa1NwrRCQ2SW2Upl8sVKrVGq1Or1BoQCstZHwFU0WlDL30bw+VUQtW6Iz8Ghc1ms3RTXW6LhcLJT7l6nImIR63W5QtRqwd4ud0rlCqgCmQFQ4+AARoxDcasKaA9bbeXRRjJTW3fXGxTm224P6LaggyHtOGSq8Kp9EBMGoDxp5PAEJnCvCydzQES0NGm-G1L-VIlEQFhUOr4Ev++jHVsI+To1TEABaNosv8aFPYCQJaPwy1iCsxSdLEwA-KNKXMCFahGaZxksRNMxcfpHGcaZoR8Vw+VcAUFlvO0oMHatXTrD11U1bVdX1J8yQQ1cEE8EIaGsSE6UwnoD1whAfDaGhtx8LNQVIsilkggc3yHGjFQbJtW3beCVxjDiuJ4zw+LPATPBZIINEaJMgj5IILxQsjIiAA */
  id: "potentialCalcRoot",
  /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOlwgBswBiAZQFEAVAfXoEUBVASQAUBtAAwBdRKAAOAe1i4ALrgn5RIAB6IAjADYAzCQ0C1AVg0AmY2sMB2NcYA0IAJ7qDxgBwkAnBpcWtLrRYsDF3cDAF9QuzQsPEJScio6JmYAGXoANXpkwREkEElpOQUlVQRNHT1DEzNLaztHUoAWAQ0SI2MDNQDnYwsvcMiMHAJiMkoaBhYAcQAlAEEAEXpspXzZeUVckrLdfTbqgytbB3VXBpJKwwMBAU9gi36QKKHY0YSJ5lmuAFlmRgBNHhLYQrKRrIqbJzlDRNNo3Ay+DRqOrqTRqEgWBrudxaBq+XG9e4RR6DGIjeLjJL-QHLXKrQobUBbbQ7SqmcwHWrHUoCLTuEg4rQaCwuUzuDEdB5PUlxMbUBbzZjTejvL5MAASAHl5jTxKD6cUTm4-AZ3A1tGoBGaLEd6u5NB5-A0DnoGrjjA1JSThjKEkqvhqMorlUlVYxNdrgbS9esDaU1Dobo73AIgtYNCZkQgLKbWlprIKxXa1GLPdFva8KSwAMIcABC9GYPGmXCrQJyuoKMYhjQMJFMGg5vOLWMFmaFxnO7X02nhLmaLlLzzJsvlzA1PEYXA1ADkg1WNdN5rQdXlo+DGScBPyhZ1sz1gkLMwZMei1N4KljOgdF9KK9R6PMXAsOum47nuB4Ru2p6dueKgnGcA4mA0nQwmoDTGO4mboRY-LWFcTSus+yEekSUrluS1B+gGDYgVuu5Kvuh4nnSXYXtyfKYmYLjQuhxrYpmWiWh4zTusKwR2q4P7kbKSrvLRYEMRBtAfNMcx-MxZ4MnBCAuGc1iYliAgYsmc42uoIokAZn4+M4LhoVJLwUQAYkwVZqswMwLA2HA8OBh7HpGHZglpJToZm8ZoliUUHLiiJaGEpFeo5souYwbkeXMizMD5flHnwahQSxsGhc46JXNcGGuCmdnhemHHuiEwrXE0xgaA5y4JKl6XybujCzLWqQBYVmmxno-L4h06aIi4M0NJmdmWVFWKBMWTqIu1Po0F17k9b8-WDflw0wSFiBOhOgTXAIlVzqm4XOL2YpvvF1r6NxJEDGWLwAGZgDIzxQJMABO6AQGAHBiNMYCYBIgMQLA1AQAoYBkPgABuEgANbI2R32-f9QMg2DENQzDcMIAQ6OYOg9LZBpx2xiaOEWDylSYrp0JmaUzqWVYfidOYLjPglH1LqQP1-TEUAamI9KMOgABGVDw4jhAo+jWMkDjIzi-90uywrSvk2jEhUzTwh08Fo2mPyyYmhopquFcGjhbiCZvsznh5to3HhES+ASKD8C5FrRAgvT3YALTO1yUckJd8cJ9chIi7+5Jh5b3bFr2SaeHoz4YemtVGPyxkmhVyamBtJA65LBOg+DkPQ7DQdBfq3a6WcXHWgX2FaLVWgJgIIpWF4s7oVXNcEFLMvrHLitwOnbdsR3fbu6KHM+C7wStAYziuvF1ydAuvtAA */
  context: ({ spawn, self }) => ({
    results: new Map(),
    inputActorRef: spawn("inputActor", { input: { rootMachineId: self.id } }),
  }),
  initial: "idle",
  states: {
    idle: {
      entry: [
        sendTo(({ context }) => context.inputActorRef, { type: "UNLOCK" }),
      ],
      on: {
        FETCH_GRADE_UP_RECORDS: [
          {
            guard: "hasResults",
            target: "idle",
          },
          {
            target: "fetchingGradeUpRecords",
            actions: [
              sendTo(({ context }) => context.inputActorRef, { type: "LOCK" }),
            ],
          },
        ],
        FETCH_OPTION_TABLES: [
          {
            guard: "hasResults",
            target: "idle",
          },
          {
            target: "fetchingOptionTables",
          },
        ],
      },
    },
    fetchingGradeUpRecords: {
      tags: ["fetching"],
      entry: [sendTo(({ context }) => context.inputActorRef, { type: "LOCK" })],
      invoke: {
        src: "fetchGradeUpRecords",
        input: ({ context: { inputActorRef } }) =>
          pipe(
            inputActorRef.getSnapshot().context,
            ({ grade, resetMethods }) => ({
              currentGrade: grade,
              resetMethods,
            }),
          ),
        onDone: {
          target: "idle",
          actions: assign({
            results: ({ event: { output } }) => {
              // TODO 계산로직
              return new Map();
            },
          }),
        },
      },
    },
    fetchingOptionTables: {
      tags: ["fetching"],
      entry: [sendTo(({ context }) => context.inputActorRef, { type: "LOCK" })],
      invoke: {
        src: "fetchOptionTables",
        input: ({ context: { inputActorRef } }) =>
          pipe(
            inputActorRef.getSnapshot().context,
            ({ equip, grade, level, resetMethods }) => ({
              grade,
              equip,
              level,
              resetMethods,
            }),
          ),
        onDone: {
          target: "idle",
          actions: assign({
            results: ({ event: { output } }) => {
              // TODO 계산로직
              return new Map();
            },
          }),
        },
      },
    },
  },
});

export type PotentialCalcMachine = typeof potentialCalcMachine;
