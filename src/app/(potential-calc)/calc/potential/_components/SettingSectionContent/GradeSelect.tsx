"use client";

import { useMolecule } from "bunshi/react";
import { useAtom } from "jotai";

import { PotentialCalcMolecule } from "~/app/(potential-calc)/calc/potential/_lib/molecules";
import { Potential } from "~/entities/potential";
import { S } from "~/shared/ui";

export const GradeSelect = () => {
  const { gradeAtom } = useMolecule(PotentialCalcMolecule);
  const [grade, setGrade] = useAtom(gradeAtom);

  return (
    <S.Select
      label="잠재능력 등급"
      onChange={(e) => {
        setGrade(e.target.value);
      }}
      selectedKeys={[grade]}
    >
      {Potential.grades.map((grade) => (
        <S.SelectItem key={grade} value={grade}>
          {Potential.gradeLabels[grade]}
        </S.SelectItem>
      ))}
    </S.Select>
  );
};
