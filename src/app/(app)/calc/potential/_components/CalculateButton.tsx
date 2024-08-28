"use client";

import { useMolecule } from "bunshi/react";
import { identity, pipe } from "fp-ts/lib/function";
import { useAtomValue } from "jotai";

import { PotentialCalcMolecule } from "~/app/(app)/calc/potential/_lib/molecules";
import { E } from "~/shared/fp";
import { cx } from "~/shared/style";
import { S } from "~/shared/ui";

interface Props {
  className?: string;
}

export const CalculateButton = ({ className }: Props) => {
  const { inputStatusAtom } = useMolecule(PotentialCalcMolecule);
  const inputStatus = useAtomValue(inputStatusAtom);

  return (
    <S.Tooltip
      content={pipe(
        inputStatus,
        E.match(identity, () => undefined),
      )}
      isDisabled={E.isRight(inputStatus)}
    >
      <S.Button
        size="lg"
        color={E.isLeft(inputStatus) ? "default" : "primary"}
        className={cx("font-bold", className)}
        isDisabled={E.isLeft(inputStatus)}
      >
        계산하기
      </S.Button>
    </S.Tooltip>
  );
};
