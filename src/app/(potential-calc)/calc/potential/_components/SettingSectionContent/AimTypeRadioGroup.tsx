"use client";

import { useMolecule } from "bunshi/react";
import { useAtom } from "jotai";

import { PotentialCalcMolecule } from "~/app/(potential-calc)/calc/potential/_lib/molecules";
import { Potential } from "~/entities/potential";
import { cx } from "~/shared/style";
import { S } from "~/shared/ui";

interface Props {
  className?: string;
}

export const AimTypeRadioGroup = ({ className }: Props) => {
  const { aimTypeAtom } = useMolecule(PotentialCalcMolecule);
  const [aimType, setAimType] = useAtom(aimTypeAtom);

  return (
    <S.RadioGroup
      label="목표 타입"
      className={cx(className)}
      size="sm"
      onValueChange={(value) => {
        setAimType(value);
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
