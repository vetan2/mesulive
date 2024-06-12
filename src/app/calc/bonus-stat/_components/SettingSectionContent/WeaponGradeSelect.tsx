"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { match } from "ts-pattern";

import { bonusStatCalcAtoms } from "~/app/calc/bonus-stat/_lib";
import { equipTypeSchema } from "~/entities/equip";
import { convertToNumber } from "~/shared/number";
import { S } from "~/shared/ui";

export const WeaponGradeSelect = () => {
  const equipType = useAtomValue(bonusStatCalcAtoms.equipType);
  const isBossDrop = useAtomValue(bonusStatCalcAtoms.isBossDrop);
  const setWeaponGrade = useSetAtom(bonusStatCalcAtoms.weaponGrade);

  return (
    <S.Select
      isDisabled={equipType !== equipTypeSchema.enum.WEAPON}
      label="무기 추옵 등급"
      defaultSelectedKeys={["none"]}
      onChange={(e) => {
        const value = e.target.value;

        if (value === "none") {
          setWeaponGrade("none");
          return;
        }

        setWeaponGrade((prev) =>
          match(convertToNumber(e.target.value))
            .with({ _tag: "Some" }, ({ value }) => value)
            .otherwise(() => prev),
        );
      }}
    >
      {[
        0,
        ...Array.from({ length: 5 })
          .map((_, i) => i + 1 + (isBossDrop ? 2 : 0))
          .reverse(),
      ].map((grade) => (
        <S.SelectItem key={grade || "none"} value={grade || undefined}>
          {grade ? `${8 - grade}추` : "선택안함"}
        </S.SelectItem>
      ))}
    </S.Select>
  );
};
