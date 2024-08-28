"use client";

import { useSelector } from "@xstate/react";
import { identity, pipe } from "fp-ts/lib/function";
import { useCallback, useState } from "react";

import { PotentialCalcRootMachineContext } from "~/app/(app)/calc/potential/_lib/machines/contexts";
import { E } from "~/shared/fp";
import { S } from "~/shared/ui";

export const EquipLevelInput = () => {
  const inputActorRef = PotentialCalcRootMachineContext.useSelector(
    ({ context }) => context.inputActorRef,
  );
  const [touched, setTouched] = useState(false);

  const input = useSelector(
    inputActorRef,
    ({ context }) => context.level.input,
  );
  const errorMessage = useSelector(
    inputActorRef,
    useCallback(
      ({ context }) =>
        pipe(
          context.level.value,
          E.match(identity, () => undefined),
        ),
      [],
    ),
  );

  return (
    <S.Input
      label="장비 레벨"
      type="number"
      onValueChange={(value) => {
        setTouched(true);
        inputActorRef.send({ type: "SET_LEVEL", value });
      }}
      onBlur={() => {
        setTouched(true);
      }}
      isInvalid={touched && !!errorMessage}
      value={input}
      errorMessage={touched && errorMessage}
    />
  );
};
