"use client";

import { SelectItem } from "@nextui-org/react";
import { pipe } from "fp-ts/lib/function";
import { useAtom } from "jotai";
import { toPairs } from "lodash-es";

import { bonusStatCalcAtoms } from "~/app/(bonus-stat-calc)/calc/bonus-stat/_lib";
import { equipTypeLabels, equipTypeSchema } from "~/entities/equip";
import { O } from "~/shared/fp";
import { Select } from "~/shared/ui";

export const EquipTypeSelect = () => {
  const [equipType, setEquipType] = useAtom(bonusStatCalcAtoms.equipType);

  return (
    <Select
      label="장비 종류"
      disallowEmptySelection
      onChange={(e) => {
        setEquipType((prev) =>
          pipe(
            O.tryCatch(() => equipTypeSchema.parse(e.target.value)),
            O.getOrElse(() => prev),
          ),
        );
      }}
      defaultSelectedKeys={[equipType]}
    >
      {toPairs(equipTypeLabels).map(([value, label]) => (
        <SelectItem key={value} value={value}>
          {label}
        </SelectItem>
      ))}
    </Select>
  );
};
