"use client";

import { useSetAtom } from "jotai";

import { bonusStatCalcAtoms } from "~/app/calc/bonus-stat/_lib";
import { S } from "~/shared/ui";

export const OpenStatEfficiencyModalButton = () => {
  const setIsStatEfficiencyModalOpen = useSetAtom(
    bonusStatCalcAtoms.isStatEfficiencyModalOpen,
  );

  return (
    <S.Button
      color="primary"
      className="mt-4 w-full"
      onClick={() => {
        setIsStatEfficiencyModalOpen(true);
      }}
    >
      스탯 효율 세팅
    </S.Button>
  );
};
