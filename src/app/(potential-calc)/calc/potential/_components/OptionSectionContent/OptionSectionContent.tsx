"use client";

import { Chip } from "@nextui-org/react";
import { useMolecule } from "bunshi/react";
import { pipe } from "fp-ts/lib/function";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { useAtomCallback } from "jotai/utils";
import { ListPlus, Pencil, Plus } from "lucide-react";
import { overlay } from "overlay-kit";
import { useCallback, useMemo } from "react";

import { useRegisterPossibleOptionIdsUpdate } from "~/app/(potential-calc)/calc/potential/_lib/hooks";
import { PotentialCalcMolecule } from "~/app/(potential-calc)/calc/potential/_lib/molecules";
import { Potential } from "~/entities/potential";
import { cx } from "~/shared/style";
import { Button, DefaultModal } from "~/shared/ui";

import { CreateOptionPresetModal } from "./CreateOptionPresetModal";
import { EditNameModal } from "./EditNameModal";
import { OptionSetSetting } from "./OptionSetSetting";

interface Props {
  className?: string;
}

export const OptionSectionContent = ({ className }: Props) => {
  const molecule = useMolecule(PotentialCalcMolecule);
  const {
    optionSetFormAtom,
    isOptionSetFormValidAtom,
    addOptionSetAtom,
    currentOptionPresetAtom,
    editOptionPresetAtom,
    optionPresetsAtom,
  } = molecule;
  const optionSetsLengthAtom = useMemo(
    () => atom((get) => get(optionSetFormAtom).length),
    [optionSetFormAtom],
  );
  const optionSetsLength = useAtomValue(optionSetsLengthAtom);
  const isOptionSetFormValid = useAtomValue(isOptionSetFormValidAtom);
  const currentOptionPreset = useAtomValue(currentOptionPresetAtom);

  const addOptionSet = useSetAtom(addOptionSetAtom);
  const openEditOptionPresetModal = useAtomCallback(
    useCallback(
      (get, set) => {
        const currentOptionPreset = get(currentOptionPresetAtom);

        if (currentOptionPreset?.name) {
          overlay.open(({ isOpen, close, unmount }) => (
            <DefaultModal
              isOpen={isOpen}
              onClose={close}
              onExit={unmount}
              title="프리셋 수정"
            >
              <div className="text-center">
                다음 프리셋을 수정합니다. <br />
                <b>{currentOptionPreset.name}</b> <br />
                계속하시겠습니까?
              </div>
              <div className="flex gap-2">
                <Button
                  onPress={() => {
                    close();
                  }}
                  variant="flat"
                  color="secondary"
                >
                  취소
                </Button>
                <Button
                  onPress={() => {
                    set(editOptionPresetAtom, currentOptionPreset.name, {
                      optionSets: pipe(
                        get(optionSetFormAtom),
                        Potential.refineOptionSetForm,
                        Potential.convertRefinedOptionSetFormToOptionSetForm,
                      ),
                      name: currentOptionPreset.name,
                    });
                    close();
                  }}
                  color="secondary"
                >
                  확인
                </Button>
              </div>
            </DefaultModal>
          ));
        }
      },
      [currentOptionPresetAtom, editOptionPresetAtom, optionSetFormAtom],
    ),
  );

  const openEditNameModal = useAtomCallback(
    useCallback(
      (get, set) => {
        const currentOptionPreset = get(currentOptionPresetAtom);

        if (currentOptionPreset?.name) {
          const optoinPresets = get(optionPresetsAtom);
          overlay.open(({ isOpen, close, unmount }) => (
            <EditNameModal
              isOpen={isOpen}
              onClose={close}
              onExit={unmount}
              originalName={currentOptionPreset.name}
              optionPresets={optoinPresets}
              onConfirmAction={(newName) => {
                set(editOptionPresetAtom, currentOptionPreset.name, {
                  ...currentOptionPreset,
                  name: newName,
                });
              }}
            />
          ));
        }
      },
      [currentOptionPresetAtom, editOptionPresetAtom, optionPresetsAtom],
    ),
  );

  useRegisterPossibleOptionIdsUpdate();

  return (
    <div className={className}>
      {currentOptionPreset && (
        <div className="flex">
          <Chip
            size="sm"
            color="secondary"
            variant="shadow"
            classNames={{ content: cx("font-semibold") }}
          >
            현재 프리셋:
            <span className="ml-1.5 font-bold">{currentOptionPreset.name}</span>
          </Chip>
          <Button
            size="sm"
            className="ml-1 h-6 w-6 min-w-fit"
            radius="md"
            isIconOnly
            variant="flat"
            color="secondary"
            onPress={() => {
              openEditNameModal();
            }}
          >
            <Pencil className="size-3" />
          </Button>
        </div>
      )}
      <div className="mt-3 flex flex-col gap-3">
        {Array.from({ length: optionSetsLength }).map((_, i) => (
          <OptionSetSetting key={i} index={i} />
        ))}
        <div className="flex w-full flex-col gap-2">
          <Button
            size="md"
            onPress={() => {
              addOptionSet();
            }}
            color="primary"
            className="w-full"
          >
            <Plus className="size-4" /> 옵션 세트 추가
          </Button>
          <div className="flex w-full flex-col gap-2 md:flex-row">
            <Button
              size="md"
              isDisabled={!isOptionSetFormValid}
              onPress={() => {
                if (isOptionSetFormValid) {
                  overlay.open(({ isOpen, close, unmount }) => (
                    <CreateOptionPresetModal
                      isOpen={isOpen}
                      onClose={close}
                      onExit={unmount}
                      molecule={molecule}
                    />
                  ));
                }
              }}
              color="secondary"
              className="w-full md:w-0 md:flex-1"
            >
              <ListPlus className="size-4" /> 새 프리셋으로 저장
            </Button>
            <Button
              size="md"
              onPress={() => {
                openEditOptionPresetModal();
              }}
              isDisabled={!currentOptionPreset || !isOptionSetFormValid}
              variant="flat"
              color="secondary"
              className="w-full md:w-0 md:flex-1"
            >
              <Pencil className="size-4" /> 현재 프리셋에 덮어쓰기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
