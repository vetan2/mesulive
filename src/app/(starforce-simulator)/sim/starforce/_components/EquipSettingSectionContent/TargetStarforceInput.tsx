"use client";

import { useMolecule } from "bunshi/react";
import { identity, pipe } from "fp-ts/lib/function";
import { useAtom } from "jotai";
import { useState } from "react";

import { StarforceSimulatorMolecule } from "~/app/(starforce-simulator)/sim/starforce/_lib/molecule";
import { E } from "~/shared/fp";
import { S } from "~/shared/ui";

export const TargetStarforceInput = () => {
  const [touched, setTouched] = useState(false);

  const { targetStarforceAtom } = useMolecule(StarforceSimulatorMolecule);
  const [targetStarforce, setTargetStarforce] = useAtom(targetStarforceAtom);
  const errorMessage = pipe(
    targetStarforce.value,
    E.match(identity, () => undefined),
  );

  return (
    <S.Input
      label="목표 스타포스"
      type="number"
      value={targetStarforce.input}
      onValueChange={(value) => {
        setTouched(true);
        setTargetStarforce(value);
      }}
      onBlur={() => {
        setTouched(true);
      }}
      isInvalid={touched && !!errorMessage}
      errorMessage={touched && errorMessage}
    />
  );
};
