"use client";

import { useSelector } from "@xstate/react";
import { identity, pipe } from "fp-ts/lib/function";

import { PotentialCalcRootMachineContext } from "~/app/(app)/calc/potential/_lib/machines/contexts";
import { E } from "~/shared/fp";
import { cx } from "~/shared/style";
import { S } from "~/shared/ui";

interface Props {
  className?: string;
}

export const CalculateButton = ({ className }: Props) => {
  const inputActorRef = PotentialCalcRootMachineContext.useSelector(
    ({ context }) => context.inputActorRef,
  );

  const inputStatus = useSelector(
    inputActorRef,
    ({ context }) => context.inputStatus,
  );

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
