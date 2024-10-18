"use client";

import { useMolecule } from "bunshi/react";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { Plus } from "lucide-react";
import { useMemo } from "react";

import { PotentialCalcMolecule } from "~/app/(app)/calc/potential/_lib/molecules";
import { S } from "~/shared/ui";

import { OptionSetSetting } from "./OptionSetSetting";

interface Props {
  className?: string;
}

export const OptionSectionContent = ({ className }: Props) => {
  const { optionSetFormAtom, addOptionSetAtom } = useMolecule(
    PotentialCalcMolecule,
  );
  const optionSetsLengthAtom = useMemo(
    () => atom((get) => get(optionSetFormAtom).length),
    [optionSetFormAtom],
  );
  const optionSetsLength = useAtomValue(optionSetsLengthAtom);
  const addOptionSet = useSetAtom(addOptionSetAtom);

  return (
    <div className={className}>
      <div className="mt-3 flex flex-col gap-3">
        {Array.from({ length: optionSetsLength }).map((_, i) => (
          <OptionSetSetting key={i} index={i} />
        ))}
        <S.Button
          size="md"
          onClick={() => {
            addOptionSet();
          }}
          color="primary"
          className="w-full"
        >
          <Plus className="size-4" /> 추가
        </S.Button>
      </div>
    </div>
  );
};
