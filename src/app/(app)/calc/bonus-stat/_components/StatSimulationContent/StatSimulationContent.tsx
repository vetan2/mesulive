import { BonusStat } from "~/entities/bonus-stat";

import { ConvertedStat } from "./ConvertedStat";
import { FigureInput } from "./FigureInput";

export const StatSimulationContent = () => {
  return (
    <div>
      <ConvertedStat />
      <div className="mt-4 grid grid-cols-2 gap-4 last:odd:*:col-span-full">
        {BonusStat.possibleStats.map((stat) => (
          <FigureInput stat={stat} key={stat} />
        ))}
      </div>
    </div>
  );
};
