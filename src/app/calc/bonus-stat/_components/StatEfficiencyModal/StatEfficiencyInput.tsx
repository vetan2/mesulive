"use client";

import { pipe } from "fp-ts/lib/function";
import { useAtom, useAtomValue } from "jotai";

import { bonusStatCalcAtoms } from "~/app/calc/bonus-stat/_lib";
import { type BonusStat } from "~/entities/bonus-stat";
import { effectiveStatLabels } from "~/entities/stat";
import { O } from "~/shared/fp";
import { convertToNumber } from "~/shared/number";
import { cx } from "~/shared/style";
import { S } from "~/shared/ui";

interface Props {
  stat: BonusStat.PossibleStat;
}

export const StatEfficiencyInput = ({ stat }: Props) => {
  const [efficiency, setEfficiency] = useAtom(
    bonusStatCalcAtoms.statEfficiency(stat),
  );
  const efficiencyErrorMessage = useAtomValue(
    bonusStatCalcAtoms.statEfficiencyErrorMessage(stat),
  );
  const isTouched = efficiency != null;

  return (
    <S.Input
      label={effectiveStatLabels[stat]}
      labelPlacement="outside"
      placeholder=" "
      defaultValue={efficiency?.toString()}
      onValueChange={(v) => {
        setEfficiency(pipe(convertToNumber(v), O.toUndefined));
      }}
      type="number"
      isInvalid={isTouched && !!efficiencyErrorMessage}
      errorMessage={isTouched && efficiencyErrorMessage}
      color={isTouched ? "primary" : undefined}
      classNames={{ label: cx(isTouched && "font-bold") }}
    />
  );
};
