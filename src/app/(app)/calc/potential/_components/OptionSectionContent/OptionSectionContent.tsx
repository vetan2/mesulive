"use client";

import { useMolecule } from "bunshi/react";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { RESET } from "jotai/utils";
import { Plus, RefreshCcw } from "lucide-react";
import { useMemo } from "react";

import { PotentialCalcMolecule } from "~/app/(app)/calc/potential/_lib/molecules";
import { S } from "~/shared/ui";

import { OptionRecordsSetting } from "./OptionRecordsSetting";

interface Props {
  className?: string;
}

export const OptionSectionContent = ({ className }: Props) => {
  const { optionSetsAtom, addOptionSetAtom } = useMolecule(
    PotentialCalcMolecule,
  );
  const setOptionSets = useSetAtom(optionSetsAtom);
  const optionSetsLengthAtom = useMemo(
    () => atom((get) => get(optionSetsAtom).length),
    [optionSetsAtom],
  );
  const optionSetsLength = useAtomValue(optionSetsLengthAtom);
  const addOptionSet = useSetAtom(addOptionSetAtom);

  return (
    <div className={className}>
      <S.Button
        size="sm"
        onClick={() => {
          addOptionSet();
        }}
        color="primary"
        className="w-20"
      >
        <Plus className="size-4" /> 추가
      </S.Button>
      <S.Button
        size="sm"
        onClick={() => {
          setOptionSets(RESET);
        }}
        className="ml-2 w-20"
        variant="flat"
        color="primary"
      >
        <RefreshCcw className="size-4" /> 초기화
      </S.Button>
      <div className="mt-3 flex flex-col gap-3">
        {Array.from({ length: optionSetsLength }).map((_, i) => (
          <OptionRecordsSetting key={i} index={i} />
        ))}
      </div>
    </div>
  );
};
