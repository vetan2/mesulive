"use client";

import { useMolecule } from "bunshi/react";
import { List } from "lucide-react";
import { overlay } from "overlay-kit";

import { PotentialCalcMolecule } from "~/app/(potential-calc)/calc/potential/_lib/molecules";
import { Button } from "~/shared/ui";

import { OptionPresetsModal } from "./OptionPresetsModal";

export const OpenOptionPresetsModalButton = () => {
  const molecule = useMolecule(PotentialCalcMolecule);

  return (
    <Button
      size="sm"
      onPress={() => {
        gtag("event", "potential_calc", {
          action: "Open Option Presets Modal",
        });
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
    </Button>
  );
};
