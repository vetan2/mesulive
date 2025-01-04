"use client";

import { ModalBody, ModalContent } from "@nextui-org/react";
import { useAtom } from "jotai";

import { bonusStatCalcAtoms } from "~/app/(bonus-stat-calc)/calc/bonus-stat/_lib/atoms";
import { BonusStat } from "~/entities/bonus-stat";
import { Modal, ModalHeader } from "~/shared/ui";

import { StatEfficiencyInput } from "./StatEfficiencyInput";

export const StatEfficiencyModal = () => {
  const [isOpen, setIsOpen] = useAtom(
    bonusStatCalcAtoms.isStatEfficiencyModalOpen,
  );

  return (
    <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
      <ModalContent>
        <ModalHeader>스탯 효율 입력</ModalHeader>
        <ModalBody className="grid grid-cols-2 gap-4 pb-6 last:odd:*:col-span-full">
          {BonusStat.possibleStats.map((stat) => (
            <StatEfficiencyInput key={stat} stat={stat} />
          ))}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
