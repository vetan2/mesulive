import NextImage from "next/image";
import { useRef } from "react";
import { match } from "ts-pattern";

import { type PotentialCalcMoleculeStructure } from "~/app/(app)/calc/potential/_lib/molecules";
import { Potential } from "~/entities/potential";
import { getRandomElements } from "~/shared/array";
import { type AtomValue } from "~/shared/jotai";
import { maxFractionDigitsString } from "~/shared/math";
import { cx } from "~/shared/style";

interface Props {
  result: AtomValue<PotentialCalcMoleculeStructure["resultAtom"]>[number];
  className?: string;
}

const MAX_DISPLAY_OPTIONS = 50;

export const OptionResultSection = ({ result, className }: Props) => {
  const resultOptions = useRef(
    (result.optionResults?.length ?? 0 > MAX_DISPLAY_OPTIONS)
      ? getRandomElements(MAX_DISPLAY_OPTIONS)(result.optionResults ?? [])
      : result.optionResults,
  );

  return (
    <div className={cx("flex flex-col gap-3", className)}>
      <div>
        <div
          className={cx(
            "flex gap-2",
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
          <NextImage
            src={Potential.resetMethodImages[result.method]}
            width={24}
            alt={Potential.resetMethodLabels[result.method]}
          />
          <p className={cx("font-extrabold")}>
            {Potential.resetMethodLabels[result.method]}
          </p>
        </div>
        {(result.optionResults?.length ?? 0) > 50 && (
          <p className="mt-1 text-sm text-default-600">
            조건을 만족하는 경우가 너무 많아 랜덤으로 50개를 표시합니다.
          </p>
        )}
      </div>
      {resultOptions.current?.map(({ options, prob }, i) => (
        <div key={i}>
          {[0, 1, 2].map((optionIndex) => (
            <div
              key={optionIndex}
              className={cx(
                "flex items-center gap-1",
                options.length <= optionIndex && "italic text-gray-400",
              )}
            >
              {options.length <= optionIndex
                ? `아무 ${optionIndex + 1}번째 옵션`
                : options[optionIndex].name}
            </div>
          ))}
          <p className="text-sm font-semibold text-default-500">
            {maxFractionDigitsString(10)(prob * 100)}%
          </p>
        </div>
      ))}
    </div>
  );
};
