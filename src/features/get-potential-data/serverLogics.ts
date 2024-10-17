import { record } from "fp-ts";
import { type Either } from "fp-ts/lib/Either";
import { flow, pipe } from "fp-ts/lib/function";
import { type Option } from "fp-ts/lib/Option";
import { JSDOM } from "jsdom";
import { match } from "ts-pattern";

import { equips, type Equip } from "~/entities/equip";
import { Potential } from "~/entities/potential";
import { flattenLevel } from "~/entities/potential/utils";
import { A, E, O, TE } from "~/shared/fp";
import { convertToNumber, percentStringToNumber } from "~/shared/number";
import { entries } from "~/shared/object";
import { prisma } from "~/shared/prisma";

import { cubeItemIds, gradeUrls } from "./constants";
import { type GradeUpRecord } from "./types";

export const fetchGradePage = TE.tryCatchK(
  (method: Potential.ResetMethod) =>
    fetch(gradeUrls[method])
      .then((r) => r.text())
      .then((html) => new JSDOM(html)),
  E.toError,
);

export const getGradeUpRecordsFromPage =
  (method: Potential.ResetMethod) => (dom: JSDOM) => {
    const cubeInfoTable = dom.window.document.querySelectorAll(".cube_info");

    const probabilityTable = cubeInfoTable?.[0];
    const probabilityTbody = probabilityTable?.querySelector("tbody");
    const probabilityTrs = probabilityTbody?.querySelectorAll("tr");

    const ceilTable = cubeInfoTable?.[1];
    const ceilTbody = ceilTable?.querySelector("tbody");
    const ceilTrs = ceilTbody?.querySelectorAll("tr");

    return Potential.gradesEnableToPromote[method].map((currentGrade, i) => {
      const probabilityTr = probabilityTrs?.[i];
      const probabilityTds = probabilityTr?.querySelectorAll("td");

      const ceilTr = ceilTrs?.[(method === "ADDI" ? 3 : 0) + i];
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

      return {
        currentGrade,
        probability,
        ceil,
      };
    });
  };

export const getOptionGradeRecordsFromPage =
  (method: Potential.ResetMethod) =>
  (
    dom: JSDOM,
  ): Either<
    Error,
    {
      grade: Potential.Grade;
      line: number;
      currentGradeProb: number;
      lowerGradeProb?: number;
    }[]
  > =>
    E.tryCatch(() => {
      const table = dom.window.document.querySelectorAll(".cube_grade");

      const probabilityTable = table?.[0];
      const probabilityTbody = probabilityTable?.querySelector("tbody");
      const probabilityTrs = probabilityTbody?.querySelectorAll("tr");

      if (!probabilityTable || !probabilityTbody || !probabilityTrs) {
        throw new Error("getGradeRecordsFromPage: 테이블이 존재하지 않음");
      }

      return Potential.gradesEnableToReset[method].flatMap((grade, i) =>
        pipe(
          pipe(
            Array.from({ length: probabilityTrs.length }).map(
              (_, j) =>
                probabilityTrs[j].querySelectorAll("td")[1 + 2 * i]
                  ?.textContent,
            ),
            A.filterMap(
              flow(O.fromNullable, O.chain(percentStringToNumber(6))),
            ),
          ),
          (arr) => {
            if (arr.length !== 5) {
              throw new Error(
                "getGradeRecordsFromPage: 옵션 등급 설정 확률의 행 개수가 5개가 아님",
              );
            }

            return arr;
          },
          (arr) =>
            [
              { line: 1, currentGradeProb: arr[0] },
              { line: 2, currentGradeProb: arr[1], lowerGradeProb: arr[2] },
              { line: 3, currentGradeProb: arr[3], lowerGradeProb: arr[4] },
            ].map((col) => ({
              grade,
              ...col,
            })),
        ),
      );
    }, E.toError);

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

