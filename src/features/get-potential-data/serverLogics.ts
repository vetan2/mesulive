import "server-only";

import { type Prisma } from "@prisma/client";
import { record } from "fp-ts";
import { flow, pipe } from "fp-ts/lib/function";
import { type Option } from "fp-ts/lib/Option";
import { JSDOM } from "jsdom";

import { equips, type Equip } from "~/entities/equip";
import { Potential } from "~/entities/potential";
import { gradesEnableToPromote } from "~/entities/potential/constants";
import { E, O, TE } from "~/shared/fp";
import { taskEitherToPromise } from "~/shared/function";
import { IntervalQueue } from "~/shared/intervalQueue";
import { convertToNumber, percentStringToNumber } from "~/shared/number";
import { entries } from "~/shared/object";
import { prisma } from "~/shared/prisma";

import { cubeItemIds, gradeUrls } from "./constants";
import {
  type OptionTable,
  type GradeUpRecord,
  type RawOptionTable,
} from "./types";

const fetchQueue = new IntervalQueue(100);

export const findNewVersion = TE.tryCatch(
  () =>
    prisma.potentialDataVersion.findFirst().then(
      flow(
        O.fromNullable,
        O.chain(({ gameVersion, appVersion }) =>
          gameVersion !== appVersion ? O.some(gameVersion) : O.none,
        ),
      ),
    ),
  E.toError,
);

export const emptyDB = TE.tryCatch(
  async () =>
    prisma.$transaction([
      prisma.potentialOptionRecord.deleteMany(),
      prisma.potentialOption.deleteMany(),
      prisma.potentialOptionRecordList.deleteMany(),
      prisma.potentialOptionTable.deleteMany(),
      prisma.potentialGradeUpRecord.deleteMany(),
    ]),
  E.toError,
);

export const updateDataVersion = TE.tryCatchK(
  (params: { version: number }) =>
    prisma.$transaction(async (tx) => {
      await taskEitherToPromise(emptyDB);
      await tx.potentialDataVersion.deleteMany();
      await tx.potentialDataVersion.create({
        data: {
          gameVersion: params.version,
          appVersion: params.version,
        },
      });
    }),
  E.toError,
);

export const resetDatabaseIfGameVersionAhead = pipe(
  TE.Do,
  TE.apS("newVersion", findNewVersion),
  TE.chain(
    TE.tryCatchK(async ({ newVersion }) => {
      if (O.isSome(newVersion)) {
        return prisma.$transaction(async () => {
          await taskEitherToPromise(emptyDB);
          await taskEitherToPromise(
            updateDataVersion({ version: newVersion.value }),
          );
        });
      }
    }, E.toError),
  ),
);

export const fetchOptionDataFromOfficial = TE.tryCatchK(
  async (params: {
    method: Potential.ResetMethod;
    equip: Equip;
    level: number;
    grade: Potential.Grade;
  }): Promise<RawOptionTable> => {
    const body = new URLSearchParams(
      pipe(
        {
          nCubeItemID: cubeItemIds[params.method],
          nGrade: Potential.grades.findIndex((v) => v === params.grade) + 1,
          nPartsType: equips.findIndex((v) => v === params.equip) + 1,
          nReqLev: params.level,
        },
        record.map(String),
      ),
    );

    const html = await // fetchQueue.enqueue(() =>
    fetch(
      "https://maplestory.nexon.com/Guide/OtherProbability/cube/GetSearchProbList",
      {
        headers: {
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          "x-requested-with": "XMLHttpRequest",
        },
        body: body.toString(),
        method: "POST",
      },
      // ),
    )
      .then((r) => {
        console.log(
          "fetchOptionData",
          params,
          new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" }),
          r.status,
        );
        return r;
      })
      .then((r) => r.text());

    // console.table(body);
    const dom = new JSDOM(html);

    return [".cube_data._1", ".cube_data._2", ".cube_data._3"].map(
      (selector) => {
        const table = dom.window.document.querySelector(selector);
        const tbody = table?.querySelector("tbody");
        const trs = tbody?.querySelectorAll("tr");

        return Array.from(trs ?? []).map((tr) => {
          const tds = tr.querySelectorAll("td");
          const optionName = tds[0].textContent ?? "";

          let stat: Potential.PossibleStat | undefined;
          let figure: number | undefined;

          const probability = pipe(
            tds[1].textContent || "",
            percentStringToNumber(6),
            O.getOrElse(() => 0),
          );

          for (const [_stat, regex] of entries(Potential.possibleStatRegexes)) {
            const match = optionName.match(regex);

            if (match) {
              stat = _stat;
              figure = pipe(
                O.fromNullable(match[1]),
                O.chain(convertToNumber),
                O.toUndefined,
              );
              break;
            }
          }

          return {
            optionName,
            probability,
            stat,
            figure,
          };
        });
      },
    );
  },
  E.toError,
);

