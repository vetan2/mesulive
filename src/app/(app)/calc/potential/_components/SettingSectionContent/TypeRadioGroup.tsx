"use client";

import { useSelector } from "@xstate/react";

import { PotentialCalcRootMachineContext } from "~/app/(app)/calc/potential/_lib/machines/contexts";
import { Potential } from "~/entities/potential";
import { cx } from "~/shared/style";
import { S } from "~/shared/ui";

interface Props {
  className?: string;
}

export const TypeRadioGroup = ({ className }: Props) => {
  const inputActorRef = PotentialCalcRootMachineContext.useSelector(
    ({ context }) => context.inputActorRef,
  );

  const type = useSelector(inputActorRef, ({ context }) => context.type);
  const disabled = useSelector(
    inputActorRef,
    ({ value }) => value === "locked",
  );

  return (
    <S.RadioGroup
      label="잠재능력 타입"
      isDisabled={disabled}
      className={cx(className)}
      size="sm"
      onValueChange={(value) => {
        inputActorRef.send({
          type: "SET_TYPE",
          value,
        });
      }}
      value={type}
    >
      {Potential.types.map((type) => (
        <S.Radio key={type} value={type}>
          {Potential.typeLabels[type]}
        </S.Radio>
      ))}
    </S.RadioGroup>
  );
};
