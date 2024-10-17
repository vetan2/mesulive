"use server";

import { flow, pipe } from "fp-ts/lib/function";

import { type Equip } from "~/entities/equip";
import { Potential } from "~/entities/potential";
import { E, TE } from "~/shared/fp";
import {
  convertAllNullToUndefined,
  taskEitherToPromise,
} from "~/shared/function";
import { prisma } from "~/shared/prisma";

import { findPotentialOptionTable } from "./serverLogics";

export const getPotentialGradeUpRecord = (params: {
  method: Potential.ResetMethod;
  grade: Potential.Grade;
}) =>
  pipe(
    TE.tryCatch(
      () =>
        prisma.potentialGradeUpRecord
          .findFirstOrThrow({
            where: {
              method: params.method,
              currentGrade: params.grade,
            },
            select: {
              ceil: true,
              probability: true,
            },
          })
          .then(convertAllNullToUndefined),
      E.toError,
    ),
    taskEitherToPromise,
  );

export const getPotentialOptionTable = (params: {
  method: Potential.ResetMethod;
  equip: Equip;
  level: number;
  grade: Potential.Grade;
}) =>
  pipe(
    TE.Do,
    TE.apS(
      "params",
      pipe(
        TE.Do,
        TE.apS(
          "level",
          TE.fromOption(() => new Error("invalid level"))(
            Potential.flattenLevel(params.level),
          ),
        ),
        TE.map(({ level }) => ({
          equip: params.equip,
          level,
          method:
            params.method === "ADDI"
              ? ("ADDI_POTENTIAL" satisfies Potential.ResetMethod)
              : params.method,
          grade: params.grade,
        })),
      ),
    ),
    TE.bind(
      "optionGrade",
      flow(
        TE.tryCatchK(
          ({ params }) =>
            prisma.potentialOptionGradeRecord
              .findMany({
                where: { grade: params.grade, method: params.method },
                select: {
                  currentGradeProb: true,
                  lowerGradeProb: true,
                  line: true,
                },
              })
              .then((records) =>
                records
                  .toSorted((a, b) => a.line - b.line)
                  .map((record) => record),
              ),
          E.toError,
        ),
        TE.filterOrElse(
          (record) =>
            record.length === 3 &&
            [1, 2, 3].every((l) => record.some((r) => r.line === l)),
          () =>
            new Error(
              "getPotentialOptionTable: 옵션 등급 설정 확률의 행 개수가 3개가 아님",
            ),
        ),
      ),
    ),
    TE.bind("currentGradeOptions", ({ params }) =>
      findPotentialOptionTable({
        equip: params.equip,
        level: params.level,
        optionGrade: params.grade,
        method: params.method,
      }),
    ),
    TE.bind("lowerGradeOptions", ({ params }) =>
      findPotentialOptionTable({
        equip: params.equip,
        level: params.level,
        optionGrade:
          Potential.optionGrades[
            Potential.optionGrades.indexOf(params.grade) - 1
          ],
        method: params.method,
      }),
    ),
    TE.map(({ currentGradeOptions, lowerGradeOptions, optionGrade }) =>
      optionGrade.map(({ currentGradeProb, lowerGradeProb }) => [
        ...(lowerGradeProb
          ? lowerGradeOptions.map((option) => ({
              ...option,
              probability: option.probability * lowerGradeProb,
            }))
          : []),
        ...currentGradeOptions.map((option) => ({
          ...option,
          probability: option.probability * currentGradeProb,
        })),
      ]),
    ),
    TE.map(convertAllNullToUndefined),
    taskEitherToPromise,
  );
