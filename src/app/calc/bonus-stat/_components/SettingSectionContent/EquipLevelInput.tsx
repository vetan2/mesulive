"use client";

import { pipe } from "fp-ts/lib/function";
import { useAtom, useAtomValue } from "jotai";

import { bonusStatCalcAtoms } from "~/app/calc/bonus-stat/_lib";
import { O } from "~/shared/fp";
import { convertToNumber } from "~/shared/number";
import { S } from "~/shared/ui";

export const EquipLevelInput = () => {
  const [equipLevel, setEquipLevel] = useAtom(bonusStatCalcAtoms.equipLevel);
  const equipLevelErrorMessage = useAtomValue(
    bonusStatCalcAtoms.equipLevelErrorMessage,
  );
  const isTouched = equipLevel != null;

  return (
    <S.Input
      label="장비 레벨"
      type="number"
      onValueChange={(v) => {
        setEquipLevel(
          pipe(
            convertToNumber(v),
            O.getOrElseW(() => undefined),
          ),
        );
      }}
      isInvalid={isTouched && !!equipLevelErrorMessage}
      defaultValue={equipLevel?.toString() || undefined}
      errorMessage={isTouched && equipLevelErrorMessage}
    />
  );
};
