"use client";

import { useMolecule } from "bunshi/react";
import { identity, pipe } from "fp-ts/lib/function";
import { useAtom } from "jotai";
import { useState } from "react";

import { StarforceSimulatorMolecule } from "~/app/(starforce-simulator)/sim/starforce/_lib/molecule";
import { E } from "~/shared/fp";
import { S } from "~/shared/ui";

export const EquipLevelInput = () => {
  const [touched, setTouched] = useState(false);

  const { levelAtom } = useMolecule(StarforceSimulatorMolecule);
  const [level, setLevel] = useAtom(levelAtom);
  const errorMessage = pipe(
    level.value,
    E.match(identity, () => undefined),
  );

  return (
    <S.Input
      label="장비 레벨"
      type="number"
      value={level.input}
      onValueChange={(value) => {
        setTouched(true);
        setLevel(value);
      }}
      onBlur={() => {
        setTouched(true);
      }}
      isInvalid={touched && !!errorMessage}
      errorMessage={touched && errorMessage}
    />
  );
};
