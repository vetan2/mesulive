import { pipe } from "fp-ts/lib/function";
import { useAtom } from "jotai";

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

export const FigureInput = ({ stat }: Props) => {
  const [figure, setFigure] = useAtom(
    bonusStatCalcAtoms.simulatedStatFigure(stat),
  );

  return (
    <S.Input
      label={effectiveStatLabels[stat]}
      labelPlacement="outside"
      placeholder=" "
      defaultValue={figure?.toString()}
      onValueChange={(v) => {
        setFigure(pipe(convertToNumber(v), O.toUndefined));
      }}
      color={figure != null ? "primary" : undefined}
      classNames={{ label: cx(figure != null && "font-bold") }}
    />
  );
};
