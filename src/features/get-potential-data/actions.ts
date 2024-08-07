"use server";

import { pipe } from "fp-ts/lib/function";
import { type Option } from "fp-ts/lib/Option";
import { type TaskEither } from "fp-ts/lib/TaskEither";

import { type Equip } from "~/entities/equip";
import { Potential } from "~/entities/potential";
import { O, TE } from "~/shared/fp";
import { taskEitherToPromise } from "~/shared/function";

import {
  resetDatabaseIfGameVersionAhead,
  fetchOptionData,
  createPotentialOptionTable,
  findOptionTable,
  fetchGradeUpRecords,
  findGradeUpRecord,
  createGradeUpRecords,
  fetchOptionIdNameMap,
} from "./serverLogics";
import { type OptionIdNameMap, type GradeUpRecord } from "./types";

export const getPotentialOptionTable = (params: {
  method: Potential.ResetMethod;
  equip: Equip;
  level: number;
  grade: Potential.Grade;
}) =>
  pipe(
    TE.Do,
    TE.chainFirstW(() => resetDatabaseIfGameVersionAhead),
    TE.apS(
      "params",
      TE.right({
        ...params,
        level: Potential.flattenLevel(params.level),
        method:
          params.method === "ADDI"
            ? ("ADDI_POTENTIAL" satisfies Potential.ResetMethod)
            : params.method,
      }),
    ),
    TE.bind("fetchedTable", ({ params }) => findOptionTable(params)),
    TE.chain(({ fetchedTable, params }) =>
      pipe(
        fetchedTable,
        O.match(
          () =>
            pipe(
              fetchOptionData(params),
              TE.chain((table) =>
                createPotentialOptionTable({ ...params, optionTable: table }),
              ),
            ),
          (v) => TE.right(v),
        ),
      ),
    ),
    taskEitherToPromise,
  );

export const getPotentialOptionIdNameMap = (params: { optionIds: number[] }) =>
  pipe(
    TE.Do,
    TE.chainFirstW(() => resetDatabaseIfGameVersionAhead),
    TE.chain(() => fetchOptionIdNameMap(params)),
    TE.map((arr) =>
      arr.reduce(
        (acc, { id, name }) => ({
          ...acc,
          [id]: name satisfies OptionIdNameMap[number],
        }),
        {} as OptionIdNameMap,
      ),
    ),
    taskEitherToPromise,
  );

export const getPotentialGradeUpRecord = (params: {
  method: Potential.ResetMethod;
  currentGrade: Potential.Grade;
}) =>
  pipe(
    TE.Do,
    TE.chainFirstW(() => resetDatabaseIfGameVersionAhead),
    TE.bind(
      "fetchedRecord",
      (): TaskEither<Error, Option<GradeUpRecord | undefined>> =>
        Potential.gradesEnableToPromote[params.method].includes(
          params.currentGrade,
        )
          ? findGradeUpRecord(params)
          : TE.right(O.some(undefined)),
    ),
    TE.chainW(({ fetchedRecord }) =>
      pipe(
        fetchedRecord,
        TE.fromOption(() => undefined),
        TE.orElse(() =>
          pipe(
            fetchGradeUpRecords(params),
            TE.chainFirst((recordMap) =>
              createGradeUpRecords({ method: params.method, recordMap }),
            ),
            TE.map((recordMap) => recordMap.get(params.currentGrade)),
          ),
        ),
      ),
    ),
    taskEitherToPromise,
  );
