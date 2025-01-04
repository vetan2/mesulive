"use client";

import { Input } from "@nextui-org/react";
import { pipe } from "fp-ts/lib/function";
import { useAtom, useAtomValue } from "jotai";

import { bonusStatCalcAtoms } from "~/app/(bonus-stat-calc)/calc/bonus-stat/_lib";
import { E, O } from "~/shared/fp";
import { convertToNumber } from "~/shared/number";
import { getFirstZodErrorMessage } from "~/shared/zod";

export const EquipLevelInput = () => {
  const [equipLevel, setEquipLevel] = useAtom(bonusStatCalcAtoms.equipLevel);
  const equipLevelParseResult = useAtomValue(
    bonusStatCalcAtoms.equipLevelParseResult,
  );
  const equipLevelErrorMessage = pipe(
    equipLevelParseResult,
    E.match(getFirstZodErrorMessage, () => O.none),
    O.toUndefined,
  );
  const isTouched = equipLevel != null;

  return (
    <Input
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
      isInvalid={isTouched && E.isLeft(equipLevelParseResult)}
      defaultValue={equipLevel?.toString() || ""}
      errorMessage={isTouched && equipLevelErrorMessage}
    />
  );
};
