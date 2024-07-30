"use client";

import { useAtom } from "jotai";
import { useEffect } from "react";

import { bonusStatCalcAtoms } from "~/app/(app)/calc/bonus-stat/_lib";
import { BreakPoint, useBreakPoint } from "~/shared/style/breakPoint";
import { S } from "~/shared/ui";

import { StatSimulationContent } from "./StatSimulationContent";

export const StatSimulationModal = () => {
  const breakPoint = useBreakPoint();

  const [isOpen, setIsOpen] = useAtom(
    bonusStatCalcAtoms.isStatSimulationModalOpen,
  );

  useEffect(() => {
    if (breakPoint >= BreakPoint.lg) {
      setIsOpen(false);
    }
  }, [breakPoint, setIsOpen]);

  return (
    <S.Modal
      isOpen={isOpen}
      onClose={() => {
        setIsOpen(false);
      }}
    >
      <S.ModalContent>
        <S.ModalHeader>스탯 환산치 계산</S.ModalHeader>
        <S.ModalBody className="pb-6">
          <StatSimulationContent />
        </S.ModalBody>
      </S.ModalContent>
    </S.Modal>
  );
};
