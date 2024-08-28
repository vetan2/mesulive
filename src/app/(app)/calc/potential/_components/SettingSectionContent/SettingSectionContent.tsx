import { AimTypeRadioGroup } from "./AimTypeRadioGroup";
import { EquipLevelInput } from "./EquipLevelInput";
import { EquipSelect } from "./EquipSelect";
import { GradeSelect } from "./GradeSelect";
import { ResetMethodCheckboxGroup } from "./ResetMethodCheckboxGroup";
import { TypeRadioGroup } from "./TypeRadioGroup";

export const SettingSectionContent = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <EquipSelect />
        <EquipLevelInput />
      </div>
      <GradeSelect />
      <div className="flex gap-4">
        <AimTypeRadioGroup className="flex-1" />
        <TypeRadioGroup className="flex-1" />
      </div>
      <ResetMethodCheckboxGroup />
    </div>
  );
};
