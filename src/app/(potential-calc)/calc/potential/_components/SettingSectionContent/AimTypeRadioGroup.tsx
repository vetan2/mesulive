"use client";

import { useMolecule } from "bunshi/react";
import { useAtom } from "jotai";

import { PotentialCalcMolecule } from "~/app/(potential-calc)/calc/potential/_lib/molecules";
import { Potential } from "~/entities/potential";
import { cx } from "~/shared/style";
import { Radio, RadioGroup } from "~/shared/ui";

interface Props {
  className?: string;
}

export const AimTypeRadioGroup = ({ className }: Props) => {
  const { aimTypeAtom } = useMolecule(PotentialCalcMolecule);
  const [aimType, setAimType] = useAtom(aimTypeAtom);

  return (
    <RadioGroup
      label="목표 타입"
      className={cx(className)}
      size="sm"
      onValueChange={(value) => {
        setAimType(value);
      }}
      value={aimType}
    >
      {Potential.aimTypes.map((aimType) => (
        <Radio key={aimType} value={aimType}>
          {Potential.aimTypeLabels[aimType]}
        </Radio>
      ))}
    </RadioGroup>
  );
};
