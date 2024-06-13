"use client";

import { useAtomValue } from "jotai";

import { bonusStatCalcAtoms } from "~/app/calc/bonus-stat/_lib";

export const ConvertedStat = () => {
  const statSum = useAtomValue(bonusStatCalcAtoms.simulatedStatSum);

  return (
    <p className="text-center">
      <span className="mr-1 text-3xl font-bold text-primary-400">
        {Math.round(statSum * 10000) / 10000}
      </span>
      급
    </p>
  );
};
