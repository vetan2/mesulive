"use client";

import { pipe } from "fp-ts/lib/function";
import { useAtom } from "jotai";
import { toPairs } from "lodash-es";

import { bonusStatCalcAtoms } from "~/app/calc/bonus-stat/_lib";
import { equipTypeLabels, equipTypeSchema } from "~/entities/equip";
import { O } from "~/shared/fp";
import { S } from "~/shared/ui";

export const EquipTypeSelect = () => {
  const [equipType, setEquipType] = useAtom(bonusStatCalcAtoms.equipType);

  return (
    <S.Select
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
        <S.SelectItem key={value} value={value}>
          {label}
        </S.SelectItem>
      ))}
    </S.Select>
  );
};
