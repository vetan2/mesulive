import { CurrentStarforceInput } from "./CurrentStarforceInput";
import { EquipLevelInput } from "./EquipLevelInput";
import { SpareCostInput } from "./SpareCostInput";
import { TargetStarforceInput } from "./TargetStarforceInput";

export const EquipSettingSectionContent = () => {
  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-4">
      <EquipLevelInput />
      <SpareCostInput />
      <CurrentStarforceInput />
      <TargetStarforceInput />
    </div>
  );
};
