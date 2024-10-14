import { pipe } from "fp-ts/lib/function";
import { ArrowRightLeftIcon } from "lucide-react";
import NextImage from "next/image";
import { useRef, useState } from "react";
import { P, match } from "ts-pattern";

import { type PotentialCalcMoleculeStructure } from "~/app/(app)/calc/potential/_lib/molecules";
import { Potential } from "~/entities/potential";
import { getResetCost } from "~/entities/potential/utils";
import { O } from "~/shared/fp";
import { type AtomValue } from "~/shared/jotai";
import { maxFractionDigits, maxFractionDigitsString } from "~/shared/math";
import { TopPctCost } from "~/shared/math/geometricDistribution";
import { convertToNumber, putUnit } from "~/shared/number";
import { cx } from "~/shared/style";
import { S } from "~/shared/ui";

const MAX_FRAC_DIGITS = 4;

interface Props {
  result: AtomValue<PotentialCalcMoleculeStructure["resultAtom"]>[number];
  level: number;
  grade: Potential.Grade;
  className?: string;
}

export const ResultSection = ({ result, grade, level, className }: Props) => {
  const topPctCost = useRef(
    new TopPctCost({
      type: "Bernoulli",
      probability: result.prob,
      ceil: result.ceil,
    }),
  );

  const [cost, setCost] = useState<string>(() =>
    pipe(
      O.fromNullable(topPctCost.current.meanCost),
      O.map(maxFractionDigits(2)),
      O.map((v) =>
        match(result.method)
          .with(P.union("ADDI_POTENTIAL", "POTENTIAL"), () =>
            Math.round(
              v * getResetCost({ method: result.method, grade, level }),
            ),
          )
          .otherwise(() => v),
      ),
      O.match(() => "", String),
    ),
  );
  const [topPct, setTopPct] = useState<string>(() =>
    pipe(
      O.fromNullable(topPctCost.current.meanTopPct),
      O.map(maxFractionDigits(MAX_FRAC_DIGITS)),
      O.match(() => "", String),
    ),
  );

  return (
    <div className={cx("flex flex-col gap-3", className)}>
      <div
        className={cx(
          match(result.method)
            .with("ADDI", () => cx("text-addiCube"))
            .with("ADDI_POTENTIAL", () => cx("text-addiPotential"))
            .with("ARTISAN", () => cx("text-artisanCube"))
            .with("MASTER", () => cx("text-masterCube"))
            .with("POTENTIAL", () => cx("text-potential"))
            .with("RED", () => cx("text-redCube"))
            .with("STRANGE", () => cx("text-strangeCube"))
            .with("STRANGE_ADDI", () => cx("text-strangeAddiCube"))
            .otherwise(() => ""),
        )}
      >
        <div className="flex gap-2">
          <NextImage
            src={Potential.resetMethodImages[result.method]}
            width={24}
            alt={Potential.resetMethodLabels[result.method]}
          />
          <p className={cx("font-extrabold")}>
            {Potential.resetMethodLabels[result.method]}
          </p>
        </div>
        {result.ceil != null && (
          <p className="mt-1 italic">
            천장이 포함된 계산입니다. <b>(천장: {result.ceil}개)</b>
          </p>
        )}
      </div>
      <div>
        <b>1회 시행 시 목표 달성 확률</b>
        <p>{maxFractionDigitsString(10)(result.prob * 100)}%</p>
      </div>
      <div>
        <b>
          평균 (상위 {maxFractionDigits(2)(topPctCost.current.meanTopPct ?? 0)}
          %)
        </b>
        <p>{maxFractionDigits(2)(topPctCost.current.meanCost ?? 0)}회</p>
        <p>
          감정비용:{" "}
          {putUnit(
            Potential.getResetCost({ method: result.method, grade, level }) *
              Math.round(topPctCost.current.meanCost ?? 0),
          )}{" "}
          메소
        </p>
      </div>
      <div className="flex items-start gap-2">
        <S.Input
          classNames={{ base: cx("flex-1") }}
          type="number"
          value={topPct}
          onValueChange={(v) => {
            const converted = convertToNumber(v);

            setTopPct(
              pipe(
                converted,
                O.map(maxFractionDigits(MAX_FRAC_DIGITS)),
                O.match(() => "", String),
              ),
            );

            setCost(
              pipe(
                converted,
                O.map((v) => topPctCost.current.getCostFromTopPct(v)),
                O.chain(O.fromNullable),
                O.map(maxFractionDigits(0)),
                O.map((v) =>
                  match(result.method)
                    .with(
                      P.union("ADDI_POTENTIAL", "POTENTIAL"),
                      () =>
                        v *
                        getResetCost({ method: result.method, grade, level }),
                    )
                    .otherwise(() => v),
                ),
                O.match(() => "", String),
              ),
            );
          }}
          startContent={
            <span className="break-keep text-sm font-bold text-default-500">
              상위
            </span>
          }
          endContent={
            <span className="break-keep text-sm font-bold text-default-500">
              %
            </span>
          }
        />
        <ArrowRightLeftIcon className="mt-2 size-6 text-default-500" />
        <S.Input
          classNames={{ base: cx("flex-1") }}
          type="number"
          value={cost}
          onValueChange={(v) => {
            const converted = convertToNumber(v);

            setCost(
              pipe(
                converted,
                O.map(maxFractionDigits(0)),
                O.match(() => "", String),
              ),
            );

            setTopPct(
              pipe(
                converted,
                O.map((v) =>
                  match(result.method)
                    .with(P.union("ADDI_POTENTIAL", "POTENTIAL"), () =>
                      Math.ceil(
                        v /
                          getResetCost({ method: result.method, grade, level }),
                      ),
                    )
                    .otherwise(() => v),
                ),
                O.map((v) => topPctCost.current.getTopPctFromCost(v)),
                O.chain(O.fromNullable),
                O.map(maxFractionDigits(MAX_FRAC_DIGITS)),
                O.match(() => "", String),
              ),
            );
          }}
          endContent={
            <span className="break-keep text-sm font-bold text-default-500">
              {match(result.method)
                .with(P.union("ADDI_POTENTIAL", "POTENTIAL"), () => "메소")
                .otherwise(() => "회")}
            </span>
          }
          description={pipe(
            cost,
            convertToNumber,
            O.filter((v) => v >= 10000),
            O.map(putUnit),
            O.getOrElse(() => "ㅤ"),
          )}
        />
      </div>
    </div>
  );
};
