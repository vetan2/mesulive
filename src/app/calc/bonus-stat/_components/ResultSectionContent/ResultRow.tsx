import { pipe } from "fp-ts/lib/function";
import { ArrowRightLeftIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { P, match } from "ts-pattern";

import { BonusStat } from "~/entities/bonus-stat";
import { O } from "~/shared/fp";
import { maxFractionDigits, useTopPctCost } from "~/shared/math";
import { convertToNumber, putUnit } from "~/shared/number";
import { cx } from "~/shared/style";
import { S, SectionSubtitle } from "~/shared/ui";

const MAX_FRAC_DIGITS = 4;

interface Props {
  method: BonusStat.ResetMethod;
  prob?: number;
}

export const ResultRow = ({ method, prob }: Props) => {
  const { meanCost, meanTopPct, getCostFromTopPct, getTopPctFromCost } =
    useTopPctCost({ type: "Bernoulli", probability: prob ?? -1 });
  const [cost, setCost] = useState("");
  const [topPct, setTopPct] = useState("");

  useEffect(() => {
    setCost(
      pipe(
        O.fromNullable(meanCost),
        O.map(maxFractionDigits(0)),
        O.match(() => "", String),
      ),
    );
    setTopPct(
      pipe(
        O.fromNullable(meanTopPct),
        O.map(maxFractionDigits(MAX_FRAC_DIGITS)),
        O.match(() => "", String),
      ),
    );
  }, [meanCost, meanTopPct]);

  return (
    <div className="relative">
      <SectionSubtitle>{BonusStat.resetMethodLabels[method]}</SectionSubtitle>
      <p className="text-sm font-semibold text-default-500">
        확률:{" "}
        {match(prob)
          .with(undefined, () => "")
          .otherwise((prob) => `${maxFractionDigits(8)(prob * 100)}%`)}
      </p>
      <p className="text-sm font-semibold text-default-500">
        평균:{" "}
        {match({ prob, meanCost })
          .with(
            { meanCost: P.nonNullable },
            ({ meanCost }) =>
              `${meanCost.toLocaleString()}회 (상위 ${pipe(meanCost, getTopPctFromCost, (v) => v ?? 0, maxFractionDigits(2))}%)`,
          )
          .otherwise(() => "")}
      </p>
      <div className="mt-2 flex items-start gap-2">
        <S.Input
          classNames={{ base: cx("flex-1") }}
          type="number"
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
                O.map(getCostFromTopPct),
                O.chain(O.fromNullable),
                O.map(maxFractionDigits(0)),
                O.match(() => "", String),
              ),
            );
          }}
        />
        <ArrowRightLeftIcon className="size-6 text-default-500" />
        <S.Input
          classNames={{ base: cx("flex-1") }}
          type="number"
          endContent={
            <span className="break-keep text-sm font-bold text-default-500">
              회
            </span>
          }
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
                O.map(getTopPctFromCost),
                O.chain(O.fromNullable),
                O.map(maxFractionDigits(MAX_FRAC_DIGITS)),
                O.match(() => "", String),
              ),
            );
          }}
          description={pipe(
            cost,
            convertToNumber,
            O.filter((v) => v >= 10000),
            O.map(putUnit),
            O.getOrElse(() => "ㅤ"),
          )}
        />
      </div>
      {method === "ABYSS" && (
        <div className="absolute inset-0 h-full w-full bg-white/50" />
      )}
    </div>
  );
};
