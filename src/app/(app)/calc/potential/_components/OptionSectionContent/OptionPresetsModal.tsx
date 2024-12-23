"use client";

import { pipe } from "fp-ts/lib/function";
import { useAtomValue, useSetAtom } from "jotai";
import { useAtomCallback } from "jotai/utils";
import { Pencil, X } from "lucide-react";
import { overlay } from "overlay-kit";
import { Fragment, useCallback, useState, type ComponentProps } from "react";

import { type PotentialCalcMoleculeStructure } from "~/app/(app)/calc/potential/_lib/molecules";
import { Potential } from "~/entities/potential";
import { effectiveStatLabels } from "~/entities/stat";
import { type AtomValue } from "~/shared/jotai";
import { entries } from "~/shared/object";
import { DefaultModal, S } from "~/shared/ui";
import { type ModalProps } from "~/shared/ui/Modal";

interface Props extends Omit<ComponentProps<typeof S.Modal>, "children"> {
  molecule: PotentialCalcMoleculeStructure;
}

export const OptionPresetsModal = ({ molecule, ...props }: Props) => {
  const optionPresets = useAtomValue(molecule.optionPresetsAtom);
  const editOptionPreset = useSetAtom(molecule.editOptionPresetAtom);
  const applyOptionPreset = useSetAtom(molecule.applyOptionPresetAtom);
  const removeOptionPreset = useSetAtom(molecule.removeOptionPresetAtom);
  const adjustOptionSets = useAtomCallback(
    useCallback(
      (get, set) => {
        set(molecule.adjustOptionSetsAtom, get(molecule.possibleOptionIdsAtom));
      },
      [molecule.adjustOptionSetsAtom, molecule.possibleOptionIdsAtom],
    ),
  );

  return (
    <S.Modal size="xl" className="max-h-[80%] min-h-[40%]" {...props}>
      <S.ModalContent className="flex flex-col">
        <S.ModalHeader>옵션 프리셋</S.ModalHeader>
        <S.ModalBody className="gap-2 overflow-auto pb-6">
          {optionPresets.length > 0 ? (
            optionPresets.map((preset) => (
              <div
                key={preset.name}
                className="relative flex items-start rounded-2xl border-1 border-default-200 p-3 shadow-sm"
              >
                <div className="flex-1">
                  <p className="text-start text-base">{preset.name}</p>
                  <p className="p-0 text-start text-sm text-default-500">
                    {pipe(
                      preset.optionSets,
                      Potential.refineOptionSetForm,
                      Potential.convertRefinedOptionSetFormToOptionSets({
                        concatALL: false,
                      }),
                      (sets) =>
                        sets.map((set) =>
                          entries(set)
                            .map(
                              ([key, value]) =>
                                `${effectiveStatLabels[key]}: ${value}`,
                            )
                            .join(" / "),
                        ),
                    ).map((str, index) => (
                      <Fragment key={index}>
                        {str}
                        <br />
                      </Fragment>
                    ))}
                  </p>
                </div>
                <div className="md:flex">
                  <S.Button
                    className="w-full"
                    color="secondary"
                    variant="solid"
                    onPress={() => {
                      overlay.open(({ isOpen, close, unmount }) => (
                        <DefaultModal
                          isOpen={isOpen}
                          onClose={close}
                          onExit={unmount}
                          title="옵션 프리셋 적용"
                        >
                          <div className="flex flex-col items-center">
                            <p>다음 프리셋을 적용하시겠습니까?</p>
                            <b>{preset.name}</b>
                          </div>
                          <div className="flex gap-2">
                            <S.Button
                              onPress={() => {
                                close();
                              }}
                              color="secondary"
                              size="md"
                              variant="flat"
                              className="mt-2"
                            >
                              취소
                            </S.Button>
                            <S.Button
                              onPress={() => {
                                applyOptionPreset(preset.name);
                                adjustOptionSets();
                                close();
                                props.onClose?.();
                              }}
                              color="secondary"
                              size="md"
                              className="mt-2"
                            >
                              적용
                            </S.Button>
                          </div>
                        </DefaultModal>
                      ));
                    }}
                  >
                    적용하기
                  </S.Button>
                  <div className="mt-2 md:ml-2 md:mt-0 md:flex">
                    <S.Button
                      className=""
                      radius="md"
                      size="md"
                      isIconOnly
                      color="secondary"
                      variant="flat"
                      onPress={() => {
                        overlay.open(({ isOpen, close, unmount }) => (
                          <EditNameModal
                            optionPresets={optionPresets}
                            isOpen={isOpen}
                            onClose={close}
                            onExit={unmount}
                            originalName={preset.name}
                            onConfirm={(newName) => {
                              editOptionPreset(preset.name, {
                                ...preset,
                                name: newName,
                              });
                            }}
                          />
                        ));
                      }}
                    >
                      <Pencil className="size-5" />
                    </S.Button>
                    <S.Button
                      className="ml-2"
                      radius="md"
                      size="md"
                      isIconOnly
                      color="danger"
                      variant="flat"
                      onPress={() => {
                        overlay.open(({ isOpen, close, unmount }) => (
                          <DefaultModal
                            isOpen={isOpen}
                            onClose={close}
                            onExit={unmount}
                            title="옵션 프리셋 삭제"
                          >
                            <div className="flex flex-col items-center">
                              <p>다음 프리셋을 삭제하시겠습니까?</p>
                              <b>{preset.name}</b>
                            </div>
                            <div className="flex gap-2">
                              <S.Button
                                onPress={() => {
                                  close();
                                }}
                                color="danger"
                                size="md"
                                variant="flat"
                                className="mt-2"
                              >
                                취소
                              </S.Button>
                              <S.Button
                                onPress={() => {
                                  removeOptionPreset(preset.name);
                                  close();
                                }}
                                color="danger"
                                size="md"
                                className="mt-2"
                              >
                                삭제
                              </S.Button>
                            </div>
                          </DefaultModal>
                        ));
                      }}
                    >
                      <X className="size-5" />
                    </S.Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-1 items-center justify-center text-center text-sm text-default-500">
              옵션 프리셋이 없습니다.
              <br />
              자주 사용하는 옵션 세트를 프리셋으로 저장해보세요!
            </div>
          )}
        </S.ModalBody>
      </S.ModalContent>
    </S.Modal>
  );
};

const EditNameModal = ({
  originalName,
  onConfirm,
  optionPresets,
  ...modalProps
}: Pick<ModalProps, "isOpen" | "onClose" | "onExit"> & {
  optionPresets: AtomValue<PotentialCalcMoleculeStructure["optionPresetsAtom"]>;
  originalName: string;
  onConfirm: (newName: string) => void;
}) => {
  const [newName, setNewName] = useState("");
  const isInvalid = optionPresets.some((preset) => preset.name === newName);

  return (
    <DefaultModal {...modalProps} title="프리셋 이름 편집">
      <S.Input
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        label="프리셋 이름"
        placeholder="새로운 프리셋 이름을 입력해주세요."
        errorMessage="이미 존재하는 이름입니다."
        isInvalid={isInvalid}
        className="w-full"
      />
      <S.Button
        onPress={() => {
          onConfirm(newName);
          modalProps.onClose?.();
        }}
        color="secondary"
        size="md"
        isDisabled={isInvalid}
      >
        저장
      </S.Button>
    </DefaultModal>
  );
};
