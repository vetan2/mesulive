"use client";

import { type InputProps } from "@nextui-org/react";
import { pipe } from "fp-ts/lib/function";
import { useAtom, useAtomValue } from "jotai";

import { bonusStatCalcAtoms } from "~/app/(app)/calc/bonus-stat/_lib";
import { E, O } from "~/shared/fp";
import { convertToNumber } from "~/shared/number";
import { S } from "~/shared/ui";
import { getFirstZodErrorMessage } from "~/shared/zod";

interface Props extends Pick<InputProps, "classNames"> {}

export const AimStatInput = ({ classNames }: Props) => {
  const [aimStat, setAimStat] = useAtom(bonusStatCalcAtoms.aimStat);
  const aimStatParseResult = useAtomValue(
    bonusStatCalcAtoms.aimStatParseResult,
  );
  const aimStatErrorMessage = pipe(
    aimStatParseResult,
    E.match(getFirstZodErrorMessage, () => undefined),
  );
  const equipType = useAtomValue(bonusStatCalcAtoms.equipType);
  const isTouched = aimStat != null;

  return (
    <S.Input
      classNames={classNames}
      label="목표 추가옵션 값"
      type="number"
      onValueChange={(v) => {
        setAimStat(pipe(convertToNumber(v), O.toUndefined));
      }}
      defaultValue={aimStat?.toString() || undefined}
      isInvalid={isTouched && E.isLeft(aimStatParseResult)}
      errorMessage={isTouched && aimStatErrorMessage}
      description={
        equipType === "WEAPON" &&
        "무기 공격력/마력 추옵에 대한 환산 스탯은 제외됩니다."
      }
      placeholder={equipType === "WEAPON" ? "0" : undefined}
    />
  );
};
