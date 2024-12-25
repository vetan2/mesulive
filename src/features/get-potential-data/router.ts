import { string } from "fp-ts";
import { flow, pipe } from "fp-ts/lib/function";
import { z } from "zod";

import { equipSchema } from "~/entities/equip";
import { Potential } from "~/entities/potential";
import {
  loggingProcedure,
  potentialProcedure,
  router,
} from "~/features/trpc/init";
import { A, E, TE } from "~/shared/fp";
import {
  convertAllNullToUndefined,
  taskEitherToPromise,
} from "~/shared/function";
import { lokiLogger } from "~/shared/loki";
import { keys } from "~/shared/object";
import { prisma } from "~/shared/prisma";

import { findPotentialOptionTable } from "./serverLogics";

export const potentialRouter = router({
  getOptionTable: potentialProcedure
    .input(
      z.object({
        method: Potential.resetMethodSchema,
        equip: equipSchema,
        level: z.number(),
        optionGrade: Potential.optionGradeSchema,
      }),
    )
    .query(({ input }) =>
      pipe(
        TE.Do,
        TE.apS(
          "params",
          pipe(
            TE.Do,
            TE.apS(
              "level",
              TE.fromOption(() => new Error("invalid level"))(
                Potential.flattenLevel(input.level),
              ),
            ),
            TE.map(({ level }) => ({
              equip: input.equip,
              level,
              method:
                input.method === "ADDI"
                  ? ("ADDI_POTENTIAL" satisfies Potential.ResetMethod)
                  : input.method,
              optionGrade: input.optionGrade,
            })),
          ),
        ),
        TE.chain(({ params }) =>
          findPotentialOptionTable({
            equip: params.equip,
            level: params.level,
            optionGrade: params.optionGrade,
            method: params.method,
          }),
        ),
        taskEitherToPromise,
      ),
    ),
  getOptionGrade: potentialProcedure
    .input(
      z.object({
        grade: Potential.gradeSchema,
        method: Potential.resetMethodSchema,
      }),
    )
    .query(({ input }) =>
      prisma.potentialOptionGradeRecord
        .findMany({
          where: { grade: input.grade, method: input.method },
          select: {
            currentGradeProb: true,
            lowerGradeProb: true,
            line: true,
          },
        })
        .then((record) => {
          if (
            record.length === 3 &&
            [1, 2, 3].every((l) => record.some((r) => r.line === l))
          ) {
            return record;
          }

          throw new Error(
            "getPotentialOptionTable: 옵션 등급 설정 확률의 행 개수가 3개가 아님",
          );
        }),
    ),
  getGradeUpData: potentialProcedure
    .input(
      z.object({
        method: Potential.resetMethodSchema,
        grade: Potential.gradeSchema,
      }),
    )
    .query(
      flow(
        ({ input: { method, grade } }) =>
          TE.tryCatch(
            () =>
              prisma.potentialGradeUpRecord
                .findFirstOrThrow({
                  where: {
                    method,
                    currentGrade: grade,
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
      ),
    ),
  log: {
    calc: {
      option: loggingProcedure
        .input(
          z.object({
            methods: z.array(Potential.resetMethodSchema),
            grade: Potential.gradeSchema,
            equip: equipSchema,
            optionSets: z.array(Potential.optionSetSchema),
            level: z.number(),
          }),
        )
        .mutation(
          async ({
            input: { level, methods, optionSets, logVersion, ...resetInput },
          }) => {
            await taskEitherToPromise(
              lokiLogger.info(
                {
                  message: {
                    ...resetInput,
                    methods,
                    optionSets,
                    equipLevel: level,
                  },
                  labels: {
                    logVersion,
                    key: "Potential-Calc-Option",
                  },
                },
                ...methods.map((method) => ({
                  message: {
                    method,
                  },
                  labels: {
                    logVersion,
                    key: "Potential-Calc-Option-Method",
                  },
                })),
                ...optionSets.flatMap((optionSet) =>
                  pipe(
                    keys(optionSet),
                    A.uniq(string.Eq),
                    A.map((key) => ({
                      message: {
                        stat: key,
                      },
                      labels: {
                        logVersion,
                        key: "Potential-Calc-Option-Stat",
                      },
                    })),
                  ),
                ),
              ),
            );
          },
        ),
      gradeUp: loggingProcedure
        .input(
          z.object({
            methods: z.array(Potential.resetMethodSchema),
            grade: Potential.gradeSchema,
            miracleTime: z.boolean().default(false),
          }),
        )
        .mutation(
          async ({ input: { methods, grade, miracleTime, logVersion } }) => {
            await taskEitherToPromise(
              lokiLogger.info(
                {
                  message: { grade, methods, miracleTime },
                  labels: {
                    logVersion,
                    key: "Potential-Calc-GradeUp",
                  },
                },
                ...methods.map((method) => ({
                  message: { method },
                  labels: {
                    logVersion,
                    key: "Potential-Calc-GradeUp-Method",
                  },
                })),
              ),
            );
          },
        ),
    },
  },
});
