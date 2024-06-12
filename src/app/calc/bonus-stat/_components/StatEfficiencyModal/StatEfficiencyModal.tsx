"use client";

import { useAtom } from "jotai";

import { bonusStatCalcAtoms } from "~/app/calc/bonus-stat/_lib/atoms";
import { BonusStat } from "~/entities/bonus-stat";
import { S } from "~/shared/ui";

import { StatEfficiencyInput } from "./StatEfficiencyInput";

export const StatEfficiencyModal = () => {
  const [isOpen, setIsOpen] = useAtom(
    bonusStatCalcAtoms.isStatEfficiencyModalOpen,
  );

  return (
    <S.Modal isOpen={isOpen} onOpenChange={setIsOpen}>
      <S.ModalContent>
        <S.ModalHeader>스탯 효율 입력</S.ModalHeader>
        <S.ModalBody className="grid grid-cols-2 gap-4 pb-6 last:odd:*:col-span-full">
          {BonusStat.possibleStats.map((stat) => (
            <StatEfficiencyInput key={stat} stat={stat} />
          ))}
        </S.ModalBody>
      </S.ModalContent>
    </S.Modal>
  );
};
