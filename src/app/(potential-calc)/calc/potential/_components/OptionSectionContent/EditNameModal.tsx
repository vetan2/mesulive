"use client";

import { Input } from "@nextui-org/react";
import { useState } from "react";

import type { PotentialCalcMoleculeStructure } from "~/app/(potential-calc)/calc/potential/_lib/molecules";
import type { AtomValue } from "~/shared/jotai";
import { Button, DefaultModal } from "~/shared/ui";
import type { ModalProps } from "~/shared/ui/Modal";

export const EditNameModal = ({
  originalName,
  onConfirmAction,
  optionPresets,
  ...modalProps
}: Pick<ModalProps, "isOpen" | "onClose" | "onExit"> & {
  optionPresets: AtomValue<PotentialCalcMoleculeStructure["optionPresetsAtom"]>;
  originalName: string;
  onConfirmAction: (newName: string) => void;
}) => {
  const [newName, setNewName] = useState("");
  const isInvalid = optionPresets.some((preset) => preset.name === newName);
  const isEmpty = newName === "";

  return (
    <DefaultModal {...modalProps} title="프리셋 이름 편집">
      <Input
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        label="프리셋 이름"
        placeholder="새로운 프리셋 이름을 입력해주세요."
        errorMessage="이미 존재하는 이름입니다."
        isInvalid={isInvalid}
        className="w-full"
      />
      <div className="flex gap-2">
        <Button
          onPress={() => {
            modalProps.onClose?.();
          }}
          color="secondary"
          size="md"
          variant="flat"
        >
          취소
        </Button>
        <Button
          onPress={() => {
            onConfirmAction(newName);
            modalProps.onClose?.();
          }}
          color="secondary"
          size="md"
          isDisabled={isInvalid || isEmpty}
        >
          저장
        </Button>
      </div>
    </DefaultModal>
  );
};
