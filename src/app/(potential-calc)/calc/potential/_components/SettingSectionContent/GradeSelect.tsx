"use client";

import { SelectItem } from "@nextui-org/react";
import { useMolecule } from "bunshi/react";
import { useAtom } from "jotai";

import { PotentialCalcMolecule } from "~/app/(potential-calc)/calc/potential/_lib/molecules";
import { Potential } from "~/entities/potential";
import { Select } from "~/shared/ui";

export const GradeSelect = () => {
  const { gradeAtom } = useMolecule(PotentialCalcMolecule);
  const [grade, setGrade] = useAtom(gradeAtom);

  return (
    <Select
      label="잠재능력 등급"
      onChange={(e) => {
        setGrade(e.target.value);
      }}
      selectedKeys={[grade]}
    >
      {Potential.grades.map((grade) => (
        <SelectItem key={grade} value={grade}>
          {Potential.gradeLabels[grade]}
        </SelectItem>
      ))}
    </Select>
  );
};
