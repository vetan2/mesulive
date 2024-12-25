"use client";

import { useAtomValue, useSetAtom } from "jotai";

import { bonusStatCalcAtoms } from "~/app/(bonus-stat-calc)/calc/bonus-stat/_lib";
import { S } from "~/shared/ui";

export const OpenStatEfficiencyModalButton = () => {
  const setIsStatEfficiencyModalOpen = useSetAtom(
    bonusStatCalcAtoms.isStatEfficiencyModalOpen,
  );
  const isStatEfficiencyValid = useAtomValue(
    bonusStatCalcAtoms.isStatEfficiencyValid,
  );

  return (
    <div>
      <S.Button
        color={isStatEfficiencyValid ? "primary" : "danger"}
        className="mt-4 w-full"
        onPress={() => {
          setIsStatEfficiencyModalOpen(true);
        }}
      >
        스탯 효율 세팅
      </S.Button>
      {!isStatEfficiencyValid && (
        <p className="mt-1 text-center text-xs text-danger">
          스탯 효율이 올바르게 입력되지 않았습니다.
        </p>
      )}
    </div>
  );
};
