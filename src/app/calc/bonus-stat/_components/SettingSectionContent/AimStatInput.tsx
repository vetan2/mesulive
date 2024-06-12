"use client";

import { type InputProps } from "@nextui-org/react";
import { pipe } from "fp-ts/lib/function";
import { useAtom, useAtomValue } from "jotai";

import { bonusStatCalcAtoms } from "~/app/calc/bonus-stat/_lib";
import { O } from "~/shared/fp";
import { convertToNumber } from "~/shared/number";
import { S } from "~/shared/ui";

interface Props extends Pick<InputProps, "classNames"> {}

export const AimStatInput = ({ classNames }: Props) => {
  const [aimStat, setAimStat] = useAtom(bonusStatCalcAtoms.aimStat);
  const aimStatErrorMessage = useAtomValue(
    bonusStatCalcAtoms.aimStatErrorMessage,
  );
  const isTouched = aimStat != null;

  return (
    <S.Input
      classNames={classNames}
      label="목표 추가옵션 값"
      type="number"
      onValueChange={(v) => {
        setAimStat(
          pipe(
            convertToNumber(v),
            O.getOrElseW(() => undefined),
          ),
        );
      }}
      defaultValue={aimStat?.toString() || undefined}
      isInvalid={isTouched && !!aimStatErrorMessage}
      errorMessage={isTouched && aimStatErrorMessage}
    />
  );
};
