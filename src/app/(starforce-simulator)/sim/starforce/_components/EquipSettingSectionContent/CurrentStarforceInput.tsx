"use client";

import { useMolecule } from "bunshi/react";
import { identity, pipe } from "fp-ts/lib/function";
import { useAtom } from "jotai";

import { StarforceSimulatorMolecule } from "~/app/(starforce-simulator)/sim/starforce/_lib/molecule";
import { E } from "~/shared/fp";
import { S } from "~/shared/ui";

export const CurrentStarforceInput = () => {
  const { currentStarforceAtom } = useMolecule(StarforceSimulatorMolecule);
  const [currentStarforce, setLevel] = useAtom(currentStarforceAtom);
  const errorMessage = pipe(
    currentStarforce.value,
    E.match(identity, () => undefined),
  );

  return (
    <S.Input
      label="현재 스타포스"
      type="number"
      value={currentStarforce.input}
      onValueChange={(value) => {
        setLevel(value);
      }}
      isInvalid={!!errorMessage}
      errorMessage={errorMessage}
      description="빈칸이면 0성으로 계산합니다."
    />
  );
};
