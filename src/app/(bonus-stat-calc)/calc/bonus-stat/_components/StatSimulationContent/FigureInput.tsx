"use client";

import { pipe } from "fp-ts/lib/function";
import { useAtom, useAtomValue } from "jotai";

import { bonusStatCalcAtoms } from "~/app/(bonus-stat-calc)/calc/bonus-stat/_lib";
import { type BonusStat } from "~/entities/bonus-stat";
import { effectiveStatLabels } from "~/entities/stat";
import { O } from "~/shared/fp";
import { convertToNumber } from "~/shared/number";
import { cx } from "~/shared/style";
import { S } from "~/shared/ui";

interface Props {
  stat: BonusStat.PossibleStat;
}

export const FigureInput = ({ stat }: Props) => {
  const [figure, setFigure] = useAtom(
    bonusStatCalcAtoms.simulatedStatFigure(stat),
  );
  const efficiency = useAtomValue(bonusStatCalcAtoms.statEfficiency(stat));

  return (
    <S.Input
      label={effectiveStatLabels[stat]}
      labelPlacement="outside"
      placeholder=" "
      defaultValue={figure?.toString()}
      onValueChange={(v) => {
        setFigure(pipe(convertToNumber(v), O.toUndefined));
      }}
      color={efficiency != null ? "primary" : undefined}
      classNames={{
        label: cx(efficiency != null && "font-bold"),
        input: cx(efficiency != null && "font-bold"),
      }}
    />
  );
};