export const createPotentialOptionTable = TE.tryCatchK(
  (params: {
    equip: Equip;
    method: Potential.ResetMethod;
    grade: Potential.Grade;
    level: number;
    optionTable: RawOptionTable;
  }): Promise<OptionTable> =>
    prisma.potentialOptionTable
      .create({
        data: {
          method: params.method,
          equip: params.equip,
          level: params.level,
          grade: params.grade,
          optionTable: {
            create: params.optionTable.map((record) => ({
              records: {
                create: record.map(
                  ({ optionName, probability, stat, figure }) => ({
                    probability,
                    option: {
                      connectOrCreate: {
                        where: {
                          name: optionName,
                        },
                        create: {
                          name: optionName,
                          figure,
                          stat,
                        },
                      },
                    },
                  }),
                ),
              },
            })),
          },
        },
        include: {
          optionTable: {
            include: {
              records: {
                include: {
                  option: true,
                },
              },
            },
          },
        },
      })
      .then(optionTablePayloadToOptionTable),
  E.toError,
);

export const getPotentialOptionTable = (
  params: Parameters<typeof fetchOptionDataFromOfficial>[0],
) =>
  pipe(
    fetchOptionDataFromOfficial(params),
    TE.chain((table) =>
      createPotentialOptionTable({ ...params, optionTable: table }),
    ),
  );

const optionTablePayloadToOptionTable = (
  payload: Prisma.PotentialOptionTableGetPayload<{
    include: {
      optionTable: {
        include: {
          records: {
            include: {
              option: true;
            };
          };
        };
      };
    };
  }>,
): OptionTable =>
  payload.optionTable.map(({ records }) =>
    records.map(({ option: { stat, figure, name }, probability }) => ({
      name,
      probability,
      stat: pipe(
        O.fromNullable(stat),
        O.map(Potential.possibleStatsSchema.parse),
        O.toUndefined,
      ),
      figure: figure ?? undefined,
    })),
  );

export const findOptionTable = TE.tryCatchK(
  (params: {
    equip: Equip;
    method: Potential.ResetMethod;
    grade: Potential.Grade;
    level: number;
  }): Promise<Option<OptionTable>> =>
    prisma.potentialOptionTable
      .findFirst({
        where: {
          method: params.method,
          equip: params.equip,
          level: params.level,
          grade: params.grade,
        },
        include: {
          optionTable: {
            include: {
              records: {
                include: {
                  option: true,
                },
              },
            },
          },
        },
      })
      .then((v) => v)
      .then(flow(O.fromNullable, O.map(optionTablePayloadToOptionTable))),
  E.toError,
);

export const fetchOptionIdNameMap = TE.tryCatchK(
  (params: { optionIds: number[] }) =>
    prisma.potentialOption.findMany({
      where: {
        id: {
          in: params.optionIds,
        },
      },
      select: {
        id: true,
        name: true,
      },
    }),
  E.toError,
);

export const fetchGradeUpRecords = TE.tryCatchK(
  async (params: {
    method: Potential.ResetMethod;
  }): Promise<Map<Potential.Grade, GradeUpRecord>> => {
    const html = await fetchQueue.enqueue(() =>
      fetch(gradeUrls[params.method]).then((r) => r.text()),
    );
    const dom = new JSDOM(html);

    const cubeInfoTable = dom.window.document.querySelectorAll(".cube_info");

    const probabilityTable = cubeInfoTable?.[0];
    const probabilityTbody = probabilityTable?.querySelector("tbody");
    const probabilityTrs = probabilityTbody?.querySelectorAll("tr");

    const ceilTable = cubeInfoTable?.[1];
    const ceilTbody = ceilTable?.querySelector("tbody");
    const ceilTrs = ceilTbody?.querySelectorAll("tr");

    return new Map(
      gradesEnableToPromote[params.method].map((currentGrade, i) => {
        const probabilityTr = probabilityTrs?.[i];
        const probabilityTds = probabilityTr?.querySelectorAll("td");

        const ceilTr = ceilTrs?.[(params.method === "ADDI" ? 3 : 0) + i];
        const ceilTds = ceilTr?.querySelectorAll("td");

        const probability = pipe(
          probabilityTds?.[probabilityTds.length - 1]?.textContent ?? "",
          percentStringToNumber(12),
          O.getOrElse(() => 0),
        );

        const ceil = pipe(
          ceilTds?.[ceilTds.length - 1]?.textContent ?? "",
          convertToNumber,
          O.toUndefined,
        );

        return [
          currentGrade,
          {
            probability,
            ceil,
          },
        ] as const;
      }),
    );
  },
  E.toError,
);

export const findGradeUpRecord = TE.tryCatchK(
  (params: {
    method: Potential.ResetMethod;
    currentGrade: Potential.Grade;
  }): Promise<Option<GradeUpRecord>> =>
    prisma.potentialGradeUpRecord
      .findFirst({
        where: {
          method: params.method,
          currentGrade: params.currentGrade,
        },
        select: {
          probability: true,
          ceil: true,
        },
      })
      .then(
        flow(
          O.fromNullable,
          O.map(({ probability, ceil }) => ({
            probability,
            ceil: ceil ?? undefined,
          })),
        ),
      ),
  E.toError,
);

export const createGradeUpRecords = TE.tryCatchK(
  (params: {
    method: Potential.ResetMethod;
    recordMap: Map<Potential.Grade, GradeUpRecord>;
  }) =>
    prisma.potentialGradeUpRecord.createMany({
      data: Array.from(params.recordMap.entries()).map(
        ([currentGrade, record]) => ({
          method: params.method,
          currentGrade,
          probability: record.probability,
          ceil: record.ceil,
        }),
      ),
    }),
  E.toError,
);