export const fetchOptionDataPage = (params: {
  method: Potential.ResetMethod;
  equip: Equip;
  level: number;
  optionGrade: Potential.OptionGrade;
}) =>
  pipe(
    TE.Do,
    TE.apS(
      "flattenedLevel",
      TE.fromOption(() => new Error(`Invalid level: ${params.level}`))(
        flattenLevel(params.level),
      ),
    ),
    TE.bindW("body", ({ flattenedLevel }) =>
      TE.of(
        new URLSearchParams(
          pipe(
            {
              nCubeItemID: cubeItemIds[params.method],
              nGrade:
                Potential.grades.findIndex(
                  (v) =>
                    v ===
                    (params.optionGrade === "NORMAL"
                      ? "RARE"
                      : params.optionGrade),
                ) + 1,
              nPartsType: equips.findIndex((v) => v === params.equip) + 1,
              nReqLev: flattenedLevel,
            },
            record.map(String),
          ),
        ),
      ),
    ),
    TE.chainW(
      TE.tryCatchK(
        ({ body }) =>
          fetch(
            "https://maplestory.nexon.com/Guide/OtherProbability/cube/GetSearchProbList",
            {
              headers: {
                "content-type":
                  "application/x-www-form-urlencoded; charset=UTF-8",
                "x-requested-with": "XMLHttpRequest",
              },
              body: body.toString(),
              method: "POST",
            },
          )
            .then((r) => r.text())
            .then((html) => new JSDOM(html)),
        E.toError,
      ),
    ),
  );

export const getOptionRecordsFromPage =
  ({
    optionGrade,
    probWeight = 1,
  }: {
    optionGrade: Potential.OptionGrade;
    probWeight?: number;
  }) =>
  (dom: JSDOM) => {
    const firstLineTrs = Array.from(
      dom.window.document
        .querySelector(".cube_data._1")
        ?.querySelector("tbody")
        ?.querySelectorAll("tr") ?? [],
    );

    const trs = match(optionGrade)
      .with("NORMAL", () =>
        Array.from(
          dom.window.document
            .querySelector(".cube_data._2")
            ?.querySelector("tbody")
            ?.querySelectorAll("tr") ?? [],
        ).filter((_, i, arr) => i < arr.length - firstLineTrs.length),
      )
      .otherwise(() => firstLineTrs);

    return trs.map((tr) => {
      const tds = tr.querySelectorAll("td");
      const optionName = tds[0].textContent ?? "";

      let stat: Potential.PossibleStat | undefined;
      let figure: number | undefined;

      const probability = pipe(
        tds[1].textContent || "",
        percentStringToNumber(6),
        O.map((v) => v * probWeight),
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
  };

export const createPotentialOptionTable = TE.tryCatchK(
  (params: {
    equip: Equip;
    method: Potential.ResetMethod;
    optionGrade: Potential.OptionGrade;
    level: number;
    optionRecords: ReturnType<ReturnType<typeof getOptionRecordsFromPage>>;
  }) =>
    prisma.potentialOptionTable.create({
      data: {
        method: params.method,
        equip: params.equip,
        level: params.level,
        optionGrade: params.optionGrade,
        optionRecords: {
          create: params.optionRecords.map(
            ({ figure, optionName, probability, stat }) => ({
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
      },
      include: {
        optionRecords: true,
      },
    }),
  E.toError,
);

export const findPotentialOptionTable = flow(
  TE.tryCatchK(
    (params: {
      equip: Equip;
      method: Potential.ResetMethod;
      optionGrade: Potential.OptionGrade;
      level: number;
    }) =>
      prisma.potentialOptionTable.findFirstOrThrow({
        where: {
          equip: params.equip,
          level: params.level,
          optionGrade: params.optionGrade,
          method: params.method,
        },
        select: {
          optionRecords: {
            select: {
              name: true,
              figure: true,
              stat: true,
              id: true,
              probability: true,
            },
          },
        },
      }),
    E.toError,
  ),
  TE.map(({ optionRecords }) => optionRecords),
  TE.chainEitherK(
    E.tryCatchK(
      A.map(({ stat, ...others }) => ({
        ...others,
        stat: Potential.possibleStatsSchema.nullish().parse(stat),
      })),
      E.toError,
    ),
  ),
);
