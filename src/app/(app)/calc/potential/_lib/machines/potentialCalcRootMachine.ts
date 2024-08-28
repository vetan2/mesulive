import { identity, pipe } from "fp-ts/lib/function";
import { assign, fromPromise, sendTo, setup } from "xstate";

import { type Potential } from "~/entities/potential";
import {
  getPotentialGradeUpRecord,
  getPotentialOptionIdNameMap,
  getPotentialOptionTable,
} from "~/features/get-potential-data/actions";
import { A, E } from "~/shared/fp";

import { potentialInputMachine } from "./potentialInputMachine";
import {
  type PotentialCalcRootContext,
  type PotentialCalcRootEvent,
} from "./types";

export const potentialCalcRootMachine = setup({
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
  /** @xstate-layout N4IgpgJg5mDOIC5QAcD2AXMA7dBLAhgDYDCRAxgEqoYB0uEhYAxAGICiAKsQBID6A4hQCCAETa8AqgAVeFNsQDyFEQGUA2gAYAuohSpYuPKiy6QAD0QAWAEwAaEAE9E1gMyWalgBzXPngKzWli4aAGwA7ACMLgC+0fZomDgEJORUtPSMrJw8AsJikjJyisrqETpIIGgGRiYVFgiWATRhfhoaEZF+AJwuLl12joguHTRdodZdlpPhISGx8RjYeESkhJTU6HQMzOxcfApSHACSCgByvBxCAEIAMmzq2qZVhrjGpvUhGjRuLi1+bp4wl0-CDLPYnAgIp4XKNvL5oZYwhowpZkfNKoskitUhstpldjkDsczhdrndSuU9NVXrVQPVGtZmq12p0en0BhCOu5GsNEV0wi5fFDLOiEktkqt1rQAGZgdBkAAWuCwUH4ACd8BAwBJkBQwGRUGqILAmBBjGA6FgAG6oADWFrFWJSazSm1l8qVKvVmu1uv1huNCGVNrI+Bqmi0Eae+hebzqiG6YWaGl5nnaAUsIU84OcgVG-wili8IS6gKmosxy2dUrdcsVyqgCmQNQ4+AARowTWasBbg3aHZWJTiZXXPY3mzTWx24EHrahQ+HtFGKs8au9ECFrIy+qFM0iNJ5ZjmEJ4Ih4uhf+Z4uiWxmFrLE4iAsKgtfAV4PsS6NtHqXG6YgAC0ITHsBFaJFWkquniYC-rGtLmIgER+Em16hIK1jptYYT+MePhdLCPjeFEYyfB04Hil+NY0O69ZehqWo6nqBpGu+VLweuJ5FjQ1hQmE-FBBorSbnhh40L4PjdH4NieKicxPo6kHDrWHoNk2Lbtp2cFrvGXHuLxgICcEwkckhmHJsMIITP0EQ9A+j5AA */
  id: "potentialCalcRoot",
  context: ({ spawn, self }) => ({
    results: new Map(),
    inputActorRef: spawn("inputActor", {
      input: { rootActorRef: self },
    }),
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
            results: () => {
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
              level: pipe(
                level.value,
                E.match(() => -1, identity),
              ),
              resetMethods,
            }),
          ),
        onDone: {
          target: "idle",
          actions: assign({
            results: () => {
              // TODO 계산로직
              return new Map();
            },
          }),
        },
      },
    },
  },
});

export type PotentialCalcMachine = typeof potentialCalcRootMachine;
