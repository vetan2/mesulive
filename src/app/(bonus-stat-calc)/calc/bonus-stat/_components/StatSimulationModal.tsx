"use client";

import { ModalBody, ModalContent } from "@nextui-org/react";
import { useAtom } from "jotai";
import { useEffect } from "react";

import { bonusStatCalcAtoms } from "~/app/(bonus-stat-calc)/calc/bonus-stat/_lib";
import { BreakPoint, useBreakPoint } from "~/shared/style/breakPoint";
import { Modal, ModalHeader } from "~/shared/ui";

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
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setIsOpen(false);
      }}
    >
      <ModalContent>
        <ModalHeader>스탯 환산치 계산</ModalHeader>
        <ModalBody className="pb-6">
          <StatSimulationContent />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
