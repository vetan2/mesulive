"use client";

import { useSelector } from "@xstate/react";

import { PotentialCalcRootMachineContext } from "~/app/(app)/calc/potential/_lib/machines/contexts";
import { Potential } from "~/entities/potential";
import { S } from "~/shared/ui";

export const GradeSelect = () => {
  const inputActorRef = PotentialCalcRootMachineContext.useSelector(
    ({ context }) => context.inputActorRef,
  );

  const grade = useSelector(inputActorRef, ({ context }) => context.grade);
  const disabled = useSelector(
    inputActorRef,
    ({ value }) => value === "locked",
  );

  return (
    <S.Select
      label="잠재능력 등급"
      isDisabled={disabled}
      onChange={(e) => {
        inputActorRef.send({
          type: "SET_GRADE",
          value: e.target.value,
        });
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
