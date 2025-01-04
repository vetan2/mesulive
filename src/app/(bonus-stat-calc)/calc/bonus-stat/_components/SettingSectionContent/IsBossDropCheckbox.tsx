"use client";

import { useAtom } from "jotai";

import { bonusStatCalcAtoms } from "~/app/(bonus-stat-calc)/calc/bonus-stat/_lib";
import { cx } from "~/shared/style";
import { Checkbox } from "~/shared/ui";

export const IsBossDropCheckbox = () => {
  const [isBossDrop, setIsBossDrop] = useAtom(bonusStatCalcAtoms.isBossDrop);

  return (
    <Checkbox
      classNames={{
        base: cx("max-w-none justify-center"),
      }}
      onValueChange={setIsBossDrop}
      defaultSelected={isBossDrop}
    >
      보스 드랍
    </Checkbox>
  );
};
