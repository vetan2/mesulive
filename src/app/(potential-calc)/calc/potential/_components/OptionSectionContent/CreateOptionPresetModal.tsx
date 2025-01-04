import { Input } from "@nextui-org/react";
import { pipe } from "fp-ts/lib/function";
import { useAtomValue } from "jotai";
import { useAtomCallback } from "jotai/utils";
import { useCallback, useState } from "react";

import { type PotentialCalcMoleculeStructure } from "~/app/(potential-calc)/calc/potential/_lib/molecules";
import { Potential } from "~/entities/potential";
import { Button, DefaultModal } from "~/shared/ui";
import { type ModalProps } from "~/shared/ui/Modal";

interface Props extends Pick<ModalProps, "isOpen" | "onClose" | "onExit"> {
  molecule: PotentialCalcMoleculeStructure;
}

export const CreateOptionPresetModal = ({ molecule, ...props }: Props) => {
  const [name, setName] = useState("");
  const {
    optionPresetsAtom,
    addOptionPresetAtom,
    optionSetFormAtom,
    currentOptionPresetAtom,
  } = molecule;
  const optionPresets = useAtomValue(optionPresetsAtom);

  const handleClick = useAtomCallback(
    useCallback(
      (get, set, name: string) => {
        const newPreset = {
          name,
          optionSets: pipe(
            get(optionSetFormAtom),
            Potential.refineOptionSetForm,
            Potential.convertRefinedOptionSetFormToOptionSetForm,
          ),
        };

        set(addOptionPresetAtom, newPreset);
        set(currentOptionPresetAtom, newPreset);
      },
      [addOptionPresetAtom, currentOptionPresetAtom, optionSetFormAtom],
    ),
  );

  const isInvalid = optionPresets.some((preset) => preset.name === name);
  const isEmpty = name === "";

  return (
    <DefaultModal {...props} title="새 프리셋으로 저장">
      <Input
        label="프리셋 이름"
        placeholder="프리셋 이름을 입력해주세요."
        value={name}
        onValueChange={setName}
        isInvalid={isInvalid}
        errorMessage="이미 존재하는 이름입니다."
      />
      <div className="flex gap-2">
        <Button
          onPress={() => {
            props.onClose?.();
          }}
          variant="flat"
          color="secondary"
        >
          취소
        </Button>
        <Button
          onPress={() => {
            handleClick(name);
            props.onClose?.();
          }}
          isDisabled={isInvalid || isEmpty}
          color="secondary"
        >
          저장
        </Button>
      </div>
    </DefaultModal>
  );
};
