"use client";

import { useMolecule } from "bunshi/react";
import { useAtom, useAtomValue } from "jotai";

import { PotentialCalcMolecule } from "~/app/(potential-calc)/calc/potential/_lib/molecules";
import { Checkbox } from "~/shared/ui";

export const OtherSettings = () => {
  const { isMiracleTimeAtom, aimTypeAtom } = useMolecule(PotentialCalcMolecule);
  const aimType = useAtomValue(aimTypeAtom);
  const [isMiracleTime, setIsMiracleTime] = useAtom(isMiracleTimeAtom);

  return (
    <div>
      <p className="font-bold text-default-800">기타 설정</p>
      <Checkbox
        size="sm"
        isDisabled={aimType !== "GRADE_UP"}
        isSelected={isMiracleTime}
        onValueChange={(isSelected) => {
          setIsMiracleTime(isSelected);
        }}
      >
        미라클 타임
      </Checkbox>
    </div>
  );
};
