import { Button, Checkbox, Input } from "@nextui-org/react";

export const SettingSectionContent = () => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4 *:last:odd:col-span-2">
        <Input />
        <Checkbox />
        <Input />
        {/* <Select /> */}
        <Input />
      </div>
      <Button />
    </>
  );
};
