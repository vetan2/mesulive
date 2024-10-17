import chalk from "chalk";
import { readonlyArray } from "fp-ts";
import { log } from "fp-ts/lib/Console";
import { flow, pipe } from "fp-ts/lib/function";

import { equips, type Equip } from "~/entities/equip";
import { Potential } from "~/entities/potential";
import { flattenLevel } from "~/entities/potential/utils";
import {
  createPotentialOptionTable,
  fetchGradePage,
  fetchOptionDataPage,
  getGradeUpRecordsFromPage,
  getOptionGradeRecordsFromPage,
  getOptionRecordsFromPage,
} from "~/features/get-potential-data/serverLogics";
import { A, E, TE } from "~/shared/fp";
import { delay, taskEitherToPromise } from "~/shared/function";
import { prisma } from "~/shared/prisma";

const ERASE_CURRENT_LINE = "\u001b[2K\u001b[0G";

const consoleProgressBar =
  (step: number) => (title: string, progress: number, total: number) => {
    const refinedProgress = Math.floor((progress / total) * step);
    const percentage = Math.floor((progress / total) * 100);
    process.stdout.write(
      `\n${chalk.bold(title)} [${"#".repeat(refinedProgress)}${" ".repeat(step - refinedProgress)}] ${percentage}%`,
    );
  };
const consoleProgressBar50 = consoleProgressBar(50);

const prefetchGradeUp = ({ methods }: { methods: Potential.ResetMethod[] }) =>
  pipe(
    TE.tryCatch(
      () =>
        prisma
          .$transaction([
            prisma.potentialGradeUpRecord.deleteMany({
              where: {
                OR: methods.map((method) => ({ method })),
              },
            }),
            prisma.potentialOptionGradeRecord.deleteMany({
              where: {
                OR: methods.map((method) => ({ method })),
              },
            }),
          ])
          .then(log(`\n${chalk.red("Deleted")} ${methods.length} records`)),
      E.toError,
    ),
    TE.chain(() =>
      pipe(
        methods.map((method, i) =>
          pipe(
            TE.Do,
            TE.bind(
              "page",
              flow(
                () => fetchGradePage(method),
                TE.chainFirstIOK(() => () => {
                  process.stdout.write(
                    `${ERASE_CURRENT_LINE}${chalk.green("Fetched")} Grade Page of ${method}`,
                  );
                  consoleProgressBar50(
                    "Prefetch Grade Data",
                    i + 1,
                    methods.length,
                  );
                }),
              ),
            ),
            TE.bindW("gradeUpRecords", ({ page }) =>
              TE.of(getGradeUpRecordsFromPage(method)(page)),
            ),
            TE.bindW(
              "optionGradeRecords",
              flow(
                ({ page }) => getOptionGradeRecordsFromPage(method)(page),
                TE.fromEither,
              ),
            ),
            TE.chain(
              flow(
                TE.tryCatchK(
                  ({ gradeUpRecords, optionGradeRecords }) =>
                    prisma.$transaction([
                      prisma.potentialGradeUpRecord.createMany({
                        data: gradeUpRecords.map(
                          ({ ceil, currentGrade, probability }) => ({
                            method,
                            ceil,
                            currentGrade,
                            probability,
                          }),
                        ),
                      }),
                      prisma.potentialOptionGradeRecord.createMany({
                        data: optionGradeRecords.map(
                          ({
                            grade,
                            currentGradeProb,
                            line,
                            lowerGradeProb,
                          }) => ({
                            method,
                            grade,
                            currentGradeProb,
                            line,
                            lowerGradeProb,
                          }),
                        ),
                      }),
                    ]),
                  E.toError,
                ),
                TE.chainFirstIOK(() => () => {
                  process.stdout.write(
                    `${ERASE_CURRENT_LINE}${chalk.blue("Created")} ${method} GradeUp and OptionGrade records`,
                  );
                  consoleProgressBar50(
                    "Prefetch Grade Data",
                    i + 1,
                    methods.length,
                  );
                }),
              ),
            ),
            (te) => () =>
              Promise.all([te(), delay(100)]).then((results) => results[0]),
          ),
        ),
        TE.sequenceSeqArray,
        TE.chainFirstIOK(() => () => {
          process.stdout.write(`\n\n`);
        }),
      ),
    ),
  );

