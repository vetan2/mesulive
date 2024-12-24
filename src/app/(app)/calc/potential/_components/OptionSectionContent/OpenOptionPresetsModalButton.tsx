"use client";

import { useMolecule } from "bunshi/react";
import { List } from "lucide-react";
import { overlay } from "overlay-kit";

import { PotentialCalcMolecule } from "~/app/(app)/calc/potential/_lib/molecules";
import { S } from "~/shared/ui";

import { OptionPresetsModal } from "./OptionPresetsModal";

export const OpenOptionPresetsModalButton = () => {
  const molecule = useMolecule(PotentialCalcMolecule);

  return (
    <S.Button
      size="sm"
      onPress={() => {
        overlay.open(({ isOpen, close, unmount }) => (
          <OptionPresetsModal
            isOpen={isOpen}
            onClose={close}
            onExit={unmount}
            molecule={molecule}
          />
        ));
      }}
      className="ml-2 w-20"
      variant="shadow"
      color="secondary"
    >
      <List className="size-4" /> 프리셋
    </S.Button>
  );
};
