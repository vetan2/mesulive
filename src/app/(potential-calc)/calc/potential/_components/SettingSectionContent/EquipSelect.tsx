"use client";

import { useMolecule } from "bunshi/react";
import { useAtom } from "jotai";

import { PotentialCalcMolecule } from "~/app/(potential-calc)/calc/potential/_lib/molecules";
import { equips } from "~/entities/equip";
import { S } from "~/shared/ui";

export const EquipSelect = () => {
  const { equipAtom } = useMolecule(PotentialCalcMolecule);
  const [equip, setEquip] = useAtom(equipAtom);

  return (
    <S.Select
      label="장비 종류"
      onChange={(e) => {
        setEquip(e.target.value);
      }}
      selectedKeys={[equip]}
    >
      {equips.map((equip) => (
        <S.SelectItem key={equip} value={equip}>
          {equip}
        </S.SelectItem>
      ))}
    </S.Select>
  );
};