const prefetchOptionData = (
  params: {
    equip: Equip;
    level: number;
    optionGrade: Potential.OptionGrade;
    method: Potential.ResetMethod;
  }[],
) =>
  pipe(
    params.map(({ equip, level, optionGrade, method }, i) =>
      pipe(
        TE.tryCatch(
          () =>
            prisma.potentialOptionTable
              .findMany({
                where: {
                  method,
                  equip,
                  level,
                  optionGrade,
                },
                select: {
                  id: true,
                },
              })
              .then((results) =>
                Promise.all(
                  results.map(({ id }) =>
                    prisma.$transaction([
                      prisma.potentialOptionRecord.deleteMany({
                        where: {
                          potentialOptionTableId: id,
                        },
                      }),
                      prisma.potentialOptionTable.delete({
                        where: {
                          id,
                        },
                      }),
                    ]),
                  ),
                ),
              )
              .then((results) => {
                process.stdout.write(
                  `${ERASE_CURRENT_LINE}${equip} ${level} ${method} ${optionGrade} | ${chalk.red("Deleted")} original ${results.map(([{ count }]) => count + 1).reduce((acc, cur) => acc + cur, 0)} Records`,
                );
                consoleProgressBar50(
                  "Prefetch Option Data",
                  i + 1,
                  params.length,
                );
              }),
          E.toError,
        ),
        TE.chain(
          flow(
            () =>
              fetchOptionDataPage({
                method,
                equip,
                level,
                optionGrade,
              }),
            TE.chainFirstIOK(() => () => {
              process.stdout.write(
                `${ERASE_CURRENT_LINE}${equip} ${level} ${method} ${optionGrade} | ${chalk.green("Fetched")} Option Page`,
              );
              consoleProgressBar50(
                "Prefetch Option Data",
                i + 1,
                params.length,
              );
            }),
          ),
        ),
        TE.chain((dom) =>
          pipe(
            TE.Do,
            TE.bind("probWeight", () =>
              optionGrade === "NORMAL"
                ? TE.tryCatch(
                    () =>
                      prisma.potentialOptionGradeRecord
                        .findFirstOrThrow({
                          where: {
                            method,
                            line: 2,
                            grade: "RARE",
                          },
                          select: {
                            lowerGradeProb: true,
                          },
                        })
                        .then(({ lowerGradeProb }) => {
                          if (lowerGradeProb === null) {
                            throw new Error(
                              `lowerGradeProb is null: ${equip} ${level} ${method} ${optionGrade}`,
                            );
                          }
                          return 1 / lowerGradeProb;
                        }),
                    E.toError,
                  )
                : TE.of(undefined),
            ),
            TE.map(({ probWeight }) =>
              getOptionRecordsFromPage({ optionGrade, probWeight })(dom),
            ),
          ),
        ),
        TE.chain((records) =>
          createPotentialOptionTable({
            method,
            equip,
            level,
            optionGrade,
            optionRecords: records,
          }),
        ),
        TE.chainFirstIOK(
          ({ method, optionGrade, equip, level, optionRecords }) =>
            () => {
              process.stdout.write(
                `${ERASE_CURRENT_LINE}${equip} ${level} ${method} ${optionGrade} | ${chalk.blue("Created")} a Table Record and ${optionRecords.length} Option Records`,
              );
              consoleProgressBar50(
                "Prefetch Option Data",
                i + 1,
                params.length,
              );
            },
        ),
        (te) => () =>
          Promise.all([te(), delay(500 + Math.random() * 500)]).then(
            (results) => results[0],
          ),
      ),
    ),
    TE.sequenceSeqArray,
  );

false &&
  (await taskEitherToPromise(
    prefetchGradeUp({ methods: Potential.resetMethods }),
  ));

false &&
  (await taskEitherToPromise(
    prefetchOptionData(
      //=============== Equips ===============//
      readonlyArray.toArray(equips).flatMap((equip) =>
        pipe(
          //=============== Levels ===============//
          [
            9,
            ...Array.from({ length: 11 }).flatMap((_, i) => [
              (i + 1) * 10,
              (i + 1) * 10 + 9,
            ]),
            200,
            250,
          ],
          A.filterMap(flattenLevel),
        ).flatMap((level) =>
          //=============== Methods ===============//
          Potential.resetMethods
            .filter((method) => method !== "ADDI")
            .flatMap((method) =>
              //=============== OptionGrades ===============//
              (
                [
                  "NORMAL",
                  ...Potential.gradesEnableToReset[method],
                ] satisfies Potential.OptionGrade[]
              ).map((optionGrade) => ({
                equip,
                level,
                optionGrade,
                method,
              })),
            ),
        ),
      ),
    ),
  ));
