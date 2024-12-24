"use client";

import { type ComponentProps } from "react";

import { type PotentialCalcMoleculeStructure } from "~/app/(app)/calc/potential/_lib/molecules";
import { S } from "~/shared/ui";

interface Props
  extends Omit<ComponentProps<typeof S.Modal>, "children">,
    Pick<
      PotentialCalcMoleculeStructure,
      "optionPresetsAtom" | "removeOptionPresetAtom"
    > {}

export const OptionPresetsModal = ({
  optionPresetsAtom,
  removeOptionPresetAtom,
  ...props
}: Props) => {
  return (
    <S.Modal size="2xl" className="h-4/5" {...props}>
      <S.ModalContent className="flex flex-col">
        <S.ModalHeader>옵션 프리셋</S.ModalHeader>
        <S.ModalBody className="flex h-0 flex-1 flex-row gap-4 pb-6 *:flex-1"></S.ModalBody>
      </S.ModalContent>
    </S.Modal>
  );
};
