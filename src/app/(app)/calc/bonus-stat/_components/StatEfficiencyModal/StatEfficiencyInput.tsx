"use client";

import { pipe } from "fp-ts/lib/function";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useState } from "react";

import { bonusStatCalcAtoms } from "~/app/(app)/calc/bonus-stat/_lib";
import { type BonusStat } from "~/entities/bonus-stat";
import { effectiveStatLabels } from "~/entities/stat";
import { E, O } from "~/shared/fp";
import { convertToNumber } from "~/shared/number";
import { cx } from "~/shared/style";
import { S } from "~/shared/ui";
import { getFirstZodErrorMessage } from "~/shared/zod";

interface Props {
  stat: BonusStat.PossibleStat;
}

export const StatEfficiencyInput = ({ stat }: Props) => {
  const [inputValue, setInputValue] = useState("");
  const [efficiency, setEfficiency] = useAtom(
    bonusStatCalcAtoms.statEfficiency(stat),
  );
  const efficiencyParseResult = useAtomValue(
    bonusStatCalcAtoms.statEfficiencyParseResult(stat),
  );
  const efficiencyErrorMessage = pipe(
    efficiencyParseResult,
    E.match(getFirstZodErrorMessage, () => undefined),
  );
  const isTouched = efficiency != null;

  useEffect(() => {
    setInputValue((prev) =>
      pipe(
        O.Do,
        O.apS("efficiency", convertToNumber(efficiency)),
        O.apS("numberPrev", convertToNumber(prev)),
        O.match(
          () => efficiency?.toString() ?? "",
          ({ efficiency, numberPrev }) =>
            efficiency !== numberPrev ? efficiency.toString() : prev,
        ),
      ),
    );
  }, [efficiency]);

  return (
    <S.Input
      label={effectiveStatLabels[stat]}
      labelPlacement="outside"
      placeholder=" "
      value={inputValue}
      onValueChange={(v) => {
        setInputValue(v);
        setEfficiency(pipe(convertToNumber(v), O.toUndefined));
      }}
      type="number"
      isInvalid={isTouched && E.isLeft(efficiencyParseResult)}
      errorMessage={isTouched && efficiencyErrorMessage}
      color={isTouched ? "primary" : undefined}
      classNames={{ label: cx(isTouched && "font-bold") }}
    />
  );
};
