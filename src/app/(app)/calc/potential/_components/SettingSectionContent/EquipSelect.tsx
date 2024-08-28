"use client";

import { useSelector } from "@xstate/react";

import { PotentialCalcRootMachineContext } from "~/app/(app)/calc/potential/_lib/machines/contexts";
import { equips } from "~/entities/equip";
import { S } from "~/shared/ui";

export const EquipSelect = () => {
  const inputActorRef = PotentialCalcRootMachineContext.useSelector(
    ({ context }) => context.inputActorRef,
  );

  const equip = useSelector(inputActorRef, ({ context }) => context.equip);
  const disabled = useSelector(
    inputActorRef,
    ({ value }) => value === "locked",
  );

  return (
    <S.Select
      label="장비 종류"
      isDisabled={disabled}
      onChange={(e) => {
        inputActorRef.send({
          type: "SET_EQUIP",
          value: e.target.value,
        });
      }}
      selectedKeys={[equip]}
    >
      {equips.map((equip) => (
        <S.SelectItem key={equip} value={equip}>
          {equip}
        </S.SelectItem>
      ))}
    </S.Select>
  );
};
