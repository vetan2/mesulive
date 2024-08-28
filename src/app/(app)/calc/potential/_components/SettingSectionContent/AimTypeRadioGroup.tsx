"use client";

import { useSelector } from "@xstate/react";

import { PotentialCalcRootMachineContext } from "~/app/(app)/calc/potential/_lib/machines/contexts";
import { Potential } from "~/entities/potential";
import { cx } from "~/shared/style";
import { S } from "~/shared/ui";

interface Props {
  className?: string;
}

export const AimTypeRadioGroup = ({ className }: Props) => {
  const inputActorRef = PotentialCalcRootMachineContext.useSelector(
    ({ context }) => context.inputActorRef,
  );

  const aimType = useSelector(inputActorRef, ({ context }) => context.aimType);
  const disabled = useSelector(
    inputActorRef,
    ({ value }) => value === "locked",
  );

  return (
    <S.RadioGroup
      label="목표 타입"
      isDisabled={disabled}
      className={cx(className)}
      size="sm"
      onValueChange={(value) => {
        inputActorRef.send({
          type: "SET_AIM_TYPE",
          value,
        });
      }}
      value={aimType}
    >
      {Potential.aimTypes.map((aimType) => (
        <S.Radio key={aimType} value={aimType}>
          {Potential.aimTypeLabels[aimType]}
        </S.Radio>
      ))}
    </S.RadioGroup>
  );
};
